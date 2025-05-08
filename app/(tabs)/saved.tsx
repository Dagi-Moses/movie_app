import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies, getSavedMovies } from "@/services/api";
import { useFocusEffect } from '@react-navigation/native';
import { useState, useCallback, useEffect } from 'react';
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";

export default function Saved() {
  const router = useRouter();

  const [movies, setMovies] = useState<MovieDetails[]>([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [moviesError, setMoviesError] = useState<Error | null>(null);




  useFocusEffect(
    useCallback(() => {
      setMoviesLoading(true);
      getSavedMovies()
        .then(setMovies)
        .catch((err) => setMoviesError(err))
        .finally(() => setMoviesLoading(false));
    }, [])
  );


  return (
    <View
      className="flex-1 bg-primary"
    >
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView nestedScrollEnabled={false}
        className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}>
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        {moviesLoading ? (<ActivityIndicator
          size="large"
          color="#0000ff"
          className="mt-10 self-center"

        />) :
          moviesError ? (
            <Text> {moviesError?.message}</Text>
          )
            : (<View
              className="flex-1 mt-5"
            >





              {movies.length > 0 ? (
                <>
                  <Text
                    className="text-lg text-white font-bold mt-5 mb-3"
                  >
                    Saved Movies
                  </Text>

                  <FlatList
                    keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                    data={movies}
                    renderItem={({ item }) => (
                      <MovieCard
                        isBookmarked={true} genre_ids={[]} {...item} />
                    )}
                    numColumns={3}
                    columnWrapperStyle={{
                      justifyContent: "flex-start",
                      gap: 20,
                      paddingRight: 5,
                      marginBottom: 10,

                    }}

                    className="mt-2 pb-32"
                    scrollEnabled={false}
                  />
                </>
              ) : (
                <View className="flex-1 justify-center items-center ">
                  <Text className="text-gray-500 text-base ">
                    You have no saved movies yet.
                  </Text>
                </View>
              )


              }

            </View>)}

      </ScrollView>

    </View>
  );
}
