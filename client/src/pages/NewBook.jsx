import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries/queries';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { updateCache } from '../utils/updateCacheUtil';

const NewBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const { setErrorMessage } = useUser();

  const navigate = useNavigate();

  const [addBook, { loading, error }] = useMutation(ADD_BOOK, {
    onError: (error) => {
      error.graphQLErrors?.length > 0
        ? setErrorMessage(error.graphQLErrors[0].message)
        : setErrorMessage('An error occured');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    },
    update: (cache, response) => {
      const newBook = response.data.addBook;
      updateCache(cache, { query: ALL_BOOKS }, newBook);

      const existingAuthors = cache.readQuery({ query: ALL_AUTHORS });
      if (existingAuthors) {
        let authorsUpdated = false;
        const updatedAuthors = existingAuthors.allAuthors.map((author) => {
          if (author.name === newBook.author.name) {
            authorsUpdated = true;
            return { ...author, bookCount: author.bookCount + 1 };
          } else {
            return author;
          }
        });

        if (!authorsUpdated) {
          updatedAuthors.push({ ...newBook.author, bookCount: 1 });
        }

        cache.writeQuery({
          query: ALL_AUTHORS,
          data: { allAuthors: updatedAuthors },
        });
      }
    },
    onCompleted: () => navigate('/books'),
  });

  const submit = async (event) => {
    event.preventDefault();

    console.log('book added...');

    try {
      await addBook({
        variables: { title, published: parseInt(published), author, genres },
      });
    } catch (error) {
      console.error('There was an error when adding a book: ', error);
      setErrorMessage(error);
    } finally {
      setTitle('');
      setPublished('');
      setAuthor('');
      setGenres([]);
      setGenre('');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre('');
  };

  if (loading) return <p>Loading...</p>;

  if (error) {
    setErrorMessage(error.message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  }

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
