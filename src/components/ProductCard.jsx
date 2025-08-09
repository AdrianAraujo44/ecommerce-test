import React, { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

const ProductCard = React.memo(({ product }) => {
  const dispatch = useDispatch();

  const initialVariant = useMemo(() => {
    return product.variants && product.variants.length > 0
      ? product.variants[0]
      : null;
  }, [product.variants]);

  const [selectedVariant, setSelectedVariant] = useState(initialVariant);

  const addProduct = useCallback(
    (productToAdd) => {
      dispatch(addCart(productToAdd));
    },
    [dispatch]
  );

  const handleAddToCart = useCallback(() => {
    const productWithVariant = {
      ...product,
      selectedVariant,
    };
    addProduct(productWithVariant);
    toast.success("Added to cart");
  }, [addProduct, product, selectedVariant]);

  const handleVariantChange = useCallback((e) => {
    setSelectedVariant(e.target.value);
  }, []);

  return (
    <div
      id={product.id}
      className="mb-4"
      style={{ width: "350px", minWidth: "350px" }}
    >
      <div className="card text-center h-100 shadow-sm border-0 product-card-hover">
        <Link to={`/product/${product.id}`}>
          <img
            className="card-img-top p-3"
            src={product.image}
            alt={product.title}
            style={{
              height: "300px",
              objectFit: "contain",
            }}
          />
        </Link>

        <div className="card-body d-flex flex-column">
          <h5 className="card-title fw-semibold">
            {product.title.length > 20
              ? product.title.substring(0, 20) + "..."
              : product.title}
          </h5>

          <p
            className="card-text text-muted mb-2"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "60px",
            }}
          >
            {product.description}
          </p>

          <ul className="list-group list-group-flush mb-3">
            <li className="list-group-item lead fw-bold">${product.price}</li>
          </ul>

          {product.variants?.length > 0 && product.inStock && (
            <div className="mb-3">
              <label htmlFor="variantSelect" className="form-label fw-semibold">
                Select Variant
              </label>
              <select
                className="form-select form-select-sm mb-3"
                value={selectedVariant}
                onChange={handleVariantChange}
              >
                {product.variants.map((variant, index) => (
                  <option key={index} value={variant}>
                    {variant}
                  </option>
                ))}
              </select>
            </div>
          )}

          {product.inStock ? (
            <button className="btn btn-dark mt-auto" onClick={handleAddToCart}>
              Add to Cart
            </button>
          ) : (
            <button className="btn btn-secondary mt-auto" disabled>
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
