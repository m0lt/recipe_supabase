import { useNavigate } from "react-router";
import type { IProduct } from "../../interfaces/IProduct";
import { addCart } from "../../functions/addCart";
import { useContext } from "react";
import { mainContext } from "../../context/MainProvider";
import type { IUser } from "../../interfaces/IUser";

export default function ProductItem({ product }: { product: IProduct }) {
  const navigate = useNavigate();

  const { user } = useContext(mainContext) as { user: IUser };

  const handleToCart = async () => {
    if (!user) {
      console.error("User wurde nicht gefunden");
    } else {
      await addCart(user?.id, product.id);
      navigate("/cart");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col p-5">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          {product.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Price:{" "}
          <span className="font-medium text-gray-800 dark:text-gray-200">
            ${product.price}
          </span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Quality: <span className="font-medium">{product.quality}</span>
        </p>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Category:{" "}
          <span className="font-medium">{product.category.category_name}</span>
        </p>
      </div>

      <button
        onClick={handleToCart}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200"
      >
        Add to Cart
      </button>
    </div>
  );
}
