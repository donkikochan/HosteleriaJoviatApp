import React from "react";
import { View } from "react-native";
import CustomCarousel from "./CustomCarousel";

function CarouselDef() {
  const images = [
    {
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/1/1d/Restaurant_in_The_Mus%C3%A9e_d%27Orsay.jpg",
    },
    {
      imageUrl:
        "https://media.revistaad.es/photos/620cbc911db9f1841aebdf15/16:9/w_2560%2Cc_limit/portada.jpg",
    },
  ];

  return (
    <View style={{ marginTop: 112 }}>
      <CustomCarousel images={images} />
    </View>
  );
}

export default CarouselDef;
