-- ============================================================
--  Prodjost Academy — Database Schema (MySQL / cPanel)
--  Import file ini melalui phpMyAdmin di cPanel Anda
-- ============================================================

CREATE TABLE IF NOT EXISTS `peserta` (
  `id`         INT(11)      NOT NULL AUTO_INCREMENT,
  `nama`       VARCHAR(100) NOT NULL,
  `email`      VARCHAR(100) NOT NULL,
  `phone`      VARCHAR(15)  NOT NULL,
  `program`    VARCHAR(100) NOT NULL,
  `alamat`     TEXT         NOT NULL,
  `tgl_daftar` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
