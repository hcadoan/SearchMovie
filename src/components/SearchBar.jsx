import { Search, X } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { movieApi } from "../api/movieApi.js";
import SearchSuggestions from "./SearchSuggestions.jsx";

function SearchBar({ compact = false, autoFocus = false, initialValue = "" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const cleanedQuery = useMemo(() => query.trim(), [query]);
  const suggestionsId = useId();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlQuery = params.get("q") || "";
    setQuery(urlQuery || initialValue);
  }, [initialValue, location.search]);

  useEffect(() => {
    if (!isOpen || cleanedQuery.length < 2) {
      setSuggestions([]);
      setSuggestionError("");
      setSuggestionLoading(false);
      return;
    }

    let isActive = true;
    setSuggestionLoading(true);
    setSuggestionError("");

    const timeoutId = window.setTimeout(async () => {
      try {
        const data = await movieApi.searchMovies(cleanedQuery, 1);
        if (!isActive) return;
        setSuggestions((data.results || []).slice(0, 6));
      } catch (error) {
        if (!isActive) return;
        setSuggestions([]);
        setSuggestionError(error.message);
      } finally {
        if (isActive) {
          setSuggestionLoading(false);
        }
      }
    }, 350);

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, [cleanedQuery, isOpen]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!cleanedQuery) return;
    setIsOpen(false);
    navigate(`/search?q=${encodeURIComponent(cleanedQuery)}`);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setSuggestionError("");
    setIsOpen(false);
  };

  const handleSelectMovie = (movie) => {
    setQuery(movie.title || movie.original_title || "");
    setIsOpen(false);
    navigate(`/movie/${movie.id}`);
  };

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={["relative w-full", compact ? "" : "max-w-2xl"].join(" ")}
      onBlur={handleBlur}
    >
      <form
        onSubmit={handleSubmit}
        className={[
          "group flex w-full items-center gap-2 rounded-3xl border border-ocean-100 bg-white px-3 shadow-sm transition focus-within:border-ocean-300 focus-within:shadow-card",
          compact ? "h-12" : "h-14",
        ].join(" ")}
      >
        <Search className="h-5 w-5 shrink-0 text-ocean-500" aria-hidden="true" />
        <input
          type="search"
          autoFocus={autoFocus}
          autoComplete="off"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Tìm phim theo tên..."
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-base"
          aria-label="Tìm phim theo tên"
          aria-expanded={isOpen}
          aria-controls={suggestionsId}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-ring"
            aria-label="Xóa từ khóa"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
        <button
          type="submit"
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-2xl bg-ocean-500 px-4 text-sm font-bold text-white shadow-lg shadow-ocean-500/20 transition hover:-translate-y-0.5 hover:bg-ocean-600 focus-ring disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!cleanedQuery}
        >
          Tìm
        </button>
      </form>

      <SearchSuggestions
        id={suggestionsId}
        visible={isOpen && cleanedQuery.length >= 2}
        query={cleanedQuery}
        suggestions={suggestions}
        loading={suggestionLoading}
        error={suggestionError}
        onSelect={handleSelectMovie}
      />
    </div>
  );
}

export default SearchBar;
