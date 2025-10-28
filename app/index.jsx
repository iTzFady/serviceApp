import { default as Alert, default as AlertMessage } from "@/components/Alert";
import MiniRequest from "@/components/MiniRequest";
import SearchBar from "@/components/SearchBar";
import UserModal from "@/components/UserModal";
import WorkerCard from "@/components/WorkerCard";
import { useRequestsHub } from "@/context/RequestsHubContext";
import { ThemeContext } from "@/context/ThemeContext";
import { useToken } from "@/context/TokenContext";
import { useUser } from "@/context/UserContext";
import { useFetchUserData } from "@/hooks/useFetchUserData";
import { fonts } from "@/theme/fonts";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Animated, { LinearTransition } from "react-native-reanimated";

import FilterSection from "@/components/FilterSection";
import { shadow } from "@/theme/styles";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const logo = require("../assets/images/logo.png");
export default function Index() {
  const { user } = useUser();
  const { token, setToken, removeToken } = useToken();
  const { workers, requests, loading, setRequests } = useFetchUserData();
  const { events } = useRequestsHub();
  const { colorScheme } = useContext(ThemeContext);
  const [selectedChip, setSelectedChip] = useState(null);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  useEffect(() => {
    const checkToken = async () => {
      if (!token) router.replace("/login");
      else setToken(token.trim());
    };
    checkToken();
  }, [router]);

  useEffect(() => {
    if (!events.length) return;
    const latest = events[events.length - 1];
    setRequests((prevRequests) => {
      if (!prevRequests || prevRequests.length === 0) return prevRequests;

      switch (latest.type) {
        case "Accepted": {
          return prevRequests.map((req) =>
            req.id === latest.data.requestId
              ? { ...req, status: "Accepted" }
              : req
          );
        }
        case "Rejected":
        case "Cancelled":
        case "Completed": {
          return prevRequests.filter((req) => req.id !== latest.data.requestId);
        }
        default:
          return prevRequests;
      }
    });
  }, [events]);

  const handleError = useCallback((err) => {
    if (err.status === 401) {
      AlertMessage(
        "Session Expired",
        "You must re-login because session ended"
      );
      removeToken();
      router.replace("/login");
    }
    if (err.response && err.response.data)
      Alert(
        "Error",
        err.response.data?.message || JSON.stringify(err.response.data)
      );
    else if (err.request)
      Alert(
        "Network Error",
        "Unable to reach the server. Please check your connection."
      );
    else Alert("Error", "Something went wrong. Please try again later.");
  }, []);
  const handlePress = useCallback(
    (id, name, job, rating, profilePicture) => {
      router.push({
        pathname: `/requestWorker/${id}`,
        params: { name, job, rating, profilePicture },
      });
    },
    [router]
  );
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const filteredWorkers = useMemo(() => {
    if (!selectedChip && !currentRegion) return workers;
    return workers.filter(
      (worker) =>
        (!selectedChip || worker.workerSpecialty === selectedChip) &&
        (!currentRegion || worker.region === currentRegion)
    );
  }, [workers, selectedChip, currentRegion]);
  const renderItem = useCallback(
    ({ item }) => {
      const pressHandler = () => {
        handlePress(
          item.id,
          item.name,
          item.workerSpecialty,
          item.averageRating,
          item.profilePictureUrl
        );
      };
      return (
        <WorkerCard
          key={item.id}
          id={item.id}
          {...item}
          onPress={pressHandler}
        />
      );
    },
    [handlePress]
  );
  const handleSearch = useCallback(
    (query) => {
      setQuery("");
      router.push({
        pathname: `/search/`,
        params: { query },
      });
    },
    [router]
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topStyle}>
        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => setShowUserModal(true)}
        >
          <MaterialIcons
            name="settings"
            size={25}
            color="rgba(51, 109, 3, 1)"
          />
        </TouchableOpacity>
        <Image style={styles.logo} source={logo} resizeMode="contain" />

        {user?.role === "Worker" ? (
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push("/workerRequests")}
          >
            <FontAwesome name="sliders" size={24} color="rgba(51, 109, 3, 1)" />
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>مرحبا، {user?.name}</Text>
        <View style={styles.topBar}>
          <SearchBar
            handlePress={() => handleSearch(query)}
            handleChangeText={setQuery}
          />
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
        <FilterSection
          setSelectedChip={setSelectedChip}
          setCurrentRegion={setCurrentRegion}
          selectedChip={selectedChip}
        />
        {requests.length > 0 ? (
          <View style={styles.workerCategory}>
            <View style={styles.category}>
              <Text style={styles.categoryRightText}>
                تم الارسال الطلب ....
              </Text>
              <TouchableOpacity onPress={() => router.push("/clientRequests")}>
                <Text style={styles.categoryLeftText}>
                  عرض كل الطلبات الجارية
                </Text>
              </TouchableOpacity>
            </View>
            <MiniRequest
              name={requests.at(0).requestedFor.name}
              rating={requests.at(0).requestedFor.rating}
              status={requests.at(0).status}
              phoneNumber={requests.at(0).requestedFor.phoneNumber}
              profilePicUrl={requests.at(0).requestedFor.profilePictureUrl}
            />
          </View>
        ) : null}
        <View style={styles.workerCategory}>
          <View style={styles.category}>
            <Text style={styles.categoryRightText}>الصنايعه المتاحيين...</Text>
            <Text style={styles.categoryLeftText}>متاح الان</Text>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="green" />
          ) : !workers.length ? (
            <Text>لا يوجد صنايعية في الوقت الحالي</Text>
          ) : Platform.OS === "web" ? (
            <FlatList
              keyExtractor={keyExtractor}
              contentContainerStyle={{ height: "70vh" }}
              renderItem={renderItem}
              data={filteredWorkers}
              scrollEnabled={true}
              showsVerticalScrollIndicator={true}
              initialNumToRender={8}
              ListFooterComponent={<View style={{ height: 50 }} />}
            />
          ) : (
            <Animated.FlatList
              keyExtractor={keyExtractor}
              itemLayoutAnimation={LinearTransition}
              renderItem={renderItem}
              data={filteredWorkers}
              showsVerticalScrollIndicator={false}
              initialNumToRender={8}
              windowSize={5}
              removeClippedSubviews={true}
              maxToRenderPerBatch={8}
              updateCellsBatchingPeriod={50}
              ListFooterComponent={<View style={{ height: 100 }} />}
            />
          )}
        </View>
      </View>
      <UserModal show={showUserModal} setShow={setShowUserModal} />
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
  modalButton: {
    position: "absolute",
    right: 5,
    marginRight: 20,
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
    flex: 1,
    height: 25,
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "rgba(175, 237, 123, 1)",
    borderRadius: 5,
    ...shadow,
  },
  requestButtonText: {
    fontFamily: fonts.light,
    fontSize: 12,
    marginRight: 10,
  },
  workerCategory: {
    flexDirection: "column",
    width: "100%",
    paddingHorizontal: 15,
    marginBlock: 5,
  },
  category: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  categoryLeftText: {
    textAlign: "left",
    fontSize: 12,
    flex: 1,
    fontFamily: fonts.light,
    color: "rgba(34, 71, 3, 1)",
  },
  categoryRightText: {
    textAlign: "right",
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: "rgba(34, 71, 3, 1)",
    marginVertical: "auto",
  },
});
