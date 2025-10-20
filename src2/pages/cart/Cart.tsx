import { useContext, useEffect } from "react";
import supabase from "../../utils/supabase";
import { Link } from "react-router";
import type { ICart } from "../../interfaces/ICart";
import { mainContext } from "../../context/MainProvider";
import type { IUser } from "../../interfaces/IUser";
import { getCart_V2 } from "../../functions/getCart_v2";

interface ICartProps {
  user: IUser;
  cart: ICart[];
  setCart: React.Dispatch<React.SetStateAction<ICart[] | unknown>>;
}

export default function Cart() {
  // ! NEW
  const { user, cart, setCart } = useContext(mainContext) as ICartProps;

  console.log(user);

  useEffect(() => {
    const fetchCart = async () => {
      const result = await getCart_V2(user.id);
      setCart(result);
    };
    fetchCart();
  }, []);

  // ! JUST TO KNOW ALS WIEDERHOLUNG VON ARRAY METHODEN
  const total = cart.reduce((sum, { products, quantity }) => {
    return sum + (products?.price ?? 0) * (quantity ?? 0);
  }, 0);

  const removeItem = async (product_id: number) => {
    await supabase.from("cart_items").delete().eq("id", product_id);
    const updatedCart = await getCart_V2(user.id);
    setCart(updatedCart as ICart[]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
          Your Cart
        </h2>

        {cart.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="mb-4">Your cart is currently empty.</p>
            <Link
              to="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            >
              Go Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((cartItem: ICart) => (
                <div
                  key={cartItem.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex justify-between items-center hover:shadow-lg transition-all duration-200"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {cartItem?.products.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Price:
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        ${cartItem?.products.price}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Quantity:
                      <span className="font-medium">{cartItem?.quantity}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(cartItem.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 px-3 rounded-lg transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow p-5 text-center">
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Total:{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  ${total.toFixed(2)}
                </span>
              </p>
              <Link
                to="/"
                className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
