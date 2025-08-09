import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { addCart, delCart } from "../redux/action";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const addItem = useCallback(
    (product) => {
      dispatch(addCart(product));
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (product) => {
      dispatch(delCart(product));
    },
    [dispatch]
  );

  return (
    <div key={item.id} className="mb-3">
      <div className="row align-items-center">
        <div className="col-lg-3 col-md-4 col-5">
          <div className="bg-light rounded p-2 d-flex justify-content-center align-items-center">
            <img
              src={item.image}
              alt={item.title}
              width={100}
              height={75}
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        <div className="col-lg-5 col-md-4 col-7">
          <p className="mb-1 fw-semibold" style={{ fontSize: "1.05rem" }}>
            {item.title}
          </p>
          {item.selectedVariant && (
            <p
              className="mb-0 text-secondary fst-italic"
              style={{ fontSize: "0.9rem" }}
            >
              Variant: <span className="text-dark">{item.selectedVariant}</span>
            </p>
          )}
        </div>

        <div className="col-lg-4 col-md-4 d-flex flex-column align-items-center align-items-md-end">
          <div className="d-flex align-items-center mb-3">
            <button
              className="btn btn-outline-secondary btn-sm px-3"
              onClick={() => removeItem(item)}
              aria-label="Remove one item"
            >
              <i className="fas fa-minus"></i>
            </button>

            <p
              className="mx-3 mb-0 fs-5 fw-bold"
              style={{ minWidth: "2rem", textAlign: "center" }}
            >
              {item.qty}
            </p>

            <button
              className="btn btn-outline-secondary btn-sm px-3"
              onClick={() => addItem(item)}
              aria-label="Add one item"
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>

          <p className="mb-0 fw-semibold" style={{ fontSize: "1.1rem" }}>
            ${(item.qty * item.price).toFixed(2)}
          </p>
        </div>
      </div>

      <hr className="my-3" />
    </div>
  );
};

export default CartItem;
