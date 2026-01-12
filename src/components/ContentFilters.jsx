import { useState } from 'react';

function ContentFilters({ onFilterChange, genres, type = 'movie' }) {
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  const currentYear = new Date().getFullYear();
  const years = ['all', ...Array.from({ length: 30 }, (_, i) => currentYear - i)];

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    onFilterChange({ genre, year: selectedYear });
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    onFilterChange({ genre: selectedGenre, year });
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6 px-4 md:px-12">
      {/* Genre Filter */}
      <div className="relative">
        <select
          value={selectedGenre}
          onChange={(e) => handleGenreChange(e.target.value)}
          className="bg-black/60 border border-gray-600 text-white px-4 py-2 pr-10 rounded hover:bg-black/80 focus:outline-none focus:border-white transition-all cursor-pointer appearance-none"
        >
          <option value="all">All Genres</option>
          {Object.entries(genres).map(([key, value]) => (
            <option key={key} value={value}>
              {key.split('_').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              ).join(' ')}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Year Filter */}
      <div className="relative">
        <select
          value={selectedYear}
          onChange={(e) => handleYearChange(e.target.value)}
          className="bg-black/60 border border-gray-600 text-white px-4 py-2 pr-10 rounded hover:bg-black/80 focus:outline-none focus:border-white transition-all cursor-pointer appearance-none"
        >
          <option value="all">All Years</option>
          {years.slice(1).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Clear Filters */}
      {(selectedGenre !== 'all' || selectedYear !== 'all') && (
        <button
          onClick={() => {
            setSelectedGenre('all');
            setSelectedYear('all');
            onFilterChange({ genre: 'all', year: 'all' });
          }}
          className="text-sm text-gray-400 hover:text-white transition-colors underline"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

export default ContentFilters;
