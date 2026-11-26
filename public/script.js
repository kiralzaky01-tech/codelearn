/* =========================================================
   CodeLearn v2.0 - Logika aplikasi
   Membutuhkan materi-data.js (MATERI_DATA, DESKRIPSI, getLesson)
   ========================================================= */

const LANGUAGES = ["HTML", "CSS", "JavaScript", "Python", "Java", "C++"];

const FILE_NAMES = {
    HTML: "index.html",
    CSS: "index.html (CSS di dalam <style>)",
    JavaScript: "script.js",
    Python: "main.py",
    Java: "Main.java",
    "C++": "main.cpp"
};

const HINTS = {
    HTML: "Ubah teks atau tag di editor, lalu tekan Run Code untuk melihat hasilnya di preview.",
    CSS: "Ubah nilai warna, ukuran, atau properti lain, lalu tekan Run Code. Contoh CSS ditulis di dalam <style> agar langsung bisa dijalankan.",
    JavaScript: "Output console.log() tampil di panel Output. Kode yang memakai document akan menampilkan halaman demo di preview.",
    Python: "Python dijalankan oleh interpreter asli di browser (pemuatan pertama butuh beberapa detik). Perhatikan indentasi!",
    Java: "Java dikompilasi dan dijalankan di server. Nama class utama harus Main, dan method main adalah titik awal program.",
    "C++": "C++ dikompilasi dan dijalankan di server. main() adalah titik awal program, dan setiap pernyataan diakhiri titik koma."
};

const THEME_KEY = "codelearn-theme";
const DESKTOP_QUERY = "(min-width: 960px)";

let currentLanguage = "HTML";
let currentTopic = MATERI_DATA.HTML[0];
let isChatBusy = false;
let isCodeRunning = false;
let quotaExhausted = false;
let jsWaitingFirstOutput = false;
let jsRunToken = 0;
let allowTabOut = false;

const homePage = document.getElementById("homePage");
const learningPage = document.getElementById("learningPage");
const sidebar = document.getElementById("sidebar");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");
const topicList = document.getElementById("topicList");
const codeEditor = document.getElementById("codeEditor");
const output = document.getElementById("output");
const preview = document.getElementById("preview");
const runBtn = document.getElementById("runCode");
const runStatus = document.getElementById("runStatus");
const stdinBox = document.getElementById("stdinBox");
const stdinInput = document.getElementById("stdinInput");
const tutorPanel = document.getElementById("tutorPanel");
const tutorBackdrop = document.getElementById("tutorBackdrop");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendChat");

/* =========================================================
   UTILITAS
   ========================================================= */

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

function formatNumber(value) {
    return Number(value).toLocaleString("id-ID");
}

function isDesktop() {
    return window.matchMedia(DESKTOP_QUERY).matches;
}

function updateScrollLock() {
    const drawerOpen = sidebar.classList.contains("open") && !isDesktop();
    const tutorOpen = tutorPanel.classList.contains("open");

    document.body.classList.toggle("no-scroll", drawerOpen || tutorOpen);
}

/* =========================================================
   TEMA TERANG / GELAP
   ========================================================= */

function applyTheme(theme, save = false) {
    document.documentElement.setAttribute("data-theme", theme);

    const button = document.getElementById("themeToggle");

    if (button) {
        const label = theme === "dark"
            ? "Ganti ke mode terang"
            : "Ganti ke mode gelap";

        button.setAttribute("aria-label", label);
        button.title = label;
    }

    if (save) {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (error) {
            console.warn("Tema tidak dapat disimpan:", error);
        }
    }
}

function initTheme() {
    const current =
        document.documentElement.getAttribute("data-theme") === "light"
            ? "light"
            : "dark";

    applyTheme(current);

    getElement("themeToggle").addEventListener("click", () => {
        const next =
            document.documentElement.getAttribute("data-theme") === "dark"
                ? "light"
                : "dark";

        applyTheme(next, true);
        toast(next === "dark" ? "Mode gelap aktif" : "Mode terang aktif");
    });
}

/* =========================================================
   NAVIGASI HALAMAN
   ========================================================= */

