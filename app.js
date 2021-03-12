const furniture = new Furniture();
const ui = new UI();

const homepageBtn = document.querySelector(".fa-home");
const shoppingCartIcon = document.querySelector(".fa-shopping-cart");
const counter = document.querySelector(".counter");
const addTobagBar = document.querySelector(".addTobagBar");
const remove = document.querySelector(".remove");
const quanUp = document.querySelector(".fa-chevron-up");
const quanDown = document.querySelector(".fa-chevron-down");
const quantity = document.querySelector(".quantity");
const clearBtn = document.querySelector(".clearBtn");
const cartCloseIcon = document.querySelector(".fa-window-close");
const productsCon = document.querySelector(".productsCon");
const shoppingCartPage = document.querySelector(".shoppingCart");
const singleProCon = document.querySelector(".singleProCon");
const allCartItemsCon = document.querySelector(".allCartItemsCon");
const totalText = document.querySelector(".totalText");
const itemQuan = document.querySelector(".item-quantity");
const searchInput = document.querySelector(".search-input");
const dropdownMenu = document.querySelector(".dropdown-menu");
const searchResult = document.querySelector(".search-result");
const resultNum = document.querySelector(".search-result span");
const xBtn = document.querySelector(".x-btn");

homepageBtn.addEventListener("click", (e) => {
  location.assign("homepage.html");
});

let data = [];
let itmesInCart = [];

const Product = function (id, title, price, image, quan) {
  this.id = id;
  this.title = title;
  this.price = price;
  this.image = image;
  this.quan = quan;
};

function loadAllEventListeners() {
  document.addEventListener("DOMContentLoaded", getFurnitureAndAppend);
  productsCon.addEventListener("click", addItemToBag);

  shoppingCartPage.addEventListener("click", manipulateItems);

  shoppingCartIcon.addEventListener("click", ui.showShoppingCart);

  searchInput.addEventListener("input", debounce(handleMenuDisplay, 500));

  xBtn.addEventListener("click", hideMenu);

  document.addEventListener("click", unfocusMenu);
}

loadAllEventListeners();

function debounce(fn, delay = 1000) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

function unfocusMenu(e) {
  if (
    !e.target.classList.contains("dropdown-menu") ||
    !e.target.classList.contains("icon-searchField")
  ) {
    dropdownMenu.style.display = "none";
  }
}

async function hideMenu() {
  dropdownMenu.style.display = "none";
  xBtn.style.display = "none";
  searchInput.value = "";

  const response = await fetch("products.json");
  const data = await response.json();

  ui.updateAndAppendData(data);

  searchResult.style.display = "none";
}

function handleDisplay(inputValue) {
  if (inputValue) {
    // show x btn
    xBtn.style.display = "block";
  } else {
    xBtn.style.display = "none";
  }

  // show dropdown menu
  dropdownMenu.style.display = "flex";

  // show search results
  searchResult.style.display = "block";
}

async function handleMenuDisplay() {
  const inputValue = searchInput.value;
  const response = await fetch("products.json");
  const data = await response.json();

  // btn, dropdown menu, and results display
  handleDisplay(inputValue);

  // find search items
  const items = data.items.filter((item) =>
    item.fields.title.includes(inputValue)
  );

  resultNum.textContent = items.length;

  // clear the field before rendering
  dropdownMenu.innerHTML = "";
  productsCon.innerHTML = "";

  // render the items on menu
  renderMenuItems(items);

  // products on main container
  ui.updateAndAppendData(items);

  // add click event for each item
  showSelectedItem(items, data);

  updateItemQuan(data.items.length);
}

function renderMenuItems(items) {
  items.forEach((item) => {
    const menuItem = document.createElement("div");
    menuItem.className = "menu-item";
    menuItem.id = item.sys.id;

    menuItem.innerHTML = `
      <img src="${item.fields.image.fields.file.url}" alt="product image" class="item-image"/>
      <span class="item-name">${item.fields.title}</span>
      <span class="item-price">$${item.fields.price}</span>
  `;

    dropdownMenu.appendChild(menuItem);
  });
}

function showSelectedItem(items, data) {
  const allMenuItems = document.querySelectorAll(".menu-item");

  allMenuItems.forEach((menuItem) => {
    menuItem.addEventListener("click", (e) => {
      let target;

      if (
        e.target.classList.contains("item-name") ||
        e.target.classList.contains("item-price") ||
        e.target.classList.contains("item-image")
      ) {
        target = e.target.parentElement;
      } else {
        target = e.target;
      }

      const filteredItems = items.filter((item) => {
        return item.sys.id === target.getAttribute("id");
      });

      ui.updateAndAppendData(filteredItems);
      updateItemQuan(data.items.length);
      dropdownMenu.style.display = "none";
      resultNum.textContent = 1;
    });
  });
}

function getFurnitureAndAppend() {
  furniture
    .getFurnitureInfo()
    .then((fData) => {
      // update data
      ui.updateAndAppendData(fData);
    })
    .then(() => {
      // disable and enable bag bar
      ui.disableBagBarForCartItem(itmesInCart, data);
    })
    .catch((err) => console.log(err));

  // update Item Data Based on LS
  itmesInCart = JSON.parse(localStorage.getItem("Cart Items"));
}

function updateItemQuan(quan) {
  itemQuan.textContent = quan;
}

function addItemToBag(e) {
  const addTobagBar = e.target;
  if (addTobagBar.classList.contains("addTobagBar")) {
    ui.addItemToShoppingCart(addTobagBar);
  }
}

function manipulateItems(e) {
  if (e.target.classList.contains("fa-window-close")) {
    ui.hideShoppingCart();
  }
  if (e.target.classList.contains("remove")) {
    ui.removeCartItem(e);
  }

  if (e.target.classList.contains("fa-chevron-up")) {
    ui.increaseQuan(e);
    ui.updateTotal();
  }

  if (e.target.classList.contains("fa-chevron-down")) {
    ui.decreaseQuan(e);
    ui.updateTotal();
  }

  if (e.target.classList.contains("clearBtn")) {
    ui.clearCart();
    ui.updateTotal();
  }
}
