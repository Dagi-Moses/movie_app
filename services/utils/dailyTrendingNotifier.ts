import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import { fetchMovies } from "../api"; // adjust the path to your fetchMovies
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKGROUND_TASK_NAME = "daily-movie-notification";
const FIRST_RUN_KEY = "hasLaunchedBefore";

TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  try {
    const movies = await fetchMovies({ query: "" });
    const topMovie = movies?.[0];

    if (topMovie) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🎬 Top Trending Movie Today",
          body: `${topMovie.title} — now trending on TMDB!`,
          data: { movieId: topMovie.id },
        },
        trigger: null,
      });
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (err) {
    console.error("Background fetch failed:", err);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const registerBackgroundFetchAsync = async () => {
  const hasLaunched = await AsyncStorage.getItem(FIRST_RUN_KEY);

  if (!hasLaunched) {
    const movies = await fetchMovies({ query: "" });
    const topMovie = movies?.[0];

    if (topMovie) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🎬 Welcome!",
          body: `${topMovie.title} is trending today on TMDB.`,
          data: { movieId: topMovie.id },
        },
        trigger: null,
      });
    }

    await AsyncStorage.setItem(FIRST_RUN_KEY, "true");
  }

  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    BACKGROUND_TASK_NAME
  );
  if (!isRegistered) {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK_NAME, {
      minimumInterval: 60 * 60 * 24, // 24 hours
      stopOnTerminate: false,
      startOnBoot: true,
    });
  }
};

export const sendDailyMovieNotification = async () => {
  const movies = await fetchMovies({ query: "" });
  const topMovie = movies?.[0];

  if (topMovie) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🎬 Top Trending Movie Today",
        body: `${topMovie.title} — now trending on TMDB!`,
        data: { movieId: topMovie.id },
      },
      trigger: null,
    });
  }
};
