import {
  FiArrowRight,
  FiHeart,
  FiPhone,
  FiSearch,
  FiShield
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import GlassCard from '../../components/common/GlassCard.jsx';

const About = () => {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <section className="glass-panel rounded-3xl p-8 sm:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--green-700)]">
          About HarvestHub
        </p>

        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold text-[var(--green-900)] sm:text-6xl">
          Helping local harvests find local homes.
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--muted)]">
          HarvestHub is a buyer-friendly marketplace for discovering
          fresh products from local farmers in the Passi City.
          Buyers can browse without creating an account and contact
          farmers directly.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/products"
            className="gold-button"
          >
            Browse products
            <FiArrowRight />
          </Link>

          <Link
            to="/register"
            className="green-button"
          >
            Become a seller
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          {
            icon: FiSearch,
            title: 'Browse freely',
            text: 'Search local produce by category, price, location, and rating.'
          },
          {
            icon: FiPhone,
            title: 'Connect directly',
            text: 'Call or send an inquiry directly to the farmer.'
          },
          {
            icon: FiShield,
            title: 'Trusted listings',
            text: 'Farmer profiles and product listings go through admin review.'
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

              <h2 className="mt-5 text-xl font-extrabold text-[var(--green-900)]">
                {item.title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {item.text}
              </p>
            </GlassCard>
          );
        })}
      </section>

      <section className="mt-10 glass-panel-dark rounded-3xl p-8 sm:p-12">
        <FiHeart
          size={30}
          className="text-[var(--gold-300)]"
        />

        <h2 className="mt-5 text-3xl font-extrabold">
          Better visibility for farmers. Better choices for buyers.
        </h2>

        <p className="mt-4 max-w-2xl leading-8 text-white/70">
          Farmers get a simple way to showcase their harvest, while
          buyers get a direct connection to the people growing their
          food.
        </p>
      </section>
    </div>
  );
};

export default About;