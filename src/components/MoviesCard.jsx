import React from "react";

const MoviesCard = ({
  movie: {
    poster_path,
    title,
    vote_average,
    original_language,
    release_date,
    overview,
    adult,
  },
}) => {
  return (
    <div className="group relative">
      <div className="movie-card transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-2xl">
        <img
          src={
            poster_path
              ? adult === false
                ? `https://image.tmdb.org/t/p/w500/${poster_path}`
                : "./No-Poster.png"
              : "./No-Poster.png"
          }
          alt={title}
        />
        <div className="mt-4">
          <h3>{title}</h3>
          <div className="content">
            <div className="rating ">
              <img src="./star.svg" alt="star-icon" />
              <span>•</span>
              <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>

              <span>•</span>
              <p className="lang">{original_language}</p>

              <span>•</span>
              <p className="year">
                {release_date ? release_date.split("-")[0] : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviesCard;
