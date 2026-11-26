
const LANGUAGES = ["HTML", "CSS", "JavaScript", "Python", "Java", "C++"];

let currentLanguage = "Python";
let currentTopic = "Intro";
let isRunning = false;

const homePage = document.getElementById("homePage");
const learningPage = document.getElementById("learningPage");
const sidebar = document.getElementById("sidebar");
const topicList = document.getElementById("topicList");
const codeEditor = document.getElementById("codeEditor");
const output = document.getElementById("output");
const preview = document.getElementById("preview");
const tutorPanel = document.getElementById("tutorPanel");
const tutorBackdrop = document.getElementById("tutorBackdrop");
const chatMessages = document.getElementById("chatMessages");

function getElement(id) {
    const element = document.getElementById(id);

    if (!element) {
        console.error(`Elemen dengan ID "${id}" tidak ditemukan.`);
    }

    return element;
}

function toast(message) {
    const el = getElement("toast");

    if (!el) return;

    el.textContent = message;
    el.classList.remove("hidden");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        el.classList.add("hidden");
    }, 2500);
}

function safeText(text) {
    return String(text).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));
}

function showHome() {
    homePage?.classList.remove("hidden");
    learningPage?.classList.add("hidden");
    sidebar?.classList.remove("open");
}

function showLearning() {
    homePage?.classList.add("hidden");
    learningPage?.classList.remove("hidden");
}

function getDescription(language, topic) {
    return `${topic} merupakan bagian dari pembelajaran ${language}. ` +
        `Materi ini membantu memahami konsep ${topic} ` +
        `dan bagaimana menggunakannya dalam program. ` +
        `Ubah contoh kode di editor, lalu jalankan untuk melihat hasilnya.`;
}

function getHint(language) {
    const hints = {
        HTML: "HTML digunakan untuk struktur halaman. Cobalah mengubah elemen, atribut, dan isi tag.",
        CSS: "CSS digunakan untuk mengubah tampilan. Cobalah mengganti warna, ukuran, dan layout.",
        JavaScript: "JavaScript mengatur logika. Cobalah mengubah nilai, kondisi, dan fungsi.",
        Python: "Python menggunakan indentasi. Cobalah mengubah nilai variabel dan perintah.",
        Java: "Java menggunakan class dan method. Perhatikan struktur program.",
        "C++": "C++ memiliki main sebagai entry point. Perhatikan tipe data dan struktur kode."
    };

    return hints[language] || "";
}

function buatContoh(language, topic) {
    const examples = {
        HTML: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Belajar HTML</title>
</head>
<body>
    <h1>${topic}</h1>
    <p>Ini adalah contoh materi ${topic}.</p>
</body>
</html>`,

        CSS: `body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    color: #222;
}

h1 {
    color: blue;
}`,

        JavaScript: `const nama = "CodeLearn";

console.log("Halo " + nama);
console.log("Belajar ${topic}");`,

        Python: `nama = "CodeLearn"

print("Halo", nama)
print("Belajar ${topic}")`,

        Java: `public class Main {
    public static void main(String[] args) {
        String nama = "CodeLearn";

        System.out.println("Halo " + nama);
        System.out.println("Belajar ${topic}");
    }
}`,

        "C++": `#include <iostream>
using namespace std;

int main() {
    string nama = "CodeLearn";

    cout << "Halo " << nama << endl;
    cout << "Belajar ${topic}" << endl;

    return 0;
}`
    };

    return examples[language] || "";
}

function getStarterCode(language, topic) {
    if (language === "HTML" && topic === "Basic") {
        return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Belajar HTML</title>
</head>
<body>
    <h1>Halo, dunia!</h1>
    <p>Ini halaman HTML pertama saya.</p>
</body>
</html>`;
    }

    if (language === "HTML" || language === "CSS") {
        return buatContoh(language, topic);
    }

    if (language === "JavaScript") {
        if (topic === "If Else") {
            return `const nilai = 85;

if (nilai >= 75) {
    console.log("Lulus");
} else {
    console.log("Belum lulus");
}`;
        }

        if (topic === "Loop For") {
            return `for (let i = 1; i <= 5; i++) {
    console.log(i);
}`;
        }

        if (topic === "Functions") {
            return `function tambah(a, b) {
    return a + b;
}

console.log(tambah(3, 4));`;
        }

        return buatContoh(language, topic);
    }

    if (language === "Python") {
        if (topic === "If...Else") {
            return `nilai = 85

if nilai >= 75:
    print("Lulus")
else:
    print("Belum lulus")`;
        }

        if (topic === "For Loops") {
            return `for i in range(1, 6):
    print(i)`;
        }

        if (topic === "Functions") {
            return `def tambah(a, b):
    return a + b

print(tambah(3, 4))`;
        }

        return buatContoh(language, topic);
    }

    if (language === "Java") {
        if (topic === "If...Else") {
            return `public class Main {
    public static void main(String[] args) {
        int nilai = 85;

        if (nilai >= 75) {
            System.out.println("Lulus");
        } else {
            System.out.println("Belum lulus");
        }
    }
}`;
        }

        if (topic === "For Loop") {
            return `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println(i);
        }
    }
}`;
        }

        return buatContoh(language, topic);
    }

    if (language === "C++") {
        if (topic === "Conditions If/Else") {
            return `#include <iostream>
using namespace std;

int main() {
    int nilai = 85;

    if (nilai >= 75) {
        cout << "Lulus" << endl;
    } else {
        cout << "Belum lulus" << endl;
    }

    return 0;
}`;
        }

        if (topic === "For Loop") {
            return `#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 5; i++) {
        cout << i << endl;
    }

    return 0;
}`;
        }

        return buatContoh(language, topic);
    }

    return "";
}

