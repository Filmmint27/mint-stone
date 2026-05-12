// ================== CART COUNT ==================
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    cart.forEach(item => {
        total += item.qty;
    });

    let el = document.getElementById("cart-count");
    if (el) el.innerText = total;
}

// ================== CONFIRM BUY ==================
function confirmBuy() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // กันพัง: ถ้าไม่มีค่าปัจจุบัน
    if (!currentProduct || !currentPrice || !currentBranch) {
        alert("เกิดข้อผิดพลาด ลองใหม่อีกครั้ง");
        return;
    }

    // เช็คสาขา
    if (cart.length > 0 && cart[0].branch && cart[0].branch !== currentBranch) {
        alert("ไม่สามารถสั่งสินค้าข้ามสาขาได้ กรุณาล้างตะกร้าก่อน");
        return;
    }

    let found = cart.find(item => item.name === currentProduct);

    if (found) {
        found.qty += qty;
    } else {
        cart.push({
            name: currentProduct,
            price: currentPrice,
            qty: qty,
            branch: currentBranch
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("เพิ่มลงตะกร้าแล้ว!");
    closePopup();
    updateCartCount();
}

// ================== CART POPUP ==================
function toggleCart() {
    let popup = document.getElementById("cart-popup");
    if (!popup) return;

    if (popup.style.display === "block") {
        popup.style.display = "none";
    } else {
        loadCartPopup();
        popup.style.display = "block";
    }
}

function loadCartPopup() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let html = "";
    let total = 0;

    cart.forEach((item, index) => {
        let subtotal = item.price * item.qty;
        total += subtotal;

        html += `
        <div style="margin-bottom:15px; text-align:center;">
            <b>${item.name}</b><br>

            <div class="qty-box">
                <button onclick="decreaseItem(${index}); event.stopPropagation()">-</button>
                <span>${item.qty}</span>
                <button onclick="increaseItem(${index}); event.stopPropagation()">+</button>
            </div>

            <div>= ${subtotal} บาท</div>
        </div>
        `;
    });

    let items = document.getElementById("cart-items");
    let totalEl = document.getElementById("cart-total");

    if (items) items.innerHTML = html;
    if (totalEl) totalEl.innerText = total;
}

// ================== ITEM CONTROL ==================
function increaseItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart[index].qty++;
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartPopup();
    updateCartCount();
}

function decreaseItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart[index].qty--;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartPopup();
    updateCartCount();
}

