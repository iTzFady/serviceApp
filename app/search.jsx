import FilterSection from "@/components/FilterSection";
import WorkerCard from "@/components/WorkerCard";
import { useApi } from "@/hooks/useApi";
import { fonts } from "@/theme/fonts";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
const logo = require("../assets/images/logo.png");

export default function SearchResultsScreen() {
  const { query } = useLocalSearchParams();
  const api = useApi();
  const [workers, setWorkers] = useState([]);
  const [selectedChip, setSelectedChip] = useState(null);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [currentQuery, setCurrentQuery] = useState(query);
  useEffect(() => {
    api
      .get("/api/user/workers", { headers: { allWorkers: true } })
      .then((res) => setWorkers(res.data))
      .catch((err) => console.error(err));
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
  const filteredWorkers = useMemo(() => {
    let result = workers;
    if (selectedChip)
      result = result.filter((w) => w.workerSpecialty === selectedChip);
    if (currentRegion)
      result = result.filter((w) => w.region === currentRegion);
    if (currentQuery?.trim() !== "") {
      const q = currentQuery?.toLowerCase();
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.workerSpecialty.toLowerCase().includes(q) ||
          (w.region && w.region.toLowerCase().includes(q))
      );
    }
    return result;
  }, [workers, currentQuery, selectedChip, currentRegion]);
  return (
    <View style={styles.container}>
      <View style={styles.topStyle}>
        <View style={styles.topElement}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons
              name="arrow-back-ios"
              size={20}
              color="rgba(0,0,0,1)"
            />
          </TouchableOpacity>
          <Text style={styles.topText}>البحث</Text>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          value={currentQuery}
          onChangeText={setCurrentQuery}
          placeholder="ابحث هنا..."
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => setCurrentQuery("")}
        >
          <MaterialIcons name="clear" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={{ paddingHorizontal: 8 }}>
        <FilterSection
          setSelectedChip={setSelectedChip}
          setCurrentRegion={setCurrentRegion}
          selectedChip={selectedChip}
        />
        <Text style={styles.text}>نتائج البحث</Text>
        <FlatList
          data={filteredWorkers}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  topStyle: {
    backgroundColor: "rgba(127, 186, 78, 1);",
    flexDirection: "column",
    bottom: 0,
    alignItems: "center",
    height: 100,
    borderTopWidth: 1,
  },
  topElement: {
    flexDirection: "row-reverse",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  topText: {
    marginRight: 20,
    fontSize: 24,
    fontFamily: fonts.light,
  },
  backButton: {
    position: "absolute",
    left: 5,
    marginLeft: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    textAlign: "right",
    fontSize: 14,
    writingDirection: "rtl",
    width: "100%",
    fontFamily: fonts.light,
  },
  text: {
    textAlign: "right",
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: "rgba(34, 71, 3, 1)",
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: "row-reverse",
    padding: 10,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  clearButton: {
    position: "absolute",
    left: 15,
    top: 22,
  },
});
