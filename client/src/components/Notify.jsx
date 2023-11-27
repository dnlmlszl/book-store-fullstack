import { useUser } from '../context/UserContext';

export const Notify = () => {
  const { errorMessage } = useUser();

  if (!errorMessage) return null;

  return (
    <div className="rounded-md bg-red-50 p-4">
      <p className="text-sm leading-5 font-medium bg-red-100 text-red-600 p-2 border border-red-600 rounded">
        {errorMessage}
      </p>
    </div>
  );
};