// ================== POPUP ==================
function openPopup(name, price, branch) {
    currentProduct = name;
    currentPrice = price;
    currentBranch = branch;
    qty = 1;

    document.getElementById("popup-name").innerText = name;
    document.getElementById("popup-qty").innerText = qty;

    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// ================== CLICK OUTSIDE ==================
document.addEventListener("click", function(e) {
    let popup = document.getElementById("cart-popup");
    let icon = document.querySelector(".cart-icon");

    if (!popup || !icon) return;

    if (!popup.contains(e.target) && !icon.contains(e.target)) {
        popup.style.display = "none";
    }
});

// ================== NAV ==================
function goToCart() {
    let popup = document.getElementById("cart-popup");
    if (popup) popup.style.display = "none";

    window.location.href = "order.html";
}

// ================== PAYMENT ==================
function confirmPayment() {

    let name =
    document.getElementById("name").value;

    let phone =
    document.getElementById("phone").value;

    let email =
    document.getElementById("email").value;

    let province =
    document.getElementById("province");

    let provinceValue =
    province.value;

    let provinceName =
    province.options[
        province.selectedIndex
    ].text;

    let payment =
    document.getElementById("payment").value;

    let delivery =
    document.getElementById("delivery").value;

    if (!name || !phone || !email || !delivery) {

        alert("กรุณากรอกข้อมูลให้ครบ");

        return;
    }

    let amphure = "";

    if (delivery === "delivery") {

        let amphureSelect =
        document.getElementById("amphure");

        amphure =
        amphureSelect.options[
            amphureSelect.selectedIndex
        ].text;
    }
    let district =
    document.getElementById("district").value;

    let address =
    document.getElementById("address").value;

    if (delivery === "delivery") {

        let address =
        document.getElementById("address").value;

        if (
            !address ||
            !provinceValue ||
            !amphure ||
            !district
        ) {

            alert("กรุณากรอกที่อยู่ให้ครบ");

            return;
        }
    }

    if (payment === "bank") {

        let slip =
        document.getElementById("slip")
        .files.length;

        if (slip === 0) {

            alert("กรุณาอัปโหลดสลิป");

            return;
        }
    }

    console.log("ส่งข้อมูลแล้ว");

    fetch(
    "https://script.google.com/macros/s/AKfycbxuKJIdn1GRLWWtb-oE6ruAIg1A9q13yUhPTWFql3907TQ5GxTz3V09RKluT4bQvhOH/exec",

    {

    method: "POST",

    mode: "no-cors",

    headers: {
        "Content-Type":
        "application/json"
    },

    body: JSON.stringify({

        name: name,

        phone: phone,

        email: email,

        province: provinceName,

        amphure: amphure,

        district: district,

        address: address,

        product: JSON.parse(
            localStorage.getItem("cart")
        )[0].name,

        qty: JSON.parse(
            localStorage.getItem("cart")
        )[0].qty,

        delivery: delivery
    })
});

    alert("สั่งซื้อสำเร็จ!");

    localStorage.removeItem("cart");

    window.location.href = "index.html";
}

// ================== ADDRESS ==================
function toggleAddress() {
    let selected = document.getElementById("delivery").value;
    let box = document.getElementById("address-box");

    if (selected === "delivery") {
        box.style.display = "block";
    } else {
        box.style.display = "none";
    }
}

// ================== จังหวัด ==================
const branchProvinces = {
    A: ["นครพนม", "สกลนคร", "บึงกาฬ", "มุกดาหาร"],
    B: ["อุบลราชธานี", "ศรีสะเกษ", "อำนาจเจริญ"]
};

function loadProvinces() {

    let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    let branch =
    cart.length > 0
    ? cart[0].branch
    : null;

    let provinceSelect =
    document.getElementById("province");

    if (!provinceSelect) return;

    fetch("provinces.json")

    .then(res => res.json())

    .then(data => {

        window.thaiData = data;

        provinceSelect.innerHTML =
        '<option value="">-- เลือกจังหวัด --</option>';

        let allowed =
        branchProvinces[branch] || [];

        let filtered =
        data.filter(p =>

            allowed.includes(
                p.name_th
            )
        );

        filtered.forEach(item => {

            provinceSelect.innerHTML += `

            <option value="${item.id}">
                ${item.name_th}
            </option>
            `;
        });
    });
}

function loadAmphures() {

    let provinceId =
        document.getElementById("province").value;

    fetch("districts.json")
    .then(res => res.json())
    .then(data => {

        let html =
        '<option value="">-- เลือกอำเภอ --</option>';

        let filtered = data.filter(item =>
            item.province_id == provinceId
        );

        filtered.forEach(item => {

            html += `
            <option value="${item.id}">
                ${item.name_th}
            </option>
            `;
        });

        document.getElementById("amphure").innerHTML = html;

        // reset ตำบล
        document.getElementById("district").innerHTML =
        '<option value="">-- เลือกตำบล --</option>';
    });
}

function loadDistricts() {

    let amphureId =
        document.getElementById("amphure").value;

    fetch("sub_districts.json")
    .then(res => res.json())
    .then(data => {

        let html =
        '<option value="">-- เลือกตำบล --</option>';

        // filter ตำบลตามอำเภอ
        let filtered = data.filter(item =>
            item.district_id == amphureId
        );

        filtered.forEach(item => {

            html += `
            <option value="${item.name_th}">
                ${item.name_th}
            </option>
            `;
        });

        document.getElementById("district").innerHTML = html;
    });
}
function toggleBank() {

    let payment =
        document.getElementById("payment").value;

    let bank =
        document.getElementById("bank-section");

    if (payment === "bank") {
        bank.style.display = "block";
    } else {
        bank.style.display = "none";
    }
}

function copyBankNumber() {

    let text =
        document.getElementById("bank-number").innerText;

    navigator.clipboard.writeText(text);

    alert("คัดลอกเลขบัญชีแล้ว");
}

function goBack() {
    window.location.href = "index.html";
}

function openMenu() {

    document.getElementById("sidebar")
            .style.width = "250px";

    document.getElementById("menu-btn")
            .style.display = "none";
}

function closeMenu() {

    document.getElementById("sidebar")
            .style.width = "0";

    document.getElementById("menu-btn")
            .style.display = "block";
}

// ================== START ==================
loadProvinces();
updateCartCount();