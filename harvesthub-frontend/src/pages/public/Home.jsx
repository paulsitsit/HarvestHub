import { useEffect, useState } from 'react';
import {
  FiArrowRight,
  FiCheckCircle,
  FiPhone,
  FiSearch,
  FiShield,
  FiShoppingBag
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import {
  getCategories,
  getFeatured
} from '../../api/publicApi.js';
import { getApiErrorMessage } from '../../api/axiosInstance.js';
import GlassCard from '../../components/common/GlassCard.jsx';
import ProductGrid from '../../components/product/ProductGrid.jsx';
import FarmerCard from '../../components/farmer/FarmerCard.jsx';
import Loader from '../../components/common/Loader.jsx';
import useToast from '../../hooks/useToast.js';

const Home = () => {
  const navigate = useNavigate();
  const { error } = useToast();

  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState({
    products: [],
    farmers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadHome = async () => {
      try {
        const [
          categoriesResponse,
          featuredResponse
        ] = await Promise.all([
          getCategories(),
          getFeatured()
        ]);

        if (!active) {
          return;
        }

        setCategories(categoriesResponse.data || []);
        setFeatured(
          featuredResponse.data || {
            products: [],
            farmers: []
          }
        );
      } catch (requestError) {
        if (active) {
          error(
            getApiErrorMessage(
              requestError,
              'Unable to load the marketplace'
            )
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadHome();

    return () => {
      active = false;
    };
  }, [error]);

  const handleSearch = (event) => {
    event.preventDefault();

    const searchValue = search.trim();

    navigate(
      searchValue
        ? `/products?search=${encodeURIComponent(searchValue)}`
        : '/products'
    );
  };

  if (loading) {
    return <Loader fullScreen label="Loading HarvestHub..." />;
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-12 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="fade-up">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[var(--gold-100)] px-4 py-2 text-sm font-bold text-[var(--gold-600)]">
              <FiCheckCircle />
              Fresh, local, and direct
            </div>

            <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.08] text-[var(--green-900)] sm:text-6xl lg:text-7xl">
              Good food starts with a good connection.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              Discover fresh produce from local farmers across
              the Passi City. Browse, call, and buy directly.
            </p>

            <form
              onSubmit={handleSearch}
              className="glass-panel mt-8 flex flex-col gap-3 rounded-2xl p-2 sm:flex-row"
            >
              <label
                htmlFor="home-search"
                className="sr-only"
              >
                Search products
              </label>

              <div className="flex flex-1 items-center gap-3 px-3">
                <FiSearch
                  className="text-[var(--green-700)]"
                  size={21}
                />

                <input
                  id="home-search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search tomatoes, rice, mangoes..."
                  className="min-h-[44px] flex-1 bg-transparent text-sm outline-none"
                />
              </div>

              <button
                type="submit"
                className="gold-button"
              >
                Search
              </button>
            </form>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="gold-button"
              >
                Explore marketplace
                <FiArrowRight />
              </Link>

              <Link
                to="/register"
                className="green-button"
              >
                Become a seller
              </Link>
            </div>
          </div>

          <div className="relative">
            <GlassCard
              dark
              className="overflow-hidden rounded-[2rem] p-7 sm:p-10"
            >
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--gold-500)]/30 blur-3xl" />

              <div className="relative">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--gold-300)]">
                  Harvest of the week
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                    <p className="text-4xl">🥭</p>
                    <p className="mt-4 font-[Poppins] text-xl font-extrabold">
                      Mangoes
                    </p>
                    <p className="mt-1 text-sm text-white/65">
                      Sweet and locally grown
                    </p>
                  </div>

                  <div className="mt-8 rounded-2xl border border-white/10 bg-white/10 p-5">
                    <p className="text-4xl">🥬</p>
                    <p className="mt-4 font-[Poppins] text-xl font-extrabold">
                      Greens
                    </p>
                    <p className="mt-1 text-sm text-white/65">
                      Harvested fresh today
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gold-500)] text-[var(--green-900)]">
                    <FiPhone />
                  </div>

                  <div>
                    <p className="font-bold">
                      Buy direct from the source
                    </p>
                    <p className="text-sm text-white/65">
                      No cart. No middleman. Just fresh produce.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
              Browse by category
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-[var(--green-900)]">
              What are you looking for?
            </h2>
          </div>

          <Link
            to="/products"
            className="hidden items-center gap-2 text-sm font-bold text-[var(--green-700)] sm:flex"
          >
            View all
            <FiArrowRight />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.slice(0, 10).map((category) => (
            <Link
              key={category._id}
              to={`/products?category=${category.slug}`}
              className="glass-panel rounded-2xl p-5 text-center transition hover:-translate-y-1 hover:bg-white"
            >
              <span className="text-3xl">
                {category.icon || '🧺'}
              </span>

              <span className="mt-3 block text-sm font-extrabold text-[var(--green-900)]">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--gold-600)]">
              Featured listings
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-[var(--green-900)]">
              Fresh picks from the community
            </h2>
          </div>

          <Link
            to="/products"
            className="hidden items-center gap-2 text-sm font-bold text-[var(--green-700)] sm:flex"
          >
            Browse all
            <FiArrowRight />
          </Link>
        </div>

        <div className="mt-6">
          <ProductGrid
            products={featured.products}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
              Trusted growers
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-[var(--green-900)]">
              Top-rated farmers
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.farmers.map((farmer) => (
            <FarmerCard
              key={farmer._id}
              farmer={farmer}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: FiShoppingBag,
              title: 'Browse',
              text: 'Find seasonal produce by category, price, and location.'
            },
            {
              icon: FiPhone,
              title: 'Call or inquire',
              text: 'Connect directly with farmers about availability and pickup.'
            },
            {
              icon: FiShield,
              title: 'Buy direct',
              text: 'Support local farms and purchase with confidence.'
            }
          ].map((item) => {
            const Icon = item.icon;

            return (
              <GlassCard
                key={item.title}
                className="p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--green-100)] text-[var(--green-700)]">
                  <Icon size={23} />
                </div>

                <h3 className="mt-5 text-xl font-extrabold text-[var(--green-900)]">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  {item.text}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Home;