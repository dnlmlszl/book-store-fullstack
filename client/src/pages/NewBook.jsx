import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries/queries';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const NewBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const { setErrorMessage } = useUser();

  const navigate = useNavigate();

  const [addBook, { loading, error }] = useMutation(ADD_BOOK, {
    update: (cache, { data: addBook }) => {
      const queryBooks = ALL_BOOKS;
      cache.updateQuery({ query: queryBooks }, (data) => ({
        allBooks: [addBook, ...data.allBooks],
      }));

      const queryAuthors = ALL_AUTHORS;
      cache.updateQuery({ query: queryAuthors }, (data) => {
        if (
          !data.allAuthors.some((author) => author.name === addBook.author.name)
        ) {
          return {
            allAuthors: [addBook.author, ...data.allAuthors],
          };
        }

        return {
          allAuthors: data.allAuthors.map((author) => {
            if (author.name === addBook.author.name) {
              return {
                ...author,
                bookCount: author.bookCount + 1,
              };
            }

            return author;
          }),
        };
      });
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
