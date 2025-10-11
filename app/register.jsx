import Button from "@/components/Button";
import InputField from "@/components/InputField";
import Separator from "@/components/Separator";
import { Controller, useForm } from "react-hook-form";

import {
  Cairo_200ExtraLight,
  Cairo_300Light,
  useFonts,
} from "@expo-google-fonts/cairo";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const logo = require("../assets/images/logo.png");
export default function RegisterPage() {
  const [loaded, error] = useFonts({
    Cairo_200ExtraLight,
    Cairo_300Light,
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  let selectedOption = true;
  if (!loaded && !error) {
    return null;
  }
  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={logo} />
      <View style={styles.optionContainer}>
        <Pressable style={[styles.option]}>
          <Text style={[styles.optionText]}>تسجيل كـ عميل</Text>
        </Pressable>
        <Pressable style={[styles.option, { opacity: 0.5 }]}>
          <Text style={[styles.optionText]}>تسجيل كـ صنايعي</Text>
        </Pressable>
      </View>
      <Separator separatorWidth="75%" margin={15} />
      <Text style={styles.title}>البيانات الشخصيه</Text>
      <ScrollView style={styles.formContainer}>
        <Controller
          control={control}
          name="email"
          rules={{
            required: "E-mail is required",
            pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              text={"البريد الالكتروني"}
              autoCapitalize="none"
              autoCpmplete="email"
              inputMode="email"
              keyboardType="email-address"
              placeholder="اكتب بريدك الالكتروني"
              onChangeText={onChange}
              value={value}
            />
          )}
        />
      </ScrollView>
      <View style={styles.registerButton}>
        <Button
          text="إنشاء الحساب"
          color="#fff"
          backgroundColor="rgba(127,186,78,1)"
          fontSize={24}
          onpress={() => {
            console.log("pressed");
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 110,
    resizeMode: "contain",
  },
  optionContainer: {
    flexDirection: "row",
    gap: 5,
  },
  option: {
    height: 45,
    backgroundColor: "rgba(127, 186, 78, 1)",
    borderRadius: 10,
    paddingHorizontal: 8,
    gap: 8,
  },
  optionText: {
    color: "rgba(0,0,0,1)",
    fontSize: 24,
    fontFamily: "Cairo_200ExtraLight",
  },
  title: {
    color: "rgba(0,0,0,1)",
    fontSize: 20,
    fontFamily: "Cairo_300Light",
  },
  formContainer: {
    width: "100%",
  },
  registerButton: {
    bottom: 20,
    width: "100%",
    paddingHorizontal: 20,
  },
});
