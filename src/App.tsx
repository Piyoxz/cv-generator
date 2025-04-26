import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CreateCV from './pages/CreateCV';
import EditCV from './pages/EditCV';
import ViewCV from './pages/ViewCV';
import Register from './pages/Register';
import Navbar from './components/ui/Navbar';
import { CVProvider } from './context/CVContext';
import './styles/index.css';

function App() {
  const userId = localStorage.getItem('userId');

  return (
    <CVProvider>
      <Router>
        <div className="min-h-screen bg-neutral-50">
          {userId && <Navbar />}
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={userId ? <Home /> : <Navigate to="/register" replace />} />
              <Route path="/register" element={!userId ? <Register /> : <Navigate to="/" replace />} />
              <Route path="/create" element={userId ? <CreateCV /> : <Navigate to="/register" replace />} />
              <Route path="/edit/:id" element={userId ? <EditCV /> : <Navigate to="/register" replace />} />
              <Route path="/view/:id" element={userId ? <ViewCV /> : <Navigate to="/register" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CVProvider>
  );
}

export default App;
