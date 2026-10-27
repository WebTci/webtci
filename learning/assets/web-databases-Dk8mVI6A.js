var e=`## یه سایت چیزهایی که می‌دونه رو کجا نگه می‌داره؟

فرم تماس مبحث قبل پیام‌ها رو تو یه آرایه‌ی جاوااسکریپت ذخیره می‌کرد. این تا وقتی جواب می‌ده که سرور ری‌استارت نشده، بعدش همه‌ی پیام‌ها رفتن. سایت‌های واقعی داده‌هاشون (کاربرها، کالاها، سفارش‌ها، پست‌ها، نظرها) رو تو یه **پایگاه داده** نگه می‌دارن: برنامه‌ای که ساخته شده تا داده رو با امنیت رو دیسک نگه داره، سریع پیداش کنه، و اجازه بده کلی درخواست هم‌زمان بخونن و عوضش کنن بدون این‌که خراب بشه.

فصل پایگاه داده‌ی دایتل **SQL** رو با **MySQL** درس می‌ده، و نشون می‌ده برنامه‌های جاوا و سی‌شارپ چطور براش پرس‌وجو می‌فرستن. این مبحث همون مسیر رو می‌ره: داده چطور تو جدول‌ها مرتب می‌شه، چطور با SQL درخواستش کنی، جدول‌ها چطور با کلید و join به هم وصل می‌شن، و دو تا ایده که هر برنامه‌نویس وب لازمشون داره: **شاخص** (سرعت) و **تراکنش** (امنیت). مثال‌هامون از **SQLite** استفاده می‌کنن که تو خود Node.js هست؛ SQLش تو MySQL، PostgreSQL یا SQL Server تقریباً همینه.

## جدول، ردیف و کلید

یه **پایگاه داده‌ی رابطه‌ای** داده رو تو **جدول**‌ها نگه می‌داره. هر جدول یه نوع چیز رو توصیف می‌کنه:

- هر **ردیف** یه مورده (یه کالا، یه دانشجو)؛
- هر **ستون** یه ویژگیه، با یه **نوع** (\`INTEGER\`، \`TEXT\`، \`REAL\`، تاریخ و…)؛
- **کلید اصلی** ستونیه (یا مجموعه‌ای از ستون‌ها) که مقدارش برای هر ردیف یکتاست، مثل \`id\`. با همینه که دقیقاً به یه ردیف اشاره می‌کنی.

ساختار جدول رو **شِما** (schema) می‌گن، و می‌تونه قانون‌هایی رو اجرا کنه: \`NOT NULL\` (مقدار لازمه)، \`UNIQUE\` (هیچ دو ردیفی این مقدار رو با هم ندارن، مثل آدرس ایمیل)، \`CHECK (price >= 0)\`، و مقدارهای \`DEFAULT\`. این قانون‌ها حتی اگه کد برنامه باگ داشته باشه، از داده محافظت می‌کنن.

جدول‌ها با **کلید خارجی** به هم وصل می‌شن: ستونی که کلید اصلی یه ردیف از جدول دیگه رو نگه می‌داره. جدول \`orders\` اسم و آدرس مشتری رو تو هر سفارش کپی نمی‌کنه؛ \`customer_id\` رو نگه می‌داره، که به یه ردیف تو \`customers\` اشاره می‌کنه. پایگاه داده می‌تونه بررسی کنه که هر \`customer_id\` واقعاً وجود داره.

تقسیم داده بین جدول‌ها طوری که هر واقعیت **یه بار** ذخیره بشه رو **نرمال‌سازی** می‌گن. اگه یه مشتری آدرسش رو عوض کنه، یه ردیف عوض می‌شه، و همه‌ی سفارش‌ها آدرس جدید رو می‌بینن. وقتی داده این‌ور و اون‌ور کپی بشه، کپی‌ها کم‌کم با هم ناجور می‌شن.

:::show
**یه مثال روزمره: پرونده‌های یه مدرسه.**

- مدرسه یه **دفتر دانش‌آموزها** داره (برای هر دانش‌آموز یه خط: شماره، اسم، ایمیل) و یه **فهرست درس‌ها** (برای هر درس یه خط).
- برای ثبت این‌که کی چی می‌خونه، مشخصات کامل دانش‌آموز رو تو فهرست هر درس دوباره نمی‌نویسه. یه **برگه‌ی ثبت‌نام** ساده نگه می‌داره: شماره‌ی دانش‌آموز، شماره‌ی درس، نمره. این یه جدول از کلیدهای خارجیه.
- برای چاپ «کارنامه‌ی سارا»، منشی شماره‌ی سارا رو برمی‌داره، خط‌هاش رو تو برگه‌ی ثبت‌نام پیدا می‌کنه، و اسم هر درس رو تو فهرست درس‌ها نگاه می‌کنه. همین گشتن بین برگه‌ها یه **JOIN** ـه.
- وقتی سارا ایمیلش رو عوض می‌کنه، فقط دفتر دانش‌آموزها عوض می‌شه. هر کارنامه‌ای که بعدش چاپ بشه درسته، چون هیچ جای دیگه‌ای کپیش رو نداشت.
- منشی قبول نمی‌کنه دانش‌آموز شماره‌ی ۹ رو تو برگه‌ی ثبت‌نام بنویسه اگه تو دفتر دانش‌آموزی با شماره‌ی ۹ نباشه. این یه **محدودیت کلید خارجی** ـه.
:::

## SQL در پنج فعل

**SQL** (زبان پرس‌وجوی ساخت‌یافته) زبان استاندارد پایگاه‌های داده‌ی رابطه‌ایه. تو می‌گی **چی** می‌خوای، و پایگاه داده تصمیم می‌گیره **چطور** بیاردش.

- \`CREATE TABLE\`: یه جدول و قانون‌هاش رو تعریف کن.
- \`INSERT INTO ... VALUES ...\`: ردیف اضافه کن.
- \`SELECT ... FROM ... WHERE ... ORDER BY ... LIMIT ...\`: ردیف‌ها رو بخون. با \`GROUP BY\` و \`COUNT\`، \`SUM\`، \`AVG\`، \`MIN\`، \`MAX\` گروه‌ها رو خلاصه کن.
- \`UPDATE ... SET ... WHERE ...\`: ردیف‌ها رو عوض کن.
- \`DELETE FROM ... WHERE ...\`: ردیف‌ها رو پاک کن.

با دو تای آخر مراقب باش: \`UPDATE\` یا \`DELETE\` **بدون \`WHERE\`** *همه‌ی* ردیف‌های جدول رو عوض یا پاک می‌کنه.

از یه برنامه‌ی وب، SQL همیشه به شکل یه **دستور آماده** (prepared statement) با **پارامتر** فرستاده می‌شه: \`SELECT * FROM users WHERE email = ?\`، که مقدار جدا فرستاده می‌شه. مقدار هیچ‌وقت به متن SQL چسبونده نمی‌شه. چسبوندن ورودی کاربر به SQL همون راهیه که **تزریق SQL** اتفاق می‌افته، یکی از پرخسارت‌ترین حمله‌های وب؛ تو [امنیت وب](/internet-engineering/web-security) سراغش می‌ریم.

## Join

یه **JOIN** ردیف‌های دو تا جدول رو جایی که یه شرط برقراره ترکیب می‌کنه، معمولاً «این کلید خارجی برابر اون کلید اصلیه»:

- **\`INNER JOIN\`** (یا فقط \`JOIN\`): فقط ردیف‌هایی که دو طرف با هم جورن. «دانشجوها و درس‌هایی که می‌خونن» دانشجوهای بی‌درس رو کنار می‌ذاره.
- **\`LEFT JOIN\`**: همه‌ی ردیف‌های جدول سمت چپ، با ردیف‌های جور از سمت راست، یا \`NULL\` وقتی جوری نیست. «همه‌ی دانشجوها و تعداد درس‌هاشون» دانشجوهای با صفر درس رو هم داره.

\`NULL\` یعنی «مقدار نداره» (معلوم نیست، یا وجود نداره). صفر یا رشته‌ی خالی نیست: \`NULL = NULL\` درست نیست؛ با \`IS NULL\` امتحانش می‌کنی، و تابع‌هایی مثل \`AVG\` ازش رد می‌شن.

## شاخص: پیدا کردن سریع ردیف‌ها

بدون کمک، پیدا کردن \`WHERE customer = 'c123'\` تو جدولی با ۲۰۰ هزار سفارش یعنی **خوندن تک‌تک ردیف‌ها** (یه *پویش کامل جدول*). یه **شاخص** (index) یه ساختار جدا و مرتبه (معمولاً یه B-tree، نوعی [درخت جست‌وجوی متوازن](/data-structures/b-trees)) که مقدارها رو به ردیف‌هایی که دارنشون وصل می‌کنه. با یه شاخص روی \`customer\`، پایگاه داده ردیف‌ها رو با چند قدم پیدا می‌کنه، مثل پیدا کردن یه کلمه تو فرهنگ لغت به‌جای خوندنش از اول.

- **کلید اصلی** خودبه‌خود شاخص داره، هر ستون \`UNIQUE\` هم همین‌طور.
- برای ستون‌هایی که زیاد باهاشون **جست‌وجو، join یا مرتب** می‌کنی شاخص بذار.
- شاخص مجانی نیست: جا می‌گیره، و هر \`INSERT\`، \`UPDATE\` و \`DELETE\` باید اون رو هم به‌روز کنه. همه‌چی رو شاخص‌دار نکن.
- \`EXPLAIN\` (تو SQLite، \`EXPLAIN QUERY PLAN\`) نشون می‌ده یه پرس‌وجو جدول رو پویش می‌کنه یا از شاخص استفاده می‌کنه. اولین ابزاریه که وقتی یه صفحه کُنده سراغش می‌ری.

:::show
\`\`\`anim
array 10
values Ali Bita Dara Leila Mina Omid Reza Sara Tara Zoe
ptr lo 0 | شاخص اسم مشتری‌ها رو مرتب نگه می‌داره. دنبال Sara می‌گردیم.
ptr hi 9 | بازه‌ی جست‌وجو کل شاخصه: خونه‌های ۰ تا ۹.
mark 4 | وسط رو نگاه کن: Mina. Sara بعد از Mina میاد...
ptr lo 5 | ...پس کل نیمه‌ی چپ با یه قدم کنار گذاشته می‌شه.
mark 7 | وسطِ چیزی که مونده: Sara. با دیدن فقط ۲ تا اسم پیدا شد.
done 7 | این خونه‌ی شاخص به ردیف‌های Sara اشاره می‌کنه. یه میلیون اسم حدود ۲۰ نگاه لازم داره.
\`\`\`
:::

## تراکنش: همه یا هیچ

خیلی از تغییرها **چند** دستور لازم دارن: جابه‌جا کردن پول، از یه حساب پول برمی‌داره و به یه حساب دیگه می‌ذاره؛ ثبت یه سفارش، خود سفارش و اقلامش رو اضافه می‌کنه و از موجودی کم می‌کنه. اگه سرور وسط کار کرش کنه، یا یه قانون نقض بشه، داده نصفه‌نیمه عوض‌شده می‌مونه.

یه **تراکنش** دستورها رو تو یه واحد گروه می‌کنه: \`BEGIN\`، دستورها، بعد \`COMMIT\` (همه رو دائمی کن) یا \`ROLLBACK\` (همه رو برگردون). پایگاه‌های داده ویژگی‌های **ACID** رو تضمین می‌کنن:

- **اتمی بودن (Atomicity):** یا همه‌ی تراکنش انجام می‌شه یا هیچ‌کدومش.
- **سازگاری (Consistency):** قانون‌ها (کلیدها، \`CHECK\`ها) قبل و بعدش برقرارن.
- **جدایی (Isolation):** تراکنش‌هایی که هم‌زمان اجرا می‌شن کارِ نیمه‌تموم هم رو نمی‌بینن.
- **ماندگاری (Durability):** وقتی commit شد، تغییر از کرش یا قطع برق جون سالم به در می‌بره.

## پایگاه داده تو یه برنامه‌ی وب

- **کجا اجرا می‌شه:** معمولاً رو سرور خودش (یا یه سرویس ابری مدیریت‌شده)، که سرورهای برنامه از راه شبکه بهش وصل می‌شن. کلی سرور برنامه یه پایگاه داده رو با هم استفاده می‌کنن، برای همینه که جای طبیعی برای حالت مشترک مثل [نشست‌ها](/internet-engineering/server-side-programming) ـه.
- **استخر اتصال (connection pool):** باز کردن اتصال به پایگاه داده کُنده، پس برنامه‌ها چند تا رو باز نگه می‌دارن و دوباره استفاده‌شون می‌کنن.
- **ORMها** (نگاشت‌گرهای شیء به رابطه، مثل **LINQ** سی‌شارپ تو کتاب دایتل، یا Prisma، Sequelize، ORM جنگو، Hibernate) اجازه می‌دن به‌جای نوشتن SQL با شیء کار کنی. وقت صرفه‌جویی می‌کنن، ولی هنوز ارزش داره بدونی چه SQLـی تولید می‌کنن، مخصوصاً مشکل «N+1 پرس‌وجو»: یه پرس‌وجو برای یه فهرست، بعد یکی دیگه برای هر مورد.
- **انواع دیگه‌ی پایگاه داده:** انبارهای سند (MongoDB)، انبارهای کلید-مقدار (Redis)، موتورهای جست‌وجو (Elasticsearch). پایگاه‌های رابطه‌ای هنوز انتخاب پیش‌فرض برای بیشتر داده‌های برنامه‌ان.
- **پشتیبان و مهاجرت:** شِماها با گذشت زمان با اسکریپت‌های **مهاجرت** (migration) نسخه‌دار عوض می‌شن، و پشتیبان‌ها رو باید با بازگردوندن واقعی امتحان کرد.

## کی به کارت میاد، کی نه؟

| موقعیت | چی جوره | چرا |
|---|---|---|
| کاربرها، سفارش‌ها، کالاها با رابطه بینشون | یه پایگاه داده‌ی رابطه‌ای (PostgreSQL، MySQL، SQL Server) | کلید، join، تراکنش، قانون |
| یه برنامه‌ی کوچیک، یه نمونه‌ی اولیه، یه اپ موبایل | SQLite | کل پایگاه داده تو یه فایل، بدون سرور |
| جست‌وجوی زیاد روی یه ستون | یه شاخص روی اون | از خوندن همه‌ی ردیف‌ها به چند قدم |
| چند تغییر که مال هم‌دیگه‌ان | یه تراکنش | همه یا هیچ |
| ورودی کاربر تو یه پرس‌وجو | دستور آماده با پارامتر | جلوی تزریق SQL رو می‌گیره |
| نشست و کشی که باید سریع باشه | یه انبار کلید-مقدار مثل Redis | تو حافظه، جست‌وجوی ساده |

## مثال ساده: یه جدول و پرس‌وجوهای پایه (جاوااسکریپت + SQL)

یه جدول \`products\` با کلید اصلی و چند قانون می‌سازیم، با یه \`INSERT\` آماده پرش می‌کنیم، و چند تا سؤال می‌پرسیم: فیلتر و مرتب‌سازی، یه پارامتر، یه خلاصه برای هر دسته. بعد یه \`UPDATE\`، یه \`DELETE\`، و یه درج که یه قانون رو می‌شکنه.

\`\`\`javascript
// A first database: create a table, insert rows, ask questions with SQL
import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync(":memory:");             // a whole database in memory (a file path works too)
db.exec(\`
  CREATE TABLE products (
    id       INTEGER PRIMARY KEY,                    -- a unique number for every row
    name     TEXT NOT NULL,
    category TEXT NOT NULL,
    price    REAL NOT NULL CHECK (price >= 0),
    stock    INTEGER NOT NULL DEFAULT 0
  )
\`);

const insert = db.prepare("INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)");
for (const row of [
  ["Notebook", "paper", 3.5, 120], ["Pen", "writing", 1.2, 300], ["Backpack", "bags", 29.99, 15],
  ["Pencil", "writing", 0.8, 0], ["Sketchbook", "paper", 7.25, 40], ["Laptop sleeve", "bags", 18, 22],
]) insert.run(...row);

const show = (title, sql, ...params) => {
  console.log(\`-- \${title}\`);
  for (const r of db.prepare(sql).all(...params)) console.log("  " + Object.values(r).join(" | "));
};

show("in stock, cheapest first", "SELECT name, price FROM products WHERE stock > 0 ORDER BY price LIMIT 3");
show("one category", "SELECT name, stock FROM products WHERE category = ?", "paper");
show("per category", "SELECT category, COUNT(*) AS items, ROUND(AVG(price), 2) AS avg_price FROM products GROUP BY category ORDER BY category");

db.prepare("UPDATE products SET stock = stock - ? WHERE name = ?").run(5, "Backpack");
db.prepare("DELETE FROM products WHERE stock = 0").run();
show("after a sale and a clean-up", "SELECT name, stock FROM products ORDER BY id");

try {
  insert.run("Broken", "bags", -4, 1);
} catch (e) {
  console.log("rejected:", e.message);
}
\`\`\`

\`\`\`text
-- in stock, cheapest first
  Pen | 1.2
  Notebook | 3.5
  Sketchbook | 7.25
-- one category
  Notebook | 120
  Sketchbook | 40
-- per category
  bags | 2 | 23.99
  paper | 2 | 5.38
  writing | 2 | 1
-- after a sale and a clean-up
  Notebook | 120
  Pen | 300
  Backpack | 10
  Sketchbook | 40
  Laptop sleeve | 22
rejected: CHECK constraint failed: price >= 0
\`\`\`

نتیجه‌ها رو بخونیم:

- **مداد تو فهرست اول نیست** چون موجودیش ۰ ـه: \`WHERE\` قبل از این‌که \`ORDER BY\` مرتب کنه و \`LIMIT\` ببُره، فیلتر می‌کنه.
- **\`GROUP BY\` شش ردیف رو به سه تا خلاصه تبدیل کرد.** میانگین \`writing\` می‌شه ۱ چون (۱٫۲ + ۰٫۸) / ۲ = ۱.
- **\`stock = stock - 5\` رو خود پایگاه داده حساب می‌کنه،** تو یه قدم. خوندن موجودی تو جاوااسکریپت، کم کردن، و نوشتنش برگشتی وقتی دو تا درخواست هم‌زمان کوله‌پشتی می‌فروشن غلط درمیاد.
- **قانونِ تو شِما جلوی قیمت منفی رو گرفت،** مهم نیست کدوم بخش برنامه می‌خواست درجش کنه. \`?\`ها پارامترهای دستور آماده‌ان: مقدارها هیچ‌وقت جزو متن SQL نمی‌شن.

## مثال متوسط: کلیدها و joinها (جاوااسکریپت + SQL)

سه جدول: \`students\`، \`courses\` و \`enrollments\`، که این دو تا رو با دو کلید خارجی و یه کلید اصلی ترکیبی به هم وصل می‌کنه. با یه \`INNER JOIN\`، یه \`LEFT JOIN\` با گروه‌بندی، و یه زیرپرس‌وجوی \`NOT EXISTS\` دوباره سرهم‌شون می‌کنیم؛ بعد سه تا درج امتحان می‌کنیم که قانون‌ها رو می‌شکنن.

\`\`\`javascript
// Several tables connected by keys, and JOINs that put them back together
import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync(":memory:");
db.exec(\`
  PRAGMA foreign_keys = ON;
  CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE);
  CREATE TABLE courses  (id INTEGER PRIMARY KEY, title TEXT NOT NULL);
  CREATE TABLE enrollments (                                   -- one row per (student, course) pair
    student_id INTEGER NOT NULL REFERENCES students(id),
    course_id  INTEGER NOT NULL REFERENCES courses(id),
    grade      INTEGER,
    PRIMARY KEY (student_id, course_id)
  );
  INSERT INTO students VALUES (1, 'Sara', 'sara@example.com'), (2, 'Omid', 'omid@example.org'), (3, 'Lena', 'lena@example.net');
  INSERT INTO courses  VALUES (10, 'Networks'), (20, 'Internet Eng'), (30, 'Algorithms'), (40, 'Databases');
  INSERT INTO enrollments VALUES (1, 10, 17), (1, 20, 19), (2, 20, 14), (2, 30, NULL);
\`);

const show = (title, sql) => {
  console.log(\`-- \${title}\`);
  for (const r of db.prepare(sql).all()) console.log("  " + Object.values(r).map((v) => v ?? "NULL").join(" | "));
};

show("who takes what (INNER JOIN)", \`
  SELECT s.name, c.title, e.grade
  FROM enrollments e
  JOIN students s ON s.id = e.student_id
  JOIN courses  c ON c.id = e.course_id
  ORDER BY s.name, c.title\`);

show("every student, even with no courses (LEFT JOIN)", \`
  SELECT s.name, COUNT(e.course_id) AS courses, ROUND(AVG(e.grade), 1) AS avg_grade
  FROM students s
  LEFT JOIN enrollments e ON e.student_id = s.id
  GROUP BY s.id
  ORDER BY s.name\`);

show("courses nobody takes", \`
  SELECT c.title FROM courses c
  WHERE NOT EXISTS (SELECT 1 FROM enrollments e WHERE e.course_id = c.id)\`);

for (const sql of [
  "INSERT INTO enrollments VALUES (9, 10, NULL)",                    // student 9 doesn't exist
  "INSERT INTO students VALUES (4, 'Sam', 'sara@example.com')",      // email already used
  "INSERT INTO enrollments VALUES (1, 10, 20)",                      // Sara is already in Networks
]) {
  try { db.exec(sql); } catch (e) { console.log("rejected:", e.message); }
}
\`\`\`

\`\`\`text
-- who takes what (INNER JOIN)
  Omid | Algorithms | NULL
  Omid | Internet Eng | 14
  Sara | Internet Eng | 19
  Sara | Networks | 17
-- every student, even with no courses (LEFT JOIN)
  Lena | 0 | NULL
  Omid | 2 | 14
  Sara | 2 | 18
-- courses nobody takes
  Databases
rejected: FOREIGN KEY constraint failed
rejected: UNIQUE constraint failed: students.email
rejected: UNIQUE constraint failed: enrollments.student_id, enrollments.course_id
\`\`\`

نتیجه‌ها رو بخونیم:

- **\`INNER JOIN\` لنا رو نشون نمی‌ده:** هیچ ثبت‌نامی نداره، پس چیزی نیست که باهاش جور بشه. \`LEFT JOIN\` نگهش می‌داره، با تعداد ۰ و میانگین \`NULL\`.
- **میانگین امید ۱۴ ـه، نه ۷:** نمره‌ی الگوریتمش \`NULL\` ـه (هنوز نمره نگرفته)، و \`AVG\` به‌جای این‌که \`NULL\`ها رو صفر حساب کنه ازشون رد می‌شه. معمولاً همینو می‌خوای، ولی ارزش داره بدونیش.
- **جدول ثبت‌نام فقط عدد نگه می‌داره،** ولی پرس‌وجوها اسم و عنوان چاپ می‌کنن: joinها پیداشون می‌کنن. عوض کردن اسم یه درس یه ردیف تو \`courses\` رو عوض می‌کنه، و همه‌ی پرس‌وجوها می‌بیننش.
- **پایگاه داده هر سه درج بد رو رد کرد:** ثبت‌نام برای دانشجویی که وجود نداره (کلید خارجی)، حساب دوم با همون ایمیل (\`UNIQUE\`)، و همون ثبت‌نام دو بار (کلید اصلی ترکیبی). تو SQLite بررسی کلید خارجی رو باید با \`PRAGMA foreign_keys = ON\` روشن کرد؛ بقیه‌ی پایگاه‌های داده به‌طور پیش‌فرض بررسیش می‌کنن.

## مثال پیشرفته: یه شاخص و یه تراکنش (جاوااسکریپت + SQL)

اول، ۲۰۰ هزار سفارش از ۵۰ هزار مشتری (با یه مولد تصادفی بذردار، تا داده تو هر اجرا یکی باشه). از پایگاه داده قبل و بعد از ساختن یه شاخص نقشه‌ی پرس‌وجوش رو می‌پرسیم، و زمان ۱۰۰ جست‌وجو رو اندازه می‌گیریم. بعد یه انتقال پول داخل یه تراکنش، یه بار با پول کافی و یه بار بدونش.

\`\`\`javascript
// Indexes make lookups fast; transactions make changes all-or-nothing
import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync(":memory:");
db.exec("CREATE TABLE orders (id INTEGER PRIMARY KEY, customer TEXT NOT NULL, total REAL NOT NULL)");

let seed = 7;                                                   // seeded random numbers: same data every run
const random = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const insert = db.prepare("INSERT INTO orders (customer, total) VALUES (?, ?)");
db.exec("BEGIN");
for (let i = 0; i < 200000; i++) insert.run(\`c\${Math.floor(random() * 50000)}\`, Math.round(random() * 10000) / 100);
db.exec("COMMIT");

const find = db.prepare("SELECT COUNT(*) AS orders, ROUND(SUM(total), 2) AS spent FROM orders WHERE customer = ?");
const plan = () => db.prepare("EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer = ?").all("c1").map((r) => r.detail).join("; ");
const time100 = () => {                                         // 100 lookups of different customers
  const start = performance.now();
  for (let i = 0; i < 100; i++) find.get(\`c\${i * 499}\`);
  return performance.now() - start;
};

console.log("without index:", plan());
const slow = time100();
db.exec("CREATE INDEX idx_orders_customer ON orders(customer)");
const fast = time100();
console.log("with index:   ", plan());
console.log("100 lookups:", slow / fast > 100 ? "more than 100 times faster with the index" : "not much faster?");
console.log("customer c499:", JSON.stringify(find.get("c499")));

// a transfer between two accounts: both changes happen, or neither does
db.exec(\`CREATE TABLE accounts (name TEXT PRIMARY KEY, balance INTEGER NOT NULL CHECK (balance >= 0));
         INSERT INTO accounts VALUES ('Sara', 100), ('Omid', 20);\`);
const move = db.prepare("UPDATE accounts SET balance = balance + ? WHERE name = ?");
function transfer(from, to, amount) {
  db.exec("BEGIN");
  try {
    move.run(amount, to);                                       // add first...
    move.run(-amount, from);                                    // ...then take: fails if it goes below 0
    db.exec("COMMIT");
    return "done";
  } catch (e) {
    db.exec("ROLLBACK");                                        // undo the half that already happened
    return "rolled back (" + e.message + ")";
  }
}
const balances = () => db.prepare("SELECT name, balance FROM accounts ORDER BY name").all().map((r) => \`\${r.name}=\${r.balance}\`).join(" ");
console.log("transfer Sara->Omid 30: ", transfer("Sara", "Omid", 30), "|", balances());
console.log("transfer Omid->Sara 500:", transfer("Omid", "Sara", 500), "|", balances());
\`\`\`

\`\`\`text
without index: SCAN orders
with index:    SEARCH orders USING INDEX idx_orders_customer (customer=?)
100 lookups: more than 100 times faster with the index
customer c499: {"orders":2,"spent":75.94}
transfer Sara->Omid 30:  done | Omid=50 Sara=70
transfer Omid->Sara 500: rolled back (CHECK constraint failed: balance >= 0) | Omid=50 Sara=70
\`\`\`

نتیجه‌ها رو بخونیم:

- **\`SCAN orders\` یعنی خوندن هر ۲۰۰ هزار ردیف** برای هر جست‌وجو. بعد از \`CREATE INDEX\`، نقشه می‌گه \`SEARCH ... USING INDEX\`: پایگاه داده مستقیم می‌پره سراغ ردیف‌های درست. خود پرس‌وجو اصلاً عوض نشد؛ فقط نقشه‌ش عوض شد.
- **تفاوت بیشتر از صد برابره** رو این جدول (زمان‌های دقیق از یه دستگاه به دستگاه دیگه فرق می‌کنه، برای همین برنامه فقط مقایسه رو چاپ می‌کنه)، و با بزرگ شدن جدول بیشتر می‌شه: پویش با هر ردیف تازه کُندتر می‌شه؛ جست‌وجو با شاخص به‌زور متوجه می‌شه.
- **درج ۲۰۰ هزار ردیف داخل یه \`BEGIN\`/\`COMMIT\`** خودش یه ترفند سرعته: بدونش، هر درج تراکنش جدای خودش می‌شد و جداگونه رو دیسک نوشته می‌شد.
- **انتقال ناموفق هیچ ردی به جا نذاشت.** پول اول به حساب سارا *اضافه* شد؛ بعد برداشتن ۵۰۰ از امید \`CHECK\` رو شکست. بدون تراکنش، سارا ۵۰۰تایی رو که از هیچ‌جا اومده بود نگه می‌داشت. \`ROLLBACK\` نیمه‌ی اول رو برگردوند، و هر دو موجودی دقیقاً مثل قبلن.

## نگاه یه مهندس ارشد

- **قانون‌ها رو تو شِما بذار** (\`NOT NULL\`، \`UNIQUE\`، کلید خارجی، \`CHECK\`). کد برنامه باگ داره؛ پایگاه داده آخرین خط دفاع داده‌هاته.
- **همیشه از پارامتر استفاده کن،** هیچ‌وقت چسبوندن رشته، برای مقدارهای تو SQL.
- **نقشه‌ی هر پرس‌وجوی کُند رو نگاه کن،** و برای الگوهای واقعی پرس‌وجو شاخص بذار، نه از روی حدس.
- **برای هر تغییر چندمرحله‌ای از تراکنش استفاده کن،** و کوتاه نگهش دار.
- **حواست به پرس‌وجوهای N+1 از ORMها باشه؛** یه join معمولاً خیلی سریع‌تر از صد تا پرس‌وجوی کوچیکه.
- **پشتیبان بگیر، و بازگردوندن رو امتحان کن.** پشتیبانی که هیچ‌وقت بازگردونده نشده یه امیده، نه یه پشتیبان.

## اشتباه‌های رایج

:::mistakes
- **ساختن SQL با چسبوندن رشته به ورودی کاربر:** تزریق SQL.
- **\`UPDATE\` یا \`DELETE\` بدون \`WHERE\`:** همه‌ی ردیف‌ها عوض می‌شن یا می‌رن.
- **کپی کردن یه داده تو چند جدول،** و بعد به‌روز کردن فقط یکی از کپی‌ها.
- **امتحان کردن \`= NULL\` به‌جای \`IS NULL\`،** یا یادت بره که \`AVG\` و \`COUNT(column)\` از \`NULL\`ها رد می‌شن.
- **نذاشتن شاخص روی ستون‌هایی که تو \`WHERE\` و \`JOIN\` استفاده می‌شن،** یا گذاشتن شاخص رو همه‌ی ستون‌ها «محض احتیاط».
- **تغییرهای چندمرحله‌ای بدون تراکنش:** یه خطا داده‌ی نصفه‌نیمه به جا می‌ذاره.
- **خوندن-تغییر-نوشتن تو کد برنامه** (\`stock = read(); write(stock - 1)\`) به‌جای یه \`UPDATE\`: زیر بار، به‌روزرسانی‌ها گم می‌شن.
:::

## خلاصه

:::takeaways[چیزهایی که باید یادت بمونه]
- پایگاه داده‌ی رابطه‌ای داده رو تو جدول‌هایی از ردیف و ستون نوع‌دار نگه می‌داره؛ کلید اصلی هر ردیف رو مشخص می‌کنه.
- کلید خارجی جدول‌ها رو به هم وصل می‌کنه؛ نرمال‌سازی هر واقعیت رو یه بار ذخیره می‌کنه؛ محدودیت‌ها قانون‌ها رو تو خود پایگاه داده اجرا می‌کنن.
- SQL پنج فعل روزمره داره: \`CREATE\`، \`INSERT\`، \`SELECT\`، \`UPDATE\`، \`DELETE\`؛ \`GROUP BY\` خلاصه می‌کنه.
- \`INNER JOIN\` فقط جورها رو نگه می‌داره؛ \`LEFT JOIN\` هر ردیف سمت چپ رو نگه می‌داره، با \`NULL\` جایی که چیزی جور نیست.
- شاخص پویش کامل جدول رو به جست‌وجوی سریع تبدیل می‌کنه؛ با \`EXPLAIN\` بررسی کن، و چیزی رو شاخص‌دار کن که باهاش جست‌وجو، join و مرتب می‌کنی.
- تراکنش تغییرهای چندمرحله‌ای رو همه-یا-هیچ می‌کنه (ACID).
- از یه برنامه‌ی وب، مقدارها رو همیشه به شکل پارامتر دستور آماده بفرست.
:::

## این مبحث کجای نقشه‌ست؟

\`\`\`mermaid
flowchart LR
  S["برنامه‌نویسی سمت سرور"] --> D["پایگاه داده برای وب"]
  B["ساختمان داده: B-tree"] --> D
  D --> R["وب‌سرویس و REST"]
  D --> X["امنیت وب: تزریق SQL"]
\`\`\`

مبحث بعدی [وب‌سرویس و REST](/internet-engineering/web-services-rest) ـه: گذاشتن یه رابط HTTP تمیز جلوی همه‌ی این داده‌ها، تا برنامه‌های دیگه هم بتونن ازش استفاده کنن.

## تمرین

اول خودت جواب بده، بعد جواب رو باز کن.

::::exercise
**تمرین ۱.** با جدول \`products\` مثال ساده، SQL بنویس برای: (الف) سه تا گرون‌ترین کالا (ب) تعداد کالاهای دسته‌ی \`bags\` (ج) ده درصد گرون کردن همه‌ی کالاهای \`paper\`.

:::answer
- (الف) \`SELECT name, price FROM products ORDER BY price DESC LIMIT 3;\`
- (ب) \`SELECT COUNT(*) FROM products WHERE category = 'bags';\` (از کد برنامه، با پارامتر: \`WHERE category = ?\`).
- (ج) \`UPDATE products SET price = ROUND(price * 1.10, 2) WHERE category = 'paper';\`

برای (ج)، همیشه قبل از اجرای \`UPDATE\` شرط \`WHERE\` رو چک کن. یه عادت خوب: اول همون \`WHERE\` رو با یه \`SELECT\` اجرا کن تا ببینی کدوم ردیف‌ها عوض می‌شن.
:::
::::

::::exercise
**تمرین ۲.** یه وبلاگ پست‌ها رو تو این جدول نگه می‌داره: \`posts(id, title, body, author_name, author_email)\`. وقتی یه نویسنده ایمیلش رو عوض می‌کنه چه مشکل‌هایی پیش میاد؟ جدول‌های بهتری طراحی کن.

:::answer
**مشکل‌ها:** اسم و ایمیل نویسنده تو هر پستی که نوشته کپی شده. عوض کردن ایمیل یعنی به‌روز کردن کلی ردیف؛ اگه یکیش جا بیفته، داده با خودش تناقض داره (دو تا ایمیل برای یه نویسنده). در ضمن هیچ راهی برای نگه داشتن نویسنده‌ای که هنوز پستی ننوشته نیست، و یه غلط تایپی تو یه ردیف یه نویسنده‌ی «جدید» می‌سازه.

**طراحی بهتر (نرمال‌شده):**

- \`authors(id PRIMARY KEY, name NOT NULL, email NOT NULL UNIQUE)\`
- \`posts(id PRIMARY KEY, title NOT NULL, body NOT NULL, author_id NOT NULL REFERENCES authors(id))\`

حالا عوض کردن ایمیل یه \`UPDATE\` رو یه ردیفه. برای نشون دادن پست‌ها با اسم نویسنده: \`SELECT p.title, a.name FROM posts p JOIN authors a ON a.id = p.author_id;\`. یه شاخص روی \`posts(author_id)\` «همه‌ی پست‌های این نویسنده» رو سریع می‌کنه.
:::
::::

::::exercise
**تمرین ۳.** تو مثال پیشرفته، فرض کن تابع \`transfer\` از \`BEGIN\`/\`COMMIT\`/\`ROLLBACK\` استفاده نمی‌کرد و فقط دو تا \`UPDATE\` رو اجرا می‌کرد. بعد از انتقال ناموفق ۵۰۰، موجودی‌ها چی می‌شدن؟ چرا ترتیب دو تا دستور اینجا مهمه، و چرا با تراکنش مهم نیست؟

:::answer
بدون تراکنش، هر \`UPDATE\` خودش جدا commit می‌شه. اولی (اضافه کردن ۵۰۰ به سارا) موفق می‌شه؛ دومی (برداشتن ۵۰۰ از امید) از \`CHECK\` رد نمی‌شه و شکست می‌خوره. نتیجه: **سارا = ۵۷۰، امید = ۵۰**. ۵۰۰ واحد پول از هیچ ساخته شد.

اگه دستورها برعکس بودن (اول برداشتن، بعد اضافه کردن)، \`CHECK\` ناموفق قبل از این‌که چیزی عوض بشه جلوی انتقال رو می‌گرفت، پس این خطای خاص بی‌ضرر می‌شد. ولی خطاهای دیگه (یه کرش، یه اتصال قطع‌شده، یه باگ) هنوز می‌تونستن *بین* دو تا دستور اتفاق بیفتن، و اون‌وقت پول به‌جای ساخته شدن غیب می‌شد.

با تراکنش، ترتیب برای درستی مهم نیست: یا هر دو دستور commit می‌شن، یا \`ROLLBACK\` همه‌چی رو برمی‌گردونه. تکیه به یه ترتیبِ خوش‌شانس راهبرد امنیتی نیست؛ تراکنش هست.
:::
::::

::::exercise
**تمرین ۴ (فکر کن، حفظ نکن).** صفحه‌ی کالای یه فروشگاه، کالا و نقدهاش رو نشون می‌ده. کد برنامه‌نویس یه پرس‌وجو برای کالا، یه پرس‌وجو برای فهرست ۵۰ تا نقد، و بعد برای هر نقد یه پرس‌وجو برای گرفتن اسم نویسنده‌ش اجرا می‌کنه. صفحه کُنده. برای هر بار دیدن صفحه چند تا پرس‌وجو اجرا می‌شه؟ یه راه‌حل پیشنهاد بده، و بگو کدوم شاخص کمک می‌کنه.

:::answer
**پرس‌وجوها:** ۱ (کالا) + ۱ (نقدها) + ۵۰ (یکی برای هر نویسنده) = **۵۲ پرس‌وجو** برای هر بار دیدن صفحه. این همون **مشکل کلاسیک N+1 پرس‌وجو** ـه، که اغلب یه ORM بی‌سروصدا تولیدش می‌کنه وقتی کد تو یه حلقه به \`review.author.name\` دست می‌زنه. هر پرس‌وجو یه هزینه‌ی ثابت داره (یه رفت‌وبرگشت شبکه تا سرور پایگاه داده، تجزیه، برنامه‌ریزی)، پس ۵۰ تا پرس‌وجوی کوچولو می‌تونن خیلی کُندتر از یه پرس‌وجوی بزرگ‌تر باشن.

**راه‌حل:** نقدها رو **همراه** اسم‌ها با یه پرس‌وجو و یه join بگیر:

\`SELECT r.rating, r.text, u.name FROM reviews r JOIN users u ON u.id = r.user_id WHERE r.product_id = ? ORDER BY r.created_at DESC LIMIT 50;\`

روی هم ۲ تا پرس‌وجو (یا حتی ۱). ORMها برای خواستن این یه راه دارن («بارگذاری مشتاقانه»، \`include\`، \`select_related\`، \`JOIN FETCH\`).

**شاخص:** \`reviews(product_id)\`، یا بهتر \`reviews(product_id, created_at)\`، تا پایگاه داده بتونه نقدهای این کالا رو از قبل به ترتیب تاریخ پیدا کنه بدون پویش کل جدول نقدها. \`users.id\` کلید اصلیه، پس از قبل شاخص داره. بعد با \`EXPLAIN\` چک کن که هر دو جدول با شاخص جست‌وجو می‌شن، نه پویش.
:::
::::
`;export{e as default};