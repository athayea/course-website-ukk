<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

$nama    = trim($_POST['nama']    ?? '');
$email   = trim($_POST['email']   ?? '');
$phone   = trim($_POST['phone']   ?? '');
$program = trim($_POST['program'] ?? '');
$alamat  = trim($_POST['alamat']  ?? '');

$errors = [];

if (empty($nama))                                              $errors[] = 'Nama tidak boleh kosong';
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Email tidak valid';
if (empty($phone) || !preg_match('/^\d{1,13}$/', $phone))     $errors[] = 'No HP hanya boleh berisi angka (maksimal 13 digit)';
if (empty($alamat) || strlen($alamat) < 10)                    $errors[] = 'Alamat minimal 10 karakter';
if (empty($program) || $program === 'Pilih program')           $errors[] = 'Program wajib dipilih';

if (!empty($errors)) {
    echo json_encode(['status' => 'error', 'message' => implode(', ', $errors)]);
    exit;
}

// Cek duplikasi email
$check = $conn->prepare("SELECT id FROM peserta WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();
if ($check->num_rows > 0) {
    echo json_encode(['status' => 'error', 'message' => 'Email sudah terdaftar']);
    exit;
}
$check->close();

// Insert data
$stmt = $conn->prepare("INSERT INTO peserta (nama, email, phone, program, alamat) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $nama, $email, $phone, $program, $alamat);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Pendaftaran berhasil! Data akan diproses oleh tim kami.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Terjadi kesalahan saat menyimpan data: ' . $conn->error]);
}

$stmt->close();
$conn->close();
