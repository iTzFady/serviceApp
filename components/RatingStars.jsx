import { MaterialCommunityIcons } from "@expo/vector-icons";
import { memo } from "react";
import { View } from "react-native";

function RatingStars({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const totalStars = 5;

  return (
    <View style={{ flexDirection: "row" }}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <MaterialCommunityIcons
          key={`full-${i}`}
          name="star"
          size={18}
          color="rgba(237, 237, 14, 0.81)"
        />
      ))}

      {hasHalfStar && (
        <MaterialCommunityIcons
          name="star-half-full"
          size={18}
          color="rgba(237, 237, 14, 0.81)"
        />
      )}

      {Array.from({
        length: totalStars - fullStars - (hasHalfStar ? 1 : 0),
      }).map((_, i) => (
        <MaterialCommunityIcons
          key={`empty-${i}`}
          name="star-outline"
          size={18}
          color="rgba(237, 237, 14, 0.81)"
        />
      ))}
    </View>
  );
}
export default memo(RatingStars);
