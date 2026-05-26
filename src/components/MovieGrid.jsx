import { ChevronDown, SearchX } from "lucide-react";
import LoadingSkeleton from "./LoadingSkeleton.jsx";
import MovieCard from "./MovieCard.jsx";

function MovieGrid({
  movies = [],
  loading = false,
  loadingMore = false,
  emptyTitle = "Không tìm thấy phim",
  emptyMessage = "Hãy thử một từ khóa khác.",
  hasMore = false,
  onLoadMore,
}) {
  if (loading) {
    return <LoadingSkeleton type="grid" count={12} />;
  }

  if (!movies.length) {
    return (
      <div className="grid min-h-72 place-items-center rounded-3xl border border-dashed border-ocean-200 bg-white/75 px-6 py-14 text-center shadow-sm">
        <div>
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-ocean-50 text-ocean-500">
            <SearchX className="h-8 w-8" aria-hidden="true" />
          </span>
          <h3 className="mt-5 text-xl font-bold text-slate-950">{emptyTitle}</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies.map((movie) => (
          <MovieCard key={`${movie.id}-${movie.title}`} movie={movie} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-ocean-500 px-6 text-sm font-bold text-white shadow-lg shadow-ocean-500/20 transition hover:-translate-y-0.5 hover:bg-ocean-600 focus-ring disabled:cursor-wait disabled:opacity-70"
          >
            <ChevronDown className="h-5 w-5" aria-hidden="true" />
            {loadingMore ? "Đang tải..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}

export default MovieGrid;
