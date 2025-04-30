import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";

import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";


const Search = () => {

  const [query, setQuery] = useState(""); // Final query to fetch


  const { data: movies, loading: moviesLoading, error: moviesError, refetch, reset } = useFetch(() => fetchMovies({ query }), false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim()) {
        await refetch();

      } else {
        reset()
      }
    }, 800);
    return () => clearTimeout(timeoutId);

  }, [query]);

  useEffect(() => {
    if (movies?.length > 0 && movies?.[0]) {
      updateSearchCount(query, movies[0])
    }
  }, [movies]);


  return (
    <View
      className="flex-1 bg-primary"
    >
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView nestedScrollEnabled={false}
        className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}>
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
        <SearchBar
          placeholder="Search for a movie"
          value={query}
          onChangeText={setQuery}

        />
        <View
          className="flex-1 mt-5"
        >

          {!moviesLoading && !moviesError && movies?.length > 0 && query.trim() !== "" && (
            <Text className="text-xl text-white font-bold mb-2 ">
              Search Results for {" "}
              <Text className="text-accent">
                {query}
              </Text>
            </Text>
          )}


          {moviesLoading ? (

            <ActivityIndicator
              size="large"
              color="#0000ff"
              className="mt-10 self-center"

            />) :
            moviesError ? (
              <Text> {moviesError?.message}</Text>
            )
              : (


                <>

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
                    ListEmptyComponent={
                      !moviesLoading && !moviesError ? (
                        <View className="mt-10 px-5"
                        >
                          <Text className="text-center text-gray-500 justify-center">
                            {query.trim() ? "No movies found..." : "Search to discover movies"}
                          </Text>
                        </View>
                      ) : null}



                  />
                </>
              )}
        </View>

      </ScrollView>

    </View>
  )
}

export default Search

