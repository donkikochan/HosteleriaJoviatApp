import React, { useState, useRef } from "react";
import { View, Image, Dimensions, StyleSheet } from "react-native";
import Carousel from "react-native-snap-carousel";

const { width: viewportWidth } = Dimensions.get("window");

function CarouselComponent(props) {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const renderItem = ({ item, index }) => {
    return (
      <View>
        <Image
          source={{ uri: item.imageUrl }}
          style={{ width: "100%", height: 200, position: "relative", top: 110 }}
        />
      </View>
    );
  };

  return (
    <Carousel
      ref={carouselRef}
      data={props.items}
      sliderWidth={viewportWidth}
      itemWidth={viewportWidth}
      renderItem={renderItem}
      onSnapToItem={(index) => setActiveIndex(index)}
    />
  );
}
const styles = StyleSheet.create({
  carousel: {
    position: "absolute",
    top: 100,
  },
});
export default CarouselComponent;
