exports.handler = async (event) => {
  try{
    const body = JSON.parse(event.body||'{}');
    const { email, whatsapp, programa, abre, cierra, url } = body;
    const sgKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || 'no-reply@neotechedulab.cl';
    let emailOk=false, waOk=false;
    if(sgKey && email){
      await fetch('https://api.sendgrid.com/v3/mail/send',{
        method:'POST',
        headers:{'Authorization':`Bearer ${sgKey}`,'Content-Type':'application/json'},
        body: JSON.stringify({
          personalizations:[{to:[{email}],subject:`Alerta CORFO: ${programa}`}],
          from:{email:fromEmail,name:'Neotech EduLab Alerts'},
          content:[{type:'text/plain',value:`Programa: ${programa}\nAbre: ${abre}\nCierra: ${cierra}\nBases: ${url}\n`}]
        })
      });
      emailOk=true;
    }
    if(whatsapp && process.env.WA_TOKEN && process.env.WA_PHONE_ID){
      await fetch(`https://graph.facebook.com/v19.0/${process.env.WA_PHONE_ID}/messages`,{
        method:'POST',
        headers:{'Authorization':`Bearer ${process.env.WA_TOKEN}`,'Content-Type':'application/json'},
        body: JSON.stringify({
          messaging_product:'whatsapp',
          to: whatsapp.replace(/\D/g,''),
          type:'text',
          text:{ body:`[Neotech EduLab] Alerta ${programa}\nAbre: ${abre}\nCierra: ${cierra}\nBases: ${url}` }
        })
      });
      waOk=true;
    }
    return { statusCode: 200, body: JSON.stringify({ ok:true, emailOk, waOk }) };
  }catch(err){
    return { statusCode: 500, body: JSON.stringify({ ok:false, error:String(err) }) };
  }
};