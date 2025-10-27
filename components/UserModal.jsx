import { useToken } from "@/context/TokenContext";
import { useUser } from "@/context/UserContext";
import { fonts } from "@/theme/fonts";
import {
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AlertMessage from "./Alert";
import RatingStars from "./RatingStars";
const defaultProfilePic = require("@/assets/images/default-profile.png");
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const { width } = Dimensions.get("window");
export default function RequestModal({ show, setShow, userType = "worker" }) {
  const slideAnim = useRef(new Animated.Value(width)).current;
  const { user, updateUser } = useUser();
  const { removeToken } = useToken();
  useEffect(() => {
    if (show) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [show, slideAnim]);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dx) > Math.abs(gesture.dy) && gesture.dx > 10;
      },
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx > 0) {
          slideAnim.setValue(gesture.dx);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 100) {
          Animated.timing(slideAnim, {
            toValue: width,
            duration: 200,
            useNativeDriver: true,
          }).start(() => setShow(false));
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;
  const handleClose = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShow(false));
  }, [slideAnim, setShow]);
  const handleLogout = useCallback(async () => {
    try {
      await removeToken("userToken");
      updateUser(null);
    } catch (err) {
      AlertMessage("Error", err);
    } finally {
      router.replace("/login");
    }
  }, [updateUser]);

  return (
    <Modal
      visible={show}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose} />

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.modalContent,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View
          style={{
            flexDirection: "row-reverse",
            marginTop: 35,
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={
              user?.profilePictureUrl
                ? { uri: `${apiUrl}${user?.profilePictureUrl}` }
                : defaultProfilePic
            }
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.profileContainer}>
            <Text style={styles.nameText}>{user?.name}</Text>

            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{user?.rating}</Text>
              <RatingStars rating={user?.rating} />
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleClose}
          style={{ left: 15, position: "absolute", top: 55 }}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color="black" />
        </TouchableOpacity>
        <ScrollView style={styles.buttonsContainer}>
          <Pressable style={styles.button}>
            <MaterialCommunityIcons name="bell" size={20} color="black" />
            <Text style={styles.buttonText}>الاشعارات</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              router.push("/requestLog");
              setShow(false);
            }}
            style={styles.button}
          >
            <Octicons name="log" size={20} color="black" />
            <Text style={styles.buttonText}>سجل الطلبات</Text>
          </Pressable>
          <Pressable style={styles.button}>
            <FontAwesome6 name="user-shield" size={20} color="black" />
            <Text style={styles.buttonText}>السلامه</Text>
          </Pressable>

          <Pressable style={styles.button}>
            <MaterialIcons name="settings" size={20} color="black" />
            <Text style={styles.buttonText}>الاعدادات</Text>
          </Pressable>

          <Pressable style={styles.button}>
            <MaterialCommunityIcons
              name="account-question"
              size={20}
              color="black"
            />
            <Text style={styles.buttonText}>مساعده</Text>
          </Pressable>

          <Pressable style={styles.button}>
            <MaterialIcons name="support-agent" size={20} color="black" />
            <Text style={styles.buttonText}>الدعم</Text>
          </Pressable>
          <Pressable onPress={handleLogout} style={styles.button}>
            <MaterialIcons name="logout" size={20} color="black" />
            <Text style={styles.buttonText}>تسجيل خروج</Text>
          </Pressable>
        </ScrollView>

        <Text style={styles.userType}>
          {user?.role === "Worker" ? "صنايعي" : "عميل"}
        </Text>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    position: "absolute",
    right: 0,
    top: 0,
    width: "70%",
    height: "100%",
    backgroundColor: "rgba(189, 227, 228, 1)",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  nameText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: "black",
    textAlign: "right",
    marginTop: 4,
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "black",
    marginLeft: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontFamily: fonts.light,
    fontSize: 10,
    color: "black",
    marginRight: 4,
  },
  buttonsContainer: {
    width: "100%",
    padding: 10,
    marginTop: 10,
  },
  button: {
    flexDirection: "row-reverse",
    height: 50,
    backgroundColor: "rgba(4, 129, 134, 0.15)",
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    gap: 10,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonText: {
    fontFamily: fonts.light,
    fontSize: 20,
  },
  userType: {
    backgroundColor: "rgba(3, 95, 98, 0.52)",
    bottom: 35,
    width: "95%",
    padding: 10,
    textAlign: "center",
    fontSize: 20,
    fontFamily: fonts.bold,
    borderRadius: 5,
    color: "#fff",
  },
});
