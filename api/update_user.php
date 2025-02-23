<?php
require_once "config.php";

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_GET["id"])) {
    $id = intval($_GET["id"]);
    $nazwa = $_POST["nazwa"] ?? "";
    $email = $_POST["email"] ?? "";
    $wiek = intval($_POST["wiek"] ?? 0);
    $login = $_POST["login"] ?? "";

    $stmt = $conn->prepare("UPDATE users SET name = ?, email = ?, age = ?, login = ? WHERE id = ?");
    $stmt->execute([$nazwa, $email, $wiek, $login, $id]);

    echo json_encode(["success" => true, "message" => "User updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
}
?>