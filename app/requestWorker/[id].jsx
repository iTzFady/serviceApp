import Button from "@/components/Button";
import DynamicIcon from "@/components/DynamicIcon";
import InputField from "@/components/InputField";
import Separator from "@/components/Separator";
import UploadButton from "@/components/UploadImageButton";
import { ThemeContext } from "@/context/ThemeContext";
import { useToken } from "@/context/TokenContext";
import { useUser } from "@/context/UserContext";
import { Speciality } from "@/data/speciality";
import { useApi } from "@/hooks/useApi";
import { fonts } from "@/theme/fonts";
import { toLocalTimestamp } from "@/utility/formatTime";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const defaultProfilePic = require("@/assets/images/default-profile.png");
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function RequestWorker() {
  const { user } = useUser();
  const { token } = useToken();
  const { id } = useLocalSearchParams();
  const api = useApi();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const { colorScheme } = useContext(ThemeContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      type: "",
      description: "",
      address: "",
      date: new Date(),
      time: new Date(),
      image: "",
      notes: "",
    },
  });
  const work = Speciality.find((w) => w.value === worker);
  const router = useRouter();
  useEffect(() => {
    api
      .get(`/api/user/profile/${id}`)
      .then((res) => setWorker(res.data))
      .catch((err) => console.log(err));
  }, [id]);
  const onSubmit = (data) => {
    setLoading(true);
    const formData = new FormData();
    const dateTime = () => {
      if (Platform.OS === "web") {
        return `${data.date}T${data.time}:00`;
      } else {
        return toLocalTimestamp(data.date.toISOString());
      }
    };
    formData.append("requestedByUserId", user?.id);
    formData.append("RequestedForUserId", id);
    formData.append("title", data.type);
    formData.append("Description", data.description);
    formData.append("location", data.address);
    formData.append("dateTime", dateTime());
    formData.append("notes", data.notes);
    formData.append("images", data.image);
    api
      .post("/api/requests", formData, {
        timeout: 0,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        Toast.show({
          type: "success",
          text1: "نجحت العملية",
          text2: "تم تسجيل الطلب بنجاح",
          text1Style: {
            textAlign: "right",
          },
          text2Style: {
            textAlign: "right",
          },
        });
        router.replace("/");
      })
      .catch((err) => {
        Toast.show({
          type: "error",
          text1: "فشلت العملية",
          text2: "برجاء المحاولة في وقت لاحق",
          text1Style: {
            textAlign: "right",
          },
          text2Style: {
            textAlign: "right",
          },
        });
      })
      .finally(() => setLoading(false));
  };
  if (!worker)
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, marginHorizontal: "auto", marginVertical: "auto" }}
      />
    );
  return (
    <View style={styles.safeArea}>
      <View style={styles.topStyle}>
        <View style={styles.topElement}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons
              name="arrow-back-ios"
              size={20}
              color="rgba(0,0,0,1)"
            />
          </TouchableOpacity>
          <Text style={styles.topText}>تفاصيل الطلب</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.workerDataContainer}>
          <View style={styles.nameContainer}>
            <Image
              style={styles.workerImage}
              alt="Profile Picture"
              resizeMode="cover"
              source={
                worker?.profilePictureUrl
                  ? { uri: `${apiUrl}${worker?.profilePictureUrl}` }
                  : defaultProfilePic
              }
            />
            <Text style={styles.workerName}>{worker.name}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <View style={{ position: "relative", width: 24, height: 24 }}>
              <MaterialCommunityIcons
                name="star"
                size={24}
                color="rgba(237, 237, 14, 0.81)"
                style={{ position: "absolute" }}
              />
              <MaterialCommunityIcons
                name="star-outline"
                size={24}
                color="black"
                style={{ position: "absolute" }}
              />
            </View>
            <Text style={styles.ratingText}>{worker.rating}</Text>
          </View>
          <View style={styles.category}>
            <Text style={styles.categoryText}>{work?.label}</Text>
            <DynamicIcon path={work?.icon} size={18} />
          </View>
        </View>
        <Separator separatorWidth="90%" margin={12} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <View style={styles.container}>
            <ScrollView
              style={{ width: "100%" }}
              contentContainerStyle={{ paddingBottom: 120 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Controller
                control={control}
                name="type"
                rules={{
                  required: "title is required",
                  pattern: {
                    message: "Invalid title",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <InputField
                    text={"نوع العطل "}
                    inputMode="text"
                    keyboardType="default"
                    placeholder="مثلاً: “عندي فيشه مش شغاله”"
                    onChangeText={onChange}
                    value={value}
                    textStyle={{ fontFamily: fonts.light, fontSize: 15 }}
                    labelStyle={{ fontSize: 15 }}
                  />
                )}
              />
              <Controller
                control={control}
                name="description"
                rules={{
                  required: "Description is required",
                  pattern: {
                    message: "Invalid description",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <InputField
                    text={"وصف المشكله"}
                    inputMode="text"
                    keyboardType="default"
                    placeholder="مثلاً: “حصل قفله كبيره ومن ساعتها فيها ريحه "
                    onChangeText={onChange}
                    value={value}
                    textStyle={{ fontFamily: fonts.light, fontSize: 15 }}
                    labelStyle={{ fontSize: 15 }}
                  />
                )}
              />
              <Controller
                control={control}
                name="address"
                rules={{
                  required: "Address is required",
                  pattern: {
                    message: "Invalid address",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <InputField
                    text={"العنوان / الموقع"}
                    inputMode="text"
                    keyboardType="default"
                    placeholder="اكتب عنوانك بالتفصيل"
                    onChangeText={onChange}
                    value={value}
                    textStyle={{ fontFamily: fonts.light, fontSize: 15 }}
                    labelStyle={{ fontSize: 15 }}
                  />
                )}
              />
              <View>
                <Text style={styles.FieldLabel}>التاريخ و الوقت</Text>
                <View style={styles.dateTimeContainer}>
                  <Controller
                    control={control}
                    name="date"
                    rules={{
                      required: "date is required",
                      pattern: {
                        message: "Invalid date",
                      },
                    }}
                    render={({ field: { onChange, value } }) =>
                      Platform.OS === "web" ? (
                        <input
                          type="date"
                          value={value?.toString().split("T")[0] || ""}
                          onChange={(e) => onChange(e.target.value)}
                          style={{
                            padding: 10,
                            borderRadius: 8,
                            border: "1px solid #ccc",
                            width: "100%",
                          }}
                        />
                      ) : (
                        <>
                          <Pressable
                            style={styles.dateTimeSelector}
                            onPress={() => setShowDate(true)}
                          >
                            <Text style={styles.dateTimeText}>
                              {value
                                ? `${value.getDate()}/${
                                    value.getMonth() + 1
                                  }/${value.getFullYear()}`
                                : "اختر التاريخ"}
                            </Text>
                          </Pressable>
                          {showDate && (
                            <DateTimePicker
                              value={value}
                              mode="date"
                              display="default"
                              onChange={(event, selectedDate) => {
                                setShowDate(false);
                                if (selectedDate) onChange(selectedDate);
                              }}
                            />
                          )}
                        </>
                      )
                    }
                  />
                  <Controller
                    control={control}
                    name="time"
                    rules={{
                      required: "time is required",
                      pattern: {
                        message: "Invalid time",
                      },
                    }}
                    render={({ field: { onChange, value } }) =>
                      Platform.OS === "web" ? (
                        <input
                          type="time"
                          value={value?.toString().split("T")[0] || ""}
                          onChange={(e) => onChange(e.target.value)}
                          style={{
                            padding: 10,
                            borderRadius: 8,
                            border: "1px solid #ccc",
                            width: "100%",
                          }}
                        />
                      ) : (
                        <>
                          <Pressable
                            style={styles.dateTimeSelector}
                            onPress={() => setShowTime(true)}
                          >
                            <Text style={styles.dateTimeText}>
                              {value
                                ? value.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "اختر الوقت"}
                            </Text>
                          </Pressable>
                          {showTime && (
                            <DateTimePicker
                              value={value}
                              mode="time"
                              display="default"
                              onChange={(event, selectedTime) => {
                                setShowTime(false);
                                if (selectedTime) onChange(selectedTime);
                              }}
                            />
                          )}
                        </>
                      )
                    }
                  />
                </View>
              </View>
              <Controller
                control={control}
                name="image"
                render={({ field: { onChange, value } }) => (
                  <UploadButton onChange={onChange} value={value} />
                )}
              />
              <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.noteContainer}>
                    <Text style={styles.FieldLabel}>ملاحظات</Text>
                    <TextInput
                      style={styles.noteInput}
                      placeholder="أي تفاصيل ممكن تساعد الصنايعي "
                      value={value}
                      onChangeText={onChange}
                      multiline
                      numberOfLines={5}
                      textAlignVertical="top"
                    />
                  </View>
                )}
              />
            </ScrollView>
            <View style={styles.submitButton}>
              <Button
                width="100%"
                height={40}
                text="ارسال الخدمه"
                backgroundColor="rgba(159, 223, 105, 1)"
                color="#000"
                fontSize={20}
                borderRadius={5}
                onPressEvent={handleSubmit(onSubmit)}
                loading={loading}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </View>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topStyle: {
    backgroundColor: "rgba(127, 186, 78, 1)",
    height: 100,
    borderTopWidth: 1,
  },
  topElement: {
    flexDirection: "row-reverse",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  topText: {
    marginRight: 20,
    fontSize: 24,
    fontFamily: fonts.light,
  },
  backButton: {
    position: "absolute",
    left: 15,
  },
  container: {
    flexDirection: "column",
    width: "100%",
    position: "relative",
    flex: 1,
  },
  workerDataContainer: {
    width: "100%",
    height: 40,
    flexDirection: "row-reverse",
    alignContent: "center",
    padding: 12,
    position: "relative",
    alignItems: "center",
    marginTop: 15,
  },
  nameContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    position: "absolute",
    right: 20,
  },
  workerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  workerName: {
    fontSize: 12,
    marginRight: 5,
    fontFamily: fonts.medium,
  },
  ratingContainer: {
    position: "absolute",
    flexDirection: "row-reverse",
    alignItems: "center",
    right: "50%",
  },
  ratingText: {
    marginHorizontal: 5,
    fontFamily: fonts.light,
    fontSize: 10,
  },
  category: {
    flexDirection: "row-reverse",
    left: 35,
    position: "absolute",
    alignItems: "center",
  },
  categoryText: {
    fontFamily: fonts.light,
    fontSize: 10,
    marginLeft: 10,
  },
  formContainer: {
    width: "100%",
    height: "100%",
  },
  FieldLabel: {
    fontFamily: fonts.medium,
    fontSize: 15,
    textAlign: "right",
    marginRight: 20,
  },
  dateTimeContainer: {
    flexDirection: "row-reverse",
    width: "100%",
    paddingHorizontal: 20,
    gap: 10,
  },
  dateTimeSelector: {
    width: "50%",
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    alignContent: "center",
  },
  dateTimeText: {
    fontSize: 20,
    fontFamily: fonts.light,
  },
  noteContainer: {
    paddingHorizontal: 15,
  },
  noteInput: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.5)",
    minHeight: 70,
    fontSize: 14,
    fontFamily: fonts.light,
    textAlign: "right",
    padding: 10,
  },
  submitButton: {
    width: "100%",
    position: "absolute",
    padding: 15,
    bottom: 0,
    backgroundColor: "#Bde3e4",
  },
});
