import Constants from "expo-constants";
import { Client, Databases, ID, Query } from "react-native-appwrite";

const {
  EXPO_PUBLIC_APPWRITE_MOVIES_DB_ID,
  EXPO_PUBLIC_APPWRITE_METRICS_COLLECTION,
} = Constants.expoConfig?.extra ?? {};

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(
      EXPO_PUBLIC_APPWRITE_MOVIES_DB_ID,
      EXPO_PUBLIC_APPWRITE_METRICS_COLLECTION,
      [Query.equal("searchTerm", query)]
    );

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        EXPO_PUBLIC_APPWRITE_MOVIES_DB_ID,
        EXPO_PUBLIC_APPWRITE_METRICS_COLLECTION,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(
        EXPO_PUBLIC_APPWRITE_MOVIES_DB_ID,
        EXPO_PUBLIC_APPWRITE_METRICS_COLLECTION,
        ID.unique(),
        {
          searchTerm: query,
          movie_id: movie.id,
          title: movie.title,
          count: 1,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }
      );
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  console.log("starting");
  try {
    console.log("started");
    const result = await database.listDocuments(
      EXPO_PUBLIC_APPWRITE_MOVIES_DB_ID,
      EXPO_PUBLIC_APPWRITE_METRICS_COLLECTION,
      [Query.limit(5), Query.orderDesc("count")]
    );

    console.log("Trending result", result);

    return result.documents as unknown as TrendingMovie[];
  } catch (e) {
    console.log("trending error", e);
    return undefined;
  }
};
