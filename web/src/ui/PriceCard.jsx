const PriceCard = ({
  name,
  price,
  description,
  features = [],
  isActive = false,
  isComingSoon = false,
  badge = null,
  buttonLabel,
  onButtonClick,
}) => {
  return (
    <div
      className={`relative sujoy2 flex flex-col rounded-2xl border p-6 transition-all duration-300
        ${isComingSoon ? "opacity-50 pointer-events-none select-none" : ""}
        ${isActive
          ? "border-violet-500 bg-linear-to-b from-violet-950/60 to-neutral-950 shadow-lg shadow-violet-950/40"
          : "border-white/10 bg-neutral-900 hover:border-white/20"
        }
      `}
    >
      {/* Coming Soon Overlay */}
      {isComingSoon && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl">
          <span className="-rotate-12 rounded-lg border border-white/20 bg-neutral-800/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/50">
            Coming soon
          </span>
        </div>
      )}

      {/* Badge */}
      {badge && (
        <div className="mb-4 w-fit rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-violet-400">
          {badge}
        </div>
      )}

      {/* Plan name */}
      <p className="text-xs font-semibold uppercase tracking-widest text-white/40">{name}</p>

      {/* Price */}
      <div className="mt-2 flex items-end gap-1">
        <span className="text-4xl font-bold tracking-tight text-white">
          {price === 0 ? "Free" : `$${price}`}
        </span>
        {price !== 0 && (
          <span className="mb-1 text-sm text-white/40">/mo</span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="mt-2 text-sm text-white/40 leading-relaxed">{description}</p>
      )}

      <hr className="my-5 border-white/10" />

      {/* Features */}
      <ul className="flex flex-col gap-2.5 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-white/60">
            <span className="mt-0.5 text-violet-400">✦</span>
            {feature}
          </li>
        ))}
      </ul>

      {/* Button */}
      <button
        onClick={onButtonClick}
        disabled={isActive || isComingSoon}
        className={`mt-6 w-full rounded-xl py-2.5 text-sm font-semibold tracking-wide transition-all duration-200
          ${isActive
            ? "cursor-default bg-violet-600/20 text-violet-300 border border-violet-500/30"
            : "bg-violet-600 text-white hover:bg-violet-500 active:scale-95"
          }
        `}
      >
        {buttonLabel || (isActive ? "Current plan" : `Get ${name}`)}
      </button>
    </div>
  );
};

export default PriceCard;