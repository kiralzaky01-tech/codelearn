/* =========================================================
   CodeLearn v2.0 - Data materi pembelajaran
   Format tiap materi: [judul, penjelasan, contoh kode, stdin (opsional)]
   Judul materi dipakai sebagai kunci, jadi isi materi selalu
   sesuai dengan judul yang tampil di sidebar.
   ========================================================= */

const ind = (teks, n) =>
    teks.split("\n").map(b => (b ? " ".repeat(n) + b : b)).join("\n");

// Membungkus contoh CSS menjadi dokumen HTML lengkap agar langsung bisa dijalankan
const cssDoc = (css, body = "") => `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
${ind(css, 8)}
    </style>
</head>
<body>
${ind(body, 4)}
</body>
</html>`;

// Membungkus contoh Java agar ringkas di data, tetapi tetap utuh di editor
const javaDoc = ({ imp = "", top = "", members = "", body = "" }) =>
    (imp ? imp + "\n\n" : "") +
    (top ? top + "\n\n" : "") +
    "public class Main {\n" +
    (members ? ind(members, 4) + "\n\n" : "") +
    "    public static void main(String[] args) {\n" +
    ind(body, 8) +
    "\n    }\n}";

// Membungkus contoh C++
const cppDoc = ({ inc = "", top = "", body = "" }) =>
    "#include <iostream>\n" +
    (inc ? inc + "\n" : "") +
    "using namespace std;\n\n" +
    (top ? top + "\n\n" : "") +
    "int main() {\n" +
    ind(body, 4) +
    "\n\n    return 0;\n}";

const LESSONS = {};

/* ======================== HTML ======================== */
LESSONS.HTML = [
["Basic", "HTML (HyperText Markup Language) adalah bahasa untuk menyusun struktur halaman web. Setiap dokumen diawali <!DOCTYPE html>, dibungkus tag <html>, lalu dibagi menjadi <head> (informasi halaman) dan <body> (isi yang tampil di layar).",
`<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Halaman Pertama</title>
</head>
<body>
    <h1>Halo, dunia!</h1>
    <p>Ini halaman HTML pertama saya.</p>
</body>
</html>`],

["Elements", "Elemen HTML terdiri dari tag pembuka, isi, dan tag penutup, misalnya <p>isi</p>. Elemen kosong seperti <br> dan <hr> tidak punya isi maupun tag penutup. Elemen juga bisa bersarang di dalam elemen lain.",
`<h2>Ini elemen judul</h2>
<p>Ini elemen paragraf dengan <strong>elemen tebal</strong> di dalamnya.</p>
<p>Elemen kosong seperti br tidak punya penutup:<br>teks ini pindah baris.</p>
<hr>
<p>Garis di atas dibuat dengan elemen hr.</p>`],

["Attributes", "Atribut memberi informasi tambahan pada elemen dan selalu ditulis di tag pembuka dengan pola nama=\"nilai\". Contohnya href pada link, src dan alt pada gambar, serta title untuk tooltip.",
`<a href="https://www.example.com" title="Kunjungi example.com">Tautan dengan atribut</a>

<p title="Ini tooltip">Arahkan kursor ke paragraf ini.</p>

<img src="https://placehold.co/240x80" alt="Gambar contoh" width="240" height="80">`],

["Headings", "Judul dibuat dengan <h1> sampai <h6>. <h1> adalah yang terpenting dan terbesar. Gunakan satu <h1> per halaman dan urutkan level judul secara berurutan agar struktur halaman jelas bagi pembaca dan mesin pencari.",
`<h1>Judul utama (h1)</h1>
<h2>Sub judul (h2)</h2>
<h3>Judul level 3</h3>
<h4>Judul level 4</h4>
<h5>Judul level 5</h5>
<h6>Judul level 6</h6>`],

["Paragraphs", "Paragraf dibuat dengan <p>. Browser menggabungkan spasi dan baris kosong di kode menjadi satu spasi. Gunakan <br> untuk pindah baris, <hr> untuk garis pemisah, dan <pre> untuk menampilkan teks persis seperti penulisannya.",
`<p>Ini paragraf pertama.</p>
<p>Ini paragraf kedua,<br>dengan baris baru dari br.</p>
<hr>
<pre>
Teks di dalam pre
    mempertahankan   spasi
dan baris baru.
</pre>`],

["Styles", "Atribut style menambahkan CSS langsung pada satu elemen dengan format property: nilai;. Cara ini praktis untuk percobaan cepat, tetapi untuk proyek besar lebih baik memakai file CSS terpisah.",
`<h1 style="color: royalblue;">Judul berwarna biru</h1>
<p style="background-color: lightyellow; font-size: 20px;">Paragraf dengan latar kuning dan huruf lebih besar.</p>
<p style="text-align: center; border: 2px solid tomato; padding: 10px;">Teks rata tengah dengan border.</p>`],

["Formatting", "Tag pemformatan mengubah tampilan sekaligus memberi makna pada teks: <strong> (penting), <em> (ditekankan), <mark> (sorotan), <small>, <del> (dihapus), <ins> (disisipkan), <sub> (subskrip), dan <sup> (superskrip).",
`<p>Teks <b>tebal</b> dan <strong>sangat penting</strong>.</p>
<p>Teks <i>miring</i> dan <em>ditekankan</em>.</p>
<p>Teks <mark>disorot</mark> dan <small>berukuran kecil</small>.</p>
<p>Harga <del>Rp100.000</del> <ins>Rp75.000</ins></p>
<p>Rumus air: H<sub>2</sub>O dan 5<sup>2</sup> = 25</p>`],

["Quotations", "<blockquote> dipakai untuk kutipan panjang (blok), <q> untuk kutipan pendek di dalam kalimat (browser menambah tanda petik otomatis), <abbr> untuk singkatan, dan <cite> untuk judul karya atau sumber.",
`<blockquote cite="https://id.wikipedia.org">
    Belajar coding itu seperti belajar bahasa baru: butuh latihan setiap hari.
</blockquote>

<p>Kata orang bijak: <q>Mulailah dari yang kecil.</q></p>

<p><abbr title="HyperText Markup Language">HTML</abbr> adalah bahasa markup.</p>
<p>Buku favorit saya: <cite>Laskar Pelangi</cite>.</p>`],

["Comments", "Komentar ditulis di antara <!-- dan -->. Browser tidak menampilkannya, jadi cocok untuk catatan bagi pembuat kode atau untuk menonaktifkan kode sementara.",
`<!-- Ini komentar, tidak tampil di halaman -->
<p>Paragraf ini terlihat.</p>

<!--
<p>Paragraf ini disembunyikan karena dijadikan komentar.</p>
-->

<p>Hapus tanda komentar di atas untuk menampilkannya.</p>`],

["Colors", "Warna di HTML/CSS dapat ditulis sebagai nama warna, kode HEX (#rrggbb), RGB, HSL, atau RGBA/HSLA untuk warna transparan. Warna bisa dipakai pada teks (color) maupun latar (background-color).",
`<p style="color: tomato;">Nama warna: tomato</p>
<p style="color: #2e8b57;">HEX: #2e8b57</p>
<p style="color: rgb(65, 105, 225);">RGB: rgb(65, 105, 225)</p>
<p style="color: hsl(280, 60%, 50%);">HSL: hsl(280, 60%, 50%)</p>
<p style="background-color: rgba(255, 0, 0, 0.2); padding: 8px;">RGBA: merah transparan</p>`],

["Links", "Tautan dibuat dengan <a href=\"alamat\">teks</a>. Atribut target=\"_blank\" membuka tautan di tab baru. Gunakan mailto: untuk email dan #id untuk meloncat ke bagian lain di halaman yang sama.",
`<p><a href="https://www.example.com" target="_blank">Buka example.com di tab baru</a></p>
<p><a href="mailto:halo@example.com">Kirim email</a></p>
<p><a href="#bawah">Loncat ke bagian bawah halaman</a></p>

<div style="height: 400px; background: #eef;">Ruang kosong</div>

<h3 id="bawah">Kamu sampai di bagian bawah</h3>`],

["Images", "Gambar ditampilkan dengan <img> (elemen kosong). Atribut src berisi alamat gambar, alt berisi teks pengganti jika gambar gagal dimuat dan dibaca screen reader, sedangkan width dan height mengatur ukuran.",
`<img src="https://placehold.co/300x150" alt="Gambar contoh 300x150" width="300" height="150">

<p>Jika gambar gagal dimuat, teks alt akan tampil:</p>
<img src="gambar-tidak-ada.jpg" alt="Teks pengganti: gambar tidak ditemukan">

<img src="https://placehold.co/600x200" alt="Gambar responsif" style="max-width: 100%; height: auto;">`],

["Favicon", "Favicon adalah ikon kecil yang tampil di tab browser. Pasang dengan <link rel=\"icon\"> di dalam <head>. Biasanya berupa file .ico atau .png; contoh di bawah memakai emoji berbentuk SVG agar tidak perlu file tambahan.",
`<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Contoh Favicon</title>
    <!-- Untuk file sendiri: <link rel="icon" type="image/png" href="favicon.png"> -->
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🚀%3C/text%3E%3C/svg%3E">
</head>
<body>
    <h1>Favicon</h1>
    <p>Favicon tampil di tab browser, bukan di dalam halaman. Simpan kode ini sebagai file .html lalu buka di browser untuk melihatnya.</p>
</body>
</html>`],

["Page Title", "Elemen <title> di dalam <head> menentukan judul halaman yang tampil di tab browser, bookmark, dan hasil mesin pencari. Buatlah judul yang singkat dan menjelaskan isi halaman.",
`<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Belajar HTML untuk Pemula - CodeLearn</title>
</head>
<body>
    <h1>Lihat judul di tab browser</h1>
    <p>Teks di dalam title tidak tampil di halaman, tetapi muncul di tab browser dan hasil pencarian.</p>
</body>
</html>`],

["Tables", "Tabel dibuat dengan <table>. Setiap baris memakai <tr>, sel judul memakai <th>, dan sel data memakai <td>. Gunakan colspan atau rowspan untuk menggabungkan sel. CSS dipakai untuk memberi border.",
`<style>
    table { border-collapse: collapse; }
    th, td { border: 1px solid #888; padding: 6px 14px; }
    th { background: #e8eefc; }
</style>

<table>
    <tr>
        <th>Nama</th>
        <th>Mapel</th>
        <th>Nilai</th>
    </tr>
    <tr>
        <td>Ani</td>
        <td>Matematika</td>
        <td>90</td>
    </tr>
    <tr>
        <td>Budi</td>
        <td>Fisika</td>
        <td>85</td>
    </tr>
    <tr>
        <td colspan="2">Rata-rata</td>
        <td>87,5</td>
    </tr>
</table>`],

["Lists", "HTML punya tiga jenis daftar: <ul> (daftar berpoin, tidak berurutan), <ol> (daftar bernomor), dan <dl> (daftar deskripsi dengan <dt> istilah dan <dd> penjelasan). Isi daftar ul dan ol memakai <li>.",
`<h3>Daftar tidak berurutan</h3>
<ul>
    <li>HTML</li>
    <li>CSS</li>
    <li>JavaScript</li>
</ul>

<h3>Daftar berurutan</h3>
<ol type="1" start="1">
    <li>Buka editor</li>
    <li>Tulis kode</li>
    <li>Jalankan</li>
</ol>

<h3>Daftar deskripsi</h3>
<dl>
    <dt>HTML</dt>
    <dd>Struktur halaman web</dd>
    <dt>CSS</dt>
    <dd>Tampilan halaman web</dd>
</dl>`],

["Block & Inline", "Elemen block (seperti <div>, <p>, <h1>) selalu mulai di baris baru dan memenuhi lebar yang tersedia. Elemen inline (seperti <span>, <a>, <strong>) hanya selebar isinya dan mengalir di dalam baris teks.",
`<style>
    div, p { background: #cfe3ff; margin: 4px 0; }
    span, a { background: #ffd9a8; }
</style>

<div>div adalah elemen block</div>
<p>p juga elemen block</p>

<p>Ini teks dengan <span>span inline</span> dan <a href="#">link inline</a> di tengah kalimat.</p>`],

["Div", "<div> adalah wadah block tanpa makna khusus. Elemen ini dipakai untuk mengelompokkan elemen lain agar bisa ditata bersama dengan CSS atau dimanipulasi dengan JavaScript.",
`<div style="background: #e8f5e9; border: 2px solid seagreen; padding: 16px; border-radius: 8px;">
    <h2 style="margin-top: 0;">Kartu Sederhana</h2>
    <p>Judul dan paragraf ini dikelompokkan dalam satu div.</p>
    <div style="background: white; padding: 8px;">Div di dalam div</div>
</div>`],

["Classes", "Atribut class memberi nama kelompok pada elemen. Satu class boleh dipakai banyak elemen, dan satu elemen boleh punya beberapa class (dipisah spasi). Di CSS, class dipilih dengan titik, misalnya .kartu.",
`<style>
    .kartu { border: 1px solid #888; padding: 10px; margin: 6px 0; border-radius: 6px; }
    .penting { background: #fff3cd; font-weight: bold; }
</style>

<div class="kartu">Kartu biasa</div>
<div class="kartu penting">Kartu penting (dua class)</div>
<div class="kartu">Kartu biasa lagi</div>`],

["Id", "Atribut id memberi nama unik pada satu elemen: tidak boleh ada dua elemen dengan id yang sama dalam satu halaman. Di CSS id dipilih dengan tanda pagar (#judul), dan di JavaScript dengan document.getElementById().",
`<style>
    #judul { color: crimson; }
</style>

<h2 id="judul">Judul dengan id</h2>
<p id="pesan">Teks awal.</p>

<script>
    document.getElementById("pesan").textContent = "Teks ini diubah lewat JavaScript memakai id.";
</script>`],

["Iframes", "<iframe> menanamkan halaman lain di dalam halaman kita. Atribut src berisi alamat halaman, dan title penting untuk aksesibilitas. Contoh ini memakai srcdoc agar bisa tampil tanpa internet; pada situs nyata gunakan src=\"alamat\".",
`<!-- Contoh nyata: <iframe src="https://www.example.com" title="Contoh"></iframe> -->

<iframe
    srcdoc="<h3 style='font-family:sans-serif'>Halo dari dalam iframe</h3><p>Ini halaman terpisah.</p>"
    width="320"
    height="140"
    title="Contoh iframe"
    style="border: 2px solid royalblue;">
</iframe>`],

["File Paths", "Path menunjukkan lokasi file. Path relatif (gambar.jpg, img/foto.jpg, ../foto.jpg) dihitung dari lokasi file HTML saat ini, sedangkan path absolut berupa alamat lengkap (https://...). Di bawah, gambar lokal tidak ada sehingga teks alt yang tampil.",
`<!-- Satu folder dengan file HTML -->
<img src="logo.png" alt="logo.png (satu folder)">

<!-- Di dalam folder img -->
<img src="img/logo.png" alt="img/logo.png (subfolder)">

<!-- Naik satu folder, lalu masuk ke folder gambar -->
<img src="../gambar/logo.png" alt="../gambar/logo.png (folder induk)">

<!-- Path absolut: alamat lengkap -->
<img src="https://placehold.co/160x60" alt="Gambar dari alamat absolut">`],

["Head", "Elemen <head> berisi informasi tentang halaman yang tidak tampil langsung: <title>, <meta> (charset, deskripsi, viewport), <link> (CSS atau ikon), <style>, dan <script>.",
`<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Belajar HTML untuk pemula">
    <meta name="author" content="CodeLearn">
    <title>Contoh Head</title>
    <style>
        body { font-family: Arial, sans-serif; }
    </style>
</head>
<body>
    <h1>Isi halaman ada di body</h1>
    <p>Semua informasi di head tidak tampil langsung di halaman.</p>
</body>
</html>`],

["Layout", "Layout halaman biasanya dibagi menjadi header, navigasi, konten utama, sidebar, dan footer. HTML menyediakan elemen semantik untuk bagian-bagian ini, dan CSS (misalnya flexbox) dipakai untuk mengaturnya berdampingan.",
`<style>
    * { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; margin: 0; }
    header, footer { background: #1d4ed8; color: white; padding: 12px; text-align: center; }
    nav { background: #dbeafe; padding: 8px; }
    .isi { display: flex; }
    main { flex: 3; padding: 12px; }
    aside { flex: 1; background: #f1f5f9; padding: 12px; }
</style>

<header><h2>Judul Situs</h2></header>
<nav>Beranda | Materi | Kontak</nav>
<div class="isi">
    <main>Konten utama halaman.</main>
    <aside>Sidebar</aside>
</div>
<footer>Footer</footer>`],

["Responsive", "Web responsif menyesuaikan tampilan dengan ukuran layar. Kuncinya: meta viewport di <head>, ukuran fleksibel (persen atau max-width), dan media query CSS. Ubah lebar jendela atau layar HP untuk melihat perubahannya.",
`<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        img { max-width: 100%; height: auto; }
        .kotak { background: #bbf7d0; padding: 16px; }
        @media (max-width: 600px) {
            .kotak { background: #fecaca; }
        }
    </style>
</head>
<body>
    <div class="kotak">Hijau di layar lebar, merah di layar sempit (maks 600px).</div>
    <img src="https://placehold.co/800x200" alt="Gambar yang mengecil mengikuti layar">
</body>
</html>`],

["Semantics", "Elemen semantik punya makna yang jelas, misalnya <header>, <nav>, <main>, <section>, <article>, <aside>, dan <footer>. Selain lebih rapi dibanding div biasa, elemen ini membantu screen reader dan mesin pencari memahami halaman.",
`<header>
    <h1>Blog Coding</h1>
    <nav><a href="#">Beranda</a> | <a href="#">Tentang</a></nav>
</header>

<main>
    <article>
        <h2>Belajar HTML Semantik</h2>
        <p>Artikel adalah konten yang berdiri sendiri.</p>
    </article>

    <section>
        <h2>Tips Singkat</h2>
        <p>Section mengelompokkan bagian bertema sama.</p>
    </section>

    <aside>
        <p>Aside berisi informasi tambahan.</p>
    </aside>
</main>

<footer>
    <p>&copy; 2026 CodeLearn</p>
</footer>`],

["Entities", "Entitas HTML dipakai untuk menampilkan karakter khusus. Karakter seperti < dan > tidak boleh ditulis langsung karena dianggap tag, jadi tulis &lt; dan &gt;. Entitas dimulai dengan & dan diakhiri ;.",
`<p>Menulis tag: &lt;p&gt;Halo&lt;/p&gt;</p>
<p>Tanda dan: Tom &amp; Jerry</p>
<p>Tanda kutip: &quot;Halo&quot;</p>
<p>Spasi yang    tidak digabung:&nbsp;&nbsp;&nbsp;tiga spasi</p>
<p>Hak cipta: &copy; CodeLearn</p>`],

["Symbols", "Simbol yang tidak ada di keyboard dapat ditulis dengan nama entitas (&euro;), kode desimal (&#8364;), atau kode heksadesimal (&#x20AC;). Ketiganya menghasilkan simbol yang sama.",
`<p>Euro: &euro; &#8364; &#x20AC;</p>
<p>Hak cipta dan merek: &copy; &reg; &trade;</p>
<p>Matematika: &plusmn; &times; &divide; &ne; &le; &ge; &pi;</p>
<p>Panah: &larr; &rarr; &uarr; &darr;</p>
<p>Lainnya: &hearts; &#9733; &#9731;</p>`],

["Emojis", "Emoji adalah karakter Unicode. Asalkan halaman memakai <meta charset=\"UTF-8\">, emoji bisa langsung diketik atau ditulis dengan kode desimal seperti &#128512;. Ukurannya mengikuti ukuran teks.",
`<h1>Emoji di HTML 🚀</h1>
<p>Langsung diketik: 😀 🎉 💻</p>
<p>Kode desimal: &#128512; &#128640; &#128187;</p>
<p>Kode heksadesimal: &#x1F389;</p>
<p style="font-size: 48px;">🌍 🐍 ☕</p>`],

["Forms", "Formulir (<form>) mengumpulkan data dari pengguna. Atribut action menentukan tujuan data dan method menentukan cara kirim (GET atau POST). Setiap kolom diberi <label> yang terhubung lewat for dan id. Pada contoh ini pengiriman dicegah agar hasilnya tampil di halaman.",
`<form id="form" action="/kirim" method="post">
    <label for="nama">Nama:</label><br>
    <input type="text" id="nama" name="nama"><br><br>

    <label for="email">Email:</label><br>
    <input type="email" id="email" name="email"><br><br>

    <button type="submit">Kirim</button>
</form>

<p id="hasil"></p>

<script>
    document.getElementById("form").addEventListener("submit", function (e) {
        e.preventDefault();
        document.getElementById("hasil").textContent =
            "Halo " + this.nama.value + " (" + this.email.value + ")";
    });
</script>`],

["Form Attributes", "Atribut penting pada <form>: action (alamat tujuan), method (get atau post), target (tempat hasil tampil), autocomplete (on/off), novalidate (matikan validasi bawaan), dan enctype (jenis data, misalnya multipart/form-data untuk upload file).",
`<form action="/kirim" method="post" target="_self" autocomplete="off" enctype="multipart/form-data"
      onsubmit="event.preventDefault(); document.getElementById('info').textContent = 'Validasi lolos, form siap dikirim.';">

    <label>Username (wajib):
        <input type="text" name="user" required>
    </label><br><br>

    <label>Foto profil:
        <input type="file" name="foto">
    </label><br><br>

    <button>Kirim</button>
</form>
<p id="info">Kosongkan username lalu klik Kirim untuk melihat validasi.</p>`],

["Form Elements", "Elemen formulir yang umum: <input>, <select> dengan <option>, <textarea> untuk teks panjang, <button>, <datalist> untuk saran isian, <fieldset> dengan <legend> untuk mengelompokkan, dan <output> untuk menampilkan hasil.",
`<form>
    <fieldset>
        <legend>Data Siswa</legend>

        <label>Kelas:
            <select name="kelas">
                <option value="10">Kelas 10</option>
                <option value="11" selected>Kelas 11</option>
                <option value="12">Kelas 12</option>
            </select>
        </label><br><br>

        <label>Kota:
            <input list="kota" name="kota">
            <datalist id="kota">
                <option value="Medan">
                <option value="Jakarta">
                <option value="Bandung">
            </datalist>
        </label><br><br>

        <label>Catatan:<br>
            <textarea name="catatan" rows="3" cols="30">Tulis catatan...</textarea>
        </label><br><br>

        <button type="button">Tombol biasa</button>
    </fieldset>
</form>`],

["Input Types", "Atribut type pada <input> menentukan jenis kolom: text, password, email, number, date, color, range, checkbox, radio, file, dan lainnya. Tampilan di HP juga menyesuaikan, misalnya keyboard angka untuk type number.",
`<form>
    <p>Teks: <input type="text" placeholder="Nama"></p>
    <p>Password: <input type="password" placeholder="Kata sandi"></p>
    <p>Email: <input type="email" placeholder="nama@contoh.com"></p>
    <p>Angka: <input type="number" min="1" max="10" value="5"></p>
    <p>Tanggal: <input type="date"></p>
    <p>Warna: <input type="color" value="#3b82f6"></p>
    <p>Slider: <input type="range" min="0" max="100" value="40"></p>
    <p>Checkbox: <input type="checkbox" checked> Setuju</p>
    <p>Radio:
        <input type="radio" name="jk" value="L" checked> Laki-laki
        <input type="radio" name="jk" value="P"> Perempuan
    </p>
</form>`],

["Input Attributes", "Atribut input yang sering dipakai: value (isi awal), placeholder (petunjuk), required (wajib diisi), readonly (tidak bisa diubah), disabled (nonaktif), maxlength, min/max, pattern (aturan regex), dan autofocus.",
`<form onsubmit="event.preventDefault(); document.getElementById('info').textContent = 'Form valid!';">
    <p>Value awal: <input type="text" value="CodeLearn"></p>
    <p>Placeholder: <input type="text" placeholder="Ketik di sini"></p>
    <p>Readonly: <input type="text" value="Tidak bisa diubah" readonly></p>
    <p>Disabled: <input type="text" value="Nonaktif" disabled></p>
    <p>Maks 5 huruf: <input type="text" maxlength="5"></p>
    <p>Kode 3 angka: <input type="text" pattern="[0-9]{3}" title="Isi tepat 3 angka" required></p>
    <button>Cek</button>
</form>
<p id="info"></p>`],

["Canvas", "<canvas> adalah area gambar yang dikendalikan JavaScript. Ambil konteksnya dengan getContext(\"2d\"), lalu gambar bentuk dengan fillRect, arc, lineTo, dan teks dengan fillText.",
`<canvas id="kanvas" width="320" height="160" style="border: 1px solid #888;"></canvas>

<script>
    const ctx = document.getElementById("kanvas").getContext("2d");

    ctx.fillStyle = "royalblue";
    ctx.fillRect(20, 20, 120, 70);

    ctx.beginPath();
    ctx.arc(230, 55, 35, 0, Math.PI * 2);
    ctx.fillStyle = "tomato";
    ctx.fill();

    ctx.font = "18px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Halo Canvas!", 100, 130);
</script>`],

["SVG", "SVG (Scalable Vector Graphics) adalah gambar vektor berbasis XML yang bisa ditulis langsung di HTML. Gambarnya tetap tajam di ukuran berapa pun. Bentuk dasarnya: <rect>, <circle>, <line>, <polygon>, dan <text>.",
`<svg width="300" height="160" viewBox="0 0 300 160" style="border: 1px solid #888;">
    <rect x="15" y="15" width="100" height="60" fill="royalblue" />
    <circle cx="190" cy="50" r="35" fill="tomato" stroke="black" stroke-width="3" />
    <polygon points="60,150 110,95 160,150" fill="seagreen" />
    <text x="190" y="140" font-size="18" fill="black">SVG</text>
</svg>`],

["Video", "<video> memutar video. Atribut controls menampilkan tombol putar, width/height mengatur ukuran, dan <source> menyediakan file video dalam beberapa format. Teks di dalam elemen tampil jika browser tidak mendukung video.",
`<video width="320" height="180" controls>
    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
    Browser kamu tidak mendukung tag video.
</video>

<p>Atribut lain: autoplay (dengan muted), loop, poster, preload.</p>`],

["Audio", "<audio> memutar suara. Atribut controls menampilkan pemutar, dan <source> menyediakan file dalam beberapa format (mp3, ogg, wav). Atribut loop mengulang audio, sedangkan autoplay biasanya diblokir browser kecuali audio dibisukan.",
`<audio controls>
    <source src="https://www.w3schools.com/html/horse.mp3" type="audio/mpeg">
    Browser kamu tidak mendukung tag audio.
</audio>

<p>Tekan tombol putar pada pemutar di atas.</p>`],

["Geolocation", "Geolocation API mengambil lokasi pengguna lewat navigator.geolocation.getCurrentPosition(). Browser selalu meminta izin pengguna dan hanya bekerja di HTTPS. Di preview ini izin lokasi mungkin diblokir, jadi kode menyiapkan fungsi penanganan error.",
`<button onclick="cariLokasi()">Cari lokasi saya</button>
<p id="lokasi">Lokasi belum dicari.</p>

<script>
    function cariLokasi() {
        const tampil = document.getElementById("lokasi");

        if (!navigator.geolocation) {
            tampil.textContent = "Browser tidak mendukung Geolocation.";
            return;
        }

        navigator.geolocation.getCurrentPosition(
            function (posisi) {
                tampil.textContent =
                    "Lat: " + posisi.coords.latitude + ", Lon: " + posisi.coords.longitude;
            },
            function (error) {
                tampil.textContent = "Gagal mengambil lokasi: " + error.message;
            }
        );
    }
</script>`],

["Drag/Drop", "Drag and Drop API membuat elemen bisa diseret. Beri atribut draggable=\"true\" pada elemen yang diseret, lalu tangani event dragstart (menyimpan data), dragover (mengizinkan drop dengan preventDefault), dan drop (memindahkan elemen).",
`<style>
    #zona { width: 220px; height: 90px; border: 2px dashed #888; padding: 8px; margin-bottom: 12px; }
    #benda { display: inline-block; padding: 10px 14px; background: #bfdbfe; cursor: grab; }
</style>

<div id="zona">Jatuhkan di sini</div>
<span id="benda" draggable="true">Seret saya</span>

<script>
    const zona = document.getElementById("zona");
    const benda = document.getElementById("benda");

    benda.addEventListener("dragstart", function (e) {
        e.dataTransfer.setData("text/plain", "benda");
    });

    zona.addEventListener("dragover", function (e) {
        e.preventDefault();
    });

    zona.addEventListener("drop", function (e) {
        e.preventDefault();
        zona.appendChild(benda);
    });
</script>`],

["Web Storage", "Web Storage menyimpan data di browser tanpa kedaluwarsa (localStorage) atau selama tab terbuka (sessionStorage). Data berupa pasangan kunci-nilai bertipe teks. Preview ini berjalan di sandbox sehingga storage diblokir; kode memakai try/catch. Coba kode ini di file HTML sendiri.",
`<button onclick="simpan()">Simpan nama</button>
<button onclick="baca()">Baca nama</button>
<button onclick="hapus()">Hapus nama</button>
<p id="info">Klik salah satu tombol.</p>

<script>
    const info = document.getElementById("info");

    function simpan() {
        try {
            localStorage.setItem("nama", "Budi");
            info.textContent = "Tersimpan: Budi";
        } catch (e) {
            info.textContent = "Storage diblokir di preview ini. Coba di file HTML sendiri.";
        }
    }

    function baca() {
        try {
            info.textContent = "Nama tersimpan: " + localStorage.getItem("nama");
        } catch (e) {
            info.textContent = "Storage diblokir di preview ini.";
        }
    }

    function hapus() {
        try {
            localStorage.removeItem("nama");
            info.textContent = "Data dihapus.";
        } catch (e) {
            info.textContent = "Storage diblokir di preview ini.";
        }
    }
</script>`]
];

