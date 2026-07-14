/* =========================================================================
   [DATA] 数据集 schema + mock 数据（3 内置 + CSV 占位）
   ========================================================================= */
const DAYS=['6/1','6/4','6/7','6/10','6/13','6/15','6/16','6/17','6/18','6/19','6/20'];
const { PALETTE, TOKENS: DD, axis: ddAxis, grid: ddGrid, tooltip: ddTooltip, barStyle: ddBarStyle, label: ddLabel, markPoint: ddMarkPoint, totalGraphic: ddTotalGraphic, interactions: ddInteractions } = window.DongDesignCharts;

const DATASETS = {
  ecommerce_order_demo:{
    id:'ecommerce_order_demo', name:'电商经营明细数据集', source:'EasyBI · 订单交易主题（demo 内置）',
    type:'demo 内置', scenarios:'店铺经营 / 大促复盘 / 商品分析',
    status:['指标定义已确认','继承 BI 数据集权限','跟随 BI 数据集刷新'],
    metrics:[
      {key:'gmv',name:'GMV',val:'¥2,864万',delta:'同比 +38.2%',up:true},
      {key:'profit',name:'利润',val:'¥396万',delta:'同比 +22.5%',up:true},
      {key:'profit_rate',name:'利润率',val:'13.8%',delta:'同比 -1.9pct',up:false},
      {key:'orders',name:'订单量',val:'88.9万单',delta:'同比 +41.0%',up:true},
      {key:'conv',name:'转化率',val:'4.6%',delta:'同比 +0.4pct',up:true},
      {key:'refund',name:'退款率',val:'3.2%',delta:'同比 +0.9pct',up:false},
    ],
    dimensions:[{key:'region',name:'区域'},{key:'channel',name:'渠道'},{key:'category',name:'品类'},{key:'product',name:'商品'},{key:'shop',name:'店铺'}],
    dateFields:[{key:'date',name:'日期'}],
    primaryMetric:'gmv', breakdownDims:['channel','category','region'], rankDim:'product',
    defaultTitle:'618 大促经营复盘看板', defaultDesc:'围绕成交、利润、转化、退款和商品表现进行复盘分析',
    series:{gmv:[820,910,1050,1180,1360,1720,2260,3120,4680,3980,2610],profit:[142,150,171,190,210,258,320,401,548,470,300]},
    dims:{
      region:[{name:'华东',v:938},{name:'华南',v:702},{name:'华北',v:561},{name:'西南',v:398},{name:'华中',v:265}],
      channel:[{name:'直播间',v:1024},{name:'搜索推荐',v:786},{name:'私域社群',v:512},{name:'品牌广告',v:342},{name:'达人带货',v:200}],
      category:[{name:'美妆护肤',v:786},{name:'3C数码',v:602},{name:'服饰鞋包',v:515},{name:'食品生鲜',v:401},{name:'家居日用',v:329},{name:'母婴玩具',v:231}],
      product:[{name:'精华面霜套装',v:214},{name:'降噪蓝牙耳机',v:186},{name:'高蛋白坚果礼盒',v:151},{name:'轻薄羽绒服',v:132},{name:'智能扫地机',v:118}],
      shop:[{name:'A店·天猫旗舰',v:1680},{name:'B店·抖音自营',v:1184},{name:'C店·京东官方',v:960}],
    },
    rankCols:['商品','GMV(万)','订单量(万)','利润率'],
    rankRows:[['精华面霜套装',214,3.1,'18.2%'],['降噪蓝牙耳机',186,2.4,'15.6%'],['高蛋白坚果礼盒',151,4.6,'11.4%'],['轻薄羽绒服',132,1.8,'13.5%'],['智能扫地机',118,0.9,'9.1%']],
    detailCols:['商品','渠道','区域','GMV(万)','订单量(万)','利润率','退款率'],
    detailRows:[['精华面霜套装','直播间','华东',214,3.1,'18.2%','2.1%'],['降噪蓝牙耳机','搜索推荐','华南',186,2.4,'15.6%','3.4%'],['超值洗衣凝珠','私域社群','华中',96,5.2,'4.2%','2.8%'],['快时尚连衣裙','达人带货','华北',58,1.2,'7.7%','21.0%'],['智能扫地机','品牌广告','西南',118,0.9,'9.1%','5.0%'],['高蛋白坚果礼盒','搜索推荐','华东',151,4.6,'11.4%','2.3%'],['轻薄羽绒服','直播间','华北',132,1.8,'13.5%','8.6%'],['婴儿纸尿裤箱装','私域社群','华南',124,3.4,'9.8%','1.9%'],['无线蓝牙音箱','品牌广告','华东',88,1.5,'12.1%','4.1%'],['家用破壁机','达人带货','西南',76,1.1,'10.4%','6.2%'],['进口猫粮','搜索推荐','华中',69,2.2,'8.9%','3.0%'],['专业跑步鞋','直播间','华南',63,1.4,'14.2%','9.3%'],['护眼台灯','品牌广告','华北',41,1.7,'6.8%','4.7%'],['即食螺蛳粉','私域社群','华中',37,3.9,'5.1%','2.4%']],
  },
  sales_perf_demo:{
    id:'sales_perf_demo', name:'销售业绩数据集', source:'EasyBI · 销售管理主题（demo 内置）',
    type:'demo 内置', scenarios:'销售管理 / 区域对比 / 业绩追踪',
    status:['指标定义已确认','继承 BI 数据集权限','跟随 BI 数据集刷新'],
    metrics:[
      {key:'sales',name:'销售额',val:'¥5,280万',delta:'同比 +18.0%',up:true},
      {key:'payback',name:'回款金额',val:'¥4,620万',delta:'同比 +12.0%',up:true},
      {key:'target_rate',name:'目标完成率',val:'96%',delta:'同比 +3pct',up:true},
      {key:'customers',name:'客户数',val:'1,240',delta:'同比 +8.0%',up:true},
      {key:'aov',name:'客单价',val:'¥4.3万',delta:'同比 +5.0%',up:true},
    ],
    dimensions:[{key:'region',name:'区域'},{key:'team',name:'销售团队'},{key:'rep',name:'销售人员'},{key:'cust_type',name:'客户类型'},{key:'industry',name:'行业'}],
    dateFields:[{key:'date',name:'日期'}],
    primaryMetric:'sales', breakdownDims:['team','industry','region'], rankDim:'rep',
    defaultTitle:'销售业绩分析看板', defaultDesc:'围绕销售额、回款、目标达成与客户结构追踪业绩',
    series:{sales:[320,360,410,450,520,610,680,760,880,940,1010]},
    dims:{
      region:[{name:'华东',v:1580},{name:'华南',v:1240},{name:'华北',v:980},{name:'西南',v:760},{name:'华中',v:720}],
      team:[{name:'一区战队',v:1420},{name:'二区战队',v:1180},{name:'三区战队',v:990},{name:'KA 战队',v:1690}],
      industry:[{name:'零售',v:1560},{name:'制造',v:1180},{name:'金融',v:980},{name:'互联网',v:860},{name:'政企',v:700}],
      cust_type:[{name:'大客户',v:2680},{name:'中小客户',v:1720},{name:'长尾客户',v:880}],
      rep:[{name:'张伟',v:680},{name:'李娜',v:612},{name:'王强',v:540},{name:'赵敏',v:498},{name:'陈杰',v:441}],
    },
    rankCols:['销售人员','销售额(万)','客户数','目标完成率'],
    rankRows:[['张伟',680,182,'108%'],['李娜',612,164,'102%'],['王强',540,151,'96%'],['赵敏',498,133,'94%'],['陈杰',441,120,'88%']],
    detailCols:['销售人员','团队','行业','销售额(万)','回款(万)','客户数','客单价(万)'],
    detailRows:[['张伟','KA 战队','零售',680,610,182,3.7],['李娜','一区战队','互联网',612,540,164,3.7],['王强','二区战队','制造',540,470,151,3.6],['赵敏','三区战队','金融',498,430,133,3.7],['陈杰','一区战队','政企',441,380,120,3.7],['刘洋','KA 战队','零售',420,360,118,3.6],['孙悦','二区战队','互联网',388,330,109,3.6],['周涛','三区战队','制造',356,300,101,3.5],['吴敏','一区战队','金融',332,285,94,3.5],['郑爽','KA 战队','政企',298,250,86,3.5],['冯磊','二区战队','零售',271,228,79,3.4],['许静','三区战队','互联网',245,205,72,3.4]],
  },
  user_growth_demo:{
    id:'user_growth_demo', name:'用户增长数据集', source:'EasyBI · 用户增长主题（demo 内置）',
    type:'demo 内置', scenarios:'拉新 / 留存 / 转化分析',
    status:['指标定义已确认','继承 BI 数据集权限','跟随 BI 数据集刷新'],
    metrics:[
      {key:'new_users',name:'新增用户数',val:'12.4万',delta:'同比 +22.0%',up:true},
      {key:'active_users',name:'活跃用户数',val:'86.5万',delta:'同比 +9.0%',up:true},
      {key:'retention',name:'留存率',val:'43%',delta:'同比 +2pct',up:true},
      {key:'conv',name:'转化率',val:'5.1%',delta:'同比 +0.6pct',up:true},
      {key:'churn',name:'流失率',val:'4.8%',delta:'同比 -0.3pct',up:false},
    ],
    dimensions:[{key:'channel',name:'渠道'},{key:'user_type',name:'用户类型'},{key:'city',name:'城市'},{key:'device',name:'设备类型'}],
    dateFields:[{key:'date',name:'日期'}],
    primaryMetric:'new_users', breakdownDims:['channel','city','device'], rankDim:'city',
    defaultTitle:'用户增长分析看板', defaultDesc:'围绕新增、活跃、留存、转化与流失分析用户增长',
    series:{new_users:[0.8,0.9,1.05,1.1,1.2,1.35,1.4,1.55,1.7,1.62,1.48]},
    dims:{
      channel:[{name:'自然流量',v:4.2},{name:'应用商店',v:3.1},{name:'社媒投放',v:2.6},{name:'老带新',v:1.8},{name:'品牌广告',v:0.7}],
      user_type:[{name:'新客',v:5.4},{name:'活跃',v:3.6},{name:'沉睡',v:2.1},{name:'流失',v:1.3}],
      city:[{name:'北京',v:2.4},{name:'上海',v:2.2},{name:'广州',v:1.6},{name:'深圳',v:1.5},{name:'成都',v:1.1}],
      device:[{name:'iOS',v:5.2},{name:'Android',v:5.8},{name:'PC',v:0.9},{name:'小程序',v:0.5}],
    },
    rankCols:['城市','新增(万)','活跃(万)','留存率'],
    rankRows:[['北京',2.4,18.2,'46%'],['上海',2.2,17.1,'45%'],['广州',1.6,12.4,'42%'],['深圳',1.5,11.8,'43%'],['成都',1.1,8.6,'40%']],
    detailCols:['城市','渠道','设备','新增(万)','活跃(万)','留存率','转化率'],
    detailRows:[['北京','自然流量','iOS',2.4,18.2,'46%','5.6%'],['上海','社媒投放','Android',2.2,17.1,'45%','5.2%'],['广州','应用商店','iOS',1.6,12.4,'42%','4.8%'],['深圳','老带新','小程序',1.5,11.8,'43%','5.1%'],['成都','品牌广告','PC',1.1,8.6,'40%','4.4%'],['杭州','社媒投放','iOS',1.4,10.9,'44%','5.0%'],['武汉','自然流量','Android',1.2,9.4,'41%','4.6%'],['西安','应用商店','小程序',0.9,7.1,'39%','4.2%'],['南京','老带新','iOS',1.0,8.0,'43%','4.9%'],['重庆','品牌广告','Android',0.8,6.3,'38%','4.1%'],['苏州','社媒投放','小程序',0.7,5.6,'42%','4.7%'],['长沙','自然流量','PC',0.6,4.8,'37%','3.9%']],
  },
};
const DS_ORDER=['ecommerce_order_demo','sales_perf_demo','user_growth_demo'];
/* 常见「当前数据集没有」的投放类字段（用于字段不支持提示） */
const EXTERNAL_FIELDS=['广告消耗','投放成本','roi','投放','曝光成本','ecpm','点击成本','获客成本','ad spend'];

/* =========================================================================
   [STATE] + helpers
   ========================================================================= */
