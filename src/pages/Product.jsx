import React, { useEffect, useState, useCallback } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import toast from "react-hot-toast";

import { Footer, Navbar, ProductCard } from "../components";

const Loading = React.memo(() => (
  <div className="container my-5 py-2">
    <div className="row">
      <div className="col-md-6 py-3">
        <Skeleton height={400} width={400} />
      </div>
      <div className="col-md-6 py-5">
        <Skeleton height={30} width={250} />
        <Skeleton height={90} />
        <Skeleton height={40} width={70} />
        <Skeleton height={50} width={110} />
        <Skeleton height={120} />
        <Skeleton height={40} width={110} inline={true} />
        <Skeleton className="mx-3" height={40} width={110} />
      </div>
    </div>
  </div>
));

const Loading2 = React.memo(() => (
  <div className="my-4 py-4">
    <div className="d-flex">
      {[...Array(4)].map((_, i) => (
        <div className="mx-4" key={i}>
          <Skeleton height={400} width={250} />
        </div>
      ))}
    </div>
  </div>
));

const ShowProduct = React.memo(
  ({ product, selectedVariant, setSelectedVariant, addProduct }) => {
    const handleAddToCart = useCallback(() => {
      addProduct({ ...product, selectedVariant });
    }, [addProduct, product, selectedVariant]);

    if (!product) return null;

    return (
      <div className="container my-5 py-2">
        <div className="row">
          <div className="col-md-6 col-sm-12 py-3">
            <img
              className="img-fluid"
              src={product.image}
              alt={product.title}
              width="400px"
              height="400px"
            />
          </div>
          <div className="col-md-6 py-5">
            <h4 className="text-uppercase text-muted">{product.category}</h4>
            <h1 className="display-5">{product.title}</h1>
            <p className="lead">
              {product.rating && product.rating.rate}{" "}
              <i className="fa fa-star"></i>
            </p>
            <h3 className="display-6 my-4">${product.price}</h3>
            <p className="lead">{product.description}</p>

            {product.variants && product.variants.length > 0 && (
              <div className="mb-3">
                <label
                  htmlFor="variantSelect"
                  className="form-label fw-semibold"
                >
                  Select Variant
                </label>
                <select
                  id="variantSelect"
                  className="form-select"
                  value={selectedVariant}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                >
                  {product.variants.map((variant, index) => (
                    <option key={index} value={variant}>
                      {variant}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              className="btn btn-outline-dark me-3"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <Link to="/cart" className="btn btn-dark">
              Go to Cart
            </Link>
          </div>
        </div>
      </div>
    );
  }
);

const ShowSimilarProduct = React.memo(({ similarProducts }) => (
  <div className="py-4 my-4">
    <div className="d-flex flex-nowrap overflow-auto">
      {similarProducts.map((item) => (
        <ProductCard
          key={`${item.id}-${item.variants?.[0] ?? "default"}`}
          product={item}
        />
      ))}
    </div>
  </div>
));

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const dispatch = useDispatch();

  const addProduct = useCallback(
    (productToAdd) => {
      dispatch(addCart(productToAdd));
      toast.success("Added to cart");
    },
    [dispatch]
  );

  useEffect(() => {
    let isMounted = true;

    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);

      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      const data = await response.json();

      if (!isMounted) return;

      const productWithExtras = {
        ...data,
        variants: ["Small", "Medium", "Large"],
        inStock: Math.random() > 0.3,
      };
      setProduct(productWithExtras);
      setSelectedVariant(productWithExtras.variants[0] || null);
      setLoading(false);

      const response2 = await fetch(
        `https://fakestoreapi.com/products/category/${data.category}`
      );
      let data2 = await response2.json();

      data2 = data2.map((prod) => ({
        ...prod,
        variants: ["Small", "Medium", "Large"],
        inStock: Math.random() > 0.3,
      }));
      setSimilarProducts(data2);
      setLoading2(false);
    };

    getProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          {loading ? (
            <Loading />
          ) : (
            <ShowProduct
              product={product}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
              addProduct={addProduct}
            />
          )}
        </div>
        <div className="row my-5 py-5">
          <div className="d-none d-md-block">
            <h2>You may also Like</h2>
            <Marquee pauseOnHover pauseOnClick speed={50}>
              {loading2 ? (
                <Loading2 />
              ) : (
                <ShowSimilarProduct similarProducts={similarProducts} />
              )}
            </Marquee>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
