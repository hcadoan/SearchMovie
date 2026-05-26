import { ArrowRight, Clapperboard, Sparkles, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getBackdropUrl, getImageUrl, movieApi } from "../api/movieApi.js";
import MovieGrid from "../components/MovieGrid.jsx";
import SearchBar from "../components/SearchBar.jsx";

function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const heroMovie = useMemo(() => movies.find((movie) => movie.backdrop_path) || movies[0], [movies]);

  const fetchPopular = async (nextPage = 1) => {
    const isFirstPage = nextPage === 1;
    if (isFirstPage) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      setError("");
      const data = await movieApi.getPopularMovies(nextPage);
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
    fetchPopular();
  }, []);

  const heroBackdrop = getBackdropUrl(heroMovie?.backdrop_path);
  const heroPoster = getImageUrl(heroMovie?.poster_path, "w342");

  return (
    <>
      <section className="relative overflow-hidden border-b border-ocean-100/70 bg-white">
        {heroBackdrop && (
          <img
            src={heroBackdrop}
            alt=""
            className="absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover opacity-25 lg:block"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-50 via-white to-mint-50/70" />
        <div className="container-shell relative grid items-center gap-10 py-10 md:py-14 lg:grid-cols-[1fr_420px]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-ocean-100 bg-white/85 px-4 py-2 text-sm font-bold text-ocean-700 shadow-sm">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              HC Phim
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
              Tra cứu thông tin phim trong vài giây
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Cập nhật phim từ
              kho dữ liệu TMDB.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/search"
                className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-ocean-500 px-5 text-sm font-bold text-white shadow-lg shadow-ocean-500/20 transition hover:-translate-y-0.5 hover:bg-ocean-600 focus-ring"
              >
                Khám phá phim
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href="#popular"
                className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-ocean-100 bg-white px-5 text-sm font-bold text-ocean-700 shadow-sm transition hover:-translate-y-0.5 hover:border-ocean-200 hover:shadow-card focus-ring"
              >
                Đang nổi bật
              </a>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative mx-auto aspect-[3/4] max-w-sm">
              <div className="absolute inset-8 rounded-[2rem] bg-mint-100 shadow-soft" />
              <div className="absolute left-0 top-8 w-64 overflow-hidden rounded-[2rem] border border-white bg-white shadow-soft">
                {heroPoster ? (
                  <img
                    src={heroPoster}
                    alt={heroMovie?.title || "Movie poster"}
                    className="aspect-[2/3] w-full object-cover"
                  />
                ) : (
                  <div className="grid aspect-[2/3] place-items-center bg-ocean-50 text-ocean-500">
                    <Clapperboard className="h-16 w-16" aria-hidden="true" />
                  </div>
                )}
                <div className="p-4">
                  <p className="line-clamp-2 text-lg font-extrabold text-slate-950">
                    {heroMovie?.title || "Movie details"}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-600">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                    {heroMovie?.vote_average ? heroMovie.vote_average.toFixed(1) : "TMDB"}
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      <section id="popular" className="container-shell py-12 md:py-16">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-ocean-600">
              Trending
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-normal text-slate-950">
              Phim đang được quan tâm
            </h2>
          </div>
        </div>

        {error && <ErrorBanner message={error} />}

        <MovieGrid
          movies={movies}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={!error && page < totalPages}
          onLoadMore={() => fetchPopular(page + 1)}
          emptyTitle="Chưa có dữ liệu phim"
          emptyMessage="Hãy kiểm tra API key TMDB trong file .env rồi tải lại trang."
        />
      </section>
    </>
  );
}

function ErrorBanner({ message }) {
  return (
    <div className="mb-8 rounded-3xl border border-sky-200 bg-white p-5 text-sm font-semibold leading-6 text-slate-700 shadow-sm">
      {message}
    </div>
  );
}

export default Home;
