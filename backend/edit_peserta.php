<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

$id = intval($_GET['id'] ?? 0);
if ($id === 0) {
    echo json_encode(['status' => 'error', 'message' => 'ID peserta tidak ditemukan']);
    exit;
}

$stmt = $conn->prepare("SELECT id, nama, email, phone, program, alamat FROM peserta WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['status' => 'success', 'data' => $result->fetch_assoc()]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Data peserta tidak ditemukan']);
}

$stmt->close();
$conn->close();
