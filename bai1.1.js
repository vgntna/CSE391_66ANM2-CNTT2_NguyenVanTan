class StudentManager {
    constructor() {
        this.students = [];
        this.dom = {
            name: document.getElementById("name"),
            score: document.getElementById("score"),
            addBtn: document.getElementById("addBtn"),
            tableBody: document.getElementById("tableBody"),
            stats: document.getElementById("stats"),
            title: document.getElementById("demo")
        };
        this.init();
    }

    init() {
        this.dom.title.innerHTML = "<strong>Student Dashboard</strong>";
        
        this.dom.addBtn.onclick = () => this.addStudent();
        this.dom.score.onkeypress = (e) => e.key === "Enter" && this.addStudent();
        
        this.dom.tableBody.onclick = (e) => {
            if (e.target.classList.contains("delete-btn")) {
                this.removeStudent(e.target.dataset.index);
            }
        };
    }

    getRank(score) {
        if (score >= 8.5) return { text: "Giỏi", class: "rank-excellent" };
        if (score >= 7) return { text: "Khá", class: "rank-good" };
        if (score >= 5) return { text: "Trung bình", class: "rank-average" };
        return { text: "Yếu", class: "rank-poor" };
    }

    addStudent() {
        const name = this.dom.name.value.trim();
        const score = parseFloat(this.dom.score.value);

        if (!name || isNaN(score) || score < 0 || score > 10) {
            alert("Vui lòng kiểm tra lại thông tin (Điểm 0-10)");
            return;
        }

        this.students.push({ name, score });
        this.render();
        this.resetForm();
    }

    removeStudent(index) {
        this.students.splice(index, 1);
        this.render();
    }

    resetForm() {
        this.dom.name.value = "";
        this.dom.score.value = "";
        this.dom.name.focus();
    }

    render() {
        this.dom.tableBody.innerHTML = this.students.map((s, i) => {
            const rank = this.getRank(s.score);
            return `
                <tr class="${s.score < 5 ? 'low-score' : ''}">
                    <td>${s.name}</td>
                    <td>${s.score}</td>
                    <td class="${rank.class}">${rank.text}</td>
                    <td><button class="delete-btn" data-index="${i}">Xóa</button></td>
                </tr>
            `;
        }).join('');

        this.updateStats();
    }

    updateStats() {
        const total = this.students.length;
        const avg = total ? (this.students.reduce((a, b) => a + b.score, 0) / total).toFixed(2) : 0;
        this.dom.stats.innerHTML = `Sĩ số: <b>${total}</b> | Trung bình lớp: <b>${avg}</b>`;
    }
}

const app = new StudentManager();