import { StyleSheet, View } from "react-native";
import Navbar from "./Components/Navbar/Navbar";
import FooterNavbar from "./Components/FooterNavbar/FooterNavbar";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./Screens/LoginScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Navbar
        showGoBack={false}
        showLogIn={true}
        showSearch={true}
        text="Login"
        screen="Login"
      />
      <FooterNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
