<?php
    
    session_start();

    if (!isset($_SESSION['username'])) {
        // Redirect if the user is not logged in
        echo json_encode(['type' => "error"]);
        exit;
    }
    else {
        echo json_encode(['type' => "success"]);
    }
?>
