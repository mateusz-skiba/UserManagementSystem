<?php
require_once "config.php";

try {
    $stmt = $conn->query("SELECT * FROM users ORDER BY id ASC");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($users);
} catch (PDOException $e) {
    echo json_encode(["error" => "Database connection error"]);
}
?>