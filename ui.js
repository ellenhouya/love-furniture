class UI {
  constructor() {
    this.itemsInCart = [];
  }
  updateAndAppendData(fData) {
    // update data
    let output = "";

    let dataArr = fData.items ? fData.items : fData;

    dataArr.forEach((eachFurnitur) => {
      let eachItem = eachFurnitur.fields;
      let id = data.length === 0 ? 0 : data.length;
      let title = eachItem.title;
      let price = eachItem.price;
      let image = eachItem.image.fields.file.url;

      const newItem = new Product(id, title, price, image, 1);

      data.push(newItem);

      // append new item
      output += `
        <div class="singlePro">
        <div class="forHover hoverID-${id}">
          <div class="addTobagBar bagBarID-${id}">
            <i class="fas fa-cart-plus"></i>
            ADD TO BAG
          </div>
        </div>
        <img src=${image} class="image" />
        <div class="nameAndPrice">
          <div class="name">${title}</div>
          <div class="price">$${price}</div>
        </div>
      </div>
        
        `;

      productsCon.innerHTML = output;
    });

    updateItemQuan(dataArr.length);
  }

  addItemToShoppingCart(addTobagBarTarget) {
    // show shopping cart
    this.showShoppingCart();

    // change innerText
    this.changeAddToBagText(addTobagBarTarget);

    //avoid adding the same item
    addTobagBarTarget.style.pointerEvents = "none";

    // append item in shoppingCart and in shoppingCart data (itemsInCart)
    this.appendItemInCart(addTobagBarTarget);

    // updateTotal
    this.updateTotal();
  }

  showShoppingCart() {
    shoppingCartPage.classList.add("visible");
    shoppingCartPage.style.animation = "none";
  }

  hideShoppingCart() {
    shoppingCartPage.classList.remove("visible");
    shoppingCartPage.style.animation = "rightAnim 1s linear";
  }

  changeAddToBagText(addTobagBarTarget) {
    addTobagBarTarget.innerText = "In Cart";
  }

  appendItemInCart(addTobagBarTarget) {
    let id = addTobagBarTarget.classList[1].split("-")[1];

    let image = addTobagBarTarget.parentElement.nextElementSibling.getAttribute(
      "src"
    );
    let name =
      addTobagBarTarget.parentElement.nextElementSibling.nextElementSibling
        .firstElementChild;

    let price = name.nextElementSibling;

    ui.appendItemsForCartAndLS(
      image,
      id,
      name.textContent,
      price.textContent,
      1
    );

    // append item to shopping cart data

    this.itemsInCart.push(
      new Product(id, name.textContent, price.textContent, image, 1)
    );

    //save to ls
    localStorage.setItem("Cart Items", JSON.stringify(this.itemsInCart));
  }

  appendItemsForCartAndLS(image, id, name, price, quan) {
    const div = document.createElement("div");
    div.className = "singleProCon";
    div.innerHTML = `
    <img src="${image}" class="cartImg cartImgID-${id}" />
    <div class="infoCon">
      <p class="cartItemName">${name}</p>
      <p class="cartItemPrice">${price}</p>
      <p class="remove removeID-${id}">remove</p>
    </div>
    <div class="arrowsAndQuan">
      <i class="fas fa-chevron-up upID-${id}"></i>
      <p class="quantity">${quan}</p>
      <i class="fas fa-chevron-down downID-${id}"></i>
    </div>
    `;
    allCartItemsCon.appendChild(div);
  }

  updateTotal() {
    let cartItemPrice = Array.from(document.querySelectorAll(".cartItemPrice"));

    let totalPrice = 0;
    let quan = 0;
    cartItemPrice.map((eachCarItemPrice) => {
      const priceNumber = parseFloat(
        eachCarItemPrice.textContent.replace("$", "")
      );
      const quantity = parseInt(
        eachCarItemPrice.parentElement.nextElementSibling.children[1]
          .textContent
      );

      totalPrice += priceNumber * quantity;
      quan += quantity;
    });
    totalText.innerText = totalPrice.toFixed(2);
    // update counter
    counter.innerText = quan;
  }

  removeCartItem(e) {
    // remove from DOM
    e.target.parentElement.parentElement.remove();
    this.updateTotal();

    // remove from cartItem Data
    let targetID = e.target.classList[1].split("-")[1];

    this.itemsInCart.forEach((item, index) => {
      if (item.id == targetID) {
        this.itemsInCart.splice(index, 1);
      }
    });

    // enable addBagBar
    this.enableBagBar(targetID);
  }

  enableBagBar(targetID) {
    const alladdToBagBar = Array.from(
      document.querySelectorAll(".addTobagBar")
    );

    alladdToBagBar.forEach((eachBagBar) => {
      if (!targetID) {
        eachBagBar.textContent = "ADD TO BAG";
        eachBagBar.style.pointerEvents = "auto";
      } else {
        const bagBarID = eachBagBar
          .getAttribute("class")
          .split(" ")[1]
          .split("-")[1];
        if (bagBarID === targetID) {
          eachBagBar.textContent = "ADD TO BAG";
          eachBagBar.style.pointerEvents = "auto";
        }
      }
    });
  }

  increaseQuan(e) {
    e.target.nextElementSibling.textContent++;

    // increase quan of items in data (itmesInCart)
    this.adjustDataCartItemAmt(e.target, e.target.nextElementSibling);
  }

  adjustDataCartItemAmt(target, Selector) {
    // increase quan of items in data (itmesInCart)
    const targetID = target.getAttribute("class").split(" ")[2].split("-")[1];

    this.itemsInCart.forEach((item) => {
      if (item.id === targetID) {
        item.quan = parseInt(Selector.textContent);
      }
    });
  }

  decreaseQuan(e) {
    let lowerAmt = e.target.previousElementSibling;
    lowerAmt.textContent--;

    if (lowerAmt.textContent < 1) {
      lowerAmt.parentElement.parentElement.remove();
      // update cart item data
      this.itemsInCart.forEach((item, index) => {
        const targetID = e.target
          .getAttribute("class")
          .split(" ")[2]
          .split("-")[1];
        if (item.id === targetID) this.itemsInCart.splice(index, 1);
      });

      //enable bag bar
      const targetID = e.target
        .getAttribute("class")
        .split(" ")[2]
        .split("-")[1];

      this.enableBagBar(targetID);
    }

    // decrease quan of items in data (itemsInCart)
    this.adjustDataCartItemAmt(e.target, e.target.previousElementSibling);
  }

  clearCart() {
    allCartItemsCon.innerHTML = "";
    this.enableBagBar();
    // clear items in data (itemsInCart)
    itmesInCart.length = 0;
  }

  disableBagBarForCartItem(data) {
    this.itemsInCart.forEach((eachCartItem, index) => {
      data.forEach((eachData, index) => {
        if (eachCartItem.id == eachData.id) {
          document.querySelector(
            `.bagBarID-${eachCartItem.id}`
          ).style.pointerEvents = "none";

          document.querySelector(`.bagBarID-${eachCartItem.id}`).textContent =
            "In Cart";
        }
      });
    });
  }
}
