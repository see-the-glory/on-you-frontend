import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IntroduceGroup from "../screens/SearchPage/IntroduceGroup";
import Peed from "../screens/SearchPage/Peed";
import PeedSelectPage from "./SearchPage/PeedSelectPage";
import styled from "styled-components/native";

const Wrapper = styled.View`
  flex: 1;
  top: 4%;
`;
const SearchArea = styled.View`
  height: 40px;
  margin: 15px 5px 5px 10px;
  flex-direction: row;
  background-color: transparent;
  border-radius: 10px;
`;

const ClubHome = () => <IntroduceGroup />;

const Feed = () => <Peed />;

const PeedSelect = () => <PeedSelectPage />;

const NativeStack = createNativeStackNavigator();
const TopTab = createMaterialTopTabNavigator();

const ClubHomeTopTabs = () => {
  return (
    <Wrapper>
      <SearchArea></SearchArea>
      <TopTab.Navigator initialRouteName="ClubHome" screenOptions={{ swipeEnabled: true }}>
        <TopTab.Screen options={{ title: "모임" }} name="ClubHome" component={ClubHome} />
        <TopTab.Screen options={{ title: "피드" }} name="Feed" component={Feed} />
        <TopTab.Screen options={{ title: "태그" }} name="Tag" component={PeedSelect} />
      </TopTab.Navigator>
    </Wrapper>
  );
};

const Search = () => {
  return (
    <NativeStack.Navigator>
      <NativeStack.Screen
        name="."
        component={ClubHomeTopTabs}
        options={{
          headerShown: false,
        }}
      />
    </NativeStack.Navigator>
  );
};
export default Search;
