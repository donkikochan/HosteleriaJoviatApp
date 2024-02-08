import React from "react";
import { View } from "react-native";
import CustomCarousel from "./CustomCarousel";

function CarouselDef({ fotos }) {
  const images =
    fotos && fotos.length > 0 ? fotos.map((url) => ({ imageUrl: url })) : [];
  return (
    <View style={{ marginTop: 112 }}>
      <CustomCarousel images={images} />
    </View>
  );
}

export default CarouselDef;
