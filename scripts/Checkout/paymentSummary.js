import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";

export function renderPaymentSummary() {
  console.log("Payload");

  cart.forEach((cartItem) => {
    let productPriceCents = 0;

    const product = getProduct(cartItem.productId);

    productPriceCents = product.priceCents * cartItem.quantity;
  });
}
