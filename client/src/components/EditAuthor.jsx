import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries/queries';

const EditAuthor = () => {
  const [name, setName] = useState('');
  const [born, setBorn] = useState('');

  const { data, loading, error } = useQuery(ALL_AUTHORS);
  const [editAuthor, { data: mutationData, error: mutationError }] =
    useMutation(EDIT_AUTHOR, {
      refetchQueries: [{ query: ALL_AUTHORS }],
    });

  useEffect(() => {
    if (mutationData) {
      console.log('Mutation response:', mutationData);
    }
  }, [mutationData]);

  const authors = data?.allAuthors || [];

  const submit = async (e) => {
    e.preventDefault();

    try {
      editAuthor({ variables: { name, setBornTo: parseInt(born) } });
      console.log(name, born);
    } catch (error) {
      console.error(error);
    } finally {
      setName('');
      setBorn('');
    }
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;
  if (mutationError) return <p>{mutationError.message}</p>;

  return (
    <section className="my-4 max-w-3xl mx-auto">
      <h2 className="text-3xl text-slate-700 tracking-wider text-center mb-2">
        Edit Author
      </h2>
      <form onSubmit={submit}>
        <div className="mb-4">
          Name
          <select
            value={name}
            onChange={({ target }) => setName(target.value)}
            className="w-full p-2 border-2 border-slate-300 rounded-sm"
          >
            <option value="">-</option>
            {authors.map((author) => (
              <option key={author.id} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          Born
          <input
            type="number"
            value={born}
            className="w-full p-2 border-2 border-slate-300 rounded-sm"
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button
          type="submit"
          className="py-2 px-4 my-2 bg-slate-700 text-white border-none rounded-sm cursor-pointer hover:bg-slate-900 hover:text-gray-300 transition-colors duration-300"
        >
          Update author
        </button>
      </form>
    </section>
  );
};

export default EditAuthor;
