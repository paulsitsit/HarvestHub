import { useEffect, useMemo, useState } from 'react';
import { FiSliders } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';

import {
  getCategories,
  getPublicProducts
} from '../../api/publicApi.js';

import { getApiErrorMessage } from '../../api/axiosInstance.js';

import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/common/Modal.jsx';
import Pagination from '../../components/common/Pagination.jsx';

import ProductFilters from '../../components/product/ProductFilters.jsx';
import ProductGrid from '../../components/product/ProductGrid.jsx';

import useDebounce from '../../hooks/useDebounce.js';
import useToast from '../../hooks/useToast.js';

const defaultFilters = {
  search: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  municipality: '',
  minRating: '',
  availability: '',
  sort: 'newest',
  page: 1,
  limit: 12
};

const Products = () => {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const { error } = useToast();

  const [filters, setFilters] = useState(() => ({
    ...defaultFilters,
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    municipality: searchParams.get('municipality') || '',
    minRating: searchParams.get('minRating') || '',
    availability: searchParams.get('availability') || '',
    sort:
      searchParams.get('sort') ||
      defaultFilters.sort,
    page: Number(searchParams.get('page')) || 1
  }));

  const [categories, setCategories] = useState([]);

  const [productsData, setProductsData] = useState({
    products: [],
    pagination: {
      page: 1,
      pages: 0,
      total: 0
    }
  });

  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] =
    useState(false);

  const debouncedSearch = useDebounce(
    filters.search,
    450
  );

  const requestParams = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch
    }),
    [filters, debouncedSearch]
  );

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const response =
          await getCategories();

        if (active) {
          setCategories(response.data || []);
        }
      } catch (requestError) {
        if (active) {
          error(
            getApiErrorMessage(
              requestError,
              'Unable to load categories'
            )
          );
        }
      }
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, [error]);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      setLoading(true);

      try {
        const response =
          await getPublicProducts(requestParams);

        if (active) {
          setProductsData(
            response.data || {
              products: [],
              pagination: {
                page: 1,
                pages: 0,
                total: 0
              }
            }
          );
        }
      } catch (requestError) {
        if (active) {
          error(
            getApiErrorMessage(
              requestError,
              'Unable to load products'
            )
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    const nextParams = new URLSearchParams();

    Object.entries(requestParams).forEach(
      ([key, value]) => {
        if (
          value !== '' &&
          value !== undefined &&
          value !== null
        ) {
          nextParams.set(key, String(value));
        }
      }
    );

    setSearchParams(nextParams, {
      replace: true
    });

    return () => {
      active = false;
    };
  }, [
    requestParams,
    setSearchParams,
    error
  ]);

  const updateFilters = (nextFilters) => {
    setFilters({
      ...nextFilters,
      page: nextFilters.page || 1
    });
  };

  const resetFilters = () => {
    setFilters({
      ...defaultFilters
    });
  };

  const handlePageChange = (page) => {
    setFilters((current) => ({
      ...current,
      page
    }));

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
            Marketplace
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-[var(--green-900)]">
            Fresh produce near you
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Browse available produce and contact farmers
            directly.
          </p>
        </div>

        <Button
          variant="outline"
          className="lg:hidden"
          onClick={() => setFiltersOpen(true)}
        >
          <FiSliders />
          Filters
        </Button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:block">
          <ProductFilters
            filters={filters}
            categories={categories}
            onChange={updateFilters}
            onReset={resetFilters}
          />
        </div>

        <div>
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-[var(--muted)]">
              {productsData.pagination.total || 0}{' '}
              listing
              {productsData.pagination.total === 1
                ? ''
                : 's'}{' '}
              found
            </p>

            {loading && (
              <span className="text-xs font-bold text-[var(--green-700)]">
                Updating...
              </span>
            )}
          </div>

          <ProductGrid
            products={productsData.products}
            loading={loading}
          />

          {!loading && (
            <Pagination
              page={productsData.pagination.page}
              pages={productsData.pagination.pages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      <Modal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filter products"
      >
        <ProductFilters
          mobile
          filters={filters}
          categories={categories}
          onChange={(nextFilters) => {
            updateFilters(nextFilters);
            setFiltersOpen(false);
          }}
          onReset={() => {
            resetFilters();
            setFiltersOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default Products;