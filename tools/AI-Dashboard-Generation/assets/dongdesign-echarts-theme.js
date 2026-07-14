/* =========================================================================
   DongDesign Charts theme package for ECharts
   Runtime adapter snapshot. Source of truth: resolved DongDesign Chart Wiki,
   especially 01-design-language/ and 04-adaptation/echarts-adapter.md.
   ========================================================================= */
(function (global) {
  const PALETTE = ['#3365F7', '#30CAFA', '#0B2165', '#EF69CA', '#FFBA30', '#16C87F', '#482AC4', '#FF6D4E', '#B8CE92', '#008FCA', '#004B91'];
  const DARK_PALETTE = ['#3365F7', '#30CAFA', '#0B2165', '#EF69CA', '#FFBA30', '#16C87F', '#482AC4', '#FF6D4E', '#B8CE92', '#008FCA', '#004B91'];
  const TOKENS = {
    brand: '#3768FA',
    cyan: '#33BFF5',
    positive: '#16B364',
    warning: '#FF9A2E',
    negative: '#F53F3F',
    ink: '#1D2129',
    ink2: '#4E5969',
    ink3: '#86909C',
    axisLabel: '#8C8C8C',
    ink4: '#C9CDD4',
    line: '#E5E6EB',
    split: '#F2F3F5',
    panel: '#FFFFFF',
    font: '-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif'
  };
  const DARK_TOKENS = {
    ink: '#EAF0FF',
    ink2: '#A9B7D6',
    ink3: '#7C8CB0',
    axisLabel: '#FFFFFF',
    line: '#22345C',
    split: 'rgba(255,255,255,.06)',
    panel: '#111E3A'
  };

  function axis(type, extra, dark) {
    const t = dark ? Object.assign({}, TOKENS, DARK_TOKENS) : TOKENS;
    const base = type === 'value'
      ? {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: t.axisLabel, fontSize: 12, fontWeight: 400, lineHeight: 18, hideOverlap: true },
          splitLine: { show: true, lineStyle: { color: t.split, type: 'solid' } },
          nameTextStyle: { color: t.ink2, fontSize: 12 }
        }
      : {
          type: 'category',
          axisLine: { show: true, lineStyle: { color: t.line } },
          axisTick: { show: false },
          axisLabel: { color: t.axisLabel, fontSize: 12, fontWeight: 400, lineHeight: 18, hideOverlap: true },
          splitLine: { show: false },
          nameTextStyle: { color: t.ink2, fontSize: 12 }
        };
    const result = Object.assign({}, base, extra || {});
    ['axisLine', 'axisTick', 'axisLabel', 'splitLine', 'nameTextStyle'].forEach(function (key) {
      if (base[key] || (extra && extra[key])) {
        result[key] = Object.assign({}, base[key] || {}, (extra && extra[key]) || {});
      }
    });
    if (base.axisLine && base.axisLine.lineStyle || extra && extra.axisLine && extra.axisLine.lineStyle) {
      result.axisLine.lineStyle = Object.assign({}, (base.axisLine && base.axisLine.lineStyle) || {}, (extra && extra.axisLine && extra.axisLine.lineStyle) || {});
    }
    if (base.splitLine && base.splitLine.lineStyle || extra && extra.splitLine && extra.splitLine.lineStyle) {
      result.splitLine.lineStyle = Object.assign({}, (base.splitLine && base.splitLine.lineStyle) || {}, (extra && extra.splitLine && extra.splitLine.lineStyle) || {});
    }
    return result;
  }

  function theme(dark) {
    const t = dark ? Object.assign({}, TOKENS, DARK_TOKENS) : TOKENS;
    return {
      color: dark ? DARK_PALETTE : PALETTE,
      backgroundColor: 'transparent',
      textStyle: { fontFamily: TOKENS.font, color: t.ink2 },
      title: {
        textStyle: { color: t.ink },
        subtextStyle: { color: t.ink3 }
      },
      legend: {
        top: 0,
        left: 0,
        textStyle: { color: t.ink2, fontSize: 12 },
        icon: 'roundRect',
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 16
      },
      tooltip: {
        backgroundColor: t.panel,
        borderColor: t.line,
        borderWidth: 1,
        textStyle: { color: t.ink, fontSize: 12, lineHeight: 18 },
        axisPointer: {
          lineStyle: { color: t.line },
          crossStyle: { color: t.line },
          shadowStyle: { color: 'rgba(55,104,250,.08)' }
        },
        extraCssText: 'border-radius:8px;box-shadow:0 8px 30px rgba(29,33,41,.12);'
      },
      categoryAxis: axis('category', null, dark),
      valueAxis: axis('value', null, dark),
      timeAxis: axis('category', null, dark),
      logAxis: axis('value', null, dark),
      line: { lineStyle: { width: 2 }, showSymbol: false, symbol: 'circle', symbolSize: 6, smooth: false },
      bar: { itemStyle: { borderRadius: [3, 3, 0, 0] } },
      radar: { splitLine: { lineStyle: { color: t.line } }, splitArea: { show: false } }
    };
  }

  function register(ec) {
    if (!ec || !ec.registerTheme) return;
    ec.registerTheme('dongdesign', theme(false));
    ec.registerTheme('dongdesign-dark', theme(true));
  }

  function grid(top, bottom) {
    return { containLabel: true, left: 8, right: 14, top: top == null ? 24 : top, bottom: bottom == null ? 24 : bottom };
  }

  function tooltip(trigger, pointerType) {
    return { trigger: trigger || 'axis', axisPointer: { type: pointerType || (trigger === 'item' ? 'line' : 'line') } };
  }

  function barStyle(horizontal) {
    return { borderRadius: horizontal ? [0, 3, 3, 0] : [3, 3, 0, 0] };
  }

  function label(position) {
    return { show: true, position: position || 'top', color: TOKENS.ink3, fontSize: 12, formatter: '{c}' };
  }

  function markPoint() {
    return {
      symbol: 'pin',
      symbolSize: 38,
      label: { color: '#FFFFFF', fontSize: 10, formatter: '{c}' },
      data: [{ type: 'max', name: '峰值' }]
    };
  }

  function totalGraphic(text, subtext) {
    return [{
      type: 'group',
      left: 'center',
      top: '39%',
      silent: true,
      children: [
        { type: 'text', left: 'center', top: -10, style: { text: text || '', fill: TOKENS.ink, font: '700 18px ' + TOKENS.font, textAlign: 'center' } },
        { type: 'text', left: 'center', top: 14, style: { text: subtext || '合计', fill: TOKENS.ink3, font: '12px ' + TOKENS.font, textAlign: 'center' } }
      ]
    }];
  }

  function interactions(opt) {
    opt.color = opt.color || PALETTE;
    opt.textStyle = Object.assign({ fontFamily: TOKENS.font, color: TOKENS.ink2 }, opt.textStyle || {});
    opt.aria = Object.assign({ enabled: true }, opt.aria || {});
    opt.animationDuration = opt.animationDuration == null ? 450 : opt.animationDuration;
    opt.animationEasing = opt.animationEasing || 'cubicOut';
    if (opt.legend) {
      opt.legend = Object.assign({ textStyle: { color: TOKENS.ink2, fontSize: 12 }, icon: 'roundRect', itemWidth: 10, itemHeight: 10, itemGap: 16 }, opt.legend);
    }
    if (opt.tooltip) {
      opt.tooltip = Object.assign(theme(false).tooltip, opt.tooltip);
    }
    const series = opt.series ? (Array.isArray(opt.series) ? opt.series : [opt.series]) : [];
    series.forEach(function (s) {
      if (!s || !s.type) return;
      s.emphasis = Object.assign({ focus: s.type === 'line' ? 'series' : 'self', blurScope: 'coordinateSystem' }, s.emphasis || {});
      s.blur = Object.assign({ itemStyle: { opacity: 0.18 }, lineStyle: { opacity: 0.16 }, areaStyle: { opacity: 0.06 } }, s.blur || {});
      if ((s.type === 'bar' || s.type === 'pie') && s.selectedMode === undefined) s.selectedMode = 'single';
    });
    return opt;
  }

  const api = { PALETTE, TOKENS, theme, register, axis, grid, tooltip, barStyle, label, markPoint, totalGraphic, interactions };
  global.DongDesignCharts = api;
  register(global.echarts);
})(window);
