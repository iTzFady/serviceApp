import { fonts } from "@/theme/fonts";
import { shadow } from "@/theme/styles";
import { Entypo, Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const defaultProfilePic = require("@/assets/images/default-profile.png");

export default function UploadButton({ value, onChange, type }) {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
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
        setPreviewImage(image.uri);
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
      Toast.show({
        type: "error",
        text1: "فشلت العملية",
        text2: "حدث خطا ما في عملية رفع الصورة",
        text1Style: {
          textAlign: "right",
        },
        text2Style: {
          textAlign: "right",
        },
      });
    } finally {
      setLoading(false);
    }
  }
  const imageRequestButton = (
    <>
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
    </>
  );
  const profilePicButton = (
    <>
      <Pressable style={styles.profilePicButton} onPress={pickImage}>
        <Image
          source={previewImage ? { uri: previewImage } : defaultProfilePic}
          style={styles.profileImage}
        />
        <View style={styles.overlay} />

        {loading ? (
          <ActivityIndicator
            style={{ marginVertical: "auto", paddingVertical: "auto" }}
            size="small"
            color="white"
          />
        ) : value ? (
          <Feather name="edit" size={24} color="white" />
        ) : (
          <Entypo name="plus" size={24} color="white" />
        )}
      </Pressable>
    </>
  );
  return (
    <View style={{ padding: 20 }}>
      {type === "ProfilePic" ? profilePicButton : imageRequestButton}
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
    ...shadow,
  },
  uploadButtonText: {
    fontSize: 20,
    fontFamily: fonts.regular,
  },
  profilePicButton: {
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    borderWidth: 1,
    alignSelf: "center",
  },
  profileImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 100,
  },
});
