const popupOldPrice = document.getElementById("popupOldPrice");
const popupNewPrice = document.getElementById("popupNewPrice");


const elements = document.querySelectorAll(
    ".product, .instagram, .about, .contact"
);

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";

        }

    });

});

elements.forEach(el => {

    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    el.style.transition = "all 0.7s ease";

    observer.observe(el);

});


const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
        
    } else {
        header.classList.remove("scrolled");
        
    }
});


window.addEventListener("load", () => {

    const loader = document.querySelector(".loader");

    loader.style.opacity = "0";

    setTimeout(() => {
        loader.style.display = "none";
    }, 500);

});


const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

menu.addEventListener("click", () => {
    nav.classList.toggle("active");   
});


let cart = [];



const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartIcon = document.querySelector(".cart-icon");
const cartPanel = document.getElementById("cartPanel");










const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutPanel = document.getElementById("checkoutPanel");




const API_URL = "https://script.google.com/macros/s/AKfycbzcGURakjUWKM9SR7050dWFKaFxhsykpIKQGqO48T9XWhxcU33ShyQGjS1qVlUbBf-z/exec";
const checkoutForm = document.getElementById("checkoutForm");


const paymentSelect = document.getElementById("paymentSelect");
const vodafoneInfo = document.getElementById("vodafoneInfo");

paymentSelect.addEventListener("change", function () {
    if (this.value === "vodafone") {
        vodafoneInfo.style.display = "block";
    } else {
        vodafoneInfo.style.display = "none";
    }
});
const phoneInput = document.getElementById("phone");
const phoneError = document.getElementById("phoneError");

checkoutForm.addEventListener("submit", function (e) {

    e.preventDefault();



    // منع الطلب لو السلة فاضية
    if (cart.length === 0) {
        showOrderSuccess("Your cart is empty! Add some products first.");
        return;
    }

   

    const paymentMethod = paymentSelect.value;

    if (!paymentMethod) {
        alert("Please select a payment method");
        return;
    }


    const phone = phoneInput.value.trim();

    
    if (!/^\d{11}$/.test(phone)) {
        phoneError.innerText = "Please enter exactly 11 digits.";
        phoneError.style.display = "block";
        return; 
    } else {
        phoneError.innerText = "";
        phoneError.style.display = "none";
    }

    const subtotal = cart.reduce((sum, item) => {
        return sum + (item.quantity * item.price);
    }, 0);

    const shipping = 95;

    const total = subtotal + shipping;

    const order = {
        email: document.getElementById("email").value,
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        phone: phone,
        city: document.getElementById("city").value,
        address: document.getElementById("address").value,
        payment: paymentMethod,
        products: cart.map(item =>
            `${item.name} (Color: ${item.color}, Size: ${item.size}, Qty: ${item.quantity})`).join(", "),
        subtotal: subtotal,
        shipping: shipping,
        total: total
    };

    fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(order)
    })
        .then(() => {

            const email = document.getElementById("email").value;
            const firstName = document.getElementById("firstName").value;
            const lastName = document.getElementById("lastName").value;
            const city = document.getElementById("city").value;
            const address = document.getElementById("address").value;



            const productsText = cart.map(item =>
                `${item.name} (${item.color} - ${item.size}) x ${item.quantity} = ${item.price * item.quantity} EGP`
            ).join("\n");





            const message = `
 New Order - BEKIVO

 Email: ${email}
 Name: ${firstName} ${lastName}
 Phone: ${phone}
 City: ${city}
 Address: ${address}
 Payment Method: ${paymentMethod}

 Order:
${productsText}

 Subtotal: ${subtotal} EGP
 Shipping: ${shipping} EGP

 Total: ${total} EGP

`;

            const yourNumber = "201023085140";

            const whatsappURL = `https://wa.me/${yourNumber}?text=${encodeURIComponent(message)}`;



            
            checkoutForm.reset();

            
            cart = [];
            cartCount.innerText = 0;
            updateCart();

            
            checkoutPanel.classList.remove("open");
            cartPanel.classList.remove("open");
            document.body.classList.remove("no-scroll");


            
            popupSize.value = "";
            popupQuantity.value = "";
            popupColors.innerHTML = "";

            document.querySelectorAll(".color-option")
                .forEach(el => el.classList.remove("active"));


            
            currentModel = null;
            currentPrice = 0;


            showOrderSuccess("Order sent successfully! ✅");

            setTimeout(() => {
                window.open(whatsappURL, "_blank");
            }, 800);


            checkoutPanel.classList.remove("open");
            document.body.classList.remove("no-scroll");

        })
        .catch(err => {
            console.error(err);
            showOrderSuccess("Something went wrong. Try again!");
        });

});



// Notification
const toast = document.getElementById("toast");

function showToast(message) {
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 1500);
}






cartIcon.addEventListener("click", function () {
    cartPanel.classList.toggle("open");
    // document.body.classList.toggle("no-scroll");
});




