/* =========================
   CURRENT DATE
========================= */

const dateElement = document.getElementById("currentDate");

const today = new Date();

const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
};

dateElement.textContent = today.toLocaleDateString(
    "en-US",
    dateOptions
);


/* =========================
   SIDEBAR
========================= */

function toggleSidebar() {

    const sidebar = document.querySelector(".sidebar");

    sidebar.classList.toggle("show");

}


/* =========================
   ADD STUDENT
========================= */

function addStudent() {

    const name = prompt("Enter the student's name:");

    if (name && name.trim() !== "") {

        alert(
            "Student '" +
            name +
            "' has been added successfully!"
        );

    }

}


/* =========================
   MESSAGE
========================= */

function showMessage(message) {

    alert(message);

}


/* =========================
   LOGOUT
========================= */

function logout() {

    const confirmLogout = confirm(
        "Are you sure you want to logout?"
    );

    if (confirmLogout) {

        alert("You have been logged out.");

    }

}


/* =========================
   NAVIGATION ACTIVE STATE
========================= */

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach(item => {

    item.addEventListener("click", function () {

        navItems.forEach(nav => {
            nav.classList.remove("active");
        });

        this.classList.add("active");

    });

});
