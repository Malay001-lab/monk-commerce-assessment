import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, ChevronDown, ChevronUp, Edit2 } from "lucide-react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import styles from "./ProductList.module.css";
import { ACTIONS } from "../../hooks/useProductsReducer";
import VariantItem from "./VariantItem";

const ProductItem = ({ product, index, dispatch, totalItems }) => {
  const [showVariants, setShowVariants] = useState(false);
  const [isDiscountActive, setDiscountActive] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: product.id,
    data: { type: "PRODUCT", index },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative",
    zIndex: isDragging ? 999 : "auto",
  };

  const handleRemove = () => {
    dispatch({ type: ACTIONS.REMOVE_PRODUCT, payload: { index } });
  };

  const handleEdit = () => {
    dispatch({ type: ACTIONS.OPEN_PICKER, payload: { index } });
  };

  const handleDiscountChange = (field, val) => {
    dispatch({
      type: ACTIONS.UPDATE_PRODUCT_DISCOUNT,
      payload: { index, field, value: val },
    });
  };
  const productImage =
    product.image?.src ||
    product.images?.[0]?.src ||
    product.variants?.find((v) => v.image?.src)?.image?.src;

  const hasVariants = product.variants && product.variants.length > 1;

  return (
    <div ref={setNodeRef} style={style} className={styles.productRowWrapper}>
      <div className={styles.productRow}>
        <div className={styles.dragHandle} {...attributes} {...listeners}>
          <GripVertical size={20} color="#999" />
        </div>

        <div className={styles.index}>{index + 1}.</div>

        <div className={styles.productInfo}>
          <div className={styles.inputGroup}>
            {productImage && (
              <img
                src={productImage}
                alt={product.title}
                className={styles.productImage}
              />
            )}

            <input
              type="text"
              value={product.title}
              readOnly
              className={styles.inputTitle}
            />
            <button className={styles.editBtn} onClick={handleEdit}>
              <Edit2 size={16} />
            </button>
          </div>
          {hasVariants && (
            <div className={styles.variantToggle}>
              <button
                onClick={() => setShowVariants(!showVariants)}
                className={styles.linkBtn}
              >
                {showVariants ? (
                  <>
                    Hide Variants <ChevronUp size={16} />
                  </>
                ) : (
                  <>
                    Show Variants <ChevronDown size={16} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className={styles.discountSection}>
          {/* Discount Logic: 
              1. Show button if no discount active/value. 
              2. Button click -> show inputs, hide button.
              3. Supports empty products (placeholder).
          */}
          {!(isDiscountActive || product.discount?.value > 0) && (
            <button
              className={styles.btnAddDiscount}
              onClick={() => setDiscountActive(true)}
            >
              Add Discount
            </button>
          )}

          {(isDiscountActive || product.discount?.value > 0) && (
            <div className={styles.discountInputs}>
              <input
                className={styles.discountVal}
                type="number"
                value={
                  product.discount?.value === 0 ? "" : product.discount?.value
                }
                placeholder="0"
                onChange={(e) => {
                  const val = e.target.value;
                  handleDiscountChange(
                    "value",
                    val === "" ? 0 : parseFloat(val)
                  );
                }}
              />
              <select
                className={styles.discountType}
                value={product.discount?.type || "flat"}
                onChange={(e) => handleDiscountChange("type", e.target.value)}
              >
                <option value="flat">Flat</option>
                <option value="percent">%</option>
              </select>
            </div>
          )}

          {totalItems > 1 && (
            <button className={styles.removeBtn} onClick={handleRemove}>
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {showVariants && hasVariants && (
        <div className={styles.variantsList}>
          <SortableContext
            items={product.variants.map((v) => `var-${v.id}`)}
            strategy={verticalListSortingStrategy}
          >
            {product.variants.map((variant, vIndex) => (
              <VariantItem
                key={variant.id}
                variant={variant}
                productIndex={index}
                variantIndex={vIndex}
                dispatch={dispatch}
              />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
};
export default ProductItem;
