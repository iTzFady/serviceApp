import * as ImagePicker from "expo-image-picker";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function UploadButton({ value, onChange }) {
  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status != "granted") {
      alert("برجاء الموافقة علي الاذونات لاستكمال العملية");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  }
  return (
    <View style={{ padding: 20 }}>
      <Pressable style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>
          {value ? "غير الصورة" : "ارفاق صوره"}
        </Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  uploadButton: {
    width: "100%",
    height: 40,
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.5)",
    backgroundColor: "rgba(165, 234, 237, 0.88)",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
  },
  uploadButtonText: {
    fontSize: 20,
    fontFamily: "Cairo_400Regular",
  },
});
