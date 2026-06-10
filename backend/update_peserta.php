<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

$id      = intval($_POST['id']      ?? 0);
$nama    = trim($_POST['nama']      ?? '');
$email   = trim($_POST['email']     ?? '');
$phone   = trim($_POST['phone']     ?? '');
$program = trim($_POST['program']   ?? '');
$alamat  = trim($_POST['alamat']    ?? '');

$errors = [];

if ($id === 0)                                                 $errors[] = 'ID peserta tidak valid';
if (empty($nama))                                              $errors[] = 'Nama tidak boleh kosong';
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Email tidak valid';
if (empty($phone) || !preg_match('/^\d{1,13}$/', $phone))     $errors[] = 'No HP hanya boleh berisi angka (maksimal 13 digit)';
if (empty($alamat) || strlen($alamat) < 10)                    $errors[] = 'Alamat minimal 10 karakter';
if (empty($program) || $program === 'Pilih program')           $errors[] = 'Program wajib dipilih';

if (!empty($errors)) {
    echo json_encode(['status' => 'error', 'message' => implode(', ', $errors)]);
    exit;
}

$stmt = $conn->prepare("UPDATE peserta SET nama=?, email=?, phone=?, program=?, alamat=? WHERE id=?");
$stmt->bind_param("sssssi", $nama, $email, $phone, $program, $alamat, $id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Data berhasil diperbarui']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Terjadi kesalahan saat memperbarui data: ' . $conn->error]);
}

$stmt->close();
$conn->close();
