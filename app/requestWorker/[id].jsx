import Button from "@/components/Button";
import DynamicIcon from "@/components/DynamicIcon";
import InputField from "@/components/InputField";
import Separator from "@/components/Separator";
import UploadButton from "@/components/UploadImageButton";
import { Speciality } from "@/data/speciality";
import { fonts } from "@/theme/fonts";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const profilePic = require("@/assets/images/default-profile.png");
export default function RequestWorker() {
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
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
  const { id, name, job, rating } = useLocalSearchParams();
  const work = Speciality.find((w) => w.value === job);
  const router = useRouter();
  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };
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
              resizeMode="contain"
              source={profilePic}
            />
            <Text style={styles.workerName}>{name}</Text>
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
            <Text style={styles.ratingText}>{rating}</Text>
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
                  required: "Name is required",
                  pattern: {
                    message: "Invalid name",
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
                  required: "Name is required",
                  pattern: {
                    message: "Invalid name",
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
                  required: "Name is required",
                  pattern: {
                    message: "Invalid name",
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
                              value={value || new Date()}
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
                              value={value || new Date()}
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
                rules={{
                  required: "image is required",
                  pattern: {
                    message: "You must upload an image",
                  },
                }}
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
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topStyle: {
    backgroundColor: "rgba(127, 186, 78, 1);",
    flexDirection: "column",
    bottom: 0,
    alignItems: "center",
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
    left: 5,
    marginLeft: 20,
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
