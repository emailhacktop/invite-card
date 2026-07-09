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

  // نمایش حالت منقضی شدن لینک
  expired.style.display = 'flex';

  // متن اصلی منقضی شدن
  const expiredTitle = document.querySelector('.expired-title');

  if (expiredTitle) {
    expiredTitle.innerHTML = `
      لینک منقضی شده است
      <div style="font-size:5px;opacity:.25;margin-top:8px;">
         ریست کنید
      </div>
    `;
  }

  // فعال شدن حالت ریست مدیریت
  window.resetMode = true;

} else {

  localStorage.setItem(viewKey, String(currentViews + 1));

}


//======================================================
// تایپ نام مهمان
// این تابع بعد از پایان Splash اجرا می‌شود
//======================================================

const text = `خدمت ${guest.name}`;

let index = 0;

function typeWriter() {

  if (index < text.length) {

    guestName.textContent += text.charAt(index);

    index += 1;

    window.setTimeout(typeWriter, 80);

  }

}

//======================================================
// تایپ متن خوشامدگویی
// بعد از پایان نام مهمان اجرا می‌شود
//======================================================

const originalWelcome = welcomeText.textContent.trim();

welcomeText.textContent = "";

const welcomeMessage =
"با نهایت احترام حضور گرم شما را در این مراسم ارج می‌نهیم و مشتاق دیدار شما هستیم.";

let welcomeIndex = 0;


function welcomeWriter(){

    if(!welcomeText) return;


    if(welcomeIndex < welcomeMessage.length){

        welcomeText.textContent += welcomeMessage.charAt(welcomeIndex);

        welcomeIndex++;

        window.setTimeout(welcomeWriter,45);

    }

}

// ساخت افکت ذرات و برف پس‌زمینه
function createParticles() {
  const container = document.getElementById('particles');

  if (!container) return;

  for (let i = 0; i < 35; i += 1) {
    const particle = document.createElement('span');

    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.animationDuration = `${5 + Math.random() * 7}s`;

    container.appendChild(particle);
  }
}



// قفل کردن اطلاعات مهمان‌ها برای جلوگیری از دستکاری
Object.freeze(guests);


// سیستم مخفی ریست شمارنده بازدید
// هش رمز مدیریت A..2
const ADMIN_HASH = '0e20d849076cdddf5c99d386d6cd51b8c0442b70c406222f77141b07635ce7fc';

// تابع ساخت هش SHA-256
async function sha256(text) {

  const data = new TextEncoder().encode(text);

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

}

// سیستم مخفی ریست شمارنده بازدید
// فقط مدیر می‌داند باید 7 بار روی لوگو کلیک کند

let adminClicks = 0;
let adminTimer;

const adminLogo = document.getElementById('adminLogo');

if (adminLogo) {

  adminLogo.addEventListener('click', async () => {

    // فقط هنگام منقضی شدن لینک فعال باشد
    if (!window.resetMode) return;

    adminClicks += 1;

    clearTimeout(adminTimer);

    // اگر فاصله کلیک‌ها زیاد شود شمارنده صفر شود
    adminTimer = setTimeout(() => {
      adminClicks = 0;
    }, 3000);

    // بعد از 7 کلیک پنجره رمز باز شود
    if (adminClicks >= 7) {

      const password = prompt('رمز مدیریت');

      // تبدیل رمز واردشده به هش
      const hashedPassword = await sha256(password);

      // بررسی هش رمز مدیریت
      if (hashedPassword === ADMIN_HASH) {

        Object.keys(localStorage)
          .filter(key => key.startsWith('views_'))
          .forEach(key => localStorage.removeItem(key));

        alert('شمارنده بازدید ریست شد');

        // رفرش صفحه و ورود مجدد
        location.reload();

      } else {

        alert('رمز اشتباه است');

      }

      adminClicks = 0;
    }

  });

}

/* ==========================================================
   صفحه افتتاحیه (Splash Screen)
   نویسنده: ChatGPT

   این کد فقط هنگام ورود مهمان اجرا می‌شود.
   بعد از 8 ثانیه قاب محو شده و دعوتنامه اصلی نمایش داده می‌شود.
========================================================== */

window.addEventListener("load", function () {

    // صفحه افتتاحیه
    const intro = document.getElementById("intro");

    // فیلم افتتاحیه
    const video = document.getElementById("introVideo");

    // تصویر جایگزین
    const image = document.getElementById("introImage");

    // اگر عنصر وجود ندارد یعنی این صفحه Splash ندارد
    if (!intro) return;


    //----------------------------------------------------
    // اگر فیلم وجود نداشت تصویر نمایش داده شود
    //----------------------------------------------------

    if (video) {

        video.addEventListener("error", function () {

            video.style.display = "none";

            if (image)
                image.style.display = "block";

        });

    }


    //----------------------------------------------------
    // بعد از 8 ثانیه صفحه محو شود
    //----------------------------------------------------

//----------------------------------------------------
// پایان Splash
//----------------------------------------------------

setTimeout(function () {

    intro.classList.add("hide");

    setTimeout(function () {

        intro.remove();

        //------------------------------------------------
        // حالا صفحه اصلی نمایش داده شود
        //------------------------------------------------

        const mainPage = document.querySelector("main");

        if (mainPage) {

            mainPage.classList.add("show");

        }
        //------------------------------------------------
        // حالا تایپ نام مهمان شروع شود
        //------------------------------------------------

        typeWriter();

        setTimeout(function(){

            welcomeWriter();

        }, (text.length * 80) + 500);

        //------------------------------------------------
        // حالا ذرات ساخته شوند
        //------------------------------------------------

        createParticles();

    },1500);

},8000);

});