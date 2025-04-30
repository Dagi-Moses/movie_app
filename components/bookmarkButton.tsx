import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { saveMovie, removeMovie, getSavedMovies } from "@/services/api";
import { TouchableOpacity } from "react-native";

const BookmarkButton = ({ movie }: { movie: MovieDetails }) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkIfSaved = async () => {
      const saved = await getSavedMovies("");
      const exists = saved.some((m) => m.id === movie.id);
      setIsSaved(exists);
    };

    checkIfSaved();
  }, []);

  const toggleSave = async () => {
    if (isSaved) {
      await removeMovie(movie.id);
    } else {
      await saveMovie(movie);
    }
    setIsSaved((prev) => !prev);
  };

  return (
    <TouchableOpacity className="ml-auto items-center" onPress={toggleSave}>
      <Ionicons
        name={isSaved ? "bookmark" : "bookmark-outline"}
        size={25}
        color="#D1B3FF"
      />
    </TouchableOpacity>
  );
};

export default BookmarkButton;
