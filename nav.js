/* SNSアイコンの描画と、スマホ・タブレット用メニュー（幅1100px以下） */
(function(){
  /* 要差替：公式SNSのURL。空欄のあいだはアイコンを押すと「準備中」と表示し、どこにも移動しない
     URLを入れると新しいタブで開くリンクになる（ヘッダー・メニュー・フッターの3か所に一度に反映） */
  var SNS=[
    {id:'line',      name:'LINE',      url:''},
    {id:'instagram', name:'Instagram', url:''},
    {id:'x',         name:'X',         url:''},
    {id:'facebook',  name:'Facebook',  url:''},
    {id:'youtube',   name:'YouTube',   url:''},
    {id:'tiktok',    name:'TikTok',    url:''}
  ];

  function esc(t){ return String(t).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  var items=SNS.map(function(s){
    var pending=!s.url;
    return '<li><a class="sns-ico" data-sns="'+s.id+'" title="'+esc(s.name)+'" href="'+(pending?'#':esc(s.url))+'"'+
      (pending?' data-pending aria-label="'+esc(s.name)+'（準備中）"':' target="_blank" rel="noopener" aria-label="'+esc(s.name)+'（新しいタブで開く）"')+
      '><svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><use href="#ico-'+s.id+'"></use></svg></a></li>';
  }).join('');
  document.querySelectorAll('[data-sns-list]').forEach(function(ul){ ul.innerHTML=items; });

  var toast, timer;
  document.addEventListener('click',function(e){
    var a=e.target.closest && e.target.closest('.sns-ico[data-pending]'); if(!a) return;
    e.preventDefault();
    if(!toast){ toast=document.createElement('div'); toast.className='sns-toast'; toast.setAttribute('role','status'); document.body.appendChild(toast); }
    toast.textContent=a.title+'の公式アカウントは準備中です';
    toast.classList.add('on'); clearTimeout(timer);
    timer=setTimeout(function(){ toast.classList.remove('on'); },2200);
  });

  /* ---------- スライドメニュー ---------- */
  var btn=document.querySelector('.menu-btn'), drawer=document.getElementById('drawer'), overlay=document.querySelector('.drawer-overlay');
  if(!btn||!drawer||!overlay) return;
  var closeBtn=drawer.querySelector('.drawer-close'), lastFocus=null;
  function isOpen(){ return drawer.classList.contains('is-open'); }
  function open(){
    lastFocus=document.activeElement;
    drawer.classList.add('is-open'); overlay.classList.add('is-open');
    drawer.setAttribute('aria-hidden','false');
    btn.setAttribute('aria-expanded','true'); btn.setAttribute('aria-label','メニューを閉じる');
    document.documentElement.classList.add('nav-lock');
    setTimeout(function(){ closeBtn.focus(); },60);
  }
  function close(returnFocus){
    if(!isOpen()) return;
    drawer.classList.remove('is-open'); overlay.classList.remove('is-open');
    drawer.setAttribute('aria-hidden','true');
    btn.setAttribute('aria-expanded','false'); btn.setAttribute('aria-label','メニューを開く');
    document.documentElement.classList.remove('nav-lock');
    if(returnFocus!==false && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  btn.addEventListener('click',function(){ isOpen()?close():open(); });
  closeBtn.addEventListener('click',function(){ close(); });
  overlay.addEventListener('click',function(){ close(); });
  /* ページ内リンクを押したら閉じて、そのまま移動する */
  drawer.addEventListener('click',function(e){
    var a=e.target.closest('a[href^="#"]');
    if(a && !a.hasAttribute('data-pending')) close(false);
  });
  document.addEventListener('keydown',function(e){
    if(!isOpen()) return;
    if(e.key==='Escape'){ e.preventDefault(); close(); return; }
    if(e.key==='Tab'){ /* メニューの中だけでフォーカスを回す */
      var f=drawer.querySelectorAll('a[href],button:not([disabled])');
      if(!f.length) return;
      var first=f[0], last=f[f.length-1];
      if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
    }
  });
  /* PC幅に戻ったら閉じる */
  var mq=window.matchMedia('(min-width:1101px)');
  var onMq=function(m){ if(m.matches) close(false); };
  if(mq.addEventListener) mq.addEventListener('change',onMq); else if(mq.addListener) mq.addListener(onMq);
})();
