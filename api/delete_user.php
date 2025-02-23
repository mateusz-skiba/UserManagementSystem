<?php
require_once "config.php";

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_GET["id"])) {
    $id = intval($_GET["id"]);

    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(["success" => true, "message" => "User deleted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
}
?>