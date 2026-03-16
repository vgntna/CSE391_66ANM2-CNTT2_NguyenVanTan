// ===== CẤU HÌNH & DỮ LIỆU =====
const prices = {
    Ao: 150000,
    Quan: 200000,
    Giay: 500000
};

// ===== TRUY XUẤT PHẦN TỬ =====
const $ = (id) => document.getElementById(id);

const els = {
    form: $("orderForm"),
    product: $("product"),
    quantity: $("quantity"),
    date: $("deliveryDate"),
    address: $("address"),
    note: $("note"),
    total: $("total"),
    noteCount: $("noteCount"),
    confirmBox: $("confirmBox"),
    orderSummary: $("orderSummary")
};

// ===== QUẢN LÝ LỖI =====
const showError = (id, msg) => {
    const errorEl = $(id);
    if (errorEl) errorEl.innerText = msg;
};

const clearError = (id) => {
    const errorEl = $(id);
    if (errorEl) errorEl.innerText = "";
};

// ===== CÁC HÀM KIỂM TRA (VALIDATION) =====
const validate = {
    product() {
        if (!els.product.value) return showError("productError", "Phải chọn sản phẩm"), false;
        return clearError("productError"), true;
    },

    quantity() {
        const q = Number(els.quantity.value);
        if (!Number.isInteger(q) || q < 1 || q > 99) {
            return showError("quantityError", "Số lượng từ 1 đến 99"), false;
        }
        return clearError("quantityError"), true;
    },

    date() {
        if (!els.date.value) return showError("dateError", "Chọn ngày giao"), false;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 30);

        const d = new Date(els.date.value);

        if (d < today) return showError("dateError", "Không chọn ngày quá khứ"), false;
        if (d > maxDate) return showError("dateError", "Không quá 30 ngày từ hôm nay"), false;

        return clearError("dateError"), true;
    },

    address() {
        if (els.address.value.trim().length < 10) {
            return showError("addressError", "Địa chỉ ≥ 10 ký tự"), false;
        }
        return clearError("addressError"), true;
    },

    note() {
        if (els.note.value.length > 200) {
            return showError("noteError", "Không quá 200 ký tự"), false;
        }
        return clearError("noteError"), true;
    },

    payment() {
        const checked = document.querySelector('input[name="payment"]:checked');
        if (!checked) return showError("paymentError", "Chọn phương thức thanh toán"), false;
        return clearError("paymentError"), true;
    }
};

// ===== XỬ LÝ LOGIC CHUNG =====
const updateTotal = () => {
    const p = els.product.value;
    const q = Number(els.quantity.value);
    const sum = (prices[p] && q) ? prices[p] * q : 0;
    els.total.innerText = sum.toLocaleString("vi-VN");
};

// ===== GẮN SỰ KIỆN =====

els.note.addEventListener("input", function() {
    const len = this.value.length;
    els.noteCount.innerText = `${len}/200`;
    
    if (len > 200) {
        els.noteCount.style.color = "red";
        showError("noteError", "Ghi chú không được vượt quá 200 ký tự");
    } else {
        els.noteCount.style.color = "gray";
        clearError("noteError");
    }
});

els.product.addEventListener("change", updateTotal);
els.quantity.addEventListener("input", updateTotal);

const fields = ["product", "quantity", "date", "address"];
fields.forEach(f => {
    els[f].addEventListener("blur", validate[f]);
    els[f].addEventListener(f === "product" ? "change" : "input", () => clearError(`${f}Error`));
});

document.querySelectorAll('input[name="payment"]').forEach(el => {
    el.addEventListener("change", () => clearError("paymentError"));
});

els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const isValid = 
        validate.product() &
        validate.quantity() &
        validate.date() &
        validate.address() &
        validate.note() &
        validate.payment();

    if (isValid) {
        const pName = els.product.options[els.product.selectedIndex].text;
        els.orderSummary.innerText = `Sản phẩm: ${pName}\nSố lượng: ${els.quantity.value}\nNgày giao: ${els.date.value}\nTổng tiền: ${els.total.innerText} VNĐ`;
        els.confirmBox.style.display = "block";
    }
});

$("confirmBtn").onclick = () => {
    els.confirmBox.style.display = "none";
    $("success").innerText = "Đặt hàng thành công 🎉";
}