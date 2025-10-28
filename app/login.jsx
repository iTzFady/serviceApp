import Alert from "@/components/Alert";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { ThemeContext } from "@/context/ThemeContext";
import { useToken } from "@/context/TokenContext";
import { useUser } from "@/context/UserContext";
import { fonts } from "@/theme/fonts";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { Link, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const logo = require("../assets/images/logo.png");
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
export default function LoginPage() {
  const router = useRouter();
  const { setToken } = useToken();
  const { updateUser } = useUser();
  const [showPassword, setShowPassword] = useState(true);
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Email: "",
      Password: "",
    },
  });
  const onSubmit = async (data) => {
    setLoading(true);
    await axios({
      method: "post",
      url: `${apiUrl}/api/user/login`,
      data: data,
    })
      .then(async (res) => {
        try {
          if (res.data.token && res.data.code === "LOGIN_SUCCESSFUL") {
            await setToken(res.data.token);
            updateUser(res.data.user);
            router.replace("/");
          }
        } catch (err) {
          Alert("Error", err);
        }
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          Alert(
            "Error",
            err.response.data?.message || JSON.stringify(err.response.data)
          );
        } else if (err.request) {
          Alert(
            "Network Error",
            "Unable to reach the server. Please check your connection."
          );
        } else {
          Alert("Error", "Something went wrong. Please try again later.");
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView>
          <Image source={logo} style={styles.logo} />
          <Controller
            control={control}
            name="Email"
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
          {errors.Email && (
            <Text style={styles.error}>{errors.Email.message}</Text>
          )}
          <Controller
            control={control}
            name="Password"
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
            }}
          >
            <Link style={styles.forgetPasswordLink} href="/">
              هل نسيت كلمة السر؟
            </Link>
            {errors.Password && (
              <Text style={[styles.error, { marginRight: 10 }]}>
                {errors.Password.message}
              </Text>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <Button
              text="تسجيل الدخول"
              color="#fff"
              backgroundColor="rgba(127,186,78,1)"
              fontSize={24}
              onPressEvent={handleSubmit(onSubmit)}
              loading={loading}
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
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
  forgetPasswordLink: {
    color: "#214503",
    fontFamily: fonts.light,
    fontSize: 12,
    marginRight: 18,
    textAlign: "right",
    flex: 1,
  },
  error: {
    color: "red",
    marginTop: 5,
    marginLeft: 25,
    flex: 1,
  },
  registerLink: {
    color: "#214503",
    fontFamily: "Cairo_300Light",
    fontSize: 14,
    marginLeft: 5,
  },
});
