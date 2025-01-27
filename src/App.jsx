import React, { useEffect, useState } from "react";
import "./index.css";
import Serach from "./components/Serach";
import Spinner from "./components/Spinner";
import MoviesCard from "./components/MoviesCard";
import { useDebounce } from "react-use";
import { use } from "react";
import { updateSearchCount , getTrendingMovies} from "./appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchItem, setSearchItem] = useState("");
  const [debouncedSearchItem, setDebouncedSearchItem] = useState(searchItem);

  const [moviesList, setMoviesList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isloading, setIsLoading] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState([]);
  const[errorTrending, setErrorTrending] = useState("");

  useDebounce(
    () => {
      setDebouncedSearchItem(searchItem);
    },
    1000,
    [searchItem]
  );

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURI(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();

      if (data.response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
      }

      setMoviesList(data.results);
      if (query && data.results.length > 0) {
        updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to fetch movies");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrendingMovies = async () => {
    try{
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    }catch(error){
      console.error(error);
      setErrorTrending("Failed to fetch trending movies");
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchItem);
  }, [debouncedSearchItem]);

  useEffect(()=>{
    fetchTrendingMovies();
  },[])

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="movie-images" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassel
          </h1>
          <Serach serachItem={searchItem} setSearchItem={setSearchItem} />
        </header>
        {trendingMovies.length > 0 ? searchItem === ''?  (
          <section className = "trending">
            <h2>Trending Movies</h2>
            <ul>
              {
                trendingMovies.map((movie,index)=>(
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.searchTerm}/>
                  </li>
                ))
              }
            </ul>
          </section>
        ):null:null}

        <section className="all-movies">
          <h2>Popular Movie List</h2>
          {isloading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {moviesList.map((movie) => (
                <MoviesCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
