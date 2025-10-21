import { memo } from "react";
import { View } from "react-native";

function Separator({ separatorWidth, margin }) {
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
export default memo(Separator);
