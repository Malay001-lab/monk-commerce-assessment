# Monk Commerce Frontend Assessment

## Project Overview

This project is a React-based product management interface allowing users to:

- **Manage Products**: Add products via a Searchable Product Picker (Infinite Scroll, Multi-select, Search).
- **Drag & Drop**: Reorder products and variants seamlessly using `@dnd-kit`.
- **Discount Management**: Apply Flat or Percentage discounts to products and variants.
- **Visuals**: Product thumbnails are displayed for easy identification.
- **State Management**: Complex nested state handling using `useReducer`.

## Tech Stack

- **Frontend**: React (Create React App), CSS Modules (Vanilla-like styling), Lucide React (Icons), @dnd-kit (Sortable/Core).
- **HTTP Client**: Axios.
- **Environment**: Node.js (for tooling).

## Key Features

1.  **Product Picker**:

    - Infinite scrolling for performance with large datasets.
    - Debounced search functionality.
    - Select products and specific variants.

2.  **Product List Management**:

    - **Reordering**: Drag and drop support for both main products and nested variants.
    - **Editing**: Inline discount editing (Flat/%) with automatic formatting (e.g., removing leading zeros).
    - **Visual Feedback**: Product images are displayed in the list.

3.  **UI/UX Improvements**:
    - "Show/Hide Variants" toggle aligned for better readability.
    - "Add Discount" button behavior optimized for smooth interaction.
    - Clean, modern aesthetic using CSS Modules.

## Application Structure

- `src/components`: UI Components (ProductList, ProductPicker, etc.)
- `src/hooks`: Custom hooks (`useProductsReducer`, `useInfiniteScroll`).
- `src/services`: API configuration (`apiClient.js`).
- `src/utils`: Helper functions.

## How to Run

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

2.  **Environment Setup**:

    - Create a `.env` file in the root directory (if not present).
    - Add your Monk Commerce API key:
      ```
      REACT_APP_MONK_API_KEY=your_key_here
      ```
      _(Note: For this assessment, the key is used directly in the frontend client)_

3.  **Start Application**:

    ```bash
    npm run dev
    ```

    This will start the development server, typically on [http://localhost:3000](http://localhost:3000) or 3001.

## Key Decisions

- **@dnd-kit**: Chosen for its modern, accessible, and robust primitive support for complex nested sortable lists.
- **CSS Modules**: Chosen to maintain scoped, modular styles without the overhead of CCS-in-JS libraries, keeping it close to vanilla CSS.
- **useReducer**: Implemented to manage the complex state of products and nested variants more predictably than `useState`.