/* ======================== CSS ======================== */
LESSONS.CSS = [
["Syntax", "Aturan CSS terdiri dari selector (elemen yang dipilih) dan blok deklarasi di dalam kurung kurawal. Setiap deklarasi berpola property: nilai; Contoh: h1 { color: royalblue; } mewarnai semua judul h1 menjadi biru.",
cssDoc(`h1 {
    color: royalblue;
    font-size: 32px;
}

p {
    color: #444;
    line-height: 1.6;
}`, `<h1>Aturan CSS</h1>
<p>Selector memilih elemen, deklarasi mengatur tampilannya.</p>`)],

["Selectors", "Selector memilih elemen yang akan diberi gaya: selector elemen (p), class (.penting), id (#utama), universal (*), dan pengelompokan dengan koma (h2, h3).",
cssDoc(`p { color: gray; }
.penting { font-weight: bold; color: crimson; }
#utama { background: lightyellow; padding: 8px; }
h2, h3 { color: seagreen; }`, `<h2>Judul 2</h2>
<h3>Judul 3</h3>
<p>Paragraf biasa (selector elemen)</p>
<p class="penting">Paragraf penting (selector class)</p>
<p id="utama">Paragraf ber-id (selector id)</p>`)],

["Colors", "Warna di CSS dapat berupa nama (tomato), HEX (#2e8b57), RGB, HSL, atau RGBA/HSLA dengan transparansi. Properti color mengatur warna teks dan background-color mengatur warna latar.",
cssDoc(`.kotak { padding: 10px; margin: 6px 0; color: white; }
.nama { background-color: tomato; }
.hex  { background-color: #2e8b57; }
.rgb  { background-color: rgb(65, 105, 225); }
.hsl  { background-color: hsl(280, 60%, 45%); }
.alpha { background-color: rgba(0, 0, 0, 0.5); }`, `<div class="kotak nama">Nama warna: tomato</div>
<div class="kotak hex">HEX: #2e8b57</div>
<div class="kotak rgb">RGB: rgb(65, 105, 225)</div>
<div class="kotak hsl">HSL: hsl(280, 60%, 45%)</div>
<div class="kotak alpha">RGBA: hitam 50% transparan</div>`)],

["Backgrounds", "Properti latar belakang: background-color (warna), background-image (gambar atau gradien), background-repeat, background-position, dan background-size. Gunakan singkatan background untuk menulis semuanya sekaligus.",
cssDoc(`.satu {
    height: 70px;
    background-color: lightskyblue;
}
.dua {
    height: 70px;
    background-image: linear-gradient(to right, #f97316, #facc15);
}
.tiga {
    height: 90px;
    background-color: #fef3c7;
    background-image: radial-gradient(circle, #f59e0b 20%, transparent 21%);
    background-size: 24px 24px;
}`, `<div class="satu">Warna polos</div>
<br>
<div class="dua">Gradien</div>
<br>
<div class="tiga">Pola titik dari gradien</div>`)],

["Borders", "Border dibuat dengan border-width, border-style (solid, dashed, dotted, double, dll.), dan border-color, atau singkatannya border. Border dapat diatur per sisi, misalnya border-bottom.",
cssDoc(`.kotak { padding: 10px; margin: 10px 0; }
.solid  { border: 3px solid royalblue; }
.dashed { border: 3px dashed tomato; }
.dotted { border: 3px dotted seagreen; }
.double { border: 6px double #333; }
.bawah  { border-bottom: 4px solid purple; }`, `<div class="kotak solid">solid</div>
<div class="kotak dashed">dashed</div>
<div class="kotak dotted">dotted</div>
<div class="kotak double">double</div>
<div class="kotak bawah">hanya border bawah</div>`)],

["Margins", "Margin adalah ruang di luar border yang memisahkan elemen dari elemen lain. Tulis margin: atas kanan bawah kiri, atau margin-top, margin-left, dst. Margin auto pada elemen ber-lebar tertentu membuatnya berada di tengah.",
cssDoc(`.kotak {
    background: #bfdbfe;
    padding: 8px;
}
.a { margin: 0 0 30px 0; }
.b { margin: 30px 0 0 40px; }
.tengah {
    width: 200px;
    margin: 20px auto;
    background: #fde68a;
    padding: 8px;
    text-align: center;
}`, `<div class="kotak a">Margin bawah 30px</div>
<div class="kotak b">Margin atas 30px, kiri 40px</div>
<div class="tengah">Margin auto: di tengah</div>`)],

["Padding", "Padding adalah ruang di dalam border, antara isi dan tepi elemen. Penulisannya sama seperti margin: padding: atas kanan bawah kiri. Padding ikut mewarnai latar elemen, tidak seperti margin.",
cssDoc(`.kotak {
    background: #bbf7d0;
    border: 2px solid seagreen;
    margin: 10px 0;
}
.tanpa { padding: 0; }
.sedang { padding: 15px; }
.besar { padding: 10px 40px; }`, `<div class="kotak tanpa">Tanpa padding</div>
<div class="kotak sedang">Padding 15px</div>
<div class="kotak besar">Padding 10px atas-bawah, 40px kiri-kanan</div>`)],

["Height/Width", "height dan width mengatur ukuran area isi elemen. Nilainya bisa piksel (px), persen (%), atau auto. Elemen block secara default selebar induknya (width: auto).",
cssDoc(`div {
    background: #fbcfe8;
    border: 2px solid #be185d;
    margin-bottom: 10px;
}
.tetap { width: 200px; height: 60px; }
.persen { width: 50%; height: 60px; }
.otomatis { width: auto; }`, `<div class="tetap">200px x 60px</div>
<div class="persen">Lebar 50% induk</div>
<div class="otomatis">Lebar auto (penuh)</div>`)],

["Box Model", "Setiap elemen adalah kotak dengan empat lapisan dari dalam ke luar: content, padding, border, dan margin. Dengan box-sizing: border-box, width sudah termasuk padding dan border sehingga ukuran lebih mudah dihitung.",
cssDoc(`div {
    width: 220px;
    padding: 20px;
    border: 5px solid royalblue;
    margin: 10px 0;
    background: #dbeafe;
}
.content-box { box-sizing: content-box; }
.border-box { box-sizing: border-box; }`, `<div class="content-box">content-box: total lebar 270px (220 + 40 + 10)</div>
<div class="border-box">border-box: total lebar tetap 220px</div>`)],

["Outline", "Outline adalah garis di luar border yang tidak memakan ruang dan tidak memengaruhi tata letak. outline-offset mengatur jaraknya dari tepi. Outline sering dipakai untuk menandai fokus pada elemen interaktif.",
cssDoc(`.kotak {
    margin: 24px;
    padding: 12px;
    border: 2px solid #666;
    outline: 3px dashed tomato;
    outline-offset: 8px;
}
input:focus {
    outline: 3px solid royalblue;
}`, `<div class="kotak">Kotak dengan border dan outline terpisah</div>
<input type="text" placeholder="Klik untuk melihat outline fokus">`)],

["Text", "Properti teks: color, text-align, text-decoration, text-transform, letter-spacing, word-spacing, line-height, dan text-indent. Properti ini mengatur warna, perataan, hiasan, dan jarak teks.",
cssDoc(`.tengah { text-align: center; color: royalblue; }
.garis { text-decoration: underline wavy tomato; }
.kapital { text-transform: uppercase; letter-spacing: 3px; }
.lega { line-height: 2; width: 320px; }
.indent { text-indent: 30px; }`, `<p class="tengah">Teks rata tengah</p>
<p class="garis">Teks bergaris bawah bergelombang</p>
<p class="kapital">teks huruf kapital</p>
<p class="lega">Teks dengan tinggi baris dua kali lipat agar lebih lega saat dibaca.</p>
<p class="indent">Paragraf dengan indentasi pada baris pertama.</p>`)],

["Fonts", "Properti font: font-family (jenis huruf, beri cadangan di belakang), font-size, font-weight (ketebalan), dan font-style (miring). Selalu akhiri daftar font-family dengan jenis umum seperti sans-serif atau serif.",
cssDoc(`.sans { font-family: Arial, Helvetica, sans-serif; }
.serif { font-family: Georgia, "Times New Roman", serif; }
.mono { font-family: "Courier New", monospace; }
.tebal { font-weight: 700; font-size: 22px; }
.miring { font-style: italic; font-size: 18px; }`, `<p class="sans">Teks dengan font sans-serif</p>
<p class="serif">Teks dengan font serif</p>
<p class="mono">Teks dengan font monospace</p>
<p class="tebal">Teks tebal dan besar</p>
<p class="miring">Teks miring</p>`)],

["Icons", "Ikon biasanya memakai library seperti Font Awesome atau Material Icons lewat tag <link>. Cara paling ringan adalah SVG inline: dengan fill=\"currentColor\", warna ikon otomatis mengikuti color teks di CSS.",
cssDoc(`.ikon {
    width: 32px;
    height: 32px;
    fill: currentColor;
    vertical-align: middle;
}
.merah { color: crimson; }
.biru { color: royalblue; font-size: 20px; }`, `<span class="merah">
    <svg class="ikon" viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9.5-9C0.5 8 3 4 6.5 4c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3C21 4 23.5 8 21.5 12 19 16.5 12 21 12 21z"/></svg>
    Ikon hati berwarna merah
</span>
<p class="biru">
    <svg class="ikon" viewBox="0 0 24 24"><path d="M12 2l3 7 7 .6-5.3 4.6 1.6 7L12 17.8 5.7 21.2l1.6-7L2 9.6 9 9z"/></svg>
    Ikon bintang mengikuti warna teks
</p>`)],

["Links", "Link punya empat keadaan yang dapat diberi gaya dengan pseudo-class: a:link (belum dikunjungi), a:visited (sudah dikunjungi), a:hover (kursor di atasnya), dan a:active (sedang diklik). Urutkan sesuai singkatan LoVe HAte.",
cssDoc(`a:link    { color: royalblue; text-decoration: none; }
a:visited { color: purple; }
a:hover   { color: tomato; text-decoration: underline; }
a:active  { color: green; }

.tombol {
    display: inline-block;
    padding: 10px 18px;
    background: royalblue;
    color: white;
    border-radius: 6px;
}
.tombol:hover { background: #1e40af; text-decoration: none; color: white; }`, `<p><a href="#">Link biasa, arahkan kursor ke sini</a></p>
<p><a class="tombol" href="#">Link bergaya tombol</a></p>`)],

["Lists", "Properti daftar: list-style-type (disc, circle, square, decimal, lower-alpha, none), list-style-position (inside/outside), dan list-style-image. Dengan list-style: none dan padding: 0 daftar bisa dijadikan dasar menu.",
cssDoc(`.kotak { list-style-type: square; }
.angka { list-style-type: upper-roman; }
.dalam { list-style-position: inside; background: #e0f2fe; }
.polos { list-style: none; padding: 0; }
.polos li { padding: 6px; border-bottom: 1px solid #ccc; }`, `<ul class="kotak"><li>Poin persegi</li><li>Poin persegi</li></ul>
<ol class="angka"><li>Angka romawi</li><li>Angka romawi</li></ol>
<ul class="dalam"><li>Poin di dalam kotak</li><li>Poin di dalam kotak</li></ul>
<ul class="polos"><li>Tanpa poin 1</li><li>Tanpa poin 2</li></ul>`)],

["Tables", "Tabel dapat dirapikan dengan border-collapse: collapse (menggabungkan border), padding pada sel, warna selang-seling lewat tr:nth-child(even), dan efek hover pada baris.",
cssDoc(`table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
th { background: #1d4ed8; color: white; }
tr:nth-child(even) { background: #f1f5f9; }
tr:hover td { background: #fef3c7; }`, `<table>
    <tr><th>Bahasa</th><th>Fungsi</th></tr>
    <tr><td>HTML</td><td>Struktur</td></tr>
    <tr><td>CSS</td><td>Tampilan</td></tr>
    <tr><td>JavaScript</td><td>Interaksi</td></tr>
    <tr><td>Python</td><td>Serba guna</td></tr>
</table>`)],

["Display", "display menentukan jenis kotak elemen: block (baris baru, selebar penuh), inline (mengalir dalam teks), inline-block (mengalir tetapi bisa diatur ukuran), none (disembunyikan dan tidak memakan ruang), serta flex dan grid untuk tata letak.",
cssDoc(`.kotak { background: #bfdbfe; padding: 6px; margin: 4px; }
.blok { display: block; }
.baris { display: inline; }
.baris-blok { display: inline-block; width: 90px; }
.hilang { display: none; }`, `<span class="kotak blok">display: block</span>
<span class="kotak baris">inline</span>
<span class="kotak baris">inline</span>
<span class="kotak baris-blok">inline-block</span>
<span class="kotak baris-blok">inline-block</span>
<span class="kotak hilang">Tidak terlihat (none)</span>`)],

["Max-width", "max-width membatasi lebar maksimum elemen: jika layar lebih sempit, elemen mengecil mengikuti layar; jika lebih lebar, elemen berhenti di batas. Berbeda dengan width tetap yang menyebabkan scroll horizontal di layar kecil.",
cssDoc(`.tetap {
    width: 600px;
    background: #fecaca;
    padding: 8px;
}
.fleksibel {
    max-width: 600px;
    background: #bbf7d0;
    padding: 8px;
    margin-top: 10px;
}`, `<div class="tetap">width: 600px (bisa melebihi layar kecil)</div>
<div class="fleksibel">max-width: 600px (mengecil di layar kecil)</div>`)],

["Position", "position mengatur cara penempatan: static (default), relative (bergeser dari posisi asal), absolute (relatif terhadap induk ber-position), fixed (menempel di layar), dan sticky (menempel saat di-scroll).",
cssDoc(`.induk {
    position: relative;
    height: 140px;
    background: #e2e8f0;
    border: 2px solid #64748b;
}
.relatif {
    position: relative;
    left: 20px;
    top: 10px;
    background: #bfdbfe;
    display: inline-block;
}
.mutlak {
    position: absolute;
    right: 10px;
    bottom: 10px;
    background: #fecaca;
    padding: 6px;
}`, `<div class="induk">
    <span class="relatif">relative: bergeser dari posisi asal</span>
    <span class="mutlak">absolute: pojok kanan bawah induk</span>
</div>`)],

["Z-index", "z-index mengatur urutan tumpukan elemen yang saling menimpa: angka lebih besar berada di depan. Properti ini hanya berfungsi pada elemen yang punya position selain static.",
cssDoc(`.kotak {
    position: absolute;
    width: 120px;
    height: 90px;
    color: white;
    padding: 6px;
}
.a { left: 20px; top: 20px; background: royalblue; z-index: 1; }
.b { left: 70px; top: 55px; background: tomato; z-index: 3; }
.c { left: 120px; top: 90px; background: seagreen; z-index: 2; }`, `<div class="kotak a">z-index: 1</div>
<div class="kotak b">z-index: 3 (paling depan)</div>
<div class="kotak c">z-index: 2</div>`)],

["Overflow", "overflow mengatur apa yang terjadi jika isi lebih besar dari kotaknya: visible (meluber), hidden (dipotong), scroll (selalu ada scrollbar), dan auto (scrollbar hanya jika perlu).",
cssDoc(`.kotak {
    width: 200px;
    height: 70px;
    border: 2px solid #475569;
    margin-bottom: 12px;
}
.visible { overflow: visible; }
.hidden { overflow: hidden; }
.auto { overflow: auto; }`, `<div class="kotak visible">visible: isi yang panjang ini akan meluber keluar dari kotak dan menimpa elemen di bawahnya.</div>
<div class="kotak hidden">hidden: isi yang panjang ini akan dipotong pada batas kotak sehingga sebagian tidak terlihat.</div>
<div class="kotak auto">auto: isi yang panjang ini membuat scrollbar muncul di dalam kotak sehingga bisa digulir.</div>`)],

["Float", "float memindahkan elemen ke kiri atau kanan sehingga teks mengalir di sekitarnya, awalnya dipakai untuk gambar dalam artikel. Gunakan clear untuk berhenti mengalir. Untuk layout modern, flexbox dan grid lebih disarankan.",
cssDoc(`.gambar {
    float: left;
    width: 90px;
    height: 90px;
    background: royalblue;
    color: white;
    margin: 0 12px 6px 0;
    display: grid;
    place-items: center;
}
.bersih { clear: both; }`, `<div class="gambar">Kotak</div>
<p>Teks ini mengalir di sebelah kanan kotak biru karena kotak tersebut memakai float: left. Ketika teks sudah lebih panjang dari kotak, baris berikutnya akan melingkar ke bawahnya. Itulah efek utama dari float.</p>
<p class="bersih">Paragraf ini memakai clear: both sehingga mulai di bawah kotak.</p>`)],

["Inline-block", "inline-block menggabungkan sifat inline (berjajar dalam satu baris) dan block (bisa diatur width, height, margin, dan padding). Cocok untuk tombol atau kartu yang berjajar.",
cssDoc(`.kartu {
    display: inline-block;
    width: 110px;
    height: 70px;
    background: #fde68a;
    border: 2px solid #b45309;
    margin: 4px;
    text-align: center;
    line-height: 70px;
}`, `<div class="kartu">Kartu 1</div>
<div class="kartu">Kartu 2</div>
<div class="kartu">Kartu 3</div>
<div class="kartu">Kartu 4</div>`)],

["Align", "Cara menengahkan: margin: auto untuk elemen block ber-lebar tertentu, text-align: center untuk isi teks, dan display: flex dengan justify-content serta align-items untuk menengahkan secara horizontal dan vertikal.",
cssDoc(`.kotak { background: #e0f2fe; border: 2px solid #0284c7; margin-bottom: 10px; }
.horizontal { width: 200px; margin: 0 auto; text-align: center; }
.tengah-penuh {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}`, `<div class="kotak horizontal">margin auto + text-align center</div>
<div class="kotak tengah-penuh">Tengah horizontal dan vertikal (flex)</div>`)],

["Combinators", "Combinator menghubungkan selector: spasi (turunan, semua level), > (anak langsung), + (saudara tepat setelahnya), dan ~ (semua saudara setelahnya).",
cssDoc(`.kotak p { color: royalblue; }
.kotak > span { background: #fde68a; }
h3 + p { color: crimson; font-weight: bold; }
h3 ~ small { color: seagreen; }`, `<div class="kotak">
    <p>p turunan dari .kotak (biru)</p>
    <span>span anak langsung (latar kuning)</span>
</div>
<h3>Judul</h3>
<p>p tepat setelah h3 (merah tebal)</p>
<p>p kedua tidak terpengaruh</p>
<small>small saudara setelah h3 (hijau)</small>`)],

["Pseudo-class", "Pseudo-class memilih elemen berdasarkan keadaannya, misalnya :hover (kursor di atas), :focus (sedang aktif diisi), :first-child, :last-child, dan :nth-child(n) untuk urutan tertentu.",
cssDoc(`.tombol {
    padding: 10px 16px;
    background: royalblue;
    color: white;
    border: none;
    border-radius: 6px;
}
.tombol:hover { background: #1e3a8a; }
input:focus { outline: 3px solid orange; }

li:first-child { font-weight: bold; }
li:last-child { color: tomato; }
li:nth-child(even) { background: #f1f5f9; }`, `<button class="tombol">Arahkan kursor</button>
<input type="text" placeholder="Klik untuk fokus">
<ul>
    <li>Pertama (tebal)</li>
    <li>Kedua (genap)</li>
    <li>Ketiga</li>
    <li>Keempat (genap)</li>
    <li>Terakhir (merah)</li>
</ul>`)],

["Pseudo-elements", "Pseudo-element menata bagian tertentu dari elemen: ::first-letter, ::first-line, ::before dan ::after (menyisipkan konten lewat properti content), serta ::selection (teks yang diblok). Ditulis dengan dua titik dua.",
cssDoc(`p::first-letter { font-size: 2.2em; color: tomato; font-weight: bold; }
p::first-line { color: royalblue; }
.tugas::before { content: "✔ "; color: seagreen; }
.tugas::after { content: " (selesai)"; color: gray; font-size: 0.8em; }
::selection { background: #fde047; color: black; }`, `<p>Huruf pertama paragraf ini besar dan berwarna. Baris pertamanya juga memiliki warna berbeda dari sisanya. Blok teks ini untuk melihat efek seleksi.</p>
<p class="tugas">Belajar CSS</p>`)],

["Opacity", "opacity mengatur transparansi seluruh elemen (termasuk isinya) dari 0 (transparan) sampai 1 (solid). Jika hanya latar yang ingin transparan, gunakan rgba() pada background-color.",
cssDoc(`.dasar { background: royalblue; color: white; padding: 12px; margin: 6px 0; }
.setengah { opacity: 0.5; }
.rendah { opacity: 0.2; }
.rgba { background: rgba(65, 105, 225, 0.4); color: black; }
.gambar:hover { opacity: 1; }
.gambar { opacity: 0.6; transition: opacity .3s; }`, `<div class="dasar">Opacity 1 (normal)</div>
<div class="dasar setengah">Opacity 0.5 (teks ikut pudar)</div>
<div class="dasar rendah">Opacity 0.2</div>
<div class="dasar rgba">Hanya latar yang transparan (rgba)</div>
<div class="dasar gambar">Arahkan kursor: opacity jadi 1</div>`)],

["Navigation Bar", "Navbar horizontal dibuat dari daftar <ul> yang tanda poinnya dihilangkan, lalu item dijajarkan dengan display: flex. Beri efek hover agar interaktif.",
cssDoc(`ul.nav {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    background: #1e293b;
}
ul.nav a {
    display: block;
    padding: 14px 18px;
    color: #e2e8f0;
    text-decoration: none;
}
ul.nav a:hover { background: #2563eb; color: white; }
ul.nav a.aktif { background: #0f172a; border-bottom: 3px solid #38bdf8; }`, `<ul class="nav">
    <li><a class="aktif" href="#">Beranda</a></li>
    <li><a href="#">Materi</a></li>
    <li><a href="#">Latihan</a></li>
    <li><a href="#">Kontak</a></li>
</ul>`)],

["Dropdowns", "Dropdown dibuat dengan menyembunyikan isi menu (display: none) dan memunculkannya saat induknya di-hover. Induk diberi position: relative, sedangkan menu memakai position: absolute agar muncul di bawah tombol.",
cssDoc(`.dropdown { position: relative; display: inline-block; }
.tombol {
    background: #2563eb; color: white;
    padding: 10px 16px; border: none; border-radius: 6px;
}
.menu {
    display: none;
    position: absolute;
    min-width: 160px;
    background: white;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    z-index: 1;
}
.menu a { display: block; padding: 10px 14px; color: #0f172a; text-decoration: none; }
.menu a:hover { background: #e0e7ff; }
.dropdown:hover .menu { display: block; }`, `<div class="dropdown">
    <button class="tombol">Pilih bahasa ▾</button>
    <div class="menu">
        <a href="#">HTML</a>
        <a href="#">CSS</a>
        <a href="#">JavaScript</a>
    </div>
</div>`)],

["Forms", "Formulir dapat dirapikan dengan CSS: atur width, padding, border, border-radius pada input, gunakan :focus untuk menandai kolom aktif, dan beri gaya pada tombol submit. box-sizing: border-box membuat lebar kolom pas.",
cssDoc(`form { max-width: 320px; }
label { display: block; margin: 12px 0 4px; font-weight: bold; }
input, textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    border: 2px solid #cbd5e1;
    border-radius: 8px;
    font-size: 16px;
}
input:focus, textarea:focus { border-color: #2563eb; outline: none; }
button {
    margin-top: 14px;
    padding: 10px 18px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 8px;
}`, `<form>
    <label for="n">Nama</label>
    <input id="n" type="text" placeholder="Nama lengkap">
    <label for="p">Pesan</label>
    <textarea id="p" rows="3" placeholder="Tulis pesan"></textarea>
    <button type="button">Kirim</button>
</form>`)],

["Counters", "CSS counter membuat penomoran otomatis tanpa HTML <ol>: counter-reset menyiapkan penghitung, counter-increment menambahnya, dan fungsi counter() pada properti content menampilkannya.",
cssDoc(`body { counter-reset: bagian; }
h3 { counter-reset: sub; }
h3::before {
    counter-increment: bagian;
    content: "Bagian " counter(bagian) ". ";
    color: royalblue;
}
p::before {
    counter-increment: sub;
    content: counter(bagian) "." counter(sub) " ";
    color: gray;
}`, `<h3>Pengenalan</h3>
<p>Penjelasan pertama</p>
<p>Penjelasan kedua</p>
<h3>Praktik</h3>
<p>Latihan pertama</p>
<p>Latihan kedua</p>`)],

["Units", "Satuan absolut: px. Satuan relatif: % (terhadap induk), em (terhadap ukuran font elemen), rem (terhadap ukuran font root), vw dan vh (persen lebar dan tinggi layar). Satuan relatif membuat tampilan lebih fleksibel.",
cssDoc(`html { font-size: 16px; }
.px  { font-size: 20px; }
.em  { font-size: 1.5em; }
.rem { font-size: 2rem; }
.persen { width: 60%; background: #bfdbfe; }
.vw { width: 50vw; background: #fde68a; }`, `<p class="px">20px</p>
<p class="em">1.5em (24px)</p>
<p class="rem">2rem (32px)</p>
<div class="persen">Lebar 60% dari induk</div>
<br>
<div class="vw">Lebar 50vw (setengah lebar layar)</div>`)],

["Specificity", "Jika beberapa aturan mengenai elemen yang sama, aturan dengan spesifisitas tertinggi menang: inline style > id > class/atribut/pseudo-class > elemen. Jika sama kuat, aturan yang ditulis paling akhir yang dipakai. !important mengalahkan semuanya, tetapi sebaiknya dihindari.",
cssDoc(`p { color: gray; }
.kelas { color: royalblue; }
#idku { color: crimson; }
p.kelas.dua { color: seagreen; }`, `<p>Elemen saja: abu-abu</p>
<p class="kelas">Class mengalahkan elemen: biru</p>
<p class="kelas" id="idku">Id mengalahkan class: merah</p>
<p class="kelas" id="idku" style="color: orange;">Inline mengalahkan id: oranye</p>
<p class="kelas dua">Dua class mengalahkan satu class: hijau</p>`)],

["Math Functions", "CSS punya fungsi matematika: calc() untuk menghitung campuran satuan, min() dan max() untuk memilih nilai terkecil atau terbesar, dan clamp(min, ideal, max) untuk nilai yang dibatasi. Cocok untuk ukuran responsif.",
cssDoc(`.calc  { width: calc(100% - 80px); background: #bfdbfe; padding: 8px; }
.min   { width: min(90%, 300px); background: #bbf7d0; padding: 8px; margin-top: 8px; }
.max   { width: max(50%, 200px); background: #fde68a; padding: 8px; margin-top: 8px; }
.clamp { font-size: clamp(16px, 4vw, 32px); margin-top: 8px; }`, `<div class="calc">calc(100% - 80px)</div>
<div class="min">min(90%, 300px)</div>
<div class="max">max(50%, 200px)</div>
<p class="clamp">clamp: ukuran huruf tumbuh dengan layar tetapi dibatasi 16px sampai 32px</p>`)],

["Rounded Corners", "border-radius membulatkan sudut elemen. Satu nilai berlaku untuk empat sudut; nilai 50% pada kotak persegi menghasilkan lingkaran; empat nilai mengatur kiri-atas, kanan-atas, kanan-bawah, kiri-bawah secara berurutan.",
cssDoc(`.kotak {
    display: inline-block;
    width: 100px;
    height: 70px;
    background: royalblue;
    margin: 6px;
    color: white;
    text-align: center;
    line-height: 70px;
}
.kecil { border-radius: 8px; }
.pil { border-radius: 35px; }
.lingkaran { width: 70px; border-radius: 50%; }
.campur { border-radius: 30px 0 30px 0; }`, `<div class="kotak kecil">8px</div>
<div class="kotak pil">pil</div>
<div class="kotak lingkaran">50%</div>
<div class="kotak campur">campur</div>`)],

["Shadows", "box-shadow memberi bayangan pada kotak (offset-x, offset-y, blur, spread, warna), sedangkan text-shadow memberi bayangan pada teks. Beberapa bayangan dapat digabung dengan koma.",
cssDoc(`body { background: #f1f5f9; padding: 20px; }
.kartu {
    background: white;
    padding: 18px;
    border-radius: 12px;
    margin-bottom: 20px;
}
.lembut { box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15); }
.tegas  { box-shadow: 6px 6px 0 #1e293b; }
h2 { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.35); }`, `<h2>Judul dengan text-shadow</h2>
<div class="kartu lembut">Bayangan lembut</div>
<div class="kartu tegas">Bayangan tegas tanpa blur</div>`)],

["Gradients", "Gradien adalah transisi warna yang dibuat dengan linear-gradient() (garis lurus dengan arah atau sudut), radial-gradient() (memancar dari titik), dan conic-gradient() (mengelilingi pusat).",
cssDoc(`div { height: 70px; margin-bottom: 10px; color: white; padding: 10px; }
.linear { background: linear-gradient(to right, #2563eb, #9333ea); }
.sudut { background: linear-gradient(135deg, #f97316, #ec4899, #8b5cf6); }
.radial { background: radial-gradient(circle, #fde047, #f97316); color: black; }
.conic { background: conic-gradient(red, yellow, green, cyan, blue, magenta, red); }`, `<div class="linear">linear-gradient ke kanan</div>
<div class="sudut">linear-gradient 135 derajat, tiga warna</div>
<div class="radial">radial-gradient</div>
<div class="conic">conic-gradient</div>`)],

["Transitions", "Transisi membuat perubahan properti berjalan halus. Tentukan properti yang dianimasikan, durasi, dan fungsi waktu, misalnya transition: all 0.3s ease. Perubahan dipicu oleh keadaan baru seperti :hover.",
cssDoc(`.kotak {
    width: 100px;
    height: 70px;
    background: royalblue;
    border-radius: 6px;
    transition: width 0.4s ease, background 0.4s ease, transform 0.4s ease;
}
.kotak:hover {
    width: 240px;
    background: tomato;
    transform: rotate(3deg);
}`, `<div class="kotak"></div>
<p>Arahkan kursor ke kotak biru (di HP: tekan dan tahan).</p>`)],

["Animations", "Animasi CSS memakai @keyframes untuk mendefinisikan tahapan, lalu properti animation (nama, durasi, pengulangan) untuk menerapkannya. Tidak butuh interaksi, bisa berjalan otomatis dan berulang.",
cssDoc(`@keyframes gerak {
    0%   { transform: translateX(0); background: royalblue; }
    50%  { transform: translateX(180px); background: tomato; }
    100% { transform: translateX(0); background: royalblue; }
}
.bola {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    animation: gerak 2.5s ease-in-out infinite;
}`, `<div class="bola"></div>`)],

["Flexbox", "Flexbox mengatur elemen dalam satu baris atau kolom. Aktifkan dengan display: flex pada wadah, lalu atur arah (flex-direction), perataan utama (justify-content), perataan silang (align-items), jarak (gap), dan pembagian ruang pada item (flex).",
cssDoc(`.wadah {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    height: 120px;
    background: #e2e8f0;
    padding: 10px;
}
.item { background: royalblue; color: white; padding: 14px; border-radius: 6px; }
.lebar { flex: 2; text-align: center; }`, `<div class="wadah">
    <div class="item">Satu</div>
    <div class="item lebar">Dua (flex: 2)</div>
    <div class="item">Tiga</div>
</div>`)],

["CSS Grid", "CSS Grid mengatur tata letak dua dimensi (baris dan kolom). Aktifkan dengan display: grid, lalu tentukan kolom lewat grid-template-columns (satuan fr membagi ruang), jarak dengan gap, dan penggabungan sel dengan grid-column atau grid-row.",
cssDoc(`.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}
.sel { background: #a7f3d0; padding: 18px; text-align: center; border-radius: 6px; }
.lebar { grid-column: span 2; background: #fde68a; }`, `<div class="grid">
    <div class="sel">1</div>
    <div class="sel">2</div>
    <div class="sel">3</div>
    <div class="sel lebar">4 (menggabung 2 kolom)</div>
    <div class="sel">5</div>
</div>`)],

["Media Queries", "Media query menerapkan CSS hanya jika kondisi terpenuhi, misalnya lebar layar. Dengan @media (max-width: 600px) kita membuat tampilan khusus layar kecil. Perkecil jendela atau buka di HP untuk melihat perubahan warna dan susunan.",
cssDoc(`.wadah { display: flex; gap: 10px; }
.kotak { flex: 1; padding: 20px; color: white; background: royalblue; text-align: center; }

@media (max-width: 600px) {
    .wadah { flex-direction: column; }
    .kotak { background: tomato; }
}`, `<div class="wadah">
    <div class="kotak">Kotak 1</div>
    <div class="kotak">Kotak 2</div>
    <div class="kotak">Kotak 3</div>
</div>
<p>Layar lebar: tiga kotak biru berjajar. Layar sempit (maks 600px): bertumpuk dan merah.</p>`)]
];

