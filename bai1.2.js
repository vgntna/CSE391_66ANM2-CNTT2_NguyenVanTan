
llet students = [];
let filteredStudents = [];
let isSorting = false;
let sortAsc = true;

const nameInput = document.getElementById("name");
const scoreInput = document.getElementById("score");
const addBtn = document.getElementById("addBtn");
const searchInput = document.getElementById("searchInput");
const filterRank = document.getElementById("filterRank");
const tableBody = document.getElementById("tableBody");
const sortScore = document.getElementById("sortScore");

function getRank(score) {
    if (score >= 8.5) return "Giỏi";
    if (score >= 7) return "Khá";
    if (score >= 5) return "Trung bình";
    return "Yếu";
}

function addStudent() {
    const name = nameInput.value.trim();
    const score = parseFloat(scoreInput.value);

    if (!name) return alert("Họ tên không được trống");
    if (isNaN(score) || score < 0 || score > 10) return alert("Điểm phải từ 0 đến 10");

    students.push({ name, score });
    
    nameInput.value = "";
    scoreInput.value = "";
    nameInput.focus();

    applyFilters();
}

function applyFilters() {
    const keyword = searchInput.value.toLowerCase();
    const rankFilter = filterRank.value;

    filteredStudents = students.filter(s => {
        const matchName = s.name.toLowerCase().includes(keyword);
        const rank = getRank(s.score);
        const matchRank = rankFilter === "all" || rank === rankFilter;
        return matchName && matchRank;
    });

    if (isSorting) {
        filteredStudents.sort((a, b) => sortAsc ? a.score - b.score : b.score - a.score);
    }

    renderTable();
}

function renderTable() {
    if (filteredStudents.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="no-result">Không có kết quả</td></tr>`;
        return;
    }

    tableBody.innerHTML = filteredStudents.map((s, index) => `
        <tr class="${s.score < 5 ? 'low-score' : ''}">
            <td>${index + 1}</td>
            <td>${s.name}</td>
            <td>${s.score}</td>
            <td>${getRank(s.score)}</td>
            <td><button onclick="deleteStudent('${s.name}', ${s.score})">Xóa</button></td>
        </tr>
    `).join('');
}

function deleteStudent(name, score) {
    students = students.filter(s => !(s.name === name && s.score === score));
    applyFilters();
}

addBtn.addEventListener("click", addStudent);

scoreInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addStudent();
});

searchInput.addEventListener("input", applyFilters);
filterRank.addEventListener("change", applyFilters);

sortScore.addEventListener("click", () => {
    isSorting = true;
    sortAsc = !sortAsc;
    sortScore.innerHTML = sortAsc ? "Điểm ▲" : "Điểm ▼";
    applyFilters();
});