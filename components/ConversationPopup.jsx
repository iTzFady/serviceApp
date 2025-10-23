import { fonts } from "@/theme/fonts";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons/";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function ConversationPopup({ show }) {
  return (
    <SafeAreaView>
      <Modal visible={show} transparent={true} animationType="fade">
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <Pressable style={[styles.button, { backgroundColor: "#fff" }]}>
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
            >
              <FontAwesome6
                name="phone"
                size={16}
                color="rgba(137, 240, 51, 0.89)"
              />
              <Text style={styles.buttonText}>01285125478</Text>
            </Pressable>
            <Text style={styles.footerText}>رقم العميل يحب التواصل معاه</Text>
          </View>
        </View>
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
  },
  buttonContainer: {
    width: "65%",
    alignItems: "center",
    marginBottom: 50,
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
