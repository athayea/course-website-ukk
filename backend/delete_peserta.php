<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

$id = intval($_POST['id'] ?? 0);
if ($id === 0) {
    echo json_encode(['status' => 'error', 'message' => 'ID peserta tidak valid']);
    exit;
}

$stmt = $conn->prepare("DELETE FROM peserta WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Data berhasil dihapus']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Terjadi kesalahan saat menghapus data: ' . $conn->error]);
}

$stmt->close();
$conn->close();
