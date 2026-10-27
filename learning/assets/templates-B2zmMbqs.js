var e=`## یه بار بنویس، برای هر نوعی استفاده کن

فرض کن یه تابع نوشتی که بزرگ‌تر دو تا \`int\` رو برمی‌گردونه. حالا همین رو برای \`double\` لازم داری، بعد برای \`std::string\`، و بعد برای کلاس \`Fraction\` خودت.
کد هر بار دقیقاً یکیه. فقط نوع فرق می‌کنه.

**template** (قالب) اجازه می‌ده کد رو یه بار با یه **پارامتر نوع**، مثلاً \`T\`، بنویسی، و کامپایلر برای هر نوعی که لازم شد، نسخه‌ی مخصوص اون رو خودکار بسازه.
به این می‌گن **generic programming** (برنامه‌نویسی عمومی).

همه‌ی ظرف‌ها و الگوریتم‌های STL که تو دو مبحث قبل دیدیم، قالبن: \`std::vector<T>\`، \`std::map<K, V>\` و \`std::sort\`.
تو این مبحث یاد می‌گیریم **قالب‌های خودمون** رو بنویسیم:

- **قالب تابع** برای عمل‌های کلی.
- **قالب کلاس** برای ساختمان داده‌های کلی.

آخرش هم ساختمان داده‌های درس ساختمان داده رو برای **هر** نوعی قابل استفاده می‌کنیم.

:::show
**یه مثال روزمره: قالب شیرینی‌پزی.**

یه قالب شیرینی ستاره‌ای داری. شکل قالب ثابته، ولی می‌تونی توش خمیر شکلاتی، وانیلی یا زعفرونی بریزی.
هر بار یه شیرینی با **همون شکل** ولی **مزه‌ی متفاوت** بیرون میاد.

- **قالب ++C** همون قالب شیرینیه: شکل کد ثابته.
- **نوع** (\`int\`، \`string\`، \`Fraction\`) همون مزه‌ی خمیره، که تو انتخاب می‌کنی.
- **کامپایلر** شیرینی‌پزه: برای هر مزه‌ای که سفارش دادی، یه شیرینی جدا می‌پزه. برای مزه‌ای که سفارش ندادی، هیچی نمی‌پزه.

و یه نکته: اگه خمیرت مناسب قالب نباشه (مثلاً آبکی باشه و شکل نگیره)، شیرینی‌پز موقع پختن متوجه می‌شه، نه موقع خریدن قالب. قالب ++C هم دقیقاً همین‌طوره.
:::

## قالب تابع

\`template <typename T> T maxOf(T a, T b) { return a < b ? b : a; }\` یه **قالب تابع** ـه.

- وقتی می‌نویسی \`maxOf(3, 7)\`، کامپایلر از روی نوع آرگومان‌ها **deduce** (استنتاج) می‌کنه که \`T = int\` ـه، و یه نسخه برای \`int\` می‌سازه. به این می‌گن **instantiation** (نمونه‌سازی).
- اگه دو تا آرگومان نوع‌های متفاوتی داشته باشن، مثل \`maxOf(3, 7.5)\`، استنتاج شکست می‌خوره. می‌شه نوع رو صریح نوشت: \`maxOf<double>(3, 7.5)\`.
- به‌جای \`typename\` می‌شه \`class\` هم نوشت. هر دو یکی‌ان.

:::show
\`\`\`anim
messages main.cpp compiler
send main.cpp compiler maxOf(3, 7) | کد ما maxOf رو با دو تا int صدا زد.
self compiler T = int | کامپایلر از روی آرگومان‌ها نتیجه می‌گیره: T باید int باشه.
self compiler build maxOf<int> | یه نسخه‌ی کامل از تابع، مخصوص int، می‌سازه.
send main.cpp compiler maxOf(2.5, 1.0) | حالا با دو تا double.
self compiler build maxOf<double> | یه نسخه‌ی دوم، جدا از اولی.
send main.cpp compiler maxOf(8, 2) | دوباره با int.
self compiler reuse maxOf<int> | نسخه‌ی int از قبل ساخته شده. دوباره نمی‌سازه.
send main.cpp compiler maxOf(3, 7.5) | این بار یه int و یه double.
lost compiler main.cpp T = int or double? | T نمی‌تونه همزمان دو تا نوع باشه، پس خطای کامپایل می‌گیریم. راه‌حل اینه که نوع رو صریح بنویسیم.
\`\`\`
:::

## قالب از نوع چی انتظار داره؟

قالب \`maxOf\` فقط از عملگر \`<\` رو \`T\` استفاده می‌کنه.
پس با هر نوعی که \`<\` داشته باشه کار می‌کنه: \`int\`، \`double\`، \`std::string\`، و هر کلاسی که \`operator<\` رو سربارگذاری کرده باشه.

اگه \`T\` این عملگر رو نداشته باشه، خطای کامپایل **موقع نمونه‌سازی** پیش میاد.
پیام این خطاها گاهی طولانی و گیج‌کننده‌ست.
++C20 **concepts** (مفهوم‌ها) رو اضافه کرد تا این انتظارها رو صریح بنویسیم (\`template <std::totally_ordered T>\`) و پیام خطا روشن بشه.

## چرا قالب‌ها تو سرآیند نوشته می‌شن؟

قالب خودش کد ماشین نیست. یه **دستور پخت** برای ساختن کده.
کامپایلر برای ساختن \`Stack<int>\`، باید **بدنه‌ی کامل** قالب رو تو همون فایلی ببینه که \`Stack<int>\` توش استفاده شده.

برای همین، برخلاف کلاس‌های معمولی که رابط رو تو \`.h\` و پیاده‌سازی رو تو \`.cpp\` می‌نوشتیم، کل قالب، با بدنه‌ی تابع‌های عضوش، معمولاً تو **فایل سرآیند** قرار می‌گیره.
اگه بدنه رو تو یه \`.cpp\` جدا بذاری، معمولاً موقع پیوند خطای «تعریف‌نشده» می‌گیری.

## قالب کلاس

\`template <typename T> class Stack { … };\` یه **قالب کلاس** ـه.

- استفاده‌کننده نوع رو صریح می‌نویسه: \`Stack<int>\` یا \`Stack<std::string>\`. (از ++C17، تو بعضی حالت‌ها می‌شه از روی آرگومان‌های سازنده هم استنتاج کرد.)
- هر نمونه، یه کلاس **کاملاً جدا** ـه: \`Stack<int>\` و \`Stack<double>\` هیچ ربطی به هم ندارن.
- اگه یه تابع عضو رو بیرون از کلاس تعریف کنی، باید سرآیند قالب رو تکرار کنی: \`template <typename T> void Stack<T>::push(const T& x) { … }\`.

## پارامترهای غیرنوعی و پیش‌فرض

پارامتر قالب لازم نیست نوع باشه. می‌تونه یه **مقدار ثابت زمان کامپایل** باشه، مثل اندازه: \`template <typename T, std::size_t N> class RingBuffer\`.
\`std::array<int, 5>\` دقیقاً همین‌طور کار می‌کنه.

چون \`N\` موقع کامپایل معلومه، آرایه‌ی داخلی می‌تونه اندازه‌ی ثابت داشته باشه و حافظه‌ی پویا لازم نیست.
پارامترهای قالب می‌تونن **مقدار پیش‌فرض** هم داشته باشن: \`template <typename T = int, std::size_t N = 8>\`.

## تخصیص صریح

گاهی قالب برای یه نوع خاص باید رفتار متفاوتی داشته باشه.
**explicit specialization** (تخصیص صریح) یه نسخه‌ی جدا برای همون نوع می‌نویسه:
\`template <> std::string describe<bool>(bool b) { return b ? "yes" : "no"; }\`

وقتی قالب با \`bool\` نمونه‌سازی بشه، این نسخه استفاده می‌شه، و برای بقیه‌ی نوع‌ها، نسخه‌ی عمومی.
برای تابع‌ها، یه **سربارگذاری معمولی** معمولاً ساده‌تر و قابل‌پیش‌بینی‌تر از تخصیصه.

## کی به کارت میاد، کی نه؟

| موقعیت | قالب؟ | چرا |
|---|---|---|
| یه ظرف یا ساختمان داده که باید هر نوعی رو نگه داره | بله | یه بار نوشتن، بدون کپی کردن کد |
| یه الگوریتم که فقط چند تا عمل (\`<\`، \`+\`) از نوع لازم داره | بله | با هر نوعی که اون عمل‌ها رو داره کار می‌کنه |
| اندازه‌ای که موقع کامپایل معلومه | بله: پارامتر غیرنوعی | بدون حافظه‌ی پویا |
| فقط برای یه یا دو نوع، و تا ابد همین‌طوره | معمولاً نه | دو تا تابع ساده، خواناتر و کامپایلش سریع‌تره |
| رفتار باید **موقع اجرا** بین چند نوع عوض بشه | نه، چندریختی | قالب نوع رو موقع کامپایل انتخاب می‌کنه، نه موقع اجرا |

## مثال ساده: قالب‌های تابع (++C)

\`maxOf\` با \`int\`، \`double\`، \`std::string\` و یه \`Fraction\` ساده کار می‌کنه. \`printAll\` با هر ظرفی که حلقه‌ی \`for\` بُردی داشته باشه کار می‌کنه. \`describe\` یه تخصیص صریح برای \`bool\` داره.

\`\`\`cpp
#include <iostream>
#include <list>
#include <string>
#include <vector>

template <typename T>
T maxOf(T a, T b) {
    return a < b ? b : a;                    // فقط < رو از T می‌خواد
}

template <typename Container>
void printAll(const Container& c) {
    for (const auto& x : c) std::cout << x << ' ';
    std::cout << '\\n';
}

template <typename T>
std::string describe(T value) { return "value " + std::to_string(value); }

template <>
std::string describe<bool>(bool value) { return value ? "yes" : "no"; }   // تخصیص صریح

struct Fraction {
    int num, den;
    bool operator<(const Fraction& o) const { return num * o.den < o.num * den; }
};

int main() {
    std::cout << maxOf(3, 7) << ' ' << maxOf(2.5, -1.0) << '\\n';
    std::cout << maxOf(std::string("pear"), std::string("apple")) << '\\n';
    std::cout << maxOf<double>(3, 7.5) << '\\n';

    Fraction a{2, 3}, b{3, 4};
    Fraction m = maxOf(a, b);
    std::cout << m.num << '/' << m.den << '\\n';

    printAll(std::vector<int>{1, 2, 3});
    printAll(std::list<std::string>{"x", "y"});

    std::cout << describe(42) << " | " << describe(true) << '\\n';
}
\`\`\`

\`\`\`text
7 2.5
pear
7.5
3/4
1 2 3
x y
value 42 | yes
\`\`\`

- کامپایلر چهار تا نسخه از \`maxOf\` ساخت: برای \`int\`، \`double\`، \`std::string\` و \`Fraction\`.
- \`maxOf(3, 7.5)\` بدون \`<double>\` کامپایل نمی‌شد (همون انیمیشن بالا).
- \`"pear"\` بزرگ‌تره، چون رشته‌ها به ترتیب الفبا مقایسه می‌شن.
- \`describe(true)\` نسخه‌ی تخصیص‌یافته رو اجرا کرد.

## مثال متوسط

### پشته‌ی قالبی و بافر حلقوی با اندازه‌ی ثابت (++C)

\`Stack<T>\` یه پشته‌ی کلیه که داده‌ها رو تو یه \`std::vector<T>\` نگه می‌داره. یکی از تابع‌هاش بیرون از کلاس تعریف شده تا شکل نوشتنش رو ببینیم.
\`RingBuffer<T, N>\` همون [صف حلقوی](/data-structures/stacks-and-queues) درس ساختمان داده‌ست، با اندازه‌ای که پارامتر قالبه.

\`\`\`cpp
#include <array>
#include <cstddef>
#include <iostream>
#include <stdexcept>
#include <string>
#include <vector>

template <typename T>
class Stack {
public:
    void push(const T& x) { items.push_back(x); }
    T pop();                                     // بیرون از کلاس تعریف می‌شه
    bool empty() const { return items.empty(); }
    std::size_t size() const { return items.size(); }
private:
    std::vector<T> items;
};

template <typename T>                            // سرآیند قالب تکرار می‌شه
T Stack<T>::pop() {
    if (items.empty()) throw std::out_of_range{"pop from empty stack"};
    T top = items.back();
    items.pop_back();
    return top;
}

template <typename T, std::size_t N>
class RingBuffer {                               // صف حلقوی با N خونه
public:
    bool push(const T& x) {
        if (count == N) return false;            // پره
        data[(head + count) % N] = x;
        ++count;
        return true;
    }
    T pop() {
        T x = data[head];
        head = (head + 1) % N;
        --count;
        return x;
    }
    std::size_t size() const { return count; }
private:
    std::array<T, N> data{};                     // اندازه موقع کامپایل
    std::size_t head{0}, count{0};
};

int main() {
    Stack<std::string> undo;
    undo.push("type A");
    undo.push("type B");
    undo.push("delete");
    std::cout << undo.pop() << ", " << undo.pop() << ", left " << undo.size() << '\\n';

    Stack<int> numbers;
    try { numbers.pop(); }
    catch (const std::out_of_range& e) { std::cout << e.what() << '\\n'; }

    RingBuffer<int, 3> ring;
    for (int x : {10, 20, 30, 40}) std::cout << ring.push(x) << ' ';
    std::cout << '\\n';
    std::cout << ring.pop() << ' ';
    ring.push(40);                                                                      // دور می‌زنه
    while (ring.size() > 0) std::cout << ring.pop() << ' ';
    std::cout << '\\n';
    std::cout << sizeof(RingBuffer<int, 3>) << ' ' << sizeof(RingBuffer<int, 100>) << '\\n';
}
\`\`\`

\`\`\`text
delete, type B, left 1
pop from empty stack
1 1 1 0
10 20 30 40
32 416
\`\`\`

- \`Stack<std::string>\` و \`Stack<int>\` دو تا کلاس جدان، ولی هر دو از یه کد ساخته شدن.
- \`RingBuffer<int, 3>\` بعد از سه تا درج پر شد و چهارمی رو رد کرد. بعد از یه برداشت، \`40\` تو خونه‌ای که آزاد شده بود، با دور زدن، جا گرفت.
- خط آخر نشون می‌ده آرایه‌ی داخلی واقعاً **داخل** شیء ـه. رو این کامپایلر، یه \`RingBuffer<int, 3>\` ۳۲ بایته: ۱۲ بایت داده، ۴ بایت حاشیه برای هم‌ترازی، و دو تا شمارنده‌ی ۸ بایتی. با \`N = 100\`، ۴۱۶ بایت می‌شه. (اندازه‌ی دقیق به سیستم بستگی داره.)

### لیست پیوندی قالبی و صفی که ازش ساخته شده (++C)

همون [لیست پیوندی](/data-structures/linked-lists) درس ساختمان داده، این بار به شکل قالب. گره‌ها با \`std::unique_ptr\` به هم وصلن، پس حافظه خودکار آزاد می‌شه.
بعد یه \`Queue<T>\` رو با **ترکیب** از \`List<T>\` می‌سازیم.

\`\`\`cpp
#include <iostream>
#include <memory>
#include <stdexcept>
#include <string>
#include <utility>

template <typename T>
class List {
    struct Node {
        T value;
        std::unique_ptr<Node> next;
    };
public:
    void pushFront(const T& x) {
        head = std::unique_ptr<Node>(new Node{x, std::move(head)});
        if (!tail) tail = head.get();
        ++count;
    }
    void pushBack(const T& x) {
        auto node = std::unique_ptr<Node>(new Node{x, nullptr});
        Node* raw = node.get();
        if (tail) tail->next = std::move(node);
        else head = std::move(node);
        tail = raw;
        ++count;
    }
    T popFront() {
        if (!head) throw std::out_of_range{"empty list"};
        T x = std::move(head->value);
        head = std::move(head->next);            // گره‌ی قدیمی خودکار آزاد می‌شه
        if (!head) tail = nullptr;
        --count;
        return x;
    }
    template <typename F>
    void forEach(F action) const {               // قالب تابع عضو
        for (Node* n = head.get(); n; n = n->next.get()) action(n->value);
    }
    std::size_t size() const { return count; }
    bool empty() const { return count == 0; }
private:
    std::unique_ptr<Node> head;
    Node* tail = nullptr;                        // فقط نگاه می‌کنه، مالک نیست
    std::size_t count = 0;
};

template <typename T>
class Queue {                                    // ترکیب: صف یه لیست «داره»
public:
    void enqueue(const T& x) { items.pushBack(x); }
    T dequeue() { return items.popFront(); }
    bool empty() const { return items.empty(); }
private:
    List<T> items;
};

int main() {
    List<int> nums;
    nums.pushBack(2);
    nums.pushBack(3);
    nums.pushFront(1);
    nums.forEach([](int x) { std::cout << x << ' '; });
    std::cout << "| size " << nums.size() << '\\n';

    int sum = 0;
    nums.forEach([&sum](int x) { sum += x; });
    std::cout << "sum " << sum << '\\n';

    Queue<std::string> printer;
    for (const char* job : {"report.pdf", "photo.png", "notes.txt"}) printer.enqueue(job);
    while (!printer.empty()) std::cout << printer.dequeue() << ' ';
    std::cout << '\\n';
}
\`\`\`

\`\`\`text
1 2 3 | size 3
sum 6
report.pdf photo.png notes.txt
\`\`\`

- \`List<T>\` هیچ \`delete\`ی نداره: وقتی \`head\` عوض یا نابود می‌شه، \`unique_ptr\` گره‌ی قبلی رو آزاد می‌کنه.
- \`tail\` یه اشاره‌گر خامه، چون فقط **نگاه می‌کنه** و مالک نیست.
- \`forEach\` خودش یه قالبه و هر لامبدایی رو قبول می‌کنه.
- \`Queue<T>\` فقط سه خط کد داره، چون همه‌ی کار رو به \`List<T>\` سپرده.

## مثال پیشرفته: یه حافظه‌ی نهان (cache) عمومی (++C)

:::show
**یه مثال روزمره: میز کوچیک کتابخونه.**

رو میزت فقط جای **سه تا کتاب** هست. بقیه‌ی کتاب‌ها تو قفسه‌ی ته سالنن، و رفتن تا اونجا وقت می‌گیره.

- کتابی که لازم داری **رو میزه؟** عالی، فوری برش می‌داری. (hit)
- **رو میز نیست؟** باید بری تا قفسه بیاریش. (miss)
- میز **پره؟** کتابی رو برمی‌گردونی که **از همه دیرتر** بهش دست زدی. چون احتمالاً کمتر از بقیه لازمش داری.

به این سیاست می‌گن **LRU** (Least Recently Used، کم‌استفاده‌ترین اخیر).
برای پیاده‌سازیش دو تا ظرف لازمه: یه لیست به ترتیب «آخرین استفاده» (کتاب‌های رو میز، تازه‌ها جلو)، و یه جدول درهم‌سازی که بگه هر کتاب کجای اون لیسته. همون ترکیب دو ظرف که تو تمرین آخر [ظرف‌های STL](/advanced-programming/stl-containers) دیدیم.
:::

حالا این حافظه‌ی نهان رو **یه بار**، به شکل قالب، می‌نویسیم:

- \`Key\`: نوع کلید (عدد، اسم شهر، …).
- \`Value\`: نوع نتیجه.
- \`Capacity\`: اندازه، به‌عنوان پارامتر غیرنوعی.
- و یه قالب تابع عضو، \`get\`، که هر «تابع آوردن» (\`Loader\`) رو قبول می‌کنه: یه تابع معمولی یا یه لامبدا.

\`\`\`cpp
#include <cstddef>
#include <iostream>
#include <list>
#include <string>
#include <unordered_map>
#include <utility>

// یه حافظه‌ی نهان که Capacity تا از نتیجه‌هایی که اخیراً استفاده شدن رو یادش می‌مونه.
// یه بار نوشته شده، و برای هر نوع کلیدی که درهم‌سازی بشه و هر نوع مقداری کار می‌کنه.
template <typename Key, typename Value, std::size_t Capacity>
class LruCache {
public:
    // کلید رو پیدا کن. اگه نبود، با load(key) حسابش کن و یادت بمونه.
    template <typename Loader>
    const Value& get(const Key& key, Loader load) {
        auto found = where.find(key);
        if (found != where.end()) {
            ++hits;
            order.splice(order.begin(), order, found->second);   // ببرش جلو: همین الان استفاده شد
            return found->second->second;
        }
        ++misses;
        if (order.size() == Capacity) {                           // پره: قدیمی‌ترین رو فراموش کن
            where.erase(order.back().first);
            order.pop_back();
        }
        order.emplace_front(key, load(key));
        where[key] = order.begin();
        return order.front().second;
    }

    void report(const std::string& name) const {
        std::cout << name << ": " << hits << " hits, " << misses << " misses, now [";
        for (const auto& [k, v] : order) std::cout << ' ' << k;
        std::cout << " ]\\n";
    }

private:
    std::list<std::pair<Key, Value>> order;                       // تازه‌ترین جلو
    std::unordered_map<Key, typename std::list<std::pair<Key, Value>>::iterator> where;
    int hits = 0, misses = 0;
};

long slowSquare(int n) { return static_cast<long>(n) * n; }      // فرض کن این گرونه

int main() {
    LruCache<int, long, 3> squares;
    for (int n : {4, 7, 4, 9, 2, 4, 7}) std::cout << squares.get(n, slowSquare) << ' ';
    std::cout << '\\n';
    squares.report("squares");

    // همون قالب، نوع‌های دیگه: اسم شهر -> متن وضع هوا
    int calls = 0;
    auto fetchWeather = [&calls](const std::string& city) {
        ++calls;
        return city + ": " + std::to_string(15 + static_cast<int>(city.size())) + "C";
    };
    LruCache<std::string, std::string, 2> weather;
    for (const char* c : {"Tabriz", "Yazd", "Tabriz", "Rasht", "Yazd"})
        std::cout << weather.get(c, fetchWeather) << " | ";
    std::cout << '\\n';
    weather.report("weather");
    std::cout << "real fetches: " << calls << '\\n';
}
\`\`\`

\`\`\`text
16 49 16 81 4 16 49
squares: 2 hits, 5 misses, now [ 7 4 2 ]
Tabriz: 21C | Yazd: 19C | Tabriz: 21C | Rasht: 20C | Yazd: 19C |
weather: 1 hits, 4 misses, now [ Yazd Rasht ]
real fetches: 4
\`\`\`

جواب‌ها رو بخون. برای \`squares\` با ظرفیت ۳، قدم به قدم:

| درخواست | نتیجه | رو میز (تازه‌ترین اول) |
|---|---|---|
| 4 | miss | 4 |
| 7 | miss | 7 4 |
| 4 | **hit** | 4 7 |
| 9 | miss | 9 4 7 |
| 2 | miss، میز پره: 7 که از همه دیرتر استفاده شده، می‌ره | 2 9 4 |
| 4 | **hit** | 4 2 9 |
| 7 | miss، این بار 9 می‌ره | 7 4 2 |

- **یه قالب، دو تا کلاس کاملاً متفاوت:** \`LruCache<int, long, 3>\` و \`LruCache<std::string, std::string, 2>\`. کامپایلر برای هر کدوم یه کلاس جدا ساخت.
- **\`Loader\` هر چیزی می‌تونه باشه که بشه صداش زد:** یه بار یه تابع معمولی (\`slowSquare\`)، یه بار یه لامبدا که با ارجاع \`calls\` رو گرفته.
- **آب و هوا:** \`Yazd\` آخر miss شد، چون وقتی \`Rasht\` اومد، میز دوتایی پر بود و \`Yazd\` قدیمی‌ترین بود. از ۵ تا درخواست، فقط ۴ تا واقعاً «رفتن تا قفسه» لازم داشت.
- **\`splice\`:** یه گره رو بدون کپی و بدون باطل کردن پیمایشگرها، از وسط لیست به جلو می‌بره. برای همین اینجا \`list\` انتخاب درستیه: پیمایشگرهایی که تو \`where\` ذخیره شدن، همیشه معتبر می‌مونن.
- **\`typename\` قبل از \`std::list<…>::iterator\`:** چون این اسم به \`Key\` و \`Value\` بستگی داره، کامپایلر خودش نمی‌دونه یه نوعه. باید بهش بگیم.

## نگاه یه مهندس ارشد

- **قالب رو از یه نسخه‌ی معمولی شروع کن.** اول کد رو برای \`int\` بنویس، تستش کن، بعد \`int\` رو با \`T\` عوض کن. پیدا کردن اشکال تو یه قالب، سخت‌تره.
- **انتظاراتت از \`T\` رو بنویس.** «\`Key\` باید درهم‌سازی بشه و \`==\` داشته باشه». تو ++C20 با concepts، وگرنه حداقل تو یه توضیح.
- **قالب، زمان کامپایل و اندازه‌ی برنامه رو بیشتر می‌کنه.** هر نمونه یه نسخه‌ی جدا از کده. صد تا نوع یعنی صد تا نسخه.
- **همه‌چی رو قالب نکن.** اگه فقط یه نوع هست، و تو آینده‌ی قابل پیش‌بینی هم همین می‌مونه، یه کلاس معمولی خواناتره.

## اشتباه‌های رایج

:::mistakes
- **گذاشتن بدنه‌ی قالب تو یه \`.cpp\` جدا:** کامپایلر جایی که قالب استفاده می‌شه، بدنه رو نمی‌بینه و نمی‌تونه نمونه‌سازیش کنه. کل قالب رو تو سرآیند بنویس.
- **فراموش کردن \`template <typename T>\` و \`Stack<T>::\`:** هر تابع عضوی که بیرون از قالب کلاس تعریف بشه، هر دو رو لازم داره.
- **آرگومان‌های با نوع متفاوت:** \`maxOf(3, 7.5)\` استنتاج رو خراب می‌کنه. یا نوع رو صریح بنویس، یا آرگومان‌ها رو هم‌نوع کن.
- **فرض‌های پنهان درباره‌ی \`T\`:** اگه قالب از \`<\`، \`<<\` یا سازنده‌ی پیش‌فرض استفاده کنه، هر نوعی که اون رو نداره، خطای کامپایل می‌ده.
- **انتظار ارتباط بین نمونه‌ها:** \`Stack<int>\` و \`Stack<long>\` دو تا کلاس کاملاً جدان. یه \`Stack<int>\` رو نمی‌شه به تابعی داد که \`Stack<long>&\` می‌خواد.
- **جا انداختن \`typename\` برای نوع‌های وابسته:** \`std::list<T>::iterator it;\` داخل قالب کامپایل نمی‌شه. بنویس \`typename std::list<T>::iterator it;\` (یا \`auto\`).
- **کپی کردن کلاسی که \`unique_ptr\` داره:** کلاسی مثل \`List\` به‌طور پیش‌فرض قابل کپی نیست. اگه کپی لازمه، سازنده‌ی کپی رو خودت بنویس.
:::

## خلاصه

:::takeaways[چیزهایی که باید یادت بمونه]
- قالب با یه پارامتر نوع (\`T\`) نوشته می‌شه، و کامپایلر برای هر نوعی که لازم بشه، یه نسخه می‌سازه (نمونه‌سازی).
- قالب تابع نوع رو از آرگومان‌ها استنتاج می‌کنه. قالب کلاس نوع رو صریح می‌گیره: \`Stack<int>\`.
- قالب‌ها، با بدنه‌ی کامل، تو سرآیند نوشته می‌شن.
- پارامتر غیرنوعی (مثل اندازه) موقع کامپایل معلومه. پارامترها می‌تونن مقدار پیش‌فرض داشته باشن.
- تخصیص صریح رفتار رو برای یه نوع خاص عوض می‌کنه.
- ساختمان داده‌های قالبی، مثل \`List<T>\` یا \`LruCache<K, V, N>\`، یه بار نوشته می‌شن و برای هر نوعی کار می‌کنن.
:::

## این مبحث کجای نقشه‌ست؟

\`\`\`mermaid
flowchart LR
  STL["ظرف‌ها و الگوریتم‌های STL"] --> T["قالب‌ها"]
  DS["ساختمان داده (لیست، پشته، صف)"] --> T
  T --> CMP["درس بعد: کامپایلر"]
\`\`\`

این آخرین مبحث درس برنامه‌نویسی پیشرفته‌ست. درس بعدی [کامپایلر](/compiler) ـه، که توش می‌بینیم کامپایلر خودش چطور کد ما، از جمله همین قالب‌ها، رو می‌خونه و می‌فهمه.

## تمرین

اول خودت جواب بده، بعد جواب رو باز کن.

::::exercise
**تمرین ۱.** یه قالب تابع به اسم \`countIf\` بنویس که یه ظرف و یه گزاره بگیره و تعداد عضوهایی رو برگردونه که گزاره براشون درسته.

:::answer
\`\`\`c++
template <typename Container, typename Pred>
std::size_t countIf(const Container& c, Pred pred) {
    std::size_t n = 0;
    for (const auto& x : c)
        if (pred(x)) ++n;
    return n;
}
// countIf(std::vector<int>{1, 4, 6, 7}, [](int x) { return x % 2 == 0; })  ==  2
\`\`\`
این همون کاریه که \`std::count_if\` انجام می‌ده، فقط با ظرف به‌جای بازه‌ی پیمایشگری.
:::
::::

::::exercise
**تمرین ۲.** چرا این کد کامپایل نمی‌شه؟

\`\`\`c++
struct Point { int x, y; };
Point a{1, 2}, b{3, 4};
Point p = maxOf(a, b);
\`\`\`

:::answer
\`maxOf\` از \`a < b\` استفاده می‌کنه، و \`Point\` عملگر \`<\` نداره. خطا موقع نمونه‌سازی \`maxOf<Point>\` پیش میاد.
راه‌حل: برای \`Point\` یه \`operator<\` تعریف کن (مثلاً بر اساس فاصله از مبدأ)، یا قالبی بنویس که یه مقایسه‌گر هم بگیره.
:::
::::

::::exercise
**تمرین ۳.** به \`Stack<T>\` تابعی به اسم \`peek\` اضافه کن که عضو بالایی رو بدون برداشتن برگردونه. یه نسخه‌ی \`const\` هم بنویس.

:::answer
\`\`\`c++
T& peek() {
    if (items.empty()) throw std::out_of_range{"peek on empty stack"};
    return items.back();
}
const T& peek() const {
    if (items.empty()) throw std::out_of_range{"peek on empty stack"};
    return items.back();
}
\`\`\`
نسخه‌ی اول اجازه می‌ده عضو بالایی رو عوض کنی (\`s.peek() = …\`). نسخه‌ی \`const\` رو پشته‌ی ثابت قابل استفاده‌ست و فقط اجازه‌ی خوندن می‌ده. همون الگوی دو نسخه‌ای \`operator[]\` تو [سربارگذاری عملگرها](/advanced-programming/operator-overloading).
:::
::::

::::exercise
**تمرین ۴ (فکر کن، حفظ نکن).** یه همکار می‌گه: «\`LruCache\` رو قالب نکن. یه کلاس معمولی با کلید \`std::string\` و مقدار \`std::string\` بنویس. هر چیزی رو می‌شه به رشته تبدیل کرد.» این ایده چه مشکل‌هایی داره؟ کی ممکنه حق با اون باشه؟

:::answer
مشکل‌ها:

- **هزینه:** برای کش کردن مربع یه عدد، هر بار باید عدد رو به رشته و برعکس تبدیل کنی. این تبدیل‌ها ممکنه از خود محاسبه گرون‌تر باشن!
- **از دست رفتن نوع:** کامپایلر دیگه نمی‌تونه کمکت کنه. اگه اشتباهی یه متن به‌جای عدد بذاری، فقط موقع اجرا (اگه شانس بیاری) متوجه می‌شی.
- **همه چی قابل تبدیل به رشته نیست،** یا حداقل نه به‌راحتی: یه تصویر، یه شیء با اشاره‌گر، یه ساختار بزرگ.

ولی گاهی حق با اونه: اگه برنامه فقط و فقط یه نوع کش داره (مثلاً همیشه آدرس صفحه به متن HTML)، و قرار هم نیست عوض بشه، یه کلاس معمولی ساده‌تره، سریع‌تر کامپایل می‌شه و پیام‌های خطاش خواناتره.

درس: قالب ابزار «یه بار نوشتن برای **چند** نوع» ـه. وقتی واقعاً چند نوع داری، بی‌رقیبه. وقتی فقط یکی داری، ممکنه پیچیدگی اضافه باشه.
:::
::::
`;export{e as default};