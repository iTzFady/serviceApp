import { fonts } from "@/theme/fonts";
import { shadow } from "@/theme/styles";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import RequestState from "./RequestState";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const defaultProfilePic = require("@/assets/images/default-profile.png");
export default function LogCard({
  clientName,
  workerName,
  rating,
  request,
  dateTime,
  profilePicUrl,
  status,
  onReportPress,
  onRatingPress,
}) {
  return (
    <View style={styles.container}>
      <RequestState style={styles.requestState} state={status} />
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.requestText}>
          {request}
        </Text>
        <View
          style={{
            flexDirection: "row-reverse",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text style={styles.nameText}>{clientName}</Text>
          <FontAwesome name="long-arrow-left" size={20} color="black" />
          <Text style={styles.nameText}>{workerName}</Text>
        </View>
        <Text style={styles.dateText}>{dateTime}</Text>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={onRatingPress}>
            <MaterialIcons name="rate-review" size={24} color="black" />
            <Text style={styles.buttonText}>تقيم</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={onReportPress}>
            <MaterialIcons name="report" size={24} color="black" />
            <Text style={styles.buttonText}>ابلغ عن مستخدم</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={
            profilePicUrl
              ? { uri: `${apiUrl}${profilePicUrl}` }
              : defaultProfilePic
          }
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.ratingContainer}>
          <MaterialCommunityIcons
            name="star"
            size={18}
            color="rgba(237, 237, 14, 0.81)"
          />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    marginVertical: 8,
    borderRadius: 5,
    ...shadow,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  requestText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: "black",
    textAlign: "right",
    overflow: "hidden",
  },

  nameText: {
    fontFamily: fonts.light,
    fontSize: 13,
    color: "black",
    textAlign: "right",
    marginTop: 4,
  },

  dateText: {
    fontFamily: fonts.light,
    fontSize: 13,
    color: "black",
    textAlign: "right",
    marginTop: 4,
  },

  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  ratingText: {
    fontFamily: fonts.light,
    fontSize: 14,
    color: "black",
    marginLeft: 4,
  },
  requestState: {
    position: "absolute",
    left: 20,
    top: 20,
    zIndex: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginBlock: 10,
    gap: 5,
    flex: 1,
  },
  button: {
    backgroundColor: "rgba(159, 223, 105, 1)",
    width: "50%",
    flexDirection: "row-reverse",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
  },
  buttonText: {
    fontFamily: fonts.extraLight,
    fontSize: 12,
  },
});