const THEME_MODES={
  dongDesign:{label:'dongDesign',theme:null,compile:true,ui:'light'},
  dark:{label:'Dark',theme:'dongdesign-dark',compile:false,ui:'dark'},
  echarts:{label:'ECharts',theme:null,compile:false,ui:'light'},
};
const APP={ datasetId:'ecommerce_order_demo', dashboard:null, charts:[], ro:null, popEl:null, llm:null, chatHistory:[], pending:null, themeMode:'dongDesign', wiki:null, wikiError:null };
const $=s=>document.querySelector(s);
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
function ds(){return DATASETS[APP.datasetId];}
function scrollChat(){const c=$('#chatScroll');setTimeout(()=>c.scrollTop=c.scrollHeight,30);}
function nameOf(d,key){const m=(d.metrics||[]).find(x=>x.key===key);if(m)return m.name;const dim=(d.dimensions||[]).find(x=>x.key===key);if(dim)return dim.name;const df=(d.dateFields||[]).find(x=>x.key===key);return df?df.name:key;}
function metricObj(d,key){return (d.metrics||[]).find(x=>x.key===key);}
function toast(msg){const t=el('div','toast',msg);document.body.appendChild(t);setTimeout(()=>t.remove(),2200);}
function htmlEsc(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function splitMetricValue(v){
  const s=String(v==null||v===''?'—':v).trim();
  if(s==='—')return {prefix:'',num:'—',unit:''};
  const m=s.match(/^([^\d+\-−.]*)([+\-−]?\d[\d,]*(?:\.\d+)?)(.*)$/);
  if(!m)return {prefix:'',num:s,unit:''};
  return {prefix:m[1]||'',num:m[2].replace('−','-'),unit:(m[3]||'').trim()};
}

/* =========================================================================
   [FORMAT] 大数换算（K/M/B, 万/亿）——用于 KPI 主指标展示
   ========================================================================= */
function _parseNumeric(v){
  if(v==null) return null;
  if(typeof v==='number' && isFinite(v)) return v;
  const s=String(v).trim();
  if(!s) return null;
  const cleaned=s.replace(/[,\s，]/g,'').replace(/(¥|￥|\$)/g,'').replace(/(单|人|次|笔|件|天|小时|分钟|秒)$/,'');
  if(!cleaned) return null;
  const n=parseFloat(cleaned);
  return isFinite(n)?n:null;
}
function _inferUnitKey(metricName, rawValue){
  const name=String(metricName||'');
  const raw=String(rawValue==null?'':rawValue);
  if(/%|率|占比|pct|percent/i.test(raw) || /率|占比|比率|转化|留存|渗透|完成率|毛利率|利润率/i.test(name)) return 'percent';
  if(/[¥￥$]/.test(raw) || /(金额|销售额|GMV|营收|收入|回款|成本|费用|消耗|支出|利润|毛利)/i.test(name)) return 'currency';
  if(/单/.test(raw) || /订单|下单/i.test(name)) return 'count_order';
  if(/人/.test(raw) || /(用户|访客|人数|人次|客群|会员)/i.test(name)) return 'count_people';
  if(/次/.test(raw) || /(PV|UV|点击|曝光|访问|浏览|播放|打开|启动)/i.test(name)) return 'count_times';
  return 'number';
}
function _pickScale(n, unitKey){
  const abs=Math.abs(n);
  const useCN = ['currency','count_order','count_people','count_times','number'].includes(unitKey);
  if(useCN){
    if(abs>=1e8) return {div:1e8, unit:'亿'};
    if(abs>=1e4) return {div:1e4, unit:'万'};
    return {div:1, unit:''};
  }
  if(abs>=1e9) return {div:1e9, unit:'B'};
  if(abs>=1e6) return {div:1e6, unit:'M'};
  if(abs>=1e3) return {div:1e3, unit:'K'};
  return {div:1, unit:''};
}
function _precisionFor(unitKey, scaleUnit, scaledValue){
  // 精度策略（可按需继续扩展）：
  // - 金额：万/亿时保留 2 位；原始值(无单位)保留 0 位
  // - 计数：万/亿时保留 1 位；原始值保留 0 位
  // - 普通数值：万/亿时保留 2 位；原始值根据量级 0~2 位
  // - 百分比：不走这里（提前返回）
  const abs=Math.abs(scaledValue);
  const isCN = scaleUnit==='万' || scaleUnit==='亿';
  if(unitKey==='currency') return isCN ? 2 : 0;
  if(unitKey==='count_order' || unitKey==='count_people' || unitKey==='count_times'){
    // 计数类：万/亿默认 1 位小数；但数值很大时（如 1286.4 万次）小数意义不大，自动收敛为 0 位
    if(!isCN) return 0;
    return abs>=1000 ? 0 : 1;
  }
  if(isCN) return 2;
  if(abs>=100) return 0;
  if(abs>=10) return 1;
  return 2;
}
function formatKpiValue(metricName, value){
  const unitKey=_inferUnitKey(metricName, value);
  const rawStr=String(value==null?'—':value).trim();
  if(rawStr==='—') return {prefix:'',num:'—',unit:''};
  if(unitKey==='percent') return splitMetricValue(rawStr);
  const n=_parseNumeric(value);
  if(n==null) return splitMetricValue(rawStr);
  const isCurrency=/[¥￥$]/.test(rawStr) || unitKey==='currency';
  const scale=_pickScale(n, unitKey);
  const scaled=n/scale.div;
  const decimals = _precisionFor(unitKey, scale.unit, scaled);
  const num=scaled.toLocaleString('en-US',{minimumFractionDigits:0, maximumFractionDigits:decimals});
  const suffix = unitKey==='count_order' ? '单'
               : unitKey==='count_people' ? '人'
               : unitKey==='count_times' ? '次'
               : '';
  return {prefix:isCurrency?'¥':'', num, unit:(scale.unit||'') + suffix};
}

/* 图表/坐标轴/tooltip 使用的数值格式化（复用 KPI 精度与换算策略） */
function formatChartNumber(metricName, value){
  // ECharts 轴/tooltip 可能传入数组/对象
  if(Array.isArray(value)) return value.map(v=>formatChartNumber(metricName,v)).join(', ');
  if(value && typeof value==='object'){
    const maybe=value.value!=null?value.value:value.data!=null?value.data:null;
    if(maybe!=null) return formatChartNumber(metricName, maybe);
  }
  const v=formatKpiValue(metricName, value);
  if(v.num==='—') return '—';
  return (v.prefix||'') + v.num + (v.unit||'');
}

/* 轴刻度只承载数值；币种、量级与计数单位统一放到轴标题。 */
function formatAxisNumber(value){
  const n=typeof value==='number'?value:_parseNumeric(value);
  if(n==null)return '—';
  return n.toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:2});
}
function metricAxisMeta(d,key){
  const metric=metricObj(d,key)||{};
  const metricName=metric.name||nameOf(d,key);
  const raw=splitMetricValue(metric.val);
  const kind=_inferUnitKey(metricName,metric.val);
  let unit=raw.unit||'';
  if(kind==='currency'){
    const scale=(unit.match(/亿|万|K|M|B/i)||[])[0]||'';
    unit=scale+(raw.prefix==='\u00a5'||raw.prefix==='￥'||/[¥￥]/.test(String(metric.val||''))?'元':'');
  }else if(kind==='percent'&&!unit){
    unit='%';
  }else if(!unit){
    unit=kind==='count_order'?'单':kind==='count_people'?'人':kind==='count_times'?'次':'';
  }
  return {name:metricName,unit,title:unit?`${metricName}（${unit}）`:metricName};
}
function splitDelta(v){
  const s=String(v==null||v===''?'':v).trim();
  if(!s || s==='—' || s==='-' || s==='–') return {label:'',value:''};
  const m=s.match(/^(.+?)\s+([+\-−]?\d.*)$/);
  if(!m){
    const v2=s.replace(/^同比\s*|^环比\s*/,'');
    return v2?{label:'同比',value:v2}:{label:'',value:''};
  }
  return {label:m[1],value:m[2].replace('−','-')};
}
function kpiHTML(m){
  const val=(m&&m.format==='raw')?splitMetricValue(m.val):formatKpiValue(m.name, m.val);
  const delta=splitDelta(m.delta);
  const tone=m.up?'up':'down';
  const note=String((m&&(m.note||m.comment||m.description||m.desc||m.annotation))||'').trim();
  const labelCls='k-l'+(note?' has-note':'');
  const labelAttrs=note?` title="${htmlEsc(note)}"`:'';
  const sub = (delta.label && delta.value)
    ? `<div class="k-sub"><span class="k-sub-label">${htmlEsc(delta.label)}</span><span class="k-sub-value ${tone}">${htmlEsc(delta.value)}</span></div>`
    : '';
  return `<div class="kpi" role="group" aria-label="${htmlEsc(m.name)} ${htmlEsc(m.val)} ${htmlEsc(m.delta)}"><div class="${labelCls}"${labelAttrs}>${htmlEsc(m.name)}</div><div class="k-main"><span class="k-prefix">${htmlEsc(val.prefix)}</span><span class="k-num">${htmlEsc(val.num)}</span>${val.unit?`<span class="k-unit">${htmlEsc(val.unit)}</span>`:''}</div>${sub}</div>`;
}
function normalizeThemeMode(mode){
  const legacy={dongOption:'dongDesign',dongTheme:'dongDesign',dongThemeDark:'dark',echartsDefault:'echarts'};
  return THEME_MODES[mode]?mode:(legacy[mode]||'dongDesign');
}
function loadThemeMode(){ try{return normalizeThemeMode(localStorage.getItem('easybi_theme_mode')||'dongDesign');}catch(e){return 'dongDesign';} }
function saveThemeMode(mode){ try{localStorage.setItem('easybi_theme_mode',mode);}catch(e){} }
function themeCfg(){ return THEME_MODES[normalizeThemeMode(APP.themeMode)]||THEME_MODES.dongDesign; }
function applyShellTheme(){ document.documentElement.setAttribute('data-easybi-theme', themeCfg().ui||'light'); }
function bindThemeSwitch(){
  const sel=$('#themeSelect'); if(!sel)return;
  sel.innerHTML=Object.entries(THEME_MODES).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('');
  APP.themeMode=normalizeThemeMode(APP.themeMode);
  sel.value=APP.themeMode;
  applyShellTheme();
  sel.onchange=()=>{ APP.themeMode=normalizeThemeMode(sel.value); saveThemeMode(APP.themeMode); applyShellTheme(); if(APP.dashboard)renderDashboard(); toast('已切换图表主题：'+themeCfg().label); };
}
function chartOptionForTheme(opt,cfg){
  if(cfg.compile)return ddInteractions(opt);
  const cloned=JSON.parse(JSON.stringify(opt));
  const adaptGraphicDark=(g)=>{
    if(!g)return;
    const list=Array.isArray(g)?g:[g];
    list.forEach(x=>{
      if(x.style&&x.type==='text'){
        x.style.fill = x.top===14 ? '#7F8FB4' : '#EAF0FF';
      }
      if(x.children)adaptGraphicDark(x.children);
    });
  };
  delete cloned.color; delete cloned.textStyle;
  const list=v=>v?(Array.isArray(v)?v:[v]):[];
  const cleanAxis=a=>{
    if(!a)return;
    if(a.axisLine&&a.axisLine.lineStyle)delete a.axisLine.lineStyle;
    if(a.axisTick&&a.axisTick.lineStyle)delete a.axisTick.lineStyle;
    if(a.axisLabel){delete a.axisLabel.color; delete a.axisLabel.fontSize;}
    if(a.splitLine&&a.splitLine.lineStyle)delete a.splitLine.lineStyle;
    if(a.nameTextStyle)delete a.nameTextStyle;
  };
  ['xAxis','yAxis','radiusAxis','angleAxis'].forEach(k=>list(cloned[k]).forEach(cleanAxis));
  if(cloned.legend&&cloned.legend.textStyle)delete cloned.legend.textStyle;
  if(cloned.tooltip){
    delete cloned.tooltip.backgroundColor; delete cloned.tooltip.borderColor; delete cloned.tooltip.textStyle; delete cloned.tooltip.extraCssText;
    if(cloned.tooltip.axisPointer){ delete cloned.tooltip.axisPointer.lineStyle; delete cloned.tooltip.axisPointer.crossStyle; delete cloned.tooltip.axisPointer.shadowStyle; }
  }
  if(cloned.radar){
    if(cloned.radar.axisName){delete cloned.radar.axisName.color; delete cloned.radar.axisName.fontSize;}
    if(cloned.radar.splitLine&&cloned.radar.splitLine.lineStyle)delete cloned.radar.splitLine.lineStyle;
    if(cloned.radar.axisLine&&cloned.radar.axisLine.lineStyle)delete cloned.radar.axisLine.lineStyle;
  }
  if(cfg.ui==='dark')adaptGraphicDark(cloned.graphic);
  const series=cloned.series?(Array.isArray(cloned.series)?cloned.series:[cloned.series]):[];
  series.forEach(s=>{
    if(s.itemStyle)delete s.itemStyle.color;
    if(s.lineStyle)delete s.lineStyle.color;
    if(s.areaStyle)delete s.areaStyle.color;
    if(s.label){delete s.label.color; delete s.label.fontSize;}
    if(s.labelLine&&s.labelLine.lineStyle)delete s.labelLine.lineStyle;
    if(s.leaves&&s.leaves.label){delete s.leaves.label.color; delete s.leaves.label.fontSize;}
    if(s.markPoint&&s.markPoint.itemStyle)delete s.markPoint.itemStyle.color;
  });
  return cloned;
}

