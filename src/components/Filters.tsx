import type { FilterMeta, ProductFilters } from "../types";

interface Props {
  filters: ProductFilters;
  meta: FilterMeta | null;
  onChange: (filters: ProductFilters) => void;
  onRefresh: () => void;
  refreshing: boolean;
}

const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "title-asc", label: "Name A–Z" },
  { value: "newest", label: "Recently updated" },
];

const ALLOW_REFRESH =
  import.meta.env.DEV || import.meta.env.VITE_ALLOW_REFRESH === "true";

const SOURCE_OPTIONS = [
  { value: "", label: "All sources" },
  { value: "bimmerworld", label: "BimmerWorld" },
  { value: "ind", label: "IND Distribution" },
  { value: "arm", label: "ARM Motorsports" },
  { value: "amazon", label: "Amazon" },
];

export function Filters({
  filters,
  meta,
  onChange,
  onRefresh,
  refreshing,
}: Props) {
  const update = (key: keyof ProductFilters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <aside className="filters">
      <div className="filters__header">
        <h2>Filters</h2>
        {ALLOW_REFRESH && (
          <button
            type="button"
            className="filters__refresh"
            onClick={onRefresh}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing…" : "Refresh data"}
          </button>
        )}
      </div>

      <div className="filters__body">
        <label className="filters__field filters__field--wide">
          <span>Search</span>
          <input
            type="search"
            placeholder="downpipe, turbo, M3…"
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
          />
        </label>

        <label className="filters__field">
          <span>Source</span>
          <select
            value={filters.source}
            onChange={(e) => update("source", e.target.value)}
          >
            {SOURCE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="filters__field">
          <span>BMW model</span>
          <select
            value={filters.model}
            onChange={(e) => update("model", e.target.value)}
          >
            <option value="">All models</option>
            {meta?.models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label className="filters__field">
          <span>Brand</span>
          <select
            value={filters.brand}
            onChange={(e) => update("brand", e.target.value)}
          >
            <option value="">All brands</option>
            {meta?.brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>

        <label className="filters__field">
          <span>Min price</span>
          <input
            type="number"
            min={0}
            placeholder={String(meta?.priceRange.min ?? 0)}
            value={filters.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
          />
        </label>

        <label className="filters__field">
          <span>Max price</span>
          <input
            type="number"
            min={0}
            placeholder={String(meta?.priceRange.max ?? "")}
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
          />
        </label>

        <label className="filters__field filters__field--wide">
          <span>Sort by</span>
          <select
            value={filters.sort}
            onChange={(e) => update("sort", e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {meta && (
        <p className="filters__meta">
          {meta.total} products in catalog
          {meta.catalogUpdatedAt && (
            <>
              <br />
              <span className="filters__updated">
                Updated{" "}
                {new Date(meta.catalogUpdatedAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </>
          )}
        </p>
      )}
    </aside>
  );
}
