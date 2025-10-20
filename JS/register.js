document.addEventListener('DOMContentLoaded', () => {
  const form    = document.getElementById('registerForm');
  const btn     = document.getElementById('registerBtn');

  const first   = document.getElementById('firstName');
  const last    = document.getElementById('lastName');
  const email   = document.getElementById('email');
  const phone   = document.getElementById('phone');
  const pw      = document.getElementById('password');
  const pw2     = document.getElementById('password2');
  const agree   = document.getElementById('agree');

  const meter   = document.querySelector('.pw-meter');
  const pw2Hint = document.getElementById('pw2Hint');

  // ---- Validation rules ----
  const emailRE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const pwRule  = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/; // >=6, letters + digits

  // ---- Utils: local users ----
  function getUsers() {
    try {
      const raw = localStorage.getItem('fc_users');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  function saveUsers(list) {
    localStorage.setItem('fc_users', JSON.stringify(list));
  }

  // ---- Password strength ----
  function strengthLevel(p) {
    if (!p) return 0;
    if (!pwRule.test(p)) return 1;        // weak if not matching main rule
    let s = 2;                             // base when rule met
    if (/[!@#$%^&*()_\-+=\[{\]};:'",.<>/?|\\]/.test(p)) s++; // bonus for symbols
    return Math.min(s, 3);
  }

  // ---- Eye icons (both fields) ----
  document.addEventListener('click', (e) => {
    const btnEye = e.target.closest('.toggle-pw');
    if (!btnEye) return;

    const input = btnEye.parentElement.querySelector('input[type="password"], input[type="text"]');
    const show  = input.type === 'password';
    input.type  = show ? 'text' : 'password';

    const icon = btnEye.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-eye', !show);
      icon.classList.toggle('fa-eye-slash', show);
    }
  });

  // ---- Live UI state ----
  ['input','change'].forEach(evt => {
    first.addEventListener(evt, updateState);
    last.addEventListener(evt, updateState);
    email.addEventListener(evt, updateState);
    pw.addEventListener(evt, updateState);
    pw2.addEventListener(evt, updateState);
    agree.addEventListener(evt, updateState);
  });

  phone?.addEventListener('input', () => {
    // keep only digits and leading +
    phone.value = phone.value.replace(/[^\d+]/g, '');
  });

  function updateState() {
    // strength bar
    const lvl = strengthLevel(pw.value);
    meter.dataset.level = String(lvl);

    // confirm hint
    if (pw2.value && pw2.value !== pw.value) {
      pw2Hint.textContent = 'Пароли не совпадают';
      pw2Hint.style.color = '#ef4444';
    } else {
      pw2Hint.textContent = '';
    }

    // overall validity
    const valid =
      first.value.trim().length >= 2 &&
      last.value.trim().length  >= 2 &&
      emailRE.test(email.value.trim()) &&
      pwRule.test(pw.value) &&
      pw.value === pw2.value &&
      agree.checked;

    btn.disabled = !valid;
  }

  // initial
  updateState();

  // ---- Submit (LOCAL storage) ----
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (btn.disabled) return;

    const users = getUsers();
    const eml   = email.value.trim().toLowerCase();

    // block duplicates
    if (users.some(u => (u.email || '').toLowerCase() === eml)) {
      alert('Пользователь с таким email уже существует.');
      email.focus();
      return;
    }

    const newUser = {
      firstName: first.value.trim(),
      lastName : last.value.trim(),
      email    : eml,
      phone    : phone.value.trim(),
      password : pw.value,         // Note: plain text for demo; hash on real backend
      createdAt: Date.now()
    };

    users.push(newUser);
    saveUsers(users);

    alert('Аккаунт создан! Теперь вы можете войти.');
    window.location.href = '/HTML/login.html';
  });
});
