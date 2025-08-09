import React, { useMemo } from "react";
import { CartItem, Footer, Navbar } from "../components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const EmptyCart = React.memo(() => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 py-5 bg-light text-center">
          <h4 className="p-3 display-5"> Your Cart is Empty </h4>
          <Link to="/" className="btn btn-outline-dark mx-4">
            <i className="fa fa-arrow-left"></i> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
});

const ShowCart = React.memo(({ state }) => {
  const shipping = 30.0;

  const subtotal = useMemo(() => {
    return state.reduce((acc, item) => acc + item.price * item.qty, 0);
  }, [state]);

  const totalItems = useMemo(() => {
    return state.reduce((acc, item) => acc + item.qty, 0);
  }, [state]);

  const renderCartItems = useMemo(() => {
    return state.map((item) => (
      <CartItem
        item={item}
        key={`${item.id}-${item.selectedVariant ?? "default"}`}
      />
    ));
  }, [state]);

  return (
    <section className="h-100 gradient-custom">
      <div className="container py-5">
        <div className="row d-flex justify-content-center my-4">
          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-header py-3">
                <h5 className="mb-0">Item List</h5>
              </div>
              <div className="card-body">{renderCartItems}</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-header py-3 bg-light">
                <h5 className="mb-0">Order Summary</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                    Products ({totalItems})<span>${Math.round(subtotal)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    Shipping
                    <span>${shipping}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                    <div>
                      <strong>Total amount</strong>
                    </div>
                    <span>
                      <strong>${Math.round(subtotal + shipping)}</strong>
                    </span>
                  </li>
                </ul>

                <Link to="/checkout" className="btn btn-dark btn-lg btn-block">
                  Go to checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

const Cart = () => {
  const state = useSelector((state) => state.handleCart);

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Cart</h1>
        <hr />
        {state.length > 0 ? <ShowCart state={state} /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
