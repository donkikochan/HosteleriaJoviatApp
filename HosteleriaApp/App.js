import { StyleSheet, View } from "react-native";
import Navbar from "./Components/Navbar/Navbar";
import FooterNavbar from "./Components/FooterNavbar/FooterNavbar";

export default function App() {
  return (
    <View style={styles.container}>
      <Navbar
        showGoBack={false}
        showLogIn={true}
        showSearch={true}
        text="Login"
      />
      <FooterNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
});