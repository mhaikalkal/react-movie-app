import React from "react";

const MovieCard = (props) => {
  // <MovieCard key={movie.id} movie={movie} /> dari data.map
  // kita destructuring bahwa si movie itu props.
  // karena si movie juga merupakan object, dan daripada kita panggil movie.title, movie.rating, gak efektif.
  // maka kita destructuring aja lagi, biar bisa panggil title, rating, etc
  const {
    movie: {
      title,
      vote_average,
      poster_path,
      release_date,
      original_language,
    },
  } = props;

  return (
    <div className="movie-card">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "./no-movie.png"
        }
        alt={title}
      />

      <div className="mt-4">
        <h3>{title}</h3>

        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Star Icon" />
            <span>{vote_average ? vote_average.toFixed(1) : "N/A"}</span>
          </div>

          <span>•</span>

          <p className="lang">{original_language}</p>

          <span>•</span>
          <p className="year">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
