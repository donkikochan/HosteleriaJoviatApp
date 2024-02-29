import React from "react";
import { View } from "react-native";
import CustomCarousel from "./CustomCarousel";

function CarouselDef({ fotos }) {
    const images =
        fotos && fotos.length > 0 ? fotos.map((url) => ({ imageUrl: url })) : [];
    return (
        <View style={{ position: 'absolute' }}>
            <CustomCarousel images={images} />
        </View>
    );
}

export default CarouselDef;
