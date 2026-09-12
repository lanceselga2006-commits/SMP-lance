// Get elements from the HTML
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const clearButton = document.getElementById("clearButton");
const studentTable = document.getElementById("studentTable");
const resultMessage = document.getElementById("resultMessage");


// Search and filter students
function searchStudents() {

    const searchText = searchInput.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value;

    const rows = studentTable.getElementsByTagName("tr");

    let count = 0;

    // Show or hide clear button
    if (searchText !== "") {
        clearButton.style.display = "block";
    } else {
        clearButton.style.display = "none";
    }

    // Check every student
    for (let i = 0; i < rows.length; i++) {

        const row = rows[i];

        // Get all text from the student row
        const studentText = row.textContent.toLowerCase();

        // Get status from the last column
        const statusCell = row.cells[row.cells.length - 1];

        let studentStatus = "";

        if (statusCell) {
            studentStatus = statusCell.textContent.trim();
        }

        // Check search
        const searchMatch = studentText.includes(searchText);

        // Check status
        const statusMatch =
            selectedStatus === "All" ||
            studentStatus === selectedStatus;

        // Show student if both conditions match
        if (searchMatch && statusMatch) {

            row.style.display = "";
            count++;

        } else {

            row.style.display = "none";

        }
    }

    // Update result message
    if (searchText === "" && selectedStatus === "All") {

        resultMessage.textContent =
            "Showing " + count + " students";

    } else if (count === 0) {

        resultMessage.textContent =
            "No students found.";

    } else {

        resultMessage.textContent =
            "Showing " + count + " student" +
            (count === 1 ? "" : "s");

    }
}


// Clear search
function clearSearch() {

    searchInput.value = "";

    statusFilter.value = "All";

    clearButton.style.display = "none";

    searchStudents();

    searchInput.focus();
}


// Add student button
function addStudent() {

    alert(
        "Add Student feature coming soon!"
    );

}


// Run search when typing
searchInput.addEventListener(
    "input",
    searchStudents
);


// Run filter when changed
statusFilter.addEventListener(
    "change",
    searchStudents
);


// Run when page loads
window.addEventListener(
    "load",
    searchStudents
);
