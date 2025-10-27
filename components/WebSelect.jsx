import { fonts } from "@/theme/fonts";
import { shadow } from "@/theme/styles";
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
        placeholder={placeHolder}
      >
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
    ...shadow,
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
