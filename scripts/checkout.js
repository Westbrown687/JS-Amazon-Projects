import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./Utils/money.js";
import { hello } from "https://unpkg.com/supersimpledev@1.0.1/hello.esm.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

hello();

const today = dayjs();

const deliveryDate = today.add(7, "days");
console.log(deliveryDate.format("dddd, MMMM D"));

let cartSummaryHTML = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  //console.log(matchingProduct);

  cartSummaryHTML += `    
  <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">Delivery date: Tuesday, June 21</div>

        <div class="cart-item-details-grid">
          <img
            class="product-image"
            src="${matchingProduct.image}"
          />

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">$${formatCurrency(
              matchingProduct.priceCents
            )}</div>
            <div class="product-quantity">
              <span> Quantity: <span class="quantity-label js-quantity-label-${
                matchingProduct.id
              }">${cartItem.quantity}</span> </span>
              <span data-update-id="${
                matchingProduct.id
              }"class="update-quantity-link link-primary js-cart-update ">
                Update
              </span>
              <input class='quantity-link js-quantity-input-${
                matchingProduct.id
              }'>
              <span data-product-id="${
                matchingProduct.id
              }" class="save-quality-link link-primary js-save-link">Save</span>
              <span data-product-id="${
                matchingProduct.id
              }" class="delete-quantity-link link-primary js-delete-link">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            <div class="delivery-option">
              <input
                type="radio"
                checked
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}"
              />
              <div>
                <div class="delivery-option-date">Tuesday, June 21</div>
                <div class="delivery-option-price">FREE Shipping</div>
              </div>
            </div>
            <div class="delivery-option">
              <input
                type="radio"
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}"
              />
              <div>
                <div class="delivery-option-date">Wednesday, June 15</div>
                <div class="delivery-option-price">$4.99 - Shipping</div>
              </div>
            </div>
            <div class="delivery-option">
              <input
                type="radio"
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}"
              />
              <div>
                <div class="delivery-option-date">Monday, June 13</div>
                <div class="delivery-option-price">$9.99 - Shipping</div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
});

document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

//console.log(cartSummaryHTML);

document.querySelectorAll(".js-delete-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);

    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );

    //console.log(container);
    container.classList.add("is-editing-quantity");

    // container.remove()
  });
});

function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();

  document.querySelector(
    ".js-return-to-home-link"
  ).innerHTML = `${cartQuantity} items`;
}

updateCartQuantity();

document.querySelectorAll(".js-cart-update").forEach((update) => {
  update.addEventListener("click", () => {
    const updateId = update.dataset.updateId;

    const container = document.querySelector(
      `.js-cart-item-container-${updateId}`
    );
    container.classList.add("is-editing-quantity");

    //console.log(updateId)
  });
});

document.querySelectorAll(".js-save-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;

    //console.log(productId);

    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.classList.remove("is-editing-quantity");

    const quantityInput = document.querySelector(
      `.js-quantity-input-${productId}`
    );
    const newQuantity = Number(quantityInput.value);

    updateQuantity(productId, newQuantity);

    const quantityLabel = document.querySelector(
      `.js-quantity-label-${productId}`
    );
    quantityLabel.innerHTML = newQuantity;

    updateCartQuantity();
  });
});
