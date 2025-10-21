import { fonts } from "@/theme/fonts";
import { memo } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { Shadow } from "react-native-shadow-2";
function Button({
  text,
  color,
  backgroundColor,
  fontSize,
  width = "100%",
  height = 45,
  onPressEvent,
  borderRadius = 10,
  style,
  loading,
}) {
  return (
    <Shadow
      style={{ width: "100%" }}
      distance={4}
      startColor="rgba(0,0,0,0.25)"
      endColor="rgba(0,0,0,0)"
    >
      <Pressable
        style={[
          {
            backgroundColor: backgroundColor,
            borderRadius: borderRadius,
            width: width,
            height: height,
            marginBottom: 15,
          },
          style,
        ]}
        disabled={loading}
        onPress={onPressEvent}
      >
        {loading ? (
          <ActivityIndicator
            style={{ marginVertical: "auto", paddingVertical: "auto" }}
            size="small"
            color="#000"
          />
        ) : (
          <Text
            style={{
              color: color,
              fontSize: fontSize,
              fontFamily: fonts.bold,
              textAlign: "center",
            }}
          >
            {text}
          </Text>
        )}
      </Pressable>
    </Shadow>
  );
}
export default memo(Button);
