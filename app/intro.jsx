import Button from "@/components/Button";
import {
  Cairo_600SemiBold,
  Cairo_700Bold,
  useFonts,
} from "@expo-google-fonts/cairo";
import { useRef, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { SafeAreaView } from "react-native-safe-area-context";
import { slides } from "../data/slides";

export default function IntroScree() {
  const [loaded, error] = useFonts({
    Cairo_700Bold,
    Cairo_600SemiBold,
  });
  const [index, setIndex] = useState(0);
  const sliderRef = useRef(null);
  if (!loaded && !error) {
    return null;
  }
  const createSlider = ({ item }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
        <Image style={styles.image} source={item.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };
  const renderPagination = (activeIndex) => (
    <View style={styles.footer}>
      <View style={styles.dotsContainer}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex ? styles.activeDot : null]}
          ></View>
        ))}
      </View>
      <View style={styles.buttonsContainer}>
        {activeIndex === slides.length - 1 ? (
          <View>
            <Button
              backgroundColor={"rgba(127, 186, 78, 1)"}
              text={"انشاء حساب جديد"}
              color={"#fff"}
              fontSize={24}
              height={45}
            />
            <Button
              backgroundColor={"rgba(81,135,245,0.2)"}
              text={"تسجيل دخول"}
              color={"rgba(81,135,245,1)"}
              fontSize={24}
              height={45}
            />
          </View>
        ) : (
          <View>
            <Button
              backgroundColor={"rgba(127, 186, 78, 1)"}
              text={"متابعة"}
              color={"#fff"}
              fontSize={24}
              height={45}
              onpress={() => {
                setIndex(index + 1);
                sliderRef.current.goToSlide(index);
              }}
            />
            <Button
              backgroundColor={"rgba(81,135,245,0.2)"}
              text={"تخطي"}
              color={"rgba(81,135,245,1)"}
              fontSize={24}
              height={45}
            />
          </View>
        )}
      </View>
    </View>
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <AppIntroSlider
        ref={sliderRef}
        data={slides}
        showSkipButton={false}
        renderItem={createSlider}
        renderPagination={renderPagination}
        onSlideChange={(index) => setIndex(index)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#Bde3e4",
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    color: "#000000",
    fontFamily: "Cairo_700Bold",
    textAlign: "center",
  },
  text: {
    fontSize: 20,
    color: "#000000",
    fontFamily: "Cairo_600SemiBold",
    textAlign: "center",
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  footer: {
    // position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: "rgba(81, 135, 245 , .15)",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",
  },
  activeDot: {
    backgroundColor: "rgba(81,135,245,1)",
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    gap: 20,
    width: "100%",
  },
});
