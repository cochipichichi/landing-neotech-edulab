
(function(){
  const modal = document.createElement('div');
  modal.id = 'modal';
  modal.innerHTML = `<div class="m-backdrop"></div><div class="m-card"><button class="m-close" aria-label="Cerrar">×</button><img alt=""><p class="cap"></p></div>`;
  document.body.appendChild(modal);
  const img = modal.querySelector('img');
  const cap = modal.querySelector('.cap');
  const close = ()=> modal.classList.remove('open');
  modal.querySelector('.m-backdrop').addEventListener('click', close);
  modal.querySelector('.m-close').addEventListener('click', close);
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') close(); });

  document.querySelectorAll('.cards .card').forEach((card)=>{
    card.addEventListener('click', ()=>{
      const title = card.querySelector('h3')?.textContent || '';
      img.src = 'assets/logo-neotech.svg';
      cap.textContent = title;
      modal.classList.add('open');
    });
  });
})();