document.addEventListener("click", function (e) {

    // قفل السلة
   // حط ده مكانه
if (cartPanel.classList.contains("open")) {
    
    if (!cartPanel.contains(e.target) && !cartIcon.contains(e.target) && e.target !== buyNowPopup) {
        cartPanel.classList.remove("open");
    }
}

    // قفل الـ Checkout
    if (checkoutPanel.classList.contains("open")) {
        if (!checkoutPanel.contains(e.target) && e.target !== checkoutBtn) {
            checkoutPanel.classList.remove("open");
            document.body.classList.remove("no-scroll");
        }
    }

});


checkoutBtn.addEventListener("click", function () {

    if (cart.length === 0) {
        showOrderSuccess("Your cart is empty! Add some products first.");
        return; // منع فتح الفورم
    }


    checkoutPanel.classList.add("open");
    cartPanel.classList.remove("open"); 
    document.body.classList.add("no-scroll");
});



function showOrderSuccess(message) {
    const orderToast = document.createElement("div");
    orderToast.className = "order-toast";
    orderToast.innerText = message;
    document.body.appendChild(orderToast);

    setTimeout(() => {
        orderToast.classList.add("show");
    }, 100); 

    setTimeout(() => {
        orderToast.classList.remove("show");
        setTimeout(() => {
            document.body.removeChild(orderToast);
        }, 500);
    }, 2000); 
}










const oldPrice = document.getElementById("oldPrice");
const newPrice = document.getElementById("newPrice");
const popupColor = document.getElementById("popupColor");


// قفل
document.getElementById("closeModelPopup").onclick = () => {
    popup.classList.remove("active");
};








const popupSize = document.getElementById("popupSize");
const popupQuantity = document.getElementById("popupQuantity");
const addToCartPopup = document.getElementById("addToCartPopup");
const buyNowPopup = document.getElementById("buyNowPopup");
const closeModelPopup = document.getElementById("closeModelPopup");






closeModelPopup.addEventListener("click", () => {
    popup.classList.remove("active");
});


addToCartPopup.addEventListener("click", () => {
    const size = popupSize.value;
    const quantity = popupQuantity.value;

    const selectedColorEl = popupColors.querySelector(".color-option.active");
    const selectedColor = selectedColorEl ? selectedColorEl.title : null;

    if (!selectedColor) {
        alert("Please select a color");
        return;
    }
    if (!size || size === "Select Size") {
        alert("Please select size");
        return;
    }

    if (!quantity || quantity < 1) {
        alert("Please select quantity");
        return;
    }



    //  المنتج إلى السلة
    cart.push({
        model: currentModel,
        name: popupName.innerText,
        color: selectedColor,
        size: size,
        quantity: parseInt(quantity),
        price: currentPrice
    });

    // تحديث عدد السلة
    cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    updateCart(); 

   
    showToast(`${popupName.innerText} (${selectedColor}, ${size}) Added To Cart ✅`);
});

// حط ده مكانه
buyNowPopup.addEventListener("click", (e) => {
    e.stopPropagation(); // السطر ده هو السر اللي هيخليها تفتح ومتقفلش

    if (cart.length === 0) {
        
        alert("Please add at least one item to your cart first!");
         return; 
    }
    popup.classList.remove("active");
    checkoutPanel.classList.remove("open");
    cartPanel.classList.add("open");
   
});

function updateCart() {

    function updateTotals() {
        const shipping = 95;
        document.getElementById("subtotalPrice").innerText = "";
        document.getElementById("totalPrice").innerText = shipping + " EGP";
    }

    let subtotal = 0;
    cartItems.innerHTML = "";
    cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `${item.name}  (Size: ${item.size})  (Color: ${item.color})  x ${item.quantity}<button onclick="removeItem(${index})">❌</button>
`;
        cartItems.appendChild(div);
    });

      const shipping = 95;
    const total = subtotal + shipping;

    
    document.getElementById("checkoutTotal").innerText = "Total: " + total + " EGP";


    updateTotals();
}

function removeItem(index) {
    cart.splice(index, 1);
    cartCount.innerText = cart.length;
    updateCart();
}


const categoryCards = document.querySelectorAll(".category-card");
const modelsSection = document.getElementById("modelsSection");
const modelsTitle = document.getElementById("modelsTitle");
const modelGrid = document.querySelector(".model-grid");

const popup = document.getElementById("modelPopup");
const popupImage = document.getElementById("popupImage");
const popupName = document.getElementById("popupName");
const popupColors = document.querySelector(".popup-colors");

let currentModel = null;
let currentPrice = 0;

