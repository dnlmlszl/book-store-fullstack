import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries/queries';

const NewBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
  });

  const submit = async (event) => {
    event.preventDefault();

    console.log('add book...');

    addBook({
      variables: { title, published: parseInt(published), author, genres },
    });

    setTitle('');
    setPublished('');
    setAuthor('');
    setGenres([]);
    setGenre('');
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre('');
  };

  return (
    <section className="shadow-md rounded-sm p-4">
      <article className="my-4 max-w-3xl mx-auto">
        <h2 className="text-3xl text-slate-700 tracking-wider text-center mb-2">
          Add new Book
        </h2>
        <form onSubmit={submit}>
          <div className="mb-4">
            Title
            <input
              value={title}
              className="w-full p-2 border-2 border-slate-300 rounded-sm"
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div className="mb-4">
            Author
            <input
              value={author}
              className="w-full p-2 border-2 border-slate-300 rounded-sm"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div className="mb-4">
            Published
            <input
              type="number"
              value={published}
              className="w-full p-2 border-2 border-slate-300 rounded-sm"
              onChange={({ target }) => setPublished(target.value)}
            />
          </div>
          <div className="mb-4">
            Genres
            <input
              value={genre}
              className="w-full p-2 border-2 border-slate-300 rounded-sm"
              onChange={({ target }) => setGenre(target.value)}
            />
            <button
              onClick={addGenre}
              type="button"
              className="py-2 px-4 my-4 bg-slate-700 text-white border-none rounded-sm cursor-pointer hover:bg-slate-900 hover:text-gray-300 transition-colors duration-300"
            >
              Add genre
            </button>
          </div>
          <div className="mb-4">Genres: {genres.join(' ')}</div>
          <button
            type="submit"
            className="py-2 px-4 my-2 bg-slate-700 text-white border-none rounded-sm cursor-pointer hover:bg-slate-900 hover:text-gray-300 transition-colors duration-300"
          >
            Create book
          </button>
        </form>
      </article>
    </section>
  );
};

export default NewBook;