function setActiveNav(name) {
    document.querySelectorAll("#navbar button").forEach(button => {
        const active = button.dataset.nav === name;

        button.classList.toggle("active", active);

        if (active) {
            button.scrollIntoView({ block: "nearest", inline: "nearest" });
        }
    });
}

function showHome() {
    homePage.classList.remove("hidden");
    learningPage.classList.add("hidden");
    closeSidebar();
    setActiveNav("Home");
    window.scrollTo(0, 0);
}

function showLearning() {
    homePage.classList.add("hidden");
    learningPage.classList.remove("hidden");
}

function renderNavbar() {
    const navbar = getElement("navbar");

    navbar.innerHTML = `
        <button class="active" data-nav="Home">Home</button>
        ${LANGUAGES.map(lang => `
            <button data-nav="${safeText(lang)}">${safeText(lang)}</button>
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
        });
    });
}

function renderCards() {
    const cards = getElement("languageCards");

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
            <p>${safeText(DESKRIPSI[language] || `Belajar ${language}`)}</p>
            <pre>${safeText(examples[language])}</pre>
            <button type="button" data-language="${safeText(language)}">
                Mulai belajar ${safeText(language)}
            </button>
        </article>
    `).join("");

    cards.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => {
            openLanguage(button.dataset.language);
        });
    });
}

function renderStats() {
    const total = LANGUAGES.reduce(
        (sum, language) => sum + MATERI_DATA[language].length,
        0
    );

    getElement("statLanguages").textContent = LANGUAGES.length;
    getElement("statTopics").textContent = total;
}

/* =========================================================
   SIDEBAR MATERI (DRAWER DI HP)
   ========================================================= */

function openSidebar() {
    sidebar.classList.add("open");
    sidebarBackdrop.classList.remove("hidden");
    updateScrollLock();
}

function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarBackdrop.classList.add("hidden");
    updateScrollLock();
}

function renderSidebar() {
    const filter = (getElement("topicSearch").value || "").toLowerCase();
    const allTopics = MATERI_DATA[currentLanguage];

    getElement("sidebarTitle").textContent = currentLanguage;
    getElement("sidebarSubtitle").textContent = `${allTopics.length} materi`;

    const topics = allTopics.filter(topic =>
        topic.toLowerCase().includes(filter)
    );

    if (!topics.length) {
        topicList.innerHTML = `<p class="topic-empty">Materi tidak ditemukan.</p>`;
        return;
    }

    topicList.innerHTML = topics.map(topic => `
        <button
            type="button"
            class="topic-item ${topic === currentTopic ? "active" : ""}"
            data-topic="${safeText(topic)}"
        >${safeText(topic)}</button>
    `).join("");

    topicList.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => {
            selectTopic(button.dataset.topic);
        });
    });
}

function selectTopic(topic) {
    currentTopic = topic;

    renderSidebar();
    renderLesson();
    closeSidebar();

    window.scrollTo(0, 0);
}

function openLanguage(language) {
    if (!MATERI_DATA[language]) {
        toast("Materi bahasa tersebut tidak ditemukan.");
        return;
    }

    currentLanguage = language;
    currentTopic = MATERI_DATA[language][0];

    getElement("topicSearch").value = "";

    showLearning();
    renderSidebar();
    renderLesson();
    closeSidebar();
    setActiveNav(language);

    window.scrollTo(0, 0);
}

/* =========================================================
   PELAJARAN
   ========================================================= */

function loadStarterCode() {
    const lesson = getLesson(currentLanguage, currentTopic);

    codeEditor.value = lesson ? lesson.kode : "";
    stdinInput.value = lesson ? lesson.stdin : "";

    updateStdinVisibility();
}

function updateStdinVisibility() {
    const needsInput =
        (currentLanguage === "Java" || currentLanguage === "C++") &&
        (stdinInput.value.trim() !== "" ||
            /Scanner|\bcin\b|getline/.test(codeEditor.value));

    stdinBox.classList.toggle("hidden", !needsInput);
}

function resetOutput() {
    jsRunToken++;
    jsWaitingFirstOutput = false;

    output.textContent = "Tekan Run Code untuk melihat hasil.";
    runStatus.textContent = "";

    preview.classList.add("hidden");
    preview.srcdoc = "";
}

function renderLesson() {
    const lesson = getLesson(currentLanguage, currentTopic);
    const topics = MATERI_DATA[currentLanguage];
    const index = topics.indexOf(currentTopic);

    getElement("lessonMeta").textContent =
        `${currentLanguage} · Materi ${index + 1} dari ${topics.length}`;

    getElement("lessonTitle").textContent = currentTopic;

    getElement("lessonDescription").textContent =
        lesson ? lesson.penjelasan : "Materi belum tersedia.";

    getElement("lessonExplanation").textContent =
        "💡 " + (HINTS[currentLanguage] || "");

    getElement("fileName").textContent = FILE_NAMES[currentLanguage] || "";

    loadStarterCode();
    resetOutput();

    getElement("prevTopic").disabled = index <= 0;
    getElement("nextTopic").disabled = index >= topics.length - 1;
}

function goToRelativeTopic(step) {
    const topics = MATERI_DATA[currentLanguage];
    const next = topics.indexOf(currentTopic) + step;

    if (next < 0 || next >= topics.length) return;

    selectTopic(topics[next]);
}

/* =========================================================
   EDITOR
   ========================================================= */

getElement("startLearning").addEventListener("click", () => openLanguage("HTML"));
getElement("heroTutor").addEventListener("click", () => openTutor());
getElement("backHome").addEventListener("click", showHome);
getElement("sidebarToggle").addEventListener("click", openSidebar);
getElement("sidebarClose").addEventListener("click", closeSidebar);
sidebarBackdrop.addEventListener("click", closeSidebar);
getElement("prevTopic").addEventListener("click", () => goToRelativeTopic(-1));
getElement("nextTopic").addEventListener("click", () => goToRelativeTopic(1));
getElement("topicSearch").addEventListener("input", renderSidebar);

getElement("resetCode").addEventListener("click", () => {
    loadStarterCode();
    toast("Kode dikembalikan ke contoh awal.");
});

getElement("copyCode").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(codeEditor.value);
        toast("Kode berhasil disalin!");
    } catch {
        codeEditor.select();
        document.execCommand("copy");
        toast("Kode disalin!");
    }
});

getElement("clearOutput").addEventListener("click", () => {
    jsRunToken++;
    jsWaitingFirstOutput = false;

    output.textContent = "Output dibersihkan.";
    runStatus.textContent = "";

    preview.classList.add("hidden");
    preview.srcdoc = "";
});

codeEditor.addEventListener("input", updateStdinVisibility);

// Tab menyisipkan 4 spasi; tekan Esc lalu Tab untuk keluar dari editor
codeEditor.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        allowTabOut = true;
        return;
    }

    if (
        event.key === "Tab" &&
        !event.shiftKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !allowTabOut
    ) {
        event.preventDefault();

        const start = codeEditor.selectionStart;
        const end = codeEditor.selectionEnd;

        codeEditor.value =
            codeEditor.value.slice(0, start) +
            "    " +
            codeEditor.value.slice(end);

        codeEditor.selectionStart = codeEditor.selectionEnd = start + 4;
        return;
    }

    if (event.key !== "Tab") {
        allowTabOut = false;
    }

    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        runCode();
    }
});

/* =========================================================
   MENJALANKAN KODE
   ========================================================= */

function setOutput(text) {
    output.textContent = text;
}

function setRunStatus(text) {
    runStatus.textContent = text || "";
}

function runHTML(code) {
    preview.classList.remove("hidden");
    preview.srcdoc = code;

    setOutput("HTML dijalankan di preview di bawah.");
}

function runCSS(code) {
    // Contoh CSS berupa dokumen HTML lengkap: jalankan apa adanya
    if (/<\s*(!doctype|html|head|body|style|div|p|h[1-6]|ul|button)\b/i.test(code)) {
        runHTML(code);
        setOutput("CSS dijalankan di preview di bawah.");
        return;
    }

    // Jika hanya berisi aturan CSS, bungkus dengan halaman contoh
    preview.classList.remove("hidden");

    preview.srcdoc = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${code}</style>
</head>
<body>
    <h1>Preview CSS</h1>
    <h2>Judul 2</h2>
    <p>Contoh paragraf.</p>
    <p class="penting">Paragraf dengan class penting.</p>
    <button>Contoh button</button>
    <div class="kartu">Contoh kartu</div>
</body>
</html>`;

    setOutput("CSS ditampilkan pada halaman contoh di preview.");
}

