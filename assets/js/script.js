const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
let menuOpen = false;
hamburger.addEventListener("click", () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle("open", menuOpen);
  document.getElementById("h1").style.transform = menuOpen ? "rotate(45deg) translate(4px, 4px)" : "";
  document.getElementById("h2").style.opacity = menuOpen ? "0" : "1";
  document.getElementById("h3").style.transform = menuOpen ? "rotate(-45deg) translate(3px, -3px)" : "";
  document.getElementById("h3").style.width = menuOpen ? "24px" : "";
});
mobileMenu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    menuOpen = false;
    mobileMenu.classList.remove("open");
  }),
);

// ── Scroll reveal ──
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.05 },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ── Form Pendaftaran ──
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const btn = document.getElementById("submitBtn");
    const alertBox = document.getElementById("alertBox");

    const nama = document.querySelector('input[name="nama"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const phone = document.querySelector('input[name="phone"]').value.trim();
    const alamat = document.querySelector('textarea[name="alamat"]').value.trim();
    const program = document.querySelector('select[name="program"]').value;

    const showAlert = (msg, type) => {
      alertBox.classList.remove("hidden");
      alertBox.className = type === "error" ? "mb-6 p-4 rounded-xl text-sm font-medium bg-red-100 text-red-800 border border-red-200" : "mb-6 p-4 rounded-xl text-sm font-medium bg-green-100 text-green-800 border border-green-200";
      alertBox.textContent = msg;
    };

    if (!nama) return showAlert("Nama tidak boleh kosong!", "error");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showAlert("Email tidak valid! Format: nama@domain.com", "error");
    if (!/^\d{1,13}$/.test(phone)) return showAlert("No HP hanya boleh berisi angka (maksimal 13 digit)!", "error");
    if (alamat.length < 10) return showAlert("Alamat minimal 10 karakter!", "error");
    if (!program || program === "Pilih program") return showAlert("Program wajib dipilih!", "error");

    btn.disabled = true;
    btn.textContent = "Mendaftar...";

    try {
      const response = await fetch("backend/proses_daftar.php", {
        method: "POST",
        body: new FormData(registerForm),
      });
      const data = await response.json();

      if (data.status === "success") {
        showAlert(data.message + " Mengalihkan ke halaman data peserta...", "success");
        registerForm.reset();
        setTimeout(() => {
          window.location.href = "data-peserta.html";
        }, 2000);
      } else {
        showAlert(data.message, "error");
      }
    } catch (error) {
      showAlert("Terjadi kesalahan koneksi. Silakan coba lagi.", "error");
    }

    btn.disabled = false;
    btn.textContent = "Daftar";
  });
}

// Load data peserta
async function loadData() {
  try {
    const response = await fetch("backend/data_peserta.php");
    const result = await response.json();

    if (result.status === "success") {
      displayData(result.data);
      document.getElementById("totalPeserta").textContent = result.total;
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("pesertaTable").innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-red-500">Gagal memuat data</td></tr>';
  }
}

function displayData(data) {
  const tableBody = document.getElementById("pesertaTable");

  if (data.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-violet-500">Belum ada data peserta</td></tr>';
    return;
  }

  tableBody.innerHTML = data
    .map(
      (row, index) => `
          <tr class="border-b border-violet-100 hover:bg-violet-50 transition">
            <td class="px-4 py-3 text-sm text-violet-700">${index + 1}</td>
            <td class="px-4 py-3 text-sm text-violet-700 font-medium">${row.nama}</td>
            <td class="px-4 py-3 text-sm text-violet-700">${row.email}</td>
            <td class="px-4 py-3 text-sm text-violet-700">${row.phone}</td>
            <td class="px-4 py-3 text-sm text-violet-700">${row.program}</td>
            <td class="px-4 py-3 text-sm">
              <div class="flex gap-2">
                <button onclick="editPeserta(${row.id})" class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs">Edit</button>
                <button onclick="deletePeserta(${row.id})" class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs">Hapus</button>
              </div>
            </td>
          </tr>
        `,
    )
    .join("");
}

async function editPeserta(id) {
  try {
    const response = await fetch(`backend/edit_peserta.php?id=${id}`);
    const result = await response.json();

    if (result.status === "success") {
      const data = result.data;
      document.getElementById("editId").value = data.id;
      document.getElementById("editNama").value = data.nama;
      document.getElementById("editEmail").value = data.email;
      document.getElementById("editPhone").value = data.phone;
      document.getElementById("editProgram").value = data.program;
      document.getElementById("editAlamat").value = data.alamat;

      document.getElementById("editModal").classList.remove("hidden");
    }
  } catch (error) {
    alert("Gagal memuat data peserta");
    console.error("Error:", error);
  }
}

function closeModal() {
  document.getElementById("editModal").classList.add("hidden");
}

document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(document.getElementById("editForm"));

  try {
    const response = await fetch("backend/update_peserta.php", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.status === "success") {
      alert(result.message);
      closeModal();
      loadData();
    } else {
      alert("Error: " + result.message);
    }
  } catch (error) {
    alert("Gagal memperbarui data");
    console.error("Error:", error);
  }
});

async function deletePeserta(id) {
  if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

  try {
    const formData = new FormData();
    formData.append("id", id);

    const response = await fetch("backend/delete_peserta.php", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.status === "success") {
      alert(result.message);
      loadData();
    } else {
      alert("Error: " + result.message);
    }
  } catch (error) {
    alert("Gagal menghapus data");
    console.error("Error:", error);
  }
}

// Load data saat halaman dibuka
document.addEventListener("DOMContentLoaded", loadData);
