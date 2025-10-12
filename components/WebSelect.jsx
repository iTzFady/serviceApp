import { StyleSheet, Text, View } from "react-native";
export default function WebSelect({
  data,
  value,
  onChange,
  label,
  placeHolder,
}) {
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
  },
  label: {
    textAlign: "right",
    fontSize: 20,
    marginBottom: 5,
    fontFamily: "Cairo_500Medium",
  },
  select: {
    width: "100%",
    height: 45,
    fontSize: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    fontFamily: "Cairo_200ExtraLight",
    textAlign: "right",
    writingDirection: "rtl",
  },
});
