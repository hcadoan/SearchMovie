function LoadingSkeleton({ type = "grid", count = 8 }) {
  if (type === "detail") {
    return (
      <div className="container-shell py-10">
        <div className="animate-pulse overflow-hidden rounded-[2rem] border border-ocean-100 bg-white shadow-card">
          <div className="h-64 bg-ocean-100/80 md:h-96" />
          <div className="grid gap-8 p-5 md:grid-cols-[280px_1fr] md:p-8">
            <div className="aspect-[2/3] rounded-3xl bg-slate-100" />
            <div className="space-y-5">
              <div className="h-10 w-3/4 rounded-full bg-slate-100" />
              <div className="h-5 w-1/2 rounded-full bg-slate-100" />
              <div className="space-y-3">
                <div className="h-4 rounded-full bg-slate-100" />
                <div className="h-4 rounded-full bg-slate-100" />
                <div className="h-4 w-4/5 rounded-full bg-slate-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-3xl border border-ocean-100/70 bg-white shadow-sm"
        >
          <div className="aspect-[2/3] bg-ocean-100/80" />
          <div className="space-y-3 p-4">
            <div className="h-5 rounded-full bg-slate-100" />
            <div className="h-5 w-2/3 rounded-full bg-slate-100" />
            <div className="h-4 w-1/2 rounded-full bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