/* ======================== JavaScript ======================== */
LESSONS.JavaScript = [
["Introduction", "JavaScript adalah bahasa pemrograman yang membuat halaman web interaktif. Kode dijalankan oleh browser, dan console.log() menampilkan hasil ke console (panel Output di bawah editor). Nama JavaScript sama sekali tidak berhubungan dengan Java.",
`console.log("Halo, JavaScript!");
console.log("1 + 2 =", 1 + 2);
console.log("Nama saya CodeLearn");`],

["Output", "JavaScript dapat menampilkan data lewat console.log() (console), innerHTML atau textContent (mengubah elemen HTML), document.write() (menulis ke halaman, hanya untuk percobaan), dan alert() (kotak pesan).",
`console.log("1. Menulis ke console");

document.getElementById("demo").innerHTML = "2. Menulis ke dalam elemen HTML";

document.write("<p>3. Menulis langsung ke dokumen</p>");

// alert("4. Kotak pesan (hapus tanda // untuk mencoba)");`],

["Statements", "Program JavaScript adalah kumpulan pernyataan (statement) yang dijalankan satu per satu dari atas ke bawah. Pernyataan biasanya diakhiri titik koma, dan beberapa pernyataan dapat dikelompokkan dalam blok { }.",
`let a = 5;
let b = 6;
let c = a + b;
console.log(c);

{
    let pesan = "Ini blok pernyataan";
    console.log(pesan);
}`],

["Syntax", "Sintaks JavaScript: nilai bisa literal (angka, teks) atau variabel, huruf besar-kecil dibedakan (nama dan Nama berbeda), dan penamaan variabel umumnya memakai camelCase seperti namaDepan. Pernyataan dipisah titik koma.",
`let namaDepan = "Budi";
let umur = 17;
let total = umur * 2;

console.log(namaDepan, umur, total);

// Huruf besar-kecil dibedakan:
let nama = "kecil";
let Nama = "besar";
console.log(nama, Nama);`],

["Comments", "Komentar tidak dijalankan dan berguna untuk catatan atau menonaktifkan kode. Komentar satu baris diawali //, sedangkan komentar banyak baris ditulis di antara /* dan */.",
`// Ini komentar satu baris
console.log("Baris ini dijalankan");

/*
  Ini komentar
  banyak baris
*/

// console.log("Baris ini tidak dijalankan");`],

["Variables", "Variabel adalah wadah penyimpan data. Deklarasikan dengan let (nilai bisa berubah), const (nilai tetap), atau var (cara lama). Beri nama yang jelas, diawali huruf, _ atau $, dan tidak boleh memakai kata kunci bahasa.",
`let nama = "Ani";
let umur = 16;
const pi = 3.14;

console.log(nama, umur, pi);

umur = 17;          // let boleh diubah
console.log(umur);`],

["Let", "let membuat variabel dengan cakupan blok { }: variabel hanya hidup di dalam blok tempatnya dibuat. Variabel let tidak boleh dideklarasikan ulang dengan nama yang sama di cakupan yang sama.",
`let x = 10;

{
    let x = 2;      // x berbeda, hanya hidup di blok ini
    console.log("Di dalam blok:", x);
}

console.log("Di luar blok:", x);

x = 20;             // boleh diubah nilainya
console.log(x);`],

["Const", "const membuat variabel yang tidak boleh diberi nilai baru. Namun isi objek atau array yang disimpan dengan const tetap boleh diubah, sebab yang dikunci hanyalah referensinya.",
`const PI = 3.14159;
console.log(PI);

const buah = ["apel", "jeruk"];
buah.push("mangga");        // isi array boleh diubah
console.log(buah);

try {
    buah = ["lain"];        // mengganti seluruh nilai: error
} catch (e) {
    console.log("Error:", e.message);
}`],

["Operators", "Operator dipakai untuk memproses nilai: aritmetika (+ - * / % **), penugasan (= += -=), perbandingan (== === != > <), logika (&& || !), dan operator teks + untuk menggabung string.",
`console.log(10 + 3);            // penjumlahan
console.log("Halo " + "Dunia");  // gabung teks
console.log(10 > 3);            // perbandingan
console.log(10 > 3 && 2 > 5);   // logika AND
console.log(true || false);     // logika OR
console.log(!true);             // logika NOT
console.log(5 > 3 ? "Ya" : "Tidak");   // operator ternary`],

["Arithmetic", "Operator aritmetika: + (tambah), - (kurang), * (kali), / (bagi), % (sisa bagi), ** (pangkat), ++ (naik satu), dan -- (turun satu). Urutan prioritas sama seperti matematika; kurung dipakai untuk mengubahnya.",
`let a = 10;
let b = 3;

console.log(a + b);
console.log(a - b);
console.log(a * b);
console.log(a / b);
console.log(a % b);
console.log(a ** b);

a++;
console.log(a);
console.log((2 + 3) * 4);`],

["Assignment", "Operator penugasan menyimpan nilai ke variabel. Selain =, ada bentuk singkat: += -= *= /= %= **=. Contohnya x += 5 sama dengan x = x + 5.",
`let x = 10;

x += 5;
console.log(x);     // 15

x -= 3;
console.log(x);     // 12

x *= 2;
console.log(x);     // 24

x /= 4;
console.log(x);     // 6

x %= 4;
console.log(x);     // 2`],

["Data Types", "Tipe data dasar JavaScript: string (teks), number (angka), boolean (true/false), undefined (belum diberi nilai), null (sengaja kosong), bigint, dan symbol. Selain itu ada tipe objek, termasuk array dan fungsi. Gunakan typeof untuk mengeceknya.",
`console.log(typeof "teks");
console.log(typeof 42);
console.log(typeof true);
console.log(typeof undefined);
console.log(typeof null);        // hasil historis: "object"
console.log(typeof [1, 2, 3]);   // array bertipe object
console.log(typeof { a: 1 });
console.log(typeof 10n);`],

["Functions", "Fungsi adalah blok kode yang bisa dipanggil berulang kali. Dibuat dengan kata kunci function, boleh menerima parameter, dan mengembalikan nilai dengan return. Fungsi baru berjalan ketika dipanggil.",
`function tambah(a, b) {
    return a + b;
}

function sapa(nama = "teman") {
    return "Halo, " + nama + "!";
}

console.log(tambah(3, 4));
console.log(sapa("Budi"));
console.log(sapa());`],

["Objects", "Objek menyimpan data dalam pasangan kunci: nilai di dalam kurung kurawal. Nilainya bisa berupa tipe apa pun, termasuk fungsi. Akses nilai dengan titik (objek.kunci) atau kurung siku (objek[\"kunci\"]).",
`const siswa = {
    nama: "Ani",
    umur: 16,
    hobi: ["membaca", "coding"]
};

console.log(siswa);
console.log(siswa.nama);
console.log(siswa["umur"]);
console.log(siswa.hobi[1]);`],

["Object Properties", "Properti objek dapat ditambah, diubah, dan dihapus. Gunakan operator in atau hasOwnProperty untuk mengecek keberadaannya, serta Object.keys(), Object.values(), dan Object.entries() untuk membaca seluruh isinya.",
`const mobil = { merek: "Toyota", tahun: 2020 };

mobil.warna = "merah";     // tambah properti
mobil.tahun = 2024;        // ubah properti
delete mobil.merek;        // hapus properti

console.log(mobil);
console.log("warna" in mobil);
console.log(Object.keys(mobil));
console.log(Object.values(mobil));

for (const [kunci, nilai] of Object.entries(mobil)) {
    console.log(kunci + ": " + nilai);
}`],

["Object Methods", "Metode adalah fungsi yang menjadi properti objek. Di dalam metode, kata kunci this menunjuk ke objek pemiliknya sehingga metode dapat membaca properti objek yang sama.",
`const orang = {
    namaDepan: "Budi",
    namaBelakang: "Santoso",
    namaLengkap() {
        return this.namaDepan + " " + this.namaBelakang;
    },
    sapa: function () {
        return "Halo, saya " + this.namaDepan;
    }
};

console.log(orang.namaLengkap());
console.log(orang.sapa());`],

["Events", "Event adalah kejadian di halaman seperti klik, ketikan, atau pergerakan mouse. Pasang penanganan dengan addEventListener(jenisEvent, fungsi). Klik tombol pada preview untuk melihat hasilnya.",
`const tombol = document.getElementById("tombol");
const demo = document.getElementById("demo");
let hitung = 0;

tombol.addEventListener("click", function () {
    hitung++;
    demo.textContent = "Tombol diklik " + hitung + " kali";
    console.log("Klik ke-" + hitung);
});`],

["Strings", "String adalah teks di antara tanda petik tunggal, ganda, atau backtick. Template literal (backtick) mendukung penyisipan nilai dengan \${...} dan teks banyak baris. Properti length memberi panjang teks, dan karakter diakses dengan indeks mulai dari 0.",
`const nama = "CodeLearn";
const umur = 3;

console.log(nama.length);
console.log(nama[0]);

// Template literal
console.log(\`\${nama} sudah berumur \${umur} tahun\`);

// Karakter escape
console.log("Dia berkata: \\"Halo\\"");
console.log('Tanda petik tunggal: It\\'s ok');`],

["String Methods", "String punya banyak metode bawaan: toUpperCase(), toLowerCase(), indexOf(), includes(), slice(), replace(), trim(), split(), startsWith(), dan padStart(). String bersifat immutable: metode mengembalikan string baru.",
`const teks = "  Belajar JavaScript  ";

console.log(teks.trim());
console.log(teks.toUpperCase());
console.log(teks.includes("Java"));
console.log(teks.trim().slice(0, 7));
console.log(teks.replace("Belajar", "Menguasai"));
console.log("a,b,c".split(","));
console.log("7".padStart(3, "0"));`],

["Numbers", "JavaScript hanya punya satu tipe angka (number) untuk bilangan bulat maupun desimal. Ada nilai khusus NaN (bukan angka) dan Infinity. Gunakan toFixed() untuk membatasi desimal, dan Number.isInteger() untuk mengecek bilangan bulat.",
`console.log(10 + 5.5);
console.log(0.1 + 0.2);                 // masalah presisi desimal
console.log((0.1 + 0.2).toFixed(2));
console.log(10 / 0);
console.log("abc" * 2);                 // NaN
console.log(Number.isInteger(5));
console.log(Number.MAX_SAFE_INTEGER);
console.log(255..toString(16));         // basis 16`],

["BigInt", "BigInt menyimpan bilangan bulat yang sangat besar, lebih dari batas aman number. Tulis dengan akhiran n atau BigInt(). BigInt tidak bisa dicampur langsung dengan number dalam operasi aritmetika.",
`const besar = 9007199254740993n;
console.log(besar);
console.log(besar + 2n);
console.log(Number.MAX_SAFE_INTEGER);
console.log(typeof besar);

console.log(BigInt(100) * 2n);

try {
    console.log(besar + 1);     // mencampur BigInt dan number
} catch (e) {
    console.log("Error:", e.message);
}`],

["Arrays", "Array menyimpan banyak nilai berurutan dalam satu variabel, ditulis di dalam kurung siku. Indeks dimulai dari 0, dan properti length memberi jumlah elemen. Elemen bisa bertipe berbeda.",
`const buah = ["apel", "jeruk", "mangga"];

console.log(buah);
console.log(buah[0]);
console.log(buah.length);

buah[1] = "pisang";
console.log(buah);
console.log(buah[buah.length - 1]);     // elemen terakhir
console.log(Array.isArray(buah));`],

["Array Methods", "Metode array yang sering dipakai: push() dan pop() (ujung belakang), unshift() dan shift() (ujung depan), slice() (potong salinan), splice() (ubah isi), concat(), join(), indexOf(), dan includes().",
`const angka = [1, 2, 3];

angka.push(4);
angka.unshift(0);
console.log(angka);

angka.pop();
angka.shift();
console.log(angka);

console.log(angka.join(" - "));
console.log(angka.slice(1, 3));
console.log(angka.concat([9, 10]));
console.log(angka.includes(2));`],

["Array Sort", "sort() mengurutkan array di tempat, tetapi secara default membandingkan sebagai teks sehingga angka bisa salah urut. Untuk angka, berikan fungsi pembanding: (a, b) => a - b untuk naik, b - a untuk turun. reverse() membalik urutan.",
`const nama = ["Cici", "Ani", "Budi"];
nama.sort();
console.log(nama);

const angka = [40, 100, 1, 5, 25, 10];

angka.sort();
console.log("Urutan teks (salah):", angka);

angka.sort((a, b) => a - b);
console.log("Naik:", angka);

angka.sort((a, b) => b - a);
console.log("Turun:", angka);`],

["Array Iteration", "Metode iterasi array menjalankan fungsi untuk setiap elemen: forEach() (menjalankan), map() (mengubah jadi array baru), filter() (menyaring), reduce() (menggabung jadi satu nilai), find() (mencari pertama), some() dan every() (cek kondisi).",
`const angka = [1, 2, 3, 4, 5];

angka.forEach(n => console.log("Angka:", n));

console.log(angka.map(n => n * 2));
console.log(angka.filter(n => n % 2 === 0));
console.log(angka.reduce((total, n) => total + n, 0));
console.log(angka.find(n => n > 3));
console.log(angka.some(n => n > 4));
console.log(angka.every(n => n > 0));`],

["Dates", "Objek Date mengelola tanggal dan waktu. Buat dengan new Date() (sekarang) atau new Date(tahun, bulan, tanggal). Bulan dimulai dari 0 (Januari = 0). Gunakan getFullYear(), getMonth(), getDate(), getDay(), dan toLocaleDateString() untuk memformat.",
`const sekarang = new Date();
console.log("Tahun sekarang:", sekarang.getFullYear());

const tanggal = new Date(2026, 0, 15);   // 15 Januari 2026
console.log(tanggal.getFullYear());
console.log(tanggal.getMonth());          // 0 = Januari
console.log(tanggal.getDate());
console.log(tanggal.getDay());            // 0 = Minggu

console.log(tanggal.toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
}));`],

["Math", "Objek Math menyediakan fungsi matematika: Math.round(), floor(), ceil(), trunc(), abs(), sqrt(), pow(), max(), min(), serta konstanta Math.PI. Math bukan konstruktor, jadi langsung dipakai tanpa new.",
`console.log(Math.round(4.6));
console.log(Math.floor(4.9));
console.log(Math.ceil(4.1));
console.log(Math.abs(-7));
console.log(Math.sqrt(64));
console.log(Math.pow(2, 8));
console.log(Math.max(3, 9, 1));
console.log(Math.min(3, 9, 1));
console.log(Math.PI);`],

["Random", "Math.random() menghasilkan bilangan desimal acak dari 0 sampai kurang dari 1. Untuk bilangan bulat acak dalam rentang tertentu, kalikan lalu bulatkan dengan Math.floor(). Jalankan beberapa kali untuk melihat hasil berbeda.",
`console.log(Math.random());

// Bilangan bulat acak 0 sampai 9
console.log(Math.floor(Math.random() * 10));

// Fungsi bilangan acak antara min dan max (inklusif)
function acak(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log("Dadu:", acak(1, 6));
console.log("Angka 50-100:", acak(50, 100));`],

["Booleans", "Boolean hanya bernilai true atau false. Hasil perbandingan selalu boolean. Dalam kondisi, nilai tertentu dianggap false (falsy): false, 0, \"\", null, undefined, dan NaN; selain itu dianggap true (truthy).",
`console.log(10 > 9);
console.log(10 === 9);

console.log(Boolean(0));
console.log(Boolean(""));
console.log(Boolean(null));
console.log(Boolean("teks"));
console.log(Boolean(5));
console.log(Boolean([]));       // array kosong tetap truthy`],

["Comparisons", "Operator perbandingan: == (sama nilai, dengan konversi tipe), === (sama nilai dan tipe), != dan !==, >, <, >=, <=. Disarankan memakai === dan !== agar hasil tidak mengejutkan akibat konversi tipe otomatis.",
`console.log(5 == "5");      // true: tipe dikonversi
console.log(5 === "5");     // false: tipe berbeda
console.log(5 != "5");
console.log(5 !== "5");
console.log(10 >= 10);
console.log("a" < "b");
console.log(null == undefined);
console.log(null === undefined);`],

["If Else", "Struktur if...else menjalankan kode berdasarkan kondisi. Pakai if untuk kondisi pertama, else if untuk kondisi lain, dan else sebagai pilihan terakhir bila tidak ada yang terpenuhi.",
`const nilai = 85;

if (nilai >= 90) {
    console.log("Sangat baik");
} else if (nilai >= 75) {
    console.log("Lulus");
} else {
    console.log("Belum lulus");
}`],

["Switch", "switch membandingkan satu nilai dengan beberapa case. Tiap case biasanya diakhiri break agar tidak lanjut ke case berikutnya, dan default dijalankan jika tidak ada case yang cocok.",
`const hari = 3;
let nama;

switch (hari) {
    case 1:
        nama = "Senin";
        break;
    case 2:
        nama = "Selasa";
        break;
    case 3:
        nama = "Rabu";
        break;
    default:
        nama = "Hari lain";
}

console.log(nama);`],

["Loop For", "Perulangan for terdiri dari tiga bagian: inisialisasi, kondisi, dan perubahan. Ada juga for...of untuk menelusuri nilai array dan for...in untuk menelusuri kunci objek.",
`for (let i = 1; i <= 5; i++) {
    console.log("Perulangan ke-" + i);
}

const buah = ["apel", "jeruk", "mangga"];
for (const b of buah) {
    console.log("Buah:", b);
}

const orang = { nama: "Ani", umur: 16 };
for (const kunci in orang) {
    console.log(kunci, "=", orang[kunci]);
}`],

["Loop While", "while mengulang selama kondisi bernilai true dan mengecek kondisi di awal. do...while mengecek di akhir sehingga isi dijalankan minimal satu kali. Pastikan ada perubahan yang akhirnya membuat kondisi false agar tidak berulang selamanya.",
`let i = 1;
while (i <= 3) {
    console.log("while:", i);
    i++;
}

let j = 10;
do {
    console.log("do...while:", j);   // tetap jalan sekali
    j++;
} while (j < 5);`],

["Break", "break menghentikan perulangan sepenuhnya, sedangkan continue melewati iterasi saat ini dan lanjut ke iterasi berikutnya. Keduanya sering dipakai bersama kondisi if.",
`for (let i = 1; i <= 10; i++) {
    if (i === 3) continue;      // lewati angka 3
    if (i === 6) break;         // berhenti di angka 6
    console.log(i);
}

console.log("Perulangan selesai");`],

["Sets", "Set menyimpan nilai unik, sehingga duplikat otomatis diabaikan. Metodenya: add(), has(), delete(), clear(), dan properti size. Set sering dipakai untuk menghapus duplikat dari array.",
`const huruf = new Set(["a", "b", "a", "c", "b"]);

console.log(huruf);
console.log(huruf.size);

huruf.add("d");
console.log(huruf.has("a"));
huruf.delete("a");
console.log([...huruf]);

const angka = [1, 2, 2, 3, 3, 3];
console.log([...new Set(angka)]);`],

["Maps", "Map menyimpan pasangan kunci-nilai dengan kunci bertipe apa pun dan mengingat urutan penambahan. Metodenya: set(), get(), has(), delete(), size, serta bisa ditelusuri dengan for...of.",
`const nilai = new Map();

nilai.set("Ani", 90);
nilai.set("Budi", 85);

console.log(nilai.get("Ani"));
console.log(nilai.has("Cici"));
console.log(nilai.size);

for (const [nama, skor] of nilai) {
    console.log(nama + " = " + skor);
}`],

["Typeof", "Operator typeof mengembalikan nama tipe suatu nilai dalam bentuk teks. Hasilnya: string, number, boolean, undefined, object, function, bigint, atau symbol. Perhatikan: typeof null menghasilkan object, dan array juga object (gunakan Array.isArray()).",
`console.log(typeof "Halo");
console.log(typeof 3.14);
console.log(typeof false);
console.log(typeof undefined);
console.log(typeof null);
console.log(typeof [1, 2]);
console.log(Array.isArray([1, 2]));
console.log(typeof function () {});
console.log(typeof Symbol("id"));`],

["Type Conversion", "JavaScript dapat mengubah tipe data secara manual (Number(), String(), Boolean(), parseInt(), parseFloat()) maupun otomatis saat operasi tertentu (type coercion). Hati-hati: operator + dengan teks menggabung, sedangkan - selalu mengubah ke angka.",
`console.log(Number("42"));
console.log(Number("abc"));         // NaN
console.log(parseInt("100px"));
console.log(parseFloat("3.14 meter"));
console.log(String(123) + "4");
console.log(Boolean("false"));      // teks tidak kosong = true

// Konversi otomatis
console.log("5" + 2);               // "52"
console.log("5" - 2);               // 3
console.log("5" * "2");             // 10`],

["Regular Expressions", "Regular expression (regex) adalah pola untuk mencocokkan teks, ditulis di antara garis miring /pola/ dengan flag seperti g (semua) dan i (abaikan huruf). Metode test() mengecek kecocokan, match() mengambil hasil, dan replace() mengganti teks.",
`const teks = "Hubungi 0812-3456 atau 0813-7890";

console.log(/hubungi/i.test(teks));

console.log(teks.match(/\\d{4}-\\d{4}/g));

console.log(teks.replace(/\\d/g, "#"));

const email = /^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$/i;
console.log(email.test("budi@contoh.com"));
console.log(email.test("budi@contoh"));`],

["Try Catch", "try...catch menangkap error agar program tidak berhenti mendadak: kode berisiko ditaruh di try, penanganan error di catch, dan finally selalu dijalankan. Gunakan throw untuk membuat error sendiri.",
`function bagi(a, b) {
    if (b === 0) {
        throw new Error("Tidak bisa dibagi nol");
    }
    return a / b;
}

try {
    console.log(bagi(10, 2));
    console.log(bagi(10, 0));
    console.log("Baris ini dilewati");
} catch (error) {
    console.log("Terjadi error:", error.message);
} finally {
    console.log("Blok finally selalu jalan");
}`],

["Scope", "Scope menentukan di mana variabel dapat diakses. Variabel global tersedia di mana saja, variabel lokal (di dalam fungsi) hanya di fungsi itu, dan let atau const punya cakupan blok. Fungsi di dalam fungsi dapat membaca variabel milik fungsi luar.",
`let global = "saya global";

function uji() {
    let lokal = "saya lokal";
    console.log(global);
    console.log(lokal);
}

uji();

if (true) {
    let dalamBlok = "hanya di blok";
    console.log(dalamBlok);
}

console.log(typeof lokal);          // tidak terlihat dari luar fungsi
console.log(typeof dalamBlok);      // tidak terlihat dari luar blok`],

["Hoisting", "Hoisting memindahkan deklarasi ke atas cakupannya saat kode dibaca. Fungsi dapat dipanggil sebelum ditulis, dan var terangkat dengan nilai undefined. let dan const juga terangkat tetapi tidak bisa dipakai sebelum deklarasi (menghasilkan error).",
`console.log(sapa("Budi"));        // fungsi bisa dipakai sebelum ditulis

function sapa(nama) {
    return "Halo " + nama;
}

console.log(a);                   // undefined, bukan error
var a = 5;
console.log(a);

try {
    console.log(b);
    let b = 10;
} catch (e) {
    console.log("Error:", e.message);
}`],

["Arrow Function", "Arrow function adalah penulisan fungsi yang lebih singkat: (parameter) => ekspresi. Bila isinya satu ekspresi, return otomatis; bila satu parameter, kurung boleh dihilangkan. Arrow function tidak punya this sendiri.",
`const tambah = (a, b) => a + b;
const kuadrat = n => n * n;
const sapa = () => "Halo!";

const hitung = (a, b) => {
    const hasil = a * b;
    return hasil;
};

console.log(tambah(2, 3));
console.log(kuadrat(5));
console.log(sapa());
console.log(hitung(4, 5));
console.log([1, 2, 3].map(n => n * 10));`],

["Classes", "Class adalah cetak biru untuk membuat objek. constructor menyiapkan properti, metode ditulis di dalam class, dan extends membuat class turunan yang memakai super() untuk memanggil constructor induk.",
`class Hewan {
    constructor(nama) {
        this.nama = nama;
    }
    suara() {
        return this.nama + " bersuara";
    }
}

class Kucing extends Hewan {
    suara() {
        return this.nama + " mengeong";
    }
}

const h = new Hewan("Hewan");
const k = new Kucing("Tom");
console.log(h.suara());
console.log(k.suara());
console.log(k instanceof Hewan);`],

["Modules", "Modul memecah kode menjadi file terpisah yang saling berbagi lewat export dan import. Contoh di bawah menunjukkan sintaks aslinya di komentar, lalu memuat modul secara dinamis dari teks agar bisa dijalankan di satu editor.",
`// Di file matematika.js:
//   export const tambah = (a, b) => a + b;
// Di file lain:
//   import { tambah } from "./matematika.js";

const kodeModul = "export const tambah = (a, b) => a + b;";
const url = URL.createObjectURL(new Blob([kodeModul], { type: "text/javascript" }));

import(url)
    .then(modul => console.log("tambah(2, 3) =", modul.tambah(2, 3)))
    .catch(e => console.log("Modul dinamis tidak bisa dimuat di sini:", e.message));`],

["JSON", "JSON adalah format teks untuk bertukar data, mirip objek JavaScript tetapi kunci wajib bertanda petik ganda. JSON.stringify() mengubah objek menjadi teks JSON, dan JSON.parse() mengubah teks JSON kembali menjadi objek.",
`const siswa = { nama: "Ani", umur: 16, hobi: ["membaca", "coding"] };

const teks = JSON.stringify(siswa);
console.log(teks);
console.log(typeof teks);

console.log(JSON.stringify(siswa, null, 2));    // rapi

const objek = JSON.parse('{"kota":"Medan","penduduk":2400000}');
console.log(objek.kota);
console.log(objek.penduduk);`],

["Promises", "Promise mewakili hasil operasi asinkron yang belum selesai. Statusnya pending, fulfilled (berhasil, ditangani then), atau rejected (gagal, ditangani catch). Promise.all() menunggu beberapa promise sekaligus.",
`const tunggu = (ms, nilai) =>
    new Promise(resolve => setTimeout(() => resolve(nilai), ms));

const gagal = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Gagal memuat")), 300));

console.log("Mulai");

tunggu(500, "Data siap")
    .then(hasil => console.log(hasil))
    .finally(() => console.log("Selesai menunggu"));

gagal.catch(error => console.log("Error:", error.message));

Promise.all([tunggu(200, "A"), tunggu(400, "B")])
    .then(semua => console.log("Semua:", semua));

console.log("Baris ini tampil lebih dulu");`],

["Async/Await", "async/await menulis kode asinkron seolah berurutan. Fungsi async selalu mengembalikan Promise, dan await menunggu Promise selesai sebelum lanjut. Gunakan try...catch untuk menangani error.",
`const tunggu = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function ambilData(sukses) {
    await tunggu(500);
    if (!sukses) throw new Error("Server tidak merespons");
    return { nama: "CodeLearn", versi: 2 };
}

async function main() {
    console.log("Mengambil data...");
    try {
        const data = await ambilData(true);
        console.log("Berhasil:", data);
        await ambilData(false);
    } catch (error) {
        console.log("Gagal:", error.message);
    }
}

main();`],

["HTML DOM", "DOM (Document Object Model) adalah representasi halaman sebagai pohon objek yang bisa diubah JavaScript. Pilih elemen dengan getElementById() atau querySelector(), ubah isinya dengan textContent, gayanya dengan style, dan buat elemen baru dengan createElement().",
`const judul = document.getElementById("judul");
judul.textContent = "Judul diubah lewat DOM";
judul.style.color = "royalblue";

const teks = document.querySelector("#teks");
teks.classList.add("baru");
teks.style.fontWeight = "bold";

const item = document.createElement("li");
item.textContent = "Elemen baru dibuat dengan JavaScript";
const daftar = document.createElement("ul");
daftar.appendChild(item);
document.getElementById("demo").appendChild(daftar);

console.log("Tag judul:", judul.tagName);`],

["Web APIs", "Web API adalah fitur bawaan browser yang bisa dipakai JavaScript, misalnya DOM, Fetch (permintaan jaringan), URL, Intl (format bahasa dan mata uang), Storage, Geolocation, dan Canvas. Contoh ini memakai API yang aman dijalankan di preview.",
`const url = new URL("https://contoh.com/belajar?bahasa=js&level=1");
console.log(url.hostname);
console.log(url.pathname);
console.log(url.searchParams.get("bahasa"));

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" });
console.log(rupiah.format(1500000));

const asli = { a: 1, daftar: [1, 2] };
const salinan = structuredClone(asli);
salinan.daftar.push(3);
console.log(asli, salinan);

console.log(typeof fetch);      // untuk permintaan HTTP
setTimeout(() => console.log("Timer selesai"), 500);`]
];

