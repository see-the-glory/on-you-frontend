import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import ClubRegistrationStack from "./ClubRegistrationStack";

const Nav = createNativeStackNavigator();

const Root = () => (
  <Nav.Navigator
    screenOptions={{
      presentation: "card",
      headerShown: false,
    }}
  >
    <Nav.Screen name="Tabs" component={Tabs} />
    <Nav.Screen
      name="ClubRegistrationStack"
      component={ClubRegistrationStack}
    />
  </Nav.Navigator>
);
export default Root;
