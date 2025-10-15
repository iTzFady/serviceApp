import { fonts } from "@/theme/fonts";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Shadow } from "react-native-shadow-2";
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
  textStyle = { fontFamily: fonts.medium, fontSize: 20 },
  labelStyle = { fontSize: 20 },
}) {
  return (
    <View style={styles.container}>
      <Text style={[styles.TextFieldLabel, labelStyle]}>{text}</Text>
      <Shadow
        style={{ width: "100%" }}
        distance={4}
        startColor="rgba(0,0,0,0.25)"
        endColor="rgba(0,0,0,0)"
      >
        <View style={styles.TextFieldContainer}>
          <TextInput
            style={[styles.TextField, textStyle]}
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
      </Shadow>
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
    fontFamily: fonts.medium,
    fontSize: 20,
    width: "100%",
    textAlign: "right",
  },
  TextField: {
    flex: 1,
    height: "100%",
    textAlign: "right",
    writingDirection: "rtl",
  },
});
