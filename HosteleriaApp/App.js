import {NavigationContainer} from "@react-navigation/native";
import LoginScreen from "./Screens/LoginScreen";
import {createStackNavigator} from "@react-navigation/stack";
import HomeScreen from "./Components/MainScreen/HomeScreen";
import RestaurantScreen from "./Components/RestaurantScreen/RestaurantScreen";
import WorkerScreen from "./Components/WorkerScreen/WorkerScreen";
import FavRestScreen from "./Components/FavoritesScreen/FavRestScreen";

const Stack = createStackNavigator();
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{headerShown: false}}
                />

                <Stack.Screen
                    name="Restaurant"
                    component={RestaurantScreen}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="Favorite"
                    component={FavRestScreen}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                name="WorkerScreen"
                  component={WorkerScreen} 
                  options={{ headerShown: false }}
                  />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
