import { Cairo_700Bold, useFonts } from "@expo-google-fonts/cairo";
import { Pressable, Text } from "react-native";
export default function Button({
  text,
  color,
  backgroundColor,
  fontSize,
  height,
  onpress,
}) {
  const [loaded, error] = useFonts({
    Cairo_700Bold,
  });
  if (!loaded && !error) {
    return null;
  }
  return (
    <Pressable
      style={{
        backgroundColor: backgroundColor,
        borderRadius: 10,
        paddingHorizontal: 20,
        marginBlock: 5,
        marginHorizontal: "auto",
        width: "100%",
        height: height ? height : 45,
        alignItems: "center",
      }}
      onPress={onpress}
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
  );
}
