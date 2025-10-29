import { fonts } from "@/theme/fonts";
import { shadow } from "@/theme/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
export default function SearchBar({ handlePress, handleChangeText, query }) {
  const [focused, setFocused] = useState(false);
  const [searchBarLayout, setSearchBarLayout] = useState({
    width: 0,
    height: 0,
  });
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
    outputRange: [-10, -searchBarLayout.width + 25],
  });

  const inputOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const iconFlip = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["180deg", "90deg", "0deg"],
  });

  return (
    <View
      style={styles.searchContainer}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setSearchBarLayout({ width, height });
      }}
    >
      <Animated.View
        style={{
          transform: [{ translateX: iconTranslate }, { rotateY: iconFlip }],
        }}
      >
        <TouchableOpacity
          onPress={() => {
            handlePress();
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
          onSubmitEditing={handlePress}
          onChangeText={handleChangeText}
          value={query}
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
    flex: 1,
    height: 25,
    ...shadow,
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
