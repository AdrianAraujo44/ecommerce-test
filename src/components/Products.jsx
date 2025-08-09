import React, { useState, useEffect, useCallback, useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import ProductCard from "./ProductCard";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let componentMounted = true;

    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products/");
      if (componentMounted) {
        let products = await response.clone().json();

        products = products.map((p) => ({
          ...p,
          inStock: Math.random() > 0.3,
          variants: ["Small", "Medium", "Large"],
        }));

        setData(products);
        setFilter(products);
        setLoading(false);
      }

      return () => {
        componentMounted = false;
      };
    };

    getProducts();

    return () => {
      componentMounted = false;
    };
  }, []);

  const Loading = useMemo(() => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        {[...Array(7)].map((_, idx) => (
          <div key={idx} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
            <Skeleton height={592} />
          </div>
        ))}
      </>
    );
  }, []);

  const filterProduct = useCallback(
    (cat) => {
      const updatedList = data.filter((item) => item.category === cat);
      setFilter(updatedList);
    },
    [data]
  );

  const ShowProducts = useMemo(() => {
    return (
      <>
        <div className="buttons text-center py-5">
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => setFilter(data)}
          >
            All
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("men's clothing")}
          >
            Men's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("women's clothing")}
          >
            Women's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("jewelery")}
          >
            Jewelery
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("electronics")}
          >
            Electronics
          </button>
        </div>

        {filter.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </>
    );
  }, [data, filter, filterProduct]);

  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products</h2>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? Loading : ShowProducts}
        </div>
      </div>
    </>
  );
};

export default Products;
