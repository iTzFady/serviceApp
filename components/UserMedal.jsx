import { fonts } from "@/theme/fonts";
import {
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Modal from "react-native-modal";
const profilePic = require("@/assets/images/default-profile.png");

export default function RequestModal({ show, setShow, userType = "worker" }) {
  return (
    <View style={styles.container}>
      <Modal
        isVisible={show}
        onBackdropPress={() => setShow(false)}
        swipeDirection="right"
        animationIn="slideInRight"
        animationOut="slideOutRight"
        animationInTiming={300}
        animationOutTiming={300}
        backdropTransitionInTiming={100}
        backdropTransitionOutTiming={100}
        useNativeDriverForBackdrop
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View
            style={{
              flexDirection: "row-reverse",
              marginTop: 35,
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={profilePic}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.profileContainer}>
              <Text style={styles.nameText}>فادي سامي</Text>

              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>4.8</Text>
                <MaterialCommunityIcons
                  name="star"
                  size={18}
                  color="rgba(237, 237, 14, 0.81)"
                />
                <MaterialCommunityIcons
                  name="star"
                  size={18}
                  color="rgba(237, 237, 14, 0.81)"
                />
                <MaterialCommunityIcons
                  name="star"
                  size={18}
                  color="rgba(237, 237, 14, 0.81)"
                />
                <MaterialCommunityIcons
                  name="star"
                  size={18}
                  color="rgba(237, 237, 14, 0.81)"
                />
                <MaterialCommunityIcons
                  name="star"
                  size={18}
                  color="rgba(237, 237, 14, 0.81)"
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setShow(false)}
              style={{ marginRight: 20 }}
            >
              <MaterialIcons name="arrow-back-ios" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.buttonsContainer}>
            <Pressable style={styles.button}>
              <MaterialCommunityIcons name="bell" size={20} color="black" />
              <Text style={styles.buttonText}>الاشعارات</Text>
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
          </ScrollView>
          <Text style={styles.userType}>
            {userType === "worker" ? "صنايعي" : "عميل"}
          </Text>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#bde3e4",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    margin: 0,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  modalContent: {
    width: "70%",
    height: "100%",
    backgroundColor: "rgba(189, 227, 228, 1)",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
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
    marginBlock: 5,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    gap: 10,
    alignItems: "center",
    paddingInline: 20,
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
