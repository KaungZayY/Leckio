import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Pops {
  isFavorite: boolean;
  onPress: () => void;
}

export default function FavoriteButton({ isFavorite, onPress }: Props) {
  return (
    <>
      <TouchableOpacity onPress={onPress} style={{ width: 30, alignItems: "center", flexShrink: 0 }}>
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={22}
          color={isFavorite ? "#FF6B35" : "#666"}
        />
      </TouchableOpacity>
    </>
  );
}
