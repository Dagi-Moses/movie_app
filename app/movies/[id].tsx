import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Link, RelativePathString, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchMovieDetails, saveMovie } from "@/services/api";
import { icons } from "@/constants/icons";
import useFetch from "@/services/useFetch";
import BookmarkButton from "@/components/bookmarkButton";
import * as TaskManager from 'expo-task-manager';
import { sendDailyMovieNotification } from "@/services/utils/dailyTrendingNotifier";



interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();



  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );

  if (loading)
    return (
      <SafeAreaView className="bg-primary flex-1 justify-center items-center">
        <ActivityIndicator />
      </SafeAreaView>
    );



  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />
          <Link
            href={`/watch/${id}` as unknown as RelativePathString}
            asChild
          >
            <TouchableOpacity className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center"


            >
              <Image
                source={icons.play}
                className="w-6 h-7 ml-1"
                resizeMode="stretch"
              />
            </TouchableOpacity>
          </Link>
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>
          <View className="flex-row items-center justify-between w-full">
            <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
              <Image source={icons.star} className="size-4" />

              <Text className="text-white font-bold text-sm">
                {Math.round(movie?.vote_average ?? 0)}/10
              </Text>

              <Text className="text-light-200 text-sm">
                ({movie?.vote_count} votes)
              </Text>
            </View>
            <BookmarkButton movie={movie} />

          </View>
          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(
                (movie?.revenue ?? 0) / 1_000_000
              )} million`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute top-10 left-0 right-0 mx-5  rounded-lg py-3.5 flex flex-row items-center z-50"
        onPress={router.back}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text className="text-white font-semibold text-base ml-2">Go Back</Text>
      </TouchableOpacity>


    </View>
  );
};

export default Details;