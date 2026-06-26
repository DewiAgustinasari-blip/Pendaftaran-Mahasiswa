<?php

// SCRIPT UNTUK MENANGKAP DATA DAN MEMINDAHKAN FOTO KE FOLDER UPLOAD
// 1. Ambil data teks yang dikirim dari form HTML menggunakan metode POST
$nim    = isset($_POST['nim']) ? $_POST['nim'] : '-';
$nama   = isset($_POST['nama']) ? $_POST['nama'] : '-';
$email  = isset($_POST['email']) ? $_POST['email'] : '-';
$hp     = isset($_POST['hp']) ? $_POST['hp'] : '-';
$jk     = isset($_POST['jk']) ? $_POST['jk'] : '-';
$prodi  = isset($_POST['prodi']) ? $_POST['prodi'] : '-';
$alamat = isset($_POST['alamat']) ? $_POST['alamat'] : '-';

// 2. Proses pengecekan dan pemindahan file foto
if (isset($_FILES['foto']) && $_FILES['foto']['error'] == 0) {
    
    $namaFile        = $_FILES['foto']['name'];     // Nama asli file (contoh: foto_dewi.png)
    $lokasiSementara = $_FILES['foto']['tmp_name']; // Jalur transit sementara di server XAMPP
    
    // Tentukan folder tujuan (pastikan kamu sudah membuat folder bernama 'upload')
    $folderTujuan    = "upload/";
    
    // Gabungkan folder tujuan dengan nama filenya (menjadi: upload/foto_dewi.png)
    $jalurAkhir      = $folderTujuan . $namaFile;

    // PERINTAH UTAMA: Pindahkan file dari lokasi sementara ke folder upload laptopmu
    if (move_uploaded_file($lokasiSementara, $jalurAkhir)) {
        
        // --- TAMPILAN JIKA BERHASIL ---
        echo "<!DOCTYPE html>
        <html lang='id'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Pendaftaran Mahasiswa Baru</title>
            <link rel='stylesheet' href='css/style.css'>
            <style>
                /* Overwrite atau menimpa keanehan layout di simpan.php */
                .card-php-fix {
                    border-left: none !important; /* Menghapus garis lengkung aneh di sebelah kiri foto */
                    padding: 40px !important;     /* Memberikan ruang dalam yang seimbang */
                }
                
                .pas-foto-3x4 {
                    width: 150px;       /* Mengunci lebar 3x4 */
                    height: 200px;      /* Mengunci tinggi 3x4 */
                    object-fit: cover;  /* Foto tetap proporsional & tidak gepeng */
                    border-radius: 6px;
                    border: 1px solid #ddd;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }

                .btn-edit-php {
                    display: inline-block;
                    padding: 12px 30px;
                    background-color: #0b439c;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                    transition: background 0.3s;
                    border: none;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.15);
                }

                .btn-edit-php:hover {
                    background-color: #083275;
                }
            </style>
        </head>
        <body>

            <div class='container' style='display: block; max-width: 850px; margin: 50px auto;'>

                <div class='section-title' style='text-align: center;'>
                    PENDAFTARAN MAHASISWA BERHASIL!
                </div>

                <div class='card card-php-fix'>
                    <div class='hasil-container' style='display: flex; gap: 40px; align-items: center; justify-content: center;'>
                        
                        <div class='hasil-foto' style='flex: 1; text-align: right; max-width: 180px;'>
                            <img class='pas-foto-3x4' src='" . $jalurAkhir . "' alt='Foto Mahasiswa'>
                        </div>
                        
                        <div class='hasil-data' style='flex: 2; text-align: left; line-height: 2;'>
                            <h2 style='margin-top: 0; color: #0b439c; margin-bottom: 15px;'>Data Calon Mahasiswa</h2>
                            <p style='margin: 6px 0;'><b>NIM :</b> " . htmlspecialchars($nim) . "</p>
                            <p style='margin: 6px 0;'><b>Nama Lengkap :</b> " . htmlspecialchars($nama) . "</p>
                            <p style='margin: 6px 0;'><b>Email :</b> " . htmlspecialchars($email) . "</p>
                            <p style='margin: 6px 0;'><b>No HP :</b> " . htmlspecialchars($hp) . "</p>
                            <p style='margin: 6px 0;'><b>Jenis Kelamin :</b> " . htmlspecialchars($jk) . "</p>
                            <p style='margin: 6px 0;'><b>Program Studi :</b> " . htmlspecialchars($prodi) . "</p>
                            <p style='margin: 6px 0;'><b>Alamat :</b> " . htmlspecialchars($alamat) . "</p>
                        </div>

                    </div>

                    <div style='text-align: center; margin-top: 40px;'>
                        <button type='button' class='btn-edit-php' onclick='window.history.back();'>
                            Edit Data
                        </button>
                    </div>
                </div>

            </div>

        </body>
        </html>";

    } else {
        echo "<h3>Gagal memindahkan file! Periksa apakah folder bernama 'upload' sudah kamu buat di htdocs.</h3>";
    }

} else {
    echo "<h3>Error: Tidak ada file foto yang diunggah atau ukuran file terlalu besar!</h3>";
}
?>