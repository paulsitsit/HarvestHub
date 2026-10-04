import {
  FiFacebook,
  FiMail,
  FiPhone
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-16 bg-[var(--green-900)] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="sm:col-span-2">
          <Link
            to="/"
            className="font-[Poppins] text-2xl font-extrabold"
          >
            Harvest<span className="text-[var(--gold-300)]">
              Hub
            </span>
          </Link>

          <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
            A local marketplace helping buyers discover fresh
            produce directly from farmers in the Passi City.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[var(--gold-300)]">
            Explore
          </h2>

          <div className="mt-4 flex flex-col gap-3 text-sm text-white/75">
            <Link
              to="/products"
              className="transition hover:text-white"
            >
              Browse products
            </Link>

            <Link
              to="/about"
              className="transition hover:text-white"
            >
              How it works
            </Link>

            <Link
              to="/register"
              className="transition hover:text-white"
            >
              Become a seller
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[var(--gold-300)]">
            Contact
          </h2>

          <div className="mt-4 flex flex-col gap-3 text-sm text-white/75">
            <a
              href="mailto:hello@harvesthub.local"
              className="flex items-center gap-2 hover:text-white"
            >
              <FiMail />
              hello@harvesthub.local
            </a>

            <a
              href="tel:"
              className="flex items-center gap-2 hover:text-white"
            >
              <FiPhone />
              Contact support
            </a>

            <a
              href="#"
              className="flex items-center gap-2 hover:text-white"
            >
              <FiFacebook />
              HarvestHub Passi City
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} HarvestHub. Fresh connections,
        local impact.
      </div>
    </footer>
  );
};

export default Footer;