import { createContext, useEffect, useState } from "react";
import type { IProduct } from "../interfaces/IProduct";
import { getProduct_store } from "../functions/getProducts";
import {
  getCart,
  getCategory,
  getProductANDCategory,
} from "../functions/getProducts_v2";

export interface mainContextProps {
  products: IProduct[];
}

export const mainContext = createContext<mainContextProps | null>(null);

export default function MainProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const getData_In_useEffect = async () => {
      const products_Variable_von_der_function = await getProduct_store();
      await getProductANDCategory();
      await getCart();
      await getCategory();
      // const products_category_von_der_function = await getProductANDCategory();
      // console.log(products_category_von_der_function);
      console.log(products_Variable_von_der_function);
      setProducts(products_Variable_von_der_function);
    };
    getData_In_useEffect();
  }, []);

  return (
    <mainContext.Provider value={{ products }}>{children}</mainContext.Provider>
  );
}