function addMsg(role,html){
  const m=el('div','msg '+role);
  if(role==='system'){ m.innerHTML=`<div class="sysmsg">${html}</div>`; }
  else m.innerHTML=`<div class="avatar">${role==='ai'?'AI':'我'}</div><div class="bubble">${html}</div>`;
  $('#convo').appendChild(m); scrollChat(); return m;
}
/* 带操作按钮的 AI 消息（如「确认生成」）——点击后按钮禁用 */
function addMsgOpts(html, opts){
  const m=addMsg('ai',html); const bubble=m.querySelector('.bubble');
  const wrap=el('div','opts');
  (opts||[]).forEach(o=>{ const b=el('button','opt'+(o.primary?' primary':''),o.label);
    b.onclick=()=>{ wrap.querySelectorAll('.opt').forEach(x=>{x.disabled=true;x.style.opacity=.5;x.style.pointerEvents='none';}); o.onClick&&o.onClick(); };
    wrap.appendChild(b); });
  bubble.appendChild(wrap); scrollChat(); return m;
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
/* 思考过程面板：分步骤进度 + 实时计时（仿 JDesign Think），返回控制句柄 */
function createThink(steps){
  const start=Date.now();
  const m=addMsg('ai',''); const bubble=m.querySelector('.bubble');
  bubble.style.padding='0'; bubble.style.background='transparent'; bubble.style.border='none';
  const panel=el('div','think-panel');
  panel.innerHTML=`<div class="tk-head"><span class="tk-spin"></span><span class="tk-title">思考中</span><span class="tk-time">0.0s</span><span class="tk-chev">▾</span></div><div class="tk-body"></div>`;
  bubble.appendChild(panel);
  const body=panel.querySelector('.tk-body'), timeEl=panel.querySelector('.tk-time'), titleEl=panel.querySelector('.tk-title'), spin=panel.querySelector('.tk-spin');
  panel.querySelector('.tk-head').onclick=()=>panel.classList.toggle('collapsed');
  const stepEls=(steps||[]).map(s=>{ const e=el('div','tk-step pending',`<span class="tk-dot"></span><span class="tk-txt">${s}</span>`); body.appendChild(e); return e; });
  let cur=-1;
  const timer=setInterval(()=>{ timeEl.textContent=((Date.now()-start)/1000).toFixed(1)+'s'; },100);
  const stop=()=>{ clearInterval(timer); spin.classList.add('hide'); };
  return {
    activate(i){ if(cur>=0&&stepEls[cur])stepEls[cur].className='tk-step done'; cur=i; if(stepEls[i])stepEls[i].className='tk-step active'; scrollChat(); },
    done(txt){ stop(); if(cur>=0&&stepEls[cur])stepEls[cur].className='tk-step done'; const t=((Date.now()-start)/1000).toFixed(1); panel.classList.add('done','collapsed'); titleEl.textContent=txt||'已完成'; timeEl.textContent='用时 '+t+'s'; scrollChat(); },
    fail(txt){ stop(); panel.classList.add('fail'); if(cur>=0&&stepEls[cur])stepEls[cur].className='tk-step fail'; titleEl.textContent=txt||'未完成'; scrollChat(); }
  };
}

/* =========================================================================
   [DATASET CARD] 左侧数据集卡（随数据集变化）
   ========================================================================= */
function renderDatasetCard(){
  const d=ds();
  const chips=(arr,cls)=>arr.map(f=>`<span class="chip ${cls}"><span class="dot"></span>${f.name}</span>`).join('');
  $('#dsCard').innerHTML=`
    <div class="ds-head">
      <div class="ds-icon">DS</div>
      <div style="flex:1;min-width:0"><div class="ds-name">${d.name}</div><div class="ds-src">${d.source}</div></div>
      <button class="ds-switch" onclick="openSwitcher()">切换数据集</button>
    </div>
    <div class="ds-grp-l">指标字段（${d.metrics.length}）</div>
    <div class="ds-fields">${chips(d.metrics,'metric')}</div>
    <div class="ds-grp-l">维度字段（${d.dimensions.length}）</div>
    <div class="ds-fields">${chips(d.dimensions,'dim')}</div>
    <div class="ds-grp-l">日期字段</div>
    <div class="ds-fields">${chips(d.dateFields,'date')}</div>`;
}
function renderQuick(){
  const d=ds();
  const pm=nameOf(d,d.primaryMetric);
  const bd=(d.breakdownDims||[]).filter(k=>k).map(k=>nameOf(d,k));
  const cmds=[];
  cmds.push(d.id==='ecommerce_order_demo'?'帮我生成大促复盘看板':d.id==='sales_perf_demo'?'帮我生成业绩分析看板':d.id==='user_growth_demo'?'帮我生成用户增长看板':`帮我生成「${d.name}」分析看板`);
  if(bd[0]) cmds.push(`按${bd[0]}对比${pm}`);
  if(d.dateFields&&d.dateFields.length) cmds.push(`看${pm}的变化趋势`);
  if(d.rankDim) cmds.push(`${nameOf(d,d.rankDim)}的${pm}排行`);
  if(bd[1]) cmds.push(`各${bd[1]}的${pm}构成`);
  const uniq=[...new Set(cmds)].slice(0,4);
  $('#quickWrap').innerHTML=uniq.map(c=>`<span class="q">${c}</span>`).join('');
  $('#quickWrap').querySelectorAll('.q').forEach(q=>q.onclick=()=>{$('#input').value=q.textContent;send();});
}

/* =========================================================================
   [SCHEMA] 生成默认看板 + 组件字段
   ========================================================================= */
function generateDashboard(d, title){
  const pm=d.primaryMetric, bd=(d.breakdownDims||[]).filter(k=>k);
  const sections=[{id:'core',type:'metric_group',title:'核心指标概览',metrics:d.metrics.map(m=>m.key),span:4,state:'normal'}];
  if(d.dateFields&&d.dateFields.length) sections.push({id:'trend',type:'chart',chartType:'line',title:nameOf(d,pm)+'趋势分析',metrics:[pm],dimensions:[],dateField:d.dateFields[0].key,span:2,state:'normal'});
  bd.slice(0,3).forEach((k,i)=> sections.push({id:'bd'+i,type:'chart',chartType:i===2?'bar_h':'bar',title:nameOf(d,k)+nameOf(d,pm)+(i===0?'贡献':'对比'),metrics:[pm],dimensions:[k],span:2,state:'normal'}));
  if(d.rankDim) sections.push({id:'rank',type:'rank',title:nameOf(d,d.rankDim)+'排行',metrics:[],dimensions:[d.rankDim],span:4,state:'normal'});
  if(d.detailCols&&d.detailCols.length) sections.push({id:'detail',type:'table',title:'明细数据',metrics:[],dimensions:[],span:4,state:'normal'});
  return {id:'dash_'+d.id, title:title||d.defaultTitle, description:d.defaultDesc, datasetId:d.id, sections};
}

/* 为没有内置时间序列的指标合成一条确定性走势线（demo 用，保证任意指标都能出趋势图） */
function seriesFor(d,key){
  if(d.series&&d.series[key])return d.series[key];
  const base=(d.series&&d.series[d.primaryMetric])?d.series[d.primaryMetric]:DAYS.map((_,i)=>50+i*8);
  let seed=0; for(const ch of String(key))seed=(seed*31+ch.charCodeAt(0))%997;
  const amp=0.6+(seed%40)/100, max=Math.max(...base)||1;
  return base.map((v,i)=>Math.max(1,Math.round((v/max)*(60+seed%40)*amp+Math.sin(i+seed)*4)));
}

/* =========================================================================
   [LLM] 真实大模型接入（Claude / DeepSeek / OpenAI / 自定义公司网关）
   单文件 demo：Key + Base URL 存本机 localStorage，浏览器直连调用
   ========================================================================= */
const LLM_PROVIDERS={
  claude:{ name:'Claude (Anthropic)', model:'claude-3-5-sonnet-latest', endpoint:'https://api.anthropic.com/v1/messages', format:'anthropic',
    note:'官方支持浏览器直连。Key 从 console.anthropic.com 获取。' },
  deepseek:{ name:'DeepSeek（官方）', model:'deepseek-chat', endpoint:'https://api.deepseek.com/v1/chat/completions', format:'openai',
    note:'OpenAI 兼容。用官方 Key + 官方地址；若用的是公司网关，请改选下面的「自定义 / 公司网关」并填接口地址。' },
  openai:{ name:'OpenAI (GPT)', model:'gpt-4o-mini', endpoint:'https://api.openai.com/v1/chat/completions', format:'openai',
    note:'通用，OpenAI 兼容。' },
  custom:{ name:'自定义 / 公司网关', model:'deepseek-chat', endpoint:'', format:'openai',
    note:'填公司/网关的接口地址(Base URL)与模型名。ccswitch、claude-code-router 之类网关多为 OpenAI 兼容；若不通再切 Anthropic 兼容。' },
};
const EASYBI_DEFAULT_LLM={
  provider:'custom',
  format:'openai',
  baseUrl:'http://localhost:8899',
  key:'proxy',
  model:'GPT-5.4-joybuilder'
};
function loadLLM(){
  try{
    const saved=JSON.parse(localStorage.getItem('easybi_llm')||'null');
    return saved || EASYBI_DEFAULT_LLM;
  }catch(e){ return EASYBI_DEFAULT_LLM; }
}
function saveLLM(cfg){ try{localStorage.setItem('easybi_llm',JSON.stringify(cfg));}catch(e){} APP.llm=cfg; renderLLMStatus(); }
function clearLLM(){ try{localStorage.removeItem('easybi_llm');}catch(e){} APP.llm=null; renderLLMStatus(); }
function llmOn(){ return !!(APP.llm&&APP.llm.key&&APP.llm.provider&&LLM_PROVIDERS[APP.llm.provider]); }
function renderLLMStatus(){
  const s=$('#llmStatus'); if(!s)return;
  if(llmOn()){ const p=LLM_PROVIDERS[APP.llm.provider], m=APP.llm.model||p.model; s.className='llm-status on'; s.innerHTML=`<span class="d"></span>已接入 ${p.name}${m?(' · '+m):''}`; }
  else { s.className='llm-status'; s.innerHTML=`<span class="d"></span>离线智能模式`; }
}
function schemaText(d){
  const j=arr=>arr.map(x=>`${x.key}(${x.name})`).join('、');
  return `数据集：${d.name}\n指标字段(metrics)：${j(d.metrics)}\n维度字段(dimensions)：${j(d.dimensions)}\n日期字段(dateFields)：${j(d.dateFields)}`;
}
async function loadWikiContext(query){
  const url='/api/wiki-context?query='+encodeURIComponent(query||'数据看板');
  const res=await fetch(url,{headers:{accept:'application/json'}});
  let data=null;
  try{ data=await res.json(); }catch(e){}
  if(!res.ok||!data||!data.verified||!data.context||(data.pages||[]).length===0){
    const msg=(data&&data.error)||('HTTP '+res.status);
    APP.wikiError=msg; throw new Error('DongDesign Wiki 读取失败：'+msg);
  }
  data.query=query||'';
  APP.wiki=data; APP.wikiError=null;
  return data;
}
function wikiPromptContext(wiki){
  if(!wiki||!wiki.verified||!wiki.context)throw new Error('缺少已验证的 DongDesign Wiki 上下文');
  const pages=(wiki.pages||[]).map(p=>p.path).join('、');
  return `【本次实际读取的 DongDesign Chart Wiki——视觉唯一规范源】
来源：${wiki.source==='local'?'本地仓库':'GitHub 公开仓库'}
根路径/仓库：${wiki.root||''}
提交 SHA：${wiki.commitSha||'远程读取，未取得 SHA'}
读取页面：${pages}

以下是本次请求前实际读取的 Wiki 内容。图表选型、颜色、字体、布局、坐标轴、图例、标签、Tooltip、交互和 ECharts 实现必须以此为准；不要使用模型记忆补写冲突规则：
${wiki.context}
【DongDesign Wiki 内容结束】`;
}
function visualStandardFromWiki(wiki){
  if(!wiki||!wiki.verified)return null;
  return {name:'dongdesign-chart',verified:true,source:wiki.source,root:wiki.root||'',publicWiki:'https://github.com/lemonweb/dongdesign-chart/wiki',
    pages:(wiki.pages||[]).map(p=>p.path),commitSha:wiki.commitSha||null,loadedAt:wiki.loadedAt||null,query:wiki.query||''};
}
function wikiSummary(wiki){
  if(!wiki||!wiki.verified)return 'Wiki 未验证';
  const source=wiki.source==='local'?'本地 Wiki':'GitHub Wiki';
  return `${source} · ${(wiki.pages||[]).length} 页${wiki.commitSha?' · '+wiki.commitSha.slice(0,8):''}`;
}
function buildSystem(wiki){
  return `你是一名资深数据分析师，为业务方搭建 BI 看板。必须严格遵循专业"看数视角"和分析逻辑：输出结论先行、有重点、有优先级的看板结构，并只输出 JSON。

【分析方法论——务必遵循】
1. 结论先行：把最能回答用户核心问题的分析放最前、给更大 span；看板顶部通常先放核心指标概览(metric_group)，让人一眼看清现状。
2. 按需组合分析框架，别堆砌：
   · 趋势——指标随时间怎么变(line；强调累积/规模用面积图 area)；两个强相关指标随时间对比用双轴(dual，如 GMV+订单量、销售额+回款)。
   · 构成/占比——整体由哪些部分组成、谁贡献最大(pie；需同时强调排序差异用玫瑰图 rose)。环形/饼图看的是"结构占比"，建议搭配同维度的条形图(bar_h)或明细看"具体量级/排序"，二者并列成一行。
   · 对比——维度间横向差异、找高低(bar / bar_h)；多个维度成员的多角度对比可用雷达图 radar。
   · 逐层拆解/贡献下钻——一个主指标沿 2 个维度层层拆分看占比(如 销售额→渠道→商品大类)用指标拆解树 tree(metrics 放主指标 key，dimensions 放 2 个维度 key)。**用户提到"分解树/拆解树/指标分解树/指标拆解树/逐层拆解/下钻/贡献树"时，必须输出一个 chartType:"tree" 的组件作为主视图(span 4，靠前放)，绝不能用普通柱状图/条形图代替它。**
   · 排名——头部/尾部 Top-N(type rank)。
   · 异常/健康度——主动关注负向或风险指标(退款率、流失率、利润率下滑等)并在 caption/insight 点出。
   · 明细——支撑性细节放最后(type table)。明细/排行表要克制：列聚焦(别堆几十列)、数值列右对齐、退款率/流失率等风险指标点出，长表可表头吸顶。
3. 指标按业务意图挑选、要有含义，不要一股脑全放；相关指标成对呈现(利润+利润率、GMV+订单量、新增+留存)。
4. 图表选型服务于分析目的(见上)。每个组件写一句 caption，说明它回答什么业务问题。
5. 主次与优先级：核心分析靠前且更宽，次要分析靠后更窄；整体 4~6 个组件，克制，不放无意义组件。
5.1 图表的空间适配性(布局硬约束)：环形/饼图 pie、玫瑰图 rose、雷达图 radar 属于"方形图"，被拉宽只会留白——它们的 span 最多为 2，【绝不单独通栏(span4)】；若用到方形图，请给它配一个同维度的条形图(bar_h)或明细/排行，两者各 span2 并列凑成一行(2+2)。趋势(line/area/dual)、对比(bar/bar_h)、拆解树(tree)、明细/排行属于"宽度型"，可放宽到 span 3~4。
6. insight：以分析师视角给一句有洞察的判断(结合字段与指标关系，指出机会或风险，不是复述数字)。

${wikiPromptContext(wiki)}

【硬性规则】
- 只能使用给定指标/维度/日期字段的 key，绝不虚构字段。
- 若用户要的字段数据集里没有，输出 {"unsupported":true,"note":"…给出可替代的现有字段建议…"}。
- chartType 仅限 line / area / dual / bar / bar_h / pie / rose / radar / tree；type 仅限 metric_group / chart / rank / table。
- 只输出 JSON，不要解释、不要 markdown 代码块。结构：
{"designSystem":"dongdesign","title":"…","description":"…","insight":"…","sections":[{"type":"metric_group|chart|rank|table","chartType":"line|area|dual|bar|bar_h|pie|rose|radar|tree","title":"…","caption":"…","metrics":["key"],"dimensions":["key"],"dateField":"date","span":2}]}`;
}
function buildUser(query,d,cur){
  let s=schemaText(d)+`\n\n用户需求：${query}`;
  if(cur){ s+=`\n\n当前已有看板结构（若用户在此基础上修改，请返回修改后的完整结构）：\n`+JSON.stringify({title:cur.title,sections:(cur.sections||[]).map(x=>({type:x.type,chartType:x.chartType,title:x.title,metrics:x.metrics,dimensions:x.dimensions,span:x.span}))}); }
  return s;
}
/* 对话/确认阶段的 system：只对话、简短提方案、征询确认，绝不输出看板 JSON */
function buildProposeSystem(d, dash, wiki){
  let ctx='';
  if(dash&&dash.sections&&dash.sections.length){
    ctx=`\n\n【当前画布已有看板：${dash.title}，组件：${dash.sections.map(s=>s.title).join('、')}】。若用户是在此基础上追加/调整，请结合现状回应，不要当作从零开始。`;
  }
  return `你是一名资深数据分析师，正在和用户对话确认看板需求。数据集字段：\n${schemaText(d)}${ctx}\n\n${wikiPromptContext(wiki)}\n\n要求：
- 用数据分析师的"看数视角"理解需求：结论先行、抓重点、分主次。若用户在描述需求，用最多 2 句话概括你打算生成哪些组件及其逻辑(如：先看核心指标现状 → 再看趋势/对比/构成/排名 → 关注异常)，两个指标随时间对比可用双轴图，最后一句问"是否确认生成？"。务必简洁，不要重复、不要客套废话。
- 你提出的所有指标卡和图表方案都必须以上面本次实际读取的 DongDesign Wiki 内容为唯一视觉规范；不得声称参考未读取的页面。
- 若只是打招呼或需求不清：用一句话专业地引导他说清想分析什么(可举例现有指标/维度)。
- 只能引用给定字段，不虚构；字段缺失时说明并给替代建议。
- 只输出要对用户说的话，纯文本，不要 JSON、不要代码块、不要输出看板结构。`;
}
function extractJSON(txt){
  if(!txt)return null;
  let t=String(txt).trim().replace(/```json/ig,'').replace(/```/g,'').trim();
  // 先试整体
  try{ const o=JSON.parse(t); if(o&&typeof o==='object')return o; }catch(e){}
  // 花括号配对：从第一个 { 起，跳过字符串，找到配平的 } —— 容忍前后废话/思考文本
  const s=t.indexOf('{'); if(s<0)return null;
  let depth=0,inStr=false,esc=false;
  for(let i=s;i<t.length;i++){ const c=t[i];
    if(inStr){ if(esc)esc=false; else if(c==='\\')esc=true; else if(c==='"')inStr=false; }
    else { if(c==='"')inStr=true; else if(c==='{')depth++; else if(c==='}'){ depth--; if(depth===0){ try{return JSON.parse(t.slice(s,i+1));}catch(e){return null;} } } }
  }
  // 未配平（可能被截断）：退回 first{..last}
  const b=t.lastIndexOf('}'); if(b>s){ try{return JSON.parse(t.slice(s,b+1));}catch(e){} }
  return null;
}
function cfgFormat(cfg){ return cfg.format || (LLM_PROVIDERS[cfg.provider]||{}).format || 'openai'; }
function resolveEndpoint(cfg){
  const p=LLM_PROVIDERS[cfg.provider]||{};
  let base=(cfg.baseUrl||'').trim();
  if(!base) return p.endpoint||'';
  base=base.replace(/\/+$/,'');
  if(/\/(chat\/completions|messages)$/.test(base)) return base;                 // 已是完整接口
  const anth=cfgFormat(cfg)==='anthropic';
  if(/\/v\d+$/.test(base)) return base+(anth?'/messages':'/chat/completions');  // 以 /v1 结尾
  return base+(anth?'/v1/messages':'/v1/chat/completions');
}
async function llmRawMsgs(cfg, sys, msgs, maxTokens){
  const fmt=cfgFormat(cfg), endpoint=resolveEndpoint(cfg), model=cfg.model||(LLM_PROVIDERS[cfg.provider]||{}).model;
  if(!endpoint) throw new Error('缺少接口地址(Base URL)');
  let res,data;
  if(fmt==='anthropic'){
    const headers={'content-type':'application/json','x-api-key':cfg.key,'anthropic-version':'2023-06-01'};
    if(/api\.anthropic\.com/.test(endpoint)) headers['anthropic-dangerous-direct-browser-access']='true';
    res=await fetch(endpoint,{method:'POST',headers,body:JSON.stringify({model,max_tokens:maxTokens,system:sys,messages:msgs})});
    if(!res.ok) throw new Error('HTTP '+res.status+' '+(await res.text()).slice(0,160));
    data=await res.json(); return (data.content&&data.content[0]&&data.content[0].text)||'';
  }
  res=await fetch(endpoint,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+cfg.key},
    body:JSON.stringify({model,temperature:0.4,max_tokens:maxTokens,messages:[{role:'system',content:sys},...msgs]})});
  if(!res.ok) throw new Error('HTTP '+res.status+' '+(await res.text()).slice(0,160));
  data=await res.json(); return (data.choices&&data.choices[0]&&data.choices[0].message&&data.choices[0].message.content)||'';
}
async function llmRaw(cfg, sys, usr, maxTokens){ return llmRawMsgs(cfg, sys, [{role:'user',content:usr}], maxTokens); }
function pushHist(role,content){ APP.chatHistory.push({role,content}); if(APP.chatHistory.length>24) APP.chatHistory=APP.chatHistory.slice(-24); }
async function callLLM(query,wiki){
  wiki=wiki||await loadWikiContext(query);
  const content=await llmRaw(APP.llm, buildSystem(wiki), buildUser(query,ds(),APP.dashboard), 1600);
  const spec=extractJSON(content); if(!spec)throw new Error('模型返回无法解析为 JSON');
  return spec;
}
async function testLLM(cfg){
  return await llmRaw(cfg,'你是连接测试助手，用中文极简回复。','只回复两个字：正常', 128);
}
/* 校验并规整 spec，丢弃不存在字段，防止渲染出错 */
function sanitizeSpec(spec,d,wiki){
  if(!spec||spec.unsupported)return spec;
  const mk=new Set(d.metrics.map(m=>m.key)), dk=new Set(d.dimensions.map(x=>x.key));
  const secs=(spec.sections||[]).map((s,i)=>{
    let metrics=(s.metrics||[]).filter(k=>mk.has(k));
    const dimensions=(s.dimensions||[]).filter(k=>dk.has(k));
    let type=s.type||'chart', chartType=s.chartType||'bar';
    if(type==='metric_group'&&!metrics.length)metrics=d.metrics.map(m=>m.key);
    if(type==='chart'){ if(!['line','dual','area','bar','bar_h','pie','rose','radar','tree'].includes(chartType))chartType='bar';
      const timeType=(chartType==='line'||chartType==='dual'||chartType==='area');
      if(!timeType&&chartType!=='tree'&&!dimensions.length)chartType='line'; }
    const span=Math.max(1,Math.min(4,parseInt(s.span)||2));
    return {id:'s'+i+'_'+Date.now().toString(36),type,chartType,title:s.title||'分析',caption:s.caption||'',
      metrics,dimensions,dateField:s.dateField||((chartType==='line'||chartType==='dual'||chartType==='area')?'date':undefined),span,state:'normal'};
  }).filter(s=> s.type==='metric_group'?s.metrics.length : (s.type==='rank'||s.type==='table')?true : (s.dimensions.length||['line','dual','area','tree'].includes(s.chartType)));
  if(!secs.length)return null;
  return applyDongDesignSpec({id:'dash_'+d.id+'_'+Date.now().toString(36),designSystem:'dongdesign',title:spec.title||d.defaultTitle,
    description:spec.description||d.defaultDesc,insight:spec.insight||'',datasetId:d.id,sections:secs},d,wiki);
}
function applyDongDesignSpec(dash,d,wiki){
  if(!dash||!dash.sections)return dash;
  dash.designSystem='dongdesign';
  const standard=visualStandardFromWiki(wiki||APP.wiki);
  if(standard)dash.visualStandard=standard;
  const allowed={metric_group:1,chart:1,rank:1,table:1};
  const chartTypes={line:1,area:1,dual:1,bar:1,bar_h:1,pie:1,rose:1,radar:1,tree:1};
  const hasDate=!!(d.dateFields&&d.dateFields.length);
  const firstDate=hasDate?d.dateFields[0].key:undefined;
  const fallbackMetric=d.primaryMetric||(d.metrics[0]&&d.metrics[0].key);
  const fallbackDim=(d.breakdownDims&&d.breakdownDims[0])||(d.dimensions[0]&&d.dimensions[0].key);
  dash.sections=dash.sections.map((s,i)=>{
    const sec=Object.assign({},s);
    sec.type=allowed[sec.type]?sec.type:'chart';
    if(sec.type==='chart')sec.chartType=chartTypes[sec.chartType]?sec.chartType:'bar';
    sec.metrics=(sec.metrics||[]).filter(k=>(d.metrics||[]).some(m=>m.key===k));
    sec.dimensions=(sec.dimensions||[]).filter(k=>(d.dimensions||[]).some(dm=>dm.key===k));
    if(sec.type==='metric_group'){
      if(!sec.metrics.length)sec.metrics=(d.metrics||[]).slice(0,6).map(m=>m.key);
      sec.span=4;
      sec.caption=sec.caption||'遵循 DongDesign KPI 指标卡规范：主数清晰、语义涨跌、轻量边框。';
    }else if(sec.type==='rank'||sec.type==='table'){
      sec.span=4;
      sec.caption=sec.caption||'遵循 DongDesign 表格规范：数值右对齐、表头清晰、信息密度克制。';
    }else{
      if(!sec.metrics.length&&fallbackMetric)sec.metrics=[fallbackMetric];
      if(['line','area','dual'].includes(sec.chartType)){
        sec.dateField=sec.dateField||firstDate;
        sec.dimensions=[];
      }else if(sec.chartType==='tree'){
        sec.dimensions=treeDimKeys(sec,d);
        sec.span=Math.max(3,Math.min(4,parseInt(sec.span)||4));
      }else if(!sec.dimensions.length&&fallbackDim){
        sec.dimensions=[fallbackDim];
      }
      if(['pie','rose','radar'].includes(sec.chartType))sec.span=Math.min(2,Math.max(1,parseInt(sec.span)||2));
      else sec.span=Math.max(2,Math.min(4,parseInt(sec.span)||2));
      sec.caption=sec.caption||dongCaption(sec,d);
    }
    sec.id=sec.id||('dd'+i+'_'+Date.now().toString(36));
    return sec;
  });
  return dash;
}
function dongCaption(sec,d){
  const metric=nameOf(d,(sec.metrics&&sec.metrics[0])||d.primaryMetric);
  const dim=sec.dimensions&&sec.dimensions[0]?nameOf(d,sec.dimensions[0]):'';
  const map={
    line:`按 DongDesign 折线图规范展示 ${metric} 趋势，并标记峰值。`,
    area:`按 DongDesign 面积图规范强调 ${metric} 规模变化。`,
    dual:`按 DongDesign 双轴图规范对比两个相关指标的时间变化。`,
    bar:`按 DongDesign 柱状图规范对比${dim||'维度'}差异。`,
    bar_h:`按 DongDesign 条形图规范展示${dim||'维度'}排序。`,
    pie:`按 DongDesign 环形图规范展示${dim||'维度'}构成与合计。`,
    rose:`按 DongDesign 玫瑰图规范展示${dim||'维度'}结构差异。`,
    radar:`按 DongDesign 雷达图规范展示${dim||'维度'}多项对比。`,
    tree:`按 DongDesign 指标拆解树规范逐层解释 ${metric} 贡献。`
  };
  return map[sec.chartType]||'按 DongDesign charts wiki 规范生成。';
}
/* 用户在需求里点名的图表类型（有就必须出现，不指望模型自觉） */
function requestedChartType(q){
  const t=q||'';
  if(/指标拆解树|指标分解树|拆解树|分解树|下钻树|贡献树|树图/.test(t))return 'tree';
  if(/双轴图|组合图|双轴/.test(t))return 'dual';
  if(/玫瑰图/.test(t))return 'rose';
  if(/雷达图/.test(t))return 'radar';
  if(/面积图/.test(t))return 'area';
  if(/饼图/.test(t))return 'pie';
  if(/条形图/.test(t))return 'bar_h';
  if(/折线图/.test(t))return 'line';
  if(/柱状图|柱图/.test(t))return 'bar';
  return null;
}
/* 若用户点名了某图但生成结果里没有，则强制插入一个该类型组件 */
function enforceChart(dash, query, d){
  const ct=requestedChartType(query); if(!ct||!dash||!dash.sections)return dash;
  if(dash.sections.some(s=>s.type==='chart'&&s.chartType===ct))return dash;
  const pm=((typeof findMetric==='function'&&findMetric(d,query))||{key:d.primaryMetric}).key||d.primaryMetric;
  const dims=(d.breakdownDims||[]).filter(Boolean);
  const timeType=['line','area','dual'].includes(ct);
  const metrics=(ct==='dual')?[pm,(d.metrics.find(m=>m.key!==pm)||{}).key].filter(Boolean):[pm];
  const dimensions=(ct==='tree')?dims.slice(0,2):(timeType?[]:dims.slice(0,1));
  const titleMap={tree:nameOf(d,pm)+'指标拆解树',dual:nameOf(d,pm)+'双轴趋势',rose:'构成分析(玫瑰图)',radar:'多维对比(雷达图)',area:nameOf(d,pm)+'趋势(面积图)',pie:'构成占比',bar_h:'排名对比',line:nameOf(d,pm)+'趋势',bar:'维度对比'};
  const sec={id:'req'+Date.now().toString(36),type:'chart',chartType:ct,title:titleMap[ct]||(nameOf(d,pm)+'分析'),
    caption:'按你点名的图表类型生成',metrics,dimensions,dateField:timeType?'date':undefined,span:SQUARE_CHARTS[ct]?2:4,state:'ai-new'};
  dash.sections.splice(Math.min(1,dash.sections.length),0,sec);   // 放在核心指标之后当主视图
  return dash;
}
function openSettings(){
  const cur=APP.llm||{provider:'custom',format:'',model:'',key:'',baseUrl:''};
  const provOpts=Object.entries(LLM_PROVIDERS).map(([k,p])=>`<option value="${k}" ${k===cur.provider?'selected':''}>${p.name}</option>`).join('');
  openModal(`<div class="modal"><div class="m-head"><div class="t">模型设置</div><button class="x" onclick="closeModal()">×</button></div>
    <div class="m-body">
      <div class="set-note">接入真实大模型后，AI 会真正读懂你的自然语言、基于字段设计有主次的看板；未接入时用离线智能引擎。默认使用本机代理 <b>http://localhost:8899</b>，真实 Key 只放在代理的 <b>.env.local</b>，页面里填 proxy 即可。</div>
      <div class="set-label">厂商 / 网关</div>
      <select class="set-select" id="setProvider">${provOpts}</select>
      <div class="set-note" id="setProvNote"></div>
      <div class="set-label">接口格式</div>
      <select class="set-select" id="setFormat"><option value="openai">OpenAI 兼容（Bearer · /v1/chat/completions）</option><option value="anthropic">Anthropic 兼容（x-api-key · /v1/messages）</option></select>
      <div class="set-label">接口地址 Base URL <span style="font-weight:400;color:var(--dd-color-text-tertiary)">（公司/网关填这里；官方厂商可留空）</span></div>
      <input class="set-input" id="setBase" placeholder="如 https://your-gateway.com/v1">
      <div class="set-label">API Key</div>
      <input class="set-input" id="setKey" type="password" placeholder="粘贴你的 API Key">
      <div class="set-label">模型名称</div>
      <input class="set-input" id="setModel" placeholder="留空使用默认">
      <div style="display:flex;gap:8px;align-items:center;margin-top:14px">
        <button class="tbtn" id="setTest">测试连接</button>
        <span class="set-note" id="setTestResult" style="margin-top:0"></span>
      </div>
    </div>
    <div class="m-foot">
      <button class="tbtn" onclick="clearLLM();closeModal();toast('已切换为离线智能模式')">清除并离线</button>
      <button class="tbtn primary" id="setSave">保存并接入</button>
    </div></div>`);
  const P=()=>LLM_PROVIDERS[$('#setProvider').value];
  $('#setBase').value=cur.baseUrl||''; $('#setKey').value=cur.key||''; $('#setModel').value=cur.model||'';
  $('#setFormat').value=cur.format||(P()?P().format:'openai');
  const syncProv=(keepUser)=>{ const p=P(); $('#setProvNote').textContent=p.note; $('#setModel').placeholder='默认：'+(p.model||'—');
    $('#setBase').placeholder = p.endpoint?('默认：'+p.endpoint):'如 https://your-gateway.com/v1';
    if(!keepUser) $('#setFormat').value=p.format; };
  $('#setProvider').onchange=()=>syncProv(false); syncProv(true);
  const gather=()=>({provider:$('#setProvider').value,format:$('#setFormat').value,baseUrl:$('#setBase').value.trim(),key:$('#setKey').value.trim(),model:$('#setModel').value.trim()});
  const validate=(c)=>{ if(!c.key)return '请填写 API Key'; if(c.provider==='custom'&&!c.baseUrl)return '自定义网关请填写接口地址(Base URL)'; return ''; };
  const niceErr=(e)=>{ let m=String((e&&e.message)||e); if(/failed to fetch|networkerror|load failed|cors/i.test(m)) m='请求未送达：可能是跨域(CORS)限制、地址不可达或网络问题。若该网关不允许浏览器直连，需要本地代理转发。'; return m.slice(0,180); };
  $('#setTest').onclick=async()=>{ const c=gather(), v=validate(c), r=$('#setTestResult');
    if(v){ r.style.color='var(--dd-color-danger)'; r.textContent='提示：'+v; return; }
    r.style.color='var(--dd-color-text-tertiary)'; r.textContent='正在测试连接...'; $('#setTest').disabled=true;
    try{ const out=await testLLM(c); r.style.color='var(--dd-color-success)'; r.textContent='连接成功，模型已响应：'+String(out).replace(/\s+/g,' ').slice(0,30); }
    catch(e){ r.style.color='var(--dd-color-danger)'; r.textContent='连接失败：'+niceErr(e); }
    finally{ $('#setTest').disabled=false; } };
  $('#setSave').onclick=()=>{ const c=gather(), v=validate(c); if(v){ toast(v); return; }
    const nm=P().name; saveLLM(c); closeModal(); toast('已接入 '+nm); };
}

