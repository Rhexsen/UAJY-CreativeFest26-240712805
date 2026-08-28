<?php
/*
 * Menerima data formulir pendaftaran, melakukan validasi di sisi server,
 * lalu menyimpan data peserta yang valid ke file data/participants.txt.
 * Merespons dalam format JSON agar dapat dikonsumsi oleh jQuery AJAX
 * pada halaman registration.xhtml.
 */

header("Content-Type: application/json; charset=UTF-8");

// Daftar kategori kompetisi yang valid
$validCategories = array(
    "Digital Poster Competition",
    "Campus Photography Competition",
    "Short Video Competition",
    "UI/UX Design Competition"
);

$dataFilePath = __DIR__ . "/../data/participants.txt";

function sanitizeInput($rawValue)
{
    $trimmedValue = trim($rawValue);
    $strippedValue = strip_tags($trimmedValue);
    return str_replace(array("|", "\r", "\n"), " ", $strippedValue);
}

// Hanya menerima method POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(array(
        "status" => "error",
        "message" => "Metode permintaan tidak diizinkan."
    ));
    exit;
}

// Ambil dan bersihkan input dari form
$fullname   = isset($_POST["fullname"]) ? sanitizeInput($_POST["fullname"]) : "";
$npm        = isset($_POST["npm"]) ? sanitizeInput($_POST["npm"]) : "";
$email      = isset($_POST["email"]) ? sanitizeInput($_POST["email"]) : "";
$phone      = isset($_POST["phone"]) ? sanitizeInput($_POST["phone"]) : "";
$category   = isset($_POST["category"]) ? sanitizeInput($_POST["category"]) : "";
$teamName   = isset($_POST["teamname"]) ? sanitizeInput($_POST["teamname"]) : "-";
$motivation = isset($_POST["motivation"]) ? sanitizeInput($_POST["motivation"]) : "";
$terms      = isset($_POST["terms"]) ? sanitizeInput($_POST["terms"]) : "";

$validationErrors = array();

// Validasi nama lengkap
if ($fullname === "") {
    $validationErrors[] = "Nama lengkap wajib diisi.";
}

// Validasi NPM wajib diisi dan hanya boleh angka
if ($npm === "" || !preg_match("/^[0-9]+$/", $npm)) {
    $validationErrors[] = "NPM wajib diisi dan hanya boleh berupa angka.";
}

// Validasi email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $validationErrors[] = "Format email tidak valid.";
}

// Validasi nomor HP hanya angka dan 10-14 digit
if (!preg_match("/^[0-9]{10,14}$/", $phone)) {
    $validationErrors[] = "Nomor HP harus berupa angka 10 sampai 14 digit.";
}

// Validasi kategori terhadap whitelist
if (!in_array($category, $validCategories, true)) {
    $validationErrors[] = "Kategori kompetisi tidak valid.";
}

// Validasi asal universitas
if ($motivation === "") {
    $validationErrors[] = "Asal universitas wajib diisi.";
}

// Validasi persetujuan syarat & ketentuan
if ($terms !== "setuju") {
    $validationErrors[] = "Kamu harus menyetujui syarat dan ketentuan.";
}

// Jika ada kesalahan validasi, kembalikan respons error tanpa menyimpan data
if (count($validationErrors) > 0) {
    http_response_code(422);
    echo json_encode(array(
        "status" => "error",
        "message" => "Pendaftaran gagal: " . implode(" ", $validationErrors)
    ));
    exit;
}

// Cegah duplikasi pendaftaran dengan NPM yang sama
if (file_exists($dataFilePath)) {
    $existingLines = file($dataFilePath, FILE_IGNORE_NEW_LINES);
    foreach ($existingLines as $existingLine) {
        $existingFields = explode("|", $existingLine);
        if (isset($existingFields[1]) && trim($existingFields[1]) === $npm) {
            http_response_code(409);
            echo json_encode(array(
                "status" => "error",
                "message" => "NPM ini sudah terdaftar sebelumnya."
            ));
            exit;
        }
    }
}

// Format data peserta menjadi satu baris teks
$registrationTime = date("Y-m-d H:i:s");
$participantLine = implode(" | ", array(
    $fullname,
    $npm,
    $email,
    $phone,
    $category,
    $teamName,
    $motivation,
    $registrationTime
)) . PHP_EOL . PHP_EOL;

// Simpan ke data/participants.txt (append, dibuat otomatis jika belum ada)
$writeResult = file_put_contents($dataFilePath, $participantLine, FILE_APPEND | LOCK_EX);

if ($writeResult === false) {
    http_response_code(500);
    echo json_encode(array(
        "status" => "error",
        "message" => "Gagal menyimpan data peserta. Silakan coba lagi."
    ));
    exit;
}

// Berhasil
echo json_encode(array(
    "status" => "success",
    "message" => "Pendaftaran berhasil! Terima kasih, " . $fullname . ". Cek emailmu untuk info lebih lanjut."
));
