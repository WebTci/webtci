var e=`## الگوریتم‌های آماده

کتابخونه‌ی استاندارد بیشتر از صد تا **algorithm** (الگوریتم) آماده داره، بیشترشون تو سرآیندهای \`<algorithm>\` و \`<numeric>\`: مرتب‌سازی، جست‌وجو، شمردن، تبدیل، حذف، ادغام، جمع زدن و خیلی چیزهای دیگه.

هر الگوریتم رو یه **بازه‌ی پیمایشگری** کار می‌کنه، یعنی همون \`[begin, end)\` که تو [مبحث ظرف‌ها](/advanced-programming/stl-containers) دیدیم.
پس \`std::sort\` نمی‌دونه، و براش مهم هم نیست، که داده‌ها تو یه \`vector\` ـن یا یه \`array\` یا حتی یه آرایه‌ی داخلی.
همین جدا بودن الگوریتم‌ها از ظرف‌ها، STL رو این‌قدر قدرتمند کرده.

بیشتر الگوریتم‌ها یه **قاعده** هم می‌گیرن: «بر چه اساسی مرتب کنم؟»، «دنبال چی بگردم؟»، «هر عضو رو به چی تبدیل کنم؟».
ساده‌ترین راه نوشتن این قاعده، **lambda expression** (عبارت لامبدا) ـه: یه تابع کوچیک و بی‌اسم که همون‌جا که لازمه نوشته می‌شه.

کدی که با الگوریتم و لامبدا نوشته شده، معمولاً کوتاه‌تر، خواناتر و کم‌خطاتر از یه حلقه‌ی دستیه.
اسم الگوریتم، مثل \`count_if\` یا \`all_of\`، خودش می‌گه چه کاری انجام می‌شه.

:::show
**یه مثال روزمره: ماشین ظرف‌شویی.**

یه ماشین ظرف‌شویی برنامه‌های آماده داره: «شست‌وشوی سریع»، «شست‌وشوی سنگین»، «فقط آب‌کشی».
لازم نیست خودت بدونی آب چند درجه باشه یا چند دقیقه بچرخه. فقط برنامه رو انتخاب می‌کنی و ظرف‌ها رو می‌ذاری توش.

- **الگوریتم‌ها** همون برنامه‌های آماده‌ن: \`sort\`، \`find\`، \`count_if\`.
- **پیمایشگرها** می‌گن کدوم ظرف‌ها: «از این قفسه تا اون قفسه».
- **لامبدا** جزئیات کوچیکیه که هر بار ممکنه فرق کنه: «فقط لیوان‌ها»، «اول بشقاب‌های بزرگ».

تو برنامه‌ی ماشین رو از اول نمی‌نویسی. فقط بهش می‌گی کجا و با چه قاعده‌ای.
:::

## شکل لامبدا

لامبدا این شکل رو داره: \`[capture](parameters) { body }\`.

- **کروشه:** از بیرون چه چیزهایی رو با خودش ببره.
- **پرانتز:** چه ورودی‌هایی بگیره.
- **آکولاد:** چه کاری بکنه.

مثلاً \`[](int x) { return x % 2 == 0; }\` تابعیه که زوج بودن رو چک می‌کنه.
نوع برگشتی معمولاً خودکار حدس زده می‌شه.
اگه پارامترها رو \`auto\` بنویسی، لامبدا **generic** (عمومی) می‌شه و با هر نوعی کار می‌کنه.
یه لامبدا رو می‌شه تو یه متغیر هم نگه داشت: \`auto isEven = [](int x) { … };\`.

## گرفتن متغیرها: با مقدار و با ارجاع

لامبدا به‌طور پیش‌فرض متغیرهای محلی اطرافش رو نمی‌بینه. باید اون‌ها رو تو کروشه **capture** (گرفتن) کنه:

- \`[limit]\`: یه **کپی** از \`limit\` می‌گیره. تغییرهای بعدی \`limit\` رو لامبدا اثری ندارن.
- \`[&total]\`: یه **ارجاع** به \`total\` می‌گیره، پس لامبدا می‌تونه عوضش کنه، و همیشه مقدار تازه رو می‌بینه.
- \`[=]\` همه‌ی متغیرهای استفاده‌شده رو با مقدار می‌گیره، و \`[&]\` همه رو با ارجاع.

بهتره صریح بنویسی چی رو چطور گرفتی، تا معلوم باشه لامبدا به چه چیزهایی وابسته‌ست.

:::show
**یه مثال روزمره: عکس گرفتن از تابلوی قیمت، یا آدرس مغازه رو داشتن.**

می‌خوای به دوستت بگی قیمت نون چنده. دو راه داری:

- **با مقدار (\`[price]\`):** از تابلوی قیمت یه **عکس** می‌گیری و بهش می‌دی. فردا اگه نونوا قیمت رو عوض کنه، عکس دوستت هنوز قیمت قدیم رو نشون می‌ده.
- **با ارجاع (\`[&price]\`):** **آدرس مغازه** رو بهش می‌دی. هر وقت بره، قیمت روز رو می‌بینه. (و اگه بخواد، می‌تونه رو تابلو هم چیزی بنویسه!)

ولی یه خطر: اگه مغازه **تعطیل و خراب** بشه (متغیر از بین بره)، آدرس دیگه به جایی نمی‌رسه. لامبدایی که با ارجاع گرفته و بیشتر از متغیرش زنده می‌مونه، به حافظه‌ی آزادشده دست می‌زنه.
عکس این مشکل رو نداره: همیشه هست، حتی اگه مغازه دیگه نباشه.
:::

## شیء تابع و گزاره

قبل از لامبدا، این قاعده‌ها رو با **function object** (شیء تابع، یا **functor**) می‌نوشتن: کلاسی که \`operator()\` رو سربارگذاری کرده، پس شیئش رو می‌شه مثل یه تابع صدا زد.
کتابخونه چند تا شیء تابع آماده هم داره، مثل \`std::greater<int>{}\`.

در واقع، لامبدا هم پشت صحنه به یه شیء تابع بی‌اسم تبدیل می‌شه، و متغیرهای گرفته‌شده، عضوهای داده‌ی اون کلاس‌ان.

تابعی که \`bool\` برمی‌گردونه و برای تصمیم‌گیری به کار می‌ره، **predicate** (گزاره) نام داره.

## دسته‌های الگوریتم

| دسته | نمونه‌ها | کار |
|---|---|---|
| بدون تغییر | \`find\`، \`find_if\`، \`count_if\`، \`all_of\`، \`any_of\`، \`none_of\` | فقط نگاه می‌کنن |
| تغییردهنده | \`copy\`، \`transform\`، \`replace_if\`، \`fill\`، \`reverse\` | عضوها رو می‌نویسن یا جابه‌جا می‌کنن |
| حذف | \`remove\`، \`remove_if\`، \`unique\` | عضوهای ناخواسته رو می‌برن آخر |
| مرتب‌سازی | \`sort\`، \`stable_sort\`، \`partial_sort\`، \`nth_element\` | ترتیب می‌دن |
| رو بازه‌ی مرتب | \`binary_search\`، \`lower_bound\`، \`upper_bound\`، \`merge\`، \`set_intersection\` | فرض می‌کنن ورودی مرتبه |
| عددی (\`<numeric>\`) | \`accumulate\`، \`iota\`، \`partial_sum\`، \`inner_product\` | حساب می‌کنن |
| کمینه و بیشینه | \`min_element\`، \`max_element\`، \`minmax_element\` | کوچیک‌ترین و بزرگ‌ترین رو پیدا می‌کنن |

نسخه‌هایی که به \`_if\` ختم می‌شن، به‌جای یه مقدار، یه گزاره می‌گیرن: \`count\` یه مقدار مشخص رو می‌شمره، و \`count_if\` هر عضوی که گزاره براش درست باشه.

## الگوی \`remove\` و \`erase\`

الگوریتم‌ها اندازه‌ی ظرف رو **عوض نمی‌کنن**، چون فقط پیمایشگر دارن، نه خود ظرف.

\`std::remove_if\` عضوهایی که باید بمونن رو میاره اول بازه، و یه پیمایشگر به «آخر تازه» برمی‌گردونه.
عضوهای بعد از اون، مقدار نامشخصی دارن.
برای کم کردن واقعی اندازه، باید \`erase\` خود ظرف رو صدا بزنی:
\`v.erase(std::remove_if(v.begin(), v.end(), pred), v.end());\`

از ++C20 به بعد، \`std::erase_if(v, pred)\` همین کار رو تو یه خط انجام می‌ده.

:::show
\`\`\`anim
array 8
values 4 -2 7 4 -9 1 7 7
note | remove_if با شرط «منفی‌ها برن». دو تا نشونگر داریم: r می‌خونه، w جای نوشتن بعدی رو نشون می‌ده.
ptr r 0 | r: 4 منفی نیست، پس می‌مونه.
ptr w 0 | w هم اینجاست. 4 همون‌جای خودش می‌مونه، و w یه قدم جلو می‌ره.
ptr r 1 | منفی! رد می‌شه. r جلو می‌ره، ولی w همون‌جا می‌مونه.
ptr w 1 | w منتظره که یه عضو خوب پیدا بشه.
ptr r 2 | 7 خوبه…
set 1 7 | …پس تو جای w نوشته می‌شه.
ptr r 3 | 4 هم خوبه.
set 2 4 | تو جای بعدی w.
ptr r 4 | منفی. رد.
ptr r 5 | 1 خوبه.
set 3 1 | نوشته شد.
ptr r 6 | 7 خوبه.
set 4 7 | نوشته شد.
ptr r 7 | 7 آخر هم خوبه.
set 5 7 | نوشته شد. remove_if پیمایشگر «آخر تازه» رو برمی‌گردونه: خونه‌ی 6.
mark 6 7 | ولی دقت کن: اندازه‌ی vector هنوز 8 ـه! این دو تا خونه‌ی ته، آشغالن.
clear 6 | حالا erase(newEnd, v.end())…
clear 7 | …واقعاً پاکشون می‌کنه. اندازه شد 6.
done 0 1 2 3 4 5 | نتیجه: 4 7 4 1 7 7. هر عضو فقط یه بار خونده شد: O(n).
\`\`\`
:::

## نوشتن تو ظرف با \`back_inserter\`

الگوریتم‌هایی مثل \`copy\` و \`transform\` تو یه بازه‌ی **مقصد** می‌نویسن، و فرض می‌کنن اون بازه به اندازه‌ی کافی جا داره.
اگه مقصد یه \`vector\` خالی باشه، نوشتن تو \`v.begin()\` رفتار تعریف‌نشده‌ست.

راه‌حل، \`std::back_inserter(v)\` ـه: پیمایشگری که هر بار چیزی توش نوشته بشه، \`push_back\` رو صدا می‌زنه.
یعنی به‌جای «از خونه‌ی اول بنویس»، می‌گی «هر چی اومد، به ته جعبه اضافه کن».

## کی به کارت میاد، کی نه؟

| موقعیت | الگوریتم آماده؟ | چرا |
|---|---|---|
| مرتب کردن، شمردن، پیدا کردن، جمع زدن | بله | یه خط، بدون خطای مرز حلقه |
| فقط k تای بزرگ‌تر، یا میانه | بله: \`partial_sort\`، \`nth_element\` | از مرتب کردن کامل ارزون‌تره |
| جست‌وجوی مکرر تو داده‌ی ثابت | بله: یه بار \`sort\`، بعد \`lower_bound\` | \`O(lg n)\` برای هر جست‌وجو |
| حلقه‌ای که وسطش چند تا کار درهم و شرط خروج پیچیده داره | شاید نه | یه حلقه‌ی ساده و واضح، از زنجیره‌ی عجیب الگوریتم‌ها خواناتره |
| لامبدایی که ده خط شده | اسمش رو بذار | یه تابع با اسم درست، خواناتره |

## مثال ساده: کارنامه با الگوریتم‌ها (++C)

یه لیست دانشجو داریم. همه‌ی کارهای معمول رو یه کارنامه، یعنی مرتب کردن، پیدا کردن، شمردن و میانگین گرفتن، هر کدوم با یه خط:

\`\`\`cpp
#include <algorithm>
#include <iostream>
#include <numeric>
#include <string>
#include <vector>

struct Student { std::string name; double grade; };

int main() {
    std::vector<Student> cls = {
        {"Sara", 17.5}, {"Reza", 9.0}, {"Nima", 17.5}, {"Leila", 19.25}, {"Omid", 12.0}};

    std::stable_sort(cls.begin(), cls.end(),
                     [](const Student& a, const Student& b) { return a.grade > b.grade; });
    for (const auto& s : cls) std::cout << s.name << ' ';
    std::cout << '\\n';

    double passMark = 10;
    auto failed = std::find_if(cls.begin(), cls.end(),
                               [passMark](const Student& s) { return s.grade < passMark; });
    if (failed != cls.end()) std::cout << "first failing: " << failed->name << '\\n';

    auto honors = std::count_if(cls.begin(), cls.end(),
                                [](const Student& s) { return s.grade >= 17; });
    bool anyPerfect = std::any_of(cls.begin(), cls.end(),
                                  [](const Student& s) { return s.grade == 20; });
    std::cout << honors << " honors, perfect? " << std::boolalpha << anyPerfect << '\\n';

    double sum = std::accumulate(cls.begin(), cls.end(), 0.0,
                                 [](double acc, const Student& s) { return acc + s.grade; });
    std::cout << "average " << sum / cls.size() << '\\n';
}
\`\`\`

\`\`\`text
Leila Sara Nima Omid Reza
first failing: Reza
3 honors, perfect? false
average 15.05
\`\`\`

- \`Sara\` و \`Nima\` هر دو \`17.5\` دارن. چون از \`stable_sort\` استفاده کردیم، به همون ترتیب ورودی موندن.
- لامبدای \`find_if\` مقدار \`passMark\` رو با مقدار گرفت.
- مقدار اولیه‌ی \`accumulate\`، یعنی \`0.0\`، نوع جمع رو تعیین می‌کنه. اگه \`0\` می‌نوشتیم، جمع به‌صورت \`int\` انجام می‌شد و اعشارها گم می‌شدن.

## مثال متوسط

### حذف، تبدیل و گرفتن با ارجاع (++C)

\`\`\`cpp
#include <algorithm>
#include <iostream>
#include <iterator>
#include <vector>

void print(const std::vector<int>& v) {
    for (int x : v) std::cout << x << ' ';
    std::cout << '\\n';
}

int main() {
    std::vector<int> v{4, -2, 7, 4, -9, 1, 7, 7};

    auto newEnd = std::remove_if(v.begin(), v.end(), [](int x) { return x < 0; });
    std::cout << v.size() << ' ';                     // هنوز ۸ تا عضو داره
    v.erase(newEnd, v.end());                         // حالا واقعاً حذف می‌شن
    std::cout << v.size() << '\\n';
    print(v);

    std::sort(v.begin(), v.end());
    v.erase(std::unique(v.begin(), v.end()), v.end());   // unique فقط تکراری‌های کنار هم رو می‌گیره
    print(v);

    std::vector<int> squares;
    std::transform(v.begin(), v.end(), std::back_inserter(squares), [](int x) { return x * x; });
    print(squares);

    int calls = 0;
    auto byValue = [calls]() { return calls + 1; };  // عکسی از calls = 0
    auto byRef = [&calls]() { return ++calls; };      // خود calls
    byRef();
    byRef();
    std::cout << calls << ' ' << byValue() << '\\n';
}
\`\`\`

\`\`\`text
8 6
4 7 4 1 7 7
1 4 7
1 16 49
2 1
\`\`\`

- بعد از \`remove_if\`، اندازه‌ی بردار هنوز ۸ بود. فقط \`erase\` اون رو به ۶ رسوند (همون انیمیشن بالا).
- \`unique\` فقط تکراری‌های **کنار هم** رو حذف می‌کنه. برای همین اول مرتب کردیم.
- \`byRef\` دو بار خود \`calls\` رو زیاد کرد، ولی \`byValue\` هنوز عکسی رو داره که وقتی \`calls\` صفر بود گرفته شده بود.

### جست‌وجو تو بازه‌ی مرتب و شیء تابع (++C)

\`\`\`cpp
#include <algorithm>
#include <cstdlib>
#include <iostream>
#include <iterator>
#include <vector>

class CloserTo {                                   // شیء تابع: operator() داره
public:
    explicit CloserTo(int t) : target{t} {}
    bool operator()(int a, int b) const { return std::abs(a - target) < std::abs(b - target); }
private:
    int target;
};

int main() {
    std::vector<int> booked{9, 10, 13, 15, 16};    // باید مرتب باشه
    std::cout << std::boolalpha << std::binary_search(booked.begin(), booked.end(), 13) << ' '
              << std::binary_search(booked.begin(), booked.end(), 14) << '\\n';

    auto pos = std::lower_bound(booked.begin(), booked.end(), 14);   // اولین ≥ 14
    std::cout << *pos << " at index " << (pos - booked.begin()) << '\\n';

    std::vector<int> saraFree{9, 11, 12, 14, 16}, rezaFree{10, 11, 14, 15, 16};
    std::vector<int> both;
    std::set_intersection(saraFree.begin(), saraFree.end(), rezaFree.begin(), rezaFree.end(),
                          std::back_inserter(both));
    for (int h : both) std::cout << h << ' ';
    std::cout << '\\n';

    auto nearest = std::min_element(booked.begin(), booked.end(), CloserTo{12});
    auto [lo, hi] = std::minmax_element(booked.begin(), booked.end());
    std::cout << *nearest << ' ' << *lo << ' ' << *hi << '\\n';
}
\`\`\`

\`\`\`text
true false
15 at index 3
11 14 16
13 9 16
\`\`\`

- \`binary_search\` فقط می‌گه «هست یا نیست». \`lower_bound\` جایی رو می‌ده که مقدار باید درج بشه تا ترتیب حفظ بشه. هر دو \`O(lg n)\` ـن، ولی **فقط** رو بازه‌ی مرتب درست کار می‌کنن.
- ساعت‌هایی که سارا و رضا هر دو آزادن: \`11 14 16\`.
- \`CloserTo{12}\` یه شیئه که مثل تابع صدا زده می‌شه و هدفش رو به‌عنوان عضو داده نگه داشته. همون کاری که یه لامبدا با \`[target]\` انجام می‌ده.

## مثال پیشرفته: گزارش فروش یه فروشگاه آنلاین (++C)

مدیر فروش یه گزارش می‌خواد. سفارش‌های لغوشده رو کنار بذار، کل فروش، سه تا سفارش بزرگ، سفارش میانه، فروش هر شهر، و یه چک ساده.
هر سؤال، یه الگوریتم:

\`\`\`cpp
#include <algorithm>
#include <iostream>
#include <iterator>
#include <numeric>
#include <string>
#include <vector>

struct Order { int id; std::string city; int amount; bool cancelled; };

int main() {
    std::vector<Order> orders{
        {101, "Tabriz", 320, false}, {102, "Shiraz", 90, true},   {103, "Tabriz", 45, false},
        {104, "Yazd", 610, false},   {105, "Shiraz", 150, false}, {106, "Yazd", 75, false},
        {107, "Tabriz", 980, true},  {108, "Shiraz", 400, false}, {109, "Yazd", 230, false}};

    // ۱. لغوشده‌ها رو واقعاً حذف کن: remove_if + erase
    orders.erase(std::remove_if(orders.begin(), orders.end(),
                                [](const Order& o) { return o.cancelled; }),
                 orders.end());
    std::cout << orders.size() << " valid orders\\n";

    // ۲. کل فروش
    long total = std::accumulate(orders.begin(), orders.end(), 0L,
                                 [](long acc, const Order& o) { return acc + o.amount; });
    std::cout << "revenue " << total << '\\n';

    // ۳. سه تا سفارش بزرگ، بدون مرتب کردن همه
    std::vector<Order> top = orders;
    std::partial_sort(top.begin(), top.begin() + 3, top.end(),
                      [](const Order& a, const Order& b) { return a.amount > b.amount; });
    std::cout << "top 3:";
    for (auto it = top.begin(); it != top.begin() + 3; ++it) std::cout << ' ' << it->id << '(' << it->amount << ')';
    std::cout << '\\n';

    // ۴. سفارش میانه: nth_element فقط عضو وسط رو سر جاش می‌ذاره، تو O(n)
    std::vector<int> amounts;
    std::transform(orders.begin(), orders.end(), std::back_inserter(amounts),
                   [](const Order& o) { return o.amount; });
    auto mid = amounts.begin() + amounts.size() / 2;
    std::nth_element(amounts.begin(), mid, amounts.end());
    std::cout << "median " << *mid << '\\n';

    // ۵. فروش هر شهر: بر اساس شهر مرتب کن، بعد گروه‌ها رو با upper_bound جدا کن
    auto byCity = [](const Order& a, const Order& b) { return a.city < b.city; };
    std::sort(orders.begin(), orders.end(), byCity);
    for (auto first = orders.begin(); first != orders.end();) {
        auto last = std::upper_bound(first, orders.end(), *first, byCity);
        long sum = std::accumulate(first, last, 0L,
                                   [](long acc, const Order& o) { return acc + o.amount; });
        std::cout << first->city << ": " << (last - first) << " orders, " << sum << '\\n';
        first = last;
    }

    // ۶. یه چک سریع
    int bigLimit = 500;
    bool allSmall = std::all_of(orders.begin(), orders.end(),
                                [bigLimit](const Order& o) { return o.amount <= bigLimit; });
    std::cout << std::boolalpha << "all under " << bigLimit << "? " << allSmall << '\\n';
}
\`\`\`

\`\`\`text
7 valid orders
revenue 1830
top 3: 104(610) 108(400) 101(320)
median 230
Shiraz: 2 orders, 550
Tabriz: 2 orders, 365
Yazd: 3 orders, 915
all under 500? false
\`\`\`

جواب‌ها رو بخون:

- **۷ سفارش معتبر:** دو تا سفارش لغوشده (۱۰۲ و ۱۰۷) واقعاً از بردار بیرون رفتن. سفارش ۱۰۷ (۹۸۰) بزرگ‌ترین بود، و اگه حذف نمی‌شد، همه‌ی گزارش رو خراب می‌کرد.
- **سه تا بزرگ:** \`partial_sort\` فقط سه تای اول رو مرتب کرد و بقیه رو به حال خودشون گذاشت. با یه میلیون سفارش، این خیلی ارزون‌تر از \`sort\` کامله.
- **میانه ۲۳۰:** \`nth_element\` فقط عضو وسط رو سر جاش گذاشت (همون [انتخاب](/algorithm-design/linear-sorting-and-selection) که تو طراحی الگوریتم دیدیم).
- **فروش هر شهر:** بعد از مرتب کردن، سفارش‌های هر شهر کنار هم افتادن. \`upper_bound\` آخر هر گروه رو با جست‌وجوی دودویی پیدا کرد.
- **چک آخر:** سفارش ۱۰۴ (۶۱۰) از ۵۰۰ بیشتره، پس \`false\`.

هیچ‌جای این برنامه یه حلقه‌ی دستی با اندیس \`i\` و خطر «یکی کم یا زیاد» نیست.

## نگاه یه مهندس ارشد

- **اسم الگوریتم، مستند کده.** \`std::any_of(…)\` رو هر کسی تو یه نگاه می‌فهمه. یه حلقه‌ی \`for\` با یه \`bool found\` و \`break\` رو باید خط به خط خوند.
- **کار کمتر از «مرتب کن همه رو» بخواه.** اگه فقط k تای اول یا میانه رو می‌خوای، \`partial_sort\` یا \`nth_element\`. اگه فقط بزرگ‌ترین رو، \`max_element\`.
- **با ارجاع گرفتن، یعنی وعده‌ی عمر.** لامبدایی که از تابع برمی‌گرده، یا تو یه thread دیگه اجرا می‌شه، نباید متغیرهای محلی رو با \`&\` بگیره.
- **لامبدای بلند، اسم لازم داره.** اگه یه لامبدا از سه چهار خط بیشتر شد، یه تابع با اسم درست بساز.

## اشتباه‌های رایج

:::mistakes
- **\`remove\` بدون \`erase\`:** اندازه‌ی ظرف عوض نمی‌شه، و عضوهای «حذف‌شده» هنوز ته ظرفن.
- **\`unique\` رو داده‌ی نامرتب:** فقط تکراری‌های کنار هم حذف می‌شن. اول مرتب کن.
- **\`binary_search\` یا \`lower_bound\` رو داده‌ی نامرتب:** جواب بی‌معنی می‌ده، بدون هیچ خطایی.
- **نوشتن تو \`vector\` خالی با \`copy\`/\`transform\`:** مقصد جا نداره. از \`back_inserter\` استفاده کن، یا قبلش \`resize\` کن.
- **\`accumulate\` با مقدار اولیه‌ی \`0\` برای \`double\`:** جمع به‌صورت \`int\` انجام می‌شه و بخش اعشاری گم می‌شه. بنویس \`0.0\`.
- **گرفتن با ارجاع و استفاده بعد از پایان حوزه:** اگه لامبدایی که \`[&x]\` گرفته، بعد از نابود شدن \`x\` اجرا بشه، به حافظه‌ی آزادشده دست می‌زنه.
- **مقایسه‌گر غیرسخت‌گیرانه تو \`sort\`:** مقایسه‌گر باید «اکیداً کمتر» باشه. \`return a.grade >= b.grade;\` شرط‌های لازم رو نقض می‌کنه و رفتار تعریف‌نشده‌ست.
:::

## خلاصه

:::takeaways[چیزهایی که باید یادت بمونه]
- الگوریتم‌ها رو بازه‌های پیمایشگری کار می‌کنن و ظرف رو نمی‌شناسن. اندازه‌ی ظرف رو هم عوض نمی‌کنن.
- لامبدا: \`[capture](params) { body }\`. گرفتن با مقدار یه کپیه (عکس)، و گرفتن با ارجاع خود متغیر (آدرس).
- شیء تابع یه کلاس با \`operator()\` ـه. لامبدا پشت صحنه همینه.
- حذف واقعی: \`v.erase(std::remove_if(…), v.end())\`. \`unique\` فقط تکراری‌های کنار هم رو حذف می‌کنه.
- برای نوشتن تو ظرف خالی، \`std::back_inserter\`. جست‌وجوی دودویی و عمل‌های مجموعه‌ای فقط رو بازه‌ی مرتب.
- کار کمتری بخواه: \`partial_sort\`، \`nth_element\` و \`max_element\` از \`sort\` کامل ارزون‌ترن.
:::

## این مبحث کجای نقشه‌ست؟

\`\`\`mermaid
flowchart LR
  C["ظرف‌ها و پیمایشگرها"] --> A["الگوریتم‌های STL و لامبدا"]
  S["مرتب‌سازی و انتخاب (طراحی الگوریتم)"] --> A
  A --> E["مدیریت استثنا"]
  A --> T["قالب‌ها: الگوریتم‌ها قالب‌های تابعن"]
\`\`\`

مبحث بعدی [مدیریت استثنا](/advanced-programming/exception-handling) ـه.

## تمرین

اول خودت جواب بده، بعد جواب رو باز کن.

::::exercise
**تمرین ۱.** با یه الگوریتم و یه لامبدا، تعداد کلمه‌های بیشتر از ۴ حرفی رو تو \`std::vector<std::string> words\` بشمر.

:::answer
\`\`\`c++
auto longWords = std::count_if(words.begin(), words.end(),
                               [](const std::string& w) { return w.size() > 4; });
\`\`\`
پارامتر رو \`const std::string&\` گرفتیم تا هر کلمه کپی نشه.
:::
::::

::::exercise
**تمرین ۲.** خروجی این کد چیه؟

\`\`\`c++
std::vector<int> v{3, 3, 1, 1, 3};
v.erase(std::unique(v.begin(), v.end()), v.end());
for (int x : v) std::cout << x << ' ';
\`\`\`

:::answer
\`3 1 3\`. \`unique\` فقط تکراری‌های **پشت سر هم** رو یکی می‌کنه: دو تا \`3\` اول یکی می‌شن، دو تا \`1\` یکی می‌شن، و \`3\` آخر جداست.
برای گرفتن مقدارهای یکتا، اول مرتب کن: نتیجه‌ش \`1 3\` می‌شه.
:::
::::

::::exercise
**تمرین ۳.** یه لامبدا \`threshold\` رو با ارجاع می‌گیره. اگه بعد از ساختن لامبدا و قبل از صدا زدنش، \`threshold\` رو عوض کنیم، چی می‌شه؟ اگه با مقدار گرفته باشه چطور؟

:::answer
با ارجاع، لامبدا مقدار **تازه** رو می‌بینه، چون به خود متغیر دسترسی داره (آدرس مغازه).
با مقدار، لامبدا همون مقداری رو می‌بینه که **موقع ساخته شدنش** گرفته بود، و تغییرهای بعدی روش اثری ندارن (عکس).
انتخاب بین این دو، یعنی انتخاب بین «همیشه به‌روز» و «عکس ثابت».
:::
::::

::::exercise
**تمرین ۴ (فکر کن، حفظ نکن).** یه سرویس هر شب ۱۰ میلیون رکورد زمان پاسخ داره، و فقط سه تا عدد می‌خواد: میانه، صدک ۹۹ (عددی که ۹۹٪ زیرش هستن) و بیشترین. یه همکار نوشته \`std::sort\` و بعد سه تا خونه رو خونده. کار درسته، ولی می‌شه ارزون‌تر انجامش داد؟ چطور؟

:::answer
\`sort\` کامل \`O(n lg n)\` ـه، ولی ما ترتیب همه‌ی ۱۰ میلیون عدد رو لازم نداریم.

- **بیشترین:** \`std::max_element\`، یه دور: \`O(n)\`.
- **صدک ۹۹:** \`std::nth_element(v.begin(), v.begin() + k, v.end())\` با \`k = 0.99 * n\`. بعدش عضو \`k\` سر جای درستشه، همه‌ی کوچیک‌ترها قبلش و بزرگ‌ترها بعدش: میانگین \`O(n)\`.
- **میانه:** چون بعد از قدم قبل همه‌ی عضوهای قبل از \`k\` کوچیک‌ترن، می‌تونی \`nth_element\` رو فقط رو بازه‌ی \`[begin, begin + k)\` اجرا کنی، که از قبل کوچیک‌تره.

نتیجه یکیه، ولی کار به‌جای \`n lg n\`، تقریباً چند تا \`n\` ـه. با ۱۰ میلیون عدد، این فرق محسوسه.
درس: اول بپرس «دقیقاً چی لازم دارم؟». الگوریتمی رو انتخاب کن که همون رو بده، نه بیشتر.
:::
::::
`;export{e as default};