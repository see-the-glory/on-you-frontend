import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import ClubHome from "../screens/Club/ClubHome";
import ClubFeed from "../screens/Club/ClubFeed";

const NativeStack = createNativeStackNavigator();
const TopTab = createMaterialTopTabNavigator();

const ClubTopTabs = ({
  route: {
    params: { item },
  },
}) => {
  return (
    <TopTab.Navigator
      initialRouteName="ClubHome"
      screenOptions={{
        swipeEnabled: false,
      }}
    >
      <TopTab.Screen
        options={{ title: "모임소개" }}
        name="ClubHome"
        component={ClubHome}
        initialParams={{ item }}
      />
      <TopTab.Screen
        options={{ title: "피드" }}
        name="ClubFeed"
        component={ClubFeed}
      />
    </TopTab.Navigator>
  );
};

const ClubStack = ({
  route: {
    params: { item },
  },
  navigation,
}) => {
  return (
    <NativeStack.Navigator>
      <NativeStack.Screen
        name="ClubTopTabs"
        component={ClubTopTabs}
        initialParams={{ item }}
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={20} color="black" />
            </TouchableOpacity>
          ),
          title: item.clubName,
        }}
      />
    </NativeStack.Navigator>
  );
};

export default ClubStack;