/* =========================================================================
   [OFFLINE] 离线智能分析引擎：意图识别 + 实体抽取 + 主次布局
   ========================================================================= */
function analyzeOffline(query,d){
  const t=query, tl=query.toLowerCase();
  const mets=d.metrics.filter(m=>t.includes(m.name));
  const dims=d.dimensions.filter(x=>t.includes(x.name));
  const pmMet=[...mets].sort((a,b)=>b.name.length-a.name.length)[0];
  const pm=pmMet?pmMet.key:d.primaryMetric, pmName=nameOf(d,pm);
  const I={
    trend:/趋势|走势|变化|增长|波动|随时间|每天|逐日/.test(t),
    rank:/排名|排行|排序|top|前几|最高|最好|最强|谁最|冠军|头部/.test(tl),
    compose:/构成|占比|结构|分布|组成|比重|比例/.test(t),
    compare:/对比|比较|差异|各|哪个|分别|拆分|贡献/.test(t),
    abnormal:/异常|下滑|下降|问题|为什么|风险|退款|流失|掉|预警/.test(t),
    detail:/明细|清单|列表|详细|逐条|原始/.test(t),
    overview:/概览|总览|整体|全局|经营|复盘|大盘|全面|分析一下|看看|状况|情况/.test(t),
  };
  const anySpecific=I.trend||I.rank||I.compose||I.compare||I.abnormal||I.detail;
  const strong=I.trend||I.rank||I.compose||I.abnormal||I.detail;
  if( (I.overview && !strong) || (!anySpecific && !mets.length && !dims.length) ){
    const dash=generateDashboard(d,d.defaultTitle);
    dash.insight=offlineInsight(d,pm,d.breakdownDims[0]);
    dash.sections.forEach(s=>{ if(!s.caption)s.caption=capFor(s,d); });
    return dash;
  }
  const secs=[]; let title='', insight='';
  const focusDims=dims.length?dims.map(x=>x.key):d.breakdownDims.slice(0,2);
  const order=['trend','abnormal','compose','rank','compare','detail'];
  const primary=order.find(k=>I[k])||'compare';
  const kpiKeys=mets.length?mets.map(m=>m.key):d.metrics.map(m=>m.key);
  secs.push({id:'k'+Date.now(),type:'metric_group',title:'核心指标概览',caption:'关键指标当前值与同比表现',metrics:kpiKeys,dimensions:[],span:4,state:'normal'});
  const addTrend=big=>secs.push({id:'t'+secs.length,type:'chart',chartType:'line',title:pmName+'趋势分析',caption:`观察 ${pmName} 随时间的变化与拐点`,metrics:[pm],dimensions:[],dateField:'date',span:big?4:2,state:'ai-new'});
  const addCompare=(k,big)=>{const dn=nameOf(d,k);secs.push({id:'c'+secs.length+k,type:'chart',chartType:'bar',title:dn+pmName+'对比',caption:`按${dn}拆分 ${pmName}，定位主要贡献`,metrics:[pm],dimensions:[k],span:big?4:2,state:'ai-new'});};
  const addCompose=(k,big)=>{const dn=nameOf(d,k);secs.push({id:'p'+secs.length+k,type:'chart',chartType:'pie',title:dn+pmName+'构成',caption:`各${dn}在 ${pmName} 中的占比结构`,metrics:[pm],dimensions:[k],span:2,state:'ai-new'});};
  // 构成成对：环形(结构占比) + 条形(具体量级/排序)，各 span2 凑成一行 2+2，避免环形图单独通栏留白
  const addComposePair=(k)=>{const dn=nameOf(d,k);
    secs.push({id:'pc'+secs.length+k,type:'chart',chartType:'pie',title:dn+pmName+'构成',caption:`各${dn}在 ${pmName} 中的占比结构`,metrics:[pm],dimensions:[k],span:2,state:'ai-new'});
    secs.push({id:'ps'+secs.length+k,type:'chart',chartType:'bar_h',title:dn+pmName+'占比排序',caption:`按 ${pmName} 对各${dn}排序，看具体量级与差距`,metrics:[pm],dimensions:[k],span:2,state:'ai-new'});};
  const addRank=()=>secs.push({id:'r'+secs.length,type:'rank',title:nameOf(d,d.rankDim)+'排行',caption:`${nameOf(d,d.rankDim)}维度 Top 表现`,metrics:[],dimensions:[d.rankDim],span:4,state:'ai-new'});
  const addDetail=()=>secs.push({id:'de'+secs.length,type:'table',title:'明细数据',caption:'逐条明细，便于下钻核对',metrics:[],dimensions:[],span:4,state:'normal'});
  if(primary==='trend'){ title=pmName+'趋势分析看板'; addTrend(true); focusDims.slice(0,2).forEach(k=>addCompare(k,false)); insight=trendInsight(d,pm); }
  else if(primary==='abnormal'){ title=pmName+'异常归因看板'; const neg=d.metrics.filter(m=>!m.up); addTrend(true); focusDims.slice(0,2).forEach(k=>addCompare(k,false));
    insight=neg.length?`重点关注：${neg.map(m=>m.name+'('+m.delta+')').join('、')} 出现不利变化，建议结合下方维度对比下钻定位原因。`:'未见明显恶化指标，可结合下方维度对比进一步排查。'; }
  else if(primary==='compose'){ title=pmName+'构成分析看板'; focusDims.slice(0,2).forEach(k=>addComposePair(k)); insight=composeInsight(d,pm,focusDims[0]); }
  else if(primary==='rank'){ title=nameOf(d,d.rankDim)+'排行分析看板'; addRank(); focusDims.slice(0,2).forEach(k=>addCompare(k,false)); insight=`已按 ${nameOf(d,d.rankDim)} 生成排行，可关注头部与长尾差距。`; }
  else if(primary==='detail'){ title='明细数据看板'; addDetail(); focusDims.slice(0,1).forEach(k=>addCompare(k,false)); insight='已列出明细，支持进一步筛选下钻。'; }
  else { title=(focusDims.map(k=>nameOf(d,k)).join('/')||'维度')+pmName+'对比看板'; focusDims.slice(0,3).forEach((k,i)=>addCompare(k,i===0&&focusDims.length===1)); insight=compareInsight(d,pm,focusDims[0]); }
  return {id:'dash_'+d.id+'_'+Date.now().toString(36),title,description:`基于「${d.name}」围绕你的需求「${query}」生成`,insight,datasetId:d.id,sections:secs};
}
function offlineInsight(d,pm,dimKey){ return `已生成 ${d.name} 总览：核心指标 + ${nameOf(d,pm)}趋势 + 多维贡献 + 排行明细。`+(dimKey?compareInsight(d,pm,dimKey):''); }
function trendInsight(d,pm){ const s=seriesFor(d,pm), days=(d.days&&d.days.length)?d.days:DAYS, mi=s.indexOf(Math.max(...s)); return `${nameOf(d,pm)} 在 ${days[mi]||'峰值点'} 达到最高，呈现阶段性变化。`; }
function compareInsight(d,pm,k){ if(!k||!d.dims[k])return ''; const top=[...d.dims[k]].sort((a,b)=>b.v-a.v)[0]; return `${nameOf(d,k)}中「${top.name}」的 ${nameOf(d,pm)} 贡献最高。`; }
function composeInsight(d,pm,k){ if(!k||!d.dims[k])return ''; const arr=d.dims[k], tot=arr.reduce((s,x)=>s+x.v,0)||1, top=[...arr].sort((a,b)=>b.v-a.v)[0]; return `${nameOf(d,k)}结构中「${top.name}」占比约 ${Math.round(top.v/tot*100)}%，集中度较高。`; }
function capFor(sec,d){ if(sec.type==='metric_group')return '关键指标当前值与同比表现'; if(sec.type==='rank')return '头部表现排行'; if(sec.type==='table')return '逐条明细，便于下钻'; if(sec.chartType==='line')return '随时间变化趋势'; if(sec.dimensions&&sec.dimensions[0])return `按${nameOf(d,sec.dimensions[0])}拆分`; return ''; }

/* =========================================================================
   [MODIFY] 离线模式下在已有看板上的精确增删改（LLM 模式由模型统一处理）
   ========================================================================= */
function findMetric(d,text){const t=text.toLowerCase();return [...d.metrics].sort((a,b)=>b.name.length-a.name.length).find(m=>text.includes(m.name)||t.includes(m.key));}
function findDim(d,text){return [...d.dimensions].sort((a,b)=>b.name.length-a.name.length).find(dm=>text.includes(dm.name));}
/* 自然语言修改 → 变更 schema.sections（返回 {kind:'modify',text} 或 {kind:'unsupported',text}） */
function applyModify(text){
  const d=ds(), secs=APP.dashboard.sections;
  // 删除
  if(/删除|删掉|去掉/.test(text)){
    const dim=findDim(d,text), met=findMetric(d,text);
    let idx=-1;
    if(dim) idx=secs.findIndex(s=>(s.dimensions||[]).includes(dim.key));
    if(idx<0&&met) idx=secs.findIndex(s=>(s.metrics||[]).includes(met.key)&&s.type==='chart');
    if(idx<0){ const kw=text.replace(/.*删除|删掉|去掉/,''); idx=secs.findIndex(s=>kw&&s.title.includes(kw.slice(0,2))); }
    if(idx>=0&&secs[idx].id!=='core'){ const t=secs[idx].title; secs.splice(idx,1); return {kind:'modify',text:`已删除「${t}」组件。`}; }
    return {kind:'modify',text:'没有找到匹配的组件，可换个说法，例如「删除区域分析」。'};
  }
  // 换图表类型
  if(/换成|改成/.test(text)&&/(条形图|柱状图|折线图|面积图|饼图|玫瑰图|雷达图|双轴图|组合图|双轴|指标拆解树|指标分解树|拆解树|分解树|下钻树|贡献树|树图)/.test(text)){
    const map={'条形图':'bar_h','柱状图':'bar','折线图':'line','面积图':'area','饼图':'pie','玫瑰图':'rose','雷达图':'radar','双轴图':'dual','组合图':'dual','双轴':'dual','指标拆解树':'tree','指标分解树':'tree','拆解树':'tree','分解树':'tree','下钻树':'tree','贡献树':'tree','树图':'tree'};
    const label=(text.match(/指标拆解树|指标分解树|拆解树|分解树|下钻树|贡献树|条形图|柱状图|折线图|面积图|饼图|玫瑰图|雷达图|双轴图|组合图|双轴|树图/)||[])[0];
    const nt=map[label];
    const dim=findDim(d,text); let s=dim?secs.find(x=>(x.dimensions||[]).includes(dim.key)):null;
    if(!s) s=[...secs].reverse().find(x=>x.type==='chart');
    if(s){ s.chartType=nt; if((nt==='rose'||nt==='radar'||nt==='pie'||nt==='bar'||nt==='bar_h')&&!(s.dimensions||[]).length){ s.dimensions=[d.breakdownDims&&d.breakdownDims[0]||d.dimensions[0].key]; } s.state='ai-new'; return {kind:'modify',text:`已把「${s.title}」切换为${label}。`}; }
  }
  // 移到前面
  if(/放到|移到|放在/.test(text)&&/(上面|前面|顶部|最前)/.test(text)){
    const dim=findDim(d,text); let idx=dim?secs.findIndex(x=>(x.dimensions||[]).includes(dim.key)):secs.findIndex(x=>x.title.includes(text.replace(/把|放到|移到|放在.*/g,'').slice(0,2)));
    if(idx>1){ const [s]=secs.splice(idx,1); secs.splice(1,0,s); s.state='ai-new'; return {kind:'modify',text:`已把「${s.title}」移到靠前位置。`}; }
  }
  // 按 X 拆分 Y / X 贡献 / X 对比
  if(/拆分|贡献|对比/.test(text)){
    const dim=findDim(d,text), met=findMetric(d,text)||{key:d.primaryMetric,name:nameOf(d,d.primaryMetric)};
    if(dim){ const sec={id:'m'+Date.now(),type:'chart',chartType:'bar',title:dim.name+met.name+'对比',metrics:[met.key],dimensions:[dim.key],span:2,state:'ai-new'};
      secs.push(sec); return {kind:'modify',text:`已新增「${sec.title}」，按${dim.name}拆分${met.name}。`}; }
  }
  // 同比 / 环比
  if(/同比|环比/.test(text)){
    const core=secs.find(s=>s.id==='core'); if(core&&!/同比|环比/.test(core.title)) core.title+='（含同比/环比）';
    return {kind:'modify',text:'已在核心指标概览中标注同比/环比对比口径。'};
  }
  // 加 / 新增 指标趋势 / 分析
  if(/加|新增|增加/.test(text)){
    const met=findMetric(d,text);
    if(!met){ return {kind:'unsupported',text:`没有在「${d.name}」里找到对应指标。当前可用指标：${d.metrics.map(m=>m.name).join('、')}。`}; }
    const dim=findDim(d,text);
    if(/趋势/.test(text)||!dim){
      const sec={id:'m'+Date.now(),type:'chart',chartType:'line',title:met.name+'趋势分析',metrics:[met.key],dimensions:[],dateField:'date',span:2,state:'ai-new'};
      secs.splice(Math.min(2,secs.length),0,sec);
      return {kind:'modify',text:`已新增「${sec.title}」，用于观察${met.name}随时间的变化。`};
    }
    const sec={id:'m'+Date.now(),type:'chart',chartType:'bar',title:dim.name+met.name+'对比',metrics:[met.key],dimensions:[dim.key],span:2,state:'ai-new'};
    secs.push(sec); return {kind:'modify',text:`已新增「${sec.title}」。`};
  }
  return null;
}

