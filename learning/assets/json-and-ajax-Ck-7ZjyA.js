var e=`## صفحه‌هایی که خودشون رو به‌روز می‌کنن

تو وب اولیه، هر تعامل یه صفحه‌ی کامل تازه بار می‌کرد: «بعدی» رو کلیک کن، صبر کن، صفحه سفید بشه، یه صفحه‌ی تازه ظاهر بشه. سال ۲۰۰۵ جسی جیمز گرت به یه روش دیگه که جیمیل و گوگل مپس استفاده می‌کردن یه اسم داد: **Ajax** (جاوااسکریپت و XML ناهم‌زمان). صفحه رو صفحه‌نمایش می‌مونه؛ جاوااسکریپت تو پس‌زمینه از سرور **داده** می‌خواد، و فقط بخشی از صفحه رو که عوض شده به‌روز می‌کنه. پیام‌های تازه تو صندوقت ظاهر می‌شن؛ نقشه با کشیدنش کاشی‌های بیشتری بار می‌کنه؛ پیشنهادهای جست‌وجو موقع تایپ ظاهر می‌شن.

دایتل این رو تو دو فصل پوشش می‌ده: یکی درباره‌ی **XML**، قالب داده‌ای که «X» تو Ajax اولش اشاره به اون بود، و یکی درباره‌ی «برنامه‌های اینترنتی غنی با Ajax، XML و **JSON**». امروز JSON تقریباً جای XML رو برای این کار گرفته، و شیء قدیمی \`XMLHttpRequest\` جاش رو به **\`fetch\`** ساده‌تر داده، که با **promise**ها و **\`async\`/\`await\`** استفاده می‌شه. این مبحث همه‌ش رو پوشش می‌ده.

## XML

**XML** (زبان نشانه‌گذاری گسترش‌پذیر) شبیه HTML ـه، ولی تگ‌ها رو خودت برای توصیف داده‌ی خودت اختراع می‌کنی:

\`\`\`html
<course id="ie101">
  <title>Internet Engineering</title>
  <credits>3</credits>
  <topics>
    <topic>HTML</topic>
    <topic>CSS</topic>
  </topics>
</course>
\`\`\`

قانون‌های XML از HTML سخت‌گیرانه‌ترن: باید **خوش‌فرم** باشه: یه عنصر ریشه، هر تگ شروع بسته بشه، تودرتویی درست، مقدار ویژگی‌ها تو نقل‌قول، اسم‌ها حساس به بزرگی و کوچیکی حروف. یه سند رو می‌شه با یه شِما (DTD یا XML Schema) هم **اعتبارسنجی** کرد که می‌گه کدوم عنصرها کجا مجازن. فناوری‌های مرتبط شامل **فضای نام** (برای قاطی کردن واژگان)، **XPath** (برای انتخاب بخش‌هایی از یه سند) و **XSLT** (برای تبدیلش) ـن.

XML هنوز زیاد استفاده می‌شه: تو قالب سندهای اداری (\`.docx\` یه XML زیپ‌شده‌ست)، گرافیک SVG، خوراک‌های خبری RSS، فایل‌های پیکربندی و وب‌سرویس‌های SOAP. ولی برای فرستادن داده بین مرورگر و سرور، پرحرفه و خوندنش تو جاوااسکریپت سخته.

## JSON

**JSON** (نمادگذاری شیء جاوااسکریپت)، که داگلاس کراکفورد محبوبش کرد، داده رو با یه زیرمجموعه از نحو لفظی جاوااسکریپت می‌نویسه:

\`\`\`javascript
const course = {
  id: "ie101",
  title: "Internet Engineering",
  credits: 3,
  topics: ["HTML", "CSS"],
  online: true,
  room: null,
};
const text = JSON.stringify(course);
console.log(text);
console.log(JSON.parse(text).topics[1]);
\`\`\`

\`\`\`text
{"id":"ie101","title":"Internet Engineering","credits":3,"topics":["HTML","CSS"],"online":true,"room":null}
CSS
\`\`\`

JSON دقیقاً شش نوع مقدار داره: **شیء** (\`{}\` با کلیدهای رشته‌ای)، **آرایه**، **رشته** (همیشه تو نقل‌قول **دوتایی**)، **عدد**، **\`true\`/\`false\`** و **\`null\`**. نه توضیح، نه ویرگول آخر، نه تابع، نه تاریخ، نه \`undefined\`. این سخت‌گیری یه ویژگیه: هر زبانی می‌تونه راحت بخونه و بنویسدش.

تو جاوااسکریپت، دو تابع همه‌ی کار رو می‌کنن:

- \`JSON.stringify(value)\` یه مقدار رو به متن JSON تبدیل می‌کنه (برای فرستادن یا ذخیره).
- \`JSON.parse(text)\` متن JSON رو دوباره به مقدار تبدیل می‌کنه. اگه متن JSON معتبر نباشه یه \`SyntaxError\` پرتاب می‌کنه.

:::show
**یه مثال روزمره: برگه‌ی سفارش رستوران.**

- **XML** مثل یه نامه‌ی رسمی به آشپزخونه‌ست: «آشپزخانه‌ی محترم، لطفاً *غذای موسوم به* پیتزا را، *در اندازه‌ی* بزرگ، *با رویه‌ی* قارچ آماده فرمایید.» روشن، ساختارمند، و طولانی. هر مقدار تو یه باز و بسته‌ی اسم‌دار پیچیده شده.
- **JSON** برگه‌ایه که گارسون‌ها واقعاً استفاده می‌کنن: \`پیتزا، بزرگ، قارچ\`، با یه قالب ثابت که همه تو آشپزخونه می‌شناسن. کوتاه، سریع‌خوان، برای کار کافی.
- هر دو همون سفارش رو می‌برن. نامه وقتی بهتره که سفارش یه سند قانونیه که باید با قانون‌های سخت (یه شِما) چک بشه. برگه وقتی بهتره که هر دقیقه صدها سفارش رد و بدل می‌شه.
- برای همینه که APIهای بین مرورگر و سرور الان بیشتر JSON حرف می‌زنن، و XML جایی می‌مونه که سند و اعتبارسنجی سخت مهمن.
:::

## کد ناهم‌زمان: callback، promise، async/await

درخواست‌های شبکه وقت می‌گیرن: ده‌ها یا صدها میلی‌ثانیه، گاهی چند ثانیه. جاوااسکریپت تو یه صفحه رو یه رشته اجرا می‌شه ([حلقه‌ی رویداد](/internet-engineering/javascript-basics) رو ببین)، پس هیچ‌وقت نباید با متوقف کردن همه‌چی **منتظر** یه جواب بمونه؛ صفحه قفل می‌شد. به‌جاش، درخواست‌ها **ناهم‌زمان**‌ان: شروعشون می‌کنی، ادامه می‌دی، و وقتی نتیجه رسید خبرت می‌کنن.

سه نسل سبک:

1. **Callback:** یه تابع بده که بعداً با نتیجه صدا زده بشه. برای یه قدم خوبه، ولی چند قدم وابسته تودرتو می‌شن و یه «هرم عذاب» می‌سازن، و خطاها باید تو هر سطح مدیریت بشن.
2. **Promise:** یه **promise** شیئیه که یه مقدار رو نشون می‌ده که بعداً می‌رسه. **در انتظار** (pending) ـه، بعد یا **برآورده** (fulfilled، با یه مقدار) یا **رد** (rejected، با یه خطا) می‌شه. \`.then(onValue)\` و \`.catch(onError)\` رو بهش وصل می‌کنی، و قدم‌ها به‌جای تودرتو شدن زنجیر می‌شن.
3. **\`async\`/\`await\`:** داخل یه تابع \`async\`، \`await promise\` **همون تابع** رو تا معلوم شدن وضعیت promise متوقف می‌کنه، و مقدارش رو بهت می‌ده (یا خطاش رو پرتاب می‌کنه، که با \`try\`/\`catch\` می‌گیریش). کد مثل کد معمولی قدم‌به‌قدم خونده می‌شه، ولی هیچ‌چی مسدود نمی‌شه: کدهای دیگه موقع انتظار اجرا می‌شن.

ترکیب چند promise:

- \`Promise.all([...])\`: منتظر همه بمون؛ همین که یکی شکست بخوره شکست می‌خوره.
- \`Promise.allSettled([...])\`: منتظر همه بمون، و موفقیت یا شکست هر کدوم رو گزارش بده.
- \`Promise.race([...])\`: اولین کسی که وضعیتش معلوم بشه (موفق یا ناموفق) برنده‌ست.
- \`Promise.any([...])\`: اولین کسی که **موفق** بشه برنده‌ست.

## fetch: Ajax امروز

\`fetch(url, options)\` یه درخواست HTTP می‌فرسته و یه promise برای **پاسخ** برمی‌گردونه:

\`\`\`javascript
// const response = await fetch("/api/notes");
// if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
// const notes = await response.json();
\`\`\`

نکته‌هایی که باید یادت بمونه:

- \`fetch\` فقط برای خرابی‌های شبکه **رد** می‌شه (بدون اتصال، خطای DNS، مهلت). یه خطای HTTP مثل ۴۰۴ یا ۵۰۰ باز **برآورده** می‌شه: باید خودت \`response.ok\` (برای وضعیت ۲۰۰ تا ۲۹۹ درسته) یا \`response.status\` رو چک کنی.
- خوندن بدنه یه قدم ناهم‌زمان دومه: \`await response.json()\`، \`.text()\` یا \`.blob()\`.
- برای فرستادن داده: \`fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })\`.
- \`AbortController\` یا \`AbortSignal.timeout(ms)\` درخواستی رو که زیادی طول می‌کشه لغو می‌کنه.
- مرورگرها **سیاست هم‌مبدأ** (same-origin policy) رو اعمال می‌کنن: یه صفحه فقط پاسخ‌های مبدأ خودش رو می‌تونه بخونه، مگر این‌که سرور دیگه با سرآیندهای **CORS** اجازه بده ([امنیت وب](/internet-engineering/web-security) رو ببین).

:::show
\`\`\`anim
messages کاربر صفحه سرور
send کاربر صفحه تو جعبه‌ی جست‌وجو «deit» تایپ می‌کنه | صفحه دوباره بار نمی‌شه. جاوااسکریپت رویداد «input» رو می‌بینه.
send صفحه سرور GET /api/suggest?q=deit | fetch تو پس‌زمینه یه درخواست می‌فرسته. کاربر همین‌طور تایپ می‌کنه.
send کاربر صفحه «e» رو تایپ می‌کنه | یه کلید دیگه. صفحه می‌تونه درخواست اول رو لغو کنه (AbortController).
send صفحه سرور GET /api/suggest?q=deite | یه درخواست تازه برای متن تازه.
send سرور صفحه 200 ["Deitel", "Deitel & Deitel"] | JSON می‌رسه. await response.json() اونو به یه آرایه تبدیل می‌کنه.
self صفحه فقط فهرست پیشنهادها به‌روز می‌شه | فقط جعبه‌ی کوچیک پیشنهادها از روی داده دوباره ساخته می‌شه.
note | این Ajax ـه: داده تو پس‌زمینه، یه به‌روزرسانی جزئی، و کاربر هیچ‌وقت منتظر نمی‌مونه.
\`\`\`
:::

## برنامه‌های تک‌صفحه‌ای

اگه Ajax رو تا تهش ببری، به **برنامه‌ی تک‌صفحه‌ای** (SPA) می‌رسی: سرور یه صفحه‌ی HTML و یه برنامه‌ی جاوااسکریپت می‌فرسته؛ از اون به بعد، هر «عوض شدن صفحه» یعنی جاوااسکریپت JSON می‌گیره و صفحه رو دوباره می‌کشه، و با History API نوار آدرس رو به‌روز می‌کنه. جیمیل، گوگل داکس و همین سایت درس این‌جوری کار می‌کنن. مزیتش سرعت و روانیه؛ هزینه‌ش یه بار اول سنگین‌تر، پیچیدگی بیشتر، و کار اضافه برای این‌که پیوندها، دکمه‌ی برگشت، دسترس‌پذیری و موتورهای جست‌وجو کار کنن. خیلی از سایت‌ها الان صفحه‌ی اول رو رو سرور می‌سازن و برای به‌روزرسانی‌های بعدی از Ajax استفاده می‌کنن، تا هر دو سود رو بگیرن.

## کی به کارت میاد، کی نه؟

| موقعیت | چی جوره | چرا |
|---|---|---|
| داده بین مرورگر و API خودت | JSON | فشرده، بومی جاوااسکریپت |
| سندهایی با قانون‌های سخت، محتوای ترکیبی | XML با شِما | اعتبارسنجی و ساختار سند غنی |
| چند درخواست مستقل | \`Promise.all\` | موازی اجراشون کن |
| درخواست‌هایی که بعضی‌هاشون ممکنه شکست بخورن | \`Promise.allSettled\` | چیزی که کار کرد رو نشون بده، اونی که نکرد رو گزارش بده |
| یه سرور کُند یا ناپایدار | یه مهلت با \`AbortSignal\` | صفحه تا ابد معطل نمی‌مونه |
| یه صفحه‌ی ساده که گاهی عوض می‌شه | یه بار شدن عادی صفحه | Ajax بی‌سود پیچیدگی اضافه می‌کنه |

## مثال ساده: XML، JSON و محدودیت‌هاشون (جاوااسکریپت)

همون داده‌ی درس رو از XML و از JSON می‌خونیم، اندازه‌شون رو مقایسه می‌کنیم، و بعد نگاه می‌کنیم JSON چی رو **نمی‌تونه** ببره: تاریخ، \`undefined\` و تابع. یه تابع **احیاکننده** (reviver) که به \`JSON.parse\` داده می‌شه تاریخ‌ها رو برمی‌گردونه.

\`\`\`javascript
// همون داده به شکل XML و به شکل JSON
const xml = \`<course id="ie101">
  <title>Internet Engineering</title>
  <credits>3</credits>
  <topics>
    <topic>HTML</topic>
    <topic>CSS</topic>
  </topics>
</course>\`;
const json = \`{"id":"ie101","title":"Internet Engineering","credits":3,"topics":["HTML","CSS"]}\`;

// خوندن دستی XML کاره: عنصرها رو پیدا کن، و همه‌چی به شکل متن برمی‌گرده
const title = xml.match(/<title>(.*?)<\\/title>/)[1];
const credits = xml.match(/<credits>(.*?)<\\/credits>/)[1];
const topics = [...xml.matchAll(/<topic>(.*?)<\\/topic>/g)].map((m) => m[1]);
console.log(\`from XML:  \${title}, credits \${JSON.stringify(credits)} (a string), topics \${topics.join("+")}\`);

// JSON مستقیم رو مقدارهای جاوااسکریپت نگاشت می‌شه
const course = JSON.parse(json);
console.log(\`from JSON: \${course.title}, credits \${course.credits} (a \${typeof course.credits}), topics \${course.topics.join("+")}\`);
console.log(\`size: XML \${xml.length} characters, JSON \${json.length}\`);

// چیزی که JSON نمی‌تونه ببره: تاریخ رشته می‌شه، undefined و تابع ناپدید می‌شن
const lesson = { name: "Ajax", date: new Date("2026-11-02T09:00:00Z"), room: undefined, grade() {} };
const text = JSON.stringify(lesson);
console.log("\\nstringify:", text);
const back = JSON.parse(text);
console.log("date after parse is a", typeof back.date);
const revived = JSON.parse(text, (key, value) => (key === "date" ? new Date(value) : value));
console.log("with a reviver:", revived.date instanceof Date, revived.date.toISOString().slice(0, 10));

try {
  JSON.parse("{'name': 'Ajax'}");            // نقل‌قول تکی JSON نیست
} catch (e) {
  console.log("invalid JSON:", e.name);
}
\`\`\`

\`\`\`text
from XML:  Internet Engineering, credits "3" (a string), topics HTML+CSS
from JSON: Internet Engineering, credits 3 (a number), topics HTML+CSS
size: XML 160 characters, JSON 81

stringify: {"name":"Ajax","date":"2026-11-02T09:00:00.000Z"}
date after parse is a string
with a reviver: true 2026-11-02
invalid JSON: SyntaxError
\`\`\`

نتیجه‌ها رو بخونیم:

- **مقدارهای XML متنن؛** برنامه باید بدونه \`credits\` عدده و تبدیلش کنه. JSON عدد، بولی، آرایه و \`null\` رو به شکل نوع واقعی نگه می‌داره.
- **JSON حدود نصف XML حجم داره،** چون تگ بسته شدن نداره. تو میلیون‌ها صدا زدن API، این مهمه.
- **یه \`Date\` رشته می‌شه** (با قالب ISO 8601)، و \`room: undefined\` و تابع \`grade\` **بی‌صدا ناپدید می‌شن**. بعد از \`JSON.parse\`، تاریخ فقط یه رشته‌ست مگر این‌که یه **احیاکننده** برش گردونه. توافق رو این‌که تاریخ‌ها چطور نوشته بشن (ISO 8601، UTC) بخشی از طراحی هر API ـه.
- **JSON سخت‌گیره:** نقل‌قول تکی، توضیح یا یه ویرگول آخر باعث می‌شه \`JSON.parse\` خطا پرتاب کنه. تجزیه‌ی داده‌ای که از بیرون میاد رو همیشه تو \`try\`/\`catch\` بپیچ.

## مثال متوسط: promiseها، پشت سر هم و موازی (جاوااسکریپت)

درخواست‌ها رو با تایمر شبیه‌سازی می‌کنیم: هر \`request\` یه promise برمی‌گردونه که بعد از چند میلی‌ثانیه موفق یا ناموفق می‌شه. اول تفاوت await کردن دو درخواست **یکی بعد از دیگری** و **موازی**؛ بعد چهار راه ترکیب چند promise.

\`\`\`javascript
// promiseها: مقدارهایی که بعداً می‌رسن. درخواست‌های شبیه‌سازی‌شده با تأخیرهای مختلف.
const request = (name, ms, ok = true) =>
  new Promise((resolve, reject) => setTimeout(() => (ok ? resolve(\`\${name} data\`) : reject(new Error(\`\${name} failed\`))), ms));

// async/await: کد ناهم‌زمانی بنویس که مثل کد معمولی خونده می‌شه
async function oneAfterAnother() {
  const t0 = Date.now();
  const user = await request("user", 30);
  const orders = await request("orders", 30);
  return [user, orders, Date.now() - t0 >= 50 ? "took about 60 ms" : "too fast?"];
}
async function inParallel() {
  const t0 = Date.now();
  const [user, orders] = await Promise.all([request("user", 30), request("orders", 30)]);
  return [user, orders, Date.now() - t0 < 50 ? "took about 30 ms" : "too slow?"];
}

console.log("sequential:", (await oneAfterAnother()).join(" | "));
console.log("parallel:  ", (await inParallel()).join(" | "));

// ترکیب چند درخواست
const three = () => [request("fast", 10), request("broken", 20, false), request("slow", 40)];
try {
  await Promise.all(three());
} catch (e) {
  console.log("all:       rejected, because", e.message);
}
const settled = await Promise.allSettled(three());
console.log("allSettled:", settled.map((r) => (r.status === "fulfilled" ? r.value : \`(\${r.reason.message})\`)).join(", "));
console.log("race:      ", await Promise.race(three()));
console.log("any:       ", await Promise.any([request("broken", 5, false), request("slow", 40)]));
\`\`\`

\`\`\`text
sequential: user data | orders data | took about 60 ms
parallel:   user data | orders data | took about 30 ms
all:       rejected, because broken failed
allSettled: fast data, (broken failed), slow data
race:       fast data
any:        slow data
\`\`\`

نتیجه‌ها رو بخونیم:

- **دو \`await\` پشت سر هم دو برابر** \`Promise.all\` رو همون دو درخواست طول می‌کشن. وقتی درخواست‌ها به هم وابسته نیستن، با هم شروعشون کن. وقتی دومی نتیجه‌ی اولی رو لازم داره (کاربر رو بار کن، بعد سفارش‌های **همون کاربر** رو)، پشت سر هم اجتناب‌ناپذیره.
- **\`Promise.all\` سریع شکست می‌خوره:** یه شکست کل کار رو رد می‌کنه، و نتیجه‌های موفق از دست می‌رن. وقتی همه‌شون رو لازم داری خوبه (صفحه بدون هر دو نمی‌تونه نشون داده بشه).
- **\`Promise.allSettled\` هیچ‌وقت رد نمی‌شه؛** نتیجه‌ی هر کدوم رو گزارش می‌ده. برای داشبوردهایی که یه ابزارک خراب نباید کل صفحه رو خالی کنه خوبه.
- **\`race\` اولین تموم‌شده رو می‌گیره، \`any\` اولین موفق رو.** \`race\` پایه‌ی مهلت‌هاست (درخواست رو با یه تایمر مسابقه بده)؛ \`any\` به سرورهای آینه می‌خوره، جایی که هر نسخه‌ی کارکننده کافیه.

## مثال پیشرفته: fetch در برابر یه API واقعی JSON (جاوااسکریپت)

با ماژول \`http\` نود یه API کوچیک JSON راه می‌ندازیم: فهرست یادداشت‌ها، ساختن یه یادداشت (وضعیت ۲۰۱)، یه مسیر ناموجود (۴۰۴)، یه نقطه‌ی «خراب» که به‌جای JSON، HTML برمی‌گردونه، و یه نقطه‌ی کُند. بعد یه تابع کمکی دقیق \`getJSON\` از \`fetch\` استفاده می‌کنه و هر چیزی رو که ممکنه اشتباه پیش بره چک می‌کنه: وضعیت HTTP، نوع محتوا، خرابی شبکه و مهلت.

\`\`\`javascript
// Ajax واقعی: fetch با یه API کوچیک JSON حرف می‌زنه، و هر چیزی رو که ممکنه خراب بشه مدیریت می‌کنه.
import http from "node:http";

const notes = [{ id: 1, text: "Buy milk" }];
const server = http.createServer(async (req, res) => {
  const send = (status, body, type = "application/json") => {
    res.writeHead(status, { "Content-Type": type });
    res.end(typeof body === "string" ? body : JSON.stringify(body));
  };
  if (req.url === "/api/notes" && req.method === "GET") return send(200, notes);
  if (req.url === "/api/notes" && req.method === "POST") {
    let raw = "";
    for await (const chunk of req) raw += chunk;
    const note = { id: notes.length + 1, text: JSON.parse(raw).text };
    notes.push(note);
    return send(201, note);
  }
  if (req.url === "/api/broken") return send(200, "<html>oops</html>", "text/html");
  if (req.url === "/api/slow") return setTimeout(() => send(200, { ok: true }), 300);
  send(404, { error: "not found" });
});
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const base = \`http://127.0.0.1:\${server.address().port}\`;

// یه تابع کمکی دقیق: وضعیت، نوع محتوا و مهلت رو چک می‌کنه
async function getJSON(path, options = {}, timeoutMs = 1000) {
  try {
    const res = await fetch(base + path, { ...options, signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return \`HTTP \${res.status} \${(await res.json()).error}\`;
    if (!res.headers.get("content-type").includes("json")) return \`not JSON but \${res.headers.get("content-type")}\`;
    return await res.json();
  } catch (e) {
    return \`failed: \${e.name}\`;
  }
}

console.log("GET  notes   ->", await getJSON("/api/notes"));
console.log("POST note    ->", await getJSON("/api/notes", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "Call Reza" }),
}));
console.log("GET  notes   ->", (await getJSON("/api/notes")).map((n) => n.text).join(", "));
console.log("GET  missing ->", await getJSON("/api/nothing"));
console.log("GET  broken  ->", await getJSON("/api/broken"));
console.log("GET  slow    ->", await getJSON("/api/slow", {}, 100));
server.close();
server.closeAllConnections();
\`\`\`

\`\`\`text
GET  notes   -> [ { id: 1, text: 'Buy milk' } ]
POST note    -> { id: 2, text: 'Call Reza' }
GET  notes   -> Buy milk, Call Reza
GET  missing -> HTTP 404 not found
GET  broken  -> not JSON but text/html
GET  slow    -> failed: TimeoutError
\`\`\`

نتیجه‌ها رو بخونیم:

- **POST یه یادداشت ساخت** و سرور با \`201 Created\` و یادداشت تازه، از جمله شناسه‌ای که بهش داده، جواب داد. GET بعدی هر دو یادداشت رو نشون می‌ده: داده رو سرور بدون هیچ بار شدن دوباره‌ی صفحه عوض شد. کل ایده‌ی Ajax همینه.
- **۴۰۴ باعث نشد \`fetch\` رد بشه.** تابع کمکی ما مجبور بود خودش \`res.ok\` رو چک کنه. یادت رفتن این بررسی رایج‌ترین باگ \`fetch\` ـه: کد بعدش سعی می‌کنه از یه صفحه‌ی خطا به‌عنوان داده استفاده کنه.
- **نقطه‌ی «خراب» گفت 200 OK ولی HTML فرستاد** (این واقعاً پیش میاد، مثلاً وقتی یه پراکسی یا صفحه‌ی ورود به‌جای API جواب می‌ده). چک کردن \`Content-Type\` یه \`SyntaxError\` گیج‌کننده رو به یه پیغام روشن تبدیل کرد.
- **درخواست کُند بعد از ۱۰۰ میلی‌ثانیه لغو شد** با یه \`TimeoutError\`. بدون مهلت، یه صفحه می‌تونست تا ابد منتظر سروری بمونه که هیچ‌وقت جواب نمی‌ده؛ با مهلت، می‌تونه «دوباره امتحان کن» نشون بده و قابل استفاده بمونه.

## نگاه یه مهندس ارشد

- **هر صدا زدن شبکه‌ای می‌تونه شکست بخوره.** خطا، مهلت و محتوای غیرمنتظره رو تو هر درخواست مدیریت کن، و یه چیز مفید به کاربر نشون بده.
- **\`fetch\` رو یه بار بپیچ.** یه تابع کمکی کوچیک (مثل \`getJSON\`) که وضعیت، نوع محتوا و مهلت رو چک می‌کنه و همه جا استفاده می‌شه، یه دسته‌ی کامل باگ رو حذف می‌کنه.
- **درخواست‌های مستقل رو موازی کن، ولی سرور رو سیل‌زده نکن.** \`Promise.all\` رو ۵۰۰ درخواست یه‌جا، یه حمله‌ی منع خدمت به API خودته.
- **رو قالب داده توافق کن:** اسم فیلدها، قالب تاریخ (ISO 8601، UTC)، این‌که شناسه‌ها و پول چطور نمایش داده می‌شن، و خطاها چه شکلی‌ان.
- **حالت بار شدن و خطا رو نشون بده.** یه صفحه‌ی Ajax که بی‌صدا شکست می‌خوره خراب به نظر میاد؛ یه چرخ‌چرخک و یه پیغام روشن اعتماد کاربرها رو نگه می‌دارن.

## اشتباه‌های رایج

:::mistakes
- **فرض این‌که \`fetch\` با خطاهای HTTP رد می‌شه:** \`response.ok\` رو چک کن.
- **یادت رفتن \`await\` رو \`response.json()\`:** به‌جای داده یه promise می‌گیری.
- **await کردن یکی‌یکی درخواست‌های مستقل:** از \`Promise.all\` استفاده کن.
- **تجزیه‌ی JSON بدون \`try\`/\`catch\`:** یه پاسخ بد کد رو کرش می‌کنه.
- **بدون مهلت:** یه درخواست می‌تونه تا ابد معلق بمونه.
- **انتظار این‌که تاریخ، \`undefined\` یا تابع از JSON جون سالم به در ببرن:** نمی‌برن.
:::

## خلاصه

:::takeaways[چیزهایی که باید یادت بمونه]
- Ajax بخشی از یه صفحه رو با داده‌ای که تو پس‌زمینه گرفته شده، بدون بار شدن دوباره، به‌روز می‌کنه.
- XML یه نشانه‌گذاری سخت‌گیر و گسترش‌پذیر برای داده و سنده که با شِما اعتبارسنجی می‌شه؛ JSON یه قالب فشرده با شیء، آرایه، رشته، عدد، بولی و null ـه.
- \`JSON.stringify\` و \`JSON.parse\` بین مقدار و متن تبدیل می‌کنن؛ تاریخ رشته می‌شه، undefined و تابع گم می‌شن؛ یه احیاکننده می‌تونه نوع‌ها رو برگردونه.
- کد ناهم‌زمان: callback، بعد promise (در انتظار، برآورده، رد)، بعد async/await با try/catch.
- \`Promise.all\`، \`allSettled\`، \`race\` و \`any\` چند promise رو ترکیب می‌کنن؛ درخواست‌های مستقل رو موازی اجرا کن.
- \`fetch\` یه promise برای یه پاسخ برمی‌گردونه؛ \`response.ok\` رو چک کن، بدنه رو با \`await response.json()\` بخون، و از مهلت استفاده کن.
- برنامه‌های تک‌صفحه‌ای Ajax رو تا تهش می‌برن، به قیمت پیچیدگی بیشتر.
:::

## این مبحث کجای نقشه‌ست؟

\`\`\`mermaid
flowchart LR
  D["DOM و رویدادها"] --> A["JSON و Ajax"]
  A --> W["وب‌سرورها"]
  A --> R["وب‌سرویس و REST"]
  A --> X["امنیت وب (CORS)"]
\`\`\`

مبحث بعدی [وب‌سرورها](/internet-engineering/web-servers) ـه: برنامه‌هایی که اون سر همه‌ی این درخواست‌ها هستن.

## تمرین

اول خودت جواب بده، بعد جواب رو باز کن.

::::exercise
**تمرین ۱.** کدوم‌ها JSON معتبرن؟ (الف) \`{"a": 1, "b": [true, null]}\` (ب) \`{a: 1}\` (ج) \`["x", 'y']\` (د) \`{"price": 9.5,}\` (هـ) \`"hello"\` (و) \`{"when": undefined}\`

:::answer
- (الف) **معتبر.**
- (ب) نامعتبر: کلیدها باید تو نقل‌قول دوتایی باشن.
- (ج) نامعتبر: رشته‌ها باید از نقل‌قول دوتایی استفاده کنن.
- (د) نامعتبر: ویرگول آخر.
- (هـ) **معتبر:** یه متن JSON می‌تونه یه رشته‌ی تنها باشه (یا عدد، true، false، null).
- (و) نامعتبر: \`undefined\` مقدار JSON نیست.
:::
::::

::::exercise
**تمرین ۲.** یه صفحه برای نشون دادن داشبورد یه کاربر سه چیز لازم داره: نیم‌رخ کاربر، فهرست درس‌ها، و اعلان‌ها. درخواست درس‌ها شناسه‌ی کاربر رو از نیم‌رخ لازم داره. اعلان‌ها به هیچ‌چی وابسته نیستن. درخواست‌ها رو با \`async\`/\`await\` طوری بنویس که صفحه هر چی سریع‌تر بار بشه.

:::answer
\`\`\`text
async function loadDashboard() {
  const notificationsPromise = getJSON("/api/notifications");   // الان شروع کن، هیچ‌چی لازم نداره
  const profile = await getJSON("/api/profile");                 // برای درخواست بعدی لازمه
  const courses = await getJSON(\`/api/users/\${profile.id}/courses\`);
  const notifications = await notificationsPromise;              // احتمالاً از قبل تموم شده
  return { profile, courses, notifications };
}
\`\`\`

اعلان‌ها **موازی** با نیم‌رخ و درس‌ها بار می‌شن، در حالی که درس‌ها هنوز منتظر نیم‌رخن، که بهش وابسته‌ان. کل زمان حدود max(اعلان‌ها، نیم‌رخ + درس‌ها) ـه، به‌جای جمع هر سه.
:::
::::

::::exercise
**تمرین ۳.** تو مثال پیشرفته، اگه سرور کرش کرده بود و هیچ‌چی رو درگاه گوش نمی‌داد، \`getJSON\` چی برمی‌گردوند؟ و اگه سرور وضعیت ۵۰۰ رو با بدنه‌ی متنی ساده‌ی \`Internal error\` برمی‌گردوند؟

:::answer
- **هیچ‌چی گوش نمی‌ده:** اتصال رد می‌شه، پس خود \`fetch\` با یه \`TypeError\` («fetch failed») رد می‌شه؛ \`catch\` مقدار \`"failed: TypeError"\` رو برمی‌گردونه.
- **۵۰۰ با بدنه‌ی متن ساده:** \`res.ok\` نادرسته، پس تابع کمکی سعی می‌کنه \`(await res.json()).error\` رو بخونه؛ بدنه JSON نیست، پس \`res.json()\` یه \`SyntaxError\` پرتاب می‌کنه، که گرفته می‌شه: \`"failed: SyntaxError"\`. این پیغام گمراه‌کننده‌ست. یه تابع کمکی بهتر وقتی نوع محتوا JSON نیست بدنه‌ی خطا رو به شکل متن می‌خوند و «HTTP 500: Internal error» رو گزارش می‌داد.

درسش: مسیرهای خطا همون دقت مسیرهای موفقیت رو لازم دارن، و باید تست هم بشن.
:::
::::

::::exercise
**تمرین ۴ (فکر کن، حفظ نکن).** یه جعبه‌ی جست‌وجو با هر کلید یه درخواست می‌فرسته. کاربرها گزارش می‌دن که گاهی نتیجه‌هایی که نشون داده می‌شن با چیزی که تو جعبه‌ست جور نیست: «deitel» تایپ کردن ولی نتیجه‌ی «deit» رو می‌بینن. چی داره پیش میاد، و چطور درستش می‌کنی؟

:::answer
**چی داره پیش میاد:** درخواست‌ها ناهم‌زمانن، و پاسخ‌ها ممکنه **خارج از ترتیب** برسن. درخواست «deit» کُند بود، و پاسخش **بعد از** پاسخ «deitel» رسید و نتیجه‌های تازه‌تر رو بازنویسی کرد.

**راه‌حل‌ها (معمولاً ترکیبی):**

1. **درخواست‌های کهنه رو لغو کن:** برای درخواست فعلی یه \`AbortController\` نگه دار؛ وقتی یه کلید تازه یه درخواست تازه شروع می‌کنه، قبلی رو لغو کن.
2. **پاسخ‌های کهنه رو نادیده بگیر:** به هر درخواست یه شماره‌ی ترتیبی بده، و وقتی یه پاسخ می‌رسه، فقط اگه مال آخرین درخواسته (یا جعبه هنوز پرس‌وجوی اون رو داره) نشونش بده.
3. **مکث‌گیری (debounce):** قبل از فرستادن درخواست صبر کن تا کاربر تایپ رو متوقف کنه (مثلاً ۲۵۰ میلی‌ثانیه)، که بار سرور رو هم کم می‌کنه.
4. **نتیجه‌های اخیر رو نهان کن،** تا برگشتن به یه پرس‌وجوی قبلی فوری باشه.

این «شرایط مسابقه» یکی از رایج‌ترین باگ‌های رابط‌های Ajax ـه، و موقع تست رو یه سرور محلی سریع هیچ‌وقت خودش رو نشون نمی‌ده.
:::
::::
`;export{e as default};