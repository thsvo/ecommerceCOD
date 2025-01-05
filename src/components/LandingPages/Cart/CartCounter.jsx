import { FaMinus, FaPlus } from "react-icons/fa";
import { toast } from "sonner";

const CartCounter = ({ count = 1, setCount }) => {
  const handleCount = (action) => {
    setCount((prev) => {
      const newValue =
        action === "increment" ? Number(prev) + 1 : Number(prev) - 1;
      if (newValue < 1) {
        toast.error("Count cannot be less than one");
        return prev;
      }
      return newValue;
    });
  };

  return (
    <div>
      <div className="flex items-center gap-3 border border-primaryLight rounded-xl p-1.5">
        <button
          className="cursor-pointer bg-primaryLight p-2 rounded text-xl"
          onClick={() => handleCount("decrement")}
        >
          <FaMinus />
        </button>
        <span className="text-base font-bold text-textColor">{count}</span>
        <button
          className="cursor-pointer bg-primaryLight p-2 rounded text-xl"
          onClick={() => handleCount("increment")}
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default CartCounter;
