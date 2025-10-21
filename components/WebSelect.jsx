import { fonts } from "@/theme/fonts";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

function WebSelect({ data, value, onChange, label, placeHolder }) {
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
    fontFamily: fonts.medium,
  },
  select: {
    width: "100%",
    height: 25,
    fontSize: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontFamily: fonts.extraLight,
    textAlign: "right",
    writingDirection: "rtl",
  },
});
export default memo(WebSelect);
