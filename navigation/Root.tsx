import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import ClubCreationStack from "./ClubCreationStack";
import ClubStack from "./ClubTopTabs";
import HomeStack from "./HomeStack";
import SearchStack from "./SearchStack";

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
    <Nav.Screen name="ClubStack" component={ClubStack} />
    <Nav.Screen name="HomeStack" component={HomeStack}/>
    <Nav.Screen name="SearchStack" component={SearchStack}/>
  </Nav.Navigator>
);
export default Root;
