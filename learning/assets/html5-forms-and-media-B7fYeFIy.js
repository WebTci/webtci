var e=`## از خوندن تا انجام دادن

[مبحث قبل](/internet-engineering/html5-basics) درباره‌ی صفحه‌هایی بود که آدم‌ها **می‌خونن**. این یکی درباره‌ی صفحه‌هاییه که آدم‌ها **ازشون استفاده می‌کنن**: فرم‌هایی که اطلاعات جمع می‌کنن (یه جعبه‌ی جست‌وجو، ورود، پرداخت)، جدول‌هایی که داده رو روشن نشون می‌دن، و رسانه: صدا و ویدئو. دایتل این‌ها رو تو فصل دوم HTML5 پوشش می‌ده.

## فرم: صفحه چطور ورودی می‌خواد

یه **فرم** داده رو از کاربر جمع می‌کنه و به یه سرور می‌فرسته. عنصر \`<form>\` دو ویژگی کلیدی داره:

- \`action\`: آدرس URLی که داده به اون فرستاده می‌شه (مثلاً \`/search\`). اگه نباشه، داده به URL صفحه‌ی فعلی می‌ره.
- \`method\`: چطور فرستاده بشه. \`get\` داده رو تو URL می‌ذاره؛ \`post\` تو بدنه‌ی درخواست.

داخل فرم **کنترل‌ها** قرار می‌گیرن: جعبه‌ی متن، چک‌باکس، منو، دکمه. هر کنترلی که باید فرستاده بشه یه \`name\` لازم داره: داده به شکل جفت‌های \`name=value\` به سرور می‌رسه.

\`\`\`html
<form action="/search" method="get">
  <label for="q">Search the library</label>
  <input id="q" name="q" type="search" placeholder="Title or author" required>
  <button type="submit">Search</button>
</form>
\`\`\`

**GET یا POST؟**

- **GET** رو وقتی به کار ببر که درخواست فقط یه چیزی رو **می‌خونه** و می‌شه نشانکش کرد یا به اشتراکش گذاشت: جست‌وجو، فیلتر. داده تو URL (\`/search?q=html\`)، تو تاریخچه‌ی مرورگر و لاگ‌های سرور دیده می‌شه، پس هیچ‌وقت GET رو برای رمز یا داده‌ی شخصی به کار نبر.
- **POST** رو وقتی به کار ببر که درخواست یه چیزی رو **عوض می‌کنه** یا داده‌ی خصوصی یا بزرگ می‌فرسته: ورود، سفارش، بارگذاری فایل. داده تو بدنه‌ی درخواست سفر می‌کنه. ([وب و HTTP](/computer-networks/web-and-http) رو ببین که این درخواست‌ها چه شکلی‌ان.)

:::show
\`\`\`anim
messages مرورگر سرور
note | همون فرم، به دو شکل ثبت می‌شه.
send مرورگر سرور GET /search?q=html+books | method="get": فیلدها رشته‌ی پرس‌وجو می‌شن. قابل نشانک، تو نوار آدرس دیده می‌شه.
send سرور مرورگر 200 OK (صفحه‌ی نتیجه) | جست‌وجو چیزی رو رو سرور عوض نمی‌کنه، پس GET درسته.
note | حالا یه فرم ورود، با method="post".
send مرورگر سرور POST /login (بدنه: user=sara&pw=...) | فیلدها تو بدنه سفر می‌کنن، نه تو URL، تاریخچه یا لاگ.
send سرور مرورگر 303 See Other به /home | سرور کاربر رو وارد می‌کنه و تغییر مسیر می‌ده.
send مرورگر سرور GET /home | مرورگر تغییر مسیر رو دنبال می‌کنه. حالا تازه کردن صفحه رمز رو دوباره نمی‌فرسته.
note | POST برای تغییر و داده‌ی خصوصی؛ GET برای خوندن. و HTTPS برای هر دو.
\`\`\`
:::

## کنترل‌های فرم

عنصر \`<input>\` کلی **نوع** (type) داره. نوع، کیبورد گوشی، اعتبارسنجی داخلی و رابط کاربری رو عوض می‌کنه:

| نوع | کاربرد | نکته |
|---|---|---|
| \`text\` | متن آزاد کوتاه | پیش‌فرض |
| \`email\`، \`url\`، \`tel\` | اطلاعات تماس | گوشی‌ها کیبورد مناسب نشون می‌دن؛ email و url اعتبارسنجی می‌شن |
| \`password\` | رمز عبور | کاراکترها پنهان می‌شن |
| \`number\`، \`range\` | عدد | با \`min\`، \`max\` و \`step\` |
| \`date\`، \`time\`، \`datetime-local\` | تاریخ و زمان | مرورگر یه انتخابگر تاریخ نشون می‌ده |
| \`checkbox\` | بله/نه، یا چند انتخاب | فقط وقتی تیک خورده فرستاده می‌شه |
| \`radio\` | یه انتخاب از یه گروه | همه‌ی رادیوهای یه گروه یه \`name\` دارن |
| \`file\` | بارگذاری فایل | \`method="post"\` و \`enctype="multipart/form-data"\` لازم داره |
| \`hidden\` | داده‌ای که کاربر نمی‌بینه | محرمانه **نیست**: تو کد منبع صفحه دیده می‌شه |
| \`search\`، \`color\` | جعبه‌ی جست‌وجو، انتخابگر رنگ | |

کنترل‌های دیگه: \`<textarea>\` برای متن چندخطی، \`<select>\` با \`<option>\`ها برای یه فهرست کشویی، و \`<button>\` (با \`type="submit"\`، \`type="reset"\` یا \`type="button"\`).

**برچسب‌ها ضروری‌ان.** هر کنترل یه \`<label>\` لازم داره، که یا با \`for\`/\`id\` (مثل بالا) یا با گذاشتن کنترل داخل برچسب وصل می‌شه. برچسب چیزیه که صفحه‌خوان‌ها اعلام می‌کنن، و کلیک روش کنترل رو فعال می‌کنه، که رو گوشی هدف خیلی بزرگ‌تریه. یه \`placeholder\` برچسب **نیست**: وقتی کاربر شروع به تایپ می‌کنه ناپدید می‌شه. کنترل‌های مرتبط رو می‌شه با \`<fieldset>\` و یه \`<legend>\` گروه کرد (مثلاً «آدرس تحویل»).

## اعتبارسنجی داخلی

HTML5 می‌تونه ورودی رو قبل از فرستادن فرم، بدون هیچ جاوااسکریپتی، چک کنه:

- \`required\`: فیلد نباید خالی باشه.
- \`minlength\` و \`maxlength\`: حد طول متن.
- \`min\`، \`max\` و \`step\`: حد عدد و تاریخ.
- \`pattern\`: یه عبارت منظم که کل مقدار باید باهاش جور باشه؛ مثلاً \`pattern="[0-9]{5}"\` برای یه کد پستی پنج‌رقمی.
- \`type="email"\` و \`type="url"\`: مقدار باید شبیه یه آدرس ایمیل یا یه URL باشه.

اگه یه بررسی شکست بخوره، مرورگر کنار فیلد یه پیغام نشون می‌ده و از ثبت جلوگیری می‌کنه. این به کاربرها بازخورد فوری می‌ده.

ولی **اعتبارسنجی سمت کاربر فقط برای راحتیه، هیچ‌وقت برای امنیت نیست.** هر کسی می‌تونه ابزارهای توسعه‌دهنده رو باز کنه و ویژگی \`required\` رو حذف کنه، یا یه درخواست رو مستقیم بدون هیچ فرمی بفرسته. سرور باید **همه‌چی** رو دوباره چک کنه ([برنامه‌نویسی سمت سرور](/internet-engineering/server-side-programming) و [امنیت وب](/internet-engineering/web-security) رو ببین).

## جدول: داده تو سطر و ستون

جدول‌ها برای **داده‌ی جدولی**‌ان: اطلاعاتی با سطر و ستون، مثل برنامه‌ی کلاس یا فهرست قیمت. (تو وب اولیه برای چیدمان صفحه هم ازشون سوءاستفاده می‌شد؛ الان این کار CSS ـه.)

\`\`\`html
<table>
  <caption>Class timetable</caption>
  <thead>
    <tr><th scope="col">Time</th><th scope="col">Monday</th><th scope="col">Tuesday</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">09:00</th><td>HTML</td><td>CSS</td></tr>
    <tr><th scope="row">11:00</th><td>JavaScript</td><td>Lab</td></tr>
  </tbody>
</table>
\`\`\`

- \`<table>\` سطرها (\`<tr>\`) رو داره، که سلول‌ها رو دارن: \`<th>\` برای سرتیتر و \`<td>\` برای داده.
- \`<caption>\` به جدول یه عنوان می‌ده که صفحه‌خوان‌ها اعلامش می‌کنن.
- \`<thead>\`، \`<tbody>\` و \`<tfoot>\` سطرهای سرتیتر، داده و خلاصه (مثل جمع) رو گروه می‌کنن.
- \`scope="col"\` یا \`scope="row"\` رو یه \`<th>\` می‌گه سرتیتر یه ستونه یا یه سطر. این‌جوریه که یه صفحه‌خوان می‌تونه بگه «سه‌شنبه، ۱۱:۰۰: آزمایشگاه» به‌جای فقط «آزمایشگاه».
- \`colspan\` و \`rowspan\` یه سلول رو رو چند ستون یا سطر پهن می‌کنن.

:::show
\`\`\`anim
grid 3 3
rows زمان ۰۹:۰۰ ۱۱:۰۰
cols شنبه یکشنبه دوشنبه
row 0 شنبه یکشنبه دوشنبه
row 1 HTML CSS JS
row 2 آزمایش آزمایش امتحان
note | جدول یه شبکه‌ست، ولی سلول‌ها فقط همراه سرتیترهاشون معنی دارن.
mark 0 0 0 1 0 2 | سطر اول سرتیترهای ستون رو داره: th با scope="col".
mark 1 1 | یه کاربر بینا «CSS» رو می‌بینه و برای فهمیدنش یه نگاه به بالا و کنار می‌ندازه.
done 0 1 | یه صفحه‌خوان نمی‌تونه نگاه بندازه. از سرتیترها استفاده می‌کنه: سرتیتر ستون «یکشنبه» ـه...
mark 1 1 | ...و سرتیتر سطر زمانه، یه th با scope="row" اول هر سطر.
note | پس صفحه‌خوان اعلام می‌کنه «یکشنبه، ۰۹:۰۰: CSS». بدون th و scope، فقط می‌گفت «CSS».
\`\`\`
:::

## صدا و ویدئو

قبل از HTML5، پخش صدا یا ویدئو تو یه صفحه یه افزونه (مثل فلش) لازم داشت. HTML5 عنصرهای داخلی اضافه کرد:

\`\`\`html
<video controls width="640" poster="lecture-poster.jpg">
  <source src="lecture.webm" type="video/webm">
  <source src="lecture.mp4" type="video/mp4">
  <track kind="captions" src="lecture.en.vtt" srclang="en" label="English">
  <p>Your browser can't play this video. <a href="lecture.mp4">Download it</a> instead.</p>
</video>
<audio controls src="podcast.mp3"></audio>
\`\`\`

- \`controls\` دکمه‌های پخش، توقف و صدای مرورگر رو نشون می‌ده.
- چند تا \`<source>\` قالب‌های مختلف پیشنهاد می‌دن؛ مرورگر اولین قالبی رو که پشتیبانی می‌کنه پخش می‌کنه.
- \`<track>\` **زیرنویس** اضافه می‌کنه (با قالب WebVTT). زیرنویس برای کاربرهای ناشنوا ضروریه و برای هر کسی که بی‌صدا تماشا می‌کنه مفیده.
- \`poster\` عکسیه که قبل از شروع ویدئو نشون داده می‌شه.
- محتوای داخل (\`<p>\`) یه **جایگزین** برای مرورگرهاییه که نمی‌تونن پخشش کنن.
- \`autoplay\` رو با احتیاط به کار ببر: مرورگرها پخش خودکار با صدا رو مسدود می‌کنن، و صدای غیرمنتظره کاربرها رو اذیت می‌کنه.

محتوای جاسازی‌شده‌ی دیگه: \`<iframe>\` یه صفحه‌ی دیگه رو جاسازی می‌کنه (یه نقشه، یه ویدئو از یه سایت ویدئو)؛ \`<canvas>\` یه سطح نقاشی برای جاوااسکریپته که تو [APIهای HTML5](/internet-engineering/html5-apis) پوشش داده می‌شه.

## کی به کارت میاد، کی نه؟

| موقعیت | چی جوره | چرا |
|---|---|---|
| یه جست‌وجو یا فیلتر | \`<form method="get">\` | نتیجه قابل نشانک و اشتراکه |
| ورود، پرداخت، هر چیزی که داده رو عوض می‌کنه | \`<form method="post">\` رو HTTPS | داده بیرون از URL و لاگ می‌مونه |
| وارد کردن ایمیل رو گوشی | \`<input type="email">\` | کیبورد درست و بررسی داخلی |
| فهرست قیمت یا برنامه‌ی کلاس | \`<table>\` با \`<th scope>\` و \`<caption>\` | قابل خوندن برای صفحه‌خوان‌ها |
| چیدن یه صفحه تو چند ستون | CSS، نه جدول | جدول برای داده‌ست، نه چیدمان |
| ویدئوی یه درس | \`<video>\` با زیرنویس \`<track>\` | دسترس‌پذیر، بدون افزونه |

## مثال ساده: یه فرم واقعاً چی می‌فرسته (جاوااسکریپت)

وقتی یه فرم ثبت می‌شه، مرورگر فیلدهاش رو به شکل جفت‌های \`name=value\` که با \`&\` به هم وصلن **کدگذاری** می‌کنه. فاصله‌ها \`+\` می‌شن، و کاراکترهایی که معنی خاص دارن (\`&\`، \`=\`، \`?\`) یا بیرون از ASCII ـن (مثل حروف فارسی) به \`%\` و بعد مقدار هگزای هر بایت تبدیل می‌شن. \`URLSearchParams\` دقیقاً همون کاری رو می‌کنه که مرورگر می‌کنه.

\`\`\`javascript
// مرورگر وقتی یه فرم ثبت می‌شه واقعاً چی می‌فرسته.
// فیلدهای یه فرم جست‌وجو، به شکل جفت‌های name/value:
const fields = [
  ["q", "HTML & CSS books"],
  ["lang", "fa"],
  ["topic", "وب"],
  ["page", "2"],
];
const encoded = new URLSearchParams(fields).toString();

// method="get": داده بعد از «?» تو URL می‌ره
console.log("GET  /search?" + encoded);

// method="post": همون کدگذاری، ولی تو بدنه‌ی درخواست
console.log("POST /search");
console.log("     Content-Type: application/x-www-form-urlencoded");
console.log("     body: " + encoded);

// سرور دوباره به جفت‌های name/value برمی‌گردونتش
const decoded = new URLSearchParams(encoded);
console.log("\\nserver sees:");
for (const [name, value] of decoded) console.log(\`  \${name.padEnd(5)} = \${value}\`);
console.log(\`encoded length \${encoded.length} characters for \${fields.map(([, v]) => v).join("").length} characters of data\`);
\`\`\`

\`\`\`text
GET  /search?q=HTML+%26+CSS+books&lang=fa&topic=%D9%88%D8%A8&page=2
POST /search
     Content-Type: application/x-www-form-urlencoded
     body: q=HTML+%26+CSS+books&lang=fa&topic=%D9%88%D8%A8&page=2

server sees:
  q     = HTML & CSS books
  lang  = fa
  topic = وب
  page  = 2
encoded length 54 characters for 21 characters of data
\`\`\`

نتیجه‌ها رو بخونیم:

- **\`&\` داخل «HTML & CSS» شد \`%26\`.** وگرنه سرور فکر می‌کرد یه فیلد تازه اونجا شروع می‌شه، و یه فیلد به اسم « CSS books» بدون مقدار می‌خوند. دقیقاً برای همینه که هیچ‌وقت نباید رشته‌ی پرس‌وجو رو با چسبوندن متن ساخت.
- **کلمه‌ی فارسی «وب» شد \`%D9%88%D8%A8\`:** هر حرف تو UTF-8 دو بایت جا می‌گیره، و هر بایت \`%\` به‌علاوه‌ی دو رقم هگزا می‌شه.
- **GET و POST داده رو یکسان کدگذاری می‌کنن؛** فقط جاش فرق داره. با GET تو URL ـه، پس سر از تاریخچه، نشانک‌ها و لاگ‌های سرور درمیاره. برای همینه که رمز عبور هیچ‌وقت نباید با GET فرستاده بشه، حتی رو HTTPS.
- **بارگذاری فایل** از یه کدگذاری دیگه، \`multipart/form-data\`، استفاده می‌کنه که هر فیلد رو به شکل یه بخش جدا می‌فرسته، تا فایل‌های دودویی لازم نباشه درصدی کدگذاری بشن.

## مثال متوسط: قانون‌های اعتبارسنجی مرورگر (جاوااسکریپت)

مرورگر قبل از ثبت، ویژگی‌های اعتبارسنجی HTML5 رو چک می‌کنه. همون بررسی‌ها رو تو جاوااسکریپت می‌نویسیم، برای یه فرم ثبت‌نام با یه اسم اجباری (حداقل ۲ کاراکتر)، یه ایمیل اجباری، یه سن بین ۱۸ و ۱۲۰، یه کد پستی پنج‌رقمی و یه وب‌سایت اختیاری. پیغام‌ها از پیغام‌هایی که مرورگرها نشون می‌دن تقلید می‌کنن. یادت باشه: سرور باید تک‌تک این بررسی‌ها رو تکرار کنه.

\`\`\`javascript
// بررسی‌هایی که مرورگر برای ویژگی‌های فرم HTML5 انجام می‌ده، به زبان جاوااسکریپت.
// همین قانون‌ها باید دوباره رو سرور چک بشن: کاربرها می‌تونن خاموششون کنن.
const form = [
  { name: "name", type: "text", required: true, minlength: 2 },
  { name: "email", type: "email", required: true },
  { name: "age", type: "number", min: 18, max: 120 },
  { name: "postcode", type: "text", pattern: "[0-9]{5}" },
  { name: "website", type: "url" },
];

function validate(field, value) {
  if (value === "") return field.required ? "Please fill out this field." : null;
  if (field.minlength && value.length < field.minlength) return \`Use at least \${field.minlength} characters.\`;
  if (field.type === "email" && !/^[^\\s@]+@[^\\s@]+$/.test(value)) return "Enter an email address.";
  if (field.type === "url" && !URL.canParse(value)) return "Enter a URL.";
  if (field.type === "number") {
    if (!/^-?\\d+(\\.\\d+)?$/.test(value)) return "Enter a number.";
    if (field.min !== undefined && Number(value) < field.min) return \`Value must be \${field.min} or more.\`;
    if (field.max !== undefined && Number(value) > field.max) return \`Value must be \${field.max} or less.\`;
  }
  if (field.pattern && !new RegExp(\`^(?:\${field.pattern})$\`).test(value)) return "Match the requested format.";
  return null;
}

const submissions = [
  { name: "Sara", email: "sara@example.com", age: "29", postcode: "14567", website: "" },
  { name: "R", email: "reza.example.com", age: "16", postcode: "1456", website: "my site" },
  { name: "", email: "", age: "abc", postcode: "", website: "https://mina.dev" },
];
for (const [i, data] of submissions.entries()) {
  const errors = form.map((f) => [f.name, validate(f, data[f.name])]).filter(([, e]) => e);
  console.log(\`submission \${i + 1}: \${errors.length ? "blocked" : "sent to the server"}\`);
  for (const [name, message] of errors) console.log(\`  \${name.padEnd(8)} \${message}\`);
}
\`\`\`

\`\`\`text
submission 1: sent to the server
submission 2: blocked
  name     Use at least 2 characters.
  email    Enter an email address.
  age      Value must be 18 or more.
  postcode Match the requested format.
  website  Enter a URL.
submission 3: blocked
  name     Please fill out this field.
  email    Please fill out this field.
  age      Enter a number.
\`\`\`

نتیجه‌ها رو بخونیم:

- **فیلدهای اختیاری خالی اشکالی ندارن:** تو ثبت ۱ وب‌سایت خالیه، و چون \`required\` نیست مجازه. کد پستی خالی تو ثبت ۳ هم به همین دلیل قبول می‌شه.
- **\`pattern\` باید با **کل** مقدار جور باشه.** مرورگر با \`[0-9]{5}\` طوری رفتار می‌کنه که انگار \`^(?:[0-9]{5})$\` ـه؛ پس «1456» رد می‌شه، و «123456» هم رد می‌شد. ما هم الگو رو همین‌جوری پیچیدیم.
- **یه پیغام برای هر فیلد:** وقتی یه بررسی شکست می‌خوره، بقیه‌ی بررسی‌های اون فیلد دیگه مهم نیستن. مرورگرها هم فقط اولین مشکل رو نشون می‌دن.
- **بررسی ایمیل عمداً شُله.** آدرس‌های ایمیل واقعی خیلی متنوعن؛ تنها تست قابل اطمینان فرستادن یه ایمیل تأییده. اعتبارسنجی باید غلط تایپی رو بگیره، نه کاربرهای واقعی رو رد کنه.

## مثال پیشرفته: یه جدول دسترس‌پذیر از داده (جاوااسکریپت)

داده معمولاً از یه پایگاه داده یا API میاد، و سرور (یا جاوااسکریپت) به HTML تبدیلش می‌کنه. یه جدول با عنوان، سرتیتر ستون، سرتیتر سطر، یه جمع تو پایین، و مهم‌تر از همه **فرار دادن** (escaping) هر مقداری که از کاربرها اومده می‌سازیم: یه اسم محصول که \`<\` داره یا اسم مشتری‌ای با \`&\` باید به شکل متن نشون داده بشه، نه به‌عنوان HTML تفسیر بشه.

\`\`\`javascript
// داده رو به یه جدول HTML دسترس‌پذیر تبدیل کن و هر چیزی که از کاربرها اومده رو فرار بده
const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const orders = [
  { customer: "Sara", product: "HTML book", qty: 2, price: 18.5 },
  { customer: "Reza", product: "CSS <basics> course", qty: 1, price: 40 },
  { customer: "Mina & Co.", product: "JS stickers", qty: 10, price: 1.2 },
];

function table(caption, rows) {
  const money = (n) => n.toFixed(2);
  const total = rows.reduce((s, r) => s + r.qty * r.price, 0);
  const lines = [
    "<table>",
    \`  <caption>\${escape(caption)}</caption>\`,
    "  <thead>",
    '    <tr><th scope="col">Customer</th><th scope="col">Product</th><th scope="col">Qty</th><th scope="col">Amount</th></tr>',
    "  </thead>",
    "  <tbody>",
    ...rows.map((r) => \`    <tr><th scope="row">\${escape(r.customer)}</th><td>\${escape(r.product)}</td><td>\${r.qty}</td><td>\${money(r.qty * r.price)}</td></tr>\`),
    "  </tbody>",
    "  <tfoot>",
    \`    <tr><th scope="row" colspan="3">Total</th><td>\${money(total)}</td></tr>\`,
    "  </tfoot>",
    "</table>",
  ];
  return lines.join("\\n");
}

console.log(table("Orders, October 2026", orders));
\`\`\`

\`\`\`text
<table>
  <caption>Orders, October 2026</caption>
  <thead>
    <tr><th scope="col">Customer</th><th scope="col">Product</th><th scope="col">Qty</th><th scope="col">Amount</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">Sara</th><td>HTML book</td><td>2</td><td>37.00</td></tr>
    <tr><th scope="row">Reza</th><td>CSS &lt;basics&gt; course</td><td>1</td><td>40.00</td></tr>
    <tr><th scope="row">Mina &amp; Co.</th><td>JS stickers</td><td>10</td><td>12.00</td></tr>
  </tbody>
  <tfoot>
    <tr><th scope="row" colspan="3">Total</th><td>89.00</td></tr>
  </tfoot>
</table>
\`\`\`

نتیجه‌ها رو بخونیم:

- **\`<basics>\` شد \`&lt;basics&gt;\`،** پس مرورگر متن «CSS <basics> course» رو نشون می‌ده به‌جای این‌که \`<basics>\` رو یه تگ (ناشناخته) حساب کنه و پنهانش کنه. با یه مقدار مخرب مثل \`<script>...<\/script>\`، فرار دادن تفاوت بین نشون دادن متن و اجرای کد یه مهاجمه. این حمله، **اسکریپت‌نویسی بین‌سایتی** (XSS)، تو [امنیت وب](/internet-engineering/web-security) پوشش داده می‌شه.
- **اسم مشتری سرتیتر سطره** (\`<th scope="row">\`)، پس یه صفحه‌خوان می‌تونه اعلام کنه «Reza، مبلغ: 40.00». ستونی رو سرتیتر سطر کن که هر سطر رو شناسایی می‌کنه.
- **جمع تو \`<tfoot>\` نشسته،** با \`colspan="3"\` تا برچسبش سه ستون اول رو بپوشونه. صفحه‌خوان‌ها و CSS می‌تونن با سطرهای خلاصه جور دیگه‌ای رفتار کنن.
- **عددها یه بار، یه جا قالب‌بندی می‌شن** (\`money\`)، پس ۳۷ به شکل \`37.00\` نشون داده می‌شه و همه‌ی مبلغ‌ها هم‌تراز می‌شن. برنامه‌های واقعی از \`Intl.NumberFormat\` برای قالب‌بندی پول برای هر زبان و ارز استفاده می‌کنن.

## نگاه یه مهندس ارشد

- **هر کنترل فرم یه برچسب دیدنی لازم داره.** بزرگ‌ترین برد دسترس‌پذیری و کاربردپذیری تو فرم‌ها همینه.
- **دو بار اعتبارسنجی کن:** تو مرورگر برای راحتی، رو سرور برای درستی و امنیت.
- **کمتر بپرس.** هر فیلد اضافه تعداد کسانی رو که فرم رو تموم می‌کنن کم می‌کنه. فیلدهای اختیاری باید اختیاری علامت بخورن، یا حذف بشن.
- **از نوع ورودی درست استفاده کن.** \`type="email"\`، \`inputmode="numeric"\` و ویژگی‌های \`autocomplete\` پر کردن فرم رو رو گوشی خیلی سریع‌تر می‌کنن.
- **به ویدئوها زیرنویس و متن پیاده‌شده بده.** تو خیلی کشورها برای دسترس‌پذیری الزامیه، و محتوا رو قابل جست‌وجو می‌کنه.

## اشتباه‌های رایج

:::mistakes
- **استفاده از GET برای رمز یا داده‌ی شخصی:** سر از URL، تاریخچه و لاگ درمیاره.
- **تکیه‌ی فقط به اعتبارسنجی مرورگر:** خیلی راحت دور زده می‌شه؛ سرور هم باید اعتبارسنجی کنه.
- **placeholder به‌جای برچسب:** موقع تایپ ناپدید می‌شه و قابل اطمینان اعلام نمی‌شه.
- **کنترل‌های بدون \`name\`:** مقدارشون هیچ‌وقت فرستاده نمی‌شه.
- **جدول بدون \`<th>\`، \`scope\` یا \`<caption>\`:** کاربرهای صفحه‌خوان سلول‌های بی‌ربط می‌شنون.
- **گذاشتن داده‌ی کاربر تو HTML بدون فرار دادن:** در بهترین حالت یه صفحه‌ی خراب، در بدترین حالت یه حمله‌ی XSS.
:::

## خلاصه

:::takeaways[چیزهایی که باید یادت بمونه]
- یه \`<form>\` یه \`action\` (کجا) و یه \`method\` (GET برای خوندن، POST برای تغییر و داده‌ی خصوصی) داره؛ کنترل‌ها برای فرستاده شدن یه \`name\` لازم دارن.
- نوع‌های ورودی (email، number، date، checkbox، radio، file...) کیبورد، رابط و بررسی‌های داخلی درست رو می‌دن.
- هر کنترل یه \`<label>\` لازم داره؛ کنترل‌های مرتبط رو با \`<fieldset>\` و \`<legend>\` گروه کن.
- ویژگی‌های اعتبارسنجی HTML5 (required، min/max، minlength، pattern، type) بازخورد فوری می‌دن، ولی سرور باید دوباره اعتبارسنجی کنه.
- داده‌ی فرم به شکل جفت‌های \`name=value\` با کدگذاری درصدی کدگذاری می‌شه؛ بارگذاری فایل از multipart استفاده می‌کنه.
- جدول برای داده‌ست: \`<caption>\`، \`<thead>\`/\`<tbody>\`/\`<tfoot>\`، \`<th scope>\`.
- \`<video>\` و \`<audio>\` رسانه رو بدون افزونه پخش می‌کنن؛ چند منبع، زیرنویس با \`<track>\`، و یه جایگزین بده.
- داده‌ی کاربر رو قبل از گذاشتن تو HTML فرار بده.
:::

## این مبحث کجای نقشه‌ست؟

\`\`\`mermaid
flowchart LR
  H["مبانی HTML5"] --> F["فرم، جدول و رسانه"]
  F --> S["برنامه‌نویسی سمت سرور"]
  F --> D["DOM و رویدادها"]
  F --> X["امنیت وب"]
\`\`\`

مبحث بعدی [CSS: انتخابگر، آبشار و مدل جعبه](/internet-engineering/css-basics) ـه: این‌که چطور ظاهر همه‌ی این عنصرها رو کنترل کنیم.

## تمرین

اول خودت جواب بده، بعد جواب رو باز کن.

::::exercise
**تمرین ۱.** برای هر فرم GET یا POST رو انتخاب کن و توضیح بده: (الف) فیلتر محصول بر اساس قیمت و رنگ؛ (ب) عوض کردن رمز عبور؛ (ج) بارگذاری عکس پروفایل؛ (د) جعبه‌ی جست‌وجوی سایت.

:::answer
- **(الف) GET:** فقط می‌خونه، و کاربرها باید بتونن فهرست فیلترشده رو نشانک یا به اشتراک بذارن.
- **(ب) POST:** داده رو عوض می‌کنه، و رمزها هیچ‌وقت نباید تو URL، تاریخچه یا لاگ ظاهر بشن.
- **(ج) POST** با \`enctype="multipart/form-data"\`: فایل‌ها بزرگ و دودویی‌ان، و بارگذاری داده رو عوض می‌کنه.
- **(د) GET:** نتیجه‌های جست‌وجو باید قابل نشانک و اشتراک باشن؛ جست‌وجو چیزی رو عوض نمی‌کنه.
:::
::::

::::exercise
**تمرین ۲.** HTML یه فرم «تماس با ما» رو بنویس با: یه اسم اجباری، یه ایمیل اجباری، یه موضوع که از سه گزینه انتخاب می‌شه (Question، Complaint، Other)، یه پیام اجباری با حداقل ۲۰ کاراکتر، و یه دکمه‌ی ثبت. هر کنترل باید برچسب داشته باشه.

:::answer
\`\`\`text
<form action="/contact" method="post">
  <label for="name">Name</label>
  <input id="name" name="name" type="text" required autocomplete="name">

  <label for="email">Email</label>
  <input id="email" name="email" type="email" required autocomplete="email">

  <label for="subject">Subject</label>
  <select id="subject" name="subject">
    <option value="question">Question</option>
    <option value="complaint">Complaint</option>
    <option value="other">Other</option>
  </select>

  <label for="message">Message</label>
  <textarea id="message" name="message" required minlength="20" rows="6"></textarea>

  <button type="submit">Send</button>
</form>
\`\`\`

از POST استفاده می‌کنه، چون فرستادن یه پیام یه چیزی رو عوض می‌کنه (یه پیام ذخیره یا ایمیل می‌شه) و داده‌ی شخصی داره.
:::
::::

::::exercise
**تمرین ۳.** با قانون‌های مثال متوسط، هر مقدار چه پیغامی می‌گیره؟ (الف) سن \`"121"\`؛ (ب) کد پستی \`"12a45"\`؛ (ج) ایمیل \`"sara@"\`؛ (د) وب‌سایت \`"https://"\`.

:::answer
- (الف) \`"121"\` ← «Value must be 120 or less.»
- (ب) \`"12a45"\` ← «Match the requested format.» (پنج رقم نیست)
- (ج) \`"sara@"\` ← «Enter an email address.» (بعد از \`@\` هیچ‌چی نیست)
- (د) \`"https://"\` ← تجزیه‌گر URL یه URL بدون میزبان رو رد می‌کنه، پس «Enter a URL.»
:::
::::

::::exercise
**تمرین ۴ (فکر کن، حفظ نکن).** یه فرم پرداخت \`<input type="number" name="quantity" min="1" max="10">\` و یه فیلد پنهان \`<input type="hidden" name="price" value="49.90">\` داره. سرور هر دو رو می‌خونه و \`quantity × price\` رو برداشت می‌کنه. چه اشکالی داره، و چطور درستش می‌کنی؟

:::answer
هر دو مقدار از مرورگر میان، پس **هر دو رو کاربر می‌تونه عوض کنه**:

- **\`price\` تو یه فیلد پنهان:** هر کسی می‌تونه صفحه رو ویرایش کنه (یا یه درخواست دست‌ساز بفرسته) با \`price=0.01\`. اون‌وقت سرور یه سنت برداشت می‌کرد. فیلدهای پنهان از دید پنهانن، نه از کاربر.
- **حدهای \`quantity\`:** \`min\` و \`max\` فقط تو مرورگر چک می‌شن. یه درخواست دست‌ساز می‌تونه \`quantity=-5\` (یه بازپرداخت؟) یا \`quantity=100000\` بفرسته.

راه‌حل:

1. **هیچ‌وقت به قیمت یا جمعی که از کلاینت میاد اعتماد نکن.** فقط شناسه‌ی محصول رو بفرست؛ سرور قیمت فعلی رو تو پایگاه داده‌ش پیدا می‌کنه.
2. **رو سرور اعتبارسنجی کن:** تعداد باید یه عدد صحیح بین ۱ و ۱۰ (یا موجودی انبار) باشه، هر چی مرورگر بگه.
3. ویژگی‌های HTML رو برای راحتی کاربر نگه دار، ولی با هر چیزی که به سرور می‌رسه مثل ورودی غیرقابل اعتماد رفتار کن.

این یکی از رایج‌ترین باگ‌های واقعی فروشگاه‌های اینترنتیه.
:::
::::
`;export{e as default};