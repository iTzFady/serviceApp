import { fonts } from "@/theme/fonts";
import { useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Switch({ state, toggleState, disabled }) {
  const translateAnim = useState(new Animated.Value(state ? 0 : 1))[0];

  const toggleSwitch = () => {
    const toValue = state ? 1 : 0;
    Animated.timing(translateAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    toggleState(!state);
  };
  const backgroundColor = translateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(30, 216, 70, 1)", "#fff"],
  });

  const translateX = translateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 100],
  });

  return (
    <TouchableOpacity
      onPress={toggleSwitch}
      activeOpacity={0.9}
      disabled={disabled}
    >
      <Animated.View style={styles.container}>
        <Animated.View
          style={[
            styles.inner,
            { backgroundColor },
            { transform: [{ translateX }] },
          ]}
        >
          <Text style={[styles.text, { color: state ? "#fff" : "#000" }]}>
            {state ? "Online" : "Offline"}
          </Text>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    width: 185,
    height: 35,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
  },
  inner: {
    width: 80,
    height: 28,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 15,
    fontFamily: fonts.semiBold,
  },
});
