import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./Screens/LoginScreen";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./components/MainScreen/HomeScreen";
import RestaurantScreen from "./components/RestaurantScreen/RestaurantScreen";
import WorkerScreen from "./components/WorkerScreen/WorkerScreen";
import FavRestScreen from "./components/FavoritesScreen/FavRestScreen";
import Profile from "./components/Profile/Profile";
import { AuthProvider } from "./AuthContext";
<<<<<<< Updated upstream
import JoviatScreen from "./Components/JoviatScreen/JoviatScreen";
=======
import JoviatScreen from "./components/JoviatScreen/JoviatScreen";
import RegisterScreen from './Screens/RegisterScreen';
>>>>>>> Stashed changes

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
