import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import Places from './pages/Places';
import Shopping from './pages/Shopping';
import Translator from './pages/Translator';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/places" element={<Places />} />
          <Route path="/shopping" element={<Shopping />} />
          <Route path="/translator" element={<Translator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;