import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
  updateDeliveryOption,
} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./Utils/money.js";

import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { deliveryOptions } from "../data/delivery.js";

//hello();

// const today = dayjs();

//const deliveryDate = today.add(7, "days");
//console.log(deliveryDate.format("dddd, MMMM D"));

let cartSummaryHTML = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  const deliveryOptionId = cartItem.deliveryOptionId;
  let deliveryOption;
  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  const today = dayjs();

  const deliveryDate = today.add(deliveryOption.deliveryDays, "days");

  const dateString = deliveryDate.format("dddd, MMMM D");

  cartSummaryHTML += `    
  <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">Delivery date: ${dateString}</div>

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
            ${deliveryOptionsHtml(matchingProduct, cartItem)}
          </div>
        </div>
      </div>`;
});

function deliveryOptionsHtml(matchingProduct, cartItem) {
  let html = "";

  deliveryOptions.forEach((deliveryoption) => {
    const today = dayjs();

    const deliveryDate = today.add(deliveryoption.deliveryDays, "days");

    const dateString = deliveryDate.format("dddd, MMMM D");

    const priceString =
      deliveryoption.priceCents === 0
        ? "FREE"
        : `${formatCurrency(deliveryoption.priceCents)} -`;

    const isChecked = deliveryoption.id === cartItem.deliveryOptionId;

    html += `<div class="delivery-option js-delivery-option"
            data-product-id="${matchingProduct.id}"
            data-delivery-option-id="${deliveryoption.id}">
        <input
        type="radio"
        ${isChecked ? "checked" : ""}
        class="delivery-option-input"
        name="delivery-option-${matchingProduct.id}"
        />
        <div>
        <div class="delivery-option-date">${dateString}</div>
        <div class="delivery-option-price">$${priceString} - Shipping</div>
        </div>
        </div>`;
  });
  return html;
}

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
    //container.classList.add("is-editing-quantity");

    container.remove();
  });
});

document.querySelectorAll(".js-delivery-option").forEach((element) => {
  element.addEventListener("click", () => {
    const productId = element.dataset.productId;
    const deliveryOptionId = element.dataset.deliveryOptionId;
    updateDeliveryOption(productId, deliveryOptionId);
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
