import { useQuery } from '@apollo/client';
import { ALL_BOOKS, BOOKS_BY_GENRE } from '../queries/queries';
import { useState } from 'react';
import BooksByGenre from '../components/BooksByGenre';
import { useUser } from '../context/UserContext';

const Books = () => {
  const [genre, setGenre] = useState('All');
  const { setErrorMessage } = useUser();
  const {
    loading: allBooksLoading,
    error: allBooksError,
    data: allBooksData,
  } = useQuery(ALL_BOOKS);

  const {
    loading: genreLoading,
    error: genreError,
    data: genreData,
  } = useQuery(BOOKS_BY_GENRE, {
    variables: { genre },
    skip: genre === '' || genre === 'All',
  });

  const handleGenreClick = (g) => {
    setGenre(g);
  };

  let genres = ['All'];
  if (allBooksData) {
    const bookGenres = allBooksData.allBooks.flatMap((book) => book.genres);
    const uniqueGenres = [...new Set(bookGenres)];
    genres = ['All', ...uniqueGenres];
  }

  let books =
    genre === 'All' || genre === ''
      ? allBooksData?.allBooks
      : genreData?.booksByGenre;

  if (allBooksLoading || genreLoading) return <p>Loading...</p>;
  if (allBooksError) {
    setErrorMessage(allBooksError.message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  }
  if (genreError) {
    setErrorMessage(genreError.message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  }

  return (
    <section className="shadow-md rounded-sm p-4">
      <article className="my-4 max-w-3xl mx-auto">
        <BooksByGenre
          genres={genres}
          onClick={handleGenreClick}
          activeGenre={genre}
        />
        <h2 className="text-3xl text-slate-700 tracking-wider text-center mb-6">
          Books
        </h2>

        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <th className="text-left text-slate-700 p-2 border-2 border-slate-700">
                Title
              </th>
              <th className="text-left text-slate-700 p-2 border-2 border-slate-700">
                Author
              </th>
              <th className="text-left text-slate-700 p-2 border-2 border-slate-700">
                Published
              </th>
            </tr>
            {books?.map((book) => (
              <tr key={book.id}>
                <td className="text-left p-2 border-2 border-slate-700">
                  {book.title}
                </td>
                <td className="text-left p-2 border-2 border-slate-700">
                  {book.author.name}
                </td>
                <td className="text-left p-2 border-2 border-slate-700">
                  {book.published}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  );
};

export default Books;
