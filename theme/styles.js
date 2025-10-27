import { Platform } from "react-native";

export const shadow = {
  ...Platform.select({
    web: {
      boxshadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    },
    default: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.5,
      shadowRadius: 6,
      elevation: 4,
    },
  }),
};
