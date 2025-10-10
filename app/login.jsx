import InputField from "@/components/InputField";
import {
  Cairo_300Light,
  Cairo_700Bold,
  useFonts,
} from "@expo-google-fonts/cairo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Link } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(true);
  const [loaded, error] = useFonts({
    Cairo_700Bold,
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
  const onSubmit = (data) => {
    console.log(data);
  };
  if (!loaded && !error) {
    return null;
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
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
              icon={<FontAwesome name="user-o" size={24} color="black" />}
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
              autoCpmplete="none"
              inputMode="text"
              keyboardType="text"
              placeholder="اكتب كلمة السر"
              secureTextEntry={showPassword}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.password && (
          <Text style={styles.error}>{errors.password.message}</Text>
        )}
        <Link style={styles.forgetPasswordLink} href="/">
          هل نسيت كلمة السر؟
        </Link>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.buttonText}>تسجيل الدخول</Text>
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: "row-reverse",
            marginHorizontal: "auto",
          }}
        >
          <Text
            style={{
              color: "#214503",
              fontFamily: "Cairo_300Light",
              fontSize: 14,
            }}
          >
            ليس لديك حساب؟
          </Text>
          <Link
            style={{
              color: "#2C5b04",
              fontFamily: "Cairo_300Light",
              fontSize: 14,
              marginRight: 3,
            }}
            href="/"
          >
            سحل الان
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#Bde3e4",
  },
  container: {
    marginTop: 180,
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
  button: {
    height: 45,
    backgroundColor: "#7fba4e",
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Cairo_700Bold",
    fontSize: 24,
    color: "#fff",
  },
  forgetPasswordLink: {
    color: "#214503",
    fontFamily: "Cairo_300Light",
    fontSize: 12,
    marginRight: 30,
    textAlign: "right",
  },
  error: {
    color: "red",
    marginBottom: 10,
    marginLeft: 12,
  },
});
