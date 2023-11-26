import { NavLink } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Navbar = () => {
  const { currentUser: user, logout } = useUser();

  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-gray-200 font-semibold tracking-widest text-lg border-b-2 border-yellow-500 rounded transition duration-300 ease-in-out'
      : 'text-gray-400 font-medium tracking-widest text-lg hover:text-gray-200 rounded transition duration-300 ease-in-out';
  return (
    <nav className="flex items-center justify-evenly p-4 md:px-6 bg-slate-700 w-full">
      {user ? (
        <>
          <NavLink to="/" className={linkClass}>
            Authors
          </NavLink>
          <NavLink to="/books" className={linkClass}>
            Books
          </NavLink>
          <NavLink to="/addNew" className={linkClass}>
            Add Book
          </NavLink>
          <button
            onClick={logout}
            className="text-gray-400 font-medium tracking-widest text-lg hover:text-gray-200 rounded transition duration-300 ease-in-out"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
          <NavLink to="/register" className={linkClass}>
            Register
          </NavLink>
        </>
      )}
    </nav>
  );
};

export default Navbar;
