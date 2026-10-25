(function(){
'use strict';
var T=window.TESTS||[], app=document.getElementById('app');
var COLORS=['#5bb36a','#3f9bd6','#9b6bd0','#e8734a','#e3a72f'];
var LEVELS=[
 {t:'مرحلهٔ ۱',d:'آزمون‌های ۱ تا ۸ · شروع و آشنایی'},
 {t:'مرحلهٔ ۲',d:'آزمون‌های ۹ تا ۱۶ · تمرین بیشتر'},
 {t:'مرحلهٔ ۳',d:'آزمون‌های ۱۷ تا ۲۴ · تسلط'},
 {t:'مرحلهٔ ۴',d:'آزمون‌های ۲۵ تا ۳۲ · سرعت و دقت'},
 {t:'مرحلهٔ ۵',d:'آزمون‌های ۳۳ تا ۴۰ · آمادهٔ روز امتحان'}];
var IMGS=['assets/img/speak.webp','assets/img/daily.webp'];
function fa(n){return String(n).replace(/\d/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'[d]})}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function col(i){return COLORS[Math.floor(i/8)%5]}
function getBest(i){try{return JSON.parse(localStorage.getItem('azs-best-'+i))}catch(e){return null}}
function setBest(i,s){var b=getBest(i);if(!b||s>b.s){localStorage.setItem('azs-best-'+i,JSON.stringify({s:s,d:Date.now()}))}}
var BY='<p class="by" style="margin-bottom:0"><span class="fa">ساخته شده توسط</span> <span class="nl">Daniel Mozafari</span></p><p class="by" style="margin-top:0;font-size:15px">Made by Daniel Mozafari</p>';
function footer(){return '<footer><div class="rule"></div>'+
 '<div class="qrbox"><img src="qr.png" alt="QR code آزمون سفارت" width="170" height="201" loading="lazy"></div>'+
 '<p>این QR را اسکن کنید یا برای دوستانتان بفرستید.</p>'+
 '<p><b>ساخته شده توسط Daniel Mozafari</b> · Made by Daniel Mozafari</p>'+
 '<p class="hint">سؤال‌ها بر اساس فهرست سؤال‌ها و جمله‌های آزمون Spreekvaardigheid A1 (DUO) ساخته شده‌اند.</p></footer>'}
function home(){
 document.title='آزمون سفارت – تمرین آزمون هلندی A1';
 var h='<header class="top"><a class="home" href="#">🌷 آزمون سفارت</a><span class="by">Made by Daniel Mozafari</span></header>'+
 '<div class="hero"><img src="assets/img/hero.webp" alt="خانه‌های رنگی کنار کانال، آسیاب بادی و گل‌های لاله" width="1280" height="720">'+
 '<h1>آزمون سفارت</h1><p class="sub nl">Spreekvaardigheid A1 · Oefenexamens</p>'+BY+
 '<p class="lead">۴۰ آزمون تعاملی، هر کدام ۳۰ سؤال چهارگزینه‌ای، برای آمادگی کامل در آزمون گفتاری هلندی A1 در سفارت هلند. آن‌قدر تمرین کنید که روز امتحان با اعتمادبه‌نفس کامل جواب بدهید! 💪</p>'+
 '<a class="btn" href="#test-'+(nextTodo()+1)+'">شروع آزمون '+fa(nextTodo()+1)+'</a></div>'+
 '<div class="rule"></div>'+
 '<div class="card"><h2>آزمون سفارت چطور است؟</h2><div class="info"><img src="assets/img/speak.webp" alt="" width="120" height="90" loading="lazy"><div>'+
 '<p><span class="pill" style="background:#e8734a">بخش A</span>از شما <b>۱۰ سؤال</b> کوتاه دربارهٔ خودتان پرسیده می‌شود (مثلاً <span class="nl">Waar woont u?</span>).</p>'+
 '<p><span class="pill" style="background:#3f9bd6">بخش B</span><b>۱۲ جملهٔ ناقص</b> (<span class="nl">aanvulzinnen</span>) با یک عکس می‌بینید و باید جمله را کامل کنید.</p>'+
 '<p>جواب با <b>۱ یا ۲ کلمه</b> کافی است. حرف تعریف (<span class="nl">de / het / een</span>) و دستور زبان کامل در سطح A1 مهم نیست.</p></div></div></div>'+
 '<div class="card"><h2>چطور تمرین کنم؟</h2><ul class="steps">'+
 '<li>یک آزمون را باز کنید و هر ۳۰ سؤال را جواب بدهید. تا قبل از دیدن نتیجه می‌توانید جوابتان را عوض کنید.</li>'+
 '<li>زیر سؤال ۳۰ دکمهٔ «نمایش نتیجه» را بزنید: تعداد جواب‌های درست و غلط و جواب صحیحِ سؤال‌های غلط نمایش داده می‌شود.</li>'+
 '<li>جواب‌های درست را بلند بخوانید؛ در سفارت باید جواب را <b>بگویید</b>.</li>'+
 '<li>هر آزمون را آن‌قدر تکرار کنید تا بالای ۹۰٪ بگیرید. بهترین نمره‌تان ذخیره می‌شود.</li></ul>'+
 '<div class="install">📱 <b>نصب مثل اپلیکیشن:</b> در آیفون (Safari) دکمهٔ اشتراک‌گذاری ⬆️ و بعد «Add to Home Screen» را بزنید. در اندروید (Chrome) منوی ⋮ و بعد «Add to Home screen» یا «Install app» را بزنید. بعد از اولین باز شدن، آزمون‌ها بدون اینترنت هم کار می‌کنند.</div></div>';
 var done=0,sum=0;
 for(var i=0;i<T.length;i++){var b=getBest(i);if(b){done++;sum+=b.s}}
 if(done) h+='<div class="card" style="text-align:center"><b>پیشرفت شما:</b> '+fa(done)+' از '+fa(T.length)+' آزمون انجام شده · میانگین بهترین نمره‌ها '+fa(Math.round(sum/done/30*100))+'٪</div>';
 for(var L=0;L<5;L++){
  h+='<section><div class="lh"><h2>'+LEVELS[L].t+'</h2><span class="pill" style="background:'+COLORS[L]+'">'+fa(L*8+1)+'–'+fa(L*8+8)+'</span><span class="ld">'+LEVELS[L].d+'</span></div><ul class="tests">';
  for(var j=L*8;j<L*8+8&&j<T.length;j++){
   var b=getBest(j);
   h+='<li class="tc" style="--c:'+col(j)+'"><a href="#test-'+(j+1)+'"><span class="tn">آزمون '+fa(j+1)+'</span><span class="ts">۳۰ سؤال · بخش A و B</span><br>'+
    (b?'<span class="best'+(b.s>=27?' ok':'')+'">بهترین: '+fa(b.s)+'/۳۰ '+(b.s>=27?'⭐':'')+'</span>':'<span class="best">انجام نشده</span>')+'</a></li>';
  }
  h+='</ul></section>';
 }
 h+='<div class="card info" style="margin-top:28px"><img src="assets/img/daily.webp" alt="" width="120" height="90" loading="lazy"><div><h2>نکتهٔ روز امتحان</h2><p>اگر سؤال را نفهمیدید، آرام بگویید: <span class="nl"><b>Kunt u dat herhalen, alstublieft?</b></span> (می‌شود تکرار کنید؟). جواب کوتاه و واضح بدهید؛ یک یا دو کلمه کافی است.</p></div></div>';
 app.innerHTML=h+footer(); window.scrollTo(0,0);
}
function nextTodo(){for(var i=0;i<T.length;i++){if(!getBest(i))return i}return 0}
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
var cur=null;
function test(n){
 var qs=T[n]; if(!qs){location.hash='';return}
 document.title='آزمون '+fa(n+1)+' – آزمون سفارت';
 // per-attempt option order
 cur={n:n,ans:{},done:false,ord:qs.map(function(q){return shuffle([0,1,2,3])})};
 var c=col(n);
 var h='<header class="top"><a class="home" href="#">→ همهٔ آزمون‌ها</a><span class="by">Made by Daniel Mozafari</span></header>'+
 '<div class="thead"><span class="no">آزمون '+fa(n+1)+'</span><span class="meta">از '+fa(T.length)+' · ۳۰ سؤال چهارگزینه‌ای</span></div>'+
 '<img class="scene" src="'+IMGS[n%2]+'" alt="" width="720" height="540">'+
 '<p class="hint">روی گزینهٔ درست بزنید. تا قبل از «نمایش نتیجه» می‌توانید جواب را عوض کنید.</p>'+
 '<div class="progress"><div class="track"><div class="fill" id="pf"></div></div><div class="lbl" id="pl"></div></div><div id="qs">';
 var lastSec='';
 qs.forEach(function(q,i){
  var sec=q.t==='B'?'B':'A';
  if(sec!==lastSec){h+='<div class="sec">'+(sec==='A'?'بخش A · سؤال‌ها (Vragen)':'بخش B · جمله‌های ناقص (Aanvulzinnen)')+'</div>';lastSec=sec}
  var kind=q.t==='A'?'به سؤال جواب بدهید':q.t==='R'?'کدام سؤال با این جواب جور است؟':'جمله را کامل کنید';
  var stem=q.t==='R'?'<span class="nl">Antwoord: <b>«'+esc(q.q)+'»</b></span>':'<span class="nl">'+esc(q.q)+'</span>';
  h+='<div class="q" id="q'+i+'" style="--c:'+c+'"><div class="qh"><span class="qn">'+fa(i+1)+'</span><span class="qk">'+kind+'</span></div>'+
   '<div class="qt" dir="ltr" style="text-align:left">'+stem+'</div><div class="opts">';
  cur.ord[i].forEach(function(oi,k){
   h+='<button type="button" class="opt" data-q="'+i+'" data-o="'+oi+'"><span class="L">'+'ABCD'[k]+'</span><span>'+esc(q.o[oi])+'</span><span class="mk"></span></button>';
  });
  h+='</div><div class="fb"></div></div>';
 });
 h+='</div><div class="submit" id="sub"><button class="btn green" id="show">نمایش نتیجه</button><p class="hint" id="left"></p></div><div id="res"></div>'+
 '<div class="acts" style="margin-top:6px"><a class="btn ghost" href="#">همهٔ آزمون‌ها</a></div>';
 app.innerHTML=h+footer(); window.scrollTo(0,0);
 prog();
}
function prog(){
 var k=Object.keys(cur.ans).length,tot=T[cur.n].length;
 var pf=document.getElementById('pf'),pl=document.getElementById('pl'),lf=document.getElementById('left');
 if(pf)pf.style.width=(k/tot*100)+'%';
 if(pl)pl.textContent=fa(k)+' از '+fa(tot)+' سؤال جواب داده شده';
 if(lf)lf.textContent=k<tot?fa(tot-k)+' سؤال هنوز بی‌پاسخ است (بی‌پاسخ‌ها غلط حساب می‌شوند).':'همهٔ سؤال‌ها جواب داده شده‌اند 👍';
}
function show(){
 var qs=T[cur.n],ok=0,un=0,wrongs=[];
 cur.done=true; document.getElementById('qs').classList.add('done');
 qs.forEach(function(q,i){
  var el=document.getElementById('q'+i),a=cur.ans[i];
  var btns=el.querySelectorAll('.opt');
  btns.forEach(function(b){var o=+b.dataset.o;b.disabled=true;
   if(o===q.c){b.classList.add('right');b.querySelector('.mk').textContent='✓'}
   else if(o===a){b.classList.add('wrong');b.querySelector('.mk').textContent='✗'}});
  var fb=el.querySelector('.fb');
  if(a===q.c){ok++;el.classList.add('isright');fb.innerHTML='<span style="color:#2f7a3e">✅ درست!</span>'}
  else{el.classList.add('iswrong');if(a===undefined)un++;
   fb.innerHTML=(a===undefined?'⚪ بی‌پاسخ · ':'❌ غلط · ')+'جواب درست: <b class="nl">'+esc(q.o[q.c])+'</b>';
   wrongs.push({i:i,q:q,a:a});}
 });
 var tot=qs.length,bad=tot-ok,pct=Math.round(ok/tot*100);
 setBest(cur.n,ok);
 var msg=pct>=90?'عالی! 🎉 شما برای روز امتحان آماده‌اید.':pct>=70?'خیلی خوب! 👏 جواب‌های غلط را مرور کنید و دوباره امتحان کنید.':pct>=50?'خوب است! 🙂 با چند بار تکرار بهتر می‌شود.':'نگران نباشید! 🌱 جواب‌های درست را بلند بخوانید و دوباره تلاش کنید.';
 var h='<div class="result" id="result"><h2>نتیجهٔ آزمون '+fa(cur.n+1)+'</h2><div class="score">'+fa(pct)+'٪</div>'+
 '<div class="stats"><div class="stat g"><b>'+fa(ok)+'</b>درست</div><div class="stat r"><b>'+fa(bad)+'</b>غلط</div>'+(un?'<div class="stat y"><b>'+fa(un)+'</b>بی‌پاسخ (جزو غلط‌ها)</div>':'')+'</div>'+
 '<p class="msg">'+msg+'</p>';
 if(wrongs.length){
  h+='<h3 style="margin:14px 0 0;text-align:start">جواب صحیحِ سؤال‌های غلط:</h3><ul class="wl">';
  wrongs.forEach(function(w){
   var stem=w.q.t==='R'?'Antwoord: «'+w.q.q+'»':w.q.q;
   h+='<li><a href="#q'+w.i+'" data-jump="'+w.i+'">سؤال '+fa(w.i+1)+'</a><span class="nl" dir="ltr" style="text-align:left">'+esc(stem)+'</span>'+
    '<span class="nl" dir="ltr" style="text-align:left">'+(w.a!==undefined?'<span class="no">'+esc(w.q.o[w.a])+'</span> → ':'')+'<span class="ok">✓ '+esc(w.q.o[w.q.c])+'</span></span></li>';
  });
  h+='</ul>';
 } else h+='<p>هیچ جواب غلطی ندارید! ⭐</p>';
 var nx=cur.n+1<T.length?cur.n+2:1;
 h+='<div class="acts"><button class="btn" id="retry">🔄 تکرار این آزمون</button><a class="btn blue" href="#test-'+nx+'">آزمون بعدی ('+fa(nx)+') ←</a></div></div>';
 document.getElementById('sub').style.display='none';
 document.getElementById('res').innerHTML=h;
 document.getElementById('result').scrollIntoView({behavior:'smooth',block:'start'});
}
app.addEventListener('click',function(e){
 var b=e.target.closest('.opt');
 if(b&&cur&&!cur.done){var i=+b.dataset.q;cur.ans[i]=+b.dataset.o;
  b.parentNode.querySelectorAll('.opt').forEach(function(x){x.classList.toggle('sel',x===b)});prog();return}
 if(e.target.id==='show'){show();return}
 if(e.target.id==='retry'){test(cur.n);return}
 var j=e.target.closest('[data-jump]');
 if(j){e.preventDefault();document.getElementById('q'+j.dataset.jump).scrollIntoView({behavior:'smooth',block:'center'})}
});
function route(){var m=location.hash.match(/^#test-(\d+)/);if(m)test(+m[1]-1);else{cur=null;home()}}
window.addEventListener('hashchange',route);route();
if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})})}
})();
