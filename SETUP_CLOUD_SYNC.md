# Setup Sync Antar-Device (Supabase)

File `index.html` sudah saya lengkapi dengan fitur **Sync Cloud**, memakai
Supabase yang sudah Anda buat:

- URL: `https://iqrfnqncvhmmbovgbcwl.supabase.co`
- Anon/publishable key: sudah ditulis langsung di `index.html`

## Langkah 1 — Buat tabel di Supabase (SEKALI SAJA)

1. Buka https://supabase.com/dashboard, pilih project Anda.
2. Klik menu **SQL Editor** di sidebar kiri > **New query**.
3. Buka file `supabase_setup.sql` yang ada di folder ini, salin semua
   isinya, tempel ke SQL Editor.
4. Klik **Run**. Kalau berhasil akan muncul "Success. No rows returned".

Ini membuat 1 tabel bernama `app_backups` yang menyimpan seluruh data
aplikasi (Penjualan, Uang Masuk, DTH, Batal/Titip/Lunas) sebagai satu
baris JSON, plus mengaktifkan izin akses yang aman (RLS).

## Langkah 2 — Upload ulang file ke GitHub

Upload/replace 3 file berikut ke repo `PENJ_UM_DTH` Anda (timpa yang lama):
- `index.html`
- `sw.js`

(`manifest.json` dan ikon tidak berubah, tidak perlu diupload ulang.)

Setelah ke-upload, tunggu 1-2 menit lalu buka lagi
`https://hamung99.github.io/PENJ_UM_DTH/` — refresh dengan **Ctrl+Shift+R**
(hard refresh) supaya service worker mengambil versi terbaru.

## Langkah 3 — Cara pakai sync antar-device

Di dalam aplikasi, klik tombol **💾 Backup** di header, akan ada bagian
baru **"☁️ Sync Antar-Device (Cloud)"**:

- **⬆️ Upload Data Device Ini ke Cloud** — kirim data dari device yang
  sedang dipakai ke Supabase (menimpa data cloud).
- **⬇️ Ambil Data Terbaru dari Cloud** — tarik data dari Supabase ke
  device ini (menimpa data lokal).

Alur yang disarankan:
1. Selesai kerja/input data di device A → klik **Upload ke Cloud**.
2. Buka aplikasi di device B → akan muncul banner biru "Ada data lebih
   baru di Cloud" → klik **Ambil Sekarang**, atau buka menu Backup lalu
   klik **Ambil Data Terbaru dari Cloud**.

⚠️ Sync ini **manual, bukan otomatis real-time** — sengaja dibuat begitu
supaya data tidak tertimpa tanpa sadar kalau 2 device dipakai bersamaan.
Biasakan selalu **Upload** setelah selesai kerja, dan **Ambil** sebelum
mulai kerja di device lain.

## Catatan keamanan

Karena repo GitHub Anda **Public**, siapa pun bisa melihat source code
`index.html` — termasuk URL dan anon key Supabase di dalamnya. Ini
sebenarnya wajar untuk anon/publishable key (memang didesain aman dipakai
di sisi client), TAPI karena kita mengizinkan anon key membaca & menulis
tabel `app_backups`, itu berarti siapa pun yang menemukan key ini juga
bisa membaca/menimpa data Anda di Supabase.

Untuk aplikasi internal skala kecil ini biasanya risikonya rendah, tapi
kalau datanya sensitif dan Anda mau lebih aman, beberapa opsi:
- Jadikan repo GitHub **Private** (mengurangi siapa yang bisa melihat key).
- Tambahkan lapisan password sederhana sebelum sync bisa jalan (saya bisa
  bantu tambahkan kalau mau).
- Gunakan Supabase Auth (login email/password) supaya RLS bisa membatasi
  akses per-user — ini lebih proper tapi butuh perubahan lebih besar.

Kabari saya kalau mau saya tambahkan salah satu di atas.
