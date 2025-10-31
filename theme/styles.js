import { Platform } from "react-native";

export const shadow = {
  ...Platform.select({
    web: {
      boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    },
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.5,
      shadowRadius: 3,
    },
    android: {
      elevation: 4,
      backgroundColor: "#Bde3e4",
    },
  }),
};
export const centerContainer = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
};
