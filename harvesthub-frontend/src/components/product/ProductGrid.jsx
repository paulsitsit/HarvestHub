import ProductCard from './ProductCard.jsx';
import EmptyState from '../common/EmptyState.jsx';
import Loader from '../common/Loader.jsx';

const ProductGrid = ({
  products = [],
  loading = false
}) => {
  if (loading) {
    return <Loader label="Loading fresh produce..." />;
  }

  if (!products.length) {
    return (
      <EmptyState
        title="No products found"
        description="Try changing your search or filter options."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
        />
      ))}
    </div>
  );
};

export default ProductGrid;