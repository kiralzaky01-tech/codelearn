
const MATERI_DATA = {
    HTML: `Basic|Elements|Attributes|Headings|Paragraphs|Styles|Formatting|Quotations|Comments|Colors|Links|Images|Favicon|Page Title|Tables|Lists|Block & Inline|Div|Classes|Id|Iframes|File Paths|Head|Layout|Responsive|Semantics|Entities|Symbols|Emojis|Forms|Form Attributes|Form Elements|Input Types|Input Attributes|Canvas|SVG|Video|Audio|Geolocation|Drag/Drop|Web Storage`.split("|"),

    CSS: `Syntax|Selectors|Colors|Backgrounds|Borders|Margins|Padding|Height/Width|Box Model|Outline|Text|Fonts|Icons|Links|Lists|Tables|Display|Max-width|Position|Z-index|Overflow|Float|Inline-block|Align|Combinators|Pseudo-class|Pseudo-elements|Opacity|Navigation Bar|Dropdowns|Forms|Counters|Units|Specificity|Math Functions|Rounded Corners|Shadows|Gradients|Transitions|Animations|Flexbox|CSS Grid|Media Queries`.split("|"),

    JavaScript: `Introduction|Output|Statements|Syntax|Comments|Variables|Let|Const|Operators|Arithmetic|Assignment|Data Types|Functions|Objects|Object Properties|Object Methods|Events|Strings|String Methods|Numbers|BigInt|Arrays|Array Methods|Array Sort|Array Iteration|Dates|Math|Random|Booleans|Comparisons|If Else|Switch|Loop For|Loop While|Break|Sets|Maps|Typeof|Type Conversion|Regular Expressions|Try Catch|Scope|Hoisting|Arrow Function|Classes|Modules|JSON|Promises|Async/Await|HTML DOM|Web APIs`.split("|"),

    Python: `Intro|Syntax|Comments|Variables|Data Types|Numbers|Casting|Strings|Booleans|Operators|Lists|Tuples|Sets|Dictionaries|If...Else|Match|While Loops|For Loops|Functions|Lambda|Arrays|Classes/Objects|Inheritance|Iterators|Polymorphism|Scope|Modules|Dates|Math|JSON|RegEx|Try...Except|User Input|String Formatting|File Handling`.split("|"),

    Java: `Intro|Syntax|Output|Comments|Variables|Data Types|Type Casting|Operators|Strings|Math|Booleans|If...Else|Switch|While Loop|For Loop|Break/Continue|Arrays|Methods|Method Parameters|Method Overloading|Scope|Recursion|OOP|Classes/Objects|Class Attributes|Class Methods|Constructors|Modifiers|Encapsulation|Packages/API|Inheritance|Polymorphism|Inner Classes|Abstraction|Interface|Enums|User Input|Date|ArrayList|LinkedList|HashMap|HashSet|Wrapper Classes|Exceptions|Threads|Lambda`.split("|"),

    "C++": `Intro|Syntax|Output|Comments|Variables|User Input|Data Types|Operators|Strings|Math|Booleans|Conditions If/Else|Switch|While Loop|For Loop|Break/Continue|Arrays|Structures|Enums|References|Pointers|Functions|Function Parameters|Function Overloading|Recursion|OOP|Classes/Objects|Class Methods|Constructors|Access Specifiers|Encapsulation|Inheritance|Polymorphism|Files|Exceptions|Date|Vectors|STL`.split("|")
};

const DESKRIPSI = {
    HTML: "HTML digunakan untuk membangun struktur dan konten halaman website.",
    CSS: "CSS digunakan untuk mengatur tampilan, warna, layout, dan desain website.",
    JavaScript: "JavaScript digunakan untuk menambahkan interaksi dan logika pada website.",
    Python: "Python adalah bahasa pemrograman dengan sintaks yang mudah dibaca.",
    Java: "Java merupakan bahasa pemrograman berorientasi objek.",
    "C++": "C++ merupakan bahasa pemrograman yang mendukung pemrograman prosedural dan berorientasi objek."
};

const CONTOH = {
    HTML: `<h1>Belajar HTML</h1>
<p>Ini adalah paragraf.</p>
<a href="https://example.com">Tautan</a>`,

    CSS: `body {
    font-family: Arial;
    background: #f0f0f0;
    color: #222;
}

h1 {
    color: royalblue;
}`,

    JavaScript: `const nama = "CodeLearn";
console.log("Halo " + nama);`,

    Python: `nama = "CodeLearn"
print("Halo", nama)`,

    Java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Halo CodeLearn");
    }
}`,

    "C++": `#include <iostream>
using namespace std;

int main() {
    cout << "Halo CodeLearn" << endl;
    return 0;
}`
};

function buatContoh(bahasa, topik) {
    const dasar = CONTOH[bahasa];

    if (bahasa === "HTML") {
        return `<h1>${topik}</h1>
<p>Contoh penerapan ${topik} pada HTML.</p>
<button>Contoh Button</button>`;
    }

    if (bahasa === "CSS") {
        return `/* Materi ${topik} */

body {
    font-family: Arial, sans-serif;
}

.kartu {
    padding: 20px;
    border-radius: 12px;
    background: #f1f1f1;
}

/* Pelajari dan ubah style ini */`;
    }

    if (bahasa === "JavaScript") {
        return `// Materi ${topik}

const nama = "CodeLearn";

console.log(nama);

// Coba ubah kode ini`;
    }

    if (bahasa === "Python") {
        return `# Materi ${topik}

nama = "CodeLearn"

print(nama)

# Coba ubah kode ini`;
    }

    if (bahasa === "Java") {
        return `// Materi ${topik}

public class Main {
    public static void main(String[] args) {
        System.out.println("CodeLearn");
    }
}`;
    }

    if (bahasa === "C++") {
        return `// Materi ${topik}

#include <iostream>
using namespace std;

int main() {
    cout << "CodeLearn" << endl;
    return 0;
}`;
    }

    return dasar;
}
