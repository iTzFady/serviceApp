import { Cairo_500Medium, useFonts } from "@expo-google-fonts/cairo";
import { StyleSheet, Text, TextInput, View } from "react-native";
export default function InputField({
  text,
  autoCapitalize,
  autoComplete,
  inputMode,
  keyboardType,
  onChangeText,
  placeholder,
  icon,
  secureTextEntry,
  value,
}) {
  const [loaded, error] = useFonts({
    Cairo_500Medium,
  });

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.TextFieldLabel}>{text}</Text>
      <View style={styles.TextFieldContainer}>
        <TextInput
          style={styles.TextField}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          inputMode={inputMode}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
          placeholder={placeholder}
          value={value}
        ></TextInput>
        {icon}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    marginHorizontal: "auto",
  },
  TextFieldContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 18,
    backgroundColor: "rgba(127, 186, 78, 0.1)",
    borderRadius: 10,
    borderWidth: 1,
  },
  TextFieldLabel: {
    fontFamily: "Cairo_500Medium",
    fontSize: 20,
    width: "100%",
    textAlign: "right",
  },
  TextField: {
    flex: 1,
    height: "100%",
    textAlign: "right",
    fontFamily: "Cairo_500Medium",
    fontSize: 20,
  },
});
