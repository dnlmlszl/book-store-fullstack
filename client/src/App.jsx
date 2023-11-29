import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';

import NewBook from './pages/NewBook';
import Books from './pages/Books';
import Authors from './pages/Authors';
import PrivateRoute from './pages/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import { Notify } from './components/Notify';
import { useSubscription } from '@apollo/client';
import { ALL_BOOKS, BOOK_ADDED } from './queries/queries';
import { updateCache } from './utils/updateCacheUtil';

function App() {
  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
    },
  });

  return (
    <Router>
      <Navbar />
      <Notify />
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
