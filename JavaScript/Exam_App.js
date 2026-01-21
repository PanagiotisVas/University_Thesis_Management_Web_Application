function applyForExam() {
    let username = localStorage.getItem("username");
    let initialHTML = `
        <div class="container3">
            <h1>Apply for an Exam</h1>
            <form id="examForm">
                <label for="examDate">Select Exam Date:</label>
                <input type="date" id="examDate" name="examDate" required min=""><br><br>

                <label for="examTimeContainer">Select Exam Time:</label>
                <div id="examTimeContainer">
                    <select id="hour" required>
                        <option value="">Hour</option>
                        ${Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
                    </select>
                    <h3 style="color:black;">:</h3>
                    <select id="minute" required>
                        <option value="">Minute</option>
                        ${Array.from({ length: 4 }, (_, i) => {const val = String(i * 15).padStart(2, '0');return `<option value="${val}">${val}</option>`;}).join('')}

                    </select>
                    <select id="ampm" required>
                        <option value="AM">ΠM</option>
                        <option value="PM">ΑM</option>
                    </select>
                </div>
                <br>

                <label for="examType">Exam Type:</label>
                <select id="examType" name="examType" required>
                    <option value="">Select</option>
                    <option value="local">Local</option>
                    <option value="virtual">Virtual</option>
                </select><br><br>
            </form>
            <div id="additionalOptions"></div>
            <div id="applyButtonContainer">
                <button type="button" id="examSub" disabled style="background-color: lightgrey; cursor: not-allowed;">Apply</button>
            </div>
        </div>
    `;

    // Inject the initial HTML into the page
    document.querySelector(".main-screen").innerHTML = initialHTML;

    const examDate = document.getElementById('examDate');
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    examDate.min = today;
    const hour = document.getElementById('hour');
    const minute = document.getElementById('minute');
    const ampm = document.getElementById('ampm');
    const examTypeSelect = document.getElementById('examType');
    const additionalOptions = document.getElementById('additionalOptions');
    const applyButton = document.getElementById('examSub');

    const enableApplyButton = () => {
        const examType = examTypeSelect.value;
        const roomSelection = examType === 'local'
            ? document.getElementById('classroom')?.value
            : document.getElementById('meetingRoom')?.value;

        if (
            examDate.value &&
            hour.value &&
            minute.value &&
            ampm.value &&
            examType &&
            roomSelection
        ) {
            applyButton.disabled = false;
            applyButton.style.backgroundColor = '';
            applyButton.style.cursor = '';
        } else {
            applyButton.disabled = true;
            applyButton.style.backgroundColor = 'lightgrey';
            applyButton.style.cursor = 'not-allowed';
        }
    };

    // Add event listeners for changes to dynamically check all fields
    examDate.addEventListener('change', enableApplyButton);
    hour.addEventListener('change', enableApplyButton);
    minute.addEventListener('change', enableApplyButton);
    ampm.addEventListener('change', enableApplyButton);
    examTypeSelect.addEventListener('change', function () {
        additionalOptions.innerHTML = '';

       if (this.value === 'local') {
    additionalOptions.innerHTML = `
        <label for="department">Select Department:</label>
        <select id="department" name="department" required>
            <option value="">Select</option>
            <option value="ceid">CEID</option>
            <option value="mech">Mechanical Engineer Department</option>
            <option value="elec">Electrical Engineer Department</option>
        </select><br><br>

        <label for="classroom">Select Classroom:</label>
        <select id="classroom" name="classroom" required disabled>
            <option value="">Select department first</option>
        </select><br><br>
    `;

    const departmentDropdown = document.getElementById('department');
    const classroomDropdown = document.getElementById('classroom');

    // classroom options per department
    const classrooms = {
        ceid: ["CE101", "CE102", "CE201"],
        mech: ["M101", "M202", "M303"],
        elec: ["E101", "E202", "E303"]
    };

    departmentDropdown.addEventListener('change', function () {
        const selectedDept = this.value;

        // reset classrooms
        classroomDropdown.innerHTML = '<option value="">Select</option>';
        classroomDropdown.disabled = !selectedDept;

        if (selectedDept && classrooms[selectedDept]) {
            classrooms[selectedDept].forEach(room => {
                const option = document.createElement("option");
                option.value = room;
                option.textContent = room;
                classroomDropdown.appendChild(option);
            });
        }
        enableApplyButton();
    });

    classroomDropdown.addEventListener('change', enableApplyButton);

} else if (this.value === 'virtual') {
    additionalOptions.innerHTML = `
        <label for="meetingRoom">Select Meeting Room:</label>
        <input type="text" id="meetingRoom" name="meetingRoom" placeholder="Enter meeting link" required><br><br>`;
    
    const meetingRoomInput = document.getElementById('meetingRoom');
    meetingRoomInput.addEventListener('input', enableApplyButton);
}

    });

    applyButton.addEventListener('click', function () {
        const examDateValue = examDate.value;
        const hourValue = hour.value;
        const minuteValue = minute.value;
        const ampmValue = ampm.value;
        const examTypeValue = examTypeSelect.value;
        const roomSelectionValue = examTypeValue === 'local'
            ? document.getElementById('classroom')?.value
            : document.getElementById('meetingRoom')?.value;

        const formData = new FormData();
        formData.append('examDate', examDateValue);
        formData.append('examTime', `${hourValue}:${minuteValue} ${ampmValue}`);
        formData.append('examType', examTypeValue);
        formData.append('roomSelection', roomSelectionValue);
        formData.append('username', username);

        fetch("../PHP/Exam_App.php", {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data == true) {
                document.querySelector(".container3").innerHTML += `<h2 id="successmsg" style="color:green;">Application was Successful</h2>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting your application.');
        });
    });
}


document.querySelector("#Button4").addEventListener("click", applyForExam);

