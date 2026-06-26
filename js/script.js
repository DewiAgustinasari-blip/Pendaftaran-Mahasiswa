$(document).ready(function(){

    // Efek visual awal saat halaman web dimuat (manupulasi dom)
    $(".container").hide().slideDown(1000);

    //EDIT DATA: AMBIL KEMBALI PREVIEW FOTO DARI MEMORI JIKA BROWSER MUNDUR
    let fotoTersimpan = sessionStorage.getItem("fotoLama");
    if (fotoTersimpan) {
        $("#previewFoto").attr("src", fotoTersimpan);
    }

    // 1. MEMBUAT METODE VALIDASI KUSTOM UNTUK PAS FOTO
    // Pengecekan Ekstensi/Format File (.jpg, .jpeg, .png)
    $.validator.addMethod("cekFormatFoto", function(value, element) {
        if (element.files.length === 0) {
            // Jika user klik edit data dan tidak milih file baru, dianggap valid kalau foto lama ada di memori
            if (sessionStorage.getItem("fotoLama")) return true;
            return false;
        }
        
        let namaFile = element.files[0].name;
        let ekstensi = namaFile.substr(namaFile.lastIndexOf('.') + 1).toLowerCase();
        
        return ["jpg", "jpeg", "png"].includes(ekstensi);
    }, "Format harus JPG, JPEG, atau PNG");

    // Pengecekan Ukuran File (Maksimal 2MB)
    $.validator.addMethod("cekUkuranFoto", function(value, element, param) {
        if (element.files.length === 0) return true;
        return element.files[0].size <= param;
    }, "Ukuran file maksimal 2 MB");


    // 2. PROSES UPDATE PREVIEW FOTO SECARA REALTIME (SEBELUM SUBMIT)
    $("#foto").change(function(){
        let file = this.files[0];
        let iconDefault = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

        if (file) {
            let namaFile = file.name;
            let ekstensi = namaFile.substr(namaFile.lastIndexOf('.') + 1).toLowerCase();
            
            // Validasi format & ukuran internal sebelum menampilkan preview
            if (["jpg", "jpeg", "png"].includes(ekstensi) && file.size <= 2097152) {
                let reader = new FileReader();
                
                reader.onload = function(e) {
                    // Simpan foto ke memori browser agar tidak hilang saat klik "Edit Data"
                    sessionStorage.setItem("fotoLama", e.target.result);
                    
                    // Mengubah gambar preview ke foto pilihan user
                    $("#previewFoto").attr("src", e.target.result);
                };
                
                reader.readAsDataURL(file);
            } else {
                $("#previewFoto").attr("src", iconDefault);
                sessionStorage.removeItem("fotoLama");
            }
        } else {
            if (!sessionStorage.getItem("fotoLama")) {
                $("#previewFoto").attr("src", iconDefault);
            }
        }

        // Memaksa jQuery Validate mengecek ulang agar tanda merah error langsung hilang jika file valid
        if ($(this).val() !== "") {
            $(this).valid();
        }
    });


    // 3. KONFIGURASI JQUERY VALIDATION PLUGIN & SUBMIT KE PHP
    $("#formPendaftaran").validate({
        rules: {
            nim: {
                required: true,
                digits: true,
                minlength: 8
            },
            nama: {
                required: true,
                minlength: 5
            },
            email: {
                required: true,
                email: true
            },
            hp: {
                required: true,
                digits: true,
                minlength: 10
            },
            jk: {
                required: true
            },
            prodi: {
                required: true
            },
            alamat: {
                required: true,
                minlength: 10
            },
            foto: {
                // Jika sudah ada foto lama di memori (proses edit), required di-disable agar bisa langsung submit ulang
                required: function() {
                    return sessionStorage.getItem("fotoLama") === null;
                },
                cekFormatFoto: true,
                cekUkuranFoto: 2097152 
            }
        },

        messages: {
            nim: {
                required: "NIM wajib diisi",
                digits: "NIM harus angka",
                minlength: "NIM minimal 8 digit"
            },
            nama: {
                required: "Nama wajib diisi",
                minlength: "Nama minimal 5 karakter"
            },
            email: {
                required: "Email wajib diisi",
                email: "Format email tidak valid"
            },
            hp: {
                required: "Nomor HP wajib diisi",
                digits: "Nomor HP hanya boleh angka",
                minlength: "Nomor HP minimal 10 digit"
            },
            jk: {
                required: "Pilih jenis kelamin"
            },
            prodi: {
                required: "Pilih program studi"
            },
            alamat: {
                required: "Alamat wajib diisi",
                minlength: "Alamat minimal 10 karakter"
            },
            foto: {
                required: "Pas foto wajib diunggah"
            }
        },

        errorPlacement: function(error, element) {
            if (element.attr("name") === "jk") {
                error.appendTo("#errJk");
            } else {
                error.appendTo(element.siblings(".error"));
            }
        },

        // PINTU GERBANG: Dijalankan otomatis jika seluruh form VALID saat di-submit
        submitHandler: function(form) {
            form.submit(); // Melempar seluruh data dikirim ke file simpan.php
        }
    });


    // 4. KONTROL TOMBOL RESET (MENGEMBALIKAN TAMPILAN TOTAL KE AWAL)
    $("#btnReset").click(function(e){
        // Hapus tanda merah error bawaan jQuery Validate
        let validator = $("#formPendaftaran").validate();
        validator.resetForm();
        
        // Kosongkan isian form secara fisik
        $("#formPendaftaran")[0].reset();
        
        // Bersihkan total memori foto lama di browser
        sessionStorage.removeItem("fotoLama");
        
        // Memaksa preview foto kembali memunculkan ikon kamera default
        let iconDefault = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
        $("#previewFoto").attr("src", iconDefault).show();
        
        $("#errFoto").text("").hide();
        $(".foto-input-box").removeClass("error");
    });

});