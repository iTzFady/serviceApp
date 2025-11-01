import { fonts } from "@/theme/fonts";
import { shadow } from "@/theme/styles";
import { formatTime } from "@/utility/formatTime";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function NotificationCard({ title, body, dateTime, type }) {
  console.log(type);
  const iconName =
    type === "Message"
      ? "chat-bubble"
      : type === "Alert"
      ? "notifications"
      : "info-outline";

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <MaterialIcons
            name={iconName}
            size={24}
            color="rgba(127, 186, 78, 1)"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body} numberOfLines={2}>
            {body}
          </Text>
          <Text style={styles.date}>{formatTime(dateTime)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    ...shadow,
    backgroundColor: "#fff",
    borderColor: "#E0E0E0",
  },
  row: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 40,
    alignItems: "center",
    marginTop: 3,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  title: {
    color: "#000",
    fontSize: 16,
    marginBottom: 2,
    fontFamily: fonts.medium,
    textAlign: "right",
  },
  body: {
    fontSize: 14,
    marginBottom: 6,
    color: "#444",
    fontFamily: fonts.light,
    textAlign: "right",
  },
  date: {
    fontSize: 12,
    alignSelf: "flex-end",
    color: "#888",
    fontFamily: fonts.light,
  },
});
