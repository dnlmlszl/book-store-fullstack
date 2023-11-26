import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';

import NewBook from './pages/NewBook';
import Books from './pages/Books';
import Authors from './pages/Authors';
import PrivateRoute from './pages/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container w-[95%] mx-auto">
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Authors />
              </PrivateRoute>
            }
          />
          <Route
            path="/books"
            element={
              <PrivateRoute>
                <Books />
              </PrivateRoute>
            }
          />
          <Route
            path="/addNew"
            element={
              <PrivateRoute>
                <NewBook />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
