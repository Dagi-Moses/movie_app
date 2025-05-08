import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const { EXPO_PUBLIC_MOVIE_API_KEY, EXPO_PUBLIC_TMDB_API_KEY } =
  Constants.expoConfig?.extra ?? {};
console.log("API KEY:", Constants.expoConfig?.extra?.EXPO_PUBLIC_MOVIE_API_KEY);

export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: EXPO_PUBLIC_MOVIE_API_KEY,
  TMDB_API_KEY: EXPO_PUBLIC_TMDB_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export const fetchMovies = async ({ query }: { query: string }) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    //@ts-ignore
    throw new Error("Failed to fetch movies", response.statusText);
  }
  const data = await response.json();

  return data.results;
};

export const fetchMovieDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

const SAVED_MOVIES_KEY = "SAVED_MOVIES";

export const saveMovie = async (movie: MovieDetails) => {
  try {
    const stored = await AsyncStorage.getItem(SAVED_MOVIES_KEY);
    const savedMovies = stored ? JSON.parse(stored) : [];

    // Check if already saved
    const exists = savedMovies.some((m: MovieDetails) => m.id === movie.id);
    if (!exists) {
      savedMovies.push(movie);
      await AsyncStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(savedMovies));
    }
  } catch (error) {
    console.error("Error saving movie:", error);
  }
};

export const removeMovie = async (movieId: number) => {
  try {
    const stored = await AsyncStorage.getItem(SAVED_MOVIES_KEY);
    const savedMovies = stored ? JSON.parse(stored) : [];

    const updatedMovies = savedMovies.filter(
      (m: MovieDetails) => m.id !== movieId
    );
    await AsyncStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(updatedMovies));
  } catch (error) {
    console.error("Error removing movie:", error);
  }
};

export const getSavedMovies = async (
  query?: string
): Promise<MovieDetails[]> => {
  try {
    const stored = await AsyncStorage.getItem(SAVED_MOVIES_KEY);
    const savedMovies: MovieDetails[] = stored ? JSON.parse(stored) : [];
    // Check if query is neither null nor an empty string
    if (query && query.trim() !== "") {
      const lowerQuery = query.toLowerCase();
      return savedMovies.filter((movie) =>
        movie.title.toLowerCase().includes(lowerQuery)
      );
    }

    return savedMovies;
  } catch (error) {
    console.error("Error fetching saved movies:", error);
    return [];
  }
};
