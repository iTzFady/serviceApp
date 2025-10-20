import { fonts } from "@/theme/fonts";
import { formatTime } from "@/utility/formatTime";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
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

const profilePic = require("@/assets/images/default-profile.png");
const screenHeight = Dimensions.get("window").height;

export default function RequestModal({ show, setShow, request }) {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const [visible, setVisible] = useState(show);

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
              {request.requestedBy.name}
            </Text>
          </View>

          <View style={styles.ratingContainer}>
            <MaterialCommunityIcons
              name="star"
              size={18}
              color="rgba(237, 237, 14, 0.81)"
            />
            <Text style={[styles.userDetailText, { fontSize: 10 }]}>
              {request.requestedBy.rating}
            </Text>
          </View>

          <TouchableOpacity onPress={() => setShow(false)}>
            <FontAwesome name="close" size={17} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }}>
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
                uri: `https://localhost:7032${request.imageUrls[0]}`,
              }}
            />
          )}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, { backgroundColor: "rgba(2, 63, 65, 1)" }]}
          >
            <Text style={styles.buttonText}>قبول</Text>
          </Pressable>
          <Pressable
            style={[
              styles.button,
              { backgroundColor: "rgba(255, 255, 255, 0.3)" },
            ]}
          >
            <Text style={styles.buttonText}>رفض</Text>
          </Pressable>
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
    minHeight: screenHeight * 0.6,
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