function buildJsDocument(code, withDom) {
    const safeCode = code.replace(/<\/script/gi, "<\\/script");

    const body = withDom
        ? `<h3 id="judul">Halaman Demo</h3>
<p id="teks">Ini paragraf contoh.</p>
<button id="tombol">Klik saya</button>
<div id="demo"></div>`
        : "";

    return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>body { font-family: Arial, sans-serif; padding: 12px; color: #111; }</style>
</head>
<body>
${body}
<script>
(function () {
    function fmt(v) {
        if (typeof v === "string") return v;
        if (v instanceof Error) return v.name + ": " + v.message;
        if (typeof v === "bigint") return v + "n";
        if (typeof v === "symbol") return v.toString();
        if (typeof v === "function") return "[Function" + (v.name ? ": " + v.name : "") + "]";
        if (v instanceof Set) return "Set(" + v.size + ") {" + Array.from(v).map(fmt).join(", ") + "}";
        if (v instanceof Map) return "Map(" + v.size + ") {" + Array.from(v).map(function (p) { return fmt(p[0]) + " => " + fmt(p[1]); }).join(", ") + "}";
        if (v instanceof Date) return String(v);
        if (v !== null && typeof v === "object") {
            try { return JSON.stringify(v); } catch (e) { return String(v); }
        }
        return String(v);
    }

    function send(prefix, args) {
        var teks = Array.prototype.map.call(args, fmt).join(" ");
        parent.postMessage({ type: "codelearn-output", value: prefix + teks }, "*");
    }

    console.log = function () { send("", arguments); };
    console.info = function () { send("", arguments); };
    console.warn = function () { send("WARNING: ", arguments); };
    console.error = function () { send("ERROR: ", arguments); };

    window.addEventListener("error", function (e) {
        send("ERROR: ", [e.message]);
    });

    window.addEventListener("unhandledrejection", function (e) {
        var r = e.reason;
        send("ERROR: ", [r && r.message ? r.message : r]);
    });
})();
<\/script>
<script>
${safeCode}
<\/script>
</body>
</html>`;
}

function runJavaScript(code) {
    const withDom = /\b(document|window)\b/.test(code);
    const token = ++jsRunToken;

    jsWaitingFirstOutput = true;
    setOutput("Menjalankan JavaScript...");

    if (withDom) {
        preview.classList.remove("hidden");
    } else {
        preview.classList.add("hidden");
    }

    preview.srcdoc = buildJsDocument(code, withDom);

    setTimeout(() => {
        if (token === jsRunToken && jsWaitingFirstOutput) {
            jsWaitingFirstOutput = false;
            setOutput(
                withDom
                    ? "(Tidak ada output di console. Lihat hasilnya di preview di bawah.)"
                    : "(Kode selesai tanpa output di console. Gunakan console.log() untuk menampilkan hasil.)"
            );
        }
    }, 1500);
}

function appendJsOutput(text) {
    if (jsWaitingFirstOutput) {
        jsWaitingFirstOutput = false;
        output.textContent = text;
    } else {
        output.textContent += "\n" + text;
    }

    output.scrollTop = output.scrollHeight;
}

window.addEventListener("message", event => {
    if (event.source !== preview.contentWindow) return;
    if (event.data?.type !== "codelearn-output") return;

    appendJsOutput(String(event.data.value));
});

/* ---------- Python (Pyodide: interpreter Python asli di browser) ---------- */

let pyodidePromise = null;

function loadPyodideRuntime() {
    if (!pyodidePromise) {
        pyodidePromise = new Promise((resolve, reject) => {
            const script = document.createElement("script");

            script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";

            script.onload = async () => {
                try {
                    resolve(await loadPyodide());
                } catch (error) {
                    reject(error);
                }
            };

            script.onerror = () => reject(new Error("Gagal memuat interpreter Python."));

            document.head.appendChild(script);
        }).catch(error => {
            pyodidePromise = null;
            throw error;
        });
    }

    return pyodidePromise;
}

function cleanPythonError(message) {
    const lines = String(message).split("\n");
    const start = lines.findIndex(line => line.includes("<exec>"));

    if (start > 0) {
        return "Traceback (most recent call last):\n" + lines.slice(start).join("\n");
    }

    return message;
}

function runPythonSimulation(code) {
    const matches = [...code.matchAll(/print\s*\((.*?)\)/gs)];

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
                return String(Function(`"use strict"; return (${expression})`)());
            } catch {
                return expression;
            }
        }

        return expression;
    }).join("\n");
}

async function runPython(code) {
    preview.classList.add("hidden");

    setOutput("Memuat interpreter Python... (pemuatan pertama bisa memakan beberapa detik)");
    setRunStatus("memuat Python...");

    let py;

    try {
        py = await loadPyodideRuntime();
    } catch (error) {
        setOutput(
            runPythonSimulation(code) +
            "\n\n[Interpreter Python tidak dapat dimuat (periksa koneksi internet). Ini hanya simulasi sederhana.]"
        );
        return;
    }

    const lines = [];

    py.setStdout({ batched: text => lines.push(text) });
    py.setStderr({ batched: text => lines.push(text) });

    setRunStatus("menjalankan...");

    const namespace = py.globals.get("dict")();

    try {
        await py.runPythonAsync(code, { globals: namespace });

        setOutput(lines.join("\n") || "(Program selesai tanpa output)");
    } catch (error) {
        const prefix = lines.length ? lines.join("\n") + "\n" : "";

        setOutput(prefix + cleanPythonError(error.message));
    } finally {
        namespace.destroy();
    }
}

/* ---------- Java dan C++ (dikompilasi di server, cadangan: simulasi) ---------- */

function runJavaSimulation(code) {
    const matches = [
        ...code.matchAll(/System\.out\.(?:println|print)\s*\((.*?)\)\s*;/gs)
    ];

    if (!matches.length) {
        return "Simulasi: tidak ditemukan System.out.println().";
    }

    return matches.map(match =>
        match[1].trim().replace(/^["']|["']$/g, "")
    ).join("\n");
}

function runCppSimulation(code) {
    const matches = [
        ...code.matchAll(/cout\s*<<\s*(.*?)\s*(?:<<\s*endl)?\s*;/gs)
    ];

    if (!matches.length) {
        return "Simulasi: tidak ditemukan perintah cout.";
    }

    return matches.map(match =>
        match[1].trim().replace(/^["']|["']$/g, "")
    ).join("\n");
}

async function runRemote(languageKey, label, simulate, code) {
    preview.classList.add("hidden");

    setOutput("Mengompilasi dan menjalankan kode...");
    setRunStatus("menjalankan...");

    try {
        const response = await fetch("/api/run", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                language: languageKey,
                code,
                stdin: stdinInput.value
            })
        });

        const data = await response.json().catch(() => ({}));

        if (response.status === 429 || response.status === 400) {
            setOutput(data.error || "Permintaan ditolak.");
            return;
        }

        if (!response.ok) {
            throw new Error(data.error || `status ${response.status}`);
        }

        let text = data.output || "(Program selesai tanpa output)";

        if (data.stage === "compile") {
            text = "Kompilasi gagal:\n" + text;
        } else if (data.exitCode && data.exitCode !== 0) {
            text += `\n\n[Program berakhir dengan kode ${data.exitCode}]`;
        }

        setOutput(text);
    } catch (error) {
        setOutput(
            simulate(code) +
            `\n\n[Layanan eksekusi tidak tersedia (${error.message}). Ini hanya simulasi output sederhana, bukan ${label} asli.]`
        );
    }
}

async function runCode() {
    if (isCodeRunning) return;

    const code = codeEditor.value;

    if (!code.trim()) {
        setOutput("Editor kode masih kosong.");
        return;
    }

    isCodeRunning = true;
    runBtn.disabled = true;

    try {
        if (currentLanguage === "HTML") {
            runHTML(code);
        } else if (currentLanguage === "CSS") {
            runCSS(code);
        } else if (currentLanguage === "JavaScript") {
            runJavaScript(code);
        } else if (currentLanguage === "Python") {
            await runPython(code);
        } else if (currentLanguage === "Java") {
            await runRemote("java", "compiler Java", runJavaSimulation, code);
        } else if (currentLanguage === "C++") {
            await runRemote("cpp", "compiler C++", runCppSimulation, code);
        }
    } catch (error) {
        setOutput("Terjadi kesalahan: " + error.message);
    } finally {
        isCodeRunning = false;
        runBtn.disabled = false;
        setRunStatus("");
    }
}

runBtn.addEventListener("click", runCode);

/* =========================================================
   AI TUTOR
   ========================================================= */

function syncViewport() {
    const viewport = window.visualViewport;
    const root = document.documentElement.style;

    root.setProperty("--vvh", (viewport ? viewport.height : window.innerHeight) + "px");
    root.setProperty("--vvt", (viewport ? viewport.offsetTop : 0) + "px");
}

if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", syncViewport);
    window.visualViewport.addEventListener("scroll", syncViewport);
}

window.addEventListener("resize", () => {
    syncViewport();

    if (isDesktop()) {
        closeSidebar();
    }
});

syncViewport();

function openTutor() {
    syncViewport();

    tutorPanel.classList.add("open");
    tutorPanel.setAttribute("aria-hidden", "false");
    tutorBackdrop.classList.remove("hidden");
    updateScrollLock();

    refreshQuota();

    // Di HP jangan fokus otomatis agar keyboard tidak langsung menutupi chat
    if (window.matchMedia("(hover: hover)").matches) {
        chatInput.focus();
    }
}

function closeTutor() {
    tutorPanel.classList.remove("open");
    tutorPanel.setAttribute("aria-hidden", "true");
    tutorBackdrop.classList.add("hidden");
    chatInput.blur();
    updateScrollLock();
}

getElement("tutorOpen").addEventListener("click", openTutor);
getElement("tutorClose").addEventListener("click", closeTutor);
tutorBackdrop.addEventListener("click", closeTutor);

document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;

    if (tutorPanel.classList.contains("open")) {
        closeTutor();
    } else if (sidebar.classList.contains("open")) {
        closeSidebar();
    }
});

/* ---------- Indikator kuota ---------- */

function refreshSendState() {
    sendBtn.disabled = isChatBusy || quotaExhausted;

    sendBtn.textContent = isChatBusy
        ? "Menunggu..."
        : quotaExhausted
            ? "Kuota habis"
            : "Kirim";

    chatInput.disabled = quotaExhausted;

    chatInput.placeholder = quotaExhausted
        ? "Kuota harian habis. Kembali lagi besok!"
        : "Tulis pertanyaan...";
}

function updateQuota(quota) {
    if (!quota || typeof quota.limitTokens !== "number") return;

    const remaining = Math.max(0, quota.remainingTokens);
    const percent = Math.max(0, Math.min(100, (remaining / quota.limitTokens) * 100));
    const low = percent <= 20;

    const text = getElement("quotaText");
    const bar = getElement("quotaBar");

    text.textContent =
        `Kuota Harian: ${formatNumber(remaining)} / ${formatNumber(quota.limitTokens)} token`;

    bar.style.width = percent + "%";

    text.classList.toggle("low", low);
    bar.classList.toggle("low", low);

    quotaExhausted = remaining <= 0;
    refreshSendState();
}

async function refreshQuota() {
    try {
        const response = await fetch("/api/quota");

        if (!response.ok) throw new Error("gagal");

        updateQuota(await response.json());
    } catch {
        getElement("quotaText").textContent = "Kuota Harian: tidak tersedia";
    }
}

/* ---------- Render jawaban AI (Markdown ringan, aman dari XSS) ---------- */

function renderMarkdown(markdown) {
    const codeBlocks = [];

    let text = String(markdown).replace(/\r\n/g, "\n");

    // Blok kode lengkap
    text = text.replace(/```[^\n]*\n([\s\S]*?)```/g, (match, code) => {
        codeBlocks.push(code.replace(/\n$/, ""));
        return `\n@@CODE${codeBlocks.length - 1}@@\n`;
    });

    // Blok kode yang tidak ditutup (jawaban terpotong batas token)
    text = text.replace(/```[^\n]*\n([\s\S]*)$/, (match, code) => {
        codeBlocks.push(code.replace(/\n$/, ""));
        return `\n@@CODE${codeBlocks.length - 1}@@\n`;
    });

    const inline = value => value
        .replace(/`([^`\n]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");

    const html = [];
    let listType = null;

    const closeList = () => {
        if (listType) {
            html.push(`</${listType}>`);
            listType = null;
        }
    };

    safeText(text).split("\n").forEach(rawLine => {
        const line = rawLine.trimEnd();
        const trimmed = line.trim();

        const codeMatch = trimmed.match(/^@@CODE(\d+)@@$/);

        if (codeMatch) {
            closeList();
            html.push(`<pre><code>${safeText(codeBlocks[Number(codeMatch[1])])}</code></pre>`);
            return;
        }

        if (!trimmed) {
            closeList();
            return;
        }

        const heading = line.match(/^\s{0,3}#{1,6}\s+(.*)$/);

        if (heading) {
            closeList();
            html.push(`<h4>${inline(heading[1])}</h4>`);
            return;
        }

        const bullet = line.match(/^\s*[-*+]\s+(.*)$/);
        const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);

        if (bullet || numbered) {
            const type = bullet ? "ul" : "ol";

            if (listType !== type) {
                closeList();
                html.push(`<${type}>`);
                listType = type;
            }

            html.push(`<li>${inline((bullet || numbered)[1])}</li>`);
            return;
        }

        closeList();
        html.push(`<p>${inline(trimmed)}</p>`);
    });

    closeList();

    return html.join("");
}

