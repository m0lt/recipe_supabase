import { createContext, useEffect, useState } from "react";
import type { IProduct } from "../interfaces/IProduct";
import { getProduct_store } from "../functions/getProducts";
import {
  getCart,
  getCategory,
  getProductANDCategory,
} from "../functions/getProducts_v2";
import type { ICart } from "../interfaces/ICart";
import type { IUser } from "../interfaces/IUser";
import supabase from "../utils/supabase";

export interface mainContextProps {
  products: IProduct[];
  cart: ICart[] | null | undefined | unknown;
  setCart: React.Dispatch<React.SetStateAction<ICart[] | null | unknown>>;

  // ! NEW
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

export const mainContext = createContext<mainContextProps | null>(null);

export default function MainProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [cart, setCart] = useState<ICart[] | null | unknown>([]);

  // ! NEW
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData_In_useEffect = async () => {
      const products_Variable_von_der_function = await getProduct_store();
      await getProductANDCategory();
      await getCart();
      await getCategory();
      // const products_category_von_der_function = await getProductANDCategory();
      // console.log(products_category_von_der_function);

      setProducts(products_Variable_von_der_function);
    };
    getData_In_useEffect();
  }, []);

  useEffect(() => {
    // ! wir holen einmalig den gespeicherten Zustand (z.B beim Reload) oder einlogen
    // supabase prüft ob im Browser eine gültige Session gespeichert ist,
    // wenn ja => liefert sie den eingeloggte User zurück
    // wenn nein => User = null

    const checkSession = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      console.log(data);
      const session = data?.session;
      if (session?.user) {
        setUser(session?.user as unknown as IUser);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setLoading(false);
    };
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // console.log(_event);
      // console.log(session);
      setUser((session?.user as unknown as IUser) || null);
      setIsLoggedIn(!!session?.user);
      setLoading(false);
    });
    // console.log(subscription);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkSession();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <mainContext.Provider
      value={{
        products,
        cart,
        setCart,
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        loading,
      }}
    >
      {children}
    </mainContext.Provider>
  );
}
