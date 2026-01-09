import React, { useReducer } from "react";
import "./index.css";
import {
  productsReducer,
  INITIAL_STATE,
  ACTIONS,
} from "./hooks/useProductsReducer";
import ProductList from "./components/ProductList/ProductList";
import ProductPicker from "./components/ProductPicker/ProductPicker";
import AddProductButton from "./components/AddProductButton/AddProductButton";

function App() {
  const [state, dispatch] = useReducer(productsReducer, INITIAL_STATE);

  const handlePickerClose = () => {
    dispatch({ type: ACTIONS.CLOSE_PICKER });
  };

  const handlePickerSelect = (selectedProducts) => {
    dispatch({
      type: ACTIONS.REPLACE_PRODUCT,
      payload: { selectedProducts },
    });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Monk Upsell & Cross-sell</h1>
      </header>

      <main>
        <div className="section-title">Add Products</div>

        <ProductList items={state.items} dispatch={dispatch} />

        <AddProductButton dispatch={dispatch} />

        <ProductPicker
          isOpen={state.pickerState.isOpen}
          onClose={handlePickerClose}
          onSelect={handlePickerSelect}
        />
      </main>
    </div>
  );
}

export default App;
