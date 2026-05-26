import { CalendarDays, ImageOff, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { getImageUrl, getYear } from "../api/movieApi.js";

function MovieCard({ movie }) {
  const posterUrl = getImageUrl(movie.poster_path, "w500");
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group block h-full overflow-hidden rounded-3xl border border-ocean-100/70 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:border-ocean-200 hover:shadow-soft focus-ring"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-ocean-50">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title || movie.original_title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-ocean-300">
            <ImageOff className="h-12 w-12" aria-hidden="true" />
          </div>
        )}
        <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-amber-600 shadow-sm">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
          {rating}
        </div>
      </div>

      <div className="space-y-3 p-4">
        <h3 className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-slate-950 transition group-hover:text-ocean-700">
          {movie.title || movie.original_title}
        </h3>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <CalendarDays className="h-4 w-4 text-mint-500" aria-hidden="true" />
          <span>{getYear(movie.release_date)}</span>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
