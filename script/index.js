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
    displayTrees(allPlants); // show all trees on page load
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
      "bg-white rounded-lg shadow-md p-4 flex flex-col hover:shadow-lg hover:scale-[1.02] transition-transform cursor-pointer";

    card.innerHTML = `
      <img src="${tree.image}" alt="${tree.name}" class="w-full h-40 object-cover rounded-md mb-4">
      <h4 class="text-lg font-semibold text-[#1f2937] mb-2 tree-name">${tree.name}</h4>
      <p class="text-gray-700 text-sm flex-grow mb-4">${tree.description.slice(0, 80)}...</p>

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

    // Tree name click -> modal
    const treeNameEl = card.querySelector(".tree-name");
    treeNameEl.addEventListener("click", () => openTreeModal(tree));

    // Add to cart button
    const addBtn = card.querySelector(".add-to-cart-btn");
    addBtn.addEventListener("click", () => addToCart(tree));
  });
}

// Open modal
function openTreeModal(tree) {
  const modal = document.getElementById("tree-modal");
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

  // Show modal
  modal.classList.remove("hidden");

  // Close modal on ✖ click
  document.getElementById("close-modal").onclick = () => {
    modal.classList.add("hidden");
  };

  // Close modal on clicking outside modal content
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  };
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

// Add to cart
function addToCart(tree) {
  cart.push(tree);
  renderCart();
}

// Remove from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

// Render cart
function renderCart() {
  cartItemsContainer.innerHTML = "";

  let total = 0;
  cart.forEach((tree, index) => {
    total += tree.price;
    const item = document.createElement("div");
    item.className = "flex justify-between items-center p-2 border rounded-md";
    item.innerHTML = `
      <span>${tree.name}</span>
      <div class="flex items-center gap-2">
        <span>৳ ${tree.price}</span>
        <button class="text-red-500 font-bold" onclick="removeFromCart(${index})">❌</button>
      </div>
    `;
    cartItemsContainer.appendChild(item);
  });

  cartTotalEl.textContent = `৳ ${total}`;
}

// Initialize
fetchPlants();
