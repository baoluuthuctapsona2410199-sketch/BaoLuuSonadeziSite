
(function(){
  const cur=(location.pathname.split('/').pop()||'index.html');
  document.querySelectorAll('.navbar .nav-link').forEach(a=>{
    const href=(a.getAttribute('href')||'').split('/').pop();
    if(href===cur){ a.classList.add('active'); a.setAttribute('aria-current','page'); }
  });
  const back=document.getElementById('backToTop');
  if(back){ back.onclick=(e)=>{e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});} }

  const getJSON = async (u)=> (await fetch(u)).json();

  // NEWS
  if(document.body.dataset.page==='news'){
    getJSON('data/news.json').then(data=>{
      const cats=['Thông báo chung','Thông báo học phí','Các biểu mẫu'];
      let current=cats[0];
      const side=document.getElementById('newsSidebar');
      side.innerHTML=cats.map(c=>`
        <a href="#" class="list-group-item list-group-item-action ${c===current?'active':''}" data-cat="${c}">
          <span class="dot"></span><span>${c}</span></a>`).join('');
      function render(){
        const list=data.news.filter(n=>n.category===current);
        const wrap=document.getElementById('newsRight');
        wrap.innerHTML=list.map(n=>`
          <div class="row row-item align-items-center">
            <div class="col-9 col-lg-10"><a href="#" class="title">${n.title}</a></div>
            <div class="col-3 col-lg-2 text-end text-muted small">${n.date}</div>
          </div>`).join('') || '<div class="text-muted p-3">Chưa có bài viết.</div>';
        document.getElementById('newsHeader').textContent=current;
      }
      side.addEventListener('click',e=>{
        const a=e.target.closest('[data-cat]'); if(!a) return;
        e.preventDefault(); current=a.dataset.cat;
        side.querySelectorAll('.list-group-item').forEach(x=>x.classList.remove('active'));
        a.classList.add('active'); render();
      });
      render();
    });
  }

  // CERTIFICATES
  if(document.body.dataset.page==='certificates'){
    (async()=>{
      const data=await getJSON('data/certificates.json');
      const tbody=document.getElementById('certBody');
      const f={code:document.getElementById('fCode'), name:document.getElementById('fName'), year:document.getElementById('fYear')};
      function render(){
        const code=f.code.value.trim().toLowerCase();
        const name=f.name.value.trim().toLowerCase();
        const year=f.year.value.trim();
        const items=data.certificates.filter(c=>(!code||c.code.toLowerCase().includes(code))&&(!name||c.fullname.toLowerCase().includes(name))&&(!year||String(c.year)===year));
        tbody.innerHTML=items.map(c=>`<tr><td>${c.code}</td><td>${c.fullname}</td><td>${c.program}</td><td>${c.year}</td><td>${c.status}</td></tr>`).join('')||'<tr><td colspan="5" class="text-center text-muted">Không tìm thấy kết quả</td></tr>';
        document.getElementById('certCount').textContent=items.length;
      }
      Object.values(f).forEach(x=>x.addEventListener('input',render)); render();
    })();
  }

  // TIMETABLE
  if(document.body.dataset.page==='timetable'){
    (async()=>{
      const data=await getJSON('data/timetable.json');
      const selC=document.getElementById('ttClass'), selW=document.getElementById('ttWeek'), tbody=document.getElementById('ttBody');
      const classes=[...new Set(data.timetables.map(t=>t.class))]; selC.innerHTML=classes.map(c=>`<option>${c}</option>`).join('');
      function fillWeeks(){ const weeks=data.timetables.filter(t=>t.class===selC.value).map(t=>t.week); selW.innerHTML=weeks.map(w=>`<option>${w}</option>`).join(''); }
      function render(){
        const tt=data.timetables.find(t=>t.class===selC.value&&t.week===selW.value);
        tbody.innerHTML=(tt?.entries||[]).map(e=>`<tr><td>${e.day}</td><td>${e.time}</td><td>${e.subject}</td><td>${e.room}</td><td>${e.teacher}</td></tr>`).join('')||'<tr><td colspan="5" class="text-center text-muted">Chưa có dữ liệu</td></tr>';
      }
      selC.addEventListener('change',()=>{fillWeeks();render();}); selW.addEventListener('change',render); fillWeeks(); render();
    })();
  }
})();

// === Footer "Kết nối" normalize ===
(function(){
  try{
    const foot = document.querySelector('footer, .footer');
    if(!foot) return;
    const heads = foot.querySelectorAll('h2,h3,h4,h5,h6,strong,span');
    heads.forEach(h=>{
      const t = (h.textContent||'').trim().toLowerCase();
      if(t.includes('kết nối')){
        const widget = h.closest('.widget') || h.parentElement;
        if(widget) widget.classList.add('connect');
      }
    });
  }catch(e){}
})();