/* ======================== Python ======================== */
LESSONS.Python = [
["Intro", "Python adalah bahasa pemrograman yang sintaksnya mudah dibaca, populer untuk pemula, web, data, dan AI. Fungsi print() menampilkan teks ke layar. Kode Python di sini dijalankan oleh interpreter Python asli di browser.",
`print("Halo, Python!")
print("Selamat belajar coding")
print(2 + 3)`],

["Syntax", "Python memakai indentasi (spasi di awal baris) untuk menandai blok kode, bukan kurung kurawal. Indentasi harus konsisten (biasanya 4 spasi). Tidak perlu titik koma di akhir baris.",
`if 5 > 2:
    print("Lima lebih besar dari dua")
    print("Baris ini masih di dalam blok if")

print("Baris ini di luar blok")

# Indentasi yang salah menyebabkan IndentationError`],

["Comments", "Komentar diawali tanda # dan diabaikan Python. Untuk komentar banyak baris, biasanya dipakai string tiga tanda petik (docstring) yang tidak diberikan ke variabel.",
`# Ini komentar satu baris
print("Halo")   # komentar di akhir baris

"""
Ini catatan
banyak baris
"""
print("Selesai")`],

["Variables", "Variabel dibuat saat diberi nilai, tanpa deklarasi tipe. Nama variabel diawali huruf atau _, peka huruf besar-kecil, dan sebaiknya memakai snake_case seperti nama_lengkap. Variabel dapat berganti tipe.",
`nama = "Ani"
umur = 16
tinggi = 1.62

print(nama, umur, tinggi)

x = y = z = 10
print(x, y, z)

a, b = "Satu", "Dua"
print(a, b)

umur = "enam belas"      # tipe bisa berganti
print(umur)`],

["Data Types", "Tipe data bawaan Python: str (teks), int, float, complex, bool, list, tuple, set, dict, dan NoneType. Gunakan type() untuk mengetahui tipe suatu nilai.",
`print(type("teks"))
print(type(10))
print(type(3.14))
print(type(True))
print(type([1, 2]))
print(type((1, 2)))
print(type({1, 2}))
print(type({"a": 1}))
print(type(None))`],

["Numbers", "Python punya tiga tipe angka: int (bulat, tanpa batas ukuran), float (desimal), dan complex. Operator // untuk pembagian bulat, % untuk sisa bagi, dan ** untuk pangkat. Fungsi round() dan abs() membantu pengolahan angka.",
`a = 10
b = 3

print(a / b)       # pembagian desimal
print(a // b)      # pembagian bulat
print(a % b)       # sisa bagi
print(a ** b)      # pangkat
print(round(3.14159, 2))
print(abs(-7))
print(2 ** 100)    # int sangat besar`],

["Casting", "Casting mengubah tipe data dengan int(), float(), str(), bool(), list(), dan lainnya. Konversi bisa gagal dan menimbulkan ValueError, misalnya int(\"abc\").",
`print(int("42") + 8)
print(float("3.5") * 2)
print(str(100) + " rupiah")
print(int(7.9))             # dipotong, bukan dibulatkan
print(bool(0), bool("a"))
print(list("abc"))

try:
    int("abc")
except ValueError:
    print("Tidak bisa mengubah 'abc' menjadi int")`],

["Strings", "String adalah teks di antara tanda petik tunggal atau ganda; tiga tanda petik untuk teks banyak baris. String bisa diindeks (mulai 0), diiris dengan [awal:akhir], dan dihitung panjangnya dengan len(). String bersifat immutable.",
`teks = "Belajar Python"

print(len(teks))
print(teks[0])
print(teks[-1])
print(teks[0:7])
print(teks[8:])
print(teks.upper())
print(teks.replace("Python", "Coding"))
print("Py" in teks)
print(teks.split(" "))`],

["Booleans", "Boolean hanya bernilai True atau False (huruf awal besar). Hasil perbandingan adalah boolean. Nilai kosong atau nol dianggap False oleh bool(), sedangkan yang lain dianggap True.",
`print(10 > 9)
print(10 == 9)

print(bool("Halo"))
print(bool(""))
print(bool(0))
print(bool([]))
print(bool([0]))

umur = 17
print(isinstance(umur, int))`],

["Operators", "Operator Python meliputi aritmetika (+ - * / // % **), penugasan (= += -=), perbandingan (== != > < >= <=), logika (and, or, not), keanggotaan (in, not in), dan identitas (is, is not).",
`print(7 + 3, 7 - 3, 7 * 3)
print(7 > 3 and 3 > 5)
print(7 > 3 or 3 > 5)
print(not (7 > 3))

x = 5
x += 2
print(x)

buah = ["apel", "jeruk"]
print("apel" in buah)
print("mangga" not in buah)`],

["Lists", "List adalah koleksi berurutan yang bisa diubah (mutable), ditulis dengan kurung siku. Metode umum: append(), insert(), remove(), pop(), sort(), reverse(), serta len() untuk jumlah elemen.",
`buah = ["apel", "jeruk", "mangga"]

print(buah)
print(buah[0], buah[-1])

buah.append("pisang")
buah.insert(1, "anggur")
buah.remove("jeruk")
print(buah)

buah.sort()
print(buah)
print(len(buah))
print(buah[1:3])`],

["Tuples", "Tuple mirip list tetapi tidak bisa diubah setelah dibuat (immutable), ditulis dengan kurung biasa. Cocok untuk data tetap seperti koordinat. Tuple bisa di-unpack ke beberapa variabel.",
`titik = (3, 7)
print(titik)
print(titik[0])

x, y = titik            # unpacking
print("x =", x, "y =", y)

print(len(titik))
print(titik.count(3))

try:
    titik[0] = 10
except TypeError as e:
    print("Error:", e)`],

["Sets", "Set adalah koleksi tidak berurutan yang berisi nilai unik, ditulis dengan kurung kurawal. Mendukung operasi himpunan seperti union (|), irisan (&), dan selisih (-). Set kosong dibuat dengan set(), bukan {}.",
`a = {1, 2, 3, 3, 2}
print(a)                    # duplikat hilang

b = {3, 4, 5}
print(a | b)                # gabungan
print(a & b)                # irisan
print(a - b)                # selisih

a.add(10)
a.discard(1)
print(a)
print(2 in a)`],

["Dictionaries", "Dictionary menyimpan pasangan kunci: nilai di dalam kurung kurawal dan dapat diubah. Akses nilai dengan kunci, tambah atau ubah dengan penugasan, dan telusuri dengan keys(), values(), atau items().",
`siswa = {"nama": "Ani", "umur": 16}

print(siswa["nama"])
print(siswa.get("kelas", "tidak ada"))

siswa["kelas"] = "11A"
siswa["umur"] = 17
del siswa["nama"]
print(siswa)

for kunci, nilai in siswa.items():
    print(kunci, "=", nilai)

print(list(siswa.keys()))`],

["If...Else", "Percabangan if...elif...else menjalankan blok berdasarkan kondisi. Setelah kondisi wajib ada titik dua, dan blok di bawahnya diberi indentasi. Python juga mendukung ekspresi satu baris: nilai_a if kondisi else nilai_b.",
`nilai = 85

if nilai >= 90:
    print("Sangat baik")
elif nilai >= 75:
    print("Lulus")
else:
    print("Belum lulus")

status = "Lulus" if nilai >= 75 else "Tidak lulus"
print(status)`],

["Match", "match...case (Python 3.10 ke atas) mencocokkan nilai dengan beberapa pola, seperti switch di bahasa lain. Tanda _ adalah pola penampung untuk semua nilai yang tidak cocok, dan | menggabung beberapa pola.",
`hari = 6

match hari:
    case 1:
        print("Senin")
    case 2:
        print("Selasa")
    case 6 | 7:
        print("Akhir pekan")
    case _:
        print("Hari kerja lainnya")`],

["While Loops", "while mengulang blok selama kondisi True. Pastikan kondisi suatu saat menjadi False. break menghentikan perulangan, continue melompat ke iterasi berikutnya, dan else dijalankan jika perulangan selesai tanpa break.",
`i = 1
while i <= 5:
    if i == 2:
        i += 1
        continue
    if i == 5:
        break
    print("i =", i)
    i += 1

n = 3
while n > 0:
    print("Hitung mundur:", n)
    n -= 1
else:
    print("Selesai!")`],

["For Loops", "for menelusuri item dari urutan seperti list, string, atau range(). range(awal, akhir, langkah) menghasilkan deret angka, dengan akhir tidak ikut. enumerate() memberi indeks dan nilai sekaligus.",
`for i in range(1, 6):
    print(i)

for buah in ["apel", "jeruk"]:
    print("Buah:", buah)

for huruf in "ABC":
    print(huruf)

for indeks, nama in enumerate(["Ani", "Budi"], start=1):
    print(indeks, nama)

print(list(range(0, 10, 3)))`],

["Functions", "Fungsi dibuat dengan def, bisa memiliki parameter (termasuk nilai default) dan mengembalikan nilai dengan return. Argumen dapat dikirim berdasarkan posisi atau nama (keyword). *args menerima argumen berjumlah bebas.",
`def tambah(a, b):
    return a + b

def sapa(nama, sapaan="Halo"):
    return sapaan + ", " + nama + "!"

def jumlahkan(*angka):
    return sum(angka)

print(tambah(3, 4))
print(sapa("Budi"))
print(sapa(sapaan="Selamat pagi", nama="Ani"))
print(jumlahkan(1, 2, 3, 4))`],

["Lambda", "Lambda adalah fungsi anonim satu baris: lambda parameter: ekspresi. Sering dipakai bersama map(), filter(), dan sorted(key=...) untuk operasi singkat.",
`kali_dua = lambda x: x * 2
print(kali_dua(5))

tambah = lambda a, b: a + b
print(tambah(2, 3))

angka = [1, 2, 3, 4, 5, 6]
print(list(map(lambda n: n * n, angka)))
print(list(filter(lambda n: n % 2 == 0, angka)))

siswa = [("Ani", 90), ("Budi", 75), ("Cici", 85)]
print(sorted(siswa, key=lambda s: s[1], reverse=True))`],

["Arrays", "Python tidak punya tipe array bawaan; list sudah berfungsi sebagai array dan paling sering dipakai. Untuk array bertipe seragam dan hemat memori ada modul array. Untuk komputasi numerik besar dipakai pustaka NumPy.",
`# List sebagai array
angka = [10, 20, 30, 40]
print(angka[0], angka[-1])
angka[1] = 25
angka.append(50)
print(angka, len(angka))

for n in angka:
    print(n)

# Modul array: semua elemen harus bertipe sama ("i" = integer)
from array import array
arr = array("i", [1, 2, 3])
arr.append(4)
print(arr)`],

["Classes/Objects", "Class adalah cetak biru, objek adalah hasil cetakannya. Method __init__ dijalankan saat objek dibuat dan menyiapkan atribut. Parameter pertama setiap method adalah self, yang menunjuk ke objek itu sendiri.",
`class Mobil:
    def __init__(self, merek, warna):
        self.merek = merek
        self.warna = warna

    def info(self):
        return self.merek + " berwarna " + self.warna

mobil1 = Mobil("Toyota", "merah")
mobil2 = Mobil("Honda", "biru")

print(mobil1.info())
print(mobil2.info())
print(mobil1.merek)`],

["Inheritance", "Pewarisan membuat class turunan yang memakai atribut dan method class induk. Tulis class Anak(Induk). Gunakan super() untuk memanggil method atau constructor milik induk, dan method boleh ditimpa (override).",
`class Hewan:
    def __init__(self, nama):
        self.nama = nama

    def suara(self):
        return "..."

class Kucing(Hewan):
    def __init__(self, nama, warna):
        super().__init__(nama)
        self.warna = warna

    def suara(self):
        return "Meong"

k = Kucing("Tom", "oranye")
print(k.nama, k.warna)
print(k.suara())
print(isinstance(k, Hewan))`],

["Iterators", "Iterator adalah objek yang bisa ditelusuri satu per satu. Objek iterable (list, string, dll.) diubah menjadi iterator dengan iter(), lalu nilainya diambil dengan next(). Class sendiri dapat dibuat iterable dengan method __iter__ dan __next__.",
`buah = ["apel", "jeruk", "mangga"]
it = iter(buah)

print(next(it))
print(next(it))
print(next(it))

class Hitung:
    def __init__(self, batas):
        self.batas = batas

    def __iter__(self):
        self.n = 0
        return self

    def __next__(self):
        if self.n >= self.batas:
            raise StopIteration
        self.n += 1
        return self.n

for angka in Hitung(4):
    print(angka)`],

["Polymorphism", "Polimorfisme berarti satu nama method dapat berperilaku berbeda tergantung objeknya. Beberapa class berbeda mendefinisikan method bernama sama, sehingga kode dapat memanggilnya tanpa peduli class aslinya.",
`class Kucing:
    def suara(self):
        return "Meong"

class Anjing:
    def suara(self):
        return "Guk guk"

class Sapi:
    def suara(self):
        return "Moooo"

for hewan in [Kucing(), Anjing(), Sapi()]:
    print(type(hewan).__name__, "berbunyi", hewan.suara())

print(len("Halo"), len([1, 2, 3]))      # len() juga polimorfik`],

["Scope", "Scope menentukan di mana variabel dapat dipakai. Variabel di dalam fungsi bersifat lokal. Variabel di luar fungsi bersifat global dan dapat dibaca di dalam fungsi, tetapi untuk mengubahnya perlu kata kunci global. Fungsi dalam fungsi memakai nonlocal.",
`x = "global"

def uji():
    y = "lokal"
    print(x, y)

uji()

hitung = 0

def tambah():
    global hitung
    hitung += 1

tambah()
tambah()
print("hitung =", hitung)

def luar():
    n = 1
    def dalam():
        nonlocal n
        n += 1
    dalam()
    return n

print(luar())`],

["Modules", "Modul adalah file Python berisi fungsi dan variabel yang bisa dipakai ulang lewat import. Python menyediakan banyak modul bawaan seperti math, random, dan statistics. Gunakan from ... import ... untuk mengambil bagian tertentu.",
`import math
import statistics
from random import randint

print(math.sqrt(81))
print(math.pi)
print(math.ceil(4.2))

nilai = [80, 90, 70, 100]
print(statistics.mean(nilai))
print(statistics.median(nilai))

print("Dadu:", randint(1, 6))

import math as m
print(m.factorial(5))`],

["Dates", "Modul datetime menangani tanggal dan waktu. datetime.now() memberi waktu sekarang, datetime(tahun, bulan, hari) membuat tanggal tertentu, strftime() memformat ke teks, dan timedelta menghitung selisih waktu.",
`from datetime import datetime, date, timedelta

sekarang = datetime.now()
print("Tahun ini:", sekarang.year)

lahir = date(2008, 5, 17)
print(lahir)
print(lahir.strftime("%d-%m-%Y"))
print(lahir.strftime("%A, %d %B %Y"))

lusa = date(2026, 11, 26) + timedelta(days=2)
print(lusa)

selisih = date(2026, 12, 31) - date(2026, 11, 26)
print(selisih.days, "hari lagi")`],

["Math", "Fungsi bawaan min(), max(), abs(), pow(), sum(), dan round() dapat langsung dipakai. Modul math menambah sqrt(), ceil(), floor(), pi, sin(), log(), dan banyak lagi.",
`import math

print(min(3, 9, 1), max(3, 9, 1))
print(abs(-5))
print(pow(2, 10))
print(sum([1, 2, 3, 4]))
print(round(2.567, 1))

print(math.sqrt(144))
print(math.floor(4.9), math.ceil(4.1))
print(math.pi)
print(math.log10(1000))
print(math.gcd(12, 18))`],

["JSON", "Modul json mengubah data Python dari dan ke format JSON. json.dumps() mengubah objek Python menjadi teks JSON, dan json.loads() mengubah teks JSON menjadi objek Python (dict atau list).",
`import json

siswa = {"nama": "Ani", "umur": 16, "hobi": ["membaca", "coding"], "aktif": True}

teks = json.dumps(siswa)
print(teks)
print(type(teks))

print(json.dumps(siswa, indent=2))

data = json.loads('{"kota": "Medan", "penduduk": 2400000, "pantai": false}')
print(data["kota"])
print(type(data))`],

["RegEx", "Modul re menyediakan regular expression untuk mencari pola teks: re.search() (cari pertama), re.findall() (semua hasil), re.sub() (ganti), dan re.match() (cek di awal). Awali pola dengan r agar garis miring terbalik tidak diproses Python.",
`import re

teks = "Hubungi 0812-3456 atau 0813-7890"

print(re.search(r"Hubungi", teks) is not None)
print(re.findall(r"\\d{4}-\\d{4}", teks))
print(re.sub(r"\\d", "#", teks))

email = r"^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$"
print(bool(re.match(email, "budi@contoh.com")))
print(bool(re.match(email, "budi@contoh")))`],

["Try...Except", "try...except menangani error agar program tidak berhenti. Kode berisiko ditaruh di try, error ditangkap di except (bisa spesifik seperti ZeroDivisionError), else jalan jika tidak ada error, dan finally selalu jalan.",
`def bagi(a, b):
    try:
        hasil = a / b
    except ZeroDivisionError:
        print("Tidak bisa dibagi nol")
    except TypeError:
        print("Nilai harus berupa angka")
    else:
        print("Hasil:", hasil)
    finally:
        print("Selesai")

bagi(10, 2)
bagi(10, 0)
bagi(10, "a")`],

["User Input", "input() membaca teks yang diketik pengguna dan selalu menghasilkan str, jadi ubah dengan int() atau float() jika perlu angka. Di browser, input() muncul sebagai kotak dialog; isi lalu tekan OK.",
`nama = input("Siapa namamu? ")
umur = int(input("Berapa umurmu? "))

print("Halo,", nama)
print("Tahun depan umurmu", umur + 1)`],

["String Formatting", "Cara memformat teks: f-string (f\"...{variabel}...\") yang paling modern, format() pada string, dan operator %. Di dalam kurung kurawal bisa diberi format seperti :.2f (dua desimal), :, (pemisah ribuan), dan :>10 (rata kanan).",
`nama = "Budi"
umur = 17
harga = 1234567.891

print(f"Halo {nama}, umur {umur} tahun")
print(f"Harga: Rp{harga:,.2f}")
print(f"Pangkat dua dari 5 = {5 ** 2}")
print(f"[{nama:>10}] [{nama:<10}] [{nama:^10}]")

print("Nama: {}, umur: {}".format(nama, umur))
print("Nama: %s, umur: %d" % (nama, umur))`],

["File Handling", "open(nama_file, mode) membuka file: \"r\" baca, \"w\" tulis (menimpa), \"a\" tambah, \"x\" buat baru. Gunakan with agar file otomatis ditutup. Di browser, file disimpan di penyimpanan sementara yang hilang saat halaman ditutup.",
`with open("catatan.txt", "w") as f:
    f.write("Baris pertama\\n")
    f.write("Baris kedua\\n")

with open("catatan.txt", "a") as f:
    f.write("Baris ketiga\\n")

with open("catatan.txt", "r") as f:
    isi = f.read()
print(isi)

with open("catatan.txt") as f:
    for nomor, baris in enumerate(f, start=1):
        print(nomor, baris.strip())

import os
print(os.path.exists("catatan.txt"))`]
];

