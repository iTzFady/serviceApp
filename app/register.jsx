import Button from "@/components/Button";
import DynamicIcon from "@/components/DynamicIcon";
import InputField from "@/components/InputField";
import Separator from "@/components/Separator";
import UploadButton from "@/components/UploadImageButton";
import WebSelect from "@/components/WebSelect";

import { ThemeContext } from "@/context/ThemeContext";
import { useApi } from "@/hooks/useApi";
import { fonts } from "@/theme/fonts";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
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
import { Shadow } from "react-native-shadow-2";
import Toast from "react-native-toast-message";
import { Regions } from "../data/regions";
import { Speciality } from "../data/speciality";

const logo = require("../assets/images/logo.png");

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(true);
  const { colorScheme } = useContext(ThemeContext);
  const api = useApi();
  const [role, setRole] = useState("Client");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      Role: role,
      NationalNumber: "",
      speciality: "",
      region: "",
    },
  });
  const onSubmit = async (data) => {
    const payload = { ...data, Role: role };
    if (payload.password !== payload.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "خطأ في كلمة المرور",
        text2: "يرجى التأكد من أن كلمة المرور وتأكيدها متطابقتان.",
        text1Style: {
          textAlign: "right",
        },
        text2Style: {
          textAlign: "right",
        },
      });
    }
    const formData = new FormData();
    formData.append("profilePic", payload.image);
    formData.append("Name", payload.name);
    formData.append("Role", payload.Role);
    formData.append("Email", payload.email);
    formData.append("Password", payload.password);
    formData.append("PhoneNumber", payload.phoneNumber);
    formData.append(
      "NationalNumber",
      payload.NationalNumber ? payload.NationalNumber : null
    );
    formData.append("Region", payload.region ? payload.region : null);
    formData.append(
      "WorkerSpecialty",
      payload.speciality ? payload.speciality : ""
    );
    setLoading(true);
    await api
      .post("/api/user/register", formData, {
        timeout: 0,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.code === "REGISTRATION_SUCCESSFUL") {
          Toast.show({
            type: "success",
            text1: "تم التسجيل بنجاح",
            text2: "مرحبًا بك في التطبيق!",
            text1Style: {
              textAlign: "right",
            },
            text2Style: {
              textAlign: "right",
            },
          });
          router.replace("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        const code = err.response.data.code;
        if (code === "EMAIL_ALREADY_EXISTS") {
          Toast.show({
            type: "error",
            text1: "البريد الإلكتروني مسجل مسبقًا",
            text2: "يرجى استخدام بريد إلكتروني آخر.",
            text1Style: { textAlign: "right" },
            text2Style: { textAlign: "right" },
          });
        } else if (code === "INVALID_PHONE_FORMAT") {
          Toast.show({
            type: "error",
            text1: "رقم الهاتف غير صالح",
            text2: "يجب أن يبدأ بـ 010، 011، 012، أو 015 ويتكون من 11 رقمًا.",
            text1Style: { textAlign: "right" },
            text2Style: { textAlign: "right" },
          });
        } else if (code === "PHONE_ALREADY_EXISTS") {
          Toast.show({
            type: "error",
            text1: "رقم الهاتف مستخدم مسبقًا",
            text2: "يرجى استخدام رقم هاتف آخر.",
            text1Style: { textAlign: "right" },
            text2Style: { textAlign: "right" },
          });
        } else if (code === "INVALID_NATIONAL_NUMBER") {
          Toast.show({
            type: "error",
            text1: "الرقم القومي غير صالح",
            text2: "يجب أن يبدأ بـ 2 أو 3 ويتكون من 14 رقمًا.",
            text1Style: { textAlign: "right" },
            text2Style: { textAlign: "right" },
          });
        } else if (code === "NATIONAL_NUMBER_EXISTS") {
          Toast.show({
            type: "error",
            text1: "الرقم القومي مستخدم مسبقًا",
            text2: "يرجى التحقق من الرقم القومي أو استخدام رقم آخر.",
            text1Style: { textAlign: "right" },
            text2Style: { textAlign: "right" },
          });
        } else {
          Toast.show({
            type: "error",
            text1: "فشل التسجيل",
            text2:
              "يرجى التأكد من إدخال البيانات بشكل صحيح والمحاولة مرة أخرى.",
            text1Style: {
              textAlign: "right",
            },
            text2Style: {
              textAlign: "right",
            },
          });
        }
      })
      .finally(() => setLoading(false));
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
        {errors.NationalNumber && (
          <Text style={styles.error}>{errors.NationalNumber.message}</Text>
        )}
        <Controller
          control={control}
          rules={{ required: "You must choose a speciality" }}
          name="speciality"
          render={({ field: { onChange, value } }) =>
            Platform.OS === "web" ? (
              <WebSelect
                data={Speciality}
                onChange={onChange}
                value={value}
                label="المهنة"
                placeHolder="اختر مهنتك"
              />
            ) : (
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>المهنة</Text>
                <Dropdown
                  style={styles.dropdown}
                  mode="modal"
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
            )
          }
        />
        {errors.speciality && (
          <Text style={styles.error}>{errors.speciality.message}</Text>
        )}
        <Controller
          control={control}
          rules={{ required: "You must choose a Region" }}
          name="region"
          render={({ field: { onChange, value } }) =>
            Platform.OS === "web" ? (
              <WebSelect
                data={Regions}
                onChange={onChange}
                value={value}
                label="المنطقة"
                placeHolder="اختر منطقتك"
              />
            ) : (
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>المنطقة</Text>
                <Dropdown
                  style={styles.dropdown}
                  mode="modal"
                  data={Regions}
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={styles.dropdownSelectText}
                  itemTextStyle={styles.dropdownItem}
                  maxHeight={250}
                  labelField="label"
                  valueField="value"
                  placeholder="اختر منطقتك"
                  value={value}
                  onChange={(item) => onChange(item.value)}
                  activeColor="#e0f7fa"
                />
              </View>
            )
          }
        />
        {errors.region && (
          <Text style={styles.error}>{errors.region.message}</Text>
        )}
      </>
    );
  };

  useEffect(() => {
    setValue("Role", role);
  }, [role, setValue]);

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={logo} resizeMode="contain" />

      <View style={styles.optionContainer}>
        <Shadow
          style={{ width: "100%" }}
          distance={role === "Client" ? 2 : 0}
          startColor="rgba(0,0,0,0.25)"
          endColor="rgba(0,0,0,0)"
        >
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
        </Shadow>
        <Shadow
          style={{ width: "100%" }}
          distance={role === "Worker" ? 2 : 0}
          startColor="rgba(0,0,0,0.25)"
          endColor="rgba(0,0,0,0)"
        >
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
        </Shadow>
      </View>
      <Separator separatorWidth="75%" margin={20} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.formContainer}
      >
        <ScrollView>
          <Text style={styles.title}>البيانات الشخصيه</Text>

          <Controller
            control={control}
            name="image"
            render={({ field: { onChange, value } }) => (
              <UploadButton
                onChange={onChange}
                value={value}
                type="ProfilePic"
              />
            )}
          />

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
                keyboardType="default"
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
            onPressEvent={handleSubmit(onSubmit)}
            loading={loading}
          />
        </View>
      </KeyboardAvoidingView>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
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
    fontFamily: fonts.extraLight,
  },
  title: {
    color: "rgba(0,0,0,1)",
    fontSize: 20,
    fontFamily: fonts.light,
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
    marginBlock: "25",
  },
  dropdownLabel: {
    fontFamily: fonts.medium,
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
  },
  dropdownSelectText: {
    color: "#000",
    textAlign: "right",
    fontSize: 20,
    fontFamily: fonts.extraLight,
  },
  dropdownPlaceholder: {
    color: "#999",
    textAlign: "right",
    marginRight: 8,
    fontSize: 20,
    fontFamily: fonts.extraLight,
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
    fontFamily: fonts.extraLight,
  },
  dropdownItemIcon: {
    padding: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
    marginLeft: 20,
    fontFamily: fonts.light,
  },
});