function renderNavbar() {
    const navbar = getElement("navbar");

    if (!navbar) return;

    navbar.innerHTML = `
        <button class="active" data-nav="Home">Home</button>
        ${LANGUAGES.map(lang => `
            <button data-nav="${safeText(lang)}">
                ${safeText(lang)}
            </button>
        `).join("")}
    `;

    navbar.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => {
            const target = button.dataset.nav;

            if (target === "Home") {
                showHome();
            } else {
                openLanguage(target);
            }

            navbar.querySelectorAll("button").forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");
        });
    });
}

function renderCards() {
    const cards = getElement("languageCards");

    if (!cards) return;

    const examples = {
        HTML: `<h1>Hello World</h1>`,
        CSS: `body {
    color: blue;
}`,
        JavaScript: `console.log("Hello");`,
        Python: `print("Hello")`,
        Java: `System.out.println("Hello");`,
        "C++": `cout << "Hello";`
    };

    cards.innerHTML = LANGUAGES.map(language => `
        <article class="language-card">
            <h3>${safeText(language)}</h3>
            <p>${safeText(DESKRIPSI?.[language] || `Belajar ${language}`)}</p>
            <pre>${safeText(examples[language])}</pre>
            <button data-language="${safeText(language)}">
                Mulai Belajar →
            </button>
        </article>
    `).join("");

    cards.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => {
            openLanguage(button.dataset.language);
        });
    });
}

function openLanguage(language) {
    if (!MATERI_DATA || !MATERI_DATA[language]) {
        toast("Materi bahasa tersebut tidak ditemukan.");
        return;
    }

    currentLanguage = language;
    currentTopic = MATERI_DATA[language][0];

    showLearning();
    renderSidebar();
    renderLesson();

    document.querySelectorAll("#navbar button").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.nav === language
        );
    });
}

function renderSidebar(filter = "") {
    const sidebarTitle = getElement("sidebarTitle");
    const sidebarSubtitle = getElement("sidebarSubtitle");

    if (sidebarTitle) {
        sidebarTitle.textContent = currentLanguage;
    }

    if (sidebarSubtitle) {
        sidebarSubtitle.textContent =
            `${MATERI_DATA[currentLanguage].length} materi`;
    }

    const topics = MATERI_DATA[currentLanguage].filter(topic =>
        topic.toLowerCase().includes(filter.toLowerCase())
    );

    topicList.innerHTML = topics.map(topic => `
        <button
            class="topic-item ${topic === currentTopic ? "active" : ""}"
            data-topic="${safeText(topic)}"
        >
            ${safeText(topic)}
        </button>
    `).join("");

    topicList.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => {
            currentTopic = button.dataset.topic;

            renderSidebar(
                getElement("topicSearch")?.value || ""
            );

            renderLesson();
            sidebar?.classList.remove("open");
        });
    });
}

