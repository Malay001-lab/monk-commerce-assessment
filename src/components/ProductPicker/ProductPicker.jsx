import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import styles from "./ProductPicker.module.css";
import { productsApi } from "../../services/apiClient";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";

export default function ProductPicker({ isOpen, onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      setProducts([]);
      setHasMore(true);
      fetchProducts(query, 1);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  const [error, setError] = useState(null);

  const fetchProducts = async (searchQuery, pageNum) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.search(searchQuery, pageNum);
      if (data && Array.isArray(data)) {
        setProducts((prev) => (pageNum === 1 ? data : [...prev, ...data]));
        if (data.length < 10) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load products. Check your network or API key.");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage((prev) => {
      const nextPage = prev + 1;
      fetchProducts(query, nextPage);
      return nextPage;
    });
  };

  const lastElementRef = useInfiniteScroll(loading, hasMore, loadMore);

  const toggleProduct = (product) => {
    setSelected((prev) => {
      const newState = { ...prev };
      if (newState[product.id]) {
        delete newState[product.id];
      } else {
        newState[product.id] = {
          ...product,
          variants: product.variants,
        };
      }
      return newState;
    });
  };

  const toggleVariant = (product, variant) => {
    setSelected((prev) => {
      const newState = { ...prev };
      if (!newState[product.id]) {
        newState[product.id] = { ...product, variants: [variant] };
      } else {
        const currentVariants = newState[product.id].variants;
        const exists = currentVariants.find((v) => v.id === variant.id);
        if (exists) {
          const newVars = currentVariants.filter((v) => v.id !== variant.id);
          if (newVars.length === 0) {
            delete newState[product.id];
          } else {
            newState[product.id] = { ...product, variants: newVars };
          }
        } else {
          newState[product.id] = {
            ...product,
            variants: [...currentVariants, variant],
          };
        }
      }
      return newState;
    });
  };

  const handleAdd = () => {
    const selectedList = Object.values(selected);
    onSelect(selectedList);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Select Products</h3>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search product"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className={styles.list}>
          {products.map((product, index) => {
            const isSelected = !!selected[product.id];
            const selectedVariantCount =
              selected[product.id]?.variants?.length || 0;
            const totalVariants = product.variants.length;
            const isIndeterminate =
              selectedVariantCount > 0 && selectedVariantCount < totalVariants;

            return (
              <div
                key={product.id}
                className={styles.item}
                ref={index === products.length - 1 ? lastElementRef : null}
              >
                <div className={styles.itemHeader}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    ref={(input) =>
                      input && (input.indeterminate = isIndeterminate)
                    }
                    onChange={() => toggleProduct(product)}
                  />
                  <img
                    src={product.image.src}
                    alt=""
                    className={styles.thumb}
                  />
                  <span>{product.title}</span>
                </div>
                <div className={styles.variants}>
                  {product.variants.map((v) => {
                    const isVarSelected = !!selected[
                      product.id
                    ]?.variants?.find((sv) => sv.id === v.id);
                    return (
                      <div key={v.id} className={styles.variantItem}>
                        <div className={styles.flexRow}>
                          <input
                            type="checkbox"
                            checked={isVarSelected}
                            onChange={() => toggleVariant(product, v)}
                          />
                          <span>{v.title}</span>
                        </div>
                        <span className={styles.price}>${v.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {loading && <div className={styles.loading}>Loading...</div>}
          {error && <div className={styles.error}>{error}</div>}
          {!loading && !error && products.length === 0 && (
            <div className={styles.empty}>No products found</div>
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.count}>
            {Object.keys(selected).length} products selected
          </span>
          <div className={styles.actions}>
            <button className={styles.btnCancel} onClick={onClose}>
              Cancel
            </button>
            <button className={styles.btnAdd} onClick={handleAdd}>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
