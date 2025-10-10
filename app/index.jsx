import InputField from "@/components/InputField";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { View } from "react-native";
export default function Index() {
  return (
    <View>
      <InputField
        text={"البريد الالكتروني"}
        icon={<FontAwesome name="user-o" size={24} color="black" />}
        autoCapitalize="none"
        autoCpmplete="email"
        inputMode="email"
        keyboardType="email"
        placeholder="اكتب بريدك الالكتروني"
        onChangeText={() => {}}
      ></InputField>
    </View>
  );
}
