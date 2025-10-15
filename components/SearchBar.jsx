import { fonts } from "@/theme/fonts";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
export default function SearchBar() {
  const [focused, setFocused] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleSearch = (open) => {
    Animated.timing(animation, {
      toValue: open ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
    setFocused(open);
  };

  const iconTranslate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, -150],
  });

  const inputOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const iconFlip = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["0deg", "90deg", "180deg"],
  });

  return (
    <View style={styles.searchContainer}>
      <Animated.View
        style={{
          transform: [{ translateX: iconTranslate }, { rotateY: iconFlip }],
        }}
      >
        <TouchableOpacity
          onPress={() => {
            toggleSearch(!focused);
          }}
        >
          <MaterialIcons name="search" size={14} color="#333" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={{ flex: 1, opacity: inputOpacity, marginLeft: 8 }}>
        <TextInput
          placeholder="بحث"
          placeholderTextColor="#999"
          enterKeyHint="search"
          inputMode="search"
          returnKeyType="search"
          style={styles.input}
          onFocus={() => toggleSearch(true)}
          onBlur={() => toggleSearch(false)}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "50%",
    height: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
  },
  input: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.71)",
    fontFamily: fonts.light,
    marginLeft: 15,
    paddingVertical: 0,
    textAlign: "right",
  },
});
