import { getRatingColor } from '../utils/maturityRating';

function MaturityBadge({ rating, size = 'md' }) {
  if (!rating || rating === 'NR') return null;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  return (
    <span
      className={`${getRatingColor(rating)} ${sizeClasses[size]} text-white font-bold rounded border-2 border-white/80 inline-block`}
    >
      {rating}
    </span>
  );
}

export default MaturityBadge;
