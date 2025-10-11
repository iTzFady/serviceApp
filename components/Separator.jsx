import { View } from "react-native";

export default function Separator({ separatorWidth, margin }) {
  return (
    <View
      style={{
        backgroundColor: "#000",
        marginBlock: margin,
        marginHorizontal: "auto",
        height: 1.5,
        width: separatorWidth,
      }}
    />
  );
}
