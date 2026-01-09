import styles from "./AddProductButton.module.css";
import { ACTIONS } from "../../hooks/useProductsReducer";

export default function AddProductButton({ dispatch }) {
  const handleClick = () => {
    dispatch({ type: ACTIONS.ADD_EMPTY_PRODUCT });
  };

  return (
    <div className={styles.container}>
      <button onClick={handleClick} className={styles.button}>
        Add Product
      </button>
    </div>
  );
}