/* =========================================================================
   [FLOW] 发送
   ========================================================================= */
function send(){
  const text=$('#input').value.trim(); if(!text)return;
  addMsg('user',text); $('#input').value='';
  runQuery(text);
}
function isGenIntent(text){
  return /生成|搭建|做(一)?[个份张]|出[个份张]|画[个张]|看板|复盘|仪表盘|dashboard|报表|趋势|对比|比较|排行|排名|构成|占比|贡献|分布|表现|概览|总览|分析/.test(text);
}
function offlineChatReply(d){
  const pm=nameOf(d,d.primaryMetric);
  const bd=(d.breakdownDims||[]).filter(k=>k).map(k=>nameOf(d,k));
  return `你好，我是基于「${d.name}」工作的看板助手。当前可用指标：${d.metrics.slice(0,5).map(m=>m.name).join('、')}${d.metrics.length>5?'…':''}。你可以说：<b>「按${bd[0]||'维度'}对比${pm}」</b> 或 <b>「看${pm}趋势」</b>，我会先给你方案、你确认后再生成看板。`;
}
function isConfirm(text){
  const t=String(text||'').trim();
  return /确认|生成吧|就这样|开始生成|确定生成|可以生成/.test(t) || /^(确认|确定|可以|好|好的|行|ok|okay|yes|是的|嗯|对)[!！。.\s]*$/i.test(t);
}
function cleanReply(raw){
  const s=String(raw||'').trim();
  const obj=extractJSON(s);
  if(obj && obj.reply) return String(obj.reply).trim();
  return s.replace(/^```[a-z]*/i,'').replace(/```$/,'').trim() || '（模型无返回，请重试）';
}
async function runQuery(text){
  const d=ds();
  // 有待确认方案 + 用户确认 → 直接生成（打字"确认"或点按钮都走这里）
  if(APP.pending && isConfirm(text)){
    const p=APP.pending;
    if(p.mode==='llm'){ APP.pending=p; return confirmGenerate(); }
    APP.pending=null; return doOfflineGenerate(p.query,p.plan);
  }
  // 字段不支持（投放类）——先快速拦截
  const ext=EXTERNAL_FIELDS.find(f=>text.toLowerCase().includes(f.toLowerCase()));
  if(ext && !d.metrics.some(m=>text.includes(m.name))){
    addMsg('ai',`当前「${d.name}」中暂未包含「${ext}」等字段。可先基于 ${d.metrics.slice(0,4).map(m=>m.name).join('、')} 等字段分析，或切换/上传包含该字段的数据集。`);
    return;
  }
  // 清空看板（真实动作，不交给模型）——未指名具体字段时视为清空整个看板
  if(/清空|清除|清掉|重置|重来/.test(text) && ![...d.metrics,...d.dimensions].some(f=>text.includes(f.name))){
    if(APP.dashboard){ APP.dashboard=null; disposeCharts(); renderEmpty(); addMsg('ai','已清空看板，画布回到初始状态。你可以重新描述想看的分析。'); }
    else addMsg('ai','当前画布已经是空的。描述你想看的分析，我给你出方案。');
    APP.pending=null; if(llmOn()){pushHist('user',text);pushHist('assistant','已清空看板。');}
    return;
  }
  // 已有看板 + 修改类关键词 → 直接精确改写（迭代编辑，无需再确认）
  if(APP.dashboard && /加|新增|增加|删除|删掉|去掉|换成|改成|移到|放到|放在/.test(text)){
    const r=applyModify(text);
    if(r){ addMsg('ai',r.text); renderDashboard(); if(llmOn())pushHist('assistant',r.text); return; }
  }
  if(llmOn()) await proposeViaLLM(text);
  else await proposeOffline(text,d);
}
/* —— LLM：对话/提方案阶段，不直接生成 —— */
async function proposeViaLLM(text){
  pushHist('user',text);
  return runProposeLLM(text);
}
async function runProposeLLM(text){   // 可被「重试」复用，不会重复推历史
  const d=ds();
  const think=addMsg('ai','<span class="think">正在读取 DongDesign Wiki...</span>');
  let raw,wiki;
  try{
    wiki=await loadWikiContext(text);
    const label=think.querySelector&&think.querySelector('.think');
    if(label)label.textContent=`已读取 ${wikiSummary(wiki)}，正在与 ${LLM_PROVIDERS[APP.llm.provider].name} 沟通...`;
    raw=await llmRawMsgs(APP.llm, buildProposeSystem(d, APP.dashboard, wiki), APP.chatHistory, 500);
  }
  catch(e){ think.remove(); if(/Wiki 读取失败|缺少已验证/.test(String(e&&e.message)))return wikiFailurePrompt(text,e,()=>runProposeLLM(text)); return offlineFallbackPrompt(text,e,()=>runProposeLLM(text)); }
  think.remove();
  const reply=cleanReply(raw);
  pushHist('assistant',reply);
  const wantBuild = isGenIntent(text) || !!APP.dashboard || /确认生成|是否确认|要不要生成|是否生成|确认吗|是否要生成/.test(reply);
  if(wantBuild){
    APP.pending={mode:'llm',query:text};
    addMsgOpts(reply,[
      {label:'确认生成',primary:true,onClick:()=>confirmGenerate()},
      {label:'再调整',onClick:()=>addMsg('ai','好，说说要改哪里，我再调整方案。')}
    ]);
  } else {
    addMsg('ai',reply);
  }
}
/* —— 确认后才真正生成 —— */
async function confirmGenerate(){
  const p=APP.pending; APP.pending=null; if(!p)return;
  if(p.mode==='offline'){ doOfflineGenerate(p.query,p.plan); return; }
  const d=ds();
  showSkeleton();
  const tk=createThink(['读取 DongDesign Wiki','解析你的需求','调用 '+LLM_PROVIDERS[APP.llm.provider].name+' 生成方案','校验字段与布局','渲染图表']);
  tk.activate(0);
  let wiki;
  try{ wiki=await loadWikiContext(p.query); }
  catch(e){ tk.fail('Wiki 读取失败，已停止生成'); return wikiFailurePrompt(p.query,e,()=>{APP.pending={mode:'llm',query:p.query};confirmGenerate();}); }
  tk.activate(1); await sleep(100); tk.activate(2);
  let spec=null,err=null,content='';
  const msgs=APP.chatHistory.concat([{role:'user',content:buildUser('我已确认。请根据以上对话中确认的需求，现在只输出看板 JSON，不要任何解释或思考文字。',d,APP.dashboard)}]);
  try{ content=await llmRawMsgs(APP.llm, buildSystem(wiki), msgs, 4000); spec=extractJSON(content); }
  catch(e){ err=e; }
  if(err){ tk.fail('模型调用未成功'); return offlineFallbackPrompt(p.query,err,()=>{APP.pending={mode:'llm',query:p.query};confirmGenerate();}); }
  if(spec&&spec.unsupported){ tk.done('已分析需求'); addMsg('ai','提示：'+(spec.note||'所需字段不在当前数据集中。')); APP.dashboard?renderDashboard():renderEmpty(); return; }
  tk.activate(3);
  const dash=spec?sanitizeSpec(spec,d,wiki):null;
  if(!dash){ console.warn('[EasyBI] 模型返回无法解析为看板结构，原始返回：\n', content); tk.fail('返回无法解析'); return offlineFallbackPrompt(p.query,{message:'模型返回无法解析为看板结构'},()=>{APP.pending={mode:'llm',query:p.query};confirmGenerate();}); }
  enforceChart(dash,p.query,d);
  applyDongDesignSpec(dash,d,wiki);
  tk.activate(4); await sleep(60);
  APP.dashboard=dash; renderDashboard();
  tk.done('已生成「'+dash.title+'」');
  addMsg('ai',`已生成「${dash.title}」，共 ${dash.sections.length} 个组件。<div class="think" style="margin-top:6px"><b>Wiki</b> ${wikiSummary(wiki)}</div>`+(dash.insight?`<div class="think" style="margin-top:6px"><b>洞察</b> ${dash.insight}</div>`:''));
  pushHist('assistant',`已生成看板：${dash.title}（${dash.sections.length} 个组件）`);
}
/* —— 模型失败/无法解析 → 重试 / 改用离线 / 取消（rule：不自动兜底，需用户确定）—— */
function offlineFallbackPrompt(query,err,retryFn){
  if(APP.dashboard)renderDashboard(); else renderEmpty();
  APP.pending=null;
  const opts=[];
  if(retryFn) opts.push({label:'重试',primary:true,onClick:()=>retryFn()});
  opts.push({label:'用离线生成',primary:!retryFn,onClick:()=>doOfflineGenerate(query)});
  opts.push({label:'取消',onClick:()=>addMsg('ai','已取消。可点上方「重试」再试模型，或点右下角「模型设置」检查配置。')});
  addMsgOpts(`模型调用未成功（${String((err&&err.message)||err).slice(0,90)}）。可<b>重试</b>，或改用<b>离线智能引擎</b>生成。`,opts);
}
function wikiFailurePrompt(query,err,retryFn){
  if(APP.dashboard)renderDashboard(); else renderEmpty();
  APP.pending=null;
  const opts=[];
  if(retryFn)opts.push({label:'重试读取 Wiki',primary:true,onClick:()=>retryFn()});
  opts.push({label:'取消',onClick:()=>addMsg('ai','已取消。Wiki 未验证前不会调用模型生成看板。')});
  addMsgOpts(`DongDesign Wiki 读取失败，已停止生成（${htmlEsc(String((err&&err.message)||err).slice(0,120))}）。`,opts);
}
/* —— 纯离线模式：闲聊 vs 提方案+确认 —— */
async function proposeOffline(text,d){
  if(!isGenIntent(text)){ addMsg('ai',offlineChatReply(d)); return; }
  const think=addMsg('ai','<span class="think">正在读取 DongDesign Wiki...</span>');
  try{ await loadWikiContext(text); }
  catch(e){ think.remove(); return wikiFailurePrompt(text,e,()=>proposeOffline(text,d)); }
  think.remove();
  const plan=analyzeOffline(text,d);
  APP.pending={mode:'offline',query:text,plan};
  addMsgOpts(`我将基于「${d.name}」生成 <b>${plan.title}</b>，包含 ${plan.sections.length} 个组件：${plan.sections.map(s=>s.title).slice(0,6).join('、')}。确认生成吗？`,[
    {label:'确认生成',primary:true,onClick:()=>{const pl=APP.pending&&APP.pending.plan;APP.pending=null;doOfflineGenerate(text,pl);}},
    {label:'取消',onClick:()=>addMsg('ai','已取消，需要时再告诉我。')}
  ]);
}
function doOfflineGenerate(query,plan){
  const d=ds(); showSkeleton();
  const dash=plan||analyzeOffline(query,d);
  enforceChart(dash,query,d);
  applyDongDesignSpec(dash,d,APP.wiki);
  const tk=createThink(['识别分析意图','挑选指标与维度','编排主次布局','渲染组件']);
  tk.activate(0);
  setTimeout(()=>tk.activate(1),160);
  setTimeout(()=>tk.activate(2),340);
  setTimeout(()=>{ tk.activate(3);
    APP.dashboard=dash; renderDashboard(); tk.done('已生成「'+dash.title+'」');
    addMsg('ai',`已生成「${dash.title}」，共 ${dash.sections.length} 个组件。`+(dash.insight?`<div class="think" style="margin-top:6px"><b>洞察</b> ${dash.insight}</div>`:''));
  },520);
}

/* =========================================================================
   [RENDER] schema 驱动 4×N 画布
   ========================================================================= */
function disposeCharts(){ if(APP.ro){try{APP.ro.disconnect()}catch(e){}} APP.charts.forEach(c=>{try{c.dispose()}catch(e){}}); APP.charts=[]; }
function mkChart(node,opt){
  const cfg=themeCfg();
  node.setAttribute('role','img');
  node.setAttribute('aria-label','DongDesign 图表');
  const c=echarts.init(node,cfg.theme||null);
  c.setOption(chartOptionForTheme(opt,cfg));
  APP.charts.push(c);
  if(!APP.ro&&typeof ResizeObserver!=='undefined'){APP.ro=new ResizeObserver(es=>es.forEach(e=>{const ch=e.target.querySelector('.chart');const i=ch&&echarts.getInstanceByDom(ch);if(i)try{i.resize()}catch(x){}}));}
  return c; }

function showSkeleton(){
  const c=$('#canvas'); c.innerHTML=`<div class="grid">
    <div class="sk" style="grid-column:span 4"><div class="bar" style="width:40%;height:16px"></div><div class="bar" style="width:100%;height:60px;margin-top:12px"></div></div>
    <div class="sk" style="grid-column:span 2"><div class="bar" style="width:50%"></div><div class="bar" style="width:100%;height:150px;margin-top:12px"></div></div>
    <div class="sk" style="grid-column:span 2"><div class="bar" style="width:50%"></div><div class="bar" style="width:100%;height:150px;margin-top:12px"></div></div>
    <div class="sk" style="grid-column:span 4"><div class="bar" style="width:30%"></div><div class="bar" style="width:100%;height:120px;margin-top:12px"></div></div></div>`;
}
function renderEmpty(){
  const d=ds();
  $('#canvas').innerHTML=`<div class="empty"><div class="art">AI</div>
    <h2>描述你想搭建的看板</h2>
    <p>AI 会读取你的问题，识别趋势、对比、构成、排名和异常意图，挑出相关<b>指标 / 维度</b>，并按重点排出有主次的布局。</p>
    <div class="eg">
      <span class="e">${d.id==='ecommerce_order_demo'?'看看各渠道GMV构成，重点分析退款异常':d.id==='sales_perf_demo'?'各团队销售额对比，谁的目标完成率最高':'各渠道新增用户趋势和留存分布'}</span>
      <span class="e">分析各${nameOf(d,d.breakdownDims[0])}${nameOf(d,d.primaryMetric)}贡献</span>
    </div></div>`;
  $('#canvas').querySelectorAll('.e').forEach(e=>e.onclick=()=>{$('#input').value=e.textContent;send();});
  updateToolbar(null);
}
function updateToolbar(dash){
  const d=ds();
  if(!dash){ $('#tbTitle').textContent='AI 数据感知看板'; $('#tbSub').textContent='先在左侧选择/确认数据集，再用自然语言描述你想要的看板'; return; }
  $('#tbTitle').textContent=dash.title;
  $('#tbSub').textContent=`基于「${d.name}」生成 · ${d.metrics.length} 个指标 / ${d.dimensions.length} 个维度 / ${d.dateFields.length} 个日期字段`;
}
/* 布局归一化：4 列栅格铺满、不留白。
   关键：图表按"空间适配性"分三类——
   · 全宽型(metric_group/rank/table)=通栏 span4；
   · 方形/固定比例型(pie/rose/radar/funnel/gauge)=span 上限 2，且【不做通栏、不作为行尾拉伸对象】(环形拉宽只会留白)；
   · 宽度友好型(line/area/bar/bar_h/dual/tree)=可 1~4，行尾靠它拉伸填满。
   尊重手动拖宽(_wManual)。当整行只有方形图时，把下一个非全宽组件拉进本行凑满，避免方形图被迫通栏。 */
