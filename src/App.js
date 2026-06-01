import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Graph from './pages/Graph';
import Manage from './pages/Manage';
import Scanner from './pages/Scanner';
import Setting from './pages/Setting';
import Navbar from './components/Navbar';
import Realtime from './pages/Realtime';
import Product from './pages/Product';
import Notice from './pages/Notice';

function App() {
  return (
    <BrowserRouter>
      <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-16">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/graph" element={<Graph />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/realtime" element={<Realtime />} />
          <Route path="/product" element={<Product />} />
          <Route path="/notice" element={<Notice />} />
        </Routes>
        <Navbar />
      </div>
    </BrowserRouter>
  );
}

export default App;