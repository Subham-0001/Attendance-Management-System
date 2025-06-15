let sections = {};
let week = 1;

function setupStudents() {
    const section = document.getElementById("section").value;
    const year = document.getElementById("year").value;
    const count = parseInt(document.getElementById("student-count").value);

    if (!section || !count || count <= 0) {
        alert("Enter a valid section and number of students!");
        return;
    }

    const key = `${year} - ${section}`;
    if (!sections[key]) {
        sections[key] = [];
    }

    const existingRolls = sections[key].length;

    for (let i = 1; i <= count; i++) {
        sections[key].push({
            roll: `Roll-${existingRolls + i}`,
            year: year,
            section: section,
            attendance: { Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null },
            absences: 0,
            debarred: false
        });
    }

    renderTables();
}

function renderTables() {
    const sectionContainer = document.getElementById("attendance-sections");
    sectionContainer.innerHTML = "";

    for (let key in sections) {
        const table = document.createElement("table");
        table.innerHTML = `
            <thead>
                <tr>
                    <th colspan="10" class="section-header">${key}</th>
                </tr>
                <tr>
                    <th>Roll No</th>
                    <th>Year</th>
                    <th>Section</th>
                    <th>Monday</th>
                    <th>Tuesday</th>
                    <th>Wednesday</th>
                    <th>Thursday</th>
                    <th>Friday</th>
                    <th>Absences</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody id="${key.replace(/\s/g, '-')}-table"></tbody>
        `;

        sectionContainer.appendChild(table);
        renderAttendanceRows(key);
    }
    renderDebarredList();
}

function renderAttendanceRows(sectionKey) {
    const table = document.getElementById(`${sectionKey.replace(/\s/g, '-')}-table`);
    table.innerHTML = "";

    sections[sectionKey].forEach((student, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.roll}</td>
            <td>${student.year}</td>
            <td>${student.section}</td>
            ${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day => 
                `<td>
                    <button class="present-btn ${student.attendance[day] === true ? 'marked' : ''}" 
                        onclick="markAttendance('${sectionKey}', ${index}, '${day}', true)">
                        Present
                    </button>
                    <button class="absent-btn ${student.attendance[day] === false ? 'marked' : ''}" 
                        onclick="markAttendance('${sectionKey}', ${index}, '${day}', false)">
                        Absent
                    </button>
                </td>`).join("")}
            <td>${student.absences}</td>
            <td>${student.debarred ? "Debarred" : "Allowed"}</td>
        `;

        table.appendChild(row);
    });
}

function markAttendance(sectionKey, index, day, isPresent) {
    const student = sections[sectionKey][index];

    if (student.attendance[day] === isPresent) return;

    if (student.attendance[day] === false && isPresent) {
        student.absences = Math.max(0, student.absences - 1);
    } else if (student.attendance[day] === null && !isPresent) {
        student.absences++;
    }

    student.attendance[day] = isPresent;
    student.debarred = student.absences >= 12;

    renderTables();
}

function confirmWeek() {
    for (let key in sections) {
        sections[key].forEach(student => {
            student.attendance = { Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null };
        });
    }
    week++;
    document.getElementById("week-counter").innerText = week;
    renderTables();
}

function renderDebarredList() {
    const debarredContainer = document.getElementById("debarred-list");
    debarredContainer.innerHTML = "<h3>Debarred Students</h3>";

    let hasDebarred = false;
    for (let key in sections) {
        sections[key].forEach(student => {
            if (student.debarred) {
                const div = document.createElement("div");
                div.classList.add("debarred-student");
                div.innerHTML = `<strong>${student.roll}</strong> (Year: ${student.year}, Section: ${student.section}) - <span style="color: red;">Debarred</span>`;
                debarredContainer.appendChild(div);
                hasDebarred = true;
            }
        });
    }

    if (!hasDebarred) {
        debarredContainer.innerHTML += "<p>No students debarred yet.</p>";
    }
}

function endSemester() {
    alert("Semester ended!");
}
