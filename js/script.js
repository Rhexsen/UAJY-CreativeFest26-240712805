var EVENT_DATES = {
    submissionDeadline: "2026-10-10T23:59:59+07:00"
};

/* BAGIAN 1: DOM MANIPULATION (vanilla JS) */

// Toggle menu navigasi mobile dengan memanipulasi class pada elemen DOM
function initMobileNav() {
    var navToggle = document.getElementById("nav-toggle");
    var mainNav = document.querySelector("nav.main-nav");

    if (navToggle && mainNav) {
        navToggle.addEventListener("click", function () {
            mainNav.classList.toggle("open");
        });
    }
}

// Menandai link navigasi yang aktif berdasarkan halaman saat ini
function highlightActiveNav() {
    var currentPage = window.location.pathname.split("/").pop() || "index.xhtml";
    var navLinks = document.querySelectorAll("nav.main-nav a");

    navLinks.forEach(function (link) {
        var linkPage = link.getAttribute("href");
        if (linkPage === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

// Menjalankan hitung mundur
function initCountdown() {
    var countdownBoxes = document.querySelectorAll(".countdown[data-deadline]");
    if (countdownBoxes.length === 0) {
        return;
    }

    function padNumber(number) {
        return number < 10 ? "0" + number : String(number);
    }

    countdownBoxes.forEach(function (countdownBox) {
        var deadline = new Date(countdownBox.getAttribute("data-deadline"));
        var daysEl = countdownBox.querySelector(".cd-days");
        var hoursEl = countdownBox.querySelector(".cd-hours");
        var minutesEl = countdownBox.querySelector(".cd-minutes");
        var secondsEl = countdownBox.querySelector(".cd-seconds");
        var labelEl = countdownBox.querySelector(".countdown-label");
        
        function setText(element, text) {
            if (element) {
                element.textContent = text;
            }
        }

        function tick() {
            var now = new Date();
            var diffMs = deadline.getTime() - now.getTime();

            if (diffMs <= 0) {
                setText(daysEl, "00");
                setText(hoursEl, "00");
                setText(minutesEl, "00");
                setText(secondsEl, "00");
                countdownBox.classList.add("is-over");
                if (labelEl) {
                    labelEl.textContent = "Pendaftaran Karya Telah Ditutup";
                }
                clearInterval(intervalId);
                return;
            }

            var totalSeconds = Math.floor(diffMs / 1000);
            var days = Math.floor(totalSeconds / 86400);
            var hours = Math.floor((totalSeconds % 86400) / 3600);
            var minutes = Math.floor((totalSeconds % 3600) / 60);
            var seconds = totalSeconds % 60;

            setText(daysEl, padNumber(days));
            setText(hoursEl, padNumber(hours));
            setText(minutesEl, padNumber(minutes));
            setText(secondsEl, padNumber(seconds));
        }

        var intervalId = setInterval(tick, 1000);
        tick();
    });
}

// Menghitung status tiap baris jadwal (Akan Datang / Hari Ini / Berlangsung / Selesai)
// berdasarkan atribut data-datetime (dan data-datetime-end untuk kegiatan yang punya rentang
// waktu berlangsung, contoh: pembukaan pendaftaran yang tetap terbuka sampai batas akhir),
// supaya status selalu sinkron dengan tanggal asli hari ini.
function updateScheduleStatus() {
    var rows = document.querySelectorAll("tr[data-datetime]");
    if (rows.length === 0) {
        return;
    }

    var now = new Date();

    rows.forEach(function (row) {
        var eventDate = new Date(row.getAttribute("data-datetime"));
        var endDateAttr = row.getAttribute("data-datetime-end");
        var endDate = endDateAttr ? new Date(endDateAttr) : null;
        var badge = row.querySelector(".badge-cell span");
        if (!badge) {
            return;
        }

        var diffDays = Math.ceil((eventDate.getTime() - now.getTime()) / 86400000);
        badge.classList.remove("status-today", "status-ongoing", "status-done");

        if (diffDays > 0) {
            // Belum mulai 
        } else if (endDate && now.getTime() < endDate.getTime()) {
            // Sudah mulai tapi belum sampai batas akhir 
            badge.textContent = "Berlangsung";
            badge.classList.add("status-ongoing");
        } else if (diffDays === 0) {
            badge.textContent = "Hari Ini";
            badge.classList.add("status-today");
        } else {
            badge.textContent = "Selesai";
            badge.classList.add("status-done");
        }
    });
}

// Menampilkan/menyembunyikan tombol "kembali ke atas" serta menangani klik-nya
function initBackToTop() {
    var backToTopBtn = document.getElementById("backToTop");
    if (!backToTopBtn) {
        return;
    }

    window.addEventListener("scroll", function () {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    });

    backToTopBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// Menambahkan animasi "muncul saat discroll" 
function initScrollReveal() {
    var revealElements = document.querySelectorAll(".reveal");
    if (revealElements.length === 0) {
        return;
    }

    if (!("IntersectionObserver" in window)) {
        revealElements.forEach(function (el) {
            el.classList.add("is-visible");
        });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(function (el) {
        observer.observe(el);
    });
}

/* BAGIAN 2: CLIENT-SIDE VALIDATION */

// Menampilkan pesan error pada sebuah field group
function showFieldError(fieldGroupId) {
    var fieldGroup = document.getElementById(fieldGroupId);
    if (fieldGroup) {
        fieldGroup.classList.add("has-error");
    }
}

// Menyembunyikan pesan error pada sebuah field group
function clearFieldError(fieldGroupId) {
    var fieldGroup = document.getElementById(fieldGroupId);
    if (fieldGroup) {
        fieldGroup.classList.remove("has-error");
    }
}

// Validasi keseluruhan form pendaftaran, mengembalikan true jika valid
function validateRegistrationForm() {
    var isValid = true;

    var fullname = document.getElementById("fullname").value.trim();
    var npm = document.getElementById("npm").value.trim();
    var email = document.getElementById("email").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var category = document.getElementById("category").value;
    var motivation = document.getElementById("motivation").value.trim();
    var terms = document.getElementById("terms").checked;

    var npmPattern = /^[0-9]+$/;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var phonePattern = /^[0-9]{10,14}$/;

    // Nama lengkap wajib diisi
    if (fullname.length === 0) {
        showFieldError("group-fullname");
        isValid = false;
    } else {
        clearFieldError("group-fullname");
    }

    // NPM wajib diisi dan hanya boleh angka
    if (npm.length === 0 || !npmPattern.test(npm)) {
        showFieldError("group-npm");
        isValid = false;
    } else {
        clearFieldError("group-npm");
    }

    // Email format valid
    if (!emailPattern.test(email)) {
        showFieldError("group-email");
        isValid = false;
    } else {
        clearFieldError("group-email");
    }

    // Nomor HP hanya angka dan 10-14 digit
    if (!phonePattern.test(phone)) {
        showFieldError("group-phone");
        isValid = false;
    } else {
        clearFieldError("group-phone");
    }

    // Kategori wajib dipilih
    if (category === "") {
        showFieldError("group-category");
        isValid = false;
    } else {
        clearFieldError("group-category");
    }

    // Asal universitas wajib diisi
    if (motivation.length === 0) {
        showFieldError("group-motivation");
        isValid = false;
    } else {
        clearFieldError("group-motivation");
    }

    // Persetujuan syarat & ketentuan wajib dicentang
    if (!terms) {
        showFieldError("group-terms");
        isValid = false;
    } else {
        clearFieldError("group-terms");
    }

    return isValid;
}

/* BAGIAN 3: jQuery — AJAX submission, animasi, dan fetch data peserta */

$(document).ready(function () {

    // Ambil jumlah peserta terdaftar dari php/participants.php lalu tampilkan (DOM update via jQuery)
    function loadParticipantCount() {
        $.getJSON("php/participants.php?action=count", function (response) {
            $("#liveCounter").text(response.total);
            $("#liveCounterInline").text(response.total);
        }).fail(function () {
            $("#liveCounter").text("0");
            $("#liveCounterInline").text("0");
        });
    }

    loadParticipantCount();

    // Submit form pendaftaran menggunakan AJAX jQuery ke process_registration.php
    $("#registrationForm").on("submit", function (event) {
        event.preventDefault();

        // Jalankan validasi client-side terlebih dahulu
        var formIsValid = validateRegistrationForm();
        if (!formIsValid) {
            $("#formFeedback")
                .removeClass("success")
                .addClass("error")
                .text("Beberapa data belum diisi dengan benar. Silakan periksa kembali formulir.")
                .hide()
                .fadeIn(300);
            return;
        }

        var $submitBtn = $("#submitBtn");
        var originalBtnText = $submitBtn.text();
        $submitBtn.prop("disabled", true).text("Mengirim...");

        $.ajax({
            url: "php/process_registration.php",
            method: "POST",
            data: $("#registrationForm").serialize(),
            dataType: "json"
        })
            .done(function (response) {
                if (response.status === "success") {
                    $("#formFeedback")
                        .removeClass("error")
                        .addClass("success")
                        .text(response.message)
                        .hide()
                        .fadeIn(300);

                    // Reset form via DOM manipulation setelah berhasil
                    document.getElementById("registrationForm").reset();

                    // Perbarui jumlah peserta secara real-time
                    loadParticipantCount();
                } else {
                    $("#formFeedback")
                        .removeClass("success")
                        .addClass("error")
                        .text(response.message)
                        .hide()
                        .fadeIn(300);
                }
            })
            .fail(function () {
                $("#formFeedback")
                    .removeClass("success")
                    .addClass("error")
                    .text("Terjadi kesalahan pada server. Silakan coba lagi beberapa saat lagi.")
                    .hide()
                    .fadeIn(300);
            })
            .always(function () {
                $submitBtn.prop("disabled", false).text(originalBtnText);
                $("html, body").animate({ scrollTop: $("#formFeedback").offset().top - 100 }, 400);
            });
    });

    // Efek hover pada card kategori menggunakan jQuery
    $(".category-card").hover(
        function () {
            $(this).find("h3").css("color", "#ff5a5f");
        },
        function () {
            $(this).find("h3").css("color", "");
        }
    );

    $(".faq-question").on("click", function () {
        var $currentItem = $(this).closest(".faq-item");
        var isCurrentlyOpen = $currentItem.hasClass("open");

        $(".faq-item").not($currentItem).removeClass("open").find(".faq-answer").slideUp(200);

        if (isCurrentlyOpen) {
            $currentItem.removeClass("open");
            $currentItem.find(".faq-answer").slideUp(200);
        } else {
            $currentItem.addClass("open");
            $currentItem.find(".faq-answer").slideDown(200);
        }
    });

    // Filter baris jadwal secara real-time berdasarkan kata kunci (jQuery)
    var $scheduleSearch = $("#scheduleSearch");
    if ($scheduleSearch.length > 0) {
        $scheduleSearch.on("keyup", function () {
            var keyword = $(this).val().toLowerCase().trim();
            var $rows = $(".schedule-table tbody tr[data-datetime]");
            var visibleCount = 0;

            $rows.each(function () {
                var rowText = $(this).text().toLowerCase();
                var isMatch = rowText.indexOf(keyword) !== -1;
                $(this).toggle(isMatch);
                if (isMatch) {
                    visibleCount++;
                }
            });

            $("#scheduleNoResult").toggle(visibleCount === 0);
        });
    }
});

/* Inisialisasi saat dokumen dimuat */

document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    highlightActiveNav();
    initCountdown();
    updateScheduleStatus();
    initBackToTop();
    initScrollReveal();
});
