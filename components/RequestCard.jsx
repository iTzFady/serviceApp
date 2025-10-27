import { fonts } from "@/theme/fonts";
import { shadow } from "@/theme/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const defaultProfilePic = require("@/assets/images/default-profile.png");
export default function RequestCard({
  name,
  rating,
  request,
  dateTime,
  profilePicUrl,
  onPress,
}) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.requestText}>
          {request}
        </Text>
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.dateText}>{dateTime}</Text>
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
    </Pressable>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(17, 125, 129, 0.04)",
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
});
