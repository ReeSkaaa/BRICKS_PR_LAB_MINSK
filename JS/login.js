// /JS/login.js  — LOCAL (no API)
document.addEventListener('DOMContentLoaded', () => {
  const form    = document.getElementById('loginForm');
  const emailEl = document.getElementById('login');       // email input (type="email")
  const pwEl    = document.getElementById('password');
  const btn     = document.getElementById('loginBtn');
  const msg     = document.getElementById('formMsg');
  const remember= document.getElementById('remember');

  // --- Eye toggle (show/hide password) ---
  const eyeBtn = document.querySelector('.toggle-pass');
  if (eyeBtn) {
    eyeBtn.addEventListener('click', () => {
      const show = pwEl.type === 'password';
      pwEl.type = show ? 'text' : 'password';
      const i = eyeBtn.querySelector('i');
      if (i) {
        i.classList.toggle('fa-eye', !show);
        i.classList.toggle('fa-eye-slash', show);
      }
    });
  }

  // --- Enable "Вход" button only when both fields valid ---
  const updateBtn = () => {
    const ok = emailEl.value.trim().length > 0 &&
               emailEl.checkValidity() &&
               pwEl.value.trim().length > 0;
    btn.disabled = !ok;
  };
  emailEl.addEventListener('input', updateBtn);
  pwEl.addEventListener('input', updateBtn);
  updateBtn();

  // --- Helper: show message ---
  function showMsg(text, color = '#444') {
    if (!msg) return;
    msg.hidden = false;
    msg.textContent = text;
    msg.style.color = color;
  }

  // --- Local users getter (what register.js should save) ---
  function getUsers() {
    try {
      const raw = localStorage.getItem('fc_users');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  // --- Session writers ---
  function setSession(userObj) {
    const payload = {
      email: userObj.email,
      firstName: userObj.firstName || '',
      lastName: userObj.lastName || '',
      ts: Date.now()
    };
    if (remember && remember.checked) {
      localStorage.setItem('fc_session', JSON.stringify(payload));
    } else {
      sessionStorage.setItem('fc_session', JSON.stringify(payload));
    }
  }

  // --- Submit (local validation only) ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (btn.disabled) return;

    btn.disabled = true;
    const orig = btn.textContent;
    btn.textContent = 'Вход...';
    showMsg('⏳ Проверяем...');

    const email = emailEl.value.trim().toLowerCase();
    const pw    = pwEl.value.trim();

    const users = getUsers();
    const user  = users.find(u => (u.email || '').toLowerCase() === email);

    if (!user) {
      showMsg('❌ Пользователь не найден. Зарегистрируйтесь.', 'red');
      btn.disabled = false;
      btn.textContent = orig;
      return;
    }
    if ((user.password || '') !== pw) {
      showMsg('❌ Неверный пароль.', 'red');
      btn.disabled = false;
      btn.textContent = orig;
      return;
    }

    setSession(user);
    showMsg('✅ Вход выполнен!', 'green');

    // Redirect to your main page
    setTimeout(() => {
      window.location.href = '/HTML/profile.html';
    }, 500);
  });
});
