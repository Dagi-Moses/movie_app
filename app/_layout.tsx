import { Stack, useRouter } from "expo-router";
import "./globals.css";
import { StatusBar, Alert, Platform } from "react-native";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useEffect } from 'react';
import { registerBackgroundFetchAsync } from "@/services/utils/dailyTrendingNotifier";

// Foreground notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await registerForPushNotificationsAsync();
      await registerBackgroundFetchAsync();
    })();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const movieId = response.notification.request.content.data.movieId;
        if (movieId) {
          router.push(`/movies/${movieId}`);
        }
      }
    );
    return () => subscription.remove();
  }, []);

  return (
    <>
      <StatusBar hidden={true} />
      <Stack >

        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="movies/[id]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="watch/[id]"
          options={{ headerShown: false }}
        />
      </Stack>

    </>
  );
}

const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) {
    console.warn("Push notifications require a physical device");
    Alert.alert("Warning", "Push notifications won't work on simulators or web.");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn("Notifications permission not granted");
    Alert.alert("Permission Denied", "You need to allow notifications to receive updates.");
    return;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  console.log("✅ Notification permissions granted");
};

















// import { Stack, useRouter } from "expo-router";
// import "./globals.css";
// import { StatusBar } from "react-native";
// import * as Notifications from 'expo-notifications';
// import * as Device from 'expo-device';
// import { Platform } from 'react-native';
// import { useEffect } from 'react';
// import { registerBackgroundFetchAsync } from "@/services/utils/dailyTrendingNotifier";


// // Foreground notification behavior
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });





// export default function RootLayout() {
//   useEffect(() => {
//     registerForPushNotificationsAsync();
//     registerBackgroundFetchAsync();
//   }, []);


//   const router = useRouter();

//   useEffect(() => {
//     const subscription = Notifications.addNotificationResponseReceivedListener(
//       (response) => {
//         const movieId = response.notification.request.content.data.movieId;
//         if (movieId) {
//           router.push(`/movies/${movieId}`);
//         }
//       }
//     );

//     return () => subscription.remove();
//   }, []);
//   return (
//     <>
//       <StatusBar hidden={true} />
//       <Stack >

//         <Stack.Screen
//           name="(tabs)"
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="movies/[id]"
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="watch/[id]"
//           options={{ headerShown: false }}
//         />
//       </Stack>

//     </>)
// }



// const registerForPushNotificationsAsync = async () => {
//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       console.warn('Permission not granted for notifications');
//       return;
//     }
//   } else {
//     console.warn('Push notifications require a physical device');
//   }
// };

