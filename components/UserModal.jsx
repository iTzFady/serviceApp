import { useToken } from "@/context/TokenContext";
import { useUser } from "@/context/UserContext";
import { fonts } from "@/theme/fonts";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import RatingStars from "./RatingStars";
const defaultProfilePic = require("@/assets/images/default-profile.png");
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const { width } = Dimensions.get("window");
export default function RequestModal({ show, setShow, userType = "worker" }) {
  const slideAnim = useRef(new Animated.Value(width)).current;
  const router = useRouter();
  const { user, updateUser } = useUser();
  const { removeToken } = useToken();
  useEffect(() => {
    if (show) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 8,
        bounciness: 3,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: width,
        useNativeDriver: true,
        speed: 8,
        bounciness: 3,
      }).start();
    }
  }, [show, slideAnim]);

  const handleClose = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShow(false));
  }, [slideAnim, setShow]);
  const handleLogout = useCallback(async () => {
    Alert.alert(
      "تأكيد",
      "هل أنت متأكد أنك تريد تسجيل الخروج؟",
      [
        {
          text: "إلغاء",
          style: "cancel",
        },
        {
          text: "تأكيد",
          onPress: async () => {
            try {
              await removeToken("userToken");
              updateUser(null);
            } catch (err) {
              Toast.show({
                type: "success",
                text1: " حدث خطا ما",
                text2: "حدث خطا ما خلال عملية تسجيل الخروج",
                text1Style: {
                  textAlign: "right",
                },
                text2Style: {
                  textAlign: "right",
                },
              });
            } finally {
              router.replace("/login");
            }
          },
        },
      ],
      { cancelable: false }
    );
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

          <Pressable
            style={styles.button}
            onPress={() => {
              router.push("/chatHelp");
              setShow(false);
            }}
          >
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
        {/* <Pressable style={styles.button}>
          <FontAwesome6 name="user-shield" size={20} color="black" />
          <Text style={styles.buttonText}>السلامه</Text>
        </Pressable> */}
        {/* <Pressable style={styles.button}>
            <MaterialIcons name="settings" size={20} color="black" />
            <Text style={styles.buttonText}>الاعدادات</Text>
          </Pressable> */}
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
