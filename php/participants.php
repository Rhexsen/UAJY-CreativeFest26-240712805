<?php
$dataFilePath = __DIR__ . "/../data/participants.txt";

/* Mengambil seluruh baris data peserta dan mengubahnya menjadi array */
function getAllParticipants($filePath)
{
    $participants = array();

    if (!file_exists($filePath)) {
        return $participants;
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        $fields = explode("|", $line);

        $participants[] = array(
            "fullname"   => isset($fields[0]) ? trim($fields[0]) : "",
            "npm"        => isset($fields[1]) ? trim($fields[1]) : "",
            "email"      => isset($fields[2]) ? trim($fields[2]) : "",
            "phone"      => isset($fields[3]) ? trim($fields[3]) : "",
            "category"   => isset($fields[4]) ? trim($fields[4]) : "",
            "teamname"   => isset($fields[5]) ? trim($fields[5]) : "",
            "motivation" => isset($fields[6]) ? trim($fields[6]) : "",
            "registered_at" => isset($fields[7]) ? trim($fields[7]) : ""
        );
    }

    return $participants;
}

$action = isset($_GET["action"]) ? $_GET["action"] : "";

// Mode AJAX: kembalikan jumlah peserta dalam format JSON
if ($action === "count") {
    header("Content-Type: application/json; charset=UTF-8");
    $participants = getAllParticipants($dataFilePath);
    echo json_encode(array("total" => count($participants)));
    exit;
}

// Mode default: tampilkan halaman rekap peserta (khusus panitia/admin)
$participants = getAllParticipants($dataFilePath);
$totalParticipants = count($participants);

echo '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="id" lang="id">

    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Rekap Peserta | UAJY Creative Fest 2026</title>
        <link rel="stylesheet" type="text/css" href="../css/style.css" />
    </head>
    
    <body>
        <header class="site-header">
            <div class="container">
                <a href="../index.xhtml" class="brand">
                    <img src="../images/Logo UAJY.png" alt="Logo UAJY" class="logo" />
                    <span class="brand-text">
                        <span class="brand-name">Creative Fest</span>
                        <span class="brand-sub">UAJY 2026</span>
                    </span>
                </a>
            </div>
        </header>

        <section class="section">
            <div class="container">
                <div class="section-title-row">
                    <span class="kicker">Khusus Panitia</span>
                    <h2>Rekap Peserta Terdaftar</h2>
                    <p class="lead">Total peserta terdaftar saat ini: <strong><?php echo $totalParticipants; ?></strong></p>
                </div>

                <div class="table-wrapper">
                    <table class="schedule-table">
                        <caption>Data Peserta UAJY Creative Fest 2026</caption>
                        <thead>
                            <tr>
                                <th scope="col">No.</th>
                                <th scope="col">Nama</th>
                                <th scope="col">NPM</th>
                                <th scope="col">Email</th>
                                <th scope="col">Kategori</th>
                                <th scope="col">Waktu Daftar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if ($totalParticipants === 0) { ?>
                            <tr>
                                <td colspan="6">Belum ada peserta yang mendaftar.</td>
                            </tr>
                            <?php } else { ?>
                                <?php $rowNumber = 1; ?>
                                <?php foreach ($participants as $participant) { ?>
                            <tr>
                                <td><?php echo $rowNumber; ?></td>
                                <td><?php echo htmlspecialchars($participant["fullname"]); ?></td>
                                <td><?php echo htmlspecialchars($participant["npm"]); ?></td>
                                <td><?php echo htmlspecialchars($participant["email"]); ?></td>
                                <td><?php echo htmlspecialchars($participant["category"]); ?></td>
                                <td><?php echo htmlspecialchars($participant["registered_at"]); ?></td>
                            </tr>
                                <?php $rowNumber++; ?>
                                <?php } ?>
                            <?php } ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    </body>
</html>
