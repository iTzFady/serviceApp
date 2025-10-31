import TypingBubble from "@/components/TypingBubble";
import { fonts } from "@/theme/fonts";
import { shadow } from "@/theme/styles";
import { getHelp } from "@/utility/aiHub";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChatHelp() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "مرحباً 👋 كيف يمكنني مساعدتك اليوم؟",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const flatListRef = useRef();
  const router = useRouter();

  const renderItems = useCallback(({ item }) => (
    <View
      style={[
        styles.message,
        item.role === "user" ? styles.sent : styles.received,
      ]}
    >
      <Text style={{ color: "#fff" }}>{item.content}</Text>
    </View>
  ));

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    try {
      const response = await getHelp(input);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch (error) {
      console.error("Error getting AI help:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.",
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

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
          <Text style={styles.topText}>المساعد الآلي</Text>
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItems}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          contentContainerStyle={{ padding: 10 }}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        {isStreaming && <TypingBubble />}
        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="اكتب رسالتك هنا..."
            style={styles.input}
            editable={!isStreaming}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={[
              styles.sendButton,
              isStreaming && { backgroundColor: "#ccc" },
            ]}
            disabled={isStreaming}
          >
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    backgroundColor: "#fff",
  },
  topStyle: {
    ...shadow,
    backgroundColor: "rgba(152, 152, 152, 1)",
    height: 120,
    borderTopWidth: 1,
  },
  topElement: {
    flexDirection: "row-reverse",
    alignItems: "center",
    width: "100%",
    marginVertical: "auto",
  },
  backButton: {
    position: "absolute",
    left: 15,
  },
  topText: {
    fontSize: 25,
    fontFamily: fonts.regular,
    marginHorizontal: "auto",
    marginVertical: "auto",
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 8,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    marginRight: 8,
    maxHeight: 100,
    fontFamily: fonts.light,
    textAlign: "right",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    padding: 10,
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
});
