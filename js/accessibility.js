
(function(){
  const toolbar = document.createElement('div');
  toolbar.setAttribute('id','a11ybar');
  toolbar.innerHTML = `
    <button aria-label="Aumentar tamaño de fuente" id="fzPlus">A+</button>
    <button aria-label="Disminuir tamaño de fuente" id="fzMinus">A-</button>
    <button aria-label="Alternar fuente amigable dislexia" id="dys">Dys</button>
  `;
  document.body.appendChild(toolbar);

  const root = document.documentElement;
  let base = parseFloat(getComputedStyle(root).fontSize) || 16;
  const save = (k,v)=>{ try{localStorage.setItem(k,v)}catch(e){} };
  const load = k => { try{return localStorage.getItem(k)}catch(e){ return null } };

  function applySize(sz){
    root.style.fontSize = sz+'px';
    save('a11y-font-size', sz);
  }
  function applyDys(on){
    document.body.classList.toggle('dyslexia', !!on);
    save('a11y-dyslexia', on ? '1' : '0');
  }

  const storedSize = parseFloat(load('a11y-font-size'));
  const storedDys = load('a11y-dyslexia') === '1';
  if(storedSize) applySize(storedSize);
  if(storedDys) applyDys(true);

  document.getElementById('fzPlus').addEventListener('click', ()=>{ base = Math.min((parseFloat(getComputedStyle(root).fontSize)||16)+1, 24); applySize(base); });
  document.getElementById('fzMinus').addEventListener('click', ()=>{ base = Math.max((parseFloat(getComputedStyle(root).fontSize)||16)-1, 12); applySize(base); });
  document.getElementById('dys').addEventListener('click', ()=>{ applyDys(!document.body.classList.contains('dyslexia')); });
})();
