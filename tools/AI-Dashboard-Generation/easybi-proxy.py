#!/usr/bin/env python3
# =====================================================================
# EasyBI 本地代理（Python 版，零依赖）—— 绕过浏览器跨域(CORS)，让 demo 用上公司模型
# ---------------------------------------------------------------------
# 它做两件事：
#   1) 同源提供 demo 页面（index.html）
#   2) 把网页发来的模型请求转发到公司上游网关，并注入 key、补 CORS 头
# ---------------------------------------------------------------------
# 用法（Mac 自带 Python3 即可，无需安装）：
#   1) 复制 .env.example 为 .env.local，并填入 EASYBI_API_KEY
#   2) 运行：python3 easybi-proxy.py
#   3) 浏览器打开：http://localhost:8899
# =====================================================================
import http.server, socketserver, urllib.request, urllib.error, urllib.parse, json, os, subprocess, time, io, zipfile


BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def _load_env_file(path):
    """Tiny .env loader so this demo stays zero-dependency."""
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as f:
        for raw in f:
            line = raw.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key and key not in os.environ:
                os.environ[key] = value


def _env_int(name, default):
    try:
        return int(os.environ.get(name, default))
    except (TypeError, ValueError):
        return default


_load_env_file(os.path.join(BASE_DIR, ".env.local"))

CONFIG = {
    "PORT": _env_int("EASYBI_PORT", 8899),
    "HTML_FILE": os.path.join(BASE_DIR, "index.html"),

    # 上游“完整”接口地址：
    #   chat/completions 模型（DeepSeek 等）用 …/v1/chat/completions
    #   Responses 模型（GPT-5-codex 等）用 …/v1/responses
    "UPSTREAM_URL": os.environ.get("EASYBI_UPSTREAM_URL", "https://llm-gw.jd.com/v1/chat/completions"),

    # 上游鉴权格式：'openai'(Bearer) 或 'anthropic'(x-api-key)
    "UPSTREAM_FORMAT": os.environ.get("EASYBI_UPSTREAM_FORMAT", "openai"),

    # 上游接口风格：'chat'(Chat Completions) 或 'responses'(OpenAI Responses API)
    # 代理会把 demo 发来的 chat/completions 请求自动翻译成 responses，再把响应翻回来
    "UPSTREAM_API": os.environ.get("EASYBI_UPSTREAM_API", "chat"),

    # 在 .env.local 中配置，不要写进代码仓库。
    "API_KEY": os.environ.get("EASYBI_API_KEY", ""),

    # 模型标识。当前用 GPT-5.4(走 chat/completions)。
    # 可选(chat)：GPT-5.4-joybuilder / DeepSeek-V4-Flash / OxygenLLM-30B-A3B / DeepSeek-V3-2
    #      (responses)：GPT-5-codex-joybuilder —— 换它时把 UPSTREAM_URL 改回 …/v1/responses 且 UPSTREAM_API 改 'responses'
    "FORCE_MODEL": os.environ.get("EASYBI_FORCE_MODEL", "GPT-5.4-joybuilder"),

    # 遇到 503/429/5xx（服务器忙）自动退避重试的次数
    "RETRIES": _env_int("EASYBI_RETRIES", 4),

    # 转发前从请求体删掉这些参数（GPT-5 系列只允许 temperature=1，删掉走默认值最稳）
    "DROP_PARAMS": ["temperature", "top_p"],

    # 仅 responses 接口：给推理模型的输出 token 上限(含推理消耗，给足防截断)
    "RESP_MAX_OUTPUT": _env_int("EASYBI_RESP_MAX_OUTPUT", 6000),
    # 仅 responses 接口：推理强度 'minimal'/'low'/'medium'/'high'；越低越快、正文余量越大。
    # 若网关报参数错(失败量上涨)，把它设为 None 关掉。
    "RESP_REASONING_EFFORT": os.environ.get("EASYBI_RESP_REASONING_EFFORT", "low") or None,

    # GPT-5 系列会消耗少量 reasoning tokens；过低 max_tokens 可能 200 但正文为空。
    "CHAT_MIN_TOKENS": _env_int("EASYBI_CHAT_MIN_TOKENS", 128),

    "ANTHROPIC_VERSION": os.environ.get("EASYBI_ANTHROPIC_VERSION", "2023-06-01"),
}

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "*",
}

