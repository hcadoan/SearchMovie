import { ImageOff, Loader2, Star } from "lucide-react";
import { getImageUrl, getYear } from "../api/movieApi.js";

function SearchSuggestions({ id, visible, query, suggestions, loading, error, onSelect }) {
  if (!visible) return null;

  return (
    <div
      id={id}
      className="absolute left-0 right-0 top-full z-50 mt-3 max-h-[min(70vh,30rem)] overflow-y-auto rounded-[1.5rem] border border-ocean-100 bg-white p-2 shadow-soft"
      role="listbox"
      aria-label="Gợi ý phim"
    >
      {loading && <SuggestionLoading />}

      {!loading && error && (
        <div className="px-4 py-5 text-sm font-semibold leading-6 text-slate-500">{error}</div>
      )}

      {!loading && !error && suggestions.length === 0 && (
        <div className="px-4 py-5 text-sm font-semibold leading-6 text-slate-500">
          Không có gợi ý phù hợp cho "{query}".
        </div>
      )}

      {!loading &&
        !error &&
        suggestions.map((movie) => (
          <button
            key={movie.id}
            type="button"
            role="option"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onSelect(movie)}
            className="flex w-full gap-3 rounded-[1.25rem] p-2 text-left transition hover:bg-ocean-50 focus-ring"
          >
            <Poster path={movie.poster_path} title={movie.title || movie.original_title} />
            <span className="min-w-0 flex-1 py-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="line-clamp-2 text-sm font-extrabold leading-5 text-slate-950">
                  {movie.title || movie.original_title}
                </span>
                <span className="rounded-full bg-mint-50 px-2 py-0.5 text-xs font-bold text-mint-500">
                  {getYear(movie.release_date)}
                </span>
              </span>
              <span className="mt-1 flex items-center gap-1 text-xs font-bold text-amber-600">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
              </span>
              <span className="line-clamp-2 mt-1 text-xs leading-5 text-slate-500">
                {movie.overview || "Chưa có mô tả ngắn cho phim này."}
              </span>
            </span>
          </button>
        ))}
    </div>
  );
}

function Poster({ path, title }) {
  const posterUrl = getImageUrl(path, "w92");

  return (
    <span className="grid h-24 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-ocean-50 text-ocean-300">
      {posterUrl ? (
        <img src={posterUrl} alt={title} className="h-full w-full object-cover" />
      ) : (
        <ImageOff className="h-6 w-6" aria-hidden="true" />
      )}
    </span>
  );
}

function SuggestionLoading() {
  return (
    <div className="space-y-2 p-2">
      <div className="flex items-center gap-2 px-2 py-1 text-sm font-bold text-ocean-600">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        Đang tìm gợi ý...
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex animate-pulse gap-3 rounded-[1.25rem] p-2">
          <div className="h-24 w-16 rounded-2xl bg-ocean-100" />
          <div className="flex-1 space-y-3 py-2">
            <div className="h-4 w-2/3 rounded-full bg-slate-100" />
            <div className="h-3 w-20 rounded-full bg-slate-100" />
            <div className="h-3 rounded-full bg-slate-100" />
            <div className="h-3 w-4/5 rounded-full bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SearchSuggestions;
