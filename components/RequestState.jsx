import { fonts } from "@/theme/fonts";
import Octicons from "@expo/vector-icons/Octicons";
import { StyleSheet, Text, View } from "react-native";

export default function RequestState({ state, style }) {
  const renderState = () => {
    if (state === "Pending") {
      return (
        <>
          <View
            style={[style, styles.container, { backgroundColor: "#FF8F00" }]}
          >
            <Text style={styles.text}>قيد الانتظار</Text>
            <Octicons name="dot-fill" size={24} color="#fff" />
          </View>
        </>
      );
    }
    if (state === "Accepted") {
      return (
        <>
          <View
            style={[style, styles.container, { backgroundColor: "#558B2F" }]}
          >
            <Text style={styles.text}>تم القبول</Text>
            <Octicons name="dot-fill" size={24} color="#fff" />
          </View>
        </>
      );
    }
    if (state === "Completed") {
      return (
        <>
          <View
            style={[style, styles.container, { backgroundColor: "#8527c0ff" }]}
          >
            <Text style={styles.text}>اكتمل</Text>
            <Octicons name="dot-fill" size={24} color="#fff" />
          </View>
        </>
      );
    }
    if (state === "Canceled") {
      return (
        <>
          <View
            style={[style, styles.container, { backgroundColor: "#C62828" }]}
          >
            <Text style={styles.text}>تم الالغاء</Text>
            <Octicons name="dot-fill" size={24} color="#fff" />
          </View>
        </>
      );
    }
  };
  return renderState();
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  text: {
    color: "#fff",
    fontSize: 10,
    fontFamily: fonts.bold,
  },
});
