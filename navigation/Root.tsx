import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import ClubCreationStack from "./ClubCreationStack";
import ClubStack from "./ClubStack";
import HomeStack from "./HomeStack";
import ProfileStack from "./ProfileStack";
import ClubManagementStack from "./ClubManagementStack";
import FeedStack from "./FeedStack";
import { Host } from "react-native-portalize";

const Nav = createNativeStackNavigator();

const Root = () => (
  <Host
    children={
      <Nav.Navigator
        screenOptions={{
          presentation: "card",
          headerShown: false,
        }}
      >
        <Nav.Screen name="Tabs" component={Tabs} />
        <Nav.Screen name="ClubCreationStack" component={ClubCreationStack} />
        <Nav.Screen name="ClubManagementStack" component={ClubManagementStack} />
        <Nav.Screen name="ClubStack" component={ClubStack} />
        <Nav.Screen name="HomeStack" component={HomeStack} />
        <Nav.Screen name="ProfileStack" component={ProfileStack} />
        <Nav.Screen name="FeedStack" component={FeedStack} />
      </Nav.Navigator>
    }
  ></Host>
);
export default Root;
