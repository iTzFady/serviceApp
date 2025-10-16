import { Alert, Platform } from "react-native";
export default function AlertMessage(topText = "Alert", message) {
  return Platform.OS === "web" ? alert(message) : Alert.alert(topText, message);
}
