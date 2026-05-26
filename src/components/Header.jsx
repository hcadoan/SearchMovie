import { Film, Home } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import SearchBar from "./SearchBar.jsx";

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 shadow-sm backdrop-blur-2xl">
      <div className="container-shell grid min-h-20 gap-3 py-3 lg:grid-cols-[260px_minmax(320px,1fr)_120px] lg:items-center lg:gap-8">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="group flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ocean-500 text-white shadow-lg shadow-ocean-500/25 transition group-hover:scale-105 group-hover:bg-ocean-600">
              <Film className="h-6 w-6" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-xl font-extrabold tracking-normal text-slate-950">
                HC Phim
              </span>
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-ocean-600">
                TRA CỨU PHIM
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-2 sm:flex lg:hidden">
            <HeaderLink to="/" icon={Home} label="Home" />
          </nav>
        </div>

        <div className="w-full lg:justify-self-center lg:max-w-2xl">
          <SearchBar compact />
        </div>

        <nav className="hidden justify-self-end lg:flex">
          <HeaderLink to="/" icon={Home} label="Home" />
        </nav>
      </div>
    </header>
  );
}

function HeaderLink({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "inline-flex h-11 items-center gap-2 rounded-2xl px-4 text-sm font-semibold transition focus-ring",
          isActive
            ? "bg-ocean-50 text-ocean-700 shadow-sm"
            : "text-slate-600 hover:bg-white hover:text-ocean-700 hover:shadow-sm",
        ].join(" ")
      }
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span>{label}</span>
    </NavLink>
  );
}

export default Header;
