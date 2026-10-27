var e=`## جایی که جاوااسکریپت به صفحه می‌رسه

تا حالا جاوااسکریپتمون با عدد، رشته، آرایه و شیء کار کرده. برای این‌که یه صفحه‌ی وب **کاری بکنه** (یه منو باز کنه، کنار یه فیلد فرم خطا نشون بده، یه قلم به یه فهرست اضافه کنه) جاوااسکریپت راهی لازم داره که خود صفحه رو بخونه و عوض کنه، و بفهمه کاربر کی کاری می‌کنه. این‌ها دو موضوع این مبحثن:

- **DOM** (مدل شیء سند): صفحه به شکل یه درخت از شیء‌ها که جاوااسکریپت می‌تونه توش جست‌وجو کنه و عوضش کنه.
- **رویدادها** (events): خبرهایی از این‌که یه اتفاقی افتاده (یه کلیک، فشار یه کلید، ثبت یه فرم)، و این‌که جاوااسکریپت چطور بهشون واکنش نشون می‌ده.

دایتل این‌ها رو تو دو فصل «DOM: شیء‌ها و مجموعه‌ها» و «مدیریت رویداد در جاوااسکریپت: نگاهی عمیق‌تر» پوشش می‌ده.

## DOM: صفحه به شکل یه درخت

وقتی مرورگر HTML رو می‌خونه، یه درخت از **گره**‌ها می‌سازه (یه نسخه‌ی کوچیکش رو تو [مبانی HTML5](/internet-engineering/html5-basics) ساختیم). هر عنصر یه **گره‌ی عنصر** می‌شه؛ متن داخلش **گره‌ی متن** می‌شه. کل درخت از راه شیء سراسری \`document\` در اختیار جاوااسکریپته.

:::show
\`\`\`anim
tree
root document
child html document
child head html
child body html
child h1 body
child ul body
child li1 ul
child li2 ul
note | document نقطه‌ی وروده. document.documentElement همون html ـه؛ document.body همون body.
mark h1 | document.querySelector("h1") اولین h1 رو پیدا می‌کنه، با جست‌وجو از بالای درخت.
mark li1 li2 | document.querySelectorAll("li") همه‌ی liها رو برمی‌گردونه: یه مجموعه که می‌شه روش حلقه زد.
mark ul | li1.parentElement همون ul ـه: هر گره والدش رو می‌شناسه...
mark li1 li2 | ...و ul.children همون li1 و li2 ـن. می‌تونی به هر جهتی تو درخت راه بری.
done document html head body h1 ul li1 li2 | یه گره رو عوض کن و مرورگر فوری همون بخش صفحه رو دوباره می‌کشه.
\`\`\`
:::

هر گره یه شیئه با ویژگی‌ها و متدها. اون‌هایی که بیشتر از همه استفاده می‌کنی:

**پیدا کردن عنصرها**

- \`document.querySelector(css)\`: اولین عنصری که با یه انتخابگر CSS جوره، یا \`null\`.
- \`document.querySelectorAll(css)\`: همه‌ی عنصرهای جور (یه \`NodeList\` که می‌شه با \`for...of\` روش حلقه زد).
- متدهای قدیمی‌تر: \`getElementById("id")\`، \`getElementsByClassName("c")\`، \`getElementsByTagName("p")\`.

**راه رفتن تو درخت**

- \`el.parentElement\`، \`el.children\`، \`el.firstElementChild\`، \`el.nextElementSibling\`، و \`el.closest(css)\` (نزدیک‌ترین جدی که با یه انتخابگر جوره، خیلی مفید با رویدادها).

**خوندن و عوض کردن محتوا**

- \`el.textContent\`: متن داخل، به شکل متن ساده. مقداردهیش محتوا رو با متن جایگزین می‌کنه، **هیچ‌وقت** HTML.
- \`el.innerHTML\`: محتوا به شکل یه رشته‌ی HTML. مقداردهیش رشته رو به‌عنوان HTML تجزیه می‌کنه. راحته، و با هر متنی که از کاربرها اومده **خطرناک** (مثال پیشرفته نشون می‌ده چرا).
- \`el.value\` برای کنترل‌های فرم.

**ویژگی‌ها، کلاس‌ها و سبک‌ها**

- \`el.getAttribute("href")\`، \`el.setAttribute("aria-expanded", "true")\`.
- \`el.classList.add("open")\`، \`.remove(...)\`، \`.toggle(...)\`، \`.contains(...)\`. عوض کردن کلاس‌ها، و سپردن ظاهرشون به CSS، معمولاً از تعیین مستقیم سبک بهتره.
- \`el.style.color = "red"\` یه سبک درون‌خطی تعیین می‌کنه؛ \`el.dataset.id\` یه ویژگی \`data-id\` رو می‌خونه.

**ساختن و حذف عنصرها**

- \`document.createElement("li")\`، بعد \`parent.append(child)\` (یا \`prepend\`، \`before\`، \`after\`).
- \`el.remove()\` یه عنصر رو حذف می‌کنه.

این یه کد واقعی مرورگره که از همین متدها استفاده می‌کنه. تو مثال‌های Node این درس اجرا نمی‌شه (صفحه‌ای نیست)، ولی همون‌طور که هست تو هر مرورگری اجرا می‌شه:

\`\`\`html
<ul id="list">
  <li>Bread</li>
</ul>
<button id="add">Add milk</button>
<script>
  const list = document.querySelector("#list");
  document.querySelector("#add").addEventListener("click", () => {
    const item = document.createElement("li");
    item.textContent = "Milk";
    item.classList.add("new");
    list.append(item);
  });
<\/script>
\`\`\`

## رویدادها

یه **رویداد** علامتیه که یه اتفاقی افتاده. چند تا از رایج‌ترین‌ها:

| نوع | رویدادها |
|---|---|
| موس و اشاره‌گر | \`click\`، \`dblclick\`، \`pointerdown\`، \`pointermove\`، \`mouseover\`، \`mouseout\` |
| کیبورد | \`keydown\`، \`keyup\` |
| فرم | \`input\` (هر تغییر)، \`change\` (وقتی نهایی شد)، \`submit\`، \`focus\`، \`blur\` |
| صفحه | \`DOMContentLoaded\` (HTML تجزیه شد)، \`load\` (همه‌چی بار شد)، \`scroll\`، \`resize\` |
| لمس و بقیه | \`touchstart\`، \`wheel\`، \`copy\`، \`paste\` |

با ثبت یه **شنونده** (listener، که بهش مدیریت‌کننده یا handler هم می‌گن) به یه رویداد جواب می‌دی:

\`\`\`javascript
// el.addEventListener("click", (event) => { ... });
\`\`\`

شنونده یه **شیء رویداد** با جزئیات می‌گیره: \`event.target\` (عنصری که رویداد توش اتفاق افتاده)، \`event.currentTarget\` (عنصری که شنونده‌ش داره اجرا می‌شه)، \`event.key\` برای رویدادهای کیبورد، جای موس برای رویدادهای اشاره‌گر، و متدهایی مثل \`event.preventDefault()\` (لغو کار پیش‌فرض مرورگر، مثل دنبال کردن یه پیوند یا ثبت یه فرم) و \`event.stopPropagation()\`.

کدهای قدیمی‌تر از ویژگی‌هایی مثل \`<button onclick="...">\` یا ویژگی‌هایی مثل \`el.onclick = ...\` استفاده می‌کردن. \`addEventListener\` ترجیح داده می‌شه: جاوااسکریپت رو بیرون از HTML نگه می‌داره، و چند شنونده برای یه رویداد رو اجازه می‌ده.

## انتشار رویداد: گرفتن و حباب

وقتی رو یه دکمه داخل یه فرم داخل body کلیک می‌کنی، رو همه‌شون کلیک کردی. پس کدوم شنونده‌ها اجرا می‌شن، و به چه ترتیبی؟ یه رویداد تو سه **مرحله** از درخت رد می‌شه:

1. **مرحله‌ی گرفتن** (capture): از \`document\` رو به پایین به سمت هدف، و شنونده‌هایی که با \`{ capture: true }\` ثبت شدن اجرا می‌شن.
2. **مرحله‌ی هدف** (target): رو خود عنصر.
3. **مرحله‌ی حباب** (bubble): برگشت از هدف رو به بالا تا \`document\`، و شنونده‌های معمولی اجرا می‌شن.

بیشتر شنونده‌ها شنونده‌ی حبابی‌ان، پس تو عمل: **اول شنونده‌ی هدف اجرا می‌شه، بعد والدش، بعد پدربزرگش، و همین‌طور.** هر شنونده‌ای می‌تونه \`event.stopPropagation()\` رو صدا بزنه تا رویداد جلوتر نره. (چند تا رویداد، مثل \`focus\`، حباب نمی‌زنن.)

:::show
\`\`\`anim
messages html body form button
note | رو دکمه کلیک می‌کنی. رویداد تا خودش پایین می‌ره، بعد حباب‌وار برمی‌گرده بالا.
send html body مرحله‌ی گرفتن | ۱. گرفتن: رویداد از بالا رو به پایین می‌ره. فقط شنونده‌های گیرنده اجرا می‌شن (اینجا یکی رو html).
send body form مرحله‌ی گرفتن | هنوز داره پایین می‌ره...
send form button به هدف می‌رسه | ۲. هدف: شنونده‌ی خود دکمه اجرا می‌شه.
send button form حباب | ۳. حباب: برگشت به بالا. شنونده‌ی فرم اجرا می‌شه...
send form body حباب | ...بعد شنونده‌ی body.
send body html حباب | ...و آخر سر html (اگه یه شنونده‌ی حبابی داشت).
note | اگه شنونده‌ی فرم event.stopPropagation() رو صدا بزنه، body و html اصلاً خبردار نمی‌شن.
\`\`\`
:::

**واگذاری رویداد** (event delegation) زیرکانه از حباب استفاده می‌کنه: به‌جای گذاشتن یه شنونده رو هر قلم فهرست، **یه** شنونده رو فهرست بذار. هر کلیک رو یه قلم تا اون حباب می‌زنه، و \`event.target\` می‌گه کدوم قلم کلیک شده. حافظه‌ی کمتری می‌گیره، و برای قلم‌هایی که بعداً اضافه می‌شن خودکار کار می‌کنه. مثال پیشرفته یه فهرست کارها رو این‌جوری می‌سازه.

:::show
**یه مثال روزمره: پذیرش یه ساختمون اداری.**

- یه ساختمون با ۲۰۰ دفتر رو تصور کن. مهمون‌ها می‌تونستن برای هر دفتر یه زنگ جدا بزنن، پس ۲۰۰ زنگ لازم بود، و هر دفتر تازه یه زنگ تازه لازم داشت.
- به‌جاش ساختمون **یه پذیرش** داره. هر مهمون میاد سر میز و می‌گه کدوم دفتر رو می‌خواد؛ مسئول پذیرش راهنماییش می‌کنه.
- این واگذاری رویداده: یه شنونده رو والد (پذیرش) رویدادهای همه‌ی فرزندها (دفترها) رو مدیریت می‌کنه، و با خوندن \`event.target\` (اسم دفتر) تصمیم می‌گیره چی کار کنه.
- وقتی یه دفتر تازه تو طبقه‌ی سوم باز می‌شه، هیچ‌چی نصب نمی‌شه: پذیرش از قبل مدیریتش می‌کنه.
- و اگه یه نگهبان سر ورودی یه طبقه کسی رو نگه داره (\`stopPropagation\`)، پذیرش اصلاً از اون مهمون خبردار نمی‌شه.
:::

## عوض کردن صفحه، کارا و امن

- **تغییرها رو دسته‌ای انجام بده.** هر تغییر تو DOM ممکنه باعث بشه مرورگر چیدمان رو دوباره حساب کنه. ساختن کلی عنصر و گذاشتن یه‌جاشون (مثلاً با یه \`DocumentFragment\`) از گذاشتن یکی‌یکی سریع‌تره.
- **کلاس رو عوض کن، بذار CSS سبک بده.** \`el.classList.toggle("open")\` با یه قاعده‌ی CSS برای \`.open\` تصمیم‌های سبکی رو تو CSS نگه می‌داره.
- **برای متن از \`textContent\` استفاده کن.** \`innerHTML\` رو فقط با HTMLی که خودت نوشتی به کار ببر، هیچ‌وقت با ورودی کاربر.
- **منتظر DOM بمون.** یه اسکریپت باید بعد از وجود عنصرهایی که ازشون استفاده می‌کنه اجرا بشه: از \`defer\` استفاده کن، یا به \`DOMContentLoaded\` گوش بده.
- **دسترس‌پذیری رو در نظر داشته باش.** برای چیزهای قابل کلیک از عنصر واقعی \`<button>\` استفاده کن (با کیبورد کار می‌کنن)، وقتی محتوایی رو نشون می‌دی یا پنهان می‌کنی ویژگی‌های \`aria-\` رو به‌روز کن، و وقتی یه پنجره‌ی گفت‌وگو باز می‌کنی فوکوس رو منطقی جابه‌جا کن.

## کی به کارت میاد، کی نه؟

| موقعیت | چی جوره | چرا |
|---|---|---|
| پیدا کردن عنصرها | \`querySelector\` / \`querySelectorAll\` | همون انتخابگرهای CSS |
| نشون دادن متنی که کاربر داده | \`textContent\` | بدون تجزیه‌ی HTML، بدون XSS |
| نشون دادن یا پنهان کردن یه چیز | \`classList.toggle\` + CSS | سبک تو CSS می‌مونه |
| کلیک رو کلی قلم شبیه | واگذاری رویداد رو والد | یه شنونده، برای قلم‌های تازه هم کار می‌کنه |
| فرمی که با جاوااسکریپت چک می‌شه | شنونده‌ی \`submit\` + \`preventDefault()\` وقتی نامعتبره | کاربر با یه خطا رو صفحه می‌مونه |
| یه برنامه‌ی پیچیده‌ی کامل | یه چارچوب رابط کاربری رو DOM | خودش به‌روزرسانی‌های زیاد رو مدیریت می‌کنه |

## مثال ساده: یه DOM کوچیک (جاوااسکریپت)

Node صفحه و \`document\` نداره، پس خودمون یه DOM کوچیک می‌سازیم: یه کلاس \`Element\` با فرزندها، یه پیوند به والد، \`textContent\`، و \`querySelector\`/\`querySelectorAll\` برای انتخابگرهای ساده (یه تگ، \`.class\` یا \`#id\`). بعد درخت رو جست‌وجو می‌کنیم، عوضش می‌کنیم و چاپش می‌کنیم، درست مثل کد مرورگر.

\`\`\`javascript
// یه DOM کوچیک: عنصرها یه درخت می‌سازن؛ می‌تونیم جست‌وجو، عوض و چاپش کنیم
class Element {
  constructor(tag, attrs = {}, ...children) {
    Object.assign(this, { tag, attrs, children: [], parent: null });
    children.forEach((c) => this.append(c));
  }
  append(child) {
    if (typeof child === "string") child = { text: child };
    child.parent = this;
    this.children.push(child);
    return child;
  }
  get textContent() {
    return this.children.map((c) => (c.text ?? c.textContent)).join("");
  }
  set textContent(value) {
    this.children = [{ text: value, parent: this }];
  }
  matches(sel) {                     // "tag"، ".class" و "#id" رو پشتیبانی می‌کنه
    if (sel[0] === "#") return this.attrs.id === sel.slice(1);
    if (sel[0] === ".") return (this.attrs.class ?? "").split(" ").includes(sel.slice(1));
    return this.tag === sel;
  }
  querySelectorAll(sel) {            // جست‌وجوی عمق‌اول زیردرخت
    const found = [];
    for (const c of this.children) {
      if (c.tag) {
        if (c.matches(sel)) found.push(c);
        found.push(...c.querySelectorAll(sel));
      }
    }
    return found;
  }
  querySelector(sel) { return this.querySelectorAll(sel)[0] ?? null; }
  print(depth = 0) {
    for (const c of this.children) {
      if (c.text !== undefined) console.log(\`\${"  ".repeat(depth)}"\${c.text}"\`);
      else {
        const attrs = Object.entries(c.attrs).map(([k, v]) => \` \${k}="\${v}"\`).join("");
        console.log(\`\${"  ".repeat(depth)}<\${c.tag}\${attrs}>\`);
        c.print(depth + 1);
      }
    }
  }
}

const body = new Element("body", {},
  new Element("h1", { id: "title" }, "Shopping list"),
  new Element("ul", { class: "list" },
    new Element("li", { class: "item" }, "Bread"),
    new Element("li", { class: "item done" }, "Milk")));

console.log("items:", body.querySelectorAll(".item").map((li) => li.textContent).join(", "));
console.log("done:", body.querySelectorAll(".done").map((li) => li.textContent).join(", "));

// صفحه رو عوض کن: متن تازه تو سرتیتر، یه قلم تازه تو فهرست
body.querySelector("#title").textContent = "Shopping list (3 items)";
body.querySelector("ul").append(new Element("li", { class: "item" }, "Eggs"));
console.log("parent of the first li:", body.querySelector("li").parent.tag);
body.print();
\`\`\`

\`\`\`text
items: Bread, Milk
done: Milk
parent of the first li: ul
<h1 id="title">
  "Shopping list (3 items)"
<ul class="list">
  <li class="item">
    "Bread"
  <li class="item done">
    "Milk"
  <li class="item">
    "Eggs"
\`\`\`

نتیجه‌ها رو بخونیم:

- **یه عنصر می‌تونه چند تا کلاس داشته باشه** (\`class="item done"\`)؛ \`.item\` با هر دو قلم فهرست جوره، \`.done\` فقط با دومی. برای همینه که مرورگر \`classList\` می‌ده به‌جای این‌که مجبورت کنه رشته‌ی کلاس رو ویرایش کنی.
- **مقداردهی \`textContent\` کل محتوای سرتیتر رو** با یه گره‌ی متن تنها جایگزین کرد.
- **\`querySelector\` عمق‌اول و به ترتیب سند جست‌وجو می‌کنه،** پس اولین عنصر جور رو همون‌طور که تو HTML ظاهر می‌شه برمی‌گردونه.
- DOM واقعی ده‌ها نوع گره و متد بیشتر داره، ولی هسته‌ش دقیقاً همینه: یه درخت از شیء‌ها با والد و فرزند، که با انتخابگر جست‌وجو و سر جاش عوض می‌شه.

## مثال متوسط: گرفتن، هدف و حباب (جاوااسکریپت)

ارسال رویداد مرورگر رو رو یه درخت کوچیک شبیه‌سازی می‌کنیم: \`html > body > form > button\`. یه شنونده‌ی گیرنده رو \`html\` نشسته؛ شنونده‌های معمولی (حبابی) رو body، فرم و دکمه. رو دکمه کلیک می‌کنیم، بعد دوباره کلیک می‌کنیم بعد از این‌که شنونده‌ی فرم \`stopPropagation()\` رو صدا بزنه.

\`\`\`javascript
// یه رویداد چطور تو DOM سفر می‌کنه: گرفتن (پایین)، هدف، حباب (بالا)
function makeNode(name, parent = null) {
  return { name, parent, listeners: [] };
}
const html = makeNode("html"), body = makeNode("body", html);
const form = makeNode("form", body), button = makeNode("button", form);

function addEventListener(node, handler, { capture = false } = {}) {
  node.listeners.push({ handler, capture });
}

function dispatch(target, type) {
  const path = [];
  for (let n = target; n; n = n.parent) path.unshift(n);              // html ... هدف
  const event = { type, target, stopped: false, stopPropagation() { this.stopped = true; } };
  const phases = [
    ...path.slice(0, -1).map((n) => [n, "capture"]),                   // ۱. پایین، شنونده‌های گیرنده
    [target, "target"],                                                // ۲. رو هدف، همه‌ی شنونده‌ها
    ...path.slice(0, -1).reverse().map((n) => [n, "bubble"]),          // ۳. برگشت به بالا، شنونده‌های حبابی
  ];
  for (const [node, phase] of phases) {
    for (const l of node.listeners) {
      if (phase === "capture" && !l.capture) continue;
      if (phase === "bubble" && l.capture) continue;
      event.currentTarget = node;
      l.handler(event, phase);
    }
    if (event.stopped) break;
  }
}

const log = (who) => (e, phase) => console.log(\`  \${phase.padEnd(7)} \${who.padEnd(6)} (target: \${e.target.name})\`);
addEventListener(html, log("html"), { capture: true });
addEventListener(body, log("body"));
addEventListener(form, log("form"));
addEventListener(button, log("button"));

console.log("click on the button:");
dispatch(button, "click");

console.log("click again, but the form stops propagation:");
form.listeners = [{ handler: (e, phase) => { log("form")(e, phase); e.stopPropagation(); }, capture: false }];
dispatch(button, "click");
\`\`\`

\`\`\`text
click on the button:
  capture html   (target: button)
  target  button (target: button)
  bubble  form   (target: button)
  bubble  body   (target: button)
click again, but the form stops propagation:
  capture html   (target: button)
  target  button (target: button)
  bubble  form   (target: button)
\`\`\`

نتیجه‌ها رو بخونیم:

- **شنونده‌ی گیرنده رو \`html\` اول اجرا می‌شه،** با این‌که \`html\` از همه از دکمه دورتره. گرفتن برای چیزهایی مفیده که باید قبل از همه هر رویدادی رو ببینن (مثلاً بستن یه منوی باز وقتی کاربر هر جایی کلیک می‌کنه).
- **\`event.target\` تو همه‌ی شنونده‌ها همیشه دکمه‌ست:** جاییه که کلیک اتفاق افتاده. \`event.currentTarget\` عنصریه که شنونده‌ش الان داره اجرا می‌شه. واگذاری دقیقاً به همین تفاوت تکیه می‌کنه.
- **حباب از داخل به بیرون می‌ره:** دکمه، فرم، body. این ترتیب طبیعی بیشتر منطق رابط کاربریه: خاص‌ترین عنصر اول واکنش نشون می‌ده.
- **\`stopPropagation()\` تو شنونده‌ی فرم** نذاشت کلیک به body برسه. کم ازش استفاده کن: کدهای دیگه (تحلیل‌گری، منوهایی که با کلیک بیرون بسته می‌شن) ممکنه به حباب زدن رویدادها وابسته باشن.

## مثال پیشرفته: واگذاری، و innerHTML در برابر textContent (جاوااسکریپت)

یه فهرست کارها با یه شنونده‌ی **واگذارشده**‌ی تنها رو فهرست: هر قلم ویژگی‌های \`data-action\` و \`data-id\` داره، و شنونده اون‌ها رو از \`event.target\` می‌خونه تا قلم درست رو تیک بزنه یا حذف کنه. قلم‌هایی که بعد از وصل شدن شنونده اضافه می‌شن خودکار کار می‌کنن. بعد نگاه می‌کنیم وقتی متن یه کاربر به‌جای \`textContent\` با \`innerHTML\` تو صفحه گذاشته می‌شه چی می‌شه.

\`\`\`javascript
// واگذاری رویداد: یه شنونده رو فهرست، کلیک رو هر قلمی رو مدیریت می‌کنه، حتی قلم‌هایی که بعداً اضافه می‌شن.
// و تفاوت innerHTML (HTML رو تجزیه می‌کنه) و textContent (متن ساده).
const list = { items: [], handled: 0 };

function addItem(text) {
  const id = list.items.length + 1;
  list.items.push({ id, text, done: false });
}

// تنها مدیریت‌کننده‌ی واگذارشده: نگاه می‌کنه **چی** کلیک شده (event.target)، از راه ویژگی‌های data
function onListClick(event) {
  list.handled++;
  const { action, id } = event.target.dataset;
  const item = list.items.find((i) => i.id === Number(id));
  if (!item) return;                                       // یه کلیک رو فضای خالی فهرست
  if (action === "toggle") item.done = !item.done;
  if (action === "delete") list.items = list.items.filter((i) => i !== item);
}
const click = (action, id) => onListClick({ target: { dataset: { action, id: String(id) } } });

for (const t of ["Bread", "Milk", "Eggs"]) addItem(t);
click("toggle", 2);
addItem("Coffee");                                         // بعداً اضافه شده: شنونده‌ی تازه لازم نیست
click("toggle", 4);
click("delete", 1);
onListClick({ target: { dataset: {} } });
console.log("items:", list.items.map((i) => \`\${i.text}\${i.done ? " (done)" : ""}\`).join(", "));
console.log(\`listeners attached: 1, clicks handled: \${list.handled}\`);

// نمایش متن یه کاربر: innerHTML اونو HTML تجزیه می‌کنه، textContent متن نشونش می‌ده
const escape = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const userText = \`Milk <img src=x onerror="alert('stolen cookies')">\`;
console.log("\\nwith innerHTML, the browser receives:  <li>" + userText + "</li>");
console.log("  -> an <img> element is created, its onerror handler runs the attacker's code");
console.log("with textContent, it effectively gets: <li>" + escape(userText) + "</li>");
console.log("  -> the user sees the text exactly as typed, nothing runs");
\`\`\`

\`\`\`text
items: Milk (done), Eggs, Coffee (done)
listeners attached: 1, clicks handled: 4

with innerHTML, the browser receives:  <li>Milk <img src=x onerror="alert('stolen cookies')"></li>
  -> an <img> element is created, its onerror handler runs the attacker's code
with textContent, it effectively gets: <li>Milk &lt;img src=x onerror=&quot;alert(&#39;stolen cookies&#39;)&quot;&gt;</li>
  -> the user sees the text exactly as typed, nothing runs
\`\`\`

نتیجه‌ها رو بخونیم:

- **یه شنونده چهار کلیک رو مدیریت کرد،** از جمله یه کلیک رو «Coffee» که وقتی شنونده وصل شد وجود نداشت. با یه شنونده برای هر قلم، هر قلم تازه یکی لازم داشت، و قلم‌های حذف‌شده شنونده‌هایی برای تمیزکاری جا می‌ذاشتن.
- **کلیک رو فضای خالی با خیال راحت نادیده گرفته شد:** مدیریت‌کننده‌ی واگذارشده قبل از هر کاری چک می‌کنه یه قلم پیدا کرده باشه. تو یه صفحه‌ی واقعی، \`event.target.closest("li")\` راه معمول پیدا کردن قلمه، حتی وقتی کلیک رو یه آیکون داخلش میفته.
- **\`innerHTML\` متن کاربر رو به یه عنصر واقعی \`<img>\` تبدیل کرد.** عکس بار نمی‌شه، پس مدیریت‌کننده‌ی \`onerror\`ش جاوااسکریپتی رو اجرا می‌کنه که کاربر نویسنده‌ی متن انتخاب کرده، تو صفحه‌ی هر کسی که می‌بیندش. این **اسکریپت‌نویسی بین‌سایتی (XSS)** ـه، یکی از رایج‌ترین آسیب‌پذیری‌های وب ([امنیت وب](/internet-engineering/web-security) رو ببین).
- **\`textContent\` هیچ‌وقت HTML رو تجزیه نمی‌کنه:** مرورگر با کل رشته مثل متن رفتار می‌کنه، که همون اثر فرار دادن \`<\`، \`>\`، \`&\` و نقل‌قول‌ها رو داره. قاعده: داده‌ی کاربر با \`textContent\` (یا یه چارچوب که برات فرار می‌ده) وارد می‌شه، هیچ‌وقت با \`innerHTML\`.

## نگاه یه مهندس ارشد

- **وضعیت رو از DOM جدا کن.** داده (قلم‌های کار) رو تو جاوااسکریپت نگه دار، و DOM رو ازش بساز، مثل مثال پیشرفته. خوندن وضعیت از DOM به باگ می‌رسه. این ایده‌ایه که چارچوب‌های رابط کاربری روش ساخته شدن.
- **برای فهرست‌ها و جدول‌ها واگذاری رو ترجیح بده.** از صدها شنونده ساده‌تر و سریع‌تره.
- **هیچ‌وقت داده‌ی کاربر رو تو \`innerHTML\` نذار.** با بازبینی کد و لینتر به یه قاعده‌ی اجباری تبدیلش کن.
- **از دکمه‌ها و پیوندهای واقعی استفاده کن.** یه \`<div>\` با یه شنونده‌ی کلیک با کیبورد قابل دسترسی نیست و به‌عنوان دکمه اعلام نمی‌شه.
- **قبل از بهینه کردن کد DOM اندازه بگیر.** پنل Performance مرورگر هزینه‌ی چیدمان و نقاشی دوباره رو نشون می‌ده؛ بیشتر صفحه‌ها با کد ساده مشکلی ندارن.

## اشتباه‌های رایج

:::mistakes
- **اجرای یه اسکریپت قبل از وجود عنصرها:** \`querySelector\` برابر \`null\` برمی‌گردونه؛ از \`defer\` یا \`DOMContentLoaded\` استفاده کن.
- **استفاده از \`innerHTML\` با ورودی کاربر:** یه آسیب‌پذیری XSS.
- **اضافه کردن یه شنونده به هر قلم یه فهرست طولانی یا در حال تغییر:** از واگذاری استفاده کن.
- **یکی گرفتن \`event.target\` و \`event.currentTarget\`:** عنصر کلیک‌شده در برابر عنصری که شنونده‌ش داره اجرا می‌شه.
- **یادت رفتن \`preventDefault()\` رو یه ثبت فرم که با جاوااسکریپت مدیریت می‌شه:** صفحه دوباره بار می‌شه و کارت از بین می‌ره.
- **\`<div>\`های قابل کلیک به‌جای \`<button>\`:** کاربرهای کیبورد و صفحه‌خوان نمی‌تونن ازشون استفاده کنن.
:::

## خلاصه

:::takeaways[چیزهایی که باید یادت بمونه]
- DOM صفحه به شکل یه درخت از گره‌هاست، که از راه \`document\` بهش می‌رسی.
- عنصرها رو با \`querySelector\`/\`querySelectorAll\` پیدا کن؛ با والد، فرزند و هم‌نیا راه برو؛ \`closest\` یه جد رو پیدا می‌کنه.
- محتوا رو با \`textContent\` (متن) یا \`innerHTML\` (HTML، هیچ‌وقت با داده‌ی کاربر) عوض کن؛ کلاس‌ها رو با \`classList\`؛ با \`createElement\` و \`append\` بساز.
- رویدادها علامتن؛ \`addEventListener\` شنونده‌هایی ثبت می‌کنه که یه شیء رویداد می‌گیرن (\`target\`، \`currentTarget\`، \`preventDefault\`، \`stopPropagation\`).
- رویدادها تو سه مرحله سفر می‌کنن: گرفتن (پایین)، هدف، حباب (بالا)؛ بیشتر شنونده‌ها موقع حباب اجرا می‌شن.
- واگذاری رویداد: یه شنونده رو یه والد رویدادهای همه‌ی فرزندهاش، از جمله تازه‌ها، رو مدیریت می‌کنه.
- داده رو تو جاوااسکریپت نگه دار و DOM رو ازش بساز؛ از دکمه‌ی واقعی استفاده کن؛ برای متن کاربر \`textContent\`.
:::

## این مبحث کجای نقشه‌ست؟

\`\`\`mermaid
flowchart LR
  F["تابع، آرایه، شیء"] --> D["DOM و رویدادها"]
  H["فرم‌های HTML"] --> D
  D --> A["JSON و Ajax"]
  D --> X["امنیت وب (XSS)"]
\`\`\`

مبحث بعدی [XML، JSON و Ajax](/internet-engineering/json-and-ajax) ـه: گرفتن داده از سرور تو پس‌زمینه و گذاشتنش تو صفحه بدون بارگذاری دوباره.

## تمرین

اول خودت جواب بده، بعد جواب رو باز کن.

::::exercise
**تمرین ۱.** جاوااسکریپت مرورگری رو بنویس که وقتی دکمه‌ی \`#theme\` کلیک می‌شه، یه کلاس \`dark\` رو رو \`<body>\` روشن و خاموش کنه و متن دکمه رو بین «Dark mode» و «Light mode» عوض کنه.

:::answer
\`\`\`text
const button = document.querySelector("#theme");
button.addEventListener("click", () => {
  const dark = document.body.classList.toggle("dark");   // toggle وضعیت تازه رو برمی‌گردونه
  button.textContent = dark ? "Light mode" : "Dark mode";
  button.setAttribute("aria-pressed", String(dark));
});
\`\`\`

رنگ‌های واقعی جاشون تو CSS ـه (\`body.dark { ... }\`). ویژگی \`aria-pressed\` وضعیت دکمه رو به صفحه‌خوان‌ها می‌گه.
:::
::::

::::exercise
**تمرین ۲.** یه \`<ul id="menu">\` پیوندهای \`<li><a href="...">\` داره. می‌خوای با یه شنونده ثبت کنی کدوم پیوند کلیک شده. بنویسش، و توضیح بده چرا \`event.target\` ممکنه چیزی غیر از \`<a>\` باشه.

:::answer
\`\`\`text
document.querySelector("#menu").addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;                        // کلیک رو یه پیوند نبود
  console.log("clicked:", link.href);
});
\`\`\`

\`event.target\` **درونی‌ترین** عنصریه که کلیک شده. اگه یه پیوند یه آیکون داشته باشه، مثل \`<a><svg>...</svg> Home</a>\`، کلیک رو آیکون \`event.target\` رو \`<svg>\` (یا یه چیزی داخلش) می‌کنه، نه \`<a>\`. \`closest("a")\` از هدف رو به بالا تا نزدیک‌ترین پیوند می‌ره، پس کد هر جای پیوند که کلیک بیفته کار می‌کنه.
:::
::::

::::exercise
**تمرین ۳.** تو مثال متوسط، یه شنونده‌ی گیرنده رو \`form\` اضافه می‌شه که \`stopPropagation()\` رو صدا می‌زنه. وقتی رو دکمه کلیک می‌شه کدوم شنونده‌ها اجرا می‌شن؟

:::answer
مرحله‌ی گرفتن از html به body به form می‌ره: شنونده‌ی گیرنده‌ی \`html\` اجرا می‌شه، بعد شنونده‌ی گیرنده‌ی \`form\` اجرا می‌شه و انتشار رو متوقف می‌کنه. رویداد هیچ‌وقت به هدف نمی‌رسه، پس شنونده‌ی دکمه **اجرا نمی‌شه**، و شنونده‌های حبابی هم نه.

ترتیب خروجی: \`capture html\`، \`capture form\`، بعد هیچ‌چی. شنونده‌های گیرنده می‌تونن رویدادها رو قبل از این‌که هدف ببیندشون رهگیری کنن، که قدرتمنده و راحت ازش سوءاستفاده می‌شه.
:::
::::

::::exercise
**تمرین ۴ (فکر کن، حفظ نکن).** یه بخش نظرها نظرها رو با \`commentDiv.innerHTML = "<p>" + comment.text + "</p>"\` نشون می‌ده. یه برنامه‌نویس می‌گه: «ما نظرها رو رو سرور اعتبارسنجی می‌کنیم، پس این امنه.» امنه؟ چی رو عوض می‌کنی، و چرا؟

:::answer
تکیه به اون امن نیست. اعتبارسنجی سمت سرور ممکنه یه حالت رو جا بندازه (کلی راه برای نوشتن HTMLی که اسکریپت اجرا می‌کنه هست)، داده ممکنه از یه مسیر دیگه وارد پایگاه داده بشه (یه ورود داده‌ی قدیمی، یه برنامه‌ی دیگه، یه ابزار مدیریت)، و قانون‌ها با گذشت زمان عوض می‌شن. استفاده از \`innerHTML\` هر شکافی رو به یه آسیب‌پذیری XSS تبدیل می‌کنه که تو مرورگر هر بازدیدکننده‌ای اجرا می‌شه.

تغییرها:

1. **کدگذاری خروجی جایی که داده استفاده می‌شه:** \`const p = document.createElement("p"); p.textContent = comment.text; commentDiv.append(p);\`. متن، متن می‌مونه، هر چی داشته باشه.
2. **اگه قالب‌بندی لازمه** (پررنگ، پیوند)، یه زیرمجموعه‌ی کوچیک و امن رو اجازه بده و با یه کتابخونه‌ی خوب‌تست‌شده (مثل DOMPurify) پاک‌سازیش کن، به‌جای اختراع فیلتر.
3. **دفاع در عمق:** یه سرآیند **سیاست امنیت محتوا** (Content Security Policy) اضافه کن که اسکریپت‌های درون‌خطی رو ممنوع کنه، تا حتی یه تزریق موفق خیلی سخت‌تر سوءاستفاده بشه.

اصلش: علاوه بر اعتبارسنجی ورودی، تو **خروجی**، تو زمینه‌ای که داده استفاده می‌شه (HTML، ویژگی، URL، جاوااسکریپت) فرار بده.
:::
::::
`;export{e as default};