/* ======================== Java ======================== */
LESSONS.Java = [
["Intro", "Java adalah bahasa pemrograman berorientasi objek yang dipakai untuk aplikasi Android, web, dan sistem besar. Program Java dikompilasi lalu dijalankan di Java Virtual Machine (JVM), sehingga bisa berjalan di banyak sistem operasi. Titik awal program adalah method main.",
javaDoc({ body: `System.out.println("Halo, Java!");
System.out.println("Selamat belajar pemrograman");` })],

["Syntax", "Setiap kode Java berada di dalam class, dan nama class harus sama dengan nama file (Main.java). Program dimulai dari method main. Setiap pernyataan diakhiri titik koma, dan blok memakai kurung kurawal. Java membedakan huruf besar dan kecil.",
`public class Main {
    public static void main(String[] args) {
        System.out.println("Halo dari method main");
    }
}`],

["Output", "System.out.println() mencetak teks lalu pindah baris, System.out.print() mencetak tanpa pindah baris, dan System.out.printf() mencetak dengan format (%d bilangan bulat, %s teks, %.2f desimal).",
javaDoc({ body: `System.out.println("Baris pertama");
System.out.print("Tanpa ");
System.out.print("pindah baris");
System.out.println();
System.out.printf("Nama: %s, umur: %d%n", "Budi", 17);
System.out.printf("Pi = %.2f%n", 3.14159);` })],

["Comments", "Komentar tidak dijalankan. Komentar satu baris diawali //, sedangkan komentar banyak baris ditulis di antara /* dan */. Javadoc (/** ... */) dipakai untuk dokumentasi class dan method.",
javaDoc({ body: `// Ini komentar satu baris
System.out.println("Baris ini dijalankan");

/* Ini komentar
   banyak baris */

// System.out.println("Baris ini tidak dijalankan");` })],

["Variables", "Variabel menyimpan data dan harus dideklarasikan dengan tipe: tipe nama = nilai. Tipe umum: String (teks), int (bulat), double (desimal), char (satu karakter), dan boolean. Tambahkan final agar nilainya tidak bisa diubah.",
javaDoc({ body: `String nama = "Ani";
int umur = 16;
double tinggi = 1.62;
char kelas = 'A';
boolean aktif = true;
final double PI = 3.14159;

System.out.println(nama + ", " + umur + " tahun, " + tinggi + " m");
System.out.println("Kelas " + kelas + ", aktif: " + aktif);
System.out.println("PI = " + PI);

umur = 17;
System.out.println("Umur sekarang: " + umur);` })],

["Data Types", "Java punya tipe primitif: byte, short, int, long (bilangan bulat), float, double (desimal), boolean, dan char. Selain itu ada tipe referensi seperti String, array, dan objek. long diakhiri L dan float diakhiri f.",
javaDoc({ body: `byte b = 100;
short s = 30000;
int i = 2000000000;
long l = 9000000000L;
float f = 3.14f;
double d = 3.14159265359;
boolean ok = true;
char c = 'J';
String teks = "Tipe referensi";

System.out.println(b + " " + s + " " + i + " " + l);
System.out.println(f + " " + d);
System.out.println(ok + " " + c + " " + teks);
System.out.println(Integer.MAX_VALUE);` })],

["Type Casting", "Casting mengubah tipe data. Widening (otomatis) dari tipe kecil ke besar, misalnya int ke double. Narrowing (manual) dari tipe besar ke kecil, ditulis dengan tipe di dalam kurung, misalnya (int) 9.78, dan bagian desimal dipotong.",
javaDoc({ body: `int a = 10;
double b = a;               // widening otomatis
System.out.println(b);

double c = 9.78;
int d = (int) c;            // narrowing manual
System.out.println(d);

int total = 7;
int jumlah = 2;
System.out.println(total / jumlah);             // 3 (pembagian bulat)
System.out.println((double) total / jumlah);    // 3.5` })],

["Operators", "Operator Java: aritmetika (+ - * / %), penugasan (= += -=), perbandingan (== != > <), logika (&& || !), dan increment/decrement (++ --). Perhatikan bahwa pembagian dua int menghasilkan int.",
javaDoc({ body: `int x = 10;
int y = 3;

System.out.println(x + y);
System.out.println(x / y);
System.out.println(x % y);
System.out.println(x > y && y > 5);
System.out.println(x > y || y > 5);

x += 5;
x++;
System.out.println(x);` })],

["Strings", "String adalah objek teks. Metode umum: length(), toUpperCase(), toLowerCase(), charAt(), indexOf(), substring(), contains(), replace(), dan equals() untuk membandingkan isi. Jangan memakai == untuk membandingkan isi string.",
javaDoc({ body: `String teks = "Belajar Java";

System.out.println(teks.length());
System.out.println(teks.toUpperCase());
System.out.println(teks.charAt(0));
System.out.println(teks.indexOf("Java"));
System.out.println(teks.substring(0, 7));
System.out.println(teks.replace("Java", "Coding"));
System.out.println(teks.contains("jar"));

String a = "Halo";
String b = new String("Halo");
System.out.println(a.equals(b));
System.out.println("Gabung: " + a.concat(" Dunia"));` })],

["Math", "Class Math menyediakan fungsi matematika: Math.max(), Math.min(), Math.sqrt(), Math.pow(), Math.abs(), Math.round(), Math.ceil(), Math.floor(), dan Math.random() untuk bilangan acak antara 0 dan 1.",
javaDoc({ body: `System.out.println(Math.max(5, 10));
System.out.println(Math.min(5, 10));
System.out.println(Math.sqrt(64));
System.out.println(Math.pow(2, 8));
System.out.println(Math.abs(-4.7));
System.out.println(Math.round(4.6));
System.out.println(Math.ceil(4.1));
System.out.println(Math.floor(4.9));

int acak = (int) (Math.random() * 6) + 1;
System.out.println("Dadu: " + acak);` })],

["Booleans", "Tipe boolean hanya bernilai true atau false dan dipakai untuk kondisi. Hasil perbandingan dan operasi logika selalu boolean. Operator logika: && (dan), || (atau), ! (bukan).",
javaDoc({ body: `boolean lulus = true;
boolean hujan = false;

System.out.println(lulus);
System.out.println(10 > 9);
System.out.println(10 == 9);
System.out.println(lulus && !hujan);
System.out.println(lulus || hujan);
System.out.println(!lulus);` })],

["If...Else", "Percabangan if...else if...else menjalankan blok berdasarkan kondisi boolean di dalam kurung. Ada juga operator ternary: kondisi ? nilaiJikaTrue : nilaiJikaFalse.",
javaDoc({ body: `int nilai = 85;

if (nilai >= 90) {
    System.out.println("Sangat baik");
} else if (nilai >= 75) {
    System.out.println("Lulus");
} else {
    System.out.println("Belum lulus");
}

String status = (nilai >= 75) ? "Lulus" : "Tidak lulus";
System.out.println(status);` })],

["Switch", "switch memilih satu dari banyak kemungkinan berdasarkan nilai. Setiap case diakhiri break agar tidak jatuh ke case berikutnya, dan default dijalankan bila tidak ada yang cocok.",
javaDoc({ body: `int hari = 3;
String nama;

switch (hari) {
    case 1:
        nama = "Senin";
        break;
    case 2:
        nama = "Selasa";
        break;
    case 3:
        nama = "Rabu";
        break;
    default:
        nama = "Hari lain";
}

System.out.println(nama);` })],

["While Loop", "while mengulang selama kondisi true dan mengecek kondisi di awal. do...while mengecek di akhir sehingga isi dijalankan minimal satu kali. Pastikan ada perubahan yang membuat kondisi akhirnya false.",
javaDoc({ body: `int i = 1;
while (i <= 3) {
    System.out.println("while: " + i);
    i++;
}

int j = 10;
do {
    System.out.println("do-while: " + j);
    j++;
} while (j < 5);` })],

["For Loop", "for dipakai bila jumlah perulangan diketahui: for (inisialisasi; kondisi; perubahan). Untuk menelusuri array atau koleksi ada for-each: for (tipe item : koleksi).",
javaDoc({ body: `for (int i = 1; i <= 5; i++) {
    System.out.println("Ke-" + i);
}

String[] buah = {"apel", "jeruk", "mangga"};
for (String b : buah) {
    System.out.println("Buah: " + b);
}` })],

["Break/Continue", "break menghentikan perulangan atau switch, sedangkan continue melewati iterasi saat ini dan lanjut ke iterasi berikutnya.",
javaDoc({ body: `for (int i = 1; i <= 10; i++) {
    if (i == 3) {
        continue;       // lewati 3
    }
    if (i == 6) {
        break;          // berhenti di 6
    }
    System.out.println(i);
}
System.out.println("Selesai");` })],

["Arrays", "Array menyimpan banyak nilai bertipe sama dengan ukuran tetap. Indeks dimulai dari 0 dan length memberi jumlah elemen. Class Arrays (java.util) membantu mencetak dan mengurutkan array.",
javaDoc({ imp: "import java.util.Arrays;", body: `String[] buah = {"apel", "jeruk", "mangga"};
System.out.println(buah[0]);
System.out.println(buah.length);

int[] angka = new int[3];
angka[0] = 30;
angka[1] = 10;
angka[2] = 20;

Arrays.sort(angka);
System.out.println(Arrays.toString(angka));

int[][] matriks = {{1, 2}, {3, 4}};
System.out.println(matriks[1][0]);` })],

["Methods", "Method adalah blok kode bernama yang bisa dipanggil berulang kali. Method yang tidak mengembalikan nilai bertipe void. Method static dapat dipanggil langsung dari main tanpa membuat objek.",
javaDoc({ members: `static void sapa() {
    System.out.println("Halo dari method!");
}

static int tambah(int a, int b) {
    return a + b;
}`, body: `sapa();
sapa();
int hasil = tambah(3, 4);
System.out.println("3 + 4 = " + hasil);` })],

["Method Parameters", "Parameter adalah data yang diterima method, dan argumen adalah nilai yang dikirim saat memanggil. Method dapat memiliki beberapa parameter, juga varargs (tipe... nama) untuk jumlah argumen bebas.",
javaDoc({ members: `static void perkenalan(String nama, int umur) {
    System.out.println(nama + " berumur " + umur + " tahun");
}

static int jumlah(int... angka) {
    int total = 0;
    for (int n : angka) {
        total += n;
    }
    return total;
}`, body: `perkenalan("Ani", 16);
perkenalan("Budi", 17);
System.out.println(jumlah(1, 2, 3));
System.out.println(jumlah(10, 20, 30, 40));` })],

["Method Overloading", "Overloading berarti beberapa method memakai nama sama tetapi jumlah atau tipe parameternya berbeda. Java memilih method yang sesuai dengan argumen yang diberikan.",
javaDoc({ members: `static int tambah(int a, int b) {
    return a + b;
}

static double tambah(double a, double b) {
    return a + b;
}

static int tambah(int a, int b, int c) {
    return a + b + c;
}`, body: `System.out.println(tambah(2, 3));
System.out.println(tambah(2.5, 3.5));
System.out.println(tambah(1, 2, 3));` })],

["Scope", "Scope menentukan di mana variabel bisa dipakai. Variabel yang dideklarasikan di dalam method atau blok { } hanya dikenal di dalamnya. Variabel milik class (static) dapat diakses oleh seluruh method di class tersebut.",
javaDoc({ members: `static int global = 100;

static void uji() {
    int lokal = 5;
    System.out.println(global + lokal);
}`, body: `uji();

{
    int dalamBlok = 7;
    System.out.println(dalamBlok);
}

// System.out.println(dalamBlok);   // error: di luar scope
System.out.println(global);` })],

["Recursion", "Rekursi adalah method yang memanggil dirinya sendiri. Wajib punya kondisi berhenti (base case) agar tidak berulang tanpa akhir. Contoh klasik: faktorial, di mana n! = n x (n-1)!.",
javaDoc({ members: `static int faktorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * faktorial(n - 1);
}

static int jumlahSampai(int n) {
    if (n == 0) {
        return 0;
    }
    return n + jumlahSampai(n - 1);
}`, body: `System.out.println("5! = " + faktorial(5));
System.out.println("1+2+...+10 = " + jumlahSampai(10));` })],

["OOP", "OOP (Object-Oriented Programming) membangun program dari objek yang menggabungkan data (atribut) dan perilaku (method). Empat pilar utamanya: enkapsulasi, pewarisan, polimorfisme, dan abstraksi. Class adalah cetak biru, objek adalah instansnya.",
javaDoc({ top: `class Kucing {
    String nama = "Tom";

    void mengeong() {
        System.out.println(nama + " berkata: Meong!");
    }
}`, body: `Kucing k = new Kucing();   // membuat objek dari class
k.mengeong();` })],

["Classes/Objects", "Class dideklarasikan dengan kata kunci class, dan objek dibuat dengan new. Satu class bisa menghasilkan banyak objek yang masing-masing punya nilai atribut sendiri.",
javaDoc({ top: `class Mobil {
    String merek;
    int tahun;
}`, body: `Mobil m1 = new Mobil();
m1.merek = "Toyota";
m1.tahun = 2020;

Mobil m2 = new Mobil();
m2.merek = "Honda";
m2.tahun = 2023;

System.out.println(m1.merek + " " + m1.tahun);
System.out.println(m2.merek + " " + m2.tahun);` })],

["Class Attributes", "Atribut (field) adalah variabel di dalam class. Atribut biasa dimiliki tiap objek, sedangkan atribut static dimiliki class itu sendiri dan dibagi ke semua objek (misalnya penghitung). final membuat atribut konstan.",
javaDoc({ top: `class Siswa {
    String nama;
    static int jumlah = 0;
    final String sekolah = "SMA CodeLearn";

    Siswa(String nama) {
        this.nama = nama;
        jumlah++;
    }
}`, body: `Siswa a = new Siswa("Ani");
Siswa b = new Siswa("Budi");

System.out.println(a.nama + " - " + a.sekolah);
System.out.println(b.nama);
System.out.println("Jumlah siswa: " + Siswa.jumlah);` })],

["Class Methods", "Method class mendefinisikan perilaku objek. Method biasa dipanggil lewat objek, sedangkan method static dipanggil lewat nama class tanpa membuat objek.",
javaDoc({ top: `class Kalkulator {
    int tambah(int a, int b) {
        return a + b;
    }

    static int kali(int a, int b) {
        return a * b;
    }
}`, body: `Kalkulator k = new Kalkulator();
System.out.println(k.tambah(3, 4));       // method objek
System.out.println(Kalkulator.kali(3, 4)); // method static` })],

["Constructors", "Constructor adalah method khusus bernama sama dengan class, tanpa tipe kembalian, dan otomatis dijalankan saat objek dibuat dengan new. Constructor bisa punya parameter dan boleh lebih dari satu (overloading). this menunjuk ke objek saat ini.",
javaDoc({ top: `class Buku {
    String judul;
    int halaman;

    Buku() {
        this("Tanpa judul", 0);
    }

    Buku(String judul, int halaman) {
        this.judul = judul;
        this.halaman = halaman;
    }
}`, body: `Buku a = new Buku();
Buku b = new Buku("Belajar Java", 250);

System.out.println(a.judul + " - " + a.halaman);
System.out.println(b.judul + " - " + b.halaman);` })],

["Modifiers", "Modifier mengatur akses dan sifat anggota class. Modifier akses: public (semua), private (hanya class itu), protected (class dan turunannya serta satu package), dan default (satu package). Non-akses: static, final, dan abstract.",
javaDoc({ top: `class Contoh {
    public String umum = "bisa diakses semua";
    private String rahasia = "hanya di dalam class";
    final int TETAP = 10;
    static String milikClass = "milik class";

    String bacaRahasia() {
        return rahasia;
    }
}`, body: `Contoh c = new Contoh();
System.out.println(c.umum);
System.out.println(c.bacaRahasia());
System.out.println(c.TETAP);
System.out.println(Contoh.milikClass);
// System.out.println(c.rahasia);   // error: private` })],

["Encapsulation", "Enkapsulasi menyembunyikan data dengan membuat atribut private dan menyediakan method public get dan set untuk membaca atau mengubahnya. Dengan begitu nilai dapat divalidasi sebelum disimpan.",
javaDoc({ top: `class Rekening {
    private double saldo;

    public double getSaldo() {
        return saldo;
    }

    public void setor(double jumlah) {
        if (jumlah > 0) {
            saldo += jumlah;
        } else {
            System.out.println("Jumlah setoran harus positif");
        }
    }
}`, body: `Rekening r = new Rekening();
r.setor(500000);
r.setor(-100);
System.out.println("Saldo: " + r.getSaldo());` })],

["Packages/API", "Package mengelompokkan class terkait dan ditulis di baris pertama file (package nama.paket;). Java menyediakan banyak class siap pakai (API) di package seperti java.util dan java.time yang dipakai dengan import. Package java.lang (String, Math) otomatis diimpor.",
javaDoc({ imp: `// Contoh package buatan sendiri (di file lain): package com.codelearn.app;
import java.util.ArrayList;
import java.util.Collections;`, body: `ArrayList<Integer> angka = new ArrayList<>();
angka.add(30);
angka.add(10);
angka.add(20);

Collections.sort(angka);
System.out.println(angka);
System.out.println("Terbesar: " + Collections.max(angka));` })],

["Inheritance", "Pewarisan membuat class turunan (subclass) yang memakai atribut dan method class induk (superclass) lewat extends. Subclass dapat menambah anggota baru dan menimpa method induk dengan @Override. super memanggil anggota induk.",
javaDoc({ top: `class Hewan {
    String nama;

    Hewan(String nama) {
        this.nama = nama;
    }

    void bersuara() {
        System.out.println(nama + " bersuara");
    }
}

class Kucing extends Hewan {
    Kucing(String nama) {
        super(nama);
    }

    @Override
    void bersuara() {
        System.out.println(nama + " mengeong");
    }

    void mencakar() {
        System.out.println(nama + " mencakar");
    }
}`, body: `Hewan h = new Hewan("Hewan");
Kucing k = new Kucing("Tom");

h.bersuara();
k.bersuara();
k.mencakar();` })],

["Polymorphism", "Polimorfisme memungkinkan variabel bertipe induk menampung objek turunan, dan method yang dipanggil mengikuti tipe objek sebenarnya saat program berjalan. Dengan begitu satu kode dapat memperlakukan banyak jenis objek.",
javaDoc({ top: `class Hewan {
    void suara() {
        System.out.println("Hewan bersuara");
    }
}

class Kucing extends Hewan {
    @Override
    void suara() {
        System.out.println("Meong");
    }
}

class Anjing extends Hewan {
    @Override
    void suara() {
        System.out.println("Guk guk");
    }
}`, body: `Hewan[] kandang = { new Hewan(), new Kucing(), new Anjing() };

for (Hewan h : kandang) {
    h.suara();
}` })],

["Inner Classes", "Inner class adalah class yang dideklarasikan di dalam class lain. Inner class biasa bisa mengakses anggota class luar dan butuh objek class luar untuk dibuat. Static nested class tidak butuh objek luar.",
javaDoc({ top: `class Mobil {
    private String merek = "Toyota";

    class Mesin {
        void hidupkan() {
            System.out.println("Mesin " + merek + " menyala");
        }
    }

    static class Roda {
        void putar() {
            System.out.println("Roda berputar");
        }
    }
}`, body: `Mobil mobil = new Mobil();
Mobil.Mesin mesin = mobil.new Mesin();
mesin.hidupkan();

Mobil.Roda roda = new Mobil.Roda();
roda.putar();` })],

["Abstraction", "Abstraksi menyembunyikan detail dan hanya menampilkan hal penting. Class abstract tidak bisa dibuat objeknya langsung dan boleh memiliki method abstract (tanpa isi) yang wajib diisi oleh subclass.",
javaDoc({ top: `abstract class Bentuk {
    abstract double luas();

    void info() {
        System.out.println("Luas = " + luas());
    }
}

class Persegi extends Bentuk {
    double sisi;

    Persegi(double sisi) {
        this.sisi = sisi;
    }

    double luas() {
        return sisi * sisi;
    }
}

class Lingkaran extends Bentuk {
    double r;

    Lingkaran(double r) {
        this.r = r;
    }

    double luas() {
        return Math.PI * r * r;
    }
}`, body: `Bentuk a = new Persegi(4);
Bentuk b = new Lingkaran(3);
a.info();
b.info();
// Bentuk c = new Bentuk();   // error: class abstract` })],

["Interface", "Interface adalah kontrak berisi method tanpa isi yang wajib diimplementasikan class dengan kata kunci implements. Satu class boleh mengimplementasikan banyak interface, sedangkan extends hanya untuk satu class induk.",
javaDoc({ top: `interface Hewan {
    void suara();
}

interface Hewan2 {
    default void tidur() {
        System.out.println("Zzz...");
    }
}

class Kucing implements Hewan, Hewan2 {
    public void suara() {
        System.out.println("Meong");
    }
}`, body: `Kucing k = new Kucing();
k.suara();
k.tidur();` })],

["Enums", "Enum adalah tipe khusus berisi sekumpulan konstanta tetap, misalnya hari atau tingkat kesulitan. Dapat dipakai pada switch, ditelusuri dengan values(), dan punya metode seperti ordinal() dan name().",
javaDoc({ top: `enum Level {
    MUDAH, SEDANG, SULIT
}`, body: `Level l = Level.SEDANG;
System.out.println(l);
System.out.println(l.ordinal());

for (Level x : Level.values()) {
    System.out.println(x);
}

switch (l) {
    case MUDAH:
        System.out.println("Level mudah");
        break;
    case SEDANG:
        System.out.println("Level sedang");
        break;
    default:
        System.out.println("Level sulit");
}` })],

["User Input", "Class Scanner (java.util) membaca masukan dari pengguna: nextLine() untuk satu baris teks, nextInt() untuk bilangan bulat, nextDouble() untuk desimal. Isi kotak Input program (stdin) di bawah editor, satu baris untuk tiap masukan.",
javaDoc({ imp: "import java.util.Scanner;", body: `Scanner input = new Scanner(System.in);

System.out.println("Masukkan nama:");
String nama = input.nextLine();

System.out.println("Masukkan umur:");
int umur = input.nextInt();

System.out.println("Halo " + nama + ", tahun depan umurmu " + (umur + 1));
input.close();` }),
"Budi\n17"],

["Date", "Package java.time menyediakan class tanggal modern: LocalDate (tanggal), LocalTime (jam), dan LocalDateTime (keduanya). DateTimeFormatter memformat tanggal, dan plusDays() atau minusMonths() menggeser tanggal.",
javaDoc({ imp: `import java.time.LocalDate;
import java.time.format.DateTimeFormatter;`, body: `LocalDate hariIni = LocalDate.now();
System.out.println("Tahun ini: " + hariIni.getYear());

LocalDate tanggal = LocalDate.of(2026, 11, 26);
System.out.println(tanggal);
System.out.println(tanggal.plusDays(10));
System.out.println(tanggal.getDayOfWeek());

DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd-MM-yyyy");
System.out.println(tanggal.format(fmt));` })],

["ArrayList", "ArrayList adalah daftar dinamis yang ukurannya bisa bertambah dan berkurang, tidak seperti array biasa. Metode umum: add(), get(), set(), remove(), size(), dan contains(). Tipe isi ditulis di dalam <>.",
javaDoc({ imp: "import java.util.ArrayList;", body: `ArrayList<String> buah = new ArrayList<>();

buah.add("apel");
buah.add("jeruk");
buah.add("mangga");

System.out.println(buah);
System.out.println(buah.get(1));

buah.set(1, "pisang");
buah.remove("apel");
System.out.println(buah);
System.out.println(buah.size());
System.out.println(buah.contains("mangga"));` })],

["LinkedList", "LinkedList menyimpan elemen sebagai rantai node, efisien untuk menambah atau menghapus di awal dan akhir. Selain metode List biasa, tersedia addFirst(), addLast(), removeFirst(), dan removeLast().",
javaDoc({ imp: "import java.util.LinkedList;", body: `LinkedList<String> antrian = new LinkedList<>();

antrian.add("Ani");
antrian.add("Budi");
antrian.addFirst("Cici");
antrian.addLast("Dodi");

System.out.println(antrian);

antrian.removeFirst();
antrian.removeLast();
System.out.println(antrian);
System.out.println(antrian.getFirst());` })],

["HashMap", "HashMap menyimpan pasangan kunci-nilai dengan pencarian cepat berdasarkan kunci; kunci harus unik. Metode umum: put(), get(), containsKey(), remove(), size(), dan keySet() untuk menelusuri kunci.",
javaDoc({ imp: "import java.util.HashMap;", body: `HashMap<String, Integer> nilai = new HashMap<>();

nilai.put("Ani", 90);
nilai.put("Budi", 85);
nilai.put("Cici", 95);

System.out.println(nilai.get("Budi"));
System.out.println(nilai.containsKey("Dodi"));
nilai.remove("Cici");
System.out.println(nilai.size());

for (String nama : nilai.keySet()) {
    System.out.println(nama + " = " + nilai.get(nama));
}` })],

["HashSet", "HashSet menyimpan elemen unik tanpa urutan tertentu; menambah duplikat diabaikan. Metode umum: add(), contains(), remove(), dan size(). Cocok untuk menghapus duplikat atau mengecek keanggotaan cepat.",
javaDoc({ imp: "import java.util.HashSet;", body: `HashSet<String> kota = new HashSet<>();

kota.add("Medan");
kota.add("Jakarta");
kota.add("Medan");      // duplikat diabaikan

System.out.println(kota.size());
System.out.println(kota.contains("Jakarta"));

kota.remove("Jakarta");
System.out.println(kota);` })],

["Wrapper Classes", "Wrapper class membungkus tipe primitif menjadi objek: Integer, Double, Boolean, Character, dan seterusnya. Dibutuhkan untuk koleksi seperti ArrayList<Integer>. Java melakukan autoboxing (primitif ke objek) dan unboxing secara otomatis.",
javaDoc({ imp: "import java.util.ArrayList;", body: `Integer a = 5;               // autoboxing
int b = a;                   // unboxing
System.out.println(a + b);

ArrayList<Integer> daftar = new ArrayList<>();
daftar.add(10);
daftar.add(20);
System.out.println(daftar);

int angka = Integer.parseInt("123");
System.out.println(angka + 1);
System.out.println(Integer.toString(99).length());
System.out.println(Double.parseDouble("3.5") * 2);
System.out.println(Integer.MAX_VALUE);` })],

["Exceptions", "Exception adalah error saat program berjalan. try...catch menangkap error agar program tidak berhenti, finally selalu dijalankan, dan throw melempar exception sendiri. Exception tertentu bisa ditangkap spesifik, misalnya ArithmeticException.",
javaDoc({ members: `static void cekUmur(int umur) {
    if (umur < 18) {
        throw new IllegalArgumentException("Umur harus minimal 18");
    }
    System.out.println("Akses diberikan");
}`, body: `try {
    int hasil = 10 / 0;
    System.out.println(hasil);
} catch (ArithmeticException e) {
    System.out.println("Error: " + e.getMessage());
} finally {
    System.out.println("Blok finally dijalankan");
}

try {
    cekUmur(15);
} catch (IllegalArgumentException e) {
    System.out.println("Ditolak: " + e.getMessage());
}` })],

["Threads", "Thread memungkinkan beberapa tugas berjalan bersamaan. Buat thread dengan new Thread(tugas), jalankan dengan start(), dan tunggu selesai dengan join(). Urutan output thread yang berjalan paralel bisa berbeda tiap kali dijalankan.",
javaDoc({ body: `Thread t1 = new Thread(() -> {
    for (int i = 1; i <= 3; i++) {
        System.out.println("Thread A: " + i);
    }
});

t1.start();

try {
    t1.join();      // tunggu t1 selesai
} catch (InterruptedException e) {
    System.out.println("Dihentikan");
}

System.out.println("Main selesai setelah thread A");` })],

["Lambda", "Lambda adalah cara singkat menulis method anonim: (parameter) -> ekspresi. Dipakai untuk interface dengan satu method (functional interface), serta pada forEach, Comparator, dan Runnable.",
javaDoc({ imp: `import java.util.ArrayList;
import java.util.Collections;`, body: `ArrayList<String> nama = new ArrayList<>();
nama.add("Cici");
nama.add("Ani");
nama.add("Budi");

nama.forEach(n -> System.out.println("Halo " + n));

Collections.sort(nama, (a, b) -> b.compareTo(a));   // urut menurun
System.out.println(nama);

Runnable tugas = () -> System.out.println("Tugas dijalankan");
tugas.run();` })]
];

