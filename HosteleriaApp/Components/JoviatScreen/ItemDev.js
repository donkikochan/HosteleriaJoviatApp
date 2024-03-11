import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const ItemDev = ({ name, foto, descripcio, isLast }) => {

    return (
        <View
            style={[
                styles.itemContainer,
                isLast && styles.lastItem,
            ]}
        >
            <Image source={foto} style={styles.userIcon} />
            <View style={styles.group}>
                <Text style={styles.nomDev}>{name}</Text>
                <View style={styles.itemRow}>
                    <Text style={styles.itemText}>{descripcio}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 20,
        paddingVertical: 4,
        marginVertical: 6,
        alignSelf: "center",
        width: "85%",
        borderWidth: 0.5,
        borderColor: "black",
        paddingHorizontal: 10,
    },
    itemText: {
        fontSize: 15,
        color: "black",
        flexShrink: 1,
        textAlign: 'justify',
    },
    userIcon: {
        width: 40,
        height: 40,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "black",
        marginLeft: 10,
        marginTop: 5,
        marginRight: 2,
    },
    lastItem: {
        marginBottom: 50,
    },
    nomDev: {
        color: "rgba(0,0,0,1)",
        fontSize: 20,
        width: 224,
        fontWeight: "bold",
        marginLeft: 3,
    },
    itemRow: {
        marginTop: 11,
        alignSelf: "flex-start",
        marginLeft: 3,
    },
    group: {
        width: 248,
        alignSelf: "center",
        paddingTop: 10,
        alignItems: 'flex-start',
    },
});

export default ItemDev;