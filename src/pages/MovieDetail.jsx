import {
  CalendarDays,
  Clock3,
  Earth,
  Film,
  Globe2,
  ImageOff,
  Languages,
  Play,
  Star,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  formatRuntime,
  getBackdropUrl,
  getImageUrl,
  getYear,
  movieApi,
} from "../api/movieApi.js";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchMovie = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await movieApi.getMovieDetails(id);
        if (isMounted) {
          setMovie(data);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message);
          setMovie(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMovie();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const director = useMemo(() => {
    return movie?.credits?.crew?.find((member) => member.job === "Director")?.name || "Chưa rõ";
  }, [movie]);

  const cast = useMemo(() => {
    return movie?.credits?.cast?.slice(0, 10).map((person) => person.name).join(", ") || "Chưa rõ";
  }, [movie]);

  const trailer = useMemo(() => {
    return movie?.videos?.results?.find(
      (video) => video.site === "YouTube" && video.type === "Trailer",
    );
  }, [movie]);

  if (loading) {
    return <LoadingSkeleton type="detail" />;
  }

  if (error) {
    return (
      <section className="container-shell grid min-h-[60vh] place-items-center py-12">
        <div className="max-w-xl rounded-[2rem] border border-ocean-100 bg-white p-8 text-center shadow-card">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-ocean-50 text-ocean-500">
            <Film className="h-8 w-8" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold text-slate-950">Không thể tải phim</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{error}</p>
          <Link
            to="/"
            className="mt-6 inline-flex min-h-12 items-center rounded-2xl bg-ocean-500 px-5 text-sm font-bold text-white shadow-lg shadow-ocean-500/20 transition hover:bg-ocean-600 focus-ring"
          >
            Về trang Home
          </Link>
        </div>
      </section>
    );
  }

  if (!movie) return null;

  const posterUrl = getImageUrl(movie.poster_path, "w500");
  const backdropUrl = getBackdropUrl(movie.backdrop_path);
  const genres = movie.genres?.map((genre) => genre.name).join(", ") || "Chưa rõ";
  const countries = movie.production_countries?.map((country) => country.name).join(", ") || "Chưa rõ";
  const languages = movie.spoken_languages?.map((language) => language.english_name).join(", ") || "Chưa rõ";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  return (
    <section className="pb-14">
      <div className="relative overflow-hidden border-b border-ocean-100 bg-slate-900">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/50" />
        <div className="container-shell relative grid gap-8 py-10 text-white md:grid-cols-[280px_1fr] md:py-14 lg:py-20">
          <div className="mx-auto w-full max-w-[260px] overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-soft md:mx-0">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={movie.title}
                className="aspect-[2/3] w-full object-cover"
              />
            ) : (
              <div className="grid aspect-[2/3] place-items-center text-ocean-200">
                <ImageOff className="h-16 w-16" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap gap-2">
              {movie.genres?.slice(0, 4).map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-bold text-ocean-50 backdrop-blur"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="mt-3 text-lg font-medium leading-8 text-ocean-100">{movie.tagline}</p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <InfoPill icon={Star} label={`${rating}/10`} accent="amber" />
              <InfoPill icon={CalendarDays} label={getYear(movie.release_date)} />
              <InfoPill icon={Clock3} label={formatRuntime(movie.runtime)} />
            </div>
            <p className="mt-6 max-w-4xl text-base leading-8 text-slate-200">
              {movie.overview || "Chưa có mô tả nội dung cho phim này."}
            </p>
          </div>
        </div>
      </div>

      <div className="container-shell grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-extrabold tracking-normal text-slate-950">Thông tin phim</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <DetailItem icon={Film} label="Tên phim" value={movie.title} />
              <DetailItem icon={CalendarDays} label="Năm phát hành" value={getYear(movie.release_date)} />
              <DetailItem icon={Star} label="Điểm đánh giá" value={`${rating}/10`} />
              <DetailItem icon={Clock3} label="Thời lượng" value={formatRuntime(movie.runtime)} />
              <DetailItem icon={Earth} label="Quốc gia" value={countries} />
              <DetailItem icon={Languages} label="Ngôn ngữ" value={languages} />
              <DetailItem icon={UserRound} label="Đạo diễn" value={director} />
              <DetailItem icon={Globe2} label="Thể loại" value={genres} />
            </div>
          </section>

          <section className="rounded-[2rem] border border-ocean-100 bg-white p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 text-2xl font-extrabold tracking-normal text-slate-950">
              <UsersRound className="h-6 w-6 text-ocean-500" aria-hidden="true" />
              Diễn viên
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">{cast}</p>
          </section>

          {trailer && (
            <section className="rounded-[2rem] border border-ocean-100 bg-white p-4 shadow-card sm:p-6">
              <h2 className="mb-5 flex items-center gap-2 text-2xl font-extrabold tracking-normal text-slate-950">
                <Play className="h-6 w-6 text-ocean-500" aria-hidden="true" />
                Trailer
              </h2>
              <div className="overflow-hidden rounded-3xl bg-slate-950">
                <iframe
                  title={`Trailer ${movie.title}`}
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="aspect-video w-full"
                />
              </div>
            </section>
          )}
        </div>

        <aside className="h-max rounded-[2rem] border border-ocean-100 bg-white p-6 shadow-card">
          <h2 className="text-xl font-extrabold tracking-normal text-slate-950">Tóm tắt</h2>
          <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
            <p>
              <span className="font-bold text-slate-900">Tên gốc:</span>{" "}
              {movie.original_title || "Chưa rõ"}
            </p>
            <p>
              <span className="font-bold text-slate-900">Ngày phát hành:</span>{" "}
              {movie.release_date || "Chưa rõ"}
            </p>
            <p>
              <span className="font-bold text-slate-900">Trạng thái:</span>{" "}
              {movie.status || "Chưa rõ"}
            </p>
            <p>
              <span className="font-bold text-slate-900">Lượt đánh giá:</span>{" "}
              {movie.vote_count?.toLocaleString("vi-VN") || "Chưa rõ"}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function InfoPill({ icon: Icon, label, accent = "ocean" }) {
  const colorClass =
    accent === "amber"
      ? "bg-amber-400/15 text-amber-100 ring-amber-300/30"
      : "bg-ocean-300/15 text-ocean-50 ring-ocean-200/25";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ring-1 ${colorClass}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </span>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-ocean-50 bg-ocean-50/60 p-4">
      <div className="flex items-center gap-2 text-sm font-bold text-ocean-700">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{value}</p>
    </div>
  );
}

export default MovieDetail;
