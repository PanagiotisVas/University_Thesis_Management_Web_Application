
document.addEventListener('DOMContentLoaded', function() {

    let username = localStorage.getItem("username");

    let formData = new FormData();
    formData.append("username", username);

    fetch("../PHP/Praktiko_Ejetasis.php", {
        method: "POST",
        body: formData,
    })

    .then((response) => response.json())
    .then((data) => {

        const fullName = `${data.user.name} ${data.user.surname}`;
        document.querySelectorAll(".Full-Name").forEach(element => {element.innerHTML = fullName;});

        // You can also access other data similarly
        const thesisTitle = data.thesis.subject;
        document.querySelectorAll(".Thesis-Title").forEach(element => {element.innerHTML = thesisTitle;});

        const Gen_Assembly = data.thesis.confirmation_gen_assembly;
        document.querySelector(".Gen_Assembly_Number").innerHTML = Gen_Assembly;

        const supervisorName = `${data.supervisor.name} ${data.supervisor.surname}`;
        document.querySelectorAll(".Supervisor-Name").forEach(element => {element.innerHTML = supervisorName;});

        const member2Name = `${data.member2.name} ${data.member2.surname}`;
        document.querySelectorAll(".Prof-1-Name").forEach(element => {element.innerHTML = member2Name;});

        const member3Name = `${data.member3.name} ${data.member3.surname}`;
        document.querySelectorAll(".Prof-2-Name").forEach(element => {element.innerHTML = member3Name;});

        const studentNumber = `${data.student_number.student_number}`;
        document.querySelectorAll(".AM").forEach(element => {element.innerHTML = studentNumber;});

       
        document.querySelector("#Sup_Quality").innerHTML = data.supervisor_grades.supervisor_quality_grade;
        document.querySelector("#Sup_Time").innerHTML = data.supervisor_grades.supervisor_time_grade;
        document.querySelector("#Sup_Text").innerHTML = data.supervisor_grades.supervisor_text_grade;
        document.querySelector("#Sup_Presentation").innerHTML = data.supervisor_grades.supervisor_presentation_grade;
        
        const supervisorGrade = 0.6*data.supervisor_grades.supervisor_quality_grade + 0.15*data.supervisor_grades.supervisor_time_grade + 0.15*data.supervisor_grades.supervisor_text_grade + 0.10*data.supervisor_grades.supervisor_presentation_grade;
        document.querySelector("#Sup_Grade").innerHTML = supervisorGrade;

        document.querySelector("#Member2_Quality").innerHTML = data.member2_grades.member_2_quality_grade;
        document.querySelector("#Member2_Time").innerHTML = data.member2_grades.member_2_time_grade;
        document.querySelector("#Member2_Text").innerHTML = data.member2_grades.member_2_text_grade;
        document.querySelector("#Member2_Presentation").innerHTML = data.member2_grades.member_2_presentation_grade;

        const member2Grade = 0.6*data.member2_grades.member_2_quality_grade + 0.15*data.member2_grades.member_2_time_grade + 0.15*data.member2_grades.member_2_text_grade + 0.10*data.member2_grades.member_2_presentation_grade;
        document.querySelector("#Member2_Grade").innerHTML = member2Grade;

        document.querySelector("#Member3_Quality").innerHTML = data.member3_grades.member_3_quality_grade;
        document.querySelector("#Member3_Time").innerHTML = data.member3_grades.member_3_time_grade;
        document.querySelector("#Member3_Text").innerHTML = data.member3_grades.member_3_text_grade;
        document.querySelector("#Member3_Presentation").innerHTML = data.member3_grades.member_3_presentation_grade;

        const member3Grade = 0.6*data.member3_grades.member_3_quality_grade + 0.15*data.member3_grades.member_3_time_grade + 0.15*data.member3_grades.member_3_text_grade + 0.10*data.member3_grades.member_3_presentation_grade;
        document.querySelector("#Member3_Grade").innerHTML = member3Grade;

        const finalGrade = (supervisorGrade + member2Grade + member3Grade)/3;
        document.querySelector("#Grade_Final").innerHTML = finalGrade;

        document.querySelector("#Date").innerHTML = data.examination_date.exam_date;
        document.querySelector("#Time").innerHTML = data.examination_date.exam_time;



    });
});
