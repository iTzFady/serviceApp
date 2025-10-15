import SearchBar from "@/components/SearchBar";
import SpecialityChip from "@/components/specialityChip.jsx";
import WebSelect from "@/components/WebSelect";
import WorkerCard from "@/components/WorkerCard";
import { fonts } from "@/theme/fonts";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
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
import { Workers } from "../data/workers";
const logo = require("../assets/images/logo.png");
const name = "فادي سامي";
export default function Index() {
  const [selectedChip, setSelectedChip] = useState(null);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [filterdWorkers, setFilteredWorkers] = useState(Workers);
  const router = useRouter();
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
    let filtered = Workers;
    if (selectedChip) {
      filtered = filtered.filter(
        (worker) => worker.WorkerSpecialty === selectedChip
      );
    }
    if (currentRegion) {
      filtered = filtered.filter((worker) => worker.region === currentRegion);
    }
    setFilteredWorkers(filtered);
  }, [currentRegion, selectedChip]);
  const renderItem = useCallback(
    ({ item }) => {
      return (
        <WorkerCard
          key={item.Id}
          id={item.Id}
          name={item.Name}
          speciality={item.WorkerSpecialty}
          availability={item.IsAvailable}
          rating={item.AverageRating}
          region={item.region}
          onPress={() =>
            handlePress(
              item.Id,
              item.Name,
              item.WorkerSpecialty,
              item.AverageRating
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
        <Image style={styles.logo} source={logo} />
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push(`/requests/[workerId].jsx`)}
        >
          <FontAwesome name="sliders" size={24} color="rgba(51, 109, 3, 1)" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>مرحبا، {name}</Text>
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
    resizeMode: "contain",
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
