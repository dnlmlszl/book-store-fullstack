import { useQuery } from '@apollo/client';
import { ALL_AUTHORS } from '../queries/queries';
import EditAuthor from '../components/EditAuthor';

const Authors = () => {
  const { loading, error, data } = useQuery(ALL_AUTHORS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading authors</p>;

  return (
    <section className="shadow-md rounded-sm p-4">
      <article className="my-4 max-w-3xl mx-auto">
        <h2 className="text-3xl text-slate-700 tracking-wider text-center mb-6">
          Authors
        </h2>
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <th className="text-left text-slate-700 p-2 border-2 border-slate-700">
                Name
              </th>
              <th className="text-left text-slate-700 p-2 border-2 border-slate-700">
                Born
              </th>
              <th className="text-left text-slate-700 p-2 border-2 border-slate-700">
                Books
              </th>
            </tr>
            {data.allAuthors.map((author) => (
              <tr key={author.id}>
                <td className="text-left p-2 border-2 border-slate-700">
                  {author.name}
                </td>
                <td className="text-left p-2 border-2 border-slate-700">
                  {author.born}
                </td>
                <td className="text-left p-2 border-2 border-slate-700">
                  {author.bookCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
      <EditAuthor />
    </section>
  );
};

export default Authors;
