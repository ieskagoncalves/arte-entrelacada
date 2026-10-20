
/* CONFIGURAÇÃO DA LOJA */

// Coloque o número do WhatsApp com código do país e DDD.
// Exemplo: 5562999999999
const WHATSAPP_NUMBER = "5562983000684";

// Produtos de exemplo. Edite nome, descrição, preço e imagem.
const products = [
  {
    id: 1,
    name: "Luminária feito a mão",
    description: "Lumiária artesanal<br><br>- Comprimento: 1,50 metros<br> - Mão Francesa: Não inclusa <br> - Lâmpada: Não inclusa<br> - Material: Algodão, fio 1,5mm<br> - Cor: Verificar disponibilidade.",
    price: 100.00,
    image: "img/produtos/luminaria.jpeg"
  },
  {
    id: 2,
    name: "Suporte de Banana",
    description: "Suporte de bananas feito à mão em macramê.<br><br><br> - Comprimento: 48 cm<br> - Cor: Verificar disponibilidade<br> - Material: Algodão<br> - Espesso 24 fios",
    price: 40.00,
    image: "img/produtos/suporte-de-banana.jpeg"
  },
  {
    id: 3,
    name: "Painel de Parede - Entrelaços",
    description: "Painel de parede com design de entrelaços.<br><br> - Largura: 59 cm<br> - Altura: 80 cm<br> - Cor: Verificar disponibilidade<br> - Material: Algodão<br> - Espesso 24 Fios",
    price: 320.00,
    image: "img/produtos/painel-2.jpeg"
  },
  {
    id: 4,
    name: "Cestaria em Macramê",
    description: "Cestaria em macramê feita às mão.<br><br> - Largura: 22 cm<br> - Altura: 31 cm<br> - Cor: Verificar disponibilidade<br> - Material: Algodão e cesta de palha<br> - Espesso 24 Fios",
    price: 68.00,
    image: "img/produtos/cestaria-macrame.jpeg"
  },
  {
    id: 5,
    name: "Painel Flor",
    description: "Painel de parede mostarda.<br><br> - Largura: 59 cm<br> - Altura: 80 cm<br> - Cor: Verificar disponibilidade<br> - Material: Algodão<br> - Espesso 24 Fios",
    price: 320.00,
    image: "img/produtos/painel-mostarda-flor.jpeg"
  }
];

const cart = [];

const money = value =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

const productGrid = document.getElementById("productGrid");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");

/* EXIBIR PRODUTOS */
function renderProducts() {
  productGrid.innerHTML = products.map(product => `
    <article class="product-card">
      <img
        class="product-photo"
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
      >

      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>

        <div class="product-bottom">
          <span class="price">${money(product.price)}</span>
          <button class="add-button" data-add="${product.id}">
            ADICIONAR À SACOLA
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

/* ADICIONAR AO CARRINHO */
function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  const found = cart.find(item => item.id === id);

  if (found) {
    found.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  openCart();
}

/* REMOVER DO CARRINHO */
function removeFromCart(id) {
  const index = cart.findIndex(item => item.id === id);

  if (index !== -1) {
    cart.splice(index, 1);
  }

  renderCart();
}

/* ATUALIZAR CARRINHO E TOTAL */
function renderCart() {
  const count = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = money(total);

  const container = document.getElementById("cartItems");

  if (!cart.length) {
    container.innerHTML =
      '<p class="empty-cart">Sua sacola está vazia.</p>';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <h3>${item.name} × ${item.quantity}</h3>
        <p>${money(item.price * item.quantity)}</p>
      </div>

      <button data-remove="${item.id}">Remover</button>
    </div>
  `).join("");
}

/* ABRIR E FECHAR CARRINHO */
function openCart() {
  cartPanel.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
  cartOverlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
  cartOverlay.hidden = true;
  document.body.style.overflow = "";
}

/* CLIQUES NOS BOTÕES DE PRODUTO */
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");

  if (button) {
    addToCart(Number(button.dataset.add));
  }
});

document.getElementById("cartItems").addEventListener("click", event => {
  const button = event.target.closest("[data-remove]");

  if (button) {
    removeFromCart(Number(button.dataset.remove));
  }
});

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeCart();
});

/* MENU PARA CELULAR */
document.getElementById("menuToggle").addEventListener("click", () => {
  const navigation = document.getElementById("navigation");
  navigation.classList.toggle("show");
});

document.querySelectorAll(".navigation a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("navigation").classList.remove("show");
  });
});

/* FINALIZAR PEDIDO PELO WHATSAPP */
document.getElementById("checkout").addEventListener("click", () => {
  if (!cart.length) {
    alert("Adicione um produto à sacola primeiro.");
    return;
  }

  if (WHATSAPP_NUMBER === "5500000000000") {
    alert("Configure o número do WhatsApp no arquivo script.js.");
    return;
  }

  const lines = cart.map(item =>
    `- ${item.name} (${item.quantity}x): ${
      money(item.price * item.quantity)
    }`
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const message =
    `Olá! Gostaria de fazer um pedido na Arte Entrelaçada:\n\n` +
    `${lines.join("\n")}\n\nTotal: ${money(total)}`;

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
});

/* ANO AUTOMÁTICO NO RODAPÉ */
document.getElementById("year").textContent =
  new Date().getFullYear();

/* INICIAR A LOJA */
renderProducts();
renderCart();
