import { FontAwesome6 } from "@expo/vector-icons";
import { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function MessageItem({ item, user, apiUrl, openImage }) {
  return (
    <View
      style={[
        styles.message,
        item.senderId === user?.id ? styles.sent : styles.received,
      ]}
    >
      {item.isImage ? (
        <TouchableOpacity onPress={() => openImage(`${apiUrl}${item.message}`)}>
          <Image
            source={{ uri: `${apiUrl}${item.message}` }}
            style={{ width: 200, height: 200, borderRadius: 8 }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ) : (
        <Text style={{ color: "#fff" }}>{item.message}</Text>
      )}
      {item.senderId === user?.id && (
        <View style={{ alignItems: "flex-end" }}>
          {item.isRead ? (
            <FontAwesome6 name="check-double" size={15} color="#00e676" />
          ) : (
            <FontAwesome6 name="check" size={15} color="#ccc" />
          )}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
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

export default memo(MessageItem);
