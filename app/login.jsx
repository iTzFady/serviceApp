import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { fonts } from "@/theme/fonts";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Link } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const logo = require("../assets/images/logo.png");
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(true);

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
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView>
          <Image source={logo} style={styles.logo} />
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
                icon={<FontAwesome name="user-o" size={24} color="black" />}
                autoCapitalize="none"
                autoComplete="email"
                inputMode="email"
                keyboardType="email-address"
                placeholder="اكتب بريدك الالكتروني"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}
          <Controller
            control={control}
            name="password"
            rules={{ required: "Password is required", minLength: 6 }}
            render={({ field: { onChange, value } }) => (
              <InputField
                text={"كلمة السر"}
                icon={
                  <TouchableOpacity
                    onPress={() => setShowPassword((prevState) => !prevState)}
                  >
                    <MaterialCommunityIcons
                      name={showPassword ? "eye-closed" : "eye-outline"}
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                }
                autoCapitalize="none"
                autoComplete="none"
                inputMode="text"
                keyboardType="text"
                placeholder="اكتب كلمة السر"
                secureTextEntry={showPassword}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <View
            style={{
              flexDirection: "row-reverse",
              width: "100%",
              marginHorizontal: "auto",
            }}
          >
            <Link style={styles.forgetPasswordLink} href="/">
              هل نسيت كلمة السر؟
            </Link>
            {errors.password && (
              <Text style={styles.error}>{errors.password.message}</Text>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <Button
              text="تسجيل الدخول"
              color="#fff"
              backgroundColor="rgba(127,186,78,1)"
              fontSize={24}
              onPressEvent={handleSubmit(onSubmit)}
            />
          </View>

          <View
            style={{
              flexDirection: "row-reverse",
              marginHorizontal: "auto",
            }}
          >
            <Text style={styles.registerLink}>ليس لديك حساب؟</Text>
            <Link style={styles.registerLink} href="/register">
              سجل الان
            </Link>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    marginTop: "40%",
  },
  logo: {
    marginHorizontal: "auto",
  },
  buttonContainer: {
    marginHorizontal: "auto",
    paddingHorizontal: 20,
    width: "100%",
    padding: 20,
  },
  forgetPasswordLink: {
    color: "#214503",
    fontFamily: fonts.light,
    fontSize: 12,
    marginRight: 30,
    textAlign: "right",
    width: "50%",
  },
  error: {
    color: "red",
    marginTop: 5,
    marginLeft: 25,
    width: "50%",
  },
  registerLink: {
    color: "#214503",
    fontFamily: "Cairo_300Light",
    fontSize: 14,
    marginLeft: 5,
  },
});
