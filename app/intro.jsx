import Button from "@/components/Button";
import Separator from "@/components/Separator";
import { ThemeContext } from "@/context/ThemeContext";
import { fonts } from "@/theme/fonts";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { SafeAreaView } from "react-native-safe-area-context";
import { slides } from "../data/slides";

const logo = require("../assets/images/logo.png");
const { width, height } = Dimensions.get("window");

export default function IntroScreen() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [showApp, setShowApp] = useState(false);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  useEffect(() => {
    const checkIntro = async () => {
      const hasSeenIntro = await AsyncStorage.getItem("hasSeenIntro");
      if (hasSeenIntro) {
        setShowApp(true);
        router.replace("/login");
      }
      setLoading(false);
    };
    checkIntro();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("@/assets/images/logo.png")}
          style={{ width: 150, height: 150 }}
        />
      </View>
    );
  }
  const finishIntro = async (route) => {
    router.replace(route);
    await AsyncStorage.setItem("hasSeenIntro", "true");
  };
  const createSlider = ({ item }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
        <Image style={styles.image} source={item.image} resizeMode="contain" />
        <Separator separatorWidth="85%" margin={15} />
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
              onPressEvent={() => {
                finishIntro("/register");
              }}
            />
            <Button
              backgroundColor={"rgba(81,135,245,0.2)"}
              text={"تسجيل دخول"}
              color={"rgba(81,135,245,1)"}
              fontSize={24}
              height={45}
              onPressEvent={() => {
                finishIntro("/login");
              }}
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
              onPressEvent={() => {
                const nextIndex = index + 1;
                sliderRef.current?.goToSlide(nextIndex, true);
                setIndex(nextIndex);
              }}
            />
            <Button
              backgroundColor={"rgba(81,135,245,0.2)"}
              text={"تخطي"}
              color={"rgba(81,135,245,1)"}
              fontSize={24}
              height={45}
              onPressEvent={() => {
                const lastIndex = slides.length - 1;
                sliderRef.current?.goToSlide(lastIndex, true);
                setIndex(lastIndex);
              }}
            />
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topStyle}>
        <Image style={styles.logo} source={logo} />
        {index > 0 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              const prevIndex = Math.max(index - 1, 0);
              sliderRef.current?.goToSlide(prevIndex, true);
              setIndex(prevIndex);
            }}
          >
            <MaterialIcons
              name="arrow-back-ios"
              size={24}
              color="rgba(127,186,78,1)"
            />
          </TouchableOpacity>
        )}
      </View>
      <ScrollView>
        <AppIntroSlider
          ref={sliderRef}
          data={slides}
          showSkipButton={false}
          renderItem={createSlider}
          renderPagination={renderPagination}
          onSlideChange={(index) => setIndex(index)}
          scrollEnabled={false}
        />
      </ScrollView>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topStyle: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 5,
    marginLeft: 20,
  },

  logo: {
    width: 110,
    marginHorizontal: "auto",
    resizeMode: "contain",
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: width * 0.07,
    color: "#000000",
    fontFamily: fonts.bold,
    textAlign: "center",
  },
  text: {
    fontSize: width * 0.04,
    color: "#000000",
    fontFamily: fonts.semiBold,
    textAlign: "center",
  },
  image: {
    width: width * 0.65,
    height: height * 0.4,
  },
  footer: {
    position: "relative",
    bottom: 0,
    width: "100%",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
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
    paddingHorizontal: width * 0.05,
    width: "100%",
  },
});