/* ---------- Chat ---------- */

function addChat(text, sender) {
    const div = document.createElement("div");

    div.className = "chat-bubble " + (sender === "user" ? "user" : "ai");
    div.textContent = text;

    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return div;
}

async function askAI(question) {
    const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            question,
            language: currentLanguage,
            topic: currentTopic,
            code: codeEditor.value.slice(0, 1500)
        })
    });

    const rawText = await response.text();

    let data;

    try {
        data = JSON.parse(rawText);
    } catch {
        throw new Error("Respons server tidak valid. Pastikan backend berjalan.");
    }

    // Server selalu mengirim info kuota terbaru (termasuk saat 429)
    updateQuota(data);

    if (!response.ok) {
        throw new Error(data.error || `Permintaan gagal (${response.status}).`);
    }

    if (!data.answer) {
        throw new Error("AI Tutor tidak memberikan jawaban.");
    }

    return data.answer;
}

async function sendChat() {
    const question = chatInput.value.trim();

    if (!question || isChatBusy || quotaExhausted) return;

    chatInput.value = "";

    addChat(question, "user");

    const bubble = addChat("Tutor sedang berpikir...", "ai");

    isChatBusy = true;
    refreshSendState();

    try {
        const answer = await askAI(question);

        bubble.innerHTML = renderMarkdown(answer);
    } catch (error) {
        bubble.textContent = error.message.startsWith("Kuota")
            ? error.message
            : "Terjadi kesalahan: " + error.message;
    } finally {
        isChatBusy = false;
        refreshSendState();
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

sendBtn.addEventListener("click", sendChat);

chatInput.addEventListener("keydown", event => {
    // Enter mengirim di desktop; di HP Enter membuat baris baru
    if (event.key === "Enter" && !event.shiftKey && isDesktop()) {
        event.preventDefault();
        sendChat();
    }
});

// Saat keyboard HP muncul, pastikan pesan terakhir tetap terlihat
chatInput.addEventListener("focus", () => {
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 300);
});

/* =========================================================
   INISIALISASI
   ========================================================= */

initTheme();
renderNavbar();
renderCards();
renderStats();
showHome();