const FULL_TYPES={metric_group:1,rank:1,table:1};
const SQUARE_CHARTS={pie:1,rose:1,radar:1,funnel:1,gauge:1};
function isFullType(s){ return !!FULL_TYPES[s.type]; }
function isSquareChart(s){ return s.type==='chart'&&!!SQUARE_CHARTS[s.chartType]; }
function canStretch(s){ return !s._wManual&&!isFullType(s)&&!isSquareChart(s); } // 仅宽度友好型可被拉伸
function normalizeLayout(secs){
  secs.forEach(s=>{
    if(s._wManual) return;
    if(isFullType(s)) s.span=4;
    else if(isSquareChart(s)) s.span=Math.max(1,Math.min(2,Math.round(s.span||2))); // 方形图 span 上限 2
    else s.span=Math.max(1,Math.min(4,Math.round(s.span||2)));
  });
  let i=0;
  while(i<secs.length){
    let acc=0, start=i;
    while(i<secs.length && acc+(secs[i].span||2)<=4){ acc+=(secs[i].span||2); i++; }
    if(i===start){ secs[start].span=4; i=start+1; continue; }
    const rem=4-acc;
    if(rem>0){
      let k=-1;
      for(let j=i-1;j>=start;j--){ if(canStretch(secs[j])){ k=j; break; } } // 优先拉伸行内宽度型
      if(k>=0){ secs[k].span+=rem; }
      else if(i<secs.length && !isFullType(secs[i]) && !secs[i]._wManual){
        // 本行全是方形图/手动项，无可拉伸对象：把下一个非全宽组件缩放进来填满本行
        secs[i].span=Math.min(secs[i].span,rem); i++;
      }
    }
  }
  return secs;
}
function wikiProofHTML(standard){
  if(!standard||!standard.verified){
    return '<div class="wiki-proof unverified"><span class="wiki-state">Wiki 未验证</span><span>当前看板没有规范读取记录</span></div>';
  }
  const source=standard.source==='local'?'本地 DongDesign Wiki':'GitHub DongDesign Wiki';
  const sha=standard.commitSha?`<code>${htmlEsc(standard.commitSha.slice(0,8))}</code>`:'';
  return `<div class="wiki-proof verified"><span class="wiki-state">Wiki 已读取</span><span>${source}</span><span>${(standard.pages||[]).length} 页</span>${sha}<button type="button" class="wiki-open" onclick="openWikiSources()">查看引用</button></div>`;
}
function openWikiSources(){
  const standard=APP.dashboard&&APP.dashboard.visualStandard;
  if(!standard||!standard.verified){ toast('当前看板没有已验证的 Wiki 来源'); return; }
  const source=standard.source==='local'?'本地仓库':'GitHub 公开仓库';
  const pages=(standard.pages||[]).map(path=>`<li><code>${htmlEsc(path)}</code></li>`).join('');
  openModal(`<div class="modal wiki-modal"><div class="m-head"><div class="t">DongDesign Wiki 引用</div><button class="x" onclick="closeModal()">×</button></div>
    <div class="m-body"><div class="wiki-source-meta"><b>来源</b><span>${source}</span><b>根路径 / 仓库</b><span>${htmlEsc(standard.root||'—')}</span><b>Commit SHA</b><code>${htmlEsc(standard.commitSha||'未取得')}</code><b>读取时间</b><span>${htmlEsc(standard.loadedAt||'—')}</span></div>
    <div class="wiki-source-title">本次生成实际读取的页面（${(standard.pages||[]).length}）</div><ol class="wiki-source-list">${pages}</ol></div>
    <div class="m-foot"><button class="tbtn primary" onclick="closeModal()">关闭</button></div></div>`);
}
function renderDashboard(){
  disposeCharts();
  const d=ds(), dash=APP.dashboard; updateToolbar(dash);
  applyDongDesignSpec(dash,d);
  normalizeLayout(dash.sections);
  const c=$('#canvas'); c.innerHTML='';
  c.appendChild(el('div','board-title',`<h3>${dash.title}</h3><p>${dash.description}</p><div class="meta">更新时间：跟随 BI 数据集刷新 / 数据源「${d.name}」</div>${wikiProofHTML(dash.visualStandard)}${dash.insight?`<div class="insight"><b>洞察</b> ${dash.insight}</div>`:''}`));
  const grid=el('div','grid'); c.appendChild(grid);
  const pending=[];
  dash.sections.forEach((sec,i)=>{ const node=renderComponent(sec,d,i,pending); if(node){ node.style.gridColumn='span '+(sec.span||2); grid.appendChild(node); } });
  pending.forEach(fn=>{try{fn()}catch(e){}});
  setTimeout(()=>APP.charts.forEach(c=>{try{c.resize()}catch(e){}}),60);
  // 清 ai-new 高亮状态（下次渲染不再闪）
  dash.sections.forEach(s=>{ if(s.state==='ai-new') s._flash=true; });
}

