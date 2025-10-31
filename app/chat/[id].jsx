import Message from "@/components/Message";
import { useToken } from "@/context/TokenContext";
import { useUser } from "@/context/UserContext";
import { useApi } from "@/hooks/useApi";
import useChatHub from "@/hooks/useChatHub";
import { fonts } from "@/theme/fonts";
import { centerContainer, shadow } from "@/theme/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated as anim,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

const defaultProfilePic = require("@/assets/images/default-profile.png");
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { token } = useToken();
  const { user } = useUser();
  const api = useApi();
  const [text, setText] = useState("");
  const [worker, setWorker] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesRef = useRef(null);
  const router = useRouter();
  const scale = new anim.Value(1);

  useEffect(() => {
    api
      .get(`/api/user/profile/${id}`)
      .then((res) => setWorker(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  const open = (url) => {
    setSelectedImage({ uri: url });
    setVisible(true);
    anim
      .spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      })
      .start();
  };
  const close = () => {
    anim
      .spring(scale, {
        toValue: 0.8,
        useNativeDriver: true,
      })
      .start(() => setVisible(false));
  };
  const {
    messages,
    isTyping,
    sendMessage,
    sendTyping,
    sendFileMessage,
    messagesLoading,
  } = useChatHub({
    apiUrl,
    token,
    userId: user?.id,
    receiverId: id,
  });
  useEffect(() => {
    if (messages.length > 0 && messagesRef.current) {
      messagesRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  const handleTyping = async (value) => {
    setText(value);
    sendTyping();
  };
  const renderItem = useCallback(
    ({ item }) => (
      <Message
        key={item.id}
        item={item}
        user={user}
        apiUrl={apiUrl}
        openImage={open}
      />
    ),
    [user]
  );
  if (!worker)
    return <ActivityIndicator size="large" style={centerContainer} />;
  return (
    <View style={styles.container}>
      <View style={styles.topStyle}>
        <View style={styles.topElement}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons
              name="arrow-back-ios"
              size={20}
              color="rgba(0,0,0,1)"
            />
          </TouchableOpacity>
          <View style={styles.contactInfo}>
            <Image
              style={styles.profilePic}
              alt="Profile Picture"
              resizeMode="cover"
              source={
                worker.profilePictureUrl
                  ? { uri: `${apiUrl}${worker.profilePictureUrl}` }
                  : defaultProfilePic
              }
            />
            <Text style={styles.topText}>{worker.name} </Text>
          </View>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {messagesLoading ? (
          <ActivityIndicator size="small" style={centerContainer} />
        ) : messages.length ? (
          <Animated.FlatList
            ref={messagesRef}
            data={messages}
            renderItem={renderItem}
            itemLayoutAnimation={LinearTransition}
            windowSize={10}
            maxToRenderPerBatch={10}
            initialNumToRender={20}
            removeClippedSubviews
            onEndReachedThreshold={0.1}
            style={{ flex: 1, padding: 10 }}
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        ) : (
          <View style={centerContainer}>
            <Text style={{ fontFamily: fonts.light }}>
              يمكنك بدء المحادثة بارسال رسالة
            </Text>
          </View>
        )}
        {isTyping && <Text style={styles.typingIndicator}>يكتب الآن...</Text>}
        <View style={styles.bottomStyle}>
          <TouchableOpacity
            onPress={() => {
              sendMessage(text);
              setText("");
            }}
            disabled={loading}
          >
            <MaterialIcons name="send" size={24} color="black" />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            value={text}
            placeholder="اكتب رسالة..."
            onChangeText={handleTyping}
            returnKeyType="send"
            enterKeyHint="send"
          />
          <TouchableOpacity onPress={sendFileMessage} disabled={loading}>
            <MaterialIcons name="insert-photo" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {selectedImage && (
        <Modal visible={visible} transparent onRequestClose={close}>
          <Pressable style={styles.overlay} onPress={close}>
            <anim.Image
              source={selectedImage}
              style={[styles.fullImage]}
              resizeMode="contain"
            />
          </Pressable>
        </Modal>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topStyle: {
    ...shadow,
    backgroundColor: "rgba(152, 152, 152, 1)",
    height: 100,
    borderTopWidth: 1,
  },
  topElement: {
    flexDirection: "row-reverse",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 5,
  },
  topText: {
    marginRight: 12,
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  backButton: {
    position: "absolute",
    left: 15,
  },
  contactInfo: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginRight: 15,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  bottomStyle: {
    ...shadow,
    flexDirection: "row-reverse",
    width: "100%",
    height: 70,
    paddingHorizontal: 10,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(152, 152, 152, 1)",
    borderBottomWidth: 1,
  },
  textInput: {
    ...shadow,
    height: 30,
    backgroundColor: "#fff",
    flex: 1,
    writingDirection: "rtl",
    padding: 10,
    paddingVertical: 0,
    borderRadius: 8,
    fontFamily: fonts.light,
  },
  message: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: "#4CAF50",
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: "#2196F3",
  },
  typingIndicator: {
    textAlign: "center",
    fontSize: 12,
    color: "#555",
    fontFamily: fonts.light,
    marginBottom: 4,
  },
  thumbnail: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
});
