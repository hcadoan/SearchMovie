import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { movieApi } from "../api/movieApi.js";
import MovieGrid from "../components/MovieGrid.jsx";
import SearchBar from "../components/SearchBar.jsx";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = useMemo(() => searchParams.get("q")?.trim() || "", [searchParams]);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const searchMovies = async (keyword, nextPage = 1) => {
    if (!keyword) {
      setMovies([]);
      setError("");
      return;
    }

    const isFirstPage = nextPage === 1;
    if (isFirstPage) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      setError("");
      const data = await movieApi.searchMovies(keyword, nextPage);
      setMovies((currentMovies) =>
        isFirstPage ? data.results || [] : [...currentMovies, ...(data.results || [])],
      );
      setPage(data.page || nextPage);
      setTotalPages(Math.min(data.total_pages || 1, 500));
    } catch (fetchError) {
      setError(fetchError.message);
      if (isFirstPage) {
        setMovies([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    searchMovies(query, 1);
  }, [query]);

  const hasSearched = Boolean(query);

  return (
    <section className="container-shell py-10 md:py-14">
      <div className="mb-8 rounded-[2rem] border border-ocean-100 bg-white p-5 shadow-card sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-ocean-50 px-3 py-1.5 text-sm font-bold text-ocean-700">
              <Search className="h-4 w-4" aria-hidden="true" />
              Search Results
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-normal text-slate-950">
              {hasSearched ? `Kết quả cho "${query}"` : "Tìm kiếm phim"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {hasSearched
                ? `${movies.length} phim đang hiển thị trong trang này.`
                : "Nhập tên phim bạn muốn tra cứu."}
            </p>
          </div>
          <div className="w-full lg:max-w-xl">
            <SearchBar initialValue={query} autoFocus />
          </div>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      <MovieGrid
        movies={movies}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={!error && hasSearched && page < totalPages}
        onLoadMore={() => searchMovies(query, page + 1)}
        emptyTitle={hasSearched ? "Không tìm thấy phim" : "Sẵn sàng tìm kiếm"}
        emptyMessage={
          hasSearched
            ? "Hãy thử tên gốc, tên tiếng Anh hoặc rút gọn từ khóa."
            : "Kết quả sẽ xuất hiện ở đây sau khi bạn nhập từ khóa."
        }
      />
    </section>
  );
}

function ErrorBanner({ message }) {
  return (
    <div className="mb-8 rounded-3xl border border-sky-200 bg-white p-5 text-sm font-semibold leading-6 text-slate-700 shadow-sm">
      {message}
    </div>
  );
}

export default SearchResults;
