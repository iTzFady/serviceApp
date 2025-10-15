import { fonts } from "@/theme/fonts";
import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, View } from "react-native";

export default function Avaliablity({ isAvaliable, style }) {
  return (
    <View
      style={[
        isAvaliable
          ? { backgroundColor: "rgba(127, 186, 78, 1)" }
          : { backgroundColor: "rgba(96, 98, 94, 1)" },
        style,
        styles.container,
      ]}
    >
      <Text style={styles.text}>
        {isAvaliable ? "متاح الآن" : "غير متاح الان"}
      </Text>
      <Feather name="user" size={12} color="white" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    alignContent: "center",
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  text: {
    color: "#fff",
    fontSize: 10,
    fontFamily: fonts.bold,
    marginLeft: 5,
  },
});
