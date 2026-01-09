import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ACTIONS } from "../../hooks/useProductsReducer";
import ProductItem from "./ProductItem";
import styles from "./ProductList.module.css";

export default function ProductList({ items, dispatch }) {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over) return;

    if (active.id !== over.id) {
      const activeIsProduct = items.find((i) => i.id === active.id);
      if (activeIsProduct) {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);

        dispatch({
          type: ACTIONS.REORDER_PRODUCTS,
          payload: { activeIndex: oldIndex, overIndex: newIndex },
        });
      } else {
        const activeData = active.data.current;
        const overData = over.data.current;

        if (activeData?.type === "VARIANT" && overData?.type === "VARIANT") {
          if (
            activeData.productId === overData.productId ||
            activeData.parentListId === overData.parentListId
          ) {
            const productIndex = items.findIndex(
              (p) => `p-${p.index}` === activeData.parentListId
            );

            const pIdx = parseInt(activeData.parentListId.split("-")[1]);

            dispatch({
              type: ACTIONS.REORDER_VARIANTS,
              payload: {
                productIndex: pIdx,
                activeIndex: activeData.index,
                overIndex: overData.index,
              },
            });
          }
        }
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.listContainer}>
        <div className={styles.headerRow}>
          <span>Product</span>
          <div className={styles.headerRight}>
            <span>Discount</span>
          </div>
        </div>

        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item, index) => (
            <ProductItem
              key={item.id}
              product={item}
              index={index}
              dispatch={dispatch}
              totalItems={items.length}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
}
