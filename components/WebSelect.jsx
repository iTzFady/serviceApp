import {
  Cairo_200ExtraLight,
  Cairo_500Medium,
  useFonts,
} from "@expo-google-fonts/cairo";
import { StyleSheet, Text, View } from "react-native";
export default function WebSelect({
  data,
  value,
  onChange,
  label,
  placeHolder,
}) {
  const [loaded, error] = useFonts({
    Cairo_200ExtraLight,
    Cairo_500Medium,
  });
  if (!loaded && !error) {
    return null;
  }
  return (
    <View style={styles.containter}>
      {label && <Text style={styles.label}>{label}</Text>}
      <select
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        style={styles.select}
      >
        <option value="">{placeHolder}</option>
        {data.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </View>
  );
}
const styles = StyleSheet.create({
  containter: {
    width: "95%",
    marginTop: 10,
    alignSelf: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
  },
  label: {
    textAlign: "right",
    fontSize: 12,
    marginBottom: 5,
    fontFamily: "Cairo_500Medium",
  },
  select: {
    width: "100%",
    height: 25,
    fontSize: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontFamily: "Cairo_200ExtraLight",
    textAlign: "right",
    writingDirection: "rtl",
  },
});
