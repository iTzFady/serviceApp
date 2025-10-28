import { fonts } from "@/theme/fonts";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons/";
import { useCallback } from "react";
import {
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function ConversationPopup({
  requestedBy,
  requestedFor,
  show,
  setShow,
  phoneNumber,
  router,
}) {
  const openDialer = useCallback(() => {
    Linking.canOpenURL(`tel:${phoneNumber}`).then((supported) => {
      if (supported) {
        Linking.openURL(`tel:${phoneNumber}`);
      } else {
        console.log("Dialer not supported on this device");
      }
    });
  }, [phoneNumber]);
  const handlePress = useCallback(
    (name, profilePicture) => {
      setShow(false);
      router.push({
        pathname: `/chat/${requestedBy.id}`,
        params: { name, profilePicture },
      });
    },
    [router]
  );
  return (
    <SafeAreaView>
      <Modal visible={show} transparent={true} animationType="fade">
        <Pressable onPress={() => setShow(!show)} style={styles.container}>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, { backgroundColor: "#fff" }]}
              onPress={() =>
                handlePress(requestedBy.name, requestedBy.profilePictureUrl)
              }
            >
              <MaterialCommunityIcons
                name="message-reply-text"
                size={16}
                color="black"
              />
              <Text style={styles.buttonText}>محادثه مع العميل</Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                { backgroundColor: "rgba(127, 186, 78, 1)" },
              ]}
              onPress={openDialer}
            >
              <FontAwesome6
                name="phone"
                size={16}
                color="rgba(137, 240, 51, 0.89)"
              />
              <Text style={styles.buttonText}>{phoneNumber}</Text>
            </Pressable>
            <Text style={styles.footerText}>رقم العميل يحب التواصل معاه</Text>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,0.6)",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    position: "relative",
  },
  buttonContainer: {
    width: "65%",
    alignItems: "center",
    position: "absolute",
    bottom: 80,
  },
  button: {
    flexDirection: "row",
    borderRadius: 5,
    borderWidth: 1,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
    marginBlock: 5,
  },
  buttonText: {
    fontFamily: fonts.bold,
    fontSize: 15,
  },
  footerText: {
    fontFamily: fonts.regular,
    fontSize: 15,
  },
});
