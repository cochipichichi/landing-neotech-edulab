
(async function(){
  const r = await fetch('data/convocatorias.json'); 
  const items = await r.json().catch(()=>[]);
  const wrap = document.createElement('section');
  wrap.className = 'section';
  wrap.innerHTML = `<h2>Convocatorias y alertas</h2>
    <p>Revisa el estado y activa recordatorios por correo y WhatsApp.</p>
    <div class="cards" id="conv-cards"></div>`;
  document.getElementById('content').appendChild(wrap);
  const cards = wrap.querySelector('#conv-cards');

  function daysUntil(dateStr){
    const now = new Date();
    const target = new Date(dateStr+'T00:00:00');
    const diff = target - now;
    return Math.ceil(diff/86400000);
  }

  function mkCard(it){
    const dAbre = daysUntil(it.abre);
    const dCierra = daysUntil(it.cierra);
    const status = dAbre > 0 ? `Abre en ${dAbre} día(s)` : (dCierra >= 0 ? `Abierta — cierra en ${dCierra} día(s)` : 'Cerrada');
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
      <h3>📅 ${it.programa} — ${it.region}</h3>
      <p><strong>Abre:</strong> ${it.abre} · <strong>Cierra:</strong> ${it.cierra}</p>
      <p><strong>Estado:</strong> ${status}</p>
      <p><a class="btn ghost" href="${it.url}" target="_blank" rel="noopener">Ver bases</a></p>
      <form class="notify">
        <label>Email <input name="email" type="email" required placeholder="tucorreo@..."></label>
        <label>WhatsApp (opcional, formato +569...) <input name="whats" pattern="^\+?\d{8,15}$" placeholder="+569..."></label>
        <button class="btn" type="submit">🔔 Activar alerta</button>
      </form>
    `;
    el.querySelector('form.notify').addEventListener('submit', async (e)=>{
      e.preventDefault();
      const fd = new FormData(e.target);
      const payload = {
        email: fd.get('email'),
        whatsapp: fd.get('whats'),
        programa: it.programa,
        abre: it.abre,
        cierra: it.cierra,
        url: it.url,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      try{
        const res = await fetch('/.netlify/functions/notify', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
        if(res.ok) alert('✅ Alerta activada. Recibirás recordatorios por correo y/o WhatsApp.');
        else alert('⚠️ No se pudo activar la alerta. Revisa configuración del servidor.');
      }catch(err){ alert('⚠️ Error de red: '+err); }
    });
    return el;
  }

  items.forEach(it=>cards.appendChild(mkCard(it)));
})();
