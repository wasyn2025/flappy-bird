# Casual Flappy Bird Game

Game Flappy Bird sederhana yang dibuat menggunakan HTML, CSS, dan JavaScript murni (vanilla JS). Project ini dibuat untuk belajar dasar-dasar game development di browser, mulai dari rendering canvas, physics sederhana, collision detection, sampai score system.

## Deskripsi

Flappy Bird adalah game casual di mana pemain mengontrol seekor burung untuk terbang melewati celah di antara pipa-pipa. Burung akan terus jatuh karena gravitasi, dan pemain harus menekan tombol untuk membuatnya terbang ke atas. Game berakhir jika burung menabrak pipa atau tanah.

Project ini merupakan implementasi ulang yang ringan dan mudah dipahami, cocok untuk pemula yang ingin mempelajari cara kerja game loop, input handling, dan canvas API.

## Fitur

- Gameplay klasik Flappy Bird
- Physics gravitasi dan lompatan yang sederhana
- Collision detection antara burung dengan pipa & tanah
- Sistem skor yang bertambah setiap berhasil melewati pipa
- High score yang disimpan di `localStorage`
- Tampilan responsive (bisa dimainkan di desktop maupun mobile)
- Restart game dengan mudah setelah game over

## Teknologi yang Digunakan

- **HTML5** – struktur halaman dan elemen `<canvas>`
- **CSS3** – styling layout dan tampilan
- **JavaScript (Vanilla)** – seluruh logika game (tanpa library/framework eksternal)

## Cara Bermain

- **Desktop**: Tekan `Space` atau klik kiri mouse untuk membuat burung terbang
- **Mobile**: Tap di mana saja pada layar untuk terbang
- Hindari menabrak pipa atas, pipa bawah, dan tanah
- Semakin jauh kamu bertahan, semakin tinggi skornya

## Struktur Folder
casual-flappy-bird/
├── index.html          # File utama
├── style.css           # Styling
├── script.js           # Logika game
├── assets/             # Gambar burung, pipa, background, dll (opsional)
└── README.md