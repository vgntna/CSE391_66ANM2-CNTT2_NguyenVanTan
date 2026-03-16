// ===== LẤY ELEMENT =====
const $ = (id) => document.getElementById(id);

const elements = {
    form: $("registerForm"),
    fullname: $("fullname"),
    email: $("email"),
    phone: $("phone"),
    password: $("password"),
    confirmPassword: $("confirmPassword"),
    terms: $("terms"),
    successMessage: $("successMessage"),
    nameCount: $("nameCount"),
    strengthBar: $("strengthBar"),
    strengthText: $("strengthText"),
    togglePassword: $("togglePassword")
};

// ===== HÀM HIỂN THỊ LỖI =====
const showError = (field, message) => $(`${field}Error`).innerText = message;
const clearError = (field) => $(`${field}Error`).innerText = "";

// ===== ĐẾM KÝ TỰ HỌ TÊN =====
elements.fullname.addEventListener("input", function() {
    elements.nameCount.innerText = `${this.value.length}/50`;
    clearError("fullname");
});

// ===== PASSWORD STRENGTH =====
elements.password.addEventListener("input", function() {
    const val = this.value;
    let score = 0;

    if (val.length >= 6) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    elements.strengthBar.className = "";
    const { strengthBar, strengthText } = elements;

    if (score <= 1) {
        strengthBar.classList.add("active");
        strengthText.innerText = "Yếu";
        strengthText.style.color = "red";
    } else if (score <= 3) {
        strengthBar.classList.add("medium");
        strengthText.innerText = "Trung bình";
        strengthText.style.color = "orange";
    } else {
        strengthBar.classList.add("strong");
        strengthText.innerText = "Mạnh";
        strengthText.style.color = "green";
    }
    clearError("password");
});

// ===== HIỆN / ẨN PASSWORD =====
elements.togglePassword.addEventListener("click", () => {
    const isPass = elements.password.type === "password";
    elements.password.type = isPass ? "text" : "password";
});

// ===== CÁC HÀM VALIDATE =====
const validators = {
    fullname() {
        const val = elements.fullname.value.trim();
        const regex = /^[A-Za-zÀ-ỹ\s]{3,}$/;
        if (!val) return showError("fullname", "Không được để trống"), false;
        if (!regex.test(val)) return showError("fullname", "Ít nhất 3 ký tự, chỉ chứa chữ cái"), false;
        return clearError("fullname"), true;
    },
    email() {
        const val = elements.email.value.trim();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!val) return showError("email", "Email không được trống"), false;
        if (!regex.test(val)) return showError("email", "Email không đúng định dạng"), false;
        return clearError("email"), true;
    },
    phone() {
        const regex = /^0\d{9}$/;
        if (!regex.test(elements.phone.value.trim())) return showError("phone", "SĐT phải 10 số và bắt đầu bằng 0"), false;
        return clearError("phone"), true;
    },
    password() {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!regex.test(elements.password.value)) return showError("password", "≥8 ký tự, có chữ hoa, thường, số"), false;
        return clearError("password"), true;
    },
    confirmPassword() {
        if (elements.confirmPassword.value !== elements.password.value) return showError("confirmPassword", "Mật khẩu không khớp"), false;
        return clearError("confirmPassword"), true;
    },
    gender() {
        const selected = document.querySelector('input[name="gender"]:checked');
        if (!selected) return showError("gender", "Phải chọn giới tính"), false;
        return clearError("gender"), true;
    },
    terms() {
        if (!elements.terms.checked) return showError("terms", "Phải đồng ý điều khoản"), false;
        return clearError("terms"), true;
    }
};

// ===== SUBMIT =====
elements.form.addEventListener("submit", (e) => {
    e.preventDefault();

    const isAllValid = Object.keys(validators).every(key => validators[key]());

    if (isAllValid) {
        elements.form.style.display = "none";
        elements.successMessage.innerText = `Đăng ký thành công! 🎉 Xin chào ${elements.fullname.value}`;
    }
});

// ===== SỰ KIỆN BLUR & INPUT =====
["fullname", "email", "phone", "password", "confirmPassword"].forEach(field => {
    elements[field].addEventListener("blur", validators[field]);
    if (field !== "fullname" && field !== "password") {
        elements[field].addEventListener("input", () => clearError(field));
    }
});