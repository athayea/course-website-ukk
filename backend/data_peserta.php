<?php
require_once 'config.php';

$query  = "SELECT id, nama, email, phone, program, alamat, tgl_daftar FROM peserta ORDER BY tgl_daftar DESC";
$result = $conn->query($query);

$data = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode([
    'status' => 'success',
    'data'   => $data,
    'total'  => count($data)
]);

$conn->close();
