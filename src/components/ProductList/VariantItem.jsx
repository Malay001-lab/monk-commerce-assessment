import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import styles from "./ProductList.module.css";

export default function VariantItem({
  variant,
  productIndex,
  variantIndex,
  dispatch,
}) {
  const uniqueId = `var-${variant.id}`;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: uniqueId,
    data: {
      type: "VARIANT",
      productId: variant.product_id,
      index: variantIndex,
      parentListId: `p-${productIndex}`,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.variantRow}>
      <div className={styles.dragHandle} {...attributes} {...listeners}>
        <GripVertical size={16} color="#bbb" />
      </div>
      <div className={styles.variantInfo}>
        <span className={styles.pill}>{variant.title}</span>
      </div>
    </div>
  );
}
