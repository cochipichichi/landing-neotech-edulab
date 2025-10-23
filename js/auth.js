
// Simple client-side gate (nota: no es seguridad robusta; usar Netlify Identity/Auth0 para producción)
const ALLOWED_EMAILS = [
  "franciscoandresp@gmail.com",
  "belen.acpe@gmail.com"
];
const PASSWORD_SHA256 = "454e528287d4540ede2c0a3462b9bb475ec3be2ecc3e63e8c8a0786eb399ff9e";

async function sha256Hex(msg) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(msg));
  const arr = Array.from(new Uint8Array(buf));
  return arr.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function handleLogin(e) {
  e.preventDefault();
  const email = (document.getElementById('email').value || '').trim().toLowerCase();
  const pwd = document.getElementById('password').value || '';
  const hash = await sha256Hex(pwd);
  const ok = ALLOWED_EMAILS.includes(email) && hash === PASSWORD_SHA256;
  const msgEl = document.getElementById('msg');

  if (ok) {
    sessionStorage.setItem('neotech-auth', 'ok');
    sessionStorage.setItem('neotech-email', email);
    window.location.href = "/legal/index.html";
  } else {
    msgEl.textContent = "Correo o contraseña inválidos.";
    msgEl.style.color = "salmon";
  }
}

function requireAuth() {
  const token = sessionStorage.getItem('neotech-auth');
  if (token !== 'ok') {
    window.location.replace("/private/login.html");
  }
}

export { handleLogin, requireAuth };
