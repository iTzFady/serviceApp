import DynamicIcon from "@/components/DynamicIcon";

import { fonts } from "@/theme/fonts";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function SpecialityChip({
  text,
  iconPath,
  value,
  selected,
  onPressEvent,
}) {
  return (
    <Pressable
      style={[styles.container, selected ? styles.selected : null]}
      onPress={onPressEvent}
    >
      <Text
        style={[styles.textStyle, selected ? { fontFamily: fonts.bold } : null]}
      >
        {text}
      </Text>
      <View style={{ width: 25 }} />
      <DynamicIcon style={styles.iconStyle} size={20} path={iconPath} />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    backgroundColor: "rgba(255, 255, 255, 0.66)",
    alignItems: "center",
    alignContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  textStyle: {
    fontFamily: fonts.light,
    fontSize: 12,
  },
  selected: {
    backgroundColor: "rgba(159, 223, 105, 1)",
    borderWidth: 1,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
  },
});
