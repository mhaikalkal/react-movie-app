import React, { useState, useEffect } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount, getTrendingMovies } from "./appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTION = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};
const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState([]);

  // custom hooks dari react-use buat nge delay execute search, karena tiap value searchbar ganti dia immediately fetch ulang.
  // maka kita bikin delay, biar gak makan performance + overload API request
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTION);

      // URL Error Handler
      if (!response.ok) {
        throw new Error("Failed to fetch movies data. (URL Error)");
      }

      const data = await response.json();

      // No Data Error Handler
      if (data === "false") {
        setErrorMessage("Failed to fetch movies data (Data Error).");
        setMovieList([]);
        return;
      }

      // console.log(data.results);
      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      // console.error(error);
      setErrorMessage("Failed to fetch movies data.");
    } finally {
      // na matter the results are, execute this after all done.
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      console.log(movies);
      setTrendingMovies(movies);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);
  // awalnya langsung pake searchTerm
  // ketika search movie, maka fetch ulang datta movie nya
  // karena performance jelek, kita debounce dulu biar ada delay ketika execute typing kita di search bar

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          {/* hero */}
          <header>
            <img src="./hero.png" alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without the Hassle
            </h1>

            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          {/* for you movie, based on search */}
          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>
              <ul>
                {trendingMovies.map((movie, index) => (
                  // pake dollar karena returnnya emang dari database langsung, bukan via json/api
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* all movies */}
          <section className="all-movies">
            <h2>All Movies</h2>
            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-600">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;
