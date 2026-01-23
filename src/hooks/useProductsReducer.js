export const INITIAL_STATE = {
  items: [
    {
      id: "p-init",
      isEmpty: true,
      title: "Select Product",
      variants: [],
      discount: { value: 0, type: "flat" },
    },
  ],
  pickerState: {
    isOpen: false,
    editingIndex: null,
  },
};

export const ACTIONS = {
  ADD_EMPTY_PRODUCT: "ADD_EMPTY_PRODUCT",
  REMOVE_PRODUCT: "REMOVE_PRODUCT",
  REORDER_PRODUCTS: "REORDER_PRODUCTS",
  REORDER_VARIANTS: "REORDER_VARIANTS",
  UPDATE_PRODUCT_DISCOUNT: "UPDATE_PRODUCT_DISCOUNT",
  UPDATE_VARIANT_DISCOUNT: "UPDATE_VARIANT_DISCOUNT",
  OPEN_PICKER: "OPEN_PICKER",
  CLOSE_PICKER: "CLOSE_PICKER",
  REPLACE_PRODUCT: "REPLACE_PRODUCT",
};

export function productsReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_EMPTY_PRODUCT:
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: `temp-${Date.now()}`,
            isEmpty: true,
            title: "Select Product",
            variants: [],
            discount: { value: 0, type: "flat" },
          },
        ],
      };

    case ACTIONS.REMOVE_PRODUCT:
      return {
        ...state,
        items: state.items.filter((_, idx) => idx !== action.payload.index),
      };

    case ACTIONS.REORDER_PRODUCTS: {
      const { activeIndex, overIndex } = action.payload;
      if (activeIndex === overIndex) return state;

      const newItems = [...state.items];
      const [movedItem] = newItems.splice(activeIndex, 1);
      newItems.splice(overIndex, 0, movedItem);

      return { ...state, items: newItems };
    }

    case ACTIONS.REORDER_VARIANTS: {
      const { productIndex, activeIndex, overIndex } = action.payload;
      if (activeIndex === overIndex) return state;

      const newItems = [...state.items];
      const product = { ...newItems[productIndex] };
      const newVariants = [...product.variants];

      const [movedVar] = newVariants.splice(activeIndex, 1);
      newVariants.splice(overIndex, 0, movedVar);

      product.variants = newVariants;
      newItems[productIndex] = product;

      return { ...state, items: newItems };
    }

    case ACTIONS.UPDATE_PRODUCT_DISCOUNT: {
      const { index, field, value } = action.payload;
      const newItems = [...state.items];
      newItems[index] = {
        ...newItems[index],
        discount: { ...newItems[index].discount, [field]: value },
      };
      return { ...state, items: newItems };
    }

    case ACTIONS.UPDATE_VARIANT_DISCOUNT: {
      const { productIndex, variantIndex, field, value } = action.payload;
      const newItems = [...state.items];
      const product = { ...newItems[productIndex] };
      const variants = [...product.variants];

      variants[variantIndex] = {
        ...variants[variantIndex],
        discount: {
          ...(variants[variantIndex]?.discount ?? { value: 0, type: "flat" }),
          [field]: value,
        },
      };

      product.variants = variants;
      newItems[productIndex] = product;
      return { ...state, items: newItems };
    }

    case ACTIONS.OPEN_PICKER:
      return {
        ...state,
        pickerState: {
          isOpen: true,
          editingIndex: action.payload.index,
        },
      };

    case ACTIONS.CLOSE_PICKER:
      return {
        ...state,
        pickerState: {
          isOpen: false,
          editingIndex: null,
        },
      };

    case ACTIONS.REPLACE_PRODUCT: {
      // user selected products from picker
      // products is an array of selected products
      const { selectedProducts } = action.payload;
      const { editingIndex } = state.pickerState;

      if (editingIndex === null) return state;

      const newProductItems = selectedProducts.map((p) => ({
        ...p,
        id: `p-${p.id}-${Date.now()}-${Math.random()}`,
        discount: { value: 0, type: "flat" },
        variants: p.variants ?? [],
      }));

      const newItems = [...state.items];
      newItems.splice(editingIndex, 1, ...newProductItems);

      return {
        ...state,
        items: newItems,
        pickerState: { isOpen: false, editingIndex: null },
      };
    }

    default:
      return state;
  }
}
