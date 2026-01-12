function Top10Badge({ rank }) {
  return (
    <div className="absolute top-0 left-0 z-10 hidden">  {/* Add 'hidden' class to hide badges */}
      <div className="relative">
        {/* Large number background */}
        <svg
          viewBox="0 0 100 150"
          className="w-12 h-16 md:w-16 md:h-20"
          style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))' }}
        >
          {/* Black stroke */}
          <text
            x="50"
            y="100"
            fontSize="100"
            fontWeight="900"
            textAnchor="middle"
            fill="#1a1a1a"
            stroke="#1a1a1a"
            strokeWidth="8"
          >
            {rank}
          </text>
          {/* Red fill */}
          <text
            x="50"
            y="100"
            fontSize="100"
            fontWeight="900"
            textAnchor="middle"
            fill="#e50914"
          >
            {rank}
          </text>
        </svg>
      </div>
    </div>
  );
}

export default Top10Badge;
