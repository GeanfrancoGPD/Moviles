import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import BarraNavegacion from "./components/molecules/BarraNavegacion";
import Login from "./components/pages/Login";

const Stack = createStackNavigator();

const linking = {
  prefixes: ["https://miapp.com", "miapp://"],
  config: {
    screens: {
      Login: "",
      Home: "home",
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={BarraNavegacion} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
