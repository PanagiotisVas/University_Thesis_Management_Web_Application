<?php

    session_start();

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");

    $servername = "localhost:3306/MySQL/Thesis_Application_Project";
    $dbusername = "root";
    $dbpassword = "root";
    $database = "thesis";

    $conn = new mysqli($servername, $dbusername, $dbpassword, $database);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $thesis_id=$_POST['thesis'];

   // Prepare and execute the first statement
    $sql = "SELECT `name`, `surname` FROM user INNER JOIN thesis ON user.email = thesis.student WHERE thesis.id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $thesis_id);
    $stmt->execute();
    $result1 = $stmt->get_result();
    $user = $result1->fetch_assoc();

    // Prepare and execute the second statement
    $sql2 = "SELECT `subject`, `confirmation_gen_assembly` FROM thesis WHERE id = ?";
    $stmt2 = $conn->prepare($sql2);
    $stmt2->bind_param("i", $thesis_id);
    $stmt2->execute();
    $result2 = $stmt2->get_result();
    $thesis = $result2->fetch_assoc();

    // Prepare and execute the third statement
    $sql3 = "SELECT `name`, `surname` FROM user WHERE email = (SELECT supervisor FROM thesis WHERE id = ?)";
    $stmt3 = $conn->prepare($sql3);
    $stmt3->bind_param("i", $thesis_id);
    $stmt3->execute();
    $result3 = $stmt3->get_result();
    $supervisor = $result3->fetch_assoc();

    // Prepare and execute the fourth statement
    $sql4 = "SELECT `name`, `surname` FROM user WHERE email = (SELECT member2 FROM thesis_examination WHERE thesis = ?)";
    $stmt4 = $conn->prepare($sql4);
    $stmt4->bind_param("i", $thesis_id);
    $stmt4->execute();
    $result4 = $stmt4->get_result();
    $member2 = $result4->fetch_assoc();

    // Prepare and execute the fifth statement
    $sql5 = "SELECT `name`, `surname` FROM user WHERE email = (SELECT member3 FROM thesis_examination WHERE thesis = ?)";
    $stmt5 = $conn->prepare($sql5);
    $stmt5->bind_param("i", $thesis_id);
    $stmt5->execute();
    $result5 = $stmt5->get_result();
    $member3 = $result5->fetch_assoc();

    $sql6 = " SELECT student_number FROM student INNER JOIN  thesis on student.email = thesis.student WHERE thesis.id = ?";
    $stmt6 = $conn->prepare($sql6);
    $stmt6->bind_param("i", $thesis_id);
    $stmt6->execute();
    $result6 = $stmt6->get_result();
    $student_number = $result6->fetch_assoc();

    $sql7 = "SELECT supervisor_quality_grade , supervisor_time_grade , supervisor_text_grade , supervisor_presentation_grade FROM thesis_grade WHERE thesis = ?";
    $stmt7 = $conn->prepare($sql7);
    $stmt7->bind_param("i", $thesis_id);
    $stmt7->execute();
    $result7 = $stmt7->get_result();
    $supervisor_grades = $result7->fetch_assoc();

    $sql8 = "SELECT member_2_quality_grade , member_2_time_grade , member_2_text_grade , member_2_presentation_grade FROM thesis_grade WHERE thesis = ?";
    $stmt8 = $conn->prepare($sql8);
    $stmt8->bind_param("i", $thesis_id);
    $stmt8->execute();
    $result8 = $stmt8->get_result();
    $member2_grades = $result8->fetch_assoc();

    $sql9 = "SELECT member_3_quality_grade , member_3_time_grade , member_3_text_grade , member_3_presentation_grade FROM thesis_grade WHERE thesis = ?";
    $stmt9 = $conn->prepare($sql9);
    $stmt9->bind_param("i", $thesis_id);
    $stmt9->execute();
    $result9 = $stmt9->get_result();
    $member3_grades = $result9->fetch_assoc();

    $sql10 = "SELECT exam_date FROM thesis_examination WHERE thesis = ?";
    $stmt10 = $conn->prepare($sql10);
    $stmt10->bind_param("i", $thesis_id);
    $stmt10->execute();
    $result10 = $stmt10->get_result();
    $examination_date = $result10->fetch_assoc();


    echo json_encode([
        'user' => $user,
        'thesis' => $thesis,
        'supervisor' => $supervisor,
        'member2' => $member2,
        'member3' => $member3,
        'student_number' => $student_number,
        'supervisor_grades' => $supervisor_grades,
        'member2_grades' => $member2_grades,
        'member3_grades' => $member3_grades,
        'examination_date' => $examination_date
    ]);
    
    $stmt->close();
    $stmt2->close();
    $stmt3->close();
    $stmt4->close();
    $stmt5->close();
    $stmt6->close();

    // Close the connection
    $conn->close();



?>