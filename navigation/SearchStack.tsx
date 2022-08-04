import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import PeedSelectPage from "../screens/SearchPage/PeedSelectPage";
import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const NativeStack = createNativeStackNavigator();

const SearchStack = ({ navigation: { navigate } }) => {
  return (
    <NativeStack.Navigator
      screenOptions={{
        presentation: "card",
        contentStyle: { backgroundColor: "white" },
      }}
    >
      <NativeStack.Screen
        name="PeedSelectPage"
        component={PeedSelectPage}
        options={{
          title: "태그선택",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Home" })}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </NativeStack.Navigator>
  );
};

export default SearchStack;
