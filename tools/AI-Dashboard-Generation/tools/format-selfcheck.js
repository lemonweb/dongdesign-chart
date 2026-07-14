/* Minimal self-check for number scaling/precision.
   Run: node tools/format-selfcheck.js */
const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync(require('path').join(__dirname, '..', 'assets', 'app.js'), 'utf8');
function extract(fnName){
  const i = code.indexOf('function ' + fnName);
  if (i < 0) return null;
  let j = i;
  let depth = 0;
  let started = false;
  for (; j < code.length; j++) {
    const c = code[j];
    if (c === '{') { depth++; started = true; }
    else if (c === '}') { depth--; if (started && depth === 0) { j++; break; } }
  }
  return code.slice(i, j);
}

const needed = [
  'splitMetricValue',
  '_parseNumeric',
  '_inferUnitKey',
  '_pickScale',
  '_precisionFor',
  'formatKpiValue',
  'formatChartNumber',
];
const src = needed.map(extract).filter(Boolean).join('\n');

const sandbox = {};
vm.runInNewContext(src, sandbox);
const { formatKpiValue, formatChartNumber } = sandbox;

const cases = [
  ['GMV', 28640000, '¥2,864万'],
  ['GMV', '¥28,640,000', '¥2,864万'],
  ['订单量', 889000, '88.9万单'],
  ['活跃用户数', 865000, '86.5万人'],
  ['PV', 12864000, '1,286万次'],
  ['利润率', '13.8%', '13.8%'],
  ['目标完成率', '96%', '96%'],
  ['客单价', 43000, '4.3万'],
];

let ok = true;
for (const [name, val, expected] of cases) {
  const r = formatKpiValue(name, val);
  const got = (r.prefix || '') + r.num + (r.unit || '');
  const pass = got === expected;
  if (!pass) ok = false;
  console.log(`${pass ? '✓' : '✗'} ${name} ${JSON.stringify(val)} => ${got} (expected ${expected})`);
}

console.log('chart GMV 28640000 =>', formatChartNumber('GMV', 28640000));
process.exit(ok ? 0 : 1);
