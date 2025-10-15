import { fonts } from "@/theme/fonts";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Dimensions,
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
const screenHeight = Dimensions.get("window").height;

const person = {
  name: "ابانوب جرجس لمعي",
  rating: 4.8,
  problem: "عندي فيشه مش شغاله",
  description: "حصل قفله كبيره ومن ساعتها فيها ريحه",
  address: "15 شارع عبد العليم متفرع من الزهور -الحضره الجديه اسكندريه",
  date: "الخميس 18 يونيو - الساعه 5 ",
  notes: "",
  image:
    "https://media.istockphoto.com/id/483724081/photo/yosemite-valley-landscape-and-river-california.jpg?s=2048x2048&w=is&k=20&c=j0OSpP2sAz582wDP0t28BzmwSMb0BJ2li7koJ2yROcA=",
};

export default function RequestModal({ show, setShow }) {
  return (
    <View style={styles.container}>
      <Modal
        isVisible={show}
        onBackdropPress={() => setShow(false)}
        swipeDirection="down"
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={300}
        animationOutTiming={300}
        backdropTransitionInTiming={100}
        backdropTransitionOutTiming={100}
        useNativeDriverForBackdrop
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.clientDetails}>
            <View
              style={{
                flexDirection: "row-reverse",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Image style={styles.profilePicStyle} source={profilePic} />
              <Text style={styles.userDetailText}>{person.name}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons
                name="star"
                size={18}
                color="rgba(237, 237, 14, 0.81)"
              />
              <Text style={[styles.userDetailText, { fontSize: 10 }]}>
                {person.rating}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setShow(false)}>
              <FontAwesome name="close" size={17} color="black" />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <Text style={styles.textStyle}>{person.problem}</Text>
            <Text style={styles.textStyle}>{person.description}</Text>
            <Text style={styles.textStyle}>{person.address}</Text>
            <Text style={styles.textStyle}>{person.date}</Text>
            {person.notes && (
              <Text style={styles.textStyle}>{person.notes}ملاحظات: </Text>
            )}
            {person.image && (
              <Image
                resizeMode="contain"
                style={styles.requestImage}
                source={{ uri: person.image }}
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
    alignContent: "center",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#0d5d5e",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: screenHeight * 0.6,
  },
  clientDetails: {
    flexDirection: "row-reverse",
    alignItems: "center",
    width: "100%",
    alignContent: "center",
    justifyContent: "space-between",
  },
  profilePicStyle: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 50,
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
    verticalAlign: "middle",
    marginBlock: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    padding: 10,
    gap: 10,
  },
  button: {
    width: "50%",
    minHeight: 50,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  buttonText: {
    color: "#fff",
    fontFamily: fonts.bold,
    textAlign: "center",
    marginVertical: 8,
  },
  requestImage: {
    width: "100%",
    height: 200,
  },
});