function renderLesson() {
    getElement("lessonMeta").textContent =
        `${currentLanguage} • Materi`;

    getElement("lessonTitle").textContent = currentTopic;

    getElement("lessonDescription").textContent =
        getDescription(currentLanguage, currentTopic);

    getElement("lessonExplanation").textContent =
        "💡 " + getHint(currentLanguage);

    getElement("fileName").textContent =
        currentLanguage === "HTML" ? "index.html" :
        currentLanguage === "CSS" ? "style.css" :
        currentLanguage === "JavaScript" ? "script.js" :
        currentLanguage === "Python" ? "main.py" :
        currentLanguage === "Java" ? "Main.java" :
        "main.cpp";

    codeEditor.value = getStarterCode(
        currentLanguage,
        currentTopic
    );

    output.textContent = "Tekan Run Code untuk melihat hasil.";

    preview.classList.add("hidden");
    preview.srcdoc = "";
}

getElement("startLearning").onclick = () => {
    openLanguage("HTML");
};

getElement("backHome").onclick = showHome;

getElement("sidebarToggle").onclick = () => {
    sidebar.classList.toggle("open");
};

getElement("sidebarClose").onclick = () => {
    sidebar.classList.remove("open");
};

getElement("topicSearch").addEventListener("input", event => {
    renderSidebar(event.target.value);
});

getElement("copyCode").onclick = async () => {
    try {
        await navigator.clipboard.writeText(codeEditor.value);
        toast("Kode berhasil disalin!");
    } catch {
        codeEditor.select();
        document.execCommand("copy");
        toast("Kode disalin!");
    }
};

getElement("clearOutput").onclick = () => {
    output.textContent = "Output dibersihkan.";
    preview.classList.add("hidden");
    preview.srcdoc = "";
};

function runHTML(code) {
    preview.classList.remove("hidden");
    preview.srcdoc = code;
    output.textContent = "HTML dijalankan di preview.";
}

