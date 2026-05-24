// Глобальная переменная - массив товаров
const products = [
    { id: 1, name: "Кофемашина Barista Pro", price: 45000, image: "images/espresso-machine-thumb.jpg", link: "espresso-machine.html" },
    { id: 2, name: "Кофемолка GrindMaster", price: 18000, image: "images/coffee-grinder-thumb.jpg", link: "coffee-grinder.html" },
    { id: 3, name: "Набор бариста Barista Kit", price: 8500, image: "images/barista-kit-thumb.jpg", link: "barista-kit.html" }
];

// Массив корзины
let cart = [];

// Функция сохранения корзины в LocalStorage
const saveCartToLocalStorage = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

// Функция загрузки корзины из LocalStorage
const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
};

// Функция подсчета цены (стрелочная)
const calculateTotal = () => cart.reduce((sum, item) => sum + item.price, 0);

// Отображение корзины
const updateCart = () => {
    const cartList = document.getElementById('cart-list');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartList.innerHTML = '<p>Корзина пуста</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    cartList.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name} - ${item.price} ₽</span>
            <button class="remove-item" data-id="${item.id}">Удалить</button>
        </div>
    `).join('');
    
    cartTotal.textContent = calculateTotal();
    
    // Обработчики удаления
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.onclick = () => {
            const id = parseInt(btn.dataset.id);
            cart = cart.filter(item => item.id !== id);
            updateCart();
            saveCartToLocalStorage();  // Сохраняем после удаления
            alert('Товар удален из корзины');
        };
    });
};

// Добавление в корзину
const addToCart = (product) => {
    cart.push(product);
    updateCart();
    saveCartToLocalStorage();  // Сохраняем после добавления
    alert(`${product.name} добавлен в корзину`);
};

// Очистка корзины
const clearCart = () => {
    if (cart.length === 0) {
        alert('Корзина пуста');
    } else {
        cart = [];
        updateCart();
        saveCartToLocalStorage();  // Сохраняем после очистки
        alert('Корзина очищена');
    }
};

// Оплата
const checkout = () => {
    if (cart.length === 0) {
        alert('Корзина пуста');
    } else {
        const total = calculateTotal();
        alert(`Покупка прошла успешно! Сумма: ${total} ₽`);
        cart = [];
        updateCart();
        saveCartToLocalStorage();  // Сохраняем после оплаты
    }
};

// Отображение товаров с фильтром
const displayProducts = (filter = 'all') => {
    const container = document.getElementById('catalog');
    
    let filtered = products;
    if (filter === 'low') filtered = products.filter(p => p.price < 30000);
    if (filter === 'medium') filtered = products.filter(p => p.price >= 30000 && p.price <= 60000);
    if (filter === 'high') filtered = products.filter(p => p.price > 60000);
    
    container.innerHTML = filtered.map(product => `
        <div class="catalog-item">
            <a href="${product.link}">
                <img src="${product.image}" alt="${product.name}" width="200">
            </a>
            <p><a href="${product.link}">${product.name}</a></p>
            <p class="price">${product.price} ₽</p>
            <button class="add-btn" data-id="${product.id}">Добавить в корзину</button>
        </div>
    `).join('');
    
    // Обработчики добавления
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.onclick = () => {
            const id = parseInt(btn.dataset.id);
            const product = products.find(p => p.id === id);
            addToCart(product);
        };
    });
};

// Фильтры
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        displayProducts(btn.dataset.filter);
    };
});

// Кнопки корзины
document.getElementById('clear-cart').onclick = clearCart;
document.getElementById('checkout').onclick = checkout;

// Загрузка страницы
displayProducts('all');
loadCartFromLocalStorage();  // Загружаем корзину из LocalStorage