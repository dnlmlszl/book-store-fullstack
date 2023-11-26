import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries/queries';

const Books = () => {
  const { loading, error, data } = useQuery(ALL_BOOKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading books: {error.message}</p>;

  return (
    <section className="shadow-md rounded-sm p-4">
      <article className="my-4 max-w-3xl mx-auto">
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
            {data.allBooks.map((book) => (
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
