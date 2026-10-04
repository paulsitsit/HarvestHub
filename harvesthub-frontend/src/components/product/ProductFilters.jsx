import { FiFilter, FiRotateCcw } from 'react-icons/fi';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';

const ProductFilters = ({
  filters,
  categories = [],
  onChange,
  onReset,
  mobile = false
}) => {
  const updateFilter = (field, value) => {
    onChange({
      ...filters,
      [field]: value,
      page: 1
    });
  };

  return (
    <aside
      className={[
        'glass-panel rounded-2xl p-5',
        mobile ? '' : 'sticky top-24'
      ].join(' ')}
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-[var(--green-900)]">
          <FiFilter />
          Filters
        </h2>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-[40px] items-center gap-1 rounded-lg px-2 text-xs font-bold text-[var(--green-700)] hover:bg-[var(--green-100)]"
        >
          <FiRotateCcw />
          Reset
        </button>
      </div>

      <div className="space-y-5">
        <Input
          label="Search"
          value={filters.search}
          onChange={(event) =>
            updateFilter(
              'search',
              event.target.value
            )
          }
          placeholder="Tomatoes, rice, mangoes..."
        />

        <Select
          label="Category"
          value={filters.category}
          onChange={(event) =>
            updateFilter(
              'category',
              event.target.value
            )
          }
        >
          <option value="">All categories</option>

          {categories.map((category) => (
            <option
              key={category._id}
              value={category.slug}
            >
              {category.icon} {category.name}
            </option>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Min price"
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={(event) =>
              updateFilter(
                'minPrice',
                event.target.value
              )
            }
            placeholder="₱0"
          />

          <Input
            label="Max price"
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={(event) =>
              updateFilter(
                'maxPrice',
                event.target.value
              )
            }
            placeholder="₱500"
          />
        </div>

        <Input
          label="Municipality"
          value={filters.municipality}
          onChange={(event) =>
            updateFilter(
              'municipality',
              event.target.value
            )
          }
          placeholder="Lipa, Cebu City..."
        />

        <Select
          label="Minimum rating"
          value={filters.minRating}
          onChange={(event) =>
            updateFilter(
              'minRating',
              event.target.value
            )
          }
        >
          <option value="">Any rating</option>
          <option value="4">4 stars and above</option>
          <option value="3">3 stars and above</option>
          <option value="2">2 stars and above</option>
        </Select>

        <Select
          label="Availability"
          value={filters.availability}
          onChange={(event) =>
            updateFilter(
              'availability',
              event.target.value
            )
          }
        >
          <option value="">Any availability</option>
          <option value="available">Available</option>
          <option value="low_stock">Low stock</option>
        </Select>

        <Select
          label="Sort by"
          value={filters.sort}
          onChange={(event) =>
            updateFilter(
              'sort',
              event.target.value
            )
          }
        >
          <option value="newest">Newest</option>
          <option value="popular">Most viewed</option>
          <option value="price_low">Price: low to high</option>
          <option value="price_high">Price: high to low</option>
        </Select>

        {mobile && (
          <Button
            className="w-full"
            onClick={() => onChange(filters)}
          >
            Apply filters
          </Button>
        )}
      </div>
    </aside>
  );
};

export default ProductFilters;