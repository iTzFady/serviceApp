import { Regions } from "@/data/regions";
import { Speciality } from "@/data/speciality";
import { fonts } from "@/theme/fonts";
import { shadow } from "@/theme/styles";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import SpecialityChip from "./specialityChip";
import WebSelect from "./WebSelect";
export default function FilterSection({
  setSelectedChip,
  setCurrentRegion,
  selectedChip,
}) {
  return (
    <>
      <View style={styles.workerCategory}>
        <View style={styles.category}>
          <Text style={styles.categoryRightText}>اختر التخصص</Text>
          <TouchableOpacity onPress={() => setSelectedChip(null)}>
            <Text style={styles.categoryLeftText}>كل التخصصات</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
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
            search
            searchPlaceholder="ابحث عن منطقتك"
            searchPlaceholderTextColor="#808080"
            inputSearchStyle={{
              textAlign: "right",
              fontFamily: fonts.light,
            }}
            labelField="label"
            valueField="value"
            placeholder="اختر منطقتك"
            onChange={(item) => setCurrentRegion(item.value)}
            activeColor="#e0f7fa"
          />
        </View>
      )}
    </>
  );
}
const styles = StyleSheet.create({
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
    marginBlock: 10,
    height: 25,
    ...shadow,
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
});
