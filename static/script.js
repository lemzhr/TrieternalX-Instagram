document.addEventListener("DOMContentLoaded", function () {
    let adFooter = document.createElement("div");
    adFooter.className = "ads-container";
    adFooter.innerHTML = `
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2811761116248604" crossorigin="anonymous"></script>
        <ins class="adsbygoogle"
             style="display:inline-block;width:728px;height:90px"
             data-ad-client="ca-pub-2811761116248604"
             data-ad-slot="9202542913"></ins>
        <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
    `;

    let footer = document.querySelector("footer");
    footer.insertAdjacentElement("beforebegin", adFooter);
});


function downloadContent() {
    let url = document.getElementById("url").value;
    if (!url) {
        alert("Silahkan Masukkan URL Instagram!");
        return;
    }

    fetch("/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("result").innerHTML = `
                <p>Download berhasil! Klik tombol di bawah:</p>
                <a href="${data.url}" target="_blank" class="btn-download">⬇ Download File</a>
            `;
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error("Error:", error));
}

document.addEventListener("DOMContentLoaded", function () {
    let adContainer = document.createElement("div");
    adContainer.className = "ads-container";
    adContainer.innerHTML = `
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2811761116248604" crossorigin="anonymous"></script>
        <ins class="adsbygoogle"
             style="display:inline-block;width:728px;height:90px"
             data-ad-client="ca-pub-2811761116248604"
             data-ad-slot="9202542913"></ins>
        <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
    `;

    let form = document.getElementById("downloadForm");
    form.parentNode.insertBefore(adContainer, form);
});


document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".category-buttons button");
    const result = document.getElementById("result");
    const pasteBtn = document.getElementById("paste-btn"); // Pastikan ada tombol ini di HTML
    const urlInput = document.getElementById("url");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            buttons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            const category = this.textContent.trim();
            result.innerHTML = `<h2>${category} Content</h2><p>Here is the content for ${category}.</p>`;
        });
    });

    // Event untuk tombol Paste
    if (pasteBtn) {
        pasteBtn.addEventListener("click", async function () {
            try {
                const text = await navigator.clipboard.readText();
                urlInput.value = text;
            } catch (err) {
                console.error("Gagal menempelkan teks: ", err);
                alert("Gagal menempelkan teks! Izinkan akses clipboard di browser.");
            }
        });
    }

    const notification = document.createElement("div");
    notification.classList.add("custom-notification");
    notification.innerHTML = `
        <strong>📢 Website ini di Jual</strong>
        <p>Dibuat oleh: <b>Ariel Aprielyullah</b></p>
        <p>Tanggal: <b>10 Maret 2025</b></p>
        <button id="contact-btn">Hubungi</button>
        <button id="close-notif">Tutup</button>
    `;
    document.body.appendChild(notification);

    document.getElementById("close-notif").addEventListener("click", function () {
        notification.classList.add("hide");
        setTimeout(() => notification.remove(), 300);
    });

    document.getElementById("contact-btn").addEventListener("click", function () {
        window.location.href = "https://ariel-aprielyullah.vercel.app/";
    });

    // Menampilkan notifikasi dengan animasi
    setTimeout(() => {
        notification.classList.add("show");
    }, 500);
});

document.getElementById("downloadForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let urlInput = document.getElementById("instagramUrl").value.trim();
    if (urlInput === "") {
        alert("Masukkan URL Instagram terlebih dahulu!");
        return;
    }

    fetch("/download", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: urlInput })
    })
    .then(response => response.json())
    .then(data => {
        let resultDiv = document.getElementById("result");
        if (data.success) {
            resultDiv.innerHTML = `
                <p>Download berhasil ! Klik tombol di Download bawah</p>
                <a href="${data.url}" target="_blank" class="btn-download">Download</a>
            `;
        } else {
            resultDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Terjadi kesalahan saat menghubungkan ke server.");
    });
});
