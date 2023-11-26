import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const PrivateRoute = ({ children }) => {
  const { currentUser: user, loading } = useUser();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace={true} />;
  return children;
};

export default PrivateRoute;
