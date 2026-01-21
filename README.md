# University Thesis Management System

> A comprehensive full-stack Web Application for managing the entire lifecycle of university theses, from assignment to final grading.

![Status](https://img.shields.io/badge/Status-Completed-success)
![University](https://img.shields.io/badge/Context-University%20Project-blue)
![Tech](https://img.shields.io/badge/Tech-PHP%20%7C%20JS%20%7C%20MySQL%20%7C%20CSS%20%7C%20HTML-orange)

## About The Project
This web application was developed to digitize and streamline the thesis management process for university departments. It serves as a central hub where all stakeholders - Students, Professors, and Secretaries can collaborate efficiently.

The system replaces manual paperwork with a digital workflow, allowing users to:
* **Assign & Manage:** Professors can create and assign topics, accept student applications, and grade theses
* **Track Progress:** Students can upload drafts and receive feedback, schedule the thesis exam
* **Administration:** Secretaries have full oversight of pending, active, and rejected theses and officially finalize them.

## Tech Stack
* **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
* **Backend:** PHP (Native)
* **Database:** MySQL

## Key Features

### For Students
* **Browse & Apply:** View available professors and submit applications to them to become members of their thesis.
* **Progress Tracking:** Upload drafts, links, and notes for professor review.
* **Exam Status:** View scheduled presentation dates and check final grades.

### For Professors
* **Thesis Creation:** Create new thesis topics and assign them to students.
* **Student Management:** Accept or reject applicants and manage supervised students.
* **Grading System:** Input final grades and view statistics/averages automatically calculated by the system.

### For Secretaries
* **User Management:** Manually register new professors and students into the system.
* **Oversight:** Oversee theses, cancel assignments, or handle special requests.
* **Announcements:** Post department-wide announcements visible to all users.

## Project Structure
The codebase is structured to separate logic (PHP), webpages (HTML), styling (CSS), and interactivity (JS):

```text
├── css/                          # Styling for specific user roles (foititis.css, kathigitis.css, etc.)
├── html/                         # User Interface and views (Login forms, Dashboard layouts)
    ├── Files                     # Storage for uploaded files and regulations
    └── Images                    # Storage for uploaded images/logos
├── js/                           # Frontend logic (AJAX calls, form validation, charts)
├── php/                          # Backend logic (Authentication, Database connection, CRUD operations)
│   ├── login_check.php           # Middleware to check user login status
│   └── ... (API endpoints)
```

## UI Examples
* Home Page

![Home Page](screenshots/professor_theses_page.png)

* Administration Dashboard

![Administration Dashboard](screenshots/thesis_assignment.png)

* Professor Dashboard

![Professor Dashboard](screenshots/thesis_assignment.png)

* Student Dashboard

![Student Dashboard](screenshots/thesis_assignment.png)

* Database Schema

![DB Schema](screenshots/db_schema.png)


## How to Run Locally

Since this project uses Native PHP and MySQL, you will need a local server environment (like **XAMPP** or **WAMP**) to run it.

1.  **Clone the repository:**
   ```bash
   git clone [https://github.com/PanagiotisVas/University_Thesis_Management_Web_Application.git](https://github.com/PanagiotisVas/University_Thesis_Management_Web_Application.git)
   ```
  
2.  **Move the folder:**
    * Copy the project folder.
    * Paste it inside your local server's root directory:
        * **XAMPP:** `C:\xampp\htdocs\`
        * **WAMP:** `C:\wamp64\www\`

3.  **Setup the Database:**
    * Open phpMyAdmin (usually `http://localhost/phpmyadmin`).
    * Create a new database named `project_web` (⚠️ Check any `.php` file to confirm the exact name expected).
    * Import the `database.sql` file provided in this repo to create the necessary tables.

4.  **Configure Connection:**
    * Ensure the `$username` (usually `root`) and `$password` (usually empty for XAMPP) match your local server setup.
   
   **In this Project:** The database connection settings are defined individually in each PHP file. You will need to update them globally to match your environment.

   **How to update the password for all files at once:**

   1.  Open the project folder in a code editor (like **VS Code**, **Sublime Text**, or **Notepad++**).
   2.  Press the shortcut for **"Find and Replace in Files"**:
       * *VS Code / Sublime:* `Ctrl` + `Shift` + `F`
       * *Notepad++:* `Ctrl` + `Shift` + `F`
   3.  **Find:** `$dbpassword = "root";`
   4.  **Replace with:**
       * For default XAMPP: `$dbpassword = "";`
       * For custom setups: `$dbpassword = "your_password";`
   5.  Click **Replace All**.

   ⚠️ **Warning:** Ensure you replace the specific string `$dbpassword = "root";` to avoid accidentally changing other parts of the code.

5.  **Run the App:**
    * Start Apache and MySQL in XAMPP/WAMP.
    * Open your browser and visit: `http://localhost/Project-Web/`
    * Log in to all the different dashboards with the credentials you will find in the `LoginCredentials.txt` file in this repo.

## Contributors

This project was designed and built as a group assignment for the **Computer Engineering and Informatics Department** of the **University of Patras** .

* **Vasilopoulos Panagiotis** - *[ Back-End for Secretary & Main Page Logic - Front-End of the Application (Except for the Student Dashboard)]*
* **Psaltiras Panagiotis** - *[ Back-End for Professor Logic - MySQL Database]* - [GitHub Profile](https://github.com/Pan4g10tis)
* **Zannis Georgios** - *[Back-End for Student Logic - Front-End for Student Dashboard - Server Configuration]* - [GitHub Profile](https://github.com/GeoZann)

---
Note: This project is for educational purposes and demonstrates full-stack CRUD capabilities without the use of high-level frameworks.
