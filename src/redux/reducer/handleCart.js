// Retrieve initial state from localStorage if available
const getInitialCart = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
};

const handleCart = (state = getInitialCart(), action) => {
  const product = action.payload;
  let updatedCart;

  switch (action.type) {
    case "ADDITEM":
      // Check if product with the same variant already exists in the cart
      const exist = state.find(
        (x) =>
          x.id === product.id && x.selectedVariant === product.selectedVariant
      );

      if (exist) {
        // Increase quantity of that specific item
        updatedCart = state.map((x) =>
          x.id === product.id && x.selectedVariant === product.selectedVariant
            ? { ...x, qty: x.qty + 1 }
            : x
        );
      } else {
        // Add new item with qty = 1
        updatedCart = [...state, { ...product, qty: 1 }];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;

    case "DELITEM":
      const exist2 = state.find(
        (x) =>
          x.id === product.id && x.selectedVariant === product.selectedVariant
      );

      if (!exist2) return state;

      if (exist2.qty === 1) {
        updatedCart = state.filter(
          (x) =>
            !(
              x.id === product.id &&
              x.selectedVariant === product.selectedVariant
            )
        );
      } else {
        updatedCart = state.map((x) =>
          x.id === product.id && x.selectedVariant === product.selectedVariant
            ? { ...x, qty: x.qty - 1 }
            : x
        );
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;

    default:
      return state;
  }
};

export default handleCart;
