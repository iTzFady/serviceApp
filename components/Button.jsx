import { Cairo_700Bold, useFonts } from "@expo-google-fonts/cairo";
import { Pressable, Text } from "react-native";
import { Shadow } from "react-native-shadow-2";
export default function Button({
  text,
  color,
  backgroundColor,
  fontSize,
  width = "100%",
  height = 45,
  onPressEvent,
  borderRadius = 10,
}) {
  const [loaded, error] = useFonts({
    Cairo_700Bold,
  });
  if (!loaded && !error) {
    return null;
  }
  return (
    <Shadow
      style={{ width: "100%" }}
      distance={4}
      startColor="rgba(0,0,0,0.25)"
      endColor="rgba(0,0,0,0)"
    >
      <Pressable
        style={{
          backgroundColor: backgroundColor,
          borderRadius: borderRadius,
          paddingHorizontal: 20,
          marginHorizontal: "auto",
          width: width,
          height: height,
          alignItems: "center",
        }}
        onPress={onPressEvent}
      >
        <Text
          style={{
            color: color,
            fontSize: fontSize,
            fontFamily: "Cairo_700Bold",
            textAlign: "center",
          }}
        >
          {text}
        </Text>
      </Pressable>
    </Shadow>
  );
}
