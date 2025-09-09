const apiUrl = "https://openapi.programming-hero.com/api/plants";
let allPlants = [];
let cart = [];

// DOM elements
const treesContainer = document.getElementById("trees-container");
const categoriesList = document.getElementById("categories-list");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");

// Spinner
const spinner = document.createElement("div");
spinner.className =
  "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50";
spinner.innerHTML = `<div class="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>`;
document.body.appendChild(spinner);
spinner.style.display = "flex";

// Fetch plants data
async function fetchPlants() {
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    allPlants = data.plants;
    displayCategories(allPlants);
    displayTrees(allPlants);
  } catch (error) {
    console.error("Error fetching plants:", error);
  } finally {
    spinner.style.display = "none";
  }
}

// Display categories
function displayCategories(plants) {
  const categories = [...new Set(plants.map(p => p.category))];

  categories.forEach(cat => {
    const li = document.createElement("li");
    li.textContent = cat;
    li.className =
      "px-2 py-2 rounded-lg cursor-pointer text-gray-800 hover:bg-[#54caf2] transition text-left";
    li.onclick = () => {
      setActiveCategory(li);
      filterByCategory(cat);
    };
    categoriesList.appendChild(li);
  });
}

// Active button highlight
function setActiveCategory(selectedEl) {
  const allButtons = document.querySelectorAll("#categories-list li");
  allButtons.forEach(btn => {
    btn.className =
      "px-2 py-2 rounded-lg cursor-pointer text-gray-800 hover:bg-[#54caf2] transition text-left";
  });

  selectedEl.className =
    "px-2 py-2 rounded-lg cursor-pointer text-white bg-[#15803d] transition text-left";
}

// Display trees
function displayTrees(plants) {
  treesContainer.innerHTML = "";

  plants.forEach(tree => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-lg shadow-md p-4 flex flex-col hover:shadow-lg hover:scale-[1.03] transition-transform cursor-pointer w-full h-auto";

    card.innerHTML = `
      <img src="${tree.image}" alt="${tree.name}" class="w-full h-32 object-cover rounded-md mb-4">
      <h4 class="text-lg font-semibold text-[#1f2937] mb-2 tree-name">${tree.name}</h4>
      <p class="text-gray-700 text-sm flex-grow mb-4 line-clamp-3">${tree.description}</p>

      <div class="flex items-center justify-between mb-2">
        <span class="px-2 py-1 text-sm font-medium text-[#2b803d] bg-[#dcfce7] rounded-md">
          ${tree.category}
        </span>
        <span class="font-bold text-[#1f2937]">৳ ${tree.price}</span>
      </div>

      <button class="w-full bg-[#2b803d] text-white py-2 rounded-full font-medium hover:bg-[#246a33] transition add-to-cart-btn">
          Add to Cart
      </button>
    `;
    treesContainer.appendChild(card);

    const treeNameEl = card.querySelector(".tree-name");
    treeNameEl.addEventListener("click", () => openTreeModal(tree));

    const addBtn = card.querySelector(".add-to-cart-btn");
    addBtn.addEventListener("click", () => addToCart(tree));
  });
}

// Open modal
function openTreeModal(tree) {
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `
    <div class="flex flex-col gap-4">
      <img src="${tree.image}" alt="${tree.name}" class="w-full h-64 object-cover rounded-md">
      <h2 class="text-2xl font-semibold text-[#15803d]">${tree.name}</h2>
      <p><strong>Category:</strong> ${tree.category}</p>
      <p><strong>Price:</strong> ৳ ${tree.price}</p>
      <p class="text-gray-700">${tree.description}</p>
    </div>
  `;
  document.getElementById("tree-modal-toggle").checked = true;
}

// Filter by category
function filterByCategory(category) {
  const filtered = allPlants.filter(p => p.category === category);
  displayTrees(filtered);
}

// Show all trees
function loadAllTrees() {
  displayTrees(allPlants);
}

// Add to cart (same row, increase quantity)
function addToCart(tree) {
  // check if tree already in cart
  const existing = cart.find(item => item.id === tree.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...tree, quantity: 1 });
  }
  renderCart();
}

// Remove from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

// Render cart (same row, quantity increases)
function renderCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((tree, index) => {
    const itemTotal = tree.price * tree.quantity;
    total += itemTotal;

    // check if row exists for this item
    const existingRow = document.getElementById(`cart-item-${tree.id}`);
    if (existingRow) {
      existingRow.querySelector(".item-quantity").textContent = `x${tree.quantity}`;
      existingRow.querySelector(".item-price").textContent = `৳ ${itemTotal}`;
    } else {
      const item = document.createElement("div");
      item.className = "flex justify-between items-center p-2 border rounded-md";
      item.id = `cart-item-${tree.id}`;
      item.innerHTML = `
        <span>${tree.name} <span class="item-quantity">x${tree.quantity}</span></span>
        <div class="flex items-center gap-2">
          <span class="item-price">৳ ${itemTotal}</span>
          <button class="text-red-500 font-bold" onclick="removeFromCart(${index})">❌</button>
        </div>
      `;
      cartItemsContainer.appendChild(item);
    }
  });

  cartTotalEl.textContent = `৳ ${total}`;
}

// Initialize
fetchPlants();
