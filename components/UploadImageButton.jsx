import { fonts } from "@/theme/fonts";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Alert from "./Alert";

export default function UploadButton({ value, onChange }) {
  const [loading, setLoading] = useState(false);
  async function pickImage() {
    try {
      setLoading(true);
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("برجاء الموافقة علي الاذونات لاستكمال العملية");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled) {
        const image = result.assets[0];
        let file;
        if (Platform.OS === "web") {
          file = image.file;
        } else {
          const uri = image.uri;
          const filename = uri.split("/").pop();
          const match = /\.(\w+)$/.exec(filename ?? "");
          const type = match ? `image/${match[1]}` : "image/jpeg";
          file = {
            uri,
            name: filename,
            type,
          };
        }

        onChange(file);
      }
    } catch (err) {
      Alert("Error", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Pressable style={styles.uploadButton} onPress={pickImage}>
        {loading ? (
          <ActivityIndicator
            style={{ marginVertical: "auto", paddingVertical: "auto" }}
            size="small"
            color="#000"
          />
        ) : (
          <Text style={styles.uploadButtonText}>
            {value ? "غير الصورة" : "ارفاق صوره"}
          </Text>
        )}
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
    fontFamily: fonts.regular,
  },
});
