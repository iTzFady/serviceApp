import { fonts } from "@/theme/fonts";
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
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Alert from "./Alert";
const profilePic = require("@/assets/images/default-profile.png");
const screenHeight = Dimensions.get("window").height;
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function RequestModal({
  show,
  setShow,
  request,
  token,
  removeRequest,
  acceptRequest,
  userType,
  handleContact,
}) {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const [visible, setVisible] = useState(show);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
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
    if (decision === "accept") setAcceptLoading(true);
    if (decision === "reject") setRejectLoading(true);

    axios({
      method: decision === "reject" ? "delete" : "put",
      url: `${apiUrl}/api/requests/${request.id}/${
        decision === "reject" ? "reject" : "accept"
      }`,
      timeout: 15000,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.data.code === "REQUEST_REJECTED") {
          removeRequest(request.id);
        } else if (res.data.code === "REQUEST_ACCEPTED") {
          acceptRequest(request.id);
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
      .finally(() => {
        setAcceptLoading(false);
        setRejectLoading(false);
        setShow(false);
      });
  };

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
        <View style={styles.clientDetails}>
          <View style={styles.clientInfo}>
            <Image style={styles.profilePicStyle} source={profilePic} />
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
            <>
              <Pressable
                style={[
                  styles.button,
                  { backgroundColor: "rgba(2, 63, 65, 1)" },
                ]}
                onPress={() => handleRequest("accept")}
                disabled={acceptLoading || rejectLoading}
              >
                {acceptLoading ? (
                  <ActivityIndicator
                    style={{ marginVertical: "auto", paddingVertical: "auto" }}
                    size="small"
                    color="#000"
                  />
                ) : (
                  <Text style={styles.buttonText}>قبول</Text>
                )}
              </Pressable>
              <Pressable
                style={[
                  styles.button,
                  { backgroundColor: "rgba(255, 255, 255, 0.3)" },
                ]}
                onPress={() => handleRequest("reject")}
                disabled={acceptLoading || rejectLoading}
              >
                {rejectLoading ? (
                  <ActivityIndicator
                    style={{ marginVertical: "auto", paddingVertical: "auto" }}
                    size="small"
                    color="#000"
                  />
                ) : (
                  <Text style={styles.buttonText}>رفض</Text>
                )}
              </Pressable>
            </>
          ) : request.status === "Accepted" ? (
            <>
              <Pressable
                style={[
                  styles.button,
                  { backgroundColor: "rgba(2, 63, 65, 1)" },
                ]}
                onPress={handleContact}
              >
                <Text style={styles.buttonText}>التواصل مع الصنايعي</Text>
              </Pressable>
            </>
          ) : null}
        </View>
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
    height: screenHeight * 0.8,
    ...Platform.select({
      web: {
        boxShadow: "0px -4px 12px rgba(0,0,0,0.5)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 8,
      },
    }),
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
    ...Platform.select({
      web: { boxShadow: "0px 2px 4px rgba(0,0,0,0.3)" },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
      },
    }),
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
    ...Platform.select({
      web: { boxShadow: "0px 2px 4px rgba(0,0,0,0.3)" },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 4,
      },
    }),
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