/* 单个组件 */
function badge(state){ if(state==='ai-new')return '<span class="c-badge ai">AI 新增</span>'; if(state==='missing')return '<span class="c-badge miss">字段缺失</span>'; if(state==='pending')return '<span class="c-badge pending">待确认</span>'; return ''; }
function renderComponent(sec,d,i,pending){
  const comp=el('div','comp'+(sec._flash?' ai-new':'')+(sec.state==='missing'?' missing':''));
  comp.dataset.sid=sec.id;
  const head=el('div','comp-head',`<span class="drag-h" title="拖动调整位置" draggable="true">⠿</span><span class="idx">${i+1}</span><div class="c-title" title="${sec.title}">${sec.title}</div>${badge(sec.state)}<button class="c-more" title="更多操作">⋯</button>`);
  comp.appendChild(head);
  head.querySelector('.c-more').onclick=(e)=>{e.stopPropagation();openCompMenu(sec,comp,e.currentTarget);};
  head.querySelector('.c-title').ondblclick=(e)=>{const t=e.currentTarget;t.contentEditable='true';t.focus();t.onblur=()=>{t.contentEditable='false';sec.title=t.textContent.trim()||sec.title;};};
  bindDrag(comp,head.querySelector('.drag-h'),sec);
  if(sec.caption||sec.type==='chart'){ comp.appendChild(el('div','c-cap',sec.caption||'')); }

  const body=el('div','comp-body');
  if(sec.type==='metric_group'){
    const ms=sec.metrics.map(k=>metricObj(d,k)).filter(Boolean);
    body.innerHTML=`<div class="kpi-row" style="grid-template-columns:repeat(${Math.min(3,ms.length)||1},1fr)">`+ms.map(m=>
      kpiHTML(m)).join('')+`</div>`;
  } else if(sec.type==='rank'){
    body.innerHTML=rankHTML(d,sec);
  } else if(sec.type==='table'){
    body.innerHTML=tableHTML(d,sec);
    bindTablePager(body,sec,(d.detailRows||[]).length);
  } else { // chart
    const cid='c'+i+'_'+sec.id;
    if(sec.chartType==='tree'){
      const dimKeys=treeDimKeys(sec,d);
      const mKey=sec.metrics[0]||d.primaryMetric;
      body.innerHTML=treeHTML(treeModel(d,dimKeys,mKey));
      if(sec.h)body.querySelector('.dtree').style.minHeight=sec.h+'px';
      pending.push(()=>{ const box=body.querySelector('.dtree'); if(box) drawTreeLinks(box); });
    } else {
      body.innerHTML=`<div class="chart" id="${cid}"></div>`;
      pending.push(()=>{const n=document.getElementById(cid);if(n){ if(sec.h)n.style.height=sec.h+'px'; mkChart(n,chartOpt(sec,d)); }});
    }
  }
  comp.appendChild(body);
  if(sec.h && sec.type!=='chart'){ body.style.height=sec.h+'px'; body.style.overflow='auto'; }
  // 拖拽调整大小手柄：右边改宽度(跨列)，底边改高度
  const rx=el('div','rs-x'); comp.appendChild(rx); bindResizeX(rx,comp,sec);
  const ry=el('div','rs-y'); comp.appendChild(ry); bindResizeY(ry,comp,sec);
  return comp;
}
/* 拆解树维度解析：至少两层才有意义——用 sec.dimensions 中有数据的维度，不足 2 个时从 breakdownDims 补一个有数据的不同维度 */
function treeDimKeys(sec,d){
  const has=k=>!!(k&&d.dims&&d.dims[k]&&d.dims[k].length);
  let ks=((sec&&sec.dimensions)||[]).filter(has);
  const pool=(d.breakdownDims&&d.breakdownDims.length?d.breakdownDims:(d.dimensions||[]).map(x=>x.key));
  pool.forEach(k=>{ if(ks.length<2 && !ks.includes(k) && has(k)) ks.push(k); });
  if(!ks.length) ks=((sec&&sec.dimensions)||(d.breakdownDims||[])).filter(Boolean).slice(0,2); // 兜底
  return ks.slice(0,2);
}
function buildTreeData(d,dimKeys,mKey){
  const fmt=n=>{n=Math.round(n*100)/100;return n.toLocaleString('en-US');};
  const pct=(v,t)=>t?((v/t*100).toFixed(1)+'%'):'—';
  const num=v=>{const x=parseFloat(String(v==null?'':v).replace(/[,¥$%\s，]/g,''));return isNaN(x)?0:x;};
  const raw=d.raw, dims=(dimKeys||[]).filter(Boolean), d1=dims[0], d2=dims[1];
  const hasRaw=!!(raw&&raw.rows&&raw.idx&&mKey&&(mKey in raw.idx));
  let total = hasRaw ? raw.rows.reduce((s,r)=>s+num(r[raw.idx[mKey]]),0)
                     : ((d.dims[d1]||[]).reduce((s,x)=>s+x.v,0));
  const root={name:nameOf(d,mKey)+'\n'+fmt(total),value:total,children:[]};
  if(hasRaw && d1 && (d1 in raw.idx)){
    const g=new Map();
    raw.rows.forEach(r=>{const k=(String(r[raw.idx[d1]]||'').trim())||'—';g.set(k,(g.get(k)||0)+num(r[raw.idx[mKey]]));});
    [...g.entries()].map(([name,v])=>({name,v})).sort((a,b)=>b.v-a.v).slice(0,6).forEach(n1=>{
      const node={name:n1.name+'\n'+fmt(n1.v)+' · '+pct(n1.v,total),value:n1.v,children:[]};
      if(d2&&(d2 in raw.idx)){
        const g2=new Map();
        raw.rows.forEach(r=>{ if(((String(r[raw.idx[d1]]||'').trim())||'—')!==n1.name)return; const k=(String(r[raw.idx[d2]]||'').trim())||'—'; g2.set(k,(g2.get(k)||0)+num(r[raw.idx[mKey]]));});
        [...g2.entries()].map(([name,v])=>({name,v})).sort((a,b)=>b.v-a.v).slice(0,4).forEach(n2=>{
          node.children.push({name:n2.name+'\n'+fmt(n2.v)+' · '+pct(n2.v,n1.v),value:n2.v});
        });
      }
      root.children.push(node);
    });
  } else {
    [...(d.dims[d1]||[])].sort((a,b)=>b.v-a.v).slice(0,6).forEach(x=>root.children.push({name:x.name+'\n'+fmt(x.v)+' · '+pct(x.v,total),value:x.v}));
  }
  return root;
}
/* 拆解树数据模型：返回按层分列的节点 [[lvl0],[lvl1],[lvl2]]，节点含 {id,parent,name,value,pct} */
function treeModel(d,dimKeys,mKey){
  const num=v=>{const x=parseFloat(String(v==null?'':v).replace(/[,¥$%\s，]/g,''));return isNaN(x)?0:x;};
  const raw=d.raw, dims=(dimKeys||[]).filter(Boolean), d1=dims[0], d2=dims[1];
  const hasRaw=!!(raw&&raw.rows&&raw.idx&&mKey&&(mKey in raw.idx));
  const total=hasRaw?raw.rows.reduce((s,r)=>s+num(r[raw.idx[mKey]]),0):((d.dims[d1]||[]).reduce((s,x)=>s+x.v,0));
  const cols=[[{id:'root',parent:null,name:nameOf(d,mKey),value:total,pct:null}]];
  let lvl1;
  if(hasRaw&&d1&&(d1 in raw.idx)){ const g=new Map();
    raw.rows.forEach(r=>{const k=(String(r[raw.idx[d1]]||'').trim())||'—';g.set(k,(g.get(k)||0)+num(r[raw.idx[mKey]]));});
    lvl1=[...g.entries()].map(([name,v])=>({name,v})).sort((a,b)=>b.v-a.v).slice(0,7);
  } else { lvl1=[...(d.dims[d1]||[])].sort((a,b)=>b.v-a.v).slice(0,7); }
  const c1=lvl1.map((x,i)=>({id:'a'+i,parent:'root',name:x.name,value:x.v,pct:total?x.v/total*100:0}));
  cols.push(c1);
  if(d2){
    const c2=[];
    if(hasRaw&&(d2 in raw.idx)){
      c1.forEach(p=>{ const g2=new Map();
        raw.rows.forEach(r=>{ if(((String(r[raw.idx[d1]]||'').trim())||'—')!==p.name)return; const k=(String(r[raw.idx[d2]]||'').trim())||'—'; g2.set(k,(g2.get(k)||0)+num(r[raw.idx[mKey]]));});
        [...g2.entries()].map(([name,v])=>({name,v})).sort((a,b)=>b.v-a.v).slice(0,4).forEach((x,j)=>c2.push({id:p.id+'_'+j,parent:p.id,name:x.name,value:x.v,pct:p.value?x.v/p.value*100:0}));
      });
    } else if(d.dims[d2]&&d.dims[d2].length){
      // 内置数据集无明细行：按整体「第二维」结构近似分摊到各一级节点（每个父节点带轻微差异，仅展开贡献靠前的前 3 个一级节点×前 2 个二级，保持可读、避免过高）
      const base=[...d.dims[d2]].sort((a,b)=>b.v-a.v).slice(0,2);
      c1.slice(0,3).forEach(p=>{
        let seed=0; for(const ch of String(p.name))seed=(seed*31+ch.charCodeAt(0))%997;
        const w=base.map((x,j)=>x.v*(0.7+((seed*(j+1))%60)/100));
        const wt=w.reduce((s,v)=>s+v,0)||1;
        base.forEach((x,j)=>{ const v=p.value*(w[j]/wt); c2.push({id:p.id+'_'+j,parent:p.id,name:x.name,value:Math.round(v),pct:p.value?v/p.value*100:0}); });
      });
    }
    if(c2.length)cols.push(c2);
  }
  return cols;
}
function treeHTML(cols){
  const fmt=n=>{n=Math.round(n*100)/100;return n.toLocaleString('en-US');};
  const node=n=>`<div class="dtree-node${n.parent?'':' root'}" data-id="${n.id}"${n.parent?` data-parent="${n.parent}"`:''}>
    <div class="dtree-ring" style="--pct:${n.pct==null?100:n.pct.toFixed(1)}"></div>
    <div><div class="dtree-name" title="${n.name}">${n.name}</div>
    <div class="dtree-val">${fmt(n.value)}${n.pct==null?'':' · '+n.pct.toFixed(1)+'%'}</div></div></div>`;
  return `<div class="dtree"><svg class="dtree-links"></svg>`+cols.map(col=>`<div class="dtree-col">${col.map(node).join('')}</div>`).join('')+`</div>`;
}
function drawTreeLinks(box){
  if(!box)return; const svg=box.querySelector('.dtree-links'); if(!svg)return;
  const cr=box.getBoundingClientRect(), W=box.scrollWidth, H=box.scrollHeight;
  svg.setAttribute('width',W); svg.setAttribute('height',H); svg.setAttribute('viewBox','0 0 '+W+' '+H);
  let paths='';
  box.querySelectorAll('.dtree-node[data-parent]').forEach(nd=>{
    const par=box.querySelector('.dtree-node[data-id="'+nd.dataset.parent+'"]'); if(!par)return;
    const p=par.getBoundingClientRect(), c=nd.getBoundingClientRect();
    const x1=p.right-cr.left+box.scrollLeft, y1=p.top+p.height/2-cr.top+box.scrollTop;
    const x2=c.left-cr.left+box.scrollLeft, y2=c.top+c.height/2-cr.top+box.scrollTop;
    const mx=(x1+x2)/2;
    paths+='<path d="M'+x1+','+y1+' C'+mx+','+y1+' '+mx+','+y2+' '+x2+','+y2+'" fill="none" stroke="#C9CDD4" stroke-width="1.3"/>';
  });
  svg.innerHTML=paths;
}
function chartOpt(sec,d){
  const pmName=sec.metrics.length?nameOf(d,sec.metrics[0]):nameOf(d,d.primaryMetric);
  const fmt=v=>formatChartNumber(pmName, v);
  const topN=arr=>[...arr].sort((a,b)=>b.v-a.v).slice(0,6);
  const empty={name:'暂无数据',v:0};
  const valueAxis=(key,extra)=>{
    const meta=metricAxisMeta(d,key);
    return ddAxis('value',Object.assign({
      name:meta.title,
      nameGap:12,
      nameTextStyle:{padding:[0,0,0,0]},
      axisLabel:{formatter:formatAxisNumber}
    },extra||{}));
  };
  const tipAxis=(trigger,ptr)=>Object.assign(ddTooltip(trigger,ptr),{valueFormatter:(v)=>formatChartNumber(pmName,v)});
  const tipItem=()=>Object.assign(ddTooltip('item'),{valueFormatter:(v)=>formatChartNumber(pmName,v)});
  const gridFor=(baseL, baseR, baseT=22, baseB=22)=>{
    // 单位集中在轴标题后，为标题轨道预留稳定空间。
    const extra = 14;
    return ddGrid(baseL + extra, baseR + extra, baseT, baseB);
  };
  if(sec.chartType==='dual'){
    const days=(d.days&&d.days.length)?d.days:DAYS;
    const k1=sec.metrics[0]||d.primaryMetric;
    const others=d.metrics.map(m=>m.key).filter(k=>k!==k1);
    const k2=sec.metrics[1]||others[0]||k1;
    const n1=nameOf(d,k1), n2=nameOf(d,k2);
    return {color:PALETTE,tooltip:tipAxis('axis','shadow'),legend:{top:0,left:0,data:[n1,n2]},grid:gridFor(40,24,40,24),
      xAxis:ddAxis('category',{boundaryGap:true,data:days}),
      yAxis:[
        valueAxis(k1),
        valueAxis(k2,{splitLine:{show:false}}),
      ],
      series:[
        {name:n1,type:'bar',yAxisIndex:0,barMaxWidth:22,data:seriesFor(d,k1),itemStyle:ddBarStyle(false),label:ddLabel('top')},
        {name:n2,type:'line',yAxisIndex:1,smooth:false,showSymbol:false,symbol:'circle',symbolSize:6,data:seriesFor(d,k2),lineStyle:{width:2},markPoint:ddMarkPoint()}
      ]};
  }
  if(sec.chartType==='line'){
    const key=sec.metrics[0]||d.primaryMetric;
    const serie=seriesFor(d,key);
    const days=(d.days&&d.days.length)?d.days:DAYS;
    return {color:PALETTE,tooltip:tipAxis('axis','line'),grid:gridFor(22,22),
      xAxis:ddAxis('category',{boundaryGap:false,data:days}),
      yAxis:valueAxis(key),
      series:[{name:pmName,type:'line',data:serie,smooth:false,showSymbol:false,symbol:'circle',symbolSize:6,lineStyle:{width:2},markPoint:ddMarkPoint()}]};
  }
  if(sec.chartType==='area'){
    const key=sec.metrics[0]||d.primaryMetric;
    const serie=seriesFor(d,key);
    const days=(d.days&&d.days.length)?d.days:DAYS;
    return {color:PALETTE,tooltip:tipAxis('axis','line'),grid:gridFor(22,22),
      xAxis:ddAxis('category',{boundaryGap:false,data:days}),
      yAxis:valueAxis(key),
      series:[{name:pmName,type:'line',data:serie,smooth:false,showSymbol:false,
        areaStyle:{},
        lineStyle:{width:2},markPoint:ddMarkPoint()}]};
  }
  const dim=sec.dimensions[0], arr=(d.dims[dim]||[]);
  if(sec.chartType==='tree'){
    const dimKeys=treeDimKeys(sec,d);
    const mKey=sec.metrics[0]||d.primaryMetric;
    return {color:PALETTE,tooltip:Object.assign(tipItem(),{triggerOn:'mousemove'}),
      series:[{type:'tree',data:[buildTreeData(d,dimKeys,mKey)],left:12,right:120,top:12,bottom:12,
        symbol:'circle',symbolSize:9,orient:'LR',expandAndCollapse:true,initialTreeDepth:3,roam:false,
        itemStyle:{},
        lineStyle:{color:DD.ink4,width:1.2,curveness:0.5},
        label:{position:'left',verticalAlign:'middle',align:'right',color:DD.ink,fontSize:11,lineHeight:14},
        leaves:{label:{position:'right',align:'left',color:DD.ink2}},
        emphasis:{focus:'descendant'}}]};
  }
  if(sec.chartType==='pie'){
    const data=topN(arr.length?arr:[empty]).map(x=>({name:x.name,value:x.v}));
    const total=data.reduce((s,x)=>s+(+x.value||0),0);
    return {color:PALETTE,tooltip:Object.assign(tipItem(),{formatter:(p)=>`${esc(p.name)}: ${fmt(p.value)} (${String((p.percent??0)).replace(/\B(?=(\d{3})+(?!\d))/g,',')}%)`}),legend:{bottom:0,left:'center',type:'scroll'},graphic:ddTotalGraphic(fmt(total),'合计'),
      series:[{name:pmName,type:'pie',radius:['45%','68%'],center:['50%','43%'],avoidLabelOverlap:true,
        itemStyle:{borderColor:DD.panel,borderWidth:2},label:{show:true,color:DD.ink2,fontSize:12,formatter:'{b}\n{d}%'},labelLine:{show:true,lineStyle:{color:DD.ink4}},
        data}]};
  }
  if(sec.chartType==='rose'){
    const data=topN(arr.length?arr:[empty]).map(x=>({name:x.name,value:x.v}));
    return {color:PALETTE,tooltip:Object.assign(tipItem(),{formatter:(p)=>`${esc(p.name)}: ${fmt(p.value)} (${String((p.percent??0)).replace(/\B(?=(\d{3})+(?!\d))/g,',')}%)`}),legend:{bottom:0,left:'center',type:'scroll'},
      series:[{name:pmName,type:'pie',roseType:'area',radius:['22%','70%'],center:['50%','43%'],
        itemStyle:{borderColor:DD.panel,borderWidth:2,borderRadius:4},label:{show:true,color:DD.ink2,fontSize:12,formatter:'{b}'},labelLine:{show:true,lineStyle:{color:DD.ink4}},
        data}]};
  }
  if(sec.chartType==='radar'){
    const top=topN(arr.length?arr:[empty]);
    const max=Math.max(1,...top.map(x=>x.v))*1.1;
    return {color:PALETTE,tooltip:tipItem(),legend:{show:false},
      radar:{indicator:top.map(x=>({name:x.name,max:max})),radius:'60%',center:['50%','52%'],
        axisName:{color:DD.ink2,fontSize:11},splitLine:{lineStyle:{color:DD.split}},splitArea:{show:false},axisLine:{lineStyle:{color:DD.line}}},
      series:[{type:'radar',data:[{value:top.map(x=>x.v),name:pmName,
        symbol:'circle',symbolSize:5,areaStyle:{},lineStyle:{width:2}}]}]};
  }
  if(sec.chartType==='bar_h'){
    const sorted=topN(arr.length?arr:[empty]).sort((a,b)=>a.v-b.v);
    return {color:PALETTE,tooltip:tipAxis('axis','shadow'),grid:gridFor(12,12,12,36),
      xAxis:valueAxis(sec.metrics[0]||d.primaryMetric,{nameLocation:'middle',nameGap:30}),
      yAxis:ddAxis('category',{data:sorted.map(x=>x.name)}),
      series:[{name:pmName,type:'bar',barMaxWidth:16,data:sorted.map(x=>x.v),itemStyle:ddBarStyle(true),label:ddLabel('right')} ]};
  }
  const barData=topN(arr.length?arr:[empty]);
  return {color:PALETTE,tooltip:tipAxis('axis','shadow'),grid:gridFor(22,22),
    xAxis:ddAxis('category',{data:barData.map(x=>x.name)}),
    yAxis:valueAxis(sec.metrics[0]||d.primaryMetric),
    series:[{name:pmName,type:'bar',barMaxWidth:34,data:barData.map(x=>x.v),itemStyle:ddBarStyle(false),label:ddLabel('top')} ]};
}
/* 带符号值(+/-、涨跌箭头)上语义色：正=绿、负=红；纯数字/百分比不着色 */
function signClass(v){ const s=String(v==null?'':v).trim(); if(/^[+＋].*\d|▲|↑/.test(s))return ' pos'; if(/^[-－].*\d|▼|↓/.test(s))return ' neg'; return ''; }
function esc(s){ return String(s==null?'':s).replace(/"/g,'&quot;'); }
/* 表格样式变体 class（⋯菜单开关：紧凑/斑马纹/边框） */
function tblClass(sec){ return 'tbl'+(sec&&sec.tblSize==='small'?' compact':'')+(sec&&sec.tblStripe?' stripe':'')+(sec&&sec.tblBorder?' bordered':''); }
/* 分页：每页行数 + 页码窗口 + 分页条 HTML */
const TBL_PAGE_SIZE=10;
const TBL_PAGE_SIZES=[10,20,50];
function tblPageSizeOf(sec){ const n=sec&&+sec.tblPageSize; return (n&&TBL_PAGE_SIZES.includes(n))?n:TBL_PAGE_SIZE; }
function pageWindow(cur,pages){
  if(pages<=7) return Array.from({length:pages},(_,i)=>i+1);
  const s=new Set([1,2,pages-1,pages,cur-1,cur,cur+1]);
  const arr=[...s].filter(n=>n>=1&&n<=pages).sort((a,b)=>a-b);
  const out=[]; let prev=0;
  arr.forEach(n=>{ if(n-prev>1)out.push('…'); out.push(n); prev=n; });
  return out;
}
function pagerHTML(cur,pages,total,pageSize){
  if(total<=TBL_PAGE_SIZES[0]) return '';
  const btns=pageWindow(cur,pages).map(p=> p==='…'?`<span class="pg-ellip">…</span>`:`<button data-pg="${p}"${p===cur?' class="active"':''}>${p}</button>`).join('');
  const sizeOpts=TBL_PAGE_SIZES.map(s=>`<option value="${s}"${s===pageSize?' selected':''}>${s} 条/页</option>`).join('');
  return `<div class="pgn"><span class="pg-total">共 ${total} 条</span><button data-pg="prev"${cur<=1?' disabled':''}>‹</button>${btns}<button data-pg="next"${cur>=pages?' disabled':''}>›</button><select class="pg-size" data-pg="size" title="每页条数">${sizeOpts}</select></div>`;
}
/* 绑定分页交互：翻页改 sec.tblPage、切每页条数改 sec.tblPageSize，之后重渲染 */
function bindTablePager(body,sec,total){
  const pageSize=tblPageSizeOf(sec);
  const pages=Math.max(1,Math.ceil(total/pageSize));
  body.querySelectorAll('.pgn button[data-pg]').forEach(b=>b.onclick=(e)=>{e.stopPropagation();
    let cur=Math.min(Math.max(1,sec.tblPage||1),pages), pg=b.dataset.pg;
    if(pg==='prev')cur--; else if(pg==='next')cur++; else cur=+pg;
    sec.tblPage=Math.min(Math.max(1,cur),pages); renderDashboard();
  });
  const sel=body.querySelector('.pgn select[data-pg="size"]');
  if(sel) sel.onchange=(e)=>{e.stopPropagation(); sec.tblPageSize=+sel.value; sec.tblPage=1; renderDashboard();};
}
function rankHTML(d,sec){
  const max=Math.max(...d.rankRows.map(r=>+r[1]||0));
  return `<div class="tbl-wrap"><table class="${tblClass(sec)}"><thead><tr>${d.rankCols.map((c,i)=>`<th class="${i>0?'num':''}">${c}</th>`).join('')}</tr></thead>
    <tbody>${d.rankRows.map((r,ri)=>`<tr><td class="cell-strong" title="${esc(r[0])}"><b style="color:var(--dd-color-text-tertiary);margin-right:6px;font-variant-numeric:tabular-nums">${ri+1}</b>${r[0]}</td>
      ${r.slice(1).map((v,i)=>`<td class="num${signClass(v)}">${i===0?`<span class="rk-bar" style="width:${Math.round((+v||0)/max*46)}px"></span>`:''}${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function tableHTML(d,sec){
  const cols=d.detailCols||[], all=d.detailRows||[];
  const pageSize=tblPageSizeOf(sec);
  const total=all.length, pages=Math.max(1,Math.ceil(total/pageSize));
  const cur=Math.min(Math.max(1,(sec&&sec.tblPage)||1),pages);
  const rows=all.slice((cur-1)*pageSize, cur*pageSize);
  const isNum=s=>{const x=String(s==null?'':s).replace(/[,¥$%\s，]/g,'');return x!==''&&!isNaN(parseFloat(x))&&isFinite(+x);};
  // 按全量数据识别数值列（多数单元格是数值即右对齐），保证翻页列对齐稳定
  const numCol=cols.map((c,ci)=> total>0 && all.filter(r=>isNum(r[ci])).length>=Math.ceil(total*0.6));
  return `<div class="tbl-wrap"><table class="${tblClass(sec)}"><thead><tr>${cols.map((c,i)=>`<th class="${numCol[i]?'num':''}">${c}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(r=>`<tr>${r.map((v,i)=>`<td class="${numCol[i]?'num':''}${i===0?' cell-strong':''}${signClass(v)}" title="${esc(v)}">${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`+pagerHTML(cur,pages,total,pageSize);
}

/* =========================================================================
   [COMPONENT OPS] ⋯ 菜单：编辑标题 / 切换图表类型 / 查看字段 / 删除
   ========================================================================= */
function closePop(){ if(APP.popEl){APP.popEl.remove();APP.popEl=null;document.removeEventListener('click',closePop);} }
function openCompMenu(sec,comp,btn){
  closePop();
  const pop=el('div','pop'); APP.popEl=pop;
  const d=ds();
  let html='';
  html+=`<div class="item" data-a="title">✎ 编辑标题</div>`;
  if(sec.type==='chart'){ html+=`<div class="sub">切换图表类型</div>
    <div class="item" data-a="type" data-t="line">折线图</div>
    <div class="item" data-a="type" data-t="area">面积图</div>
    <div class="item" data-a="type" data-t="bar">柱状图</div>
    <div class="item" data-a="type" data-t="bar_h">条形图</div>
    <div class="item" data-a="type" data-t="pie">饼图</div>
    <div class="item" data-a="type" data-t="rose">玫瑰图</div>
    <div class="item" data-a="type" data-t="radar">雷达图</div>
    <div class="item" data-a="type" data-t="dual">双轴图(组合)</div>`; }
  if(sec.type==='table'||sec.type==='rank'){ const ck=on=>on?'✓ ':'　'; html+=`<div class="sub">表格样式</div>
    <div class="item" data-a="tsize">${ck(sec.tblSize==='small')}紧凑行高</div>
    <div class="item" data-a="tstripe">${ck(sec.tblStripe)}斑马纹</div>
    <div class="item" data-a="tborder">${ck(sec.tblBorder)}边框</div>`; }
  html+=`<div class="sep"></div><div class="sub">查看使用字段</div><div class="fields">${fieldTags(sec,d)}</div>`;
  html+=`<div class="sep"></div><div class="item danger" data-a="del">🗑 删除组件</div>`;
  pop.innerHTML=html;
  document.body.appendChild(pop);
  const r=btn.getBoundingClientRect(); pop.style.top=(r.bottom+6)+'px'; pop.style.left=Math.min(r.left-120,window.innerWidth-260)+'px';
  pop.querySelectorAll('.item').forEach(it=>it.onclick=(e)=>{e.stopPropagation();
    const a=it.dataset.a;
    if(a==='title'){ const t=comp.querySelector('.c-title'); t.contentEditable='true';t.focus(); t.onblur=()=>{t.contentEditable='false';sec.title=t.textContent.trim()||sec.title;}; }
    else if(a==='type'){ sec.chartType=it.dataset.t; if((sec.chartType==='rose'||sec.chartType==='radar'||sec.chartType==='pie'||sec.chartType==='bar'||sec.chartType==='bar_h')&&!(sec.dimensions||[]).length){ sec.dimensions=[(d.breakdownDims&&d.breakdownDims[0])||(d.dimensions[0]&&d.dimensions[0].key)]; } sec.state='ai-new'; renderDashboard(); }
    else if(a==='del'){ APP.dashboard.sections=APP.dashboard.sections.filter(s=>s!==sec); renderDashboard(); toast('已删除组件'); }
    else if(a==='tsize'){ sec.tblSize=sec.tblSize==='small'?'':'small'; renderDashboard(); }
    else if(a==='tstripe'){ sec.tblStripe=!sec.tblStripe; renderDashboard(); }
    else if(a==='tborder'){ sec.tblBorder=!sec.tblBorder; renderDashboard(); }
    closePop();
  });
  setTimeout(()=>document.addEventListener('click',closePop),0);
}
function fieldTags(sec,d){
  const ms=(sec.metrics||[]).map(k=>`<span class="chip metric"><span class="dot"></span>${nameOf(d,k)}</span>`).join('');
  const ds_=(sec.dimensions||[]).map(k=>`<span class="chip dim"><span class="dot"></span>${nameOf(d,k)}</span>`).join('');
  const df=sec.dateField?`<span class="chip date"><span class="dot"></span>${nameOf(d,sec.dateField)}</span>`:'';
  const inner=(ms+ds_+df)||'<span style="font-size:11.5px;color:var(--dd-color-text-tertiary)">该组件使用全部明细字段</span>';
  return inner;
}

/* =========================================================================
   [RESIZE] 拖边缘改跨列；拖底边改高度
   ========================================================================= */
function bindResizeX(handle,comp,sec){
  handle.addEventListener('pointerdown',e=>{
    e.preventDefault(); const grid=comp.parentElement; const gap=16;
    const colW=(grid.clientWidth-gap*3)/4; const startX=e.clientX; const startSpan=sec.span||2;
    handle.setPointerCapture(e.pointerId);
    const move=ev=>{ const dx=ev.clientX-startX; let span=Math.round(startSpan+dx/(colW+gap)); span=Math.max(1,Math.min(4,span));
      if(span!==sec.span){ sec.span=span; comp.style.gridColumn='span '+span; const ch=comp.querySelector('.chart'); const inst=ch&&echarts.getInstanceByDom(ch); if(inst)try{inst.resize()}catch(x){} const dt=comp.querySelector('.dtree'); if(dt)drawTreeLinks(dt); } };
    const up=ev=>{ handle.releasePointerCapture(e.pointerId); handle.removeEventListener('pointermove',move); handle.removeEventListener('pointerup',up); };
    handle.addEventListener('pointermove',move); handle.addEventListener('pointerup',up);
  });
}
function bindResizeY(handle,comp,sec){
  handle.addEventListener('pointerdown',e=>{
    e.preventDefault();
    const chart=comp.querySelector('.chart'); const dtree=comp.querySelector('.dtree'); const target=chart||dtree||comp.querySelector('.comp-body'); if(!target)return;
    const startY=e.clientY; const startH=target.getBoundingClientRect().height;
    handle.setPointerCapture(e.pointerId);
    const move=ev=>{ let h=startH+(ev.clientY-startY); h=Math.max(120,Math.min(900,h)); sec.h=Math.round(h);
      if(dtree){ dtree.style.minHeight=sec.h+'px'; drawTreeLinks(dtree); }
      else { target.style.height=sec.h+'px'; if(!chart){ target.style.overflow='auto'; } }
      if(chart){ const inst=echarts.getInstanceByDom(chart); if(inst)try{inst.resize()}catch(x){} } };
    const up=ev=>{ handle.releasePointerCapture(e.pointerId); handle.removeEventListener('pointermove',move); handle.removeEventListener('pointerup',up); };
    handle.addEventListener('pointermove',move); handle.addEventListener('pointerup',up);
  });
}

/* 拖动调整组件位置（HTML5 拖拽；抓手在组件头 .drag-h，落点按目标左右半区决定插到前/后，重排后走 normalizeLayout 重新铺满） */
function clearDropMarks(){ document.querySelectorAll('.comp.drop-before,.comp.drop-after').forEach(c=>c.classList.remove('drop-before','drop-after')); }
function reorderSections(fromId,toId,after){
  const secs=APP.dashboard&&APP.dashboard.sections; if(!secs)return;
  if(fromId===toId){ renderDashboard(); return; }
  const from=secs.findIndex(s=>s.id===fromId); if(from<0)return;
  const [moved]=secs.splice(from,1);
  let to=secs.findIndex(s=>s.id===toId);
  if(to<0){ secs.splice(from,0,moved); return; } // 目标不在则回退
  secs.splice(after?to+1:to,0,moved);
  renderDashboard();
}
function bindDrag(comp,grip,sec){
  if(!grip)return;
  grip.addEventListener('dragstart',e=>{
    APP.dragSid=sec.id;
    try{ e.dataTransfer.effectAllowed='move'; e.dataTransfer.setData('text/plain',sec.id); }catch(_){}
    try{ e.dataTransfer.setDragImage(comp,24,20); }catch(_){}
    setTimeout(()=>comp.classList.add('dragging'),0);
  });
  grip.addEventListener('dragend',()=>{ comp.classList.remove('dragging'); clearDropMarks(); APP.dragSid=null; });
  const sideAfter=e=>{ const r=comp.getBoundingClientRect(); return e.clientX> r.left+r.width/2; };
  comp.addEventListener('dragover',e=>{
    if(!APP.dragSid||APP.dragSid===sec.id)return;
    e.preventDefault(); try{e.dataTransfer.dropEffect='move';}catch(_){}
    const after=sideAfter(e);
    comp.classList.toggle('drop-after',after); comp.classList.toggle('drop-before',!after);
  });
  comp.addEventListener('dragleave',()=>{ comp.classList.remove('drop-before','drop-after'); });
  comp.addEventListener('drop',e=>{
    if(!APP.dragSid||APP.dragSid===sec.id){ comp.classList.remove('drop-before','drop-after'); return; }
    e.preventDefault();
    const from=APP.dragSid, after=sideAfter(e);
    comp.classList.remove('drop-before','drop-after');
    reorderSections(from,sec.id,after);
  });
}

/* =========================================================================
   [SWITCHER] 切换数据集 + CSV 占位
   ========================================================================= */
function openModal(html){ const root=$('#modalRoot'); root.innerHTML=`<div class="mask" id="mask">${html}</div>`;
  root.querySelector('#mask').onclick=e=>{ if(e.target.id==='mask') closeModal(); }; }
function closeModal(){ $('#modalRoot').innerHTML=''; }
function openSwitcher(){
  const opts=DS_ORDER.map(id=>{const x=DATASETS[id];return `<div class="ds-opt ${id===APP.datasetId?'on':''}" data-id="${id}">
    <div class="oi">DS</div><div><div class="on-name">${x.name}</div><div class="on-meta">适用：${x.scenarios}</div></div><span class="tag-type">${x.type}</span></div>`;}).join('')
    +`<div class="ds-opt" data-id="__csv__"><div class="oi">⬆</div><div><div class="on-name">自定义上传 CSV</div><div class="on-meta">适用：临时数据分析</div></div><span class="tag-type">用户上传</span></div>`;
  openModal(`<div class="modal"><div class="m-head"><div class="t">切换数据集</div><button class="x" onclick="closeModal()">×</button></div>
    <div class="m-body">${opts}</div></div>`);
  $('#modalRoot').querySelectorAll('.ds-opt').forEach(o=>o.onclick=()=>{ const id=o.dataset.id; if(id==='__csv__'){closeModal();openCsv();return;} switchDataset(id); });
}
function switchDataset(id){
  if(id===APP.datasetId){ closeModal(); return; }
  const had=!!APP.dashboard; const oldName=ds().name;
  APP.datasetId=id; APP.chatHistory=[]; APP.pending=null; const d=ds();
  renderDatasetCard(); renderQuick(); closeModal();
  addMsg('system',`已切换数据集：${oldName} → ${d.name}`);
  if(had){
    APP.dashboard=null; renderEmpty();
    addMsg('ai',`已切换为「${d.name}」。当前字段适合生成${d.scenarios}相关看板。原看板字段与新数据集差异较大，建议基于新数据集重新生成。`);
    $('#canvas').innerHTML=`<div class="empty"><div class="art">DS</div><h2>数据集已切换</h2>
      <p>新数据集与原看板场景差异较大，建议基于「${d.name}」重新生成看板。</p>
      <div class="eg"><span class="e" id="regenNew">基于新数据集重新生成</span></div></div>`;
    $('#regenNew').onclick=()=>{ $('#input').value=`生成${d.scenarios.split(' / ')[0]}分析看板`; send(); };
    updateToolbar(null);
  } else {
    addMsg('ai',`已加载「${d.name}」。可用指标：${d.metrics.map(m=>m.name).join('、')}。你可以说「帮我生成看板」开始。`);
  }
}
/* =========================================================================
   [CSV] 真实 CSV 上传：解析 + 字段类型识别 + 构造真实数据集
   ========================================================================= */
function parseCSV(text){
  text=String(text).replace(/^﻿/,'');
  const rows=[]; let row=[], cur='', q=false;
  for(let i=0;i<text.length;i++){ const c=text[i];
    if(q){ if(c==='"'){ if(text[i+1]==='"'){cur+='"';i++;} else q=false; } else cur+=c; }
    else if(c==='"') q=true;
    else if(c===',') { row.push(cur); cur=''; }
    else if(c==='\n'){ row.push(cur); rows.push(row); row=[]; cur=''; }
    else if(c==='\r'){ /* skip */ }
    else cur+=c;
  }
  if(cur.length||row.length){ row.push(cur); rows.push(row); }
  return rows.filter(r=>r.length&&!(r.length===1&&String(r[0]).trim()===''));
}
function csvNum(s){ const v=parseFloat(String(s==null?'':s).replace(/[,¥$%\s，]/g,'')); return isNaN(v)?0:v; }
function cssId(h){ return String(h).replace(/[^a-zA-Z0-9]/g,'_'); }
function detectType(header, vals){
  const s=vals.map(v=>String(v==null?'':v).trim()).filter(v=>v!=='').slice(0,60);
  if(!s.length) return 'dim';
  const dateRe=/^\d{4}[-/.]\d{1,2}([-/.]\d{1,2})?$|^\d{1,2}[-/]\d{1,2}$/;
  const numRe=/^-?[\d,]+(\.\d+)?%?$/;
  const dshare=s.filter(v=>dateRe.test(v)).length/s.length;
  const nshare=s.filter(v=>numRe.test(v.replace(/[¥$\s，,]/g,m=>m===','||m==='，'?',':''))).length/s.length;
  if(dshare>=0.6) return 'date';
  if(/日期|时间|date|datetime/i.test(header)&&dshare>=0.3) return 'date';
  if(nshare>=0.7) return 'metric';
  return 'dim';
}
function prepGrid(name, grid){
  if(grid.length<2) throw new Error('至少需要表头 + 一行数据');
  const headers=grid[0].map((h,i)=>(String(h==null?'':h).trim())||('列'+(i+1)));
  const rows=grid.slice(1).filter(r=>r.some(c=>String(c==null?'':c).trim()!==''));
  const typeMap={}; headers.forEach((h,i)=>{ typeMap[h]=detectType(h, rows.map(r=>r[i])); });
  return {name,headers,rows,typeMap};
}
function prepCSV(name, text){ return prepGrid(name, parseCSV(text)); }
function prepXLSX(name, buf){
  if(typeof XLSX==='undefined') throw new Error('xlsx 解析库未加载（可能网络限制），请改用 CSV');
  const wb=XLSX.read(new Uint8Array(buf), {type:'array'});
  const ws=wb.Sheets[wb.SheetNames[0]];
  if(!ws) throw new Error('Excel 里没有可用的工作表');
  const grid=XLSX.utils.sheet_to_json(ws, {header:1, defval:'', raw:false, blankrows:false});
  return prepGrid(name, grid);
}
function renderCsvTypes(p){
  const opt=(cur,v,label)=>`<option value="${v}" ${cur===v?'selected':''}>${label}</option>`;
  const body=p.headers.map((h,i)=>{ const t=p.typeMap[h];
    const sample=p.rows.slice(0,3).map(r=>r[i]).filter(x=>String(x||'').trim()!=='').join('、').slice(0,42);
    return `<tr><td style="padding:6px 8px;font-weight:600">${h}</td>
      <td style="padding:6px 8px;color:var(--dd-color-text-tertiary);font-size:11.5px">${sample||'—'}</td>
      <td style="padding:6px 8px"><select class="set-select" id="ct_${cssId(h)}" style="padding:5px 8px;font-size:12px">
        ${opt(t,'metric','指标(数值)')}${opt(t,'dim','维度(分类)')}${opt(t,'date','日期')}${opt(t,'ignore','忽略')}</select></td></tr>`;}).join('');
  $('#csvResult').innerHTML=`<div class="set-label" style="margin-top:14px">识别到 ${p.headers.length} 列，请确认字段类型</div>
    <div style="max-height:220px;overflow:auto;border:1px solid var(--dd-color-border);border-radius:var(--dd-radius-md)">
    <table class="tbl" style="font-size:12.5px"><thead><tr><th style="padding:6px 8px">列名</th><th style="padding:6px 8px">样例</th><th style="padding:6px 8px">类型</th></tr></thead>
    <tbody>${body}</tbody></table></div>`;
}
function buildDatasetFromCSV(name, headers, rows, typeMap){
  const idx={}; headers.forEach((h,i)=>idx[h]=i);
  const metricCols=headers.filter(h=>typeMap[h]==='metric');
  const dimCols=headers.filter(h=>typeMap[h]==='dim');
  const dateCol=headers.find(h=>typeMap[h]==='date');
  const idLike=/代码|编码|编号|证号|序号|排名|序列|rank|code|(^|[^a-z])id([^a-z]|$)/i;
  const isPct=h=>/率|占比|比率|ratio/i.test(h);          // 率/占比 → 取平均 + %
  const isAvg=h=>/单价|均价|平均|人均|avg/i.test(h);      // 客单价/均价 → 取平均
  const cardOf=h=>{ const s=new Set(); for(const r of rows){ const v=String(r[idx[h]]||'').trim(); if(v){ s.add(v); if(s.size>80)break; } } return s.size; };
  const pm=metricCols.filter(h=>!idLike.test(h)&&!isPct(h)&&!isAvg(h))[0]||metricCols.filter(h=>!idLike.test(h))[0]||metricCols[0];   // 主指标：可求和的量优先，跳过 ID/率/均价
  const dimCard=dimCols.map(h=>({h,c:cardOf(h)}));
  const lowCard=dimCard.filter(x=>x.c>=2&&x.c<=40).sort((a,b)=>a.c-b.c).map(x=>x.h);   // 适合对比/构成
  const bdDims=(lowCard.length?lowCard:dimCols).slice(0,3);
  const rkDim=dimCard.filter(x=>x.c>40).sort((a,b)=>b.c-a.c).map(x=>x.h)[0]||lowCard[0]||dimCols[0];   // 高基数适合排行
  const fmt=n=>{ n=Math.round(n*100)/100; return n.toLocaleString('en-US'); };
  const avgOf=h=>{ const v=rows.map(r=>csvNum(r[idx[h]])); return v.reduce((s,x)=>s+x,0)/(v.length||1); };
  const metrics=metricCols.map(h=>{
    if(isPct(h)) return {key:h,name:h,val:(Math.round(avgOf(h)*100)/100)+'%',delta:'—',up:true, format:'raw'};
    if(isAvg(h)) return {key:h,name:h,val:fmt(Math.round(avgOf(h)*100)/100),delta:'—',up:true};
    // 这里把 CSV 数值先格式化成字符串，KPI 组件会做“万/亿”换算展示
    return {key:h,name:h,val:fmt(rows.reduce((s,r)=>s+csvNum(r[idx[h]]),0)),delta:'—',up:true};
  });
  const dimensions=dimCols.map(h=>({key:h,name:h}));
  const dateFields=dateCol?[{key:dateCol,name:dateCol}]:[];
  const dims={};
  dimCols.forEach(h=>{ const m=new Map();
    rows.forEach(r=>{ const k=(String(r[idx[h]]||'').trim())||'—'; m.set(k,(m.get(k)||0)+(pm?csvNum(r[idx[pm]]):1)); });
    dims[h]=[...m.entries()].map(([nm,v])=>({name:nm,v:Math.round(v*100)/100})).sort((a,b)=>b.v-a.v).slice(0,8); });
  let series={}, days=null;
  if(dateCol){ days=[...new Set(rows.map(r=>String(r[idx[dateCol]]||'').trim()).filter(Boolean))].sort();
    metricCols.forEach(h=>{ const m=new Map(days.map(d=>[d,0]));
      rows.forEach(r=>{ const d=String(r[idx[dateCol]]||'').trim(); if(m.has(d))m.set(d,m.get(d)+csvNum(r[idx[h]])); });
      series[h]=days.map(d=>Math.round(m.get(d)*100)/100); }); }
  const rankDim=rkDim;
  const rankCols= rankDim?[rankDim, ...(pm?[pm]:['计数'])]:['项目','数值'];
  const rankRows= rankDim?(dims[rankDim]||[]).slice(0,6).map(x=>[x.name,x.v]):[['—',0]];
  const detCols=headers.slice(0,7);
  const detailRows=rows.slice(0,8).map(r=>detCols.map(h=> typeMap[h]==='metric'?csvNum(r[idx[h]]):(String(r[idx[h]]??'')) ));
  return { id:'csv_'+Date.now().toString(36), name, source:'用户上传 · '+rows.length+' 行 / '+headers.length+' 列',
    type:'用户上传', scenarios:'自定义数据分析', status:[],
    metrics, dimensions, dateFields,
    primaryMetric: pm||(dimensions[0]&&dimensions[0].key)||null,
    breakdownDims: bdDims, rankDim: rankDim||pm||null,
    defaultTitle: name+' 分析看板', defaultDesc:'基于上传的「'+name+'」数据生成',
    series, days, dims,
    raw:{ rows, idx },
    rankCols, rankRows, detailCols:detCols.length?detCols:['列1'], detailRows:detailRows.length?detailRows:[['—']] };
}
function openCsv(){
  openModal(`<div class="modal"><div class="m-head"><div class="t">上传 CSV / Excel 数据源</div><button class="x" onclick="closeModal()">×</button></div>
    <div class="m-body">
      <div class="csv-drop" id="csvDrop">拖拽 CSV / Excel 到此处，或 <b>点击选择文件</b>
        <div style="margin-top:8px;font-size:11.5px">支持 .csv（UTF-8）与 .xlsx / .xls，自动识别 指标 / 维度 / 日期，可手动调整</div></div>
      <input type="file" id="csvFile" accept=".csv,.xlsx,.xls,.xlsm,text/csv" style="display:none">
      <div id="csvResult"></div>
    </div>
    <div class="m-foot"><button class="tbtn" onclick="closeModal()">取消</button>
      <button class="tbtn primary" id="csvConfirm" style="display:none">确认并生成数据集</button></div></div>`);
  const drop=$('#csvDrop'), file=$('#csvFile'); let parsed=null;
  const handle=(f)=>{ if(!f)return;
    const isXlsx=/\.(xlsx|xls|xlsm)$/i.test(f.name);
    const isCsv=/\.csv$/i.test(f.name)||f.type==='text/csv';
    if(!isXlsx&&!isCsv){ toast('请选择 .csv 或 .xlsx / .xls 文件'); return; }
    drop.innerHTML='正在解析 '+f.name+' ...';
    const rd=new FileReader();
    rd.onload=()=>{ try{
        parsed = isXlsx ? prepXLSX(f.name, rd.result) : prepCSV(f.name, String(rd.result));
        renderCsvTypes(parsed);
        drop.innerHTML='已选择：<b>'+f.name+'</b>（'+parsed.rows.length+' 行 / '+parsed.headers.length+' 列）· 可再次点击更换';
        $('#csvConfirm').style.display='inline-block';
      }catch(e){ drop.innerHTML='解析失败：'+String(e.message||e).slice(0,80); $('#csvResult').innerHTML=''; $('#csvConfirm').style.display='none'; } };
    rd.onerror=()=>{ drop.innerHTML='读取文件失败，请重试'; };
    if(isXlsx) rd.readAsArrayBuffer(f); else rd.readAsText(f,'utf-8'); };
  drop.onclick=()=>file.click();
  file.onchange=()=>handle(file.files[0]);
  ['dragover','dragenter'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.style.borderColor='var(--dd-color-primary)';drop.style.background='var(--dd-color-primary-soft)';}));
  ['dragleave'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.style.borderColor='';drop.style.background='';}));
  drop.addEventListener('drop',e=>{ e.preventDefault(); drop.style.borderColor=''; drop.style.background=''; handle(e.dataTransfer.files&&e.dataTransfer.files[0]); });
  $('#csvConfirm').onclick=()=>{
    if(!parsed)return;
    const tm={}; parsed.headers.forEach(h=>{ const sel=document.getElementById('ct_'+cssId(h)); tm[h]=sel?sel.value:parsed.typeMap[h]; });
    if(!parsed.headers.some(h=>tm[h]==='metric')){ toast('至少需要一个「指标(数值)」列'); return; }
    const dsObj=buildDatasetFromCSV(parsed.name.replace(/\.(csv|xlsx|xls|xlsm)$/i,''), parsed.headers, parsed.rows, tm);
    DATASETS[dsObj.id]=dsObj; if(!DS_ORDER.includes(dsObj.id))DS_ORDER.push(dsObj.id);
    APP.datasetId=dsObj.id; APP.dashboard=null; APP.chatHistory=[]; APP.pending=null;
    renderDatasetCard(); renderQuick(); renderEmpty(); closeModal();
    addMsg('system','已上传并识别数据集：'+dsObj.name);
    addMsg('ai',`已从上传文件生成数据集「${dsObj.name}」：<b>${dsObj.metrics.length}</b> 指标 / <b>${dsObj.dimensions.length}</b> 维度${dsObj.dateFields.length?' / 含日期':''}。可用指标：${dsObj.metrics.map(m=>m.name).join('、')||'—'}。直接说<b>「帮我生成看板」</b>或描述你想看的分析。`);
    toast('数据集已生成');
  };
}

/* 重新生成 */
function regen(){
  $('#input').value=APP.dashboard?`请基于当前「${APP.dashboard.title}」重新生成看板，先给方案，确认后生成`:'帮我生成看板';
  send();
}

/* 上下分区可拖拽分隔条 */
function bindChatDivider(){
  const chat=document.querySelector('.chat'), top=$('#chatTop'), divider=$('#chatDivider');
  if(!divider||!top||!chat)return;
  divider.addEventListener('pointerdown',e=>{
    e.preventDefault(); divider.classList.add('dragging'); divider.setPointerCapture(e.pointerId);
    const startY=e.clientY, startH=top.getBoundingClientRect().height, chatH=chat.getBoundingClientRect().height;
    const move=ev=>{ let h=startH+(ev.clientY-startY);
      const min=120, max=Math.max(min,chatH-260); // 底部至少给对话+输入框留 260px
      h=Math.max(min,Math.min(max,h)); top.style.height=h+'px'; };
    const up=()=>{ divider.classList.remove('dragging'); try{divider.releasePointerCapture(e.pointerId)}catch(x){}
      divider.removeEventListener('pointermove',move); divider.removeEventListener('pointerup',up); };
    divider.addEventListener('pointermove',move); divider.addEventListener('pointerup',up);
  });
}

/* =========================================================================
   [INIT]
   ========================================================================= */
function init(){
  APP.llm=loadLLM(); APP.themeMode=loadThemeMode();
  renderDatasetCard(); renderQuick(); renderEmpty(); bindChatDivider(); renderLLMStatus(); bindThemeSwitch();
  addMsg('ai', llmOn()
    ? `你好，已接入 <b>${LLM_PROVIDERS[APP.llm.provider].name}</b>。我会先和你<b>对话确认需求</b>，等你点「确认生成」再出看板。说说你想基于「${ds().name}」看什么？`
    : '你好，我已加载「电商经营明细数据集」，当前是<b>离线智能模式</b>。我会先给你方案，你确认后再生成看板。需要更强理解力时，可在下方打开<b>模型设置</b>接入大模型。说说你想看什么？');
  $('#sendBtn').onclick=send;
  $('#llmSetBtn').onclick=openSettings;
  $('#input').addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();} });
  window.addEventListener('resize',()=>{APP.charts.forEach(c=>{try{c.resize()}catch(e){}});document.querySelectorAll('.dtree').forEach(drawTreeLinks);});
}
init();
