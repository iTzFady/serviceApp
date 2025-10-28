import { Regions } from "@/data/regions";
import { fonts } from "@/theme/fonts";
import { shadow } from "@/theme/styles";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { memo, useMemo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Speciality } from "../data/speciality";
import Avaliablity from "./avaliablilty";
import Button from "./Button";
import DynamicIcon from "./DynamicIcon";
const defaultProfilePic = require("../assets/images/default-profile.png");
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

function WorkerCard({
  name,
  workerSpecialty,
  isAvailable,
  averageRating,
  region,
  profilePictureUrl,
  onPress,
}) {
  const work = useMemo(
    () => Speciality.find((w) => w.value === workerSpecialty),
    [workerSpecialty]
  );
  const workerRegion = useMemo(
    () => Regions.find((w) => w.value === region),
    [region]
  );
  return (
    <View style={styles.cardContainer}>
      <View style={styles.workerDataContainer}>
        <Image
          style={styles.image}
          alt="Profile Picture"
          resizeMode="cover"
          source={
            profilePictureUrl
              ? { uri: `${apiUrl}${profilePictureUrl}` }
              : defaultProfilePic
          }
        />
        <Text style={styles.workerName}>{name}</Text>
        <View style={styles.ratingContainer}>
          <View style={{ position: "relative", width: 24, height: 24 }}>
            <MaterialCommunityIcons
              name="star"
              size={24}
              color="rgba(237, 237, 14, 0.81)"
              style={{ position: "absolute" }}
            />
            <MaterialCommunityIcons
              name="star-outline"
              size={24}
              color="black"
              style={{ position: "absolute" }}
            />
          </View>
          <Text style={styles.ratingText}>{averageRating}</Text>
        </View>
        <Avaliablity isAvaliable={isAvailable} style={styles.availability} />
      </View>
      <View style={styles.category}>
        <Text style={styles.categoryText}>{work?.label}</Text>
        <DynamicIcon path={work?.icon} size={18} />
      </View>
      <View style={styles.workerDetails}>
        <Entypo name="location" size={18} color="black" />
        <Text style={[styles.categoryText, { marginRight: 10 }]}>
          الاسكندرية، {workerRegion?.label}
        </Text>
        <View
          style={{
            position: "relative",
            width: 18,
            height: 18,
            marginRight: 10,
          }}
        >
          <MaterialCommunityIcons
            name="phone"
            size={18}
            color="limegreen"
            style={{ position: "absolute" }}
          />
          <MaterialCommunityIcons
            name="phone-outline"
            size={18}
            color="black"
            style={{ position: "absolute" }}
          />
        </View>
        <Text style={[styles.categoryText, { marginRight: 10 }]}>
          01*********
        </Text>
      </View>
      <View style={styles.button}>
        <Button
          text="طلب الخدمه"
          height={25}
          backgroundColor={
            isAvailable ? "rgba(159, 223, 105, 1)" : "rgba(96, 98, 94, 1)"
          }
          color={isAvailable ? "#000" : "#fff"}
          borderRadius={5}
          fontSize={12}
          onPressEvent={onPress}
          disabled={!isAvailable}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    height: 140,
    marginVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 5,
    borderWidth: 1,
    ...shadow,
  },
  image: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  workerDataContainer: {
    flexDirection: "row-reverse",
    alignContent: "center",
    padding: 12,
    width: "100%",
    position: "relative",
    alignItems: "center",
  },
  workerName: {
    fontSize: 12,
    marginRight: 5,
    fontFamily: fonts.medium,
  },
  ratingContainer: {
    marginRight: 15,
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  ratingText: {
    marginRight: 10,
    fontFamily: fonts.light,
    fontSize: 10,
  },
  availability: {
    position: "absolute",
    left: 10,
    top: 12,
    zIndex: 10,
  },
  category: {
    flexDirection: "row-reverse",
    right: 40,
    top: 35,
    zIndex: 10,
    position: "absolute",
    alignItems: "center",
  },
  categoryText: {
    fontFamily: fonts.light,
    fontSize: 10,
    marginLeft: 5,
  },
  workerDetails: {
    flexDirection: "row-reverse",
    marginRight: 15,
    marginBlock: 8,
    alignItems: "center",
  },
  button: {
    padding: 15,
  },
});
export default memo(WorkerCard);
