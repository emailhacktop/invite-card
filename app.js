'use strict';

// دریافت اطلاعات مهمان از آدرس لینک

const params = new URLSearchParams(window.location.search);
const guestId = params.get('id');
const guestToken = params.get('token');

const guestName = document.getElementById('guestName');
const intro = document.getElementById('intro');
const expired = document.getElementById('expiredBox');

// نمایش خطاهای امنیتی و منقضی شدن لینک
function showError(message) {
  document.body.replaceChildren();

  const errorBox = document.createElement('div');
  errorBox.className = 'expired-box';
  errorBox.style.display = 'flex';

  const title = document.createElement('div');
  title.className = 'expired-title';
  title.textContent = message;

  errorBox.appendChild(title);
  document.body.appendChild(errorBox);

  throw new Error(message);
}

// اعتبارسنجی ورودی‌ها برای جلوگیری از تزریق کد
function isValidInput(value) {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{1,32}$/.test(value);
}

if (typeof guests !== 'object' || guests === null) {
  showError('خطا در بارگذاری اطلاعات');
}

if (!isValidInput(guestId) || !Object.hasOwn(guests, guestId)) {
  showError('مهمان یافت نشد');
}

if (!isValidInput(guestToken)) {
  showError('توکن نامعتبر است');
}

const guest = guests[guestId];

if (guest.token !== guestToken) {
  showError('دسترسی غیرمجاز');
}

// مدیریت شمارنده بازدید هر مهمان
const viewKey = `views_${guestId}`;
const maxViews = 10;

const currentViews = Number.parseInt(localStorage.getItem(viewKey) || '0', 10);

if (Number.isNaN(currentViews) || currentViews >= maxViews) {
  expired.style.display = 'flex';
} else {
  localStorage.setItem(viewKey, String(currentViews + 1));

  const text = `خدمت ${guest.name}`;
  let index = 0;

  function typeWriter() {
    if (index < text.length) {
      guestName.textContent += text.charAt(index);
      index += 1;
      window.setTimeout(typeWriter, 80);
    }
  }

  window.setTimeout(typeWriter, 3500);
}

window.setTimeout(() => {
  intro.style.opacity = '0';

  window.setTimeout(() => {
    intro.remove();
  }, 1000);
}, 3000);

// ساخت افکت ذرات و برف پس‌زمینه
function createParticles() {
  const container = document.getElementById('particles');

  for (let i = 0; i < 35; i += 1) {
    const particle = document.createElement('span');

    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.animationDuration = `${5 + Math.random() * 7}s`;

    container.appendChild(particle);
  }
}

createParticles();

// قفل کردن اطلاعات مهمان‌ها برای جلوگیری از دستکاری
Object.freeze(guests);


// سیستم مخفی ریست شمارنده بازدید با 7 بار کلیک روی لوگو
let adminClicks = 0;
let adminTimer;

const adminLogo = document.getElementById('adminLogo');

if (adminLogo) {

  adminLogo.addEventListener('click', () => {

    adminClicks += 1;

    // پیام راهنما برای مدیر
    if (adminClicks < 7) {
      alert('برای ریست روی لوگو 7 بار بزنید');
    }

    clearTimeout(adminTimer);

    // اگر فاصله کلیک‌ها زیاد شود شمارنده ریست می‌شود
    adminTimer = setTimeout(() => {
      adminClicks = 0;
    }, 3000);

    // اجرای ریست بازدیدها پس از 7 کلیک
    if (adminClicks >= 7) {

      Object.keys(localStorage)
        .filter(key => key.startsWith('views_'))
        .forEach(key => localStorage.removeItem(key));

      alert('شمارنده بازدید ریست شد');

      adminClicks = 0;
    }

  });

}
