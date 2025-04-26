import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CreateCV from './pages/CreateCV';
import EditCV from './pages/EditCV';
import ViewCV from './pages/ViewCV';
import Register from './pages/Register';
import Navbar from './components/ui/Navbar';
import { CVProvider } from './context/CVContext';
import './styles/index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const handleLogin = (id) => {
    localStorage.setItem('userId', id);
    setUserId(id);
  };

  return (
    <CVProvider>
      <Router>
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/register"
              element={!userId ? <Register onLogin={handleLogin} /> : <Navigate to="/" />}
            />
            <Route path="/" element={userId ? <Home /> : <Navigate to="/register" />} />
            <Route path="/create" element={userId ? <CreateCV /> : <Navigate to="/register" />} />
            <Route path="/edit/:id" element={userId ? <EditCV /> : <Navigate to="/register" />} />
            <Route path="/view/:id" element={userId ? <ViewCV /> : <Navigate to="/register" />} />
          </Routes>
        </main>
      </div>
    </Router>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </CVProvider>
  );
}

export default App;
