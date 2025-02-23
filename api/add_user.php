<?php
require_once "config.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nazwa = $_POST["nazwa"] ?? "";
    $email = $_POST["email"] ?? "";
    $wiek = intval($_POST["wiek"] ?? 0);
    $login = $_POST["login"] ?? "";

    if (!empty($nazwa) && !empty($email) && !empty($wiek) && !empty($login)) {
        $stmt = $conn->prepare("INSERT INTO users (name, email, age, login) VALUES (?, ?, ?, ?)");
        $stmt->execute([$nazwa, $email, $wiek, $login]);

        echo json_encode(["success" => true, "message" => "User added successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Please fill in all fields"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
}
?>