import Alert from "@/components/Alert";
import SearchBar from "@/components/SearchBar";
import SpecialityChip from "@/components/specialityChip.jsx";
import WebSelect from "@/components/WebSelect";
import WorkerCard from "@/components/WorkerCard";
import { ThemeContext } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { fonts } from "@/theme/fonts";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";
import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Animated, { LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Regions } from "../data/regions";
import { Speciality } from "../data/speciality";

const logo = require("../assets/images/logo.png");
export default function Index() {
  const { user, updateUser } = useUser();
  const [selectedChip, setSelectedChip] = useState(null);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [filterdWorkers, setFilteredWorkers] = useState(workers);
  const [currentUser, setCurrentUser] = useState(user?.name);
  const [token, setToken] = useState(null);
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem("userToken");
      if (!storedToken) {
        router.replace("/login");
      } else {
        setToken(storedToken.trim());
      }
    };
    checkToken();
  }, [token, router]);
  useEffect(() => {
    if (token !== null) {
      axios({
        method: "get",
        url: `${apiUrl}/user/me`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          updateUser(res.data);
        })
        .catch((err) => {
          if (err.response && err.response.data) {
            Alert(
              "Error",
              err.response.data?.message || JSON.stringify(err.response.data)
            );
            AsyncStorage.removeItem("userToken");
          } else if (err.request) {
            Alert(
              "Network Error",
              "Unable to reach the server. Please check your connection."
            );
          } else {
            Alert("Error", "Something went wrong. Please try again later.");
            AsyncStorage.removeItem("userToken");
          }
        });
    }
  }, [token, apiUrl, updateUser]);
  useEffect(() => {
    if (token) {
      axios({
        method: "get",
        url: `${apiUrl}/user/workers`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setWorkers(res.data);
        })
        .catch((err) => {
          if (err.response && err.response.data) {
            Alert(
              "Error",
              err.response.data?.message || JSON.stringify(err.response.data)
            );
          } else if (err.request) {
            Alert(
              "Network Error",
              "Unable to reach the server. Please check your connection."
            );
          } else {
            Alert("Error", "Something went wrong. Please try again later.");
          }
        });
    }
  }, [apiUrl, token]);
  console.log(workers);
  const keyExtractor = useCallback((item) => item.Id.toString(), []);
  const handlePress = useCallback(
    (id, name, job, rating) => {
      router.push({
        pathname: `/requestWorker/${id}`,
        params: { name, job, rating },
      });
    },
    [router]
  );
  const applyFilter = useCallback(() => {
    let filtered = workers;
    if (selectedChip) {
      filtered = filtered.filter(
        (worker) => worker.workerSpecialty === selectedChip
      );
    }
    if (currentRegion) {
      filtered = filtered.filter((worker) => worker.region === currentRegion);
    }
    setFilteredWorkers(filtered);
  }, [currentRegion, selectedChip, workers]);
  const renderItem = useCallback(
    ({ item }) => {
      return (
        <WorkerCard
          key={item.id}
          id={item.id}
          name={item.name}
          speciality={item.workerSpecialty}
          availability={item.isAvailable}
          rating={item.averageRating}
          region={item.region}
          onPress={() =>
            handlePress(
              item.id,
              item.name,
              item.workerSpecialty,
              item.averageRating
            )
          }
        />
      );
    },
    [handlePress]
  );
  useEffect(() => {
    applyFilter();
  }, [applyFilter]);
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topStyle}>
        <Image style={styles.logo} source={logo} resizeMode="contain" />
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push(`/requests/[workerId].jsx`)}
        >
          <FontAwesome name="sliders" size={24} color="rgba(51, 109, 3, 1)" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>مرحبا، {currentUser}</Text>
        <View style={styles.topBar}>
          <SearchBar />
          <Pressable style={styles.requestButton}>
            <Entypo
              style={{ marginRight: 10 }}
              name="text-document"
              size={14}
              color="black"
            />
            <Text style={styles.requestButtonText}>طلب خدمه</Text>
          </Pressable>
        </View>
        <View style={styles.workerCategory}>
          <View style={styles.category}>
            <Text style={styles.categoryRightText}>اختر التخصص</Text>
            <TouchableOpacity
              style={{ width: "50%" }}
              onPress={() => setSelectedChip(null)}
            >
              <Text style={styles.categoryLeftText}>كل التخصصات</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.categoryTabs}
            horizontal={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            {Speciality.map((speciality) => (
              <SpecialityChip
                key={speciality.id}
                iconPath={speciality.icon}
                text={speciality.label}
                value={speciality.value}
                selected={selectedChip === speciality.value}
                onPressEvent={() => setSelectedChip(speciality.value)}
              />
            ))}
          </ScrollView>
        </View>

        {Platform.OS === "web" ? (
          <WebSelect
            data={Regions}
            onChange={(value) => setCurrentRegion(value)}
            placeHolder="..اختر منطقتك"
          />
        ) : (
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={styles.dropdown}
              mode="modal"
              data={Regions}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectText}
              itemTextStyle={styles.dropdownItem}
              maxHeight={250}
              labelField="label"
              valueField="value"
              placeholder="اختر منطقتك"
              onChange={(item) => setCurrentRegion(item.value)}
              activeColor="#e0f7fa"
            />
          </View>
        )}
        <View style={styles.workerCategory}>
          <View style={styles.category}>
            <Text style={styles.categoryRightText}>الصنايعه المتاحيين...</Text>
            <Text style={styles.categoryLeftText}>متاح الان</Text>
          </View>

          {Platform.OS === "web" ? (
            <ScrollView style={{ height: "60vh" }}>
              <FlatList
                style={styles.workerCardContainer}
                renderItem={renderItem}
                data={filterdWorkers}
                scrollEnabled={false}
                showsVerticalScrollIndicator={true}
              />
            </ScrollView>
          ) : (
            <Animated.FlatList
              keyExtractor={keyExtractor}
              itemLayoutAnimation={LinearTransition}
              style={styles.workerCardContainer}
              renderItem={renderItem}
              data={filterdWorkers}
              showsVerticalScrollIndicator={false}
              initialNumToRender={8}
              windowSize={5}
              removeClippedSubviews={true}
            />
          )}
        </View>
      </View>
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
    height: 80,
  },
  logo: {
    width: 110,
    marginHorizontal: "auto",
  },
  settingsButton: {
    position: "absolute",
    left: 5,
    marginLeft: 20,
  },
  container: {
    alignItems: "center",
  },
  welcomeText: {
    fontFamily: fonts.light,
    fontSize: 12,
    marginBottom: 5,
  },
  topBar: {
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row-reverse",
    gap: 5,
  },
  requestButton: {
    width: "50%",
    height: 25,
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "rgba(175, 237, 123, 1)",
    borderRadius: 5,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
  },
  requestButtonText: {
    fontFamily: fonts.light,
    fontSize: 12,
    marginRight: 10,
  },
  workerCategory: {
    flexDirection: "column",
    width: "100%",
    padding: 15,
  },
  category: {
    flexDirection: "row-reverse",
    width: "100%",
    alignItems: "center",
  },
  categoryLeftText: {
    textAlign: "left",
    fontSize: 12,
    width: "50%",
    fontFamily: fonts.light,
    color: "rgba(34, 71, 3, 1)",
  },
  categoryRightText: {
    textAlign: "right",
    width: "50%",
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: "rgba(34, 71, 3, 1)",
  },
  categoryTabs: {
    marginTop: 10,
  },
  dropdownContainer: {
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  dropdown: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 5,
    height: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
  },
  dropdownSelectText: {
    color: "#000",
    textAlign: "right",
    fontSize: 12,
    fontFamily: fonts.extraLight,
  },
  dropdownPlaceholder: {
    color: "black",
    textAlign: "right",
    marginRight: 8,
    fontSize: 12,
    fontFamily: fonts.extraLight,
  },
  dropdownItemContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    margin: 10,
  },
  dropdownItem: {
    color: "#333",
    textAlign: "right",
    fontSize: 20,
    marginRight: 15,
    fontFamily: fonts.extraLight,
  },
  workerCardContainer: {
    width: "100%",
  },
});
