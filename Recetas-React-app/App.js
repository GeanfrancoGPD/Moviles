import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import BarraNavegacion from "./components/molecules/BarraNavegacion";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import AddRecipePage from "./components/pages/AddRecipePage";
import RecipeDetailPage from "./components/pages/RecipeDetailPage";
import { AuthProvider } from "./components/context/AuthContext";

const Stack = createStackNavigator();

const linking = {
  prefixes: ["https://miapp.com", "miapp://"],
  config: {
    screens: {
      Login: "",
      Home: "home",
      AddRecipe: "home/add-recipe",
      RecipeDetail: "home/recipe/:recipeId",
    },
  },
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Home" component={BarraNavegacion} />
          <Stack.Screen name="AddRecipe" component={AddRecipePage} />
          <Stack.Screen name="RecipeDetail" component={RecipeDetailPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
