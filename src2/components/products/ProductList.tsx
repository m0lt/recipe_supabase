import { useContext } from "react";
import { mainContext, type mainContextProps } from "../../context/MainProvider";
import type { IProduct } from "../../interfaces/IProduct";
import ProductItem from "./ProductItem";

export default function ProductList() {
  const { products } = useContext(mainContext) as mainContextProps;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Products
        </h2>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product: IProduct) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
