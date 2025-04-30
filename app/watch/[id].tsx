import { TMDB_CONFIG } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert, Text, Image, TouchableOpacity, SafeAreaView } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const WatchMovie = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [videoKey, setVideoKey] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const fetchTrailer = async () => {
            try {
                const res = await fetch(
                    `${TMDB_CONFIG.BASE_URL}/movie/${id}/videos?api_key=${TMDB_CONFIG.TMDB_API_KEY}`
                );

                console.log("response: ", res)
                const json = await res.json();
                // console.log("\njson: ", json)
                // Handle case if there are no trailers
                const trailer = json.results?.find(
                    (vid: { type: string; site: string }) => vid.type === 'Trailer' && vid.site === 'YouTube'
                );

                if (trailer) {
                    setVideoKey(trailer.key);
                } else {
                    setHasError(true);  // Trailer not available
                }
            } catch (err) {
                console.error(err);
                setHasError(true);  // Failed to fetch trailer
            } finally {
                setLoading(false);
            }
        };

        fetchTrailer();
    }, [id]);


    if (loading)
        return (
            <SafeAreaView className="bg-primary flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="gray" />
            </SafeAreaView>
        );


    return (
        <SafeAreaView className="bg-primary flex-1">
            <View className="bg-primary flex-1 justify-center ">
                {videoKey ? (
                    <YoutubePlayer
                        height={300}
                        play={true}
                        videoId={videoKey}
                    />

                    // <YoutubePlayer height={300} videoId={videoKey} />
                ) : hasError ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                        <Ionicons name="videocam-off" size={100} color="gray" />
                        <Text style={{ color: 'gray', marginTop: 10 }}>Trailer Not Available</Text>

                    </View>
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 20 }}>Loading...</Text>
                    </View>
                )}
                <TouchableOpacity
                    className="absolute top-10 left-0 right-0 mx-5  rounded-lg py-3.5 flex flex-row items-center z-50"
                    onPress={router.back}
                >
                    <Ionicons name="arrow-back" size={24} color="gray" />
                    <Text className="text-gray-500 font-semibold text-base ml-2">Go Back</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default WatchMovie;


// app/movies/watch/[id].tsx



// const WatchScreen = () => {
//     const { id } = useLocalSearchParams();

//     return (
//         <View
//             style={{
//                 flex: 1,
//                 justifyContent: "center",
//                 alignItems: "center",
//                 backgroundColor: "#000",
//             }}
//         >
//             <Text style={{ color: "white", fontSize: 20 }}>
//                 Movie ID: {id}
//             </Text>
//         </View>
//     );
// };

// export default WatchScreen;
