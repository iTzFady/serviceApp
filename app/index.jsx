import FilterSection from "@/components/FilterSection";
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
import { centerContainer, shadow } from "@/theme/styles";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
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
      if (!token) {
        router.replace("/login");
        return;
      }
      const trimmedToken = token.trim();
      if (token !== trimmedToken) {
        setToken(trimmedToken);
      }
    };

    checkToken();
  }, [router, token, setToken]);

  useEffect(() => {
    try {
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
            return prevRequests.filter(
              (req) => req.id !== latest.data.requestId
            );
          }
          default:
            return prevRequests;
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, [events]);

  const handlePress = useCallback(
    (id) => {
      router.push({
        pathname: `/requestWorker/${id}`,
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
        handlePress(item.id);
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
      <Text style={styles.welcomeText}>مرحبا، {user?.name}</Text>
      <View style={styles.topBar}>
        <SearchBar
          handlePress={() => handleSearch(query)}
          handleChangeText={setQuery}
          value={query}
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
            <Text style={styles.categoryRightText}>تم الارسال الطلب ....</Text>
            <TouchableOpacity onPress={() => router.push("/clientRequests")}>
              <Text style={styles.categoryLeftText}>
                عرض كل الطلبات الجارية
              </Text>
            </TouchableOpacity>
          </View>
          <MiniRequest
            id={requests.at(0).requestedFor.id}
            name={requests.at(0).requestedFor.name}
            rating={requests.at(0).requestedFor.rating}
            status={requests.at(0).status}
            phoneNumber={requests.at(0).requestedFor.phoneNumber}
            profilePicUrl={requests.at(0).requestedFor.profilePictureUrl}
            router={router}
          />
        </View>
      ) : null}
      <View style={styles.workerCategory}>
        <View style={styles.category}>
          <Text style={styles.categoryRightText}>الصنايعه المتاحيين...</Text>
          <Text style={styles.categoryLeftText}>متاح الان</Text>
        </View>
      </View>
      {loading ? (
        <View style={centerContainer}>
          <ActivityIndicator size="large" color="green" />
        </View>
      ) : !filteredWorkers.length ? (
        <View style={centerContainer}>
          <Text style={{ fontFamily: fonts.light }}>
            لا يوجد صنايعية في الوقت الحالي
          </Text>
        </View>
      ) : (
        <Animated.FlatList
          style={{ paddingHorizontal: 10 }}
          keyExtractor={keyExtractor}
          itemLayoutAnimation={LinearTransition}
          renderItem={renderItem}
          data={filteredWorkers}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          windowSize={5}
          removeClippedSubviews={true}
          maxToRenderPerBatch={8}
          scrollEnabled={true}
          updateCellsBatchingPeriod={50}
          ListFooterComponent={<View style={{ height: 20 }} />}
        />
      )}
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
  welcomeText: {
    fontFamily: fonts.light,
    fontSize: 12,
    marginBottom: 5,
    textAlign: "center",
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
