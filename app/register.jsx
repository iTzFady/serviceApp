import Button from "@/components/Button";
import DynamicIcon from "@/components/DynamicIcon";
import InputField from "@/components/InputField";
import Separator from "@/components/Separator";
import {
  Cairo_200ExtraLight,
  Cairo_300Light,
  Cairo_500Medium,
  useFonts,
} from "@expo-google-fonts/cairo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import { Speciality } from "../data/speciality";
const logo = require("../assets/images/logo.png");
export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(true);
  const [role, setRole] = useState("Client");
  const [loaded, error] = useFonts({
    Cairo_200ExtraLight,
    Cairo_300Light,
    Cairo_500Medium,
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      Role: role,
      speciality: "",
      nationalNumber: "",
    },
  });
  const onSubmit = (data) => {
    console.log(data);
  };
  const renderDropdownItems = (item) => {
    return (
      <View style={styles.dropdownItemContainer}>
        <DynamicIcon
          style={styles.dropdownItemIcon}
          size={20}
          path={item.icon}
        />
        <Text style={styles.dropdownItem}>{item.label}</Text>
      </View>
    );
  };
  const workersData = () => {
    return (
      <>
        <Controller
          control={control}
          name="NationalNumber"
          rules={{
            required: "National number is required",
            pattern: {
              value: /^(?:\[23][0-9]{13}$)/,
              message: "Invalid National number",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <InputField
              text={"الرقم القومي"}
              autoCapitalize="none"
              autoComplete="tel"
              inputMode="tel"
              keyboardType="phone-pad"
              placeholder="اكتب الرقم القومي"
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Controller
          control={control}
          name="speciality"
          render={({ field: { onChange, value } }) => (
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>المهنة</Text>
              <Dropdown
                style={styles.dropdown}
                data={Speciality}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectText}
                itemTextStyle={styles.dropdownItem}
                maxHeight={250}
                labelField="label"
                valueField="value"
                placeholder="اختر مهنتك"
                value={value}
                renderItem={renderDropdownItems}
                onChange={(item) => onChange(item.value)}
                activeColor="#e0f7fa"
              />
            </View>
          )}
        />
      </>
    );
  };
  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={logo} />
      <View style={styles.optionContainer}>
        <Pressable
          style={[
            styles.option,
            role === "Client" ? styles.selectedOption : null,
          ]}
          onPress={() => {
            reset();
            setRole("Client");
          }}
        >
          <Text style={styles.optionText}>تسجيل كـ عميل</Text>
        </Pressable>
        <Pressable
          style={[
            styles.option,
            role === "Worker" ? styles.selectedOption : null,
          ]}
          onPress={() => {
            reset();
            setRole("Worker");
          }}
        >
          <Text style={styles.optionText}>تسجيل كـ صنايعي</Text>
        </Pressable>
      </View>
      <Separator separatorWidth="75%" margin={20} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.formContainer]}
      >
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
                autoComplete="name"
                inputMode="text"
                keyboardType="defaul"
                placeholder="اكتب اسمك كامل"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.name && (
            <Text style={styles.error}>{errors.name.message}</Text>
          )}
          <Controller
            control={control}
            name="phoneNumber"
            rules={{
              required: "Phone number is required",
              pattern: {
                value: /^(?:\010|011|012|015)[0-9]{8}$/,
                message: "Invalid Phone Number",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <InputField
                text={"رقم الهاتف"}
                autoCapitalize="none"
                autoComplete="tel"
                inputMode="tel"
                keyboardType="phone-pad"
                placeholder="اكتب رقم هاتف صحيح"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.phoneNumber && (
            <Text style={styles.error}>{errors.phoneNumber.message}</Text>
          )}
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
                autoComplete="current-password"
                inputMode="text"
                keyboardType="default"
                placeholder="اكتب كلمة مرور "
                secureTextEntry={showPassword}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.password && (
            <Text style={styles.error}>{errors.password.message}</Text>
          )}
          <Controller
            control={control}
            name="confirmPassword"
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
                autoComplete="current-password"
                inputMode="text"
                keyboardType="default"
                placeholder="برجاء تأكيد كلمة السر"
                secureTextEntry={showPassword}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.confirmPassword && (
            <Text style={styles.error}>{errors.confirmPassword.message}</Text>
          )}
          {role === "Worker" ? workersData() : null}
          <View style={{ height: 60 }} />
        </ScrollView>
        <View style={styles.registerButton}>
          <Button
            text="إنشاء الحساب"
            color="#fff"
            backgroundColor="rgba(127,186,78,1)"
            fontSize={24}
            onpress={handleSubmit(onSubmit)}
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
    opacity: 0.5,
  },
  selectedOption: {
    opacity: 1,
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
  },
  registerButton: {
    width: "100%",
    paddingHorizontal: 20,
  },
  dropdownContainer: {
    height: 45,
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  dropdownLabel: {
    fontFamily: "Cairo_500Medium",
    fontSize: 20,
    width: "100%",
    textAlign: "right",
  },
  dropdown: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 45,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,1)",
  },
  dropdownSelectText: {
    color: "#000",
    textAlign: "right",
    fontSize: 20,
    fontFamily: "Cairo_200ExtraLight",
  },
  dropdownPlaceholder: {
    color: "#999",
    textAlign: "right",
    marginRight: 8,
    fontSize: 20,
    fontFamily: "Cairo_200ExtraLight",
  },
  dropdownItemContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    margin: 10,
  },
  dropdownItem: {
    color: "#333",
    textAlign: "right",
    fontSize: 20,
    marginRight: 15,
    fontFamily: "Cairo_200ExtraLight",
  },
  dropdownItemIcon: {
    padding: 10,
  },
});
