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
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
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
      <Separator separatorWidth="75%" margin={20} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.formContainer]}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView>
            <Text style={styles.title}>البيانات الشخصيه</Text>
            <Controller
              control={control}
              name="name"
              rules={{
                required: "Name is required",
                pattern: {
                  value: /^[\u0621-\u064Aa-zA-Z\s'-]{2,40}$/,
                  message: "Invalid name",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <InputField
                  text={"الاسم الكامل"}
                  autoCapitalize="words"
                  autoCpmplete="name"
                  inputMode="text"
                  keyboardType="defaul"
                  placeholder="اكتب اسمك كامل"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <Controller
              control={control}
              name="phoneNumber"
              rules={{
                required: "Phone number is required",
                pattern: {
                  value: /^(?:\+20|0020)?1[0125][0-9]{8}$/,
                  message: "Invalid Phone Number",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <InputField
                  text={"رقم الهاتف"}
                  autoCapitalize="none"
                  autoCpmplete="tel"
                  inputMode="tel"
                  keyboardType="phone-pad"
                  placeholder="اكتب رقم هاتف صحيح"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
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
            <Controller
              control={control}
              name="password"
              rules={{
                required: "Password is required",
                pattern: {
                  value: /^[^\s]{6,}$/,
                  message: "Password should be more than 6",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <InputField
                  text={"كلمة السر"}
                  autoCapitalize="none"
                  autoCpmplete="current-password"
                  inputMode="text"
                  keyboardType="default"
                  placeholder="اكتب كلمة مرور "
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <Controller
              control={control}
              name="confirm-password"
              rules={{
                required: "You must retype your password",
                pattern: {
                  value: /^[^\s]{6,}$/,
                  message: "You must confirm your password",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <InputField
                  text={"تأكيد كلمة السر"}
                  autoCapitalize="none"
                  autoCpmplete="current-password"
                  inputMode="text"
                  keyboardType="default"
                  placeholder="برجاء تأكيد كلمة السر"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <View style={{ height: 30 }} />
          </ScrollView>
        </TouchableWithoutFeedback>
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
      </KeyboardAvoidingView>
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
    flexDirection: "row-reverse",
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
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    flex: 1,
    // backgroundColor: "#000",
  },
  registerButton: {
    width: "100%",
    paddingHorizontal: 20,
  },
});