// البيانات
const data = {
    pants: [
        {
            name: "BEKIVO TAILORED PANTS",
            img: "imag/pants7.jpeg",
            oldPrice: 1200,
            newPrice: 900,
            colors: [
                { name: "black", img: "imag/pants4.jpeg" },
                { name: "beige", img: "imag/pants5.jpeg" },
                { name: "gray", img: "imag/pants6.jpeg" }
            ]
        },
        // {
        //     name: "Straight Leg",
        //     img: "image/459ac9e5-c3ed-41f7-b74f-af7e9ca57803.jpg",
        //     oldPrice: 100,
        //     newPrice: 70,
        //     colors: [
        //         { name: "black", img: "imag/pants_straight_black.jpeg" },
        //         { name: "brown", img: "imag/pants_straight_brown.jpeg" },
        //         { name: "white", img: "imag/pants_straight_white.jpeg" }
        //     ]
        // },
        // {
        //     name: "Relaxed Fit",
        //     img: "image/459ac9e5-c3ed-41f7-b74f-af7e9ca57803.jpg",
        //     oldPrice: 120,
        //     newPrice: 90,
        //     colors: [
        //         { name: "black", img: "imag/pants_relaxed_black.jpeg" },
        //         { name: "brown", img: "imag/pants_relaxed_brown.jpeg" },
        //         { name: "white", img: "imag/pants_relaxed_white.jpeg" }
        //     ]
        // }
    ],
    shoes: [
        {
            name: "BEKIVO CHUNKY DERBY",
            img: "imag/shoes4.jpeg",
            oldPrice: 1300,
            newPrice: 900,
            colors: [
                { name: "black", img: "imag/shoes4.jpeg" },
                // { name: "brown", img: "imag/shoes1.jpeg" },
                // { name: "white", img: "imag/78418c1e.jpg" }
            ]
        },

        // {
        //     name: "Classic Leather",
        //     img: "image/6d047ae7-1ce8-4558-ad15-4b708ce8d482.jpg",
        //     oldPrice: 200,
        //     newPrice: 150,
        //     colors: [
        //         { name: "black", img: "imag/shoes1.jpeg" },
        //         { name: "brown", img: "imag/shoes2.jpeg" },
        //         { name: "white", img: "imag/78418c1e.jpg" }
        //     ]
        // },

        // {
        //     name: "Casual Sneakers",
        //     img: "image/6d047ae7-1ce8-4558-ad15-4b708ce8d482.jpg",
        //     oldPrice: 250,
        //     newPrice: 180,
        //     colors: [
        //         { name: "black", img: "imag/shoes_chunky_black.jpeg" },
        //         { name: "brown", img: "imag/shoes_chunky_brown.jpeg" },
        //         { name: "white", img: "imag/shoes_chunky_white.jpeg" }
        //     ]
        // }
    ]
}

categoryCards.forEach(card => {
    card.addEventListener("click", () => {

        const category = card.dataset.category;

        modelsSection.classList.remove("hidden");
        modelGrid.innerHTML = "";

        modelsTitle.innerText =
            category === "pants"
                ? "Choose Your Pants Model 👖"
                : "Choose Your Shoes Model 👟";

        modelsSection.classList.remove("hidden");

        setTimeout(() => {
            modelsSection.scrollIntoView({
                behavior: "smooth"
            });
        }, 200);

        data[category].forEach(model => {

            const div = document.createElement("div");
            div.classList.add("model-card");

            div.innerHTML = `
                <img src="${model.img}">
                <h4>${model.name}</h4>
            `;

            
            div.addEventListener("click", (e) => {
                e.stopPropagation();


                currentModel = model.name;

                popup.classList.add("active");
                popupImage.src = model.img;
                popupName.innerText = model.name;

                
                popupOldPrice.innerText = model.oldPrice + " EGP";
                popupNewPrice.innerText = model.newPrice+ " EGP";
                currentPrice = model.newPrice;

                popupColors.innerHTML = "";
                let sizes = [];

                if (category === "pants") {
                    sizes = ["M", "L", "XL", "XXL"];
                } else if (category === "shoes") {
                    sizes = ["41", "42", "43", "44", "45"];
                }

                popupSize.innerHTML = "";


                const defaultOption = document.createElement("option");
                defaultOption.value = "";
                defaultOption.innerText = "Select Size";
                popupSize.appendChild(defaultOption);

                sizes.forEach(size => {
                    const option = document.createElement("option");
                    option.value = size;
                    option.innerText = size;
                    popupSize.appendChild(option);
                });



                model.colors.forEach(color => {
                    const c = document.createElement("div");
                    c.classList.add("color-option");
                    c.style.background = color.name;
                    c.title = color.name;

                    c.addEventListener("click", () => {
                        document.querySelectorAll(".color-option")
                            .forEach(x => x.classList.remove("active"));
                        c.classList.add("active");
                        popupImage.src = color.img;
                    });

                    popupColors.appendChild(c);
                });
            });

            modelGrid.appendChild(div);
        });
    });
});


document.addEventListener("click", function (e) {

    if (popup.classList.contains("active") && e.target === popup) {
        popup.classList.remove("active");
    }

});