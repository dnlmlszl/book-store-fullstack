const BooksByGenre = ({ genres, activeGenre, onClick }) => {
  const isActive = (genre) =>
    genre === activeGenre
      ? 'capitalize cursor-pointer text-slate-700 px-2 border-b-2 border-slate-700 rounded transition duration-300 ease-in-out'
      : 'capitalize cursor-pointer text-slate-700 px-2';
  return (
    <section className="my-4">
      <ul className="flex flex-wrap gap-2">
        {genres.map((genre, index) => (
          <span
            className={isActive(genre)}
            key={index}
            onClick={() => onClick(genre)}
          >
            {genre}
          </span>
        ))}
      </ul>
    </section>
  );
};

export default BooksByGenre;