function runCSS(code) {
    preview.classList.remove("hidden");

    preview.srcdoc = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <style>
                ${code}
            </style>
        </head>
        <body>
            <h1>Preview CSS</h1>
            <p>Contoh paragraf.</p>
            <button>Contoh button</button>
            <div class="kartu">Contoh kartu</div>
        </body>
        </html>
    `;

    output.textContent = "CSS ditampilkan di preview.";
}

function runJavaScript(code) {
    preview.classList.remove("hidden");
    output.textContent = "Menjalankan JavaScript...";

    const safeCode = code.replace(/<\/script/gi, "<\\/script");

    preview.srcdoc = `
        <!DOCTYPE html>
        <html lang="id">
        <body>
            <script>
                const send = value => {
                    parent.postMessage({
                        type: "codelearn-output",
                        value: String(value)
                    }, "*");
                };

                console.log = (...args) => send(args.join(" "));
                console.error = (...args) => send("ERROR: " + args.join(" "));
                console.warn = (...args) => send("WARNING: " + args.join(" "));

                window.onerror = message => {
                    send("ERROR: " + message);
                };

                try {
                    ${safeCode}
                } catch (error) {
                    send("ERROR: " + error.message);
                }
            <\/script>
        </body>
        </html>
    `;
}

function runPythonSimulation(code) {
    const matches = [
        ...code.matchAll(/print\s*\((.*?)\)/gs)
    ];

    if (!matches.length) {
        return "Simulasi: tidak ditemukan perintah print().";
    }

    return matches.map(match => {
        const expression = match[1].trim();

        if (
            (expression.startsWith('"') && expression.endsWith('"')) ||
            (expression.startsWith("'") && expression.endsWith("'"))
        ) {
            return expression.slice(1, -1);
        }

        if (/^[0-9+\-*/().\s]+$/.test(expression)) {
            try {
                return String(Function(
                    `"use strict"; return (${expression})`
                )());
            } catch {
                return expression;
            }
        }

        return expression;
    }).join("\n");
}

function runJavaSimulation(code) {
    const matches = [
        ...code.matchAll(/System\.out\.(?:println|print)\s*\((.*?)\)\s*;/gs)
    ];

    if (!matches.length) {
        return "Simulasi: tidak ditemukan System.out.println().";
    }

    return matches.map(match => {
        return match[1].trim().replace(/^["']|["']$/g, "");
    }).join("\n");
}

function runCppSimulation(code) {
    const matches = [
        ...code.matchAll(/cout\s*<<\s*(.*?)\s*(?:<<\s*endl)?\s*;/gs)
    ];

    if (!matches.length) {
        return "Simulasi: tidak ditemukan perintah cout.";
    }

    return matches.map(match => {
        return match[1].trim().replace(/^["']|["']$/g, "");
    }).join("\n");
}

getElement("runCode").onclick = () => {
    const code = codeEditor.value;

    if (!code.trim()) {
        output.textContent = "Editor kode masih kosong.";
        return;
    }

    if (currentLanguage === "HTML") {
        runHTML(code);
    } else if (currentLanguage === "CSS") {
        runCSS(code);
    } else if (currentLanguage === "JavaScript") {
        runJavaScript(code);
    } else if (currentLanguage === "Python") {
        preview.classList.add("hidden");

        output.textContent =
            runPythonSimulation(code) +
            "\n\n[Simulasi output, bukan interpreter Python asli]";
    } else if (currentLanguage === "Java") {
        preview.classList.add("hidden");

        output.textContent =
            runJavaSimulation(code) +
            "\n\n[Simulasi output, bukan compiler Java asli]";
    } else if (currentLanguage === "C++") {
        preview.classList.add("hidden");

        output.textContent =
            runCppSimulation(code) +
            "\n\n[Simulasi output, bukan compiler C++ asli]";
    }
};

window.addEventListener("message", event => {
    if (event.data?.type !== "codelearn-output") return;

    if (output.textContent === "Menjalankan JavaScript...") {
        output.textContent = event.data.value;
    } else {
        output.textContent += "\n" + event.data.value;
    }
});

// AI TUTOR

function openTutor() {
    tutorPanel.classList.add("open");
    tutorBackdrop.classList.remove("hidden");
}

function closeTutor() {
    tutorPanel.classList.remove("open");
    tutorBackdrop.classList.add("hidden");
}

getElement("tutorOpen").onclick = openTutor;
getElement("tutorClose").onclick = closeTutor;
tutorBackdrop.onclick = closeTutor;

function addChat(text, sender) {
    const div = document.createElement("div");

    div.className =
        "chat-bubble " +
        (sender === "user" ? "user" : "ai");

    div.textContent = text;

    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return div;
}

async function askAI(question) {
    const response = await fetch("/api/tutor", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            question,
            language: currentLanguage,
            topic: currentTopic,
            code: codeEditor.value
        })
    });

    const rawText = await response.text();

    let data;

    try {
        data = JSON.parse(rawText);
    } catch {
        throw new Error(
            "Respons server tidak valid. Pastikan backend berjalan."
        );
    }

    if (!response.ok) {
        throw new Error(
            data.error || `Permintaan gagal (${response.status}).`
        );
    }

    if (!data.answer) {
        throw new Error("AI Tutor tidak memberikan jawaban.");
    }

    return data.answer;
}

async function sendChat() {
    const input = getElement("chatInput");
    const button = getElement("sendChat");

    const question = input.value.trim();

    if (!question || isRunning) return;

    input.value = "";

    addChat(question, "user");

    const loading = addChat(
        "Tutor sedang berpikir...",
        "ai"
    );

    isRunning = true;
    button.disabled = true;
    button.textContent = "Menunggu...";

    try {
        const answer = await askAI(question);
        loading.textContent = answer;
    } catch (error) {
        loading.textContent =
            "Terjadi kesalahan: " + error.message;
    } finally {
        isRunning = false;
        button.disabled = false;
        button.textContent = "Kirim";
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

getElement("sendChat").onclick = sendChat;

getElement("chatInput").addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendChat();
    }
});

// INISIALISASI WEBSITE

renderNavbar();
renderCards();
showHome();