STATIC_TYPES = {
    ".css": "text/css;charset=utf-8",
    ".js": "application/javascript;charset=utf-8",
    ".json": "application/json;charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
}

WIKI_SENTINELS = (
    "ai-file-index.md",
    "00-overview/how-to-use.md",
    "00-overview/ai-reading-flow.md",
)
WIKI_REQUIRED_PATHS = {
    "ai-file-index.md",
    "00-overview/ai-reading-flow.md",
    "00-overview/decision-tree.md",
    "02-chart-type/selection-rules.md",
    "02-chart-type/other/statistics-card.md",
    "01-design-language/theme-token.md",
    "01-design-language/color.md",
    "01-design-language/typography.md",
    "01-design-language/layout.md",
    "01-design-language/axis.md",
    "01-design-language/legend.md",
    "01-design-language/label.md",
    "01-design-language/tooltip.md",
    "04-adaptation/echarts-adapter.md",
    "06-self-check/design-checklist.md",
    "06-self-check/code-checklist.md",
}
WIKI_REMOTE = {
    "wiki": "https://github.com/lemonweb/dongdesign-chart/wiki",
    "repository": "https://github.com/lemonweb/dongdesign-chart",
    "wikiGit": "https://github.com/lemonweb/dongdesign-chart.wiki.git",
}
WIKI_RAW_ROOT = "https://raw.githubusercontent.com/lemonweb/dongdesign-chart/main/"
WIKI_ARCHIVE_URL = "https://codeload.github.com/lemonweb/dongdesign-chart/zip/refs/heads/main"
WIKI_MAX_FILE_CHARS = 6500
WIKI_MAX_CONTEXT_CHARS = 108000
WIKI_REMOTE_CACHE_SECONDS = 600
_WIKI_REMOTE_CACHE = {"loaded": 0, "files": None}


def _wiki_root():
    current = os.path.realpath(BASE_DIR)
    while True:
        if all(os.path.isfile(os.path.join(current, item)) for item in WIKI_SENTINELS):
            return current
        parent = os.path.dirname(current)
        if parent == current:
            return None
        current = parent


def _git_sha(root):
    if not root:
        return None
    try:
        out = subprocess.check_output(
            ["git", "-C", root, "rev-parse", "HEAD"],
            stderr=subprocess.DEVNULL,
            text=True,
            timeout=3,
        )
        return out.strip() or None
    except Exception:
        return None


