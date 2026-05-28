import { useCallback, useEffect, useRef, useState } from "react";
import { fetchProducts, refreshCatalog } from "./api";
import { Filters } from "./components/Filters";
import { ProductCard } from "./components/ProductCard";
import { SeoHead } from "./seo/SeoHead";
import type { FilterMeta, ProductFilters, Product } from "./types";

const DEFAULT_FILTERS: ProductFilters = {
  search: "",
  source: "",
  model: "",
  brand: "",
  minPrice: "",
  maxPrice: "",
  sort: "price-asc",
};

export default function App() {
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<FilterMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sheetOffset, setSheetOffset] = useState(0);
  const dragStartY = useRef<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts(filters);
      setProducts(data.products);
      setMeta(data.meta);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(load, filters.search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, filters]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      await refreshCatalog();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to refresh catalog");
    } finally {
      setRefreshing(false);
    }
  };

  const activeFilterCount = [
    filters.search,
    filters.source,
    filters.model,
    filters.brand,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

  useEffect(() => {
    if (!filtersOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };

    document.body.classList.add("filter-sheet-open");
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("filter-sheet-open");
      window.removeEventListener("keydown", onKeyDown);
      setSheetOffset(0);
      dragStartY.current = null;
    };
  }, [filtersOpen]);

  const startSheetDrag = (clientY: number) => {
    dragStartY.current = clientY;
    setSheetOffset(0);
  };

  const moveSheetDrag = (clientY: number) => {
    if (dragStartY.current === null) return;
    setSheetOffset(Math.max(0, clientY - dragStartY.current));
  };

  const endSheetDrag = () => {
    if (sheetOffset > 90) {
      setFiltersOpen(false);
      return;
    }

    setSheetOffset(0);
    dragStartY.current = null;
  };

  return (
    <div className="app">
      <SeoHead productCount={products.length} products={products} />
      <a href="#main-content" className="skip-link">
        Skip to catalog
      </a>
      <header className="header">
        <div className="header__brand">
          <img
            className="header__logo"
            src="/logo.png"
            alt=""
            width={160}
            height={48}
            decoding="async"
          />
          <div>
            <h1>iNeedDownpipe</h1>
            <p className="header__tagline">
              Compare BMW downpipes &amp; exhaust — no sign-up required
            </p>
          </div>
        </div>
        <p className="header__sources">
          Sources:{" "}
          <a href="https://www.bimmerworld.com/Exhaust/Downpipes/" target="_blank" rel="noopener noreferrer">
            BimmerWorld
          </a>
          {" · "}
          <a href="https://ind-distribution.com/search?q=bmw+downpipe" target="_blank" rel="noopener noreferrer">
            IND
          </a>
          {" · "}
          <a href="https://armmotorsports.com/search?q=bmw+downpipe" target="_blank" rel="noopener noreferrer">
            ARM
          </a>
          {" · "}
          <a
            href="https://www.amazon.com/s?k=BMW+turbo+downpipe&tag=inbmw-20"
            target="_blank"
            rel="noopener noreferrer"
          >
            Amazon
          </a>
          {" · "}
          <a
            href="https://www.novaracing.com.br/downpipes"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nova Racing
          </a>
          {" · "}
          <a
            href="https://www.turbobrothers.com.br/downpipe"
            target="_blank"
            rel="noopener noreferrer"
          >
            Turbo Brothers
          </a>
        </p>
      </header>

      <main id="main-content" className="layout">
        <Filters
          filters={filters}
          meta={meta}
          onChange={setFilters}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />

        <section className="catalog" aria-label="BMW downpipe catalog">
          <div className="catalog__toolbar">
            <p className="catalog__count">
              {loading
                ? "Loading…"
                : `${products.length} result${products.length !== 1 ? "s" : ""}`}
            </p>
            <button
              type="button"
              className="catalog__filter-button"
              onClick={() => setFiltersOpen(true)}
            >
              Filters
              {activeFilterCount > 0 && (
                <span className="catalog__filter-count">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {error && <div className="catalog__error">{error}</div>}

          {!loading && products.length === 0 && !error && (
            <div className="catalog__empty">
              <p>No products match your filters.</p>
              <button type="button" onClick={() => setFilters(DEFAULT_FILTERS)}>
                Clear filters
              </button>
            </div>
          )}

          <div className="catalog__grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>

      {filtersOpen && (
        <div
          className="filter-sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="filter-sheet-title"
        >
          <button
            type="button"
            className="filter-sheet__backdrop"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
          <div
            className="filter-sheet__panel"
            style={{ transform: `translateY(${sheetOffset}px)` }}
          >
            <div
              className="filter-sheet__grabber"
              role="presentation"
              onMouseDown={(event) => startSheetDrag(event.clientY)}
              onMouseMove={(event) => moveSheetDrag(event.clientY)}
              onMouseUp={endSheetDrag}
              onMouseLeave={endSheetDrag}
              onTouchStart={(event) =>
                startSheetDrag(event.touches[0]?.clientY ?? 0)
              }
              onTouchMove={(event) =>
                moveSheetDrag(event.touches[0]?.clientY ?? 0)
              }
              onTouchEnd={endSheetDrag}
            >
              <span />
            </div>
            <div className="filter-sheet__header">
              <div>
                <p className="filter-sheet__eyebrow">Refine catalog</p>
                <h2 id="filter-sheet-title">Filters</h2>
              </div>
              <button
                type="button"
                className="filter-sheet__close"
                onClick={() => setFiltersOpen(false)}
              >
                Done
              </button>
            </div>
            <Filters
              filters={filters}
              meta={meta}
              onChange={setFilters}
              onRefresh={handleRefresh}
              refreshing={refreshing}
            />
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footer__inner">
          <p className="footer__about">
            <strong>iNeedDownpipe</strong> compares BMW turbo downpipe prices from
            US retailers — catless, catted, and performance options for N55, B58,
            S55, N20, and more. Free to use, no account required.
          </p>
          <p>
            Click a card to open the product on the retailer&apos;s site. Prices
            and availability may change — always confirm on the source website.
          </p>
        </div>
      </footer>
    </div>
  );
}
