import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./Screens/LoginScreen";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./Components/MainScreen/HomeScreen";
import RestaurantScreen from "./Components/RestaurantScreen/RestaurantScreen";
import WorkerScreen from "./Components/WorkerScreen/WorkerScreen";
import FavRestScreen from "./Components/FavoritesScreen/FavRestScreen";
import Profile from "./Components/Profile/Profile";
import { AuthProvider } from "./AuthContext";
import JoviatScreen from "./Components/JoviatScreen/JoviatScreen";

const Stack = createStackNavigator();

export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home" screenOptions={{ animationEnabled: false }}>
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
                    <Stack.Screen
                        name="Restaurant"
                        component={RestaurantScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Favorite"
                        component={FavRestScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="WorkerScreen"
                        component={WorkerScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Profile"
                        component={Profile}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Joviat"
                        component={JoviatScreen}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </AuthProvider>
    );
}
