import React from "react";
import "./index.css";
import { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { getTrendingMovies, updateSearchCount } from "./appwrite";
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};
function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("null");
  const [debounedSearchTerm,setDebouncedSearchTerm]=useState('');
  const [trendingMovies,setTrendingMovies]=useState([]);
  //Debounce the search term to prevent making too many API requests
  //by waiting for the user to stop typing for 1700ms 2 seconds
  useDebounce(()=> setDebouncedSearchTerm(searchTerm),1000,[searchTerm]);
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchMovies = async (query='') => {
    try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      if (data.response === "False") {
        setErrorMessage("No movies found");
        setMovieList([]);
        return;
      }
      setMovieList(data.results);
      //if their is a query and result
      if(query && data.results.length>0){
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.log(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies please try again later");
    } finally {
      setIsLoading(false);
    }
  };
  const loadTrendingMovies = async () =>{
    try{
       const movies = await getTrendingMovies();
       setTrendingMovies(movies);
    }catch(error){
      console.log(error);
    }
  }
  useEffect(()=>{
    loadTrendingMovies();
  },[]);
  useEffect(() => {
    setIsLoading(true);
    setErrorMessage("");
    fetchMovies(debounedSearchTerm);
  }, [debounedSearchTerm]);
  return (
    <main>
      <div className="pattern bg-hero_bg" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        {trendingMovies? (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                     <p>{index + 1}</p>
                     <img src={movie.poster_url} alt="{{movie.title}}" />
                </li>
              ))}
            </ul>
          </section>
        ):(<p>test</p>)}
        <section className="all-movies text-center mx-auto">
          <h2 className="mt-[40px] ">All Movies</h2>
          {isLoading ? (
               <Spinner/>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie}/>
              ))}
            </ul>
          )}
          ;
        </section>
      </div>
    </main>
  );
}
export default App;
