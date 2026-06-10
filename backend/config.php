<?php
// ============================================================
//  Prodjost Academy — Konfigurasi Database (MySQL)
//  Ganti nilai di bawah sesuai akun cPanel Anda
// ============================================================

$host     = 'localhost';       // Biasanya localhost di cPanel
$user     = 'db_username';     // Username database cPanel
$password = 'db_password';     // Password database cPanel
$database = 'db_name';         // Nama database cPanel

// Koneksi
$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    header('Content-Type: application/json; charset=utf-8');
    die(json_encode([
        'status'  => 'error',
        'message' => 'Koneksi database gagal: ' . $conn->connect_error
    ]));
}

$conn->set_charset('utf8mb4');

// Header response
header('Content-Type: application/json; charset=utf-8');