def _wiki_paths(query):
    text = (query or "").lower()
    paths = [
        "ai-file-index.md",
        "00-overview/ai-reading-flow.md",
        "00-overview/decision-tree.md",
        "02-chart-type/selection-rules.md",
        "03-pattern/README.md",
    ]

    if any(k in text for k in ("大促", "活动", "营销", "复盘", "campaign")):
        paths.append("03-pattern/campaign-analysis.md")
    elif any(k in text for k in ("商品", "品类", "sku", "product")):
        paths.append("03-pattern/product-analysis.md")
    elif any(k in text for k in ("流量", "访问", "uv", "pv", "traffic")):
        paths.append("03-pattern/traffic-analysis.md")
    else:
        paths.append("03-pattern/business-analysis.md")

    paths.append("02-chart-type/other/statistics-card.md")
    if any(k in text for k in ("趋势", "走势", "变化", "时间", "trend")):
        paths.append("02-chart-type/basic/line-chart.md")
    if any(k in text for k in ("占比", "构成", "贡献", "结构", "渠道")):
        paths.extend(("02-chart-type/basic/pie-chart.md", "02-chart-type/basic/bar-chart.md"))
    if any(k in text for k in ("对比", "比较", "排行", "排名", "top", "差异", "品类")):
        paths.append("02-chart-type/basic/bar-chart.md")
    if any(k in text for k in ("双轴", "联动", "相关指标")):
        paths.append("02-chart-type/composite/dual-axis.md")
    if any(k in text for k in ("异常", "风险", "退款", "预警", "峰值")):
        paths.extend((
            "09-visual-enhancement/data-evidence.md",
            "09-visual-enhancement/insight-annotation.md",
            "09-visual-enhancement/highlight.md",
        ))

    paths.extend((
        "01-design-language/theme-token.md",
        "01-design-language/color.md",
        "01-design-language/typography.md",
        "01-design-language/layout.md",
        "01-design-language/axis.md",
        "01-design-language/legend.md",
        "01-design-language/label.md",
        "01-design-language/tooltip.md",
        "04-adaptation/echarts-adapter.md",
        "06-self-check/design-checklist.md",
        "06-self-check/code-checklist.md",
    ))
    return list(dict.fromkeys(paths))


def _download(url, timeout=30, attempts=3):
    last_error = None
    for attempt in range(attempts):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "EasyBI-DongDesign-Wiki/1.0"})
            with urllib.request.urlopen(req, timeout=timeout) as response:
                return response.read()
        except Exception as exc:
            last_error = exc
            if attempt + 1 < attempts:
                time.sleep(1.2 * (attempt + 1))
    raise last_error


def _remote_snapshot():
    now = time.time()
    cached = _WIKI_REMOTE_CACHE.get("files")
    if cached and now - _WIKI_REMOTE_CACHE.get("loaded", 0) < WIKI_REMOTE_CACHE_SECONDS:
        return cached

    archive = _download(WIKI_ARCHIVE_URL)
    files = {}
    with zipfile.ZipFile(io.BytesIO(archive)) as bundle:
        for info in bundle.infolist():
            if info.is_dir() or "/" not in info.filename:
                continue
            path = info.filename.split("/", 1)[1]
            if path.endswith(".md"):
                files[path] = bundle.read(info).decode("utf-8")
    if not all(path in files for path in WIKI_SENTINELS):
        raise RuntimeError("GitHub 仓库快照缺少 DongDesign Wiki 入口文件")
    _WIKI_REMOTE_CACHE.update({"loaded": now, "files": files})
    return files


def _wiki_context(query):
    root = _wiki_root()
    source = "local" if root else "remote"
    requested = _wiki_paths(query)
    pages = []
    sections = []
    errors = []
    total = 0
    remote_files = _remote_snapshot() if not root else None

    for path in requested:
        try:
            if root:
                full_path = os.path.realpath(os.path.join(root, path))
                if not full_path.startswith(root + os.sep) or not os.path.isfile(full_path):
                    raise FileNotFoundError(path)
                with open(full_path, "r", encoding="utf-8") as file:
                    raw = file.read()
            else:
                if path not in remote_files:
                    raise FileNotFoundError(path)
                raw = remote_files[path]
        except Exception as exc:
            errors.append({"path": path, "error": str(exc)[:160]})
            continue

        remaining = WIKI_MAX_CONTEXT_CHARS - total
        if remaining <= 0:
            break
        limit = min(WIKI_MAX_FILE_CHARS, remaining)
        content = raw[:limit]
        truncated = len(raw) > len(content)
        sections.append("\n\n===== DongDesign Wiki: %s%s =====\n%s" % (
            path,
            " (truncated)" if truncated else "",
            content,
        ))
        pages.append({"path": path, "chars": len(content), "truncated": truncated})
        total += len(content)

    loaded_paths = {page["path"] for page in pages}
    missing_required = sorted((WIKI_REQUIRED_PATHS & set(requested)) - loaded_paths)
    if missing_required:
        raise RuntimeError("DongDesign Wiki 缺少核心规范（%d/%d）：%s" % (
            len(pages), len(requested), "、".join(missing_required)
        ))
    optional_warnings = [item for item in errors if item["path"] not in WIKI_REQUIRED_PATHS]

    return {
        "verified": True,
        "source": source,
        "root": root or WIKI_REMOTE["repository"],
        "commitSha": _git_sha(root),
        "loadedAt": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        "pages": pages,
        "context": "".join(sections).strip(),
        "errors": [],
        "requestedPageCount": len(requested),
        "missingOptional": optional_warnings,
        "remoteFallback": WIKI_REMOTE,
    }


