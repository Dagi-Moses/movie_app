import "dotenv/config";

export default {
  expo: {
    name: "MovieApp",
    slug: "movie-app",
    plugins: ["expo-router"],
    extra: {
      EXPO_PUBLIC_MOVIE_API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
      EXPO_PUBLIC_APPWRITE_PROJECT_ID:
        process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
      EXPO_PUBLIC_APPWRITE_MOVIES_DB_ID:
        process.env.EXPO_PUBLIC_APPWRITE_MOVIES_DB_ID,
      EXPO_PUBLIC_APPWRITE_METRICS_COLLECTION:
        process.env.EXPO_PUBLIC_APPWRITE_METRICS_COLLECTION,

      EXPO_PUBLIC_TMDB_API_KEY: process.env.EXPO_PUBLIC_TMDB_API_KEY,

      eas: {
        projectId: "5bbc5dee-0a28-4ac1-b431-a844e890647b",
      },
    },
  },
};
