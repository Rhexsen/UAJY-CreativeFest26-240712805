# UAJY CreativeFest 2026
Website ini dibuat untuk **UAJY CreativeFest 2026**, yaitu kegiatan perlombaan yang ditujukan untuk peserta yang ingin menunjukkan kemampuan dan kreativitasnya melalui beberapa bidang perlombaan yang tersedia.

Website ini digunakan untuk membantu peserta mendapatkan informasi mengenai lomba, melihat jadwal kegiatan, serta melakukan pendaftaran secara online.

## Tentang UAJY CreativeFest 2026

UAJY CreativeFest 2026 merupakan kegiatan perlombaan yang memberikan kesempatan bagi peserta untuk mengembangkan dan menunjukkan kreativitas serta kemampuan yang mereka miliki.

Melalui website ini, peserta dapat melihat informasi lomba yang tersedia, mengetahui jadwal kegiatan, dan melakukan pendaftaran tanpa harus melakukan proses secara manual.

## Tujuan Website

Website ini dibuat untuk mempermudah proses penyampaian informasi dan pendaftaran peserta. Dengan adanya website ini, peserta dapat:

* Melihat informasi mengenai lomba
* Mengetahui jadwal kegiatan
* Melakukan pendaftaran secara online
* Melihat informasi peserta yang sudah terdaftar

## Fitur

Beberapa fitur yang tersedia pada website ini antara lain:

* **Home** — menampilkan informasi utama mengenai CreativeFest 2026.
* **Registration** — digunakan untuk melakukan pendaftaran lomba.
* **Schedule** — menampilkan jadwal kegiatan.
* **Participants** — menampilkan data peserta yang sudah melakukan pendaftaran.
* **Validasi Form** — melakukan pengecekan terhadap data yang dimasukkan sebelum pendaftaran diproses.

## Cara Menjalankan Web

Gunakan PHP built-in server lewat Command Prompt / Terminal:

1. Pastikan Project ini download terlebih dahulu dan juga PHP sudah terinstall di komputer. Cek dengan menjalankan `php -v` di Command Prompt / Terminal. Jika belum ada, download PHP terlebih dahulu
2. Buka Command Prompt / Terminal, lalu masuk (`cd`) ke folder project ini, contohnya:

   cd UAJY-CreativeFest26-240712805
   Contoh : PS C:\Users\legion\OneDrive\Documents\Rhexsen hehe\Hola\UAJY-CreativeFest26-240712805>
   
3. Jalankan perintah berikut:

   php -S localhost:8000

4. Setelah itu buka browser dan akses:

   http://localhost:8000/index.xhtml

5. Website kemudian dapat digunakan seperti biasa. Untuk berhenti, tekan `Ctrl + C` di Command Prompt / Terminal.

### Catatan

* Buka website mulai dari `index.xhtml`, bukan langsung dari `registration.xhtml` atau `schedule.xhtml`.
* Pastikan folder `data/` bisa ditulis (writable) oleh server, karena di situlah `participants.txt` disimpan setiap ada pendaftar baru.
* Untuk melihat rekap peserta, akses `php/participants.php` melalui browser setelah server jalan.

## Struktur Folder

```
campus-event-NPM/
├── index.xhtml              # halaman utama
├── registration.xhtml       # form pendaftaran peserta
├── schedule.xhtml           # jadwal kegiatan (XHTML table)
├── css/style.css            # external stylesheet
├── js/
│   ├── script.js            # DOM manipulation, validasi client-side, jQuery AJAX
│   └── jquery.min.js        # library jQuery
├── php/
│   ├── process_registration.php   # proses + validasi server-side + simpan data
│   └── participants.php           # baca data peserta (JSON count & rekap admin)
├── data/participants.txt    # penyimpanan data peserta (format teks, dipisah "|")
└── images/                  
```

Folder `php/` digunakan untuk proses yang berjalan di sisi server, sedangkan folder `data/` digunakan untuk menyimpan data peserta dalam bentuk file `.txt`.