class Handler(http.server.BaseHTTPRequestHandler):
    def _cors(self):
        for k, v in CORS.items():
            self.send_header(k, v)

    def _serve_static(self, path, head=False):
        rel = os.path.normpath(path.lstrip("/"))
        static_root = os.path.realpath(os.path.join(BASE_DIR, "assets"))
        file_path = os.path.realpath(os.path.join(BASE_DIR, rel))
        if not file_path.startswith(static_root + os.sep) or not os.path.isfile(file_path):
            self.send_response(404); self._cors(); self.end_headers(); return
        ext = os.path.splitext(file_path)[1].lower()
        ctype = STATIC_TYPES.get(ext, "application/octet-stream")
        self.send_response(200); self.send_header("content-type", ctype); self._cors(); self.end_headers()
        if not head:
            with open(file_path, "rb") as f:
                self.wfile.write(f.read())

    def _send_json(self, status, payload, head=False):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("content-type", "application/json;charset=utf-8")
        self.send_header("content-length", str(len(body)))
        self._cors()
        self.end_headers()
        if not head:
            self.wfile.write(body)

    def _serve_wiki_context(self, query, head=False):
        try:
            payload = _wiki_context(query)
            print("WIKI %s -> %d pages [%s]" % (
                payload["source"],
                len(payload["pages"]),
                (payload.get("commitSha") or "no-sha")[:12],
            ))
            self._send_json(200, payload, head=head)
        except Exception as exc:
            self._send_json(503, {
                "verified": False,
                "error": str(exc),
                "remoteFallback": WIKI_REMOTE,
            }, head=head)

    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.end_headers()

    def do_HEAD(self):
        parsed = urllib.parse.urlsplit(self.path)
        path = parsed.path
        if path == "/api/wiki-context":
            query = urllib.parse.parse_qs(parsed.query).get("query", [""])[0]
            self._serve_wiki_context(query, head=True); return
        if path in ("/", "/index.html"):
            self.send_response(200); self.send_header("content-type", "text/html;charset=utf-8"); self._cors(); self.end_headers(); return
        if path.startswith("/assets/"):
            self._serve_static(path, head=True); return
        if path == "/__ping":
            self.send_response(200); self.send_header("content-type", "text/plain"); self._cors(); self.end_headers(); return
        self.send_response(404); self._cors(); self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlsplit(self.path)
        path = parsed.path
        if path == "/api/wiki-context":
            query = urllib.parse.parse_qs(parsed.query).get("query", [""])[0]
            self._serve_wiki_context(query); return
        if path in ("/", "/index.html"):
            try:
                with open(CONFIG["HTML_FILE"], "rb") as f:
                    body = f.read()
            except Exception:
                self.send_response(500); self.send_header("content-type", "text/plain;charset=utf-8"); self._cors(); self.end_headers()
                self.wfile.write(("找不到 index.html：" + CONFIG["HTML_FILE"]).encode("utf-8")); return
            self.send_response(200); self.send_header("content-type", "text/html;charset=utf-8"); self._cors(); self.end_headers()
            self.wfile.write(body); return
        if path.startswith("/assets/"):
            self._serve_static(path); return
        if path == "/__ping":
            self.send_response(200); self.send_header("content-type", "text/plain"); self._cors(); self.end_headers()
            self.wfile.write(b"ok"); return
        self._forward(b"")

    def do_POST(self):
        length = int(self.headers.get("content-length") or 0)
        body = self.rfile.read(length) if length else b""
        self._forward(body)

    def _to_responses(self, payload):
        """把 chat/completions 请求体翻译成 OpenAI Responses API 请求体。"""
        msgs = payload.get("messages", []) or []
        instructions = ""
        items = []
        for m in msgs:
            role = m.get("role"); content = m.get("content") or ""
            if role == "system":
                instructions += (content + "\n")
            else:
                items.append({"role": role, "content": content})
        obj = {"model": payload.get("model"), "input": items, "stream": False}
        if instructions.strip():
            obj["instructions"] = instructions.strip()
        # 推理型模型(GPT-5-codex 等)：推理 token 会占用 max_output_tokens，需给足余量，否则正文 JSON 被截断
        mt = payload.get("max_tokens") or payload.get("max_output_tokens") or 0
        obj["max_output_tokens"] = max(int(mt), int(CONFIG.get("RESP_MAX_OUTPUT", 6000)))
        # 降低推理强度：更快、把预算留给正文（网关不认会在日志看到，可在 CONFIG 关掉）
        eff = CONFIG.get("RESP_REASONING_EFFORT")
        if eff:
            obj["reasoning"] = {"effort": eff}
        return obj

    def _from_responses(self, raw):
        """把 Responses API 响应翻译回 chat/completions 形状，复用 demo 的解析。"""
        try:
            data = json.loads(raw.decode("utf-8"))
        except Exception:
            return raw
        text = data.get("output_text") if isinstance(data.get("output_text"), str) else ""
        if not text:
            parts = []
            for item in (data.get("output") or []):
                if not isinstance(item, dict):
                    continue
                for c in (item.get("content") or []):
                    if isinstance(c, dict) and isinstance(c.get("text"), str):
                        parts.append(c["text"])
            text = "".join(parts)
        if not text:
            # 兜底：递归搜出所有 output_text 文本
            acc = []
            def walk(o):
                if isinstance(o, dict):
                    if o.get("type") in ("output_text", "text") and isinstance(o.get("text"), str):
                        acc.append(o["text"])
                    for v in o.values():
                        walk(v)
                elif isinstance(o, list):
                    for v in o:
                        walk(v)
            walk(data.get("output", data))
            text = "".join(acc)
        if not text:
            # 诊断：把原始返回结构打到日志，方便定位
            print("⚠ responses 未提取到文本，原始返回片段：", raw.decode("utf-8", "ignore")[:500])
        wrapped = {"choices": [{"message": {"role": "assistant", "content": text}}]}
        return json.dumps(wrapped).encode("utf-8")

    def _forward(self, body):
        if not CONFIG["API_KEY"]:
            self.send_response(500); self.send_header("content-type", "application/json;charset=utf-8"); self._cors(); self.end_headers()
            self.wfile.write(json.dumps({"error": {"message": "缺少 EASYBI_API_KEY：请复制 .env.example 为 .env.local 并填写 API Key"}}).encode("utf-8"))
            return

        api = CONFIG.get("UPSTREAM_API", "chat")
        # 解析请求体，强制模型 + 按需翻译成 responses 格式
        try:
            payload = json.loads(body.decode("utf-8") or "{}")
        except Exception:
            payload = {}
        if CONFIG["FORCE_MODEL"]:
            payload["model"] = CONFIG["FORCE_MODEL"]
        model_name = str(payload.get("model") or "")
        if api == "chat" and model_name.upper().startswith("GPT-5"):
            mt = payload.get("max_tokens") or payload.get("max_completion_tokens") or 0
            try:
                mt = int(mt)
            except (TypeError, ValueError):
                mt = 0
            payload["max_tokens"] = max(mt, int(CONFIG.get("CHAT_MIN_TOKENS", 128)))
        # 去掉部分模型不支持的采样参数（如 GPT-5 系列只允许 temperature=1）
        for k in (CONFIG.get("DROP_PARAMS") or []):
            payload.pop(k, None)
        out_obj = self._to_responses(payload) if api == "responses" else payload
        out = json.dumps(out_obj).encode("utf-8")
        headers = {"content-type": "application/json"}
        if CONFIG["UPSTREAM_FORMAT"] == "anthropic":
            headers["x-api-key"] = CONFIG["API_KEY"]
            headers["anthropic-version"] = CONFIG["ANTHROPIC_VERSION"]
            headers["authorization"] = "Bearer " + CONFIG["API_KEY"]  # 兜底
        else:
            headers["authorization"] = "Bearer " + CONFIG["API_KEY"]
        attempts = int(CONFIG.get("RETRIES", 4))
        for i in range(attempts):
            req = urllib.request.Request(CONFIG["UPSTREAM_URL"], data=out, headers=headers, method="POST")
            try:
                with urllib.request.urlopen(req, timeout=120) as r:
                    data = r.read()
                    if api == "responses":
                        data = self._from_responses(data)
                    self.send_response(r.status); self.send_header("content-type", "application/json"); self._cors(); self.end_headers(); self.wfile.write(data)
                    print("POST %s -> %s [%s/%s] : %s%s" % (self.path, CONFIG["UPSTREAM_URL"], api, CONFIG["FORCE_MODEL"], r.status, ("  (第%d次)" % (i + 1) if i else "")))
                    return
            except urllib.error.HTTPError as e:
                data = e.read()
                if e.code in (429, 500, 502, 503, 504) and i < attempts - 1:
                    print("上游忙(HTTP %s)，%.1fs 后重试(%d/%d)…" % (e.code, 0.8 * (i + 1), i + 1, attempts - 1))
                    time.sleep(0.8 * (i + 1)); continue
                if not data:
                    data = json.dumps({"error": {"message": "上游返回 HTTP %s 但响应体为空；请检查 EASYBI_UPSTREAM_URL、网络/VPN 与模型权限" % e.code}}).encode("utf-8")
                self.send_response(e.code); self.send_header("content-type", e.headers.get("content-type", "application/json")); self._cors(); self.end_headers(); self.wfile.write(data)
                print("POST %s -> %s : %s (已重试%d次)" % (self.path, CONFIG["UPSTREAM_URL"], e.code, i))
                return
            except Exception as e:
                if i < attempts - 1:
                    print("上游连接异常，%.1fs 后重试：%s" % (0.8 * (i + 1), e)); time.sleep(0.8 * (i + 1)); continue
                self.send_response(502); self.send_header("content-type", "application/json;charset=utf-8"); self._cors(); self.end_headers()
                self.wfile.write(json.dumps({"error": {"message": "代理无法连接上游：" + str(e) + "（确认已连公司内网/VPN）"}}).encode("utf-8"))
                print("上游连接失败：", e)
                return

    def log_message(self, *a):
        pass


class Server(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True


if __name__ == "__main__":
    print("———————————————————————————————————————————")
    print("EasyBI 本地代理已启动 (Python)")
    print("  打开 demo：        http://localhost:%d" % CONFIG["PORT"])
    print("  转发上游：         %s（%s）" % (CONFIG["UPSTREAM_URL"], CONFIG["UPSTREAM_FORMAT"]))
    print("  demo Base URL 填： http://localhost:%d" % CONFIG["PORT"])
    print("  接口格式选：       " + ("OpenAI 兼容" if CONFIG["UPSTREAM_FORMAT"] == "openai" else "Anthropic 兼容"))
    if not CONFIG["API_KEY"]:
        print("  ⚠ 缺少 EASYBI_API_KEY：请复制 .env.example 为 .env.local 并填写 API Key")
    print("———————————————————————————————————————————")
    Server(("127.0.0.1", CONFIG["PORT"]), Handler).serve_forever()
