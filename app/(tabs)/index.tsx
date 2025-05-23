import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";

import Constants from "expo-constants";
console.log("TMDB KEY IN PRODUCTION:", Constants.expoConfig?.extra?.EXPO_PUBLIC_TMDB_API_KEY);


export default function Index() {
  const router = useRouter();
  const { data: trendingMovies, loading: trendingLoading, error: trendingError } = useFetch(getTrendingMovies);

  const { data: movies, loading: moviesLoading, error: moviesError } = useFetch(() => fetchMovies({ query: "" }));


  return (
    <View
      className="flex-1 bg-primary"
    >
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView nestedScrollEnabled={false}
        className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}>
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        {moviesLoading || trendingError ? (<ActivityIndicator
          size="large"
          color="#0000ff"
          className="mt-10 self-center"

        />) :
          moviesError || trendingError ? (
            //   <Text> {moviesError?.message || trendingError?.message}</Text>
            <View className="flex-1 justify-center items-center ">
              <Text className="text-gray-500 text-base ">
                {moviesError?.message || trendingError?.message}
              </Text>
            </View>
          )
            : (<View
              className="flex-1 mt-5"
            >
              <SearchBar
                placeholder="Search for a movie"
                onPress={() => router.push("/search")}

              />

              {trendingMovies && (
                <View className="mt-5">
                  <Text className="text-lg text-white font-bold ">
                    Trending Movies
                  </Text>
                  <FlatList
                    keyExtractor={(item, index) => item.movie_id?.toString() || index.toString()}
                    data={trendingMovies}
                    renderItem={({ item, index }) => (
                      <TrendingCard movie={item} index={index} />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}

                    ItemSeparatorComponent={() => <View className="w-4" />} // Optional spacing

                    className="mb-4 mt-3"

                  />

                </View>
              )}

              <>
                <Text
                  className="text-lg text-white font-bold mt-5 mb-3"
                >
                  Latest Movies
                </Text>
                <FlatList
                  keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                  data={movies}
                  renderItem={({ item }) => (
                    <MovieCard
                      {...item}
                    />
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
            </View>)}

      </ScrollView>

    </View>
  );
}
