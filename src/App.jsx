import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyList from './pages/MyList';
import Search from './pages/Search';
import TVShows from './pages/TVShows';
import Movies from './pages/Movies';
import NewAndPopular from './pages/NewAndPopular';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/my-list" element={<MyList />} />
        <Route path="/search" element={<Search />} />
        <Route path="/tv-shows" element={<TVShows />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/new-and-popular" element={<NewAndPopular />} />
      </Routes>
    </Router>
  );
}

export default App;