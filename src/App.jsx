import { useEffect, useMemo, useState } from "react";
import "./App.css";

const USERS_API = "https://jsonplaceholder.typicode.com/users";
const sections = ["STEM-A", "HUMSS-A", "ABM-A", "STEM-B", "ICT-A", "HUMSS-B", "ICT-B"];

const mapUserToStudent = (user) => ({
    id: `USR${String(user.id).padStart(3, "0")}`,
    name: user.name,
    age: 17 + (user.id % 3),
    gender: user.id % 2 === 0 ? "Female" : "Male",
    grade: user.id % 2 === 0 ? 11 : 12,
    section: sections[(user.id - 1) % sections.length],
    email: user.email.toLowerCase(),
    status: user.id % 5 === 0 ? "Inactive" : "Active",
});

function App() {
    const [studentList, setStudentList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [newStudent, setNewStudent] = useState({
        name: "",
        age: "",
        gender: "Female",
        grade: "11",
        section: "STEM-A",
        email: "",
        status: "Active",
    });

    useEffect(() => {
        const loadStudents = async () => {
            try {
                const response = await fetch(USERS_API);
                if (!response.ok) {
                    throw new Error("Unable to load students");
                }
                const users = await response.json();
                setStudentList(users.map(mapUserToStudent));
            } catch (error) {
                setLoadError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadStudents();
    }, []);

    const activeStudents = studentList.filter(
        (student) => student.status === "Active"
    ).length;

    const inactiveStudents = studentList.filter(
        (student) => student.status === "Inactive"
    ).length;

    const filteredStudents = useMemo(() => {
        const searchText = search.toLowerCase().trim();

        return studentList.filter((student) => {
            const matchesSearch =
                student.id.toLowerCase().includes(searchText) ||
                student.name.toLowerCase().includes(searchText) ||
                student.email.toLowerCase().includes(searchText) ||
                student.gender.toLowerCase().includes(searchText) ||
                student.section.toLowerCase().includes(searchText) ||
                student.status.toLowerCase().includes(searchText) ||
                String(student.grade).includes(searchText) ||
                String(student.age).includes(searchText);

            const matchesStatus =
                statusFilter === "All" ||
                student.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [search, statusFilter, studentList]);

    const clearSearch = () => {
        setSearch("");
        setStatusFilter("All");
    };

    const openAddStudent = () => {
        setNewStudent({
            name: "",
            age: "",
            gender: "Female",
            grade: "11",
            section: "STEM-A",
            email: "",
            status: "Active",
        });
        setIsAddModalOpen(true);
    };

    const updateNewStudent = (event) => {
        const { name, value } = event.target;
        setNewStudent((currentStudent) => ({
            ...currentStudent,
            [name]: value,
        }));
    };

    const openStudentDetails = (student) => {
        setSelectedStudent(student);
    };

    const saveStudent = (event) => {
        event.preventDefault();
        const nextId = `STU${String(studentList.length + 1).padStart(3, "0")}`;

        setStudentList((currentStudents) => [
            ...currentStudents,
            {
                ...newStudent,
                id: nextId,
                age: Number(newStudent.age),
                grade: Number(newStudent.grade),
            },
        ]);
        setIsAddModalOpen(false);
    };

    return (
        <div className="container">

            {/* HEADER */}
            <header>
                <div>
                    <h1>Student Management System</h1>
                    <p>Student Information Dashboard</p>
                </div>

                <button
                    className="add-btn"
                    onClick={openAddStudent}
                    disabled={isLoading}
                >
                    + Add Student
                </button>
            </header>

            {isLoading && <div className="data-message">Loading students from JSONPlaceholder...</div>}
            {loadError && <div className="data-message error">{loadError}. Please refresh and try again.</div>}

            {/* DASHBOARD */}
            <section className="dashboard">

                <div className="card">
                    <h3>Total Students</h3>
                    <p>{studentList.length}</p>
                </div>

                <div className="card">
                    <h3>Active Students</h3>
                    <p>{activeStudents}</p>
                </div>

                <div className="card">
                    <h3>Inactive Students</h3>
                    <p>{inactiveStudents}</p>
                </div>

            </section>


            {/* SEARCH AND FILTER */}
            <section className="controls">

                <div className="search-box">

                    <span className="search-icon">
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search student name, ID, email..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                    {search && (
                        <button
                            className="clear-btn"
                            onClick={clearSearch}
                            aria-label="Clear search"
                        >
                            ✕
                        </button>
                    )}

                </div>


                <select
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(event.target.value)
                    }
                >
                    <option value="All">
                        All Students
                    </option>

                    <option value="Active">
                        Active
                    </option>

                    <option value="Inactive">
                        Inactive
                    </option>
                </select>

            </section>


            {/* RESULT MESSAGE */}
            <div className="result-message">
                {filteredStudents.length === 0
                    ? "No students found."
                    : `Showing ${filteredStudents.length} student${
                          filteredStudents.length === 1
                              ? ""
                              : "s"
                      }`}
            </div>


            {/* TABLE */}
            <section className="table-container">

                <table>

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Grade</th>
                            <th>Section</th>
                            <th>Email</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        {filteredStudents.map((student) => (
                            <tr
                                key={student.id}
                                className="student-row"
                                tabIndex="0"
                                onClick={() => openStudentDetails(student)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        openStudentDetails(student);
                                    }
                                }}
                            >

                                <td>{student.id}</td>

                                <td>{student.name}</td>

                                <td>{student.age}</td>

                                <td>{student.gender}</td>

                                <td>{student.grade}</td>

                                <td>{student.section}</td>

                                <td>{student.email}</td>

                                <td>
                                    <span
                                        className={
                                            student.status === "Active"
                                                ? "active"
                                                : "inactive"
                                        }
                                    >
                                        {student.status}
                                    </span>
                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>


                {/* NO RESULTS */}
                {filteredStudents.length === 0 && (
                    <div className="no-results">
                        <p>
                            No students match your search.
                        </p>

                        <button
                            className="reset-btn"
                            onClick={clearSearch}
                        >
                            Clear Search
                        </button>
                    </div>
                )}

            </section>


            {/* FOOTER */}
            <footer>
                <p>
                    © 2026 Student Management System
                </p>
            </footer>

            {isAddModalOpen && (
                <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsAddModalOpen(false)}>
                    <form className="student-form" onSubmit={saveStudent}>
                        <div className="modal-heading">
                            <div><span className="form-eyebrow">Student directory</span><h2>Add a student</h2><p>Enter the student details below to add a new record.</p></div>
                            <button type="button" className="modal-close" onClick={() => setIsAddModalOpen(false)} aria-label="Close form">×</button>
                        </div>
                        <div className="form-grid">
                            <label>Full name<input name="name" value={newStudent.name} onChange={updateNewStudent} placeholder="e.g. Alex Morgan" required /></label>
                            <label>Email address<input type="email" name="email" value={newStudent.email} onChange={updateNewStudent} placeholder="alex@school.edu" required /></label>
                            <label>Age<input type="number" name="age" value={newStudent.age} onChange={updateNewStudent} min="10" max="25" placeholder="18" required /></label>
                            <label>Gender<select name="gender" value={newStudent.gender} onChange={updateNewStudent}><option>Female</option><option>Male</option><option>Other</option></select></label>
                            <label>Grade<select name="grade" value={newStudent.grade} onChange={updateNewStudent}><option value="11">Grade 11</option><option value="12">Grade 12</option></select></label>
                            <label>Section<input name="section" value={newStudent.section} onChange={updateNewStudent} placeholder="e.g. STEM-A" required /></label>
                        </div>
                        <div className="form-actions"><button type="button" className="cancel-btn" onClick={() => setIsAddModalOpen(false)}>Cancel</button><button type="submit" className="add-btn">Save student</button></div>
                    </form>
                </div>
            )}

            {selectedStudent && (
                <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelectedStudent(null)}>
                    <section className="student-form details-card" aria-labelledby="student-details-title">
                        <div className="modal-heading">
                            <div><span className="form-eyebrow">Student profile</span><h2 id="student-details-title">{selectedStudent.name}</h2><p>{selectedStudent.id} · Enrolled student</p></div>
                            <button type="button" className="modal-close" onClick={() => setSelectedStudent(null)} aria-label="Close student details">×</button>
                        </div>
                        <div className="details-hero"><span className="details-avatar">{selectedStudent.name.split(" ").map((part) => part[0]).join("")}</span><div><strong>{selectedStudent.name}</strong><span>{selectedStudent.email}</span></div><span className={selectedStudent.status === "Active" ? "active" : "inactive"}>{selectedStudent.status}</span></div>
                        <div className="details-grid"><div><span>Student ID</span><strong>{selectedStudent.id}</strong></div><div><span>Age</span><strong>{selectedStudent.age} years old</strong></div><div><span>Gender</span><strong>{selectedStudent.gender}</strong></div><div><span>Grade</span><strong>Grade {selectedStudent.grade}</strong></div><div><span>Section</span><strong>{selectedStudent.section}</strong></div><div><span>Email</span><strong>{selectedStudent.email}</strong></div></div>
                        <div className="form-actions"><button type="button" className="add-btn" onClick={() => setSelectedStudent(null)}>Done</button></div>
                    </section>
                </div>
            )}

        </div>
    );
}

export default App;
