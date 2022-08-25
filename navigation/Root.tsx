import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import ClubCreationStack from "./ClubCreationStack";
import ClubStack from "./ClubStack";
import HomeStack from "./HomeStack";
import SearchStack from "./SearchStack";
import ProfileStack from "./ProfileStack";
import LoginStack from "./LoginStack";
import ClubManagementStack from "./ClubManagementStack";

const Nav = createNativeStackNavigator();

const Root = () => (
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
    <Nav.Screen name="SearchStack" component={SearchStack} />
    <Nav.Screen name="ProfileStack" component={ProfileStack} />
    <Nav.Screen name="LoginStack" component={LoginStack} />
  </Nav.Navigator>
);
export default Root;