/* ======================== C++ ======================== */
LESSONS["C++"] = [
["Intro", "C++ adalah bahasa pemrograman cepat dan bertenaga untuk game, sistem operasi, dan aplikasi berkinerja tinggi. Kodenya dikompilasi menjadi program mesin. Program dimulai dari fungsi main(), dan cout dari pustaka iostream menampilkan teks.",
cppDoc({ body: `cout << "Halo, C++!" << endl;
cout << "Selamat belajar pemrograman" << endl;` })],

["Syntax", "Baris #include menyertakan pustaka, using namespace std agar tidak perlu menulis std:: berulang, dan main() adalah titik awal program. Setiap pernyataan diakhiri titik koma, dan return 0 menandakan program selesai dengan baik.",
`#include <iostream>
using namespace std;

int main() {
    cout << "Halo dari fungsi main" << endl;
    return 0;
}`],

["Output", "cout << menampilkan data ke layar, dan operator << bisa dirangkai. endl pindah baris dan mengosongkan buffer. Nilai berbagai tipe dapat dicetak langsung tanpa konversi.",
cppDoc({ body: `cout << "Baris pertama" << endl;
cout << "Angka: " << 42 << endl;
cout << "Desimal: " << 3.14 << endl;
cout << "Gabung " << "banyak " << "nilai" << endl;
cout << "Tanpa pindah baris, ";
cout << "lanjut di baris sama" << endl;` })],

["Comments", "Komentar diabaikan kompiler. Komentar satu baris diawali //, sedangkan komentar banyak baris ditulis di antara /* dan */.",
cppDoc({ body: `// Ini komentar satu baris
cout << "Baris ini dijalankan" << endl;

/* Ini komentar
   banyak baris */

// cout << "Baris ini tidak dijalankan" << endl;` })],

["Variables", "Variabel dideklarasikan dengan tipe: tipe nama = nilai;. Tipe umum: int (bulat), double (desimal), char (satu karakter), string (teks), dan bool. Tambahkan const agar nilai tidak bisa diubah.",
cppDoc({ inc: "#include <string>", body: `string nama = "Ani";
int umur = 16;
double tinggi = 1.62;
char kelas = 'A';
bool aktif = true;
const double PI = 3.14159;

cout << nama << ", " << umur << " tahun, " << tinggi << " m" << endl;
cout << "Kelas " << kelas << ", aktif: " << aktif << endl;
cout << "PI = " << PI << endl;

umur = 17;
cout << "Umur sekarang: " << umur << endl;` })],

["User Input", "cin >> membaca masukan dari pengguna ke variabel, dan beberapa nilai dapat dibaca berurutan. Untuk membaca satu baris penuh yang mengandung spasi, gunakan getline(cin, variabel). Isi kotak Input program (stdin) di bawah editor.",
cppDoc({ inc: "#include <string>", body: `string nama;
int umur;

cout << "Masukkan nama: ";
cin >> nama;

cout << "Masukkan umur: ";
cin >> umur;

cout << "Halo " << nama << ", tahun depan umurmu " << umur + 1 << endl;` }),
"Budi\n17"],

["Data Types", "Tipe dasar C++: int (bulat), float dan double (desimal), char (karakter), bool (true/false), dan string (teks). Operator sizeof memberi ukuran tipe dalam byte; ukurannya bisa berbeda antar sistem.",
cppDoc({ inc: "#include <string>", body: `int a = 2000000000;
float f = 3.14f;
double d = 3.14159265359;
char c = 'C';
bool ok = true;
string teks = "C++";

cout << a << " " << f << " " << d << endl;
cout << c << " " << ok << " " << teks << endl;
cout << "Ukuran int: " << sizeof(int) << " byte" << endl;
cout << "Ukuran double: " << sizeof(double) << " byte" << endl;` })],

["Operators", "Operator C++: aritmetika (+ - * / %), penugasan (= += -=), perbandingan (== != > <), logika (&& || !), dan increment/decrement (++ --). Pembagian dua int menghasilkan int.",
cppDoc({ body: `int x = 10;
int y = 3;

cout << x + y << endl;
cout << x / y << endl;
cout << x % y << endl;
cout << (x > y && y > 5) << endl;
cout << (x > y || y > 5) << endl;

x += 5;
x++;
cout << x << endl;
cout << (double) x / y << endl;` })],

["Strings", "string (pustaka <string>) menyimpan teks. Metode umum: length() atau size(), substr(), find(), dan append(). Karakter diakses dengan [], dan operator + menggabungkan string.",
cppDoc({ inc: "#include <string>", body: `string a = "Belajar";
string b = "C++";
string gabung = a + " " + b;

cout << gabung << endl;
cout << gabung.length() << endl;
cout << gabung[0] << endl;
cout << gabung.substr(0, 7) << endl;
cout << gabung.find("C++") << endl;

gabung.append("!");
cout << gabung << endl;` })],

["Math", "Fungsi matematika dasar ada di pustaka <cmath>: sqrt(), pow(), abs(), ceil(), floor(), dan round(). Fungsi max() dan min() tersedia di <algorithm>.",
cppDoc({ inc: "#include <cmath>\n#include <algorithm>", body: `cout << sqrt(64) << endl;
cout << pow(2, 8) << endl;
cout << abs(-4.7) << endl;
cout << ceil(4.1) << endl;
cout << floor(4.9) << endl;
cout << round(4.6) << endl;
cout << max(5, 10) << endl;
cout << min(5, 10) << endl;` })],

["Booleans", "Tipe bool bernilai true atau false, dan dicetak sebagai 1 atau 0 secara default. Gunakan boolalpha agar tercetak sebagai teks true/false. Hasil perbandingan selalu bool.",
cppDoc({ body: `bool lulus = true;
bool hujan = false;

cout << lulus << endl;
cout << (10 > 9) << endl;
cout << (10 == 9) << endl;

cout << boolalpha;
cout << lulus << endl;
cout << (lulus && !hujan) << endl;` })],

["Conditions If/Else", "Percabangan if...else if...else menjalankan blok berdasarkan kondisi di dalam kurung. Operator ternary: kondisi ? nilaiTrue : nilaiFalse.",
cppDoc({ inc: "#include <string>", body: `int nilai = 85;

if (nilai >= 90) {
    cout << "Sangat baik" << endl;
} else if (nilai >= 75) {
    cout << "Lulus" << endl;
} else {
    cout << "Belum lulus" << endl;
}

string status = (nilai >= 75) ? "Lulus" : "Tidak lulus";
cout << status << endl;` })],

["Switch", "switch memilih satu dari banyak kemungkinan untuk nilai bertipe bilangan bulat atau karakter. Setiap case diakhiri break, dan default dijalankan bila tidak ada yang cocok.",
cppDoc({ body: `int hari = 3;

switch (hari) {
    case 1:
        cout << "Senin" << endl;
        break;
    case 2:
        cout << "Selasa" << endl;
        break;
    case 3:
        cout << "Rabu" << endl;
        break;
    default:
        cout << "Hari lain" << endl;
}` })],

["While Loop", "while mengulang selama kondisi true dan mengecek di awal. do...while mengecek di akhir sehingga isi dijalankan minimal satu kali.",
cppDoc({ body: `int i = 1;
while (i <= 3) {
    cout << "while: " << i << endl;
    i++;
}

int j = 10;
do {
    cout << "do-while: " << j << endl;
    j++;
} while (j < 5);` })],

["For Loop", "for dipakai bila jumlah perulangan diketahui: for (inisialisasi; kondisi; perubahan). Untuk menelusuri array atau vector ada range-based for: for (tipe item : koleksi).",
cppDoc({ body: `for (int i = 1; i <= 5; i++) {
    cout << "Ke-" << i << endl;
}

int angka[] = {10, 20, 30};
for (int n : angka) {
    cout << "Nilai: " << n << endl;
}` })],

["Break/Continue", "break menghentikan perulangan atau switch, sedangkan continue melewati iterasi saat ini dan lanjut ke iterasi berikutnya.",
cppDoc({ body: `for (int i = 1; i <= 10; i++) {
    if (i == 3) {
        continue;       // lewati 3
    }
    if (i == 6) {
        break;          // berhenti di 6
    }
    cout << i << endl;
}
cout << "Selesai" << endl;` })],

["Arrays", "Array menyimpan banyak nilai bertipe sama dengan ukuran tetap. Indeks dimulai dari 0. C++ tidak mengecek batas indeks, jadi mengakses indeks di luar ukuran menyebabkan perilaku tak terduga. Array dua dimensi ditulis tipe nama[baris][kolom].",
cppDoc({ inc: "#include <string>", body: `string buah[3] = {"apel", "jeruk", "mangga"};
cout << buah[0] << endl;

int angka[5] = {10, 20, 30, 40, 50};
angka[1] = 25;

int total = 0;
for (int i = 0; i < 5; i++) {
    total += angka[i];
}
cout << "Total: " << total << endl;
cout << "Jumlah elemen: " << sizeof(angka) / sizeof(angka[0]) << endl;

int matriks[2][2] = {{1, 2}, {3, 4}};
cout << matriks[1][0] << endl;` })],

["Structures", "struct menggabungkan beberapa variabel (anggota) dengan tipe berbeda dalam satu tipe baru. Anggota diakses dengan operator titik. Struct cocok untuk data sederhana seperti siswa atau titik koordinat.",
cppDoc({ inc: "#include <string>", top: `struct Siswa {
    string nama;
    int umur;
    double nilai;
};`, body: `Siswa a;
a.nama = "Ani";
a.umur = 16;
a.nilai = 90.5;

Siswa b = {"Budi", 17, 85.0};

cout << a.nama << " " << a.umur << " " << a.nilai << endl;
cout << b.nama << " " << b.umur << " " << b.nilai << endl;` })],

["Enums", "enum membuat kumpulan konstanta bernama. enum class (C++11) lebih aman karena nilainya harus ditulis dengan nama enum dan tidak otomatis menjadi int.",
cppDoc({ top: `enum Level { MUDAH, SEDANG, SULIT };

enum class Warna { MERAH, HIJAU, BIRU };`, body: `Level l = SEDANG;
cout << l << endl;          // dicetak sebagai angka 1

Warna w = Warna::BIRU;
if (w == Warna::BIRU) {
    cout << "Warna biru" << endl;
}

switch (l) {
    case MUDAH:  cout << "Mudah" << endl;  break;
    case SEDANG: cout << "Sedang" << endl; break;
    default:     cout << "Sulit" << endl;
}` })],

["References", "Referensi adalah nama lain (alias) untuk variabel yang sudah ada, dibuat dengan tanda & saat deklarasi. Mengubah referensi berarti mengubah variabel aslinya. Referensi harus langsung diisi dan tidak bisa diarahkan ke variabel lain.",
cppDoc({ inc: "#include <string>", body: `string makanan = "Nasi goreng";
string &alias = makanan;

cout << makanan << endl;
cout << alias << endl;

alias = "Mie ayam";
cout << makanan << endl;        // ikut berubah

int a = 5;
int &ref = a;
ref++;
cout << a << endl;` })],

["Pointers", "Pointer menyimpan alamat memori variabel. & mengambil alamat variabel, * saat deklarasi membuat pointer, dan * saat dipakai (dereference) membaca atau mengubah nilai di alamat tersebut. nullptr berarti pointer tidak menunjuk ke mana pun.",
cppDoc({ body: `int umur = 17;
int *p = &umur;

cout << "Nilai umur: " << umur << endl;
cout << "Nilai lewat pointer: " << *p << endl;
cout << "Alamat sama: " << (p == &umur) << endl;

*p = 20;                    // mengubah umur lewat pointer
cout << "Umur sekarang: " << umur << endl;

int *kosong = nullptr;
cout << "Pointer kosong: " << (kosong == nullptr) << endl;` })],

["Functions", "Fungsi adalah blok kode bernama yang bisa dipanggil berulang. Tuliskan tipe kembalian, nama, dan parameter. Fungsi yang tidak mengembalikan nilai bertipe void. Fungsi harus dideklarasikan sebelum dipakai.",
cppDoc({ top: `void sapa() {
    cout << "Halo dari fungsi!" << endl;
}

int tambah(int a, int b) {
    return a + b;
}`, body: `sapa();
sapa();
int hasil = tambah(3, 4);
cout << "3 + 4 = " << hasil << endl;` })],

["Function Parameters", "Parameter dapat dikirim berdasarkan nilai (salinan, aslinya tidak berubah), berdasarkan referensi (&, aslinya bisa berubah), atau dengan nilai default. Parameter default ditulis di akhir daftar parameter.",
cppDoc({ inc: "#include <string>", top: `void tukar(int &a, int &b) {
    int sementara = a;
    a = b;
    b = sementara;
}

void tambahSatu(int x) {
    x = x + 1;      // hanya mengubah salinan
}

void sapa(string nama, string sapaan = "Halo") {
    cout << sapaan << ", " << nama << "!" << endl;
}`, body: `int a = 1, b = 2;
tukar(a, b);
cout << a << " " << b << endl;

int n = 5;
tambahSatu(n);
cout << n << endl;

sapa("Budi");
sapa("Ani", "Selamat pagi");` })],

["Function Overloading", "Overloading berarti beberapa fungsi memakai nama sama tetapi jumlah atau tipe parameternya berbeda. Kompiler memilih fungsi yang cocok dengan argumen yang diberikan.",
cppDoc({ top: `int tambah(int a, int b) {
    return a + b;
}

double tambah(double a, double b) {
    return a + b;
}

int tambah(int a, int b, int c) {
    return a + b + c;
}`, body: `cout << tambah(2, 3) << endl;
cout << tambah(2.5, 3.5) << endl;
cout << tambah(1, 2, 3) << endl;` })],

["Recursion", "Rekursi adalah fungsi yang memanggil dirinya sendiri. Wajib punya kondisi berhenti (base case) agar tidak berulang tanpa akhir. Contoh klasik: faktorial dan deret Fibonacci.",
cppDoc({ top: `int faktorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * faktorial(n - 1);
}

int fibonacci(int n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}`, body: `cout << "5! = " << faktorial(5) << endl;

for (int i = 0; i < 8; i++) {
    cout << fibonacci(i) << " ";
}
cout << endl;` })],

["OOP", "OOP (Object-Oriented Programming) membangun program dari objek yang menggabungkan data (atribut) dan perilaku (method). Pilar utamanya: enkapsulasi, pewarisan, polimorfisme, dan abstraksi. Class adalah cetak biru dan objek adalah instansnya.",
cppDoc({ inc: "#include <string>", top: `class Kucing {
public:
    string nama = "Tom";

    void mengeong() {
        cout << nama << " berkata: Meong!" << endl;
    }
};`, body: `Kucing k;       // membuat objek dari class
k.mengeong();` })],

["Classes/Objects", "Class dibuat dengan kata kunci class, diakhiri titik koma. Atribut dan method berada di dalamnya, dan objek dibuat dengan menuliskan nama class diikuti nama objek. Anggota diakses dengan operator titik.",
cppDoc({ inc: "#include <string>", top: `class Mobil {
public:
    string merek;
    int tahun;
};`, body: `Mobil m1;
m1.merek = "Toyota";
m1.tahun = 2020;

Mobil m2;
m2.merek = "Honda";
m2.tahun = 2023;

cout << m1.merek << " " << m1.tahun << endl;
cout << m2.merek << " " << m2.tahun << endl;` })],

["Class Methods", "Method adalah fungsi di dalam class. Dapat ditulis di dalam class, atau dideklarasikan di dalam class lalu didefinisikan di luar dengan operator ::.",
cppDoc({ top: `class Kalkulator {
public:
    int tambah(int a, int b) {
        return a + b;
    }

    int kali(int a, int b);     // dideklarasikan di sini
};

int Kalkulator::kali(int a, int b) {   // didefinisikan di luar class
    return a * b;
}`, body: `Kalkulator k;
cout << k.tambah(3, 4) << endl;
cout << k.kali(3, 4) << endl;` })],

["Constructors", "Constructor adalah method khusus bernama sama dengan class, tanpa tipe kembalian, dan otomatis dijalankan saat objek dibuat. Bisa memiliki parameter dan boleh lebih dari satu. Daftar inisialisasi (: atribut(nilai)) menyiapkan atribut dengan efisien.",
cppDoc({ inc: "#include <string>", top: `class Buku {
public:
    string judul;
    int halaman;

    Buku() : judul("Tanpa judul"), halaman(0) {}

    Buku(string j, int h) : judul(j), halaman(h) {}
};`, body: `Buku a;
Buku b("Belajar C++", 300);

cout << a.judul << " - " << a.halaman << endl;
cout << b.judul << " - " << b.halaman << endl;` })],

["Access Specifiers", "Access specifier mengatur akses anggota class: public (bisa diakses dari mana saja), private (hanya di dalam class, default untuk class), dan protected (di dalam class dan turunannya).",
cppDoc({ inc: "#include <string>", top: `class Contoh {
public:
    string umum = "bisa diakses dari luar";

    string bacaRahasia() {
        return rahasia;
    }

private:
    string rahasia = "hanya di dalam class";
};`, body: `Contoh c;
cout << c.umum << endl;
cout << c.bacaRahasia() << endl;
// cout << c.rahasia << endl;   // error: private` })],

["Encapsulation", "Enkapsulasi menyembunyikan data dengan membuat atribut private dan menyediakan method public (getter dan setter) untuk membaca atau mengubahnya, sehingga nilai bisa divalidasi lebih dulu.",
cppDoc({ top: `class Rekening {
private:
    double saldo = 0;

public:
    double getSaldo() {
        return saldo;
    }

    void setor(double jumlah) {
        if (jumlah > 0) {
            saldo += jumlah;
        } else {
            cout << "Jumlah setoran harus positif" << endl;
        }
    }
};`, body: `Rekening r;
r.setor(500000);
r.setor(-100);
cout << "Saldo: " << r.getSaldo() << endl;` })],

["Inheritance", "Pewarisan membuat class turunan yang memakai anggota class induk dengan sintaks class Anak : public Induk. Turunan dapat menambah anggota baru dan memanggil constructor induk lewat daftar inisialisasi.",
cppDoc({ inc: "#include <string>", top: `class Hewan {
public:
    string nama;

    Hewan(string n) : nama(n) {}

    void makan() {
        cout << nama << " sedang makan" << endl;
    }
};

class Kucing : public Hewan {
public:
    Kucing(string n) : Hewan(n) {}

    void mengeong() {
        cout << nama << " mengeong" << endl;
    }
};`, body: `Kucing k("Tom");
k.makan();          // diwarisi dari Hewan
k.mengeong();` })],

["Polymorphism", "Polimorfisme memungkinkan pointer atau referensi tipe induk memanggil method sesuai objek turunan sebenarnya. Syaratnya, method induk ditandai virtual dan method turunan menimpanya dengan override.",
cppDoc({ top: `class Hewan {
public:
    virtual void suara() {
        cout << "Hewan bersuara" << endl;
    }
    virtual ~Hewan() {}
};

class Kucing : public Hewan {
public:
    void suara() override {
        cout << "Meong" << endl;
    }
};

class Anjing : public Hewan {
public:
    void suara() override {
        cout << "Guk guk" << endl;
    }
};`, body: `Hewan *a = new Hewan();
Hewan *b = new Kucing();
Hewan *c = new Anjing();

a->suara();
b->suara();
c->suara();

delete a;
delete b;
delete c;` })],

["Files", "Pustaka <fstream> dipakai untuk file: ofstream menulis, ifstream membaca, dan fstream keduanya. Setelah selesai file ditutup dengan close(). getline() membaca file baris demi baris.",
cppDoc({ inc: "#include <fstream>\n#include <string>", body: `ofstream tulis("catatan.txt");
tulis << "Baris pertama" << endl;
tulis << "Baris kedua" << endl;
tulis.close();

ifstream baca("catatan.txt");
string baris;
while (getline(baca, baris)) {
    cout << baris << endl;
}
baca.close();` })],

["Exceptions", "Exception menangani error saat program berjalan. Kode berisiko ada di try, throw melempar error, dan catch menangkapnya. catch (...) menangkap segala jenis exception, dan what() memberi pesan error.",
cppDoc({ inc: "#include <stdexcept>", top: `int bagi(int a, int b) {
    if (b == 0) {
        throw runtime_error("Tidak bisa dibagi nol");
    }
    return a / b;
}`, body: `try {
    cout << bagi(10, 2) << endl;
    cout << bagi(10, 0) << endl;
    cout << "Baris ini dilewati" << endl;
} catch (const exception &e) {
    cout << "Error: " << e.what() << endl;
}

try {
    throw 404;
} catch (int kode) {
    cout << "Kode error: " << kode << endl;
}` })],

["Date", "Pustaka <ctime> menangani tanggal dan waktu. time(nullptr) memberi waktu sekarang, struct tm menyimpan komponen tanggal, mktime() menormalkannya, dan strftime() memformat ke teks.",
cppDoc({ inc: "#include <ctime>", body: `time_t sekarang = time(nullptr);
tm *waktu = localtime(&sekarang);
cout << "Tahun ini: " << waktu->tm_year + 1900 << endl;

tm tanggal = {};
tanggal.tm_year = 2026 - 1900;
tanggal.tm_mon = 10;            // 0 = Januari, jadi 10 = November
tanggal.tm_mday = 26 + 10;      // tambah 10 hari
mktime(&tanggal);               // menormalkan tanggal

char teks[32];
strftime(teks, sizeof(teks), "%d-%m-%Y", &tanggal);
cout << "10 hari setelah 26-11-2026: " << teks << endl;` })],

["Vectors", "vector adalah array dinamis yang ukurannya dapat bertambah, dari pustaka <vector>. Metode umum: push_back(), pop_back(), size(), at(), clear(), dan empty(). Lebih aman dan fleksibel dibanding array biasa.",
cppDoc({ inc: "#include <vector>\n#include <string>", body: `vector<string> buah = {"apel", "jeruk"};

buah.push_back("mangga");
buah.push_back("pisang");

cout << "Jumlah: " << buah.size() << endl;
cout << "Pertama: " << buah[0] << endl;
cout << "Indeks 2: " << buah.at(2) << endl;

buah.pop_back();

for (string b : buah) {
    cout << b << endl;
}` })],

["STL", "STL (Standard Template Library) berisi wadah (vector, map, set), algoritma (sort, find, reverse), dan iterator siap pakai. Dengan STL kita tidak perlu menulis ulang struktur data dasar.",
cppDoc({ inc: "#include <vector>\n#include <map>\n#include <set>\n#include <algorithm>\n#include <string>", body: `vector<int> angka = {40, 10, 30, 20};
sort(angka.begin(), angka.end());
for (int n : angka) {
    cout << n << " ";
}
cout << endl;

map<string, int> nilai;
nilai["Ani"] = 90;
nilai["Budi"] = 85;
for (auto &p : nilai) {
    cout << p.first << " = " << p.second << endl;
}

set<int> unik = {3, 1, 3, 2, 1};
cout << "Elemen unik: " << unik.size() << endl;` })]
];

/* ============ Turunan data untuk script.js ============ */
const MATERI_DATA = {};
Object.keys(LESSONS).forEach(bahasa => {
    MATERI_DATA[bahasa] = LESSONS[bahasa].map(materi => materi[0]);
});

const DESKRIPSI = {
    HTML: "HTML digunakan untuk membangun struktur dan konten halaman website.",
    CSS: "CSS digunakan untuk mengatur tampilan, warna, layout, dan desain website.",
    JavaScript: "JavaScript digunakan untuk menambahkan interaksi dan logika pada website.",
    Python: "Python adalah bahasa pemrograman dengan sintaks yang mudah dibaca.",
    Java: "Java merupakan bahasa pemrograman berorientasi objek.",
    "C++": "C++ merupakan bahasa pemrograman yang mendukung pemrograman prosedural dan berorientasi objek."
};

function getLesson(bahasa, topik) {
    const daftar = LESSONS[bahasa] || [];
    const data = daftar.find(materi => materi[0] === topik);

    if (!data) return null;

    return {
        judul: data[0],
        penjelasan: data[1],
        kode: data[2],
        stdin: data[3] || ""
    };
}