import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import tmdb from '../services/tmdb';

function Home() {
  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar />
      <Hero />
      
      <div className="relative -mt-32 z-10">
        <MovieRow 
          title="Trending Now" 
          fetchUrl={() => tmdb.getTrending('all', 'week')} 
        />
        <MovieRow 
          title="Popular Movies" 
          fetchUrl={tmdb.getPopularMovies} 
        />
        <MovieRow 
          title="Popular TV Shows" 
          fetchUrl={tmdb.getPopularTVShows} 
        />
      </div>
    </div>
  );
}

export default Home;