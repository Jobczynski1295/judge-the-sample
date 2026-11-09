// Shared, browser-only sampling calculations for Judge the Sample.
export const mean = values => values.reduce((a,b)=>a+b,0)/values.length;
export const trueMean = rows => mean(rows.map(r=>r.charges));
export function rng(seed) {
  let x = (Number(seed) >>> 0) || 1;
  return () => { x += 0x6D2B79F5; let t=x; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; };
}
function requireN(rows,n) { if (!Number.isInteger(n)||n<1||n>rows.length) throw Error(`n must be between 1 and ${rows.length}`); }
export function srs(rows,n,random) {
  requireN(rows,n); const ids=Array.from({length:rows.length},(_,i)=>i);
  for(let i=0;i<n;i++){ const j=i+Math.floor(random()*(ids.length-i)); [ids[i],ids[j]]=[ids[j],ids[i]]; }
  return ids.slice(0,n).map(i=>rows[i]);
}
export function systematicInfo(N,n) { const k=N/n; return {k,exact:Number.isInteger(k)}; }
export function systematic(rows,n,random,startOverride=null) {
  requireN(rows,n); const {k,exact}=systematicInfo(rows.length,n);
  const start=startOverride===null?(exact?1+Math.floor(random()*k):random()*k):startOverride;
  if(exact && (!Number.isInteger(start)||start<1||start>k)) throw Error('Invalid exact start');
  const indices=Array.from({length:n},(_,j)=>exact?(start-1+j*k):Math.min(rows.length-1,Math.max(0,Math.ceil(start+j*k)-1)));
  if(new Set(indices).size!==n) throw Error('Systematic selection produced duplicate rows');
  return {sample:indices.map(i=>rows[i]),start,k,exact};
}
export function strata(rows,column='region') {
  const map=new Map(); rows.forEach(r=>{const v=String(r[column]);if(!map.has(v))map.set(v,[]);map.get(v).push(r);});return map;
}
export function allocation(rows,n,column='region') {
  requireN(rows,n); const groups=[...strata(rows,column)]; const H=groups.length;
  if(n<H) throw Error(`Stratified sampling needs n ≥ ${H} for at least one record per ${column} group.`);
  // Largest-remainder proportional allocation with minimum one and capacity constraints.
  const a=groups.map(([name,items])=>({name,N:items.length,ideal:n*items.length/rows.length,count:1}));
  let remaining=n-H;
  // Allocate remaining seats by capped largest-remainder on the residual targets.
  const capacity=a.map(g=>g.N-1);
  const targets=a.map(g=>Math.max(0,g.ideal-1));
  const total=targets.reduce((s,x)=>s+x,0);
  const quotas=targets.map((t,i)=>total?Math.min(capacity[i],remaining*t/total):0);
  const base=quotas.map((q,i)=>Math.min(capacity[i],Math.floor(q)));
  base.forEach((v,i)=>{a[i].count+=v;remaining-=v;});
  while(remaining>0){const eligible=a.map((g,i)=>({i,score:quotas[i]-(a[i].count-1),room:g.N-g.count})).filter(x=>x.room>0);eligible.sort((x,y)=>y.score-x.score||x.i-y.i);if(!eligible.length)throw Error('No remaining stratum capacity');a[eligible[0].i].count++;remaining--;}
  return a.map(g=>({...g,weight:g.N/rows.length}));
}
export function stratified(rows,n,random,column='region') {
  const groups=strata(rows,column);const alloc=allocation(rows,n,column);const selected=[];
  let estimate=0;
  for(const a of alloc){const part=srs(groups.get(a.name),a.count,random);selected.push(...part);estimate+=a.weight*mean(part.map(r=>r.charges));}
  return {sample:selected,estimate,alloc};
}
export function singleSample(rows,method,n,seed,column='region') {
  const random=rng(seed);if(method==='srs'){const sample=srs(rows,n,random);return {sample,estimate:mean(sample.map(r=>r.charges))};}
  if(method==='systematic'){const result=systematic(rows,n,random);return {...result,estimate:mean(result.sample.map(r=>r.charges))};}
  return stratified(rows,n,random,column);
}
export function summarize(estimates,truth) {
  const bias=mean(estimates)-truth;
  const sd=Math.sqrt(mean(estimates.map(v=>(v-mean(estimates))**2)));
  const rmse=Math.sqrt(mean(estimates.map(v=>(v-truth)**2)));
  return {bias,sd,rmse};
}
export function experiment(rows,method,n,seed,repetitions=100,column='region') {
  requireN(rows,n);const truth=trueMean(rows);const info=systematicInfo(rows.length,n);
  const exact=method==='systematic'&&info.exact;
  const estimates=[];const starts=[];
  if(exact){for(let start=1;start<=info.k;start++){const result=systematic(rows,n,()=>0,start);estimates.push(mean(result.sample.map(r=>r.charges)));starts.push(start);}}
  else {if(!Number.isInteger(repetitions)||repetitions<100||repetitions>1000)throw Error('Repetitions must be 100–1,000');const random=rng(seed);for(let i=0;i<repetitions;i++){
    if(method==='srs')estimates.push(mean(srs(rows,n,random).map(r=>r.charges)));
    else if(method==='systematic'){const result=systematic(rows,n,random);estimates.push(mean(result.sample.map(r=>r.charges)));}
    else estimates.push(stratified(rows,n,random,column).estimate);
  }}
  return {method,n,seed:exact?'exact':seed,type:exact?'exact':'Monte Carlo',count:estimates.length,estimates,starts,truth,...summarize(estimates,truth),settings:method==='stratified'?`${column}; proportional allocation`:method==='systematic'?`${info.exact?'integer':'fractional'} interval ${info.k.toFixed(4)}; file order`:'without replacement'};
}
