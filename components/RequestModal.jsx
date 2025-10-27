import { useUser } from "@/context/UserContext";
import { fonts } from "@/theme/fonts";
import { shadow } from "@/theme/styles";
import { formatTime } from "@/utility/formatTime";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { default as Alert, default as AlertMessage } from "./Alert";
const defaultProfilePic = require("@/assets/images/default-profile.png");
const screenHeight = Dimensions.get("window").height;
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function RequestModal({
  type = "request",
  show,
  setShow,
  request,
  token,
  removeRequest,
  acceptRequest,
  userType,
  handleContact,
  jobId,
  ratedUser,
  setRequests,
}) {
  const { user } = useUser();
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const [visible, setVisible] = useState(show);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  useEffect(() => {
    if (show) {
      setVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }
  }, [show, slideAnim]);
  if (!visible || !request) return null;
  const handleRequest = (decision) => {
    if (decision === "accept" || decision === "complete")
      setAcceptLoading(true);
    if (decision === "reject" || decision === "cancel") setRejectLoading(true);
    axios({
      method: decision === "reject" ? "delete" : "put",
      url: `${apiUrl}/api/requests/${request.id}/${decision}`,
      timeout: 0,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.data.code === "REQUEST_REJECTED") removeRequest(request.id);
        else if (res.data.code === "REQUEST_ACCEPTED")
          acceptRequest(request.id);
        else if (
          res.data.code === "REQUEST_COMPLETED" ||
          res.data.code === "REQUEST_CANCELLED"
        )
          removeRequest(request.id);
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
      .finally(() => {
        setAcceptLoading(false);
        setRejectLoading(false);
        setShow(false);
      });
  };

  const handleSubmitRating = async () => {
    if (!token) return;

    if (rating === 0)
      return AlertMessage("Alert", "Please choose rating first");
    setAcceptLoading(true);
    const controller = new AbortController();

    axios({
      method: "post",
      url: `${apiUrl}/api/ratings`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        serviceRequestId: jobId,
        ratedByUserId: user?.id,
        ratedUserId: ratedUser,
        stars: rating,
        comment: comment,
      },
      signal: controller.signal,
    })
      .then((res) => {
        AlertMessage("Successful", "Rating submitted Successfully");
        setShow(false);
        setComment("");
        setRequests((prev) =>
          prev.map((item) =>
            item.id === jobId ? { ...item, hasRated: true } : item
          )
        );
      })
      .catch((err) => {
        console.log(err);
        AlertMessage(
          "Error",
          err.response?.data.message
            ? err.response?.data.message
            : err.response?.data
            ? err.response?.data
            : "Error Occured"
        );
      })
      .finally(() => {
        setAcceptLoading(false);
      });
    return () => controller.abort();
  };
  const handleSubmitReport = async () => {
    if (!token) return;

    if (!comment.trim()) return AlertMessage("Alert", "Please write a report");
    setAcceptLoading(true);
    const controller = new AbortController();
    axios({
      method: "post",
      url: `${apiUrl}/api/reports/report/${ratedUser}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        report: comment,
      },
      signal: controller.signal,
    })
      .then((res) => {
        console.log(ratedUser);
        AlertMessage("Successful", "Report submitted Successfully");
        setShow(false);
        setComment("");
        setRequests((prev) =>
          prev.map((item) =>
            item.requestedBy.id === ratedUser ||
            item.requestedFor.id === ratedUser
              ? { ...item, hasReported: true }
              : item
          )
        );
      })
      .catch((err) => {
        AlertMessage(
          "Error",
          err.response?.data.message
            ? err.response?.data.message
            : err.response?.data
            ? err.response?.data
            : "Error Occured"
        );
      })
      .finally(() => {
        setAcceptLoading(false);
      });
    return () => controller.abort();
  };
  const pendingWorkerRequest = (
    <>
      <Pressable
        style={[styles.button, { backgroundColor: "rgba(2, 63, 65, 1)" }]}
        onPress={() => handleRequest("accept")}
        disabled={acceptLoading || rejectLoading}
      >
        {acceptLoading ? (
          <ActivityIndicator
            style={{ marginVertical: "auto", paddingVertical: "auto" }}
            size="small"
            color="#fff"
          />
        ) : (
          <Text style={styles.buttonText}>قبول</Text>
        )}
      </Pressable>
      <Pressable
        style={[styles.button, { backgroundColor: "rgba(255, 255, 255, 0.3)" }]}
        onPress={() => handleRequest("reject")}
        disabled={acceptLoading || rejectLoading}
      >
        {rejectLoading ? (
          <ActivityIndicator
            style={{ marginVertical: "auto", paddingVertical: "auto" }}
            size="small"
            color="#fff"
          />
        ) : (
          <Text style={styles.buttonText}>رفض</Text>
        )}
      </Pressable>
    </>
  );
  const acceptedWorkerRequest = (
    <>
      <Pressable
        style={[styles.button, { backgroundColor: "rgba(2, 63, 65, 1)" }]}
        onPress={() => handleRequest("complete")}
        disabled={acceptLoading || rejectLoading}
      >
        {acceptLoading ? (
          <ActivityIndicator
            style={{ marginVertical: "auto", paddingVertical: "auto" }}
            size="small"
            color="#fff"
          />
        ) : (
          <Text style={styles.buttonText}>انهاء الطلب</Text>
        )}
      </Pressable>
      <Pressable
        style={[styles.button, { backgroundColor: "rgba(255, 255, 255, 0.3)" }]}
        onPress={() => handleRequest("cancel")}
        disabled={acceptLoading || rejectLoading}
      >
        {rejectLoading ? (
          <ActivityIndicator
            style={{ marginVertical: "auto", paddingVertical: "auto" }}
            size="small"
            color="#fff"
          />
        ) : (
          <Text style={styles.buttonText}>الغاء الطلب</Text>
        )}
      </Pressable>
    </>
  );
  const renderRequestContent = () => (
    <>
      <View style={styles.clientDetails}>
        <View style={styles.clientInfo}>
          <Image
            style={styles.profilePicStyle}
            source={
              request.requestedBy.profilePictureUrl
                ? { uri: `${apiUrl}${request.requestedBy.profilePictureUrl}` }
                : defaultProfilePic
            }
          />
          <Text style={styles.userDetailText}>
            {userType === "Worker"
              ? request.requestedBy.name
              : request.requestedFor.name}
          </Text>
        </View>
        <View style={styles.ratingContainer}>
          <MaterialCommunityIcons
            name="star"
            size={18}
            color="rgba(237, 237, 14, 0.81)"
          />
          <Text style={[styles.userDetailText, { fontSize: 10 }]}>
            {userType === "Worker"
              ? request.requestedBy.rating
              : request.requestedFor.rating}
          </Text>
        </View>

        <TouchableOpacity onPress={() => setShow(false)}>
          <FontAwesome name="close" size={17} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Text style={styles.textStyle}>{request.title}</Text>
        <Text style={styles.textStyle}>{request.description}</Text>
        <Text style={styles.textStyle}>{request.location}</Text>
        <Text style={styles.textStyle}>{formatTime(request.dateTime)}</Text>

        {request.notes && (
          <Text style={styles.textStyle}>{`ملاحظات: ${request.notes}`}</Text>
        )}

        {request.imageUrls?.[0] && (
          <Image
            resizeMode="contain"
            style={styles.requestImage}
            source={{
              uri: `${apiUrl}${request.imageUrls[0]}`,
            }}
          />
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        {userType === "Worker" ? (
          request.status === "Accepted" ? (
            acceptedWorkerRequest
          ) : (
            pendingWorkerRequest
          )
        ) : request.status === "Accepted" ? (
          <>
            <Pressable
              style={[styles.button, { backgroundColor: "rgba(2, 63, 65, 1)" }]}
              onPress={handleContact}
            >
              <Text style={styles.buttonText}>التواصل مع الصنايعي</Text>
            </Pressable>
          </>
        ) : null}
      </View>
    </>
  );
  const renderRatingContent = () => (
    <View style={styles.modalInner}>
      <Text style={styles.modalTitle}>تقييم الصنايعي</Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <TouchableOpacity key={i} onPress={() => setRating(i)}>
            <MaterialCommunityIcons
              name={i <= rating ? "star" : "star-outline"}
              size={35}
              color="#FFD700"
            />
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.textInput}
        placeholder="اكتب تعليقك هنا..."
        placeholderTextColor="#ccc"
        multiline
        value={comment}
        onChangeText={setComment}
      />
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, { backgroundColor: "#023F41", marginTop: 20 }]}
          onPress={handleSubmitRating}
          disabled={acceptLoading}
        >
          {acceptLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>إرسال التقييم</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
  const renderReportContent = () => (
    <View style={styles.modalInner}>
      <Text style={styles.modalTitle}>الإبلاغ عن مشكلة</Text>
      <TextInput
        style={[styles.textInput, { minHeight: 150 }]}
        placeholder="صف المشكلة بالتفصيل..."
        placeholderTextColor="#ccc"
        multiline
        value={comment}
        onChangeText={setComment}
      />
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, { backgroundColor: "#C0392B", marginTop: 20 }]}
          onPress={handleSubmitReport}
          disabled={acceptLoading}
        >
          {acceptLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>إرسال البلاغ</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => setShow(false)}
    >
      <Pressable style={styles.backdrop} onPress={() => setShow(false)} />

      <Animated.View
        style={[
          styles.modalContent,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {type === "rating"
          ? renderRatingContent()
          : type === "report"
          ? renderReportContent()
          : renderRequestContent()}
      </Animated.View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#0d5d5e",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: screenHeight * 0.4,
    ...shadow,
  },
  modalInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: "#fff",
    fontFamily: fonts.bold,
    fontSize: 20,
    marginBottom: 20,
  },
  textInput: {
    width: "100%",
    backgroundColor: "#ffffff20",
    color: "#fff",
    borderRadius: 8,
    padding: 10,
    fontFamily: fonts.regular,
    textAlignVertical: "top",
    writingDirection: "rtl",
  },
  clientDetails: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  clientInfo: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },
  profilePicStyle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#fff",
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 5,
  },
  userDetailText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: fonts.light,
  },
  textStyle: {
    minHeight: 50,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    fontFamily: fonts.bold,
    fontSize: 15,
    textAlign: "center",
    textAlignVertical: "center",
    marginVertical: 10,
    borderRadius: 5,
    padding: 8,
    ...shadow,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    padding: 10,
    gap: 10,
  },
  button: {
    flex: 1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    ...shadow,
  },
  buttonText: {
    color: "#fff",
    fontFamily: fonts.bold,
    fontSize: 15,
  },
  requestImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
});
