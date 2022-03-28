import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import ClubCreationStack from "./ClubCreationStack";
import ClubHomeStack from "./ClubHomeTopTabs";
import HomeStack from "./HomeStack";

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
        <Nav.Screen name="ClubHomeStack" component={ClubHomeStack} />
        <Nav.Screen name="HomeStack" component={HomeStack}/>
    </Nav.Navigator>
);
export default Root;
