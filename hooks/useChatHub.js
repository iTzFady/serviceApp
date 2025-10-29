import * as SignalR from "@microsoft/signalr";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import { LayoutAnimation } from "react-native";
import Toast from "react-native-toast-message";
import { useApi } from "./useApi";

export default function useChatHub({ apiUrl, token, userId, receiverId }) {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const api = useApi();
  const typingTimeout = useRef(null);

  useEffect(() => {
    if (!token || !userId || !receiverId) return;

    let hubConnection = new SignalR.HubConnectionBuilder()
      .withUrl(`${apiUrl}/hubs/chat`, {
        accessTokenFactory: () => token.trim(),
      })
      .withAutomaticReconnect()
      .build();

    hubConnection.keepAliveIntervalInMilliseconds = 15000;
    hubConnection.serverTimeoutInMilliseconds = 30000;

    const handleReceiveMessage = (
      senderId,
      recId,
      message,
      messageId,
      isImage = false
    ) => {
      if (senderId === receiverId && recId === userId) {
        setMessages((prev) => [
          ...prev,
          { id: messageId, senderId, receiverId: recId, message, isImage },
        ]);
      }
    };

    const handleMessageRead = (messageId) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    };
    const handleUserTyping = (senderId) => {
      if (senderId === receiverId) {
        setIsTyping(true);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setIsTyping(false), 3000);
      }
    };

    hubConnection.on("ReceiveMessage", handleReceiveMessage);
    hubConnection.on("MessageRead", handleMessageRead);
    hubConnection.on("UserTyping", handleUserTyping);

    const startConnection = async () => {
      try {
        setLoading(true);
        await hubConnection.start();
        setConnection(hubConnection);
        api
          .get(`${apiUrl}/api/chat/${userId}/${receiverId}`)
          .then((res) => setMessages(res.data))
          .finally(() => setLoading(false));
      } catch (err) {
        console.error("SignalR connection error:", err);
      }
    };

    startConnection();

    return () => {
      hubConnection.off("ReceiveMessage");
      hubConnection.off("MessageRead");
      hubConnection.off("UserTyping");
      hubConnection.stop();
    };
  }, [apiUrl, token, userId, receiverId]);

  useEffect(() => {
    if (!connection) return;
    messages.forEach((msg) => {
      if (msg.senderId === receiverId && !msg.isRead) {
        connection
          .invoke("MarkAsRead", msg.id)
          .catch((err) => console.log(err));
      }
    });
  }, [messages, connection, receiverId]);

  const sendMessage = async (text) => {
    if (!connection || !text.trim()) return;
    try {
      await connection.invoke(
        "SendMessage",
        userId,
        receiverId,
        text.trim(),
        false
      );
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          senderId: userId,
          receiverId: receiverId,
          message: text.trim(),
          isRead: false,
        },
      ]);
    } catch (err) {
      console.error("Send message failed:", err);
    }
  };

  const sendTyping = async () => {
    if (connection) {
      try {
        await connection.invoke("Typing", userId, receiverId);
      } catch (err) {
        console.log("Typing failed:", err);
      }
    }
  };
  const sendFileMessage = async () => {
    if (!connection) return;
    try {
      let result;
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "info",
          text1: "تنبيه",
          text2: "برجاء الموافقة علي الاذونات لاستكمال العملية",
          text1Style: {
            textAlign: "right",
          },
          text2Style: {
            textAlign: "right",
          },
        });
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 0.8,
      });
      if (result.canceled) return;
      const asset = result.assets[0];

      const formData = new FormData();
      formData.append("file", {
        uri: asset.uri,
        type: asset.mimeType || "application/octet-stream",
        name: asset.fileName || "upload",
      });
      const res = await axios.post(`${apiUrl}/api/chat/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      const fileUrl = res.data.url;
      await connection.invoke("SendMessage", userId, receiverId, fileUrl, true);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          senderId: userId,
          receiverId: receiverId,
          message: fileUrl,
          isImage: true,
          isRead: false,
        },
      ]);
    } catch (err) {
      console.log(err);
    }
  };
  return {
    messages,
    isTyping,
    sendMessage,
    sendTyping,
    sendFileMessage,
    messagesLoading: loading,
  };
}
