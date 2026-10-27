var e=`## مرورگر به‌عنوان یه سکوی برنامه

HTML5 فقط چند تا تگ جدید اضافه نکرد. مرورگر رو به یه سکو برای برنامه‌های واقعی تبدیل کرد، با یه دسته **API جاوااسکریپت** که قبلاً افزونه‌هایی مثل فلش لازم داشتن، یا اصلاً ممکن نبودن. دایتل دو تا فصل به مهم‌ترین‌هاشون داده: **canvas** (نقاشی با کد)، و **WebSocket** و **Web Worker** (اتصال زنده و کار پس‌زمینه). این مبحث این سه تا رو پوشش می‌ده، و بعد کوتاه بقیه‌ی APIهای HTML5 که زیاد باهاشون روبه‌رو می‌شی.

- **Canvas:** یه مستطیل از پیکسل‌ها که جاوااسکریپت روش نقاشی می‌کنه. نمودار، بازی، ویرایشگر عکس، جای امضا.
- **WebSocket:** یه اتصال دوطرفه‌ی دائمی بین صفحه و سرور. چت، نتیجه‌ی زنده‌ی بازی‌ها، ویرایش گروهی، بازی چندنفره.
- **Web Worker:** جاوااسکریپتی که رو یه رشته‌ی (thread) پس‌زمینه اجرا می‌شه، تا کار سنگین صفحه رو قفل نکنه.

## Canvas: نقاشی با کد

عنصر \`<canvas>\` یه بیت‌مپ خالی با یه اندازه‌ی مشخصه. یه **زمینه‌ی دوبعدی** (2D context) ازش می‌گیری و متدهای نقاشی رو صدا می‌زنی:

- شکل‌ها: \`fillRect\`، \`strokeRect\`، \`clearRect\`؛ **مسیر**‌ها با \`beginPath\`، \`moveTo\`، \`lineTo\`، \`arc\`، \`bezierCurveTo\`، بعد \`fill\` یا \`stroke\`؛
- سبک‌ها: \`fillStyle\`، \`strokeStyle\`، \`lineWidth\`، گرادیان، الگو، سایه؛
- متن با \`fillText\`، عکس با \`drawImage\` (فریم‌های یه \`<video>\` هم)؛
- تبدیل‌ها: \`translate\`، \`rotate\`، \`scale\`، با \`save\` و \`restore\`؛
- دسترسی خام به پیکسل‌ها با \`getImageData\` و \`putImageData\` (برای فیلتر و جلوه).

دو چیز تازه‌کارها رو غافلگیر می‌کنه. اول، **دستگاه مختصات**: \`(0, 0)\` گوشه‌ی **بالا-چپ** ـه، و **y رو به پایین زیاد می‌شه**. دوم، canvas **حالت آنی** (immediate mode) داره: وقتی یه شکل کشیده شد، فقط پیکسله. canvas یادش نمی‌مونه «اینجا یه دایره هست»، پس نمی‌تونی جابه‌جاش کنی یا روش کلیک کنی. برای پویانمایی، **همه‌چی رو پاک می‌کنی و دوباره می‌کشی**، معمولاً حدود ۶۰ بار در ثانیه با \`requestAnimationFrame\`، که تابع نقاشیت رو درست قبل از تازه‌سازی بعدی صفحه‌نمایش اجرا می‌کنه (و تو تب‌های پس‌زمینه متوقفش می‌کنه).

\`\`\`html
<canvas id="scene" width="300" height="120">A ball rolling along the ground.</canvas>
<script>
  const ctx = document.getElementById("scene").getContext("2d");
  let x = 20;
  function draw() {
    ctx.clearRect(0, 0, 300, 120);
    ctx.fillStyle = "#2a7";
    ctx.fillRect(0, 110, 300, 10);
    ctx.beginPath();
    ctx.arc(x, 95, 15, 0, 2 * Math.PI);
    ctx.fillStyle = "#e63";
    ctx.fill();
    x = (x + 2) % 300;
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
<\/script>
\`\`\`

متن داخل \`<canvas>\` فقط تو مرورگرهایی نشون داده می‌شه که نمی‌تونن بکشنش، و تنها چیزیه که صفحه‌خوان می‌گیره. canvas برای ابزارهای دسترس‌پذیری نامرئیه، پس اطلاعات مهمی که روش کشیده می‌شه یه جایگزین متنی لازم داره.

**Canvas یا SVG؟** SVG (از [مبحث رسانه‌ی HTML5](/internet-engineering/html5-forms-and-media)) **حالت نگه‌دارنده** (retained mode) داره: هر شکل یه عنصر تو DOM ـه که می‌تونی با CSS سبک بدی، روش کلیک کنی و عوضش کنی، و تو هر بزرگنمایی تیز می‌مونه. canvas وقتی هزاران شیء هست یا هر پیکسل تو هر فریم عوض می‌شه سریع‌تره. قاعده‌ی سرانگشتی: نمودار و آیکون با تعداد معقولی شکل ← SVG؛ بازی، جلوه‌های ذره‌ای، پردازش تصویر ← canvas. (برای سه‌بعدی، **WebGL** و جانشینش **WebGPU** هستن، که از همون عنصر \`<canvas>\` استفاده می‌کنن.)

:::show
**یه مثال روزمره: تخته‌وایت‌برد در برابر آهنربای یخچال.**

- **Canvas یه تخته‌وایت‌برده.** با ماژیک یه دایره می‌کشی. حالا فقط جوهره؛ تخته نمی‌دونه این یه دایره‌ست. برای «جابه‌جا کردنش»، پاکش می‌کنی و یه جای دیگه می‌کشیش. برای یه کارتون متحرک، پاک می‌کنی و دوباره می‌کشی، پاک می‌کنی و دوباره می‌کشی، خیلی تند.
- **SVG یه دسته آهنربای یخچاله.** هر شکل یه شیء جداست. می‌تونی یکیش رو برداری، جابه‌جاش کنی، رنگش رو عوض کنی، بپرسی «به کدوم آهنربا دست زدم؟». ولی با ده هزار تا آهنربا، جابه‌جا کردن همه‌شون هر ثانیه کار زیادیه.
- برای همینه که بازی‌ها و جلوه‌ها از تخته استفاده می‌کنن، و نمودارها و چارت‌های تعاملی اغلب از آهنربا.
:::

## Web Worker: کار سنگین بدون قفل شدن صفحه

از [مبانی جاوااسکریپت](/internet-engineering/javascript-basics) یادته که جاوااسکریپت صفحه رو **یه رشته** اجرا می‌شه، رشته‌ی اصلی، که کلیک، تایپ، اسکرول و نقاشی رو هم مدیریت می‌کنه. اگه یه تابع دو ثانیه محاسبه کنه، صفحه دو ثانیه **قفل** می‌شه: دکمه‌ها جواب نمی‌دن، پویانمایی‌ها وایمیستن. تقسیم کار با \`async\`/\`await\` کمکی نمی‌کنه؛ اون فقط برای *منتظر موندن* کمک می‌کنه، نه *محاسبه کردن*.

یه **Web Worker** یه رشته‌ی جاوااسکریپت جداست:

- با \`new Worker("worker.js")\` می‌سازیش؛
- صفحه و worker فقط با **پیام** حرف می‌زنن: \`worker.postMessage(data)\` و \`onmessage\`؛ داده بینشون **کپی** می‌شه (یا برای بافرهای دودویی بزرگ، بدون کپی *منتقل* می‌شه)؛
- worker **به DOM دسترسی نداره**: حساب می‌کنه، بعد نتیجه رو برمی‌گردونه تا رشته‌ی اصلی نشونش بده؛
- ولی \`fetch\`، تایمر، WebSocket و IndexedDB داره.

کاربردهای معمول: پردازش عکس و ویدیو، تجزیه‌ی فایل‌های بزرگ، فشرده‌سازی، رمزنگاری، جست‌وجو تو داده‌ی بزرگ، فیزیک بازی‌ها. انواع مرتبط: **Service Worker**ها بین صفحه و شبکه می‌شینن، می‌تونن درخواست‌ها رو از کش جواب بدن، و سایت‌ها رو **آفلاین** قابل استفاده می‌کنن (پایه‌ی Progressive Web Appها)، و **Shared Worker**ها بین چند تب مشترکن.

:::show
**یه مثال روزمره: یه گارسون با یه دستیار تو آشپزخونه.**

- یه کافه یه گارسون داره (رشته‌ی اصلی): سفارش می‌گیره، نوشیدنی میاره، به سؤال‌ها جواب می‌ده.
- یکی یه کیک سفارش می‌ده که پختنش ۲۰ دقیقه طول می‌کشه. اگه گارسون خودش بپزدش، ۲۰ دقیقه به هیچ‌کس دیگه سرویس نمی‌ده: کافه «قفل» شده.
- به‌جاش، گارسون یه یادداشت می‌ده به دستیار آشپزخونه (\`postMessage\`): «یه کیک شکلاتی برای میز ۳». دستیار (یه worker) می‌پزه؛ گارسون به سرویس دادن ادامه می‌ده.
- دستیار هیچ‌وقت تو سالن نمیاد (دسترسی به DOM نداره). وقتی کیک آماده شد، زنگ رو می‌زنه و تحویلش می‌ده (\`onmessage\`)، و گارسون می‌برتش سر میز.
:::

## WebSocket: یه اتصال زنده‌ی دوطرفه

HTTP **درخواست-پاسخ** ـه: کلاینت می‌پرسه، سرور جواب می‌ده. سرور نمی‌تونه اول حرف بزنه. برای داده‌ی زنده (پیام‌های تازه‌ی چت، تغییر قیمت‌ها، مکان‌نمای یه دوست تو یه سند مشترک)، راه‌های قدیمی **polling** بود (هر چند ثانیه پرسیدن «چیز تازه‌ای هست؟»، پرهزینه و با تأخیر) و **long polling** (سرور درخواست رو باز نگه می‌داره تا یه اتفاقی بیفته).

یه **WebSocket** با یه درخواست HTTP معمولی با \`Upgrade: websocket\` شروع می‌شه. اگه سرور موافق باشه، \`101 Switching Protocols\` جواب می‌ده، و از اون به بعد همون اتصال TCP **فریم**‌های کوچیک رو **در هر دو جهت**، هر وقت، می‌بره، تا یکی از دو طرف ببندتش. سربار هر پیام چند بایته، در مقایسه با صدها بایت سرآیند برای هر درخواست HTTP. تو سایت‌های واقعی از \`wss://\` (WebSocket روی TLS) استفاده کن، درست مثل \`https://\`.

API مرورگرش کوچیکه:

\`\`\`html
<script>
  const ws = new WebSocket("wss://chat.example.com/room/7");
  ws.onopen = () => ws.send(JSON.stringify({ type: "hello", name: "Ana" }));
  ws.onmessage = (event) => console.log("server says", JSON.parse(event.data));
  ws.onclose = () => console.log("connection closed: reconnect after a pause");
<\/script>
\`\`\`

سمت سرور، هر WebSocket باز یه اتصال طولانی‌مدته، که نحوه‌ی بزرگ شدن رو عوض می‌کنه: یه سرور ممکنه ده‌ها هزار تاش رو نگه داره، و وقتی برنامه رو چند سرور اجرا می‌شه، پیامی از یه کاربر رو سرور ۱ باید به کاربرهای وصل به سرور ۲ برسه (معمولاً از راه یه کارگزار پیام مشترک مثل Redis pub/sub). برای به‌روزرسانی یک‌طرفه از سرور به مرورگر، **Server-Sent Events** (\`EventSource\`) یه جایگزین ساده‌تره که روی HTTP معمولی کار می‌کنه.

:::show
\`\`\`anim
messages Ana Server Ben
send Ana Server GET /chat, Upgrade: websocket | صفحه‌ی Ana می‌خواد این اتصال HTTP رو به WebSocket تبدیل کنه.
send Server Ana 101 Switching Protocols | سرور قبول می‌کنه. حالا اتصال در هر دو جهت باز می‌مونه.
send Ben Server Upgrade: websocket | صفحه‌ی Ben هم همین کار رو می‌کنه.
send Server Ben 101 Switching Protocols | دو تا اتصال باز. هیچ‌کس پشت سر هم نمی‌پرسه.
send Ana Server frame: "hi Ben!" | Ana یه پیام می‌فرسته: یه فریم چندبایتی، بدون سرآیند HTTP.
send Server Ben frame: "Ana: hi Ben!" | سرور فوراً به Ben می‌رسونتش. Ben هیچ‌وقت نپرسید «چیز تازه‌ای هست؟»
\`\`\`
:::

## بقیه‌ی APIهای HTML5 که ارزش دونستن دارن

- **Web Storage:** \`localStorage\` (بین بازدیدها می‌مونه) و \`sessionStorage\` (تا بسته شدن تب): رشته‌های کلید-مقدار کوچیک برای هر سایت. هیچ‌وقت راز یا توکن نشست اونجا نذار، چون هر اسکریپتی تو صفحه می‌تونه بخونتش.
- **IndexedDB:** یه پایگاه داده‌ی واقعی تو مرورگر، برای حجم زیاد داده‌ی ساخت‌یافته و برنامه‌های آفلاین.
- **Geolocation:** \`navigator.geolocation.getCurrentPosition(...)\`، فقط بعد از اجازه‌ی کاربر، و فقط روی HTTPS.
- **History API:** \`history.pushState\` بدون بار کردن دوباره URL رو عوض می‌کنه، و برنامه‌های تک‌صفحه‌ای این‌طوری دکمه‌ی برگشت رو سالم نگه می‌دارن.
- **کشیدن و رها کردن، File API، کلیپ‌بورد، اعلان‌ها، تمام‌صفحه، ضبط رسانه** (دوربین و میکروفون): هر کدوم جایی که پای حریم خصوصی وسطه پشت یه اجازه‌ست.

## کی به کارت میاد، کی نه؟

| موقعیت | چی جوره | چرا |
|---|---|---|
| یه نمودار با چند ده تا میله | SVG | قابل کلیک، قابل سبک‌دهی، تیز تو هر اندازه |
| بازی، ذره‌ها، جلوه‌های ویدیویی | Canvas (یا WebGL) | دوباره‌کشیدن سریع کلی پیکسل |
| محاسبه‌ای که بیشتر از حدود ۵۰ میلی‌ثانیه طول می‌کشه | یه Web Worker | صفحه پاسخگو می‌مونه |
| چت، همکاری زنده، بازی چندنفره | WebSocket | دوطرفه، تأخیر کم، سربار کم |
| نتیجه‌ی زنده، اعلان (فقط سرور ← مرورگر) | Server-Sent Events | ساده‌تر، HTTP معمولی |
| داده‌ای که هر چند دقیقه عوض می‌شه | یه \`fetch\` ساده هر از گاهی | یه اتصال دائمی ارزشش رو نداره |
| کار کردن آفلاین | Service Worker + Cache/IndexedDB | بدون شبکه به درخواست‌ها جواب می‌ده |

## مثال ساده: canvas واقعاً چیه (جاوااسکریپت)

canvas یه شبکه از پیکسل‌هاست که دستورهای نقاشی رنگش می‌کنن. برای این‌که اینو بدون مرورگر ببینیم، این برنامه API ـه canvas رو روی یه شبکه از حرف‌های متنی تقلید می‌کنه: \`fillRect\` و \`clearRect\`، یه خط (مثل \`moveTo\` + \`lineTo\` + \`stroke\`)، محور y رو به پایین، و یه پویانمایی که از فریم‌های پاک‌کن-و-دوباره‌بکش ساخته شده.

\`\`\`javascript
// What a canvas really is: a grid of pixels you paint with commands (shown here as text)
class TextCanvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.fillStyle = "#";
    this.clearRect(0, 0, width, height);
  }
  clearRect(x, y, w, h) { this.fillRect(x, y, w, h, "."); }
  fillRect(x, y, w, h, color = this.fillStyle) {           // like ctx.fillRect: x to the right, y DOWN
    if (!this.pixels) this.pixels = Array.from({ length: this.height }, () => Array(this.width).fill("."));
    for (let row = Math.max(0, y); row < Math.min(this.height, y + h); row++)
      for (let col = Math.max(0, x); col < Math.min(this.width, x + w); col++) this.pixels[row][col] = color;
  }
  line(x0, y0, x1, y1) {                                   // like moveTo + lineTo + stroke
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let i = 0; i <= steps; i++) {
      const x = Math.round(x0 + ((x1 - x0) * i) / steps), y = Math.round(y0 + ((y1 - y0) * i) / steps);
      this.fillRect(x, y, 1, 1);
    }
  }
  show(title) { console.log(title + "\\n" + this.pixels.map((r) => r.join("")).join("\\n")); }
}

const ctx = new TextCanvas(24, 7);
ctx.fillStyle = "=";
ctx.fillRect(0, 6, 24, 1);                                 // the ground
ctx.fillStyle = "#";
ctx.fillRect(2, 2, 4, 3);                                  // a box
ctx.fillStyle = "*";
ctx.line(10, 5, 21, 0);                                    // a ramp
ctx.show("one picture:");

// animation = clear, change the state, redraw (a browser does this ~60 times a second)
let ball = { x: 1, y: 1, dx: 4, dy: 1 };
for (let frame = 1; frame <= 3; frame++) {
  ctx.clearRect(0, 0, 24, 6);                              // forget the old picture (the ground stays)
  ctx.fillStyle = "O";
  ctx.fillRect(ball.x, ball.y, 2, 2);
  ctx.show(\`frame \${frame}:\`);
  ball = { ...ball, x: ball.x + ball.dx, y: ball.y + ball.dy };
}
\`\`\`

\`\`\`text
one picture:
....................**..
..................**....
..####..........**......
..####........**........
..####......**..........
..........**............
========================
frame 1:
........................
.OO.....................
.OO.....................
........................
........................
........................
========================
frame 2:
........................
........................
.....OO.................
.....OO.................
........................
........................
========================
frame 3:
........................
........................
........................
.........OO.............
.........OO.............
........................
========================
\`\`\`

نتیجه‌ها رو بخونیم:

- **\`fillRect(2, 2, 4, 3)\` دو ستون از چپ و دو ردیف از بالاست.** زمین تو \`y = 6\` ردیف *پایینیه*. y بیشتر یعنی پایین‌تر رو صفحه، برعکس نمودارهای مدرسه.
- **سطح شیب‌دار رو به راست *بالا* رفت** چون نقطه‌ی پایانیش \`(21, 0)\` y کوچیک‌تری داره. خط از پیکسل‌های تکی ساخته شده که با گرد کردن انتخاب می‌شن؛ canvasهای واقعی لبه‌ها رو نرم هم می‌کنن (anti-aliasing).
- **هر فریم با \`clearRect\` شروع می‌شه.** بدونش، توپ ردی از جاهای قبلیش به جا می‌ذاشت، چون canvas هیچ خبری نداره که «یه توپ» هست؛ فقط پیکسل داره.
- **توپ با عوض شدن یه شیء جاوااسکریپت (\`ball.x\`، \`ball.y\`) و دوباره کشیدن حرکت می‌کنه.** *حالت* تو برنامه‌ی خودته؛ canvas فقط نشونش می‌ده. این ایده‌ی اصلی هر بازی canvasـیه.

## مثال متوسط: یه worker صفحه رو پاسخگو نگه می‌داره (جاوااسکریپت)

عددهای اول تا ۳ میلیون رو دو بار می‌شمریم. یه تایمر ۱۰ میلی‌ثانیه‌ای نماینده‌ی همه‌ی کارهاییه که یه صفحه باید ادامه بده (پویانمایی، واکنش به کلیک). اول رو رشته‌ی اصلی، بعد تو یه worker. \`worker_threads\` ـه Node مثل Web Workerهای مرورگر کار می‌کنن: یه رشته‌ی جدا که فقط با پیام حرف می‌زنه.

\`\`\`javascript
// Heavy work on the main thread freezes everything; a worker keeps the page responsive.
// (Node's worker_threads behave like the browser's Web Workers: separate thread, messages only.)
import { Worker } from "node:worker_threads";

const heavyCode = \`
  function countPrimes(limit) {
    let count = 0;
    for (let n = 2; n <= limit; n++) {
      let prime = true;
      for (let d = 2; d * d <= n; d++) if (n % d === 0) { prime = false; break; }
      if (prime) count++;
    }
    return count;
  }\`;
const countPrimes = new Function(\`\${heavyCode}; return countPrimes;\`)();
const LIMIT = 3_000_000;

// a "clock" that should tick every 10 ms, like animations and clicks on a page
async function whileTicking(work) {
  let ticks = 0;
  const timer = setInterval(() => ticks++, 10);
  const result = await work();
  clearInterval(timer);
  return { result, ticks };
}

const onMain = await whileTicking(async () => countPrimes(LIMIT));
console.log(\`main thread: \${onMain.result} primes, clock ticks while working: \${onMain.ticks}\`);

const inWorker = await whileTicking(() => new Promise((resolve, reject) => {
  const worker = new Worker(\`\${heavyCode}
    const { parentPort } = require("node:worker_threads");
    parentPort.on("message", (limit) => { parentPort.postMessage(countPrimes(limit)); process.exit(0); });\`, { eval: true });
  worker.on("message", resolve);
  worker.on("error", reject);
  worker.postMessage(LIMIT);                                 // send the job; the answer comes back as a message
}));
console.log(\`worker:      \${inWorker.result} primes, clock kept ticking: \${inWorker.ticks > 5 ? "yes" : "no"}\`);
\`\`\`

\`\`\`text
main thread: 216816 primes, clock ticks while working: 0
worker:      216816 primes, clock kept ticking: yes
\`\`\`

نتیجه‌ها رو بخونیم:

- **رو رشته‌ی اصلی، ساعت حتی یه بار هم تیک نزد،** با این‌که کار حدود یه ثانیه طول کشید. پوشش \`async\` هیچ‌چی رو عوض نکرد: یه محاسبه‌ی طولانی رشته رو تا آخرش نگه می‌داره. تو مرورگر، صفحه تمام اون مدت قفل بود.
- **با worker، ساعت به تیک زدن ادامه داد** (تعداد دقیق تیک‌ها به دستگاه بستگی داره، برای همین برنامه فقط بله یا نه چاپ می‌کنه). رشته‌ی اصلی آزاد بود؛ شمردن روی یه هسته‌ی دیگه انجام شد.
- **همون جواب، ۲۱۶٬۸۱۶ عدد اول،** ولی worker ورودیش رو گرفت و نتیجه‌ش رو فقط با پیام برگردوند. هیچ متغیری با رشته‌ی اصلی شریک نیست، برای همینه که workerها باگ‌های ریزِ رشته‌هایی که حافظه‌ی مشترک دارن رو به وجود نمیارن.
- **راه انداختن یه worker چند میلی‌ثانیه هزینه داره،** پس برای کارهای طولانی می‌صرفه، نه برای هر محاسبه‌ی کوچیک.

## مثال پیشرفته: یه سرور چت WebSocket از صفر (جاوااسکریپت)

برای دیدن این‌که WebSocket «فقط» یه اتصال HTTP ارتقایافته‌ست که فریم جابه‌جا می‌کنه، سمت سرور رو با دست می‌نویسیم: دست‌دادن (\`101 Switching Protocols\` با مقدار \`Sec-WebSocket-Accept\` که همون‌طور که استاندارد می‌خواد حساب می‌شه)، رمزگشایی فریم‌های ماسک‌شده‌ای که کلاینت‌ها می‌فرستن، و ساختن فریم برای پخش. کلاینت‌ها کلاس واقعی \`WebSocket\` ـن، همونی که مرورگرها دارن.

\`\`\`javascript
// A tiny WebSocket chat server written from scratch (handshake + frames), used by real WebSocket clients
import http from "node:http";
import { createHash } from "node:crypto";

const GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";       // fixed by the WebSocket standard (RFC 6455)
const acceptKey = (key) => createHash("sha1").update(key + GUID).digest("base64");
console.log("handshake check:", acceptKey("dGhlIHNhbXBsZSBub25jZQ=="));   // the RFC's own example

function frame(text) {                                     // server -> client: FIN + text opcode, no mask
  const data = Buffer.from(text);
  const header = data.length < 126 ? Buffer.from([0x81, data.length]) : Buffer.from([0x81, 126, data.length >> 8, data.length & 255]);
  return Buffer.concat([header, data]);
}
function unframe(buf) {                                    // client -> server frames are always masked
  const opcode = buf[0] & 0x0f;
  let len = buf[1] & 0x7f, offset = 2;
  if (len === 126) { len = buf.readUInt16BE(2); offset = 4; }
  const mask = buf.subarray(offset, offset + 4);
  const data = Buffer.from(buf.subarray(offset + 4, offset + 4 + len).map((b, i) => b ^ mask[i % 4]));
  return { opcode, text: data.toString() };
}

const clients = new Set();
const server = http.createServer((req, res) => res.writeHead(426).end("WebSocket only"));
server.on("upgrade", (req, socket) => {                    // the HTTP request asks to switch protocols
  socket.write("HTTP/1.1 101 Switching Protocols\\r\\nUpgrade: websocket\\r\\nConnection: Upgrade\\r\\n" +
               \`Sec-WebSocket-Accept: \${acceptKey(req.headers["sec-websocket-key"])}\\r\\n\\r\\n\`);
  const name = new URL(req.url, "http://x").searchParams.get("name");
  clients.add(socket);
  socket.on("data", (buf) => {
    const { opcode, text } = unframe(buf);
    if (opcode === 8) { clients.delete(socket); return socket.end(Buffer.from([0x88, 0])); }   // close frame
    for (const c of clients) c.write(frame(\`\${name}: \${text}\`));                                 // broadcast
  });
});
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const url = \`ws://127.0.0.1:\${server.address().port}/chat\`;

// two browser-style clients (Node has the same WebSocket class as browsers)
function join(name) {
  return new Promise((resolve) => {
    const ws = new WebSocket(\`\${url}?name=\${name}\`);
    ws.inbox = [];
    ws.onmessage = (e) => ws.inbox.push(e.data);
    ws.onopen = () => resolve(ws);
  });
}
const nextMessage = (ws, count) => new Promise((resolve) => { const t = setInterval(() => ws.inbox.length >= count && (clearInterval(t), resolve()), 5); });

const ana = await join("Ana");
const ben = await join("Ben");
ana.send("hi Ben!");
await nextMessage(ben, 1);
ben.send("hello Ana, the server pushed your message to me");
await Promise.all([nextMessage(ana, 2), nextMessage(ben, 2)]);
console.log("Ana received:", JSON.stringify(ana.inbox));
console.log("Ben received:", JSON.stringify(ben.inbox));
ana.close();
ben.close();
await new Promise((ok) => setTimeout(ok, 50));
console.log("clients still connected:", clients.size);
server.close();
\`\`\`

\`\`\`text
handshake check: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
Ana received: ["Ana: hi Ben!","Ben: hello Ana, the server pushed your message to me"]
Ben received: ["Ana: hi Ben!","Ben: hello Ana, the server pushed your message to me"]
clients still connected: 0
\`\`\`

نتیجه‌ها رو بخونیم:

- **مقدار دست‌دادن با مثال خود استاندارد WebSocket جوره** (RFC 6455). کلاینت یه \`Sec-WebSocket-Key\` تصادفی می‌فرسته؛ سرور با هش کردنش همراه یه GUID ثابت ثابت می‌کنه واقعاً WebSocket بلده. مرورگرهای واقعی دست‌دادن ما رو قبول کردن، پس اتصال باز شد.
- **Ben پیام Ana رو بدون این‌که بخوادش گرفت.** کل حرف WebSocket همینه: سرور هُل می‌ده (push). هر دو کاربر پیام‌های خودشون رو هم می‌گیرن، چون سرور برای همه پخش می‌کنه، و این تأیید می‌کنه که پیام از سرور رد شده.
- **فریم‌های کلاینت ماسک‌شده‌ان** (با ۴ بایت تصادفی XOR شدن)، و \`unframe\` ما برش می‌گردونه. ماسک برای اینه که پراکسی‌های گیج سر راه، داده‌ی WebSocket رو با HTTP اشتباه نگیرن و کشش نکنن.
- **بستن هم یه فریمه** (opcode ۸): سرور جواب می‌ده و کلاینت رو حذف می‌کنه. این سرور عمداً حداقلیه: فرض می‌کنه هر رویداد \`data\` دقیقاً یه فریم کامل داره و نه پیام‌های بلند رو مدیریت می‌کنه نه ping رو. برنامه‌های واقعی از یه کتابخونه‌ی آزمایش‌شده (مثل \`ws\` برای Node) استفاده می‌کنن، به‌علاوه‌ی منطق اتصال دوباره تو کلاینت.

## نگاه یه مهندس ارشد

- **قبل از بردن کار به worker اندازه بگیر،** و برای هر چیزی که رشته‌ی اصلی رو بیشتر از حدود ۵۰ میلی‌ثانیه قفل می‌کنه ازش استفاده کن.
- **ساده‌ترین راه انتقالی که جواب می‌ده رو انتخاب کن:** \`fetch\` ساده برای به‌روزرسانی‌های گاه‌به‌گاه، Server-Sent Events برای جریان یک‌طرفه، WebSocket فقط وقتی دوطرفه و تأخیر کم لازمه.
- **برای قطع شدن برنامه داشته باش:** شبکه‌های موبایل مدام اتصال‌ها رو قطع می‌کنن. با مکث‌های بلندشونده دوباره وصل شو، و بعد از وصل شدن حالت رو دوباره هم‌گام کن.
- **اتصال‌های WebSocket رو احراز هویت کن** و رو سرور سرآیند \`Origin\` رو بررسی کن؛ هر پیام ورودی رو مثل هر ورودی دیگه اعتبارسنجی کن.
- **محتوای canvas رو دسترس‌پذیر کن:** یه جایگزین متنی بذار، یا برای محتوایی که آدم‌ها باید بخونن از SVG/HTML استفاده کن.

## اشتباه‌های رایج

:::mistakes
- **یادت بره که y تو canvas رو به پایین زیاد می‌شه،** یا بین فریم‌ها پاک نکنی و بکشی.
- **پویانمایی با \`setInterval\` به‌جای \`requestAnimationFrame\`:** حرکت ناهموار، و کار هدررفته تو تب‌های پس‌زمینه.
- **محاسبه‌های طولانی رو رشته‌ی اصلی،** که با \`await\` «ناهم‌زمان شدن»: هنوز قفله.
- **تلاش برای دست زدن به DOM از یه worker:** workerها \`document\` ندارن؛ به‌جاش نتیجه رو برگردون.
- **باز کردن یه WebSocket برای داده‌ای که هر چند دقیقه عوض می‌شه.**
- **نبودن منطق اتصال دوباره:** نمای زنده بعد از اولین سکسکه‌ی شبکه بی‌صدا وایمیسه.
- **نگه داشتن توکن یا داده‌ی شخصی تو \`localStorage\`:** هر اسکریپت تزریق‌شده‌ای می‌تونه بخونتش.
:::

## خلاصه

:::takeaways[چیزهایی که باید یادت بمونه]
- APIهای HTML5 مرورگر رو به یه سکوی برنامه تبدیل کردن.
- Canvas یه بیت‌مپ حالت آنیه: با یه زمینه‌ی دوبعدی بکش، \`(0, 0)\` بالا-چپ، y رو به پایین؛ با پاک کردن و دوباره کشیدن تو \`requestAnimationFrame\` پویانمایی کن.
- SVG شکل‌ها رو به شکل عنصرهای DOM نگه می‌داره (خوب برای نمودارهای تعاملی)؛ canvas برای تعداد زیاد شیء و جلوه‌های پیکسلی سریع‌تره.
- Web Workerها جاوااسکریپت رو یه رشته‌ی دیگه اجرا می‌کنن، با پیام ارتباط دارن، و به DOM دسترسی ندارن؛ موقع کار سنگین صفحه رو پاسخگو نگه می‌دارن.
- WebSocket یه اتصال HTTP رو (\`101\`) به یه کانال دوطرفه‌ی دائمی از فریم‌های کوچیک ارتقا می‌ده؛ از \`wss://\` استفاده کن.
- Server-Sent Events هُل دادن یک‌طرفه از سرور رو انجام می‌ده؛ Service Workerها استفاده‌ی آفلاین رو ممکن می‌کنن.
- Web Storage، IndexedDB، Geolocation و History API بقیه‌ی APIهای روزمره‌ی HTML5 ـن.
:::

## این مبحث کجای نقشه‌ست؟

\`\`\`mermaid
flowchart LR
  J["DOM و رویدادها"] --> P["APIهای HTML5"]
  R["وب‌سرویس و REST"] --> P
  P --> X["امنیت وب"]
  T["شبکه: TCP"] --> P
\`\`\`

مبحث بعدی [امنیت وب](/internet-engineering/web-security) ـه: حمله‌هایی که هر سایتی باهاشون روبه‌روئه (XSS، CSRF، تزریق SQL) و راه دفاع در برابرشون.

## تمرین

اول خودت جواب بده، بعد جواب رو باز کن.

::::exercise
**تمرین ۱.** رو یه canvas به عرض ۴۰۰ و ارتفاع ۳۰۰، این‌ها چی می‌کشن، و کجا؟ (الف) \`ctx.fillRect(0, 0, 400, 30)\` (ب) \`ctx.fillRect(390, 290, 10, 10)\` (ج) \`ctx.arc(200, 150, 50, 0, 2 * Math.PI)\` و بعدش \`ctx.fill()\`

:::answer
- (الف) یه نوار به ارتفاع ۳۰ پیکسل سرتاسر **بالای** canvas (y از بالا شروع می‌شه).
- (ب) یه مربع ۱۰ × ۱۰ تو گوشه‌ی **پایین-راست** (x از ۳۹۰ تا ۳۹۹ و y از ۲۹۰ تا ۲۹۹ رو پر می‌کنه، دقیقاً آخرین پیکسل‌ها).
- (ج) یه دایره‌ی پر با شعاع ۵۰ تو **وسط** canvas (۲۰۰ نصف ۴۰۰ ـه، ۱۵۰ نصف ۳۰۰). زاویه‌ها به رادیانن: ۰ تا 2π یه دایره‌ی کامله.
:::
::::

::::exercise
**تمرین ۲.** برای هر ویژگی، بین پرسیدن با \`fetch\`، Server-Sent Events، یا WebSocket انتخاب کن، و بگو چرا: (الف) داشبوردی که پیش‌بینی هوا رو نشون می‌ده و ساعتی یه بار به‌روز می‌شه (ب) نتیجه‌ی زنده‌ی فوتبال (ج) یه بازی نقاشی چندنفره (د) شمارنده‌ی «ایمیل جدید».

:::answer
- (الف) **\`fetch\` گاه‌به‌گاه** (مثلاً هر ۱۵ تا ۳۰ دقیقه، یا وقتی تب دیده می‌شه). یه اتصال دائمی برای داده‌ی ساعتی منابع سرور رو هدر می‌ده.
- (ب) **Server-Sent Events.** به‌روزرسانی‌ها فقط از سرور به مرورگر می‌رن، و SSE همینو روی HTTP معمولی با اتصال دوباره‌ی خودکار می‌ده. (WebSocket هم کار می‌کنه، ولی بیشتر از نیازه.)
- (ج) **WebSocket.** هر بازیکن چند بار در ثانیه خط‌هاش رو می‌فرسته و خط‌های بقیه رو می‌گیره: دوطرفه، تأخیر کم، پیام‌های کوچیک.
- (د) **Server-Sent Events** (یا WebSocket اگه برنامه برای ویژگی‌های دیگه از قبل یکی باز داره). پرسیدن هر یه دقیقه هم جواب می‌ده و ساده‌ترینه؛ انتخاب بستگی داره که چقدر باید «فوری» حس بشه.
:::
::::

::::exercise
**تمرین ۳.** یه ویرایشگر عکس یه فیلتر محوکننده رو روی یه عکس ۲۴ مگاپیکسلی با جاوااسکریپت اعمال می‌کنه. تا وقتی اجرا می‌شه (۳ ثانیه)، صفحه قفل می‌شه و دکمه‌ی «لغو» کار نمی‌کنه. توضیح بده چرا، و بگو چطور با یه Web Worker بازسازیش می‌کنی، از جمله این‌که «لغو» چطور کار می‌کنه.

:::answer
**چرا:** حلقه‌ی محو کردن رو رشته‌ی اصلی اجرا می‌شه، که همون رشته‌ایه که کلیک‌ها رو مدیریت می‌کنه و صفحه رو دوباره می‌کشه. تا وقتی حلقه اجرا می‌شه، کلیک روی «لغو» فقط تو صف رویدادها منتظر می‌مونه؛ بعد از تموم شدن حلقه بهش رسیدگی می‌شه، وقتی دیگه چیزی برای لغو نمونده.

**با یه worker:**

1. پیکسل‌ها رو با \`getImageData\` بخون و بافر رو با \`postMessage\` به worker بفرست، و **منتقلش کن** (\`worker.postMessage(pixels.buffer, [pixels.buffer])\`) تا ۹۶ مگابایت کپی نشه.
2. worker محو کردن رو اجرا می‌کنه و می‌تونه برای یه نوار پیشرفت پیام **پیشرفت** بفرسته («۴۰٪»).
3. وقتی تموم شد، نتیجه رو برمی‌گردونه؛ رشته‌ی اصلی با \`putImageData\` می‌کشتش.
4. **لغو:** رشته‌ی اصلی پاسخگو می‌مونه، پس کلیک فوراً رسیدگی می‌شه؛ \`worker.terminate()\` رو صدا می‌زنه که worker رو همون لحظه متوقف می‌کنه (یا یه پیام «بس کن» می‌فرسته که worker بین تکه‌های ردیف‌ها بررسیش می‌کنه).

صفحه هیچ‌وقت قفل نمی‌شه، و حتی می‌شه کار رو بین چند worker تقسیم کرد، هر کدوم یه نوار از عکس، تا از هسته‌های بیشتری از پردازنده استفاده بشه.
:::
::::

::::exercise
**تمرین ۴ (فکر کن، حفظ نکن).** یه اپ چت تو آزمایش با یه سرور بی‌نقص کار می‌کنه. تو محیط واقعی، رو سه سرور پشت یه متعادل‌کننده‌ی بار اجرا می‌شه، و کاربرها شکایت می‌کنن که فقط *بعضی* از پیام‌های اتاقشون رو می‌بینن. با چیزهایی که درباره‌ی WebSocket و [متعادل‌سازی بار](/internet-engineering/web-servers) می‌دونی، مشکل رو توضیح بده و یه راه‌حل پیشنهاد کن.

:::answer
**مشکل:** هر WebSocket یه اتصال طولانی‌مدت به **یه** سروره. متعادل‌کننده‌ی بار کاربرها رو پخش می‌کنه: Ana به سرور ۱ وصله، Ben به سرور ۲، Cyrus به سرور ۳. وقتی Ana یه پیام می‌فرسته، سرور ۱ اون رو برای کلاینت‌های وصل به *خودش* پخش می‌کنه، همون مجموعه‌ی \`clients\` تو حافظه‌ش، دقیقاً مثل مثال ما. Ben و Cyrus رو سرورهای دیگه‌ان، پس هیچ‌وقت نمی‌گیرنش. هر کاربر فقط پیام‌های کسایی رو می‌بینه که از قضا رو همون سرورن.

**راه‌حل:** سرورها باید پیام‌ها رو با هم شریک بشن. طراحی‌های رایج:

- **یه کارگزار پیام با انتشار/اشتراک** (Redis pub/sub، NATS، Kafka): وقتی سرور ۱ پیام Ana رو می‌گیره، تو کانال «اتاق ۷» منتشرش می‌کنه؛ هر سه سرور مشترک اون کانالن و پیام رو به کلاینت‌های خودشون تو اتاق ۷ می‌رسونن.
- پیام‌ها رو تو یه **پایگاه داده** هم ذخیره کن، تا کاربرهایی که دوباره وصل می‌شن (یا بعد از قطع شدن به یه سرور دیگه وصل می‌شن) بتونن چیزهایی رو که از دست دادن بار کنن.

این هم مهمه: متعادل‌کننده‌ی بار باید ارتقای WebSocket و اتصال‌های طولانی (مهلت‌ها) رو پشتیبانی کنه، و کلاینت باید خودکار دوباره وصل بشه، شاید به یه سرور دیگه. نشست چسبنده به‌تنهایی اینو حل نمی‌کنه، چون Ana و Ben هنوز رو سرورهای متفاوتن.
:::
::::
`;export{e as default};