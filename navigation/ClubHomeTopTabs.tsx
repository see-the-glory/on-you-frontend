import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Text, View, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

const NativeStack = createNativeStackNavigator();
const TopTab = createMaterialTopTabNavigator();

const ClubHome = () => (
  <View>
    <Text>ClubHome</Text>
  </View>
);

const Feed = () => (
  <View>
    <Text>Feed</Text>
  </View>
);

const ClubHomeTopTabs = ({
  route: {
    params: { item },
  },
}) => {
  return (
    <TopTab.Navigator
      initialRouteName="ClubHome"
      screenOptions={{ swipeEnabled: false }}
    >
      <TopTab.Screen
        options={{ title: "모임소개" }}
        name="ClubHome"
        component={ClubHome}
      />
      <TopTab.Screen options={{ title: "피드" }} name="Feed" component={Feed} />
    </TopTab.Navigator>
  );
};

const ClubHomeStack = ({
  route: {
    params: { item },
  },
  navigation,
}) => {
  return (
    <NativeStack.Navigator>
      <NativeStack.Screen
        name="ClubHomeTopTabs"
        component={ClubHomeTopTabs}
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

export default ClubHomeStack;
