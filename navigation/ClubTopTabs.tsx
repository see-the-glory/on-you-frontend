import React, { useState, useRef, useCallback } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Animated, TouchableOpacity, YellowBox } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import ClubHome from "../screens/Club/ClubHome";
import ClubFeed from "../screens/Club/ClubFeed";
import styled from "styled-components/native";
import ClubHeader from "../components/ClubHeader";
import ClubTabBar from "../components/ClubTabBar";

const NativeStack = createNativeStackNavigator();
const TopTab = createMaterialTopTabNavigator();

const Container = styled.View`
  flex: 1;
`;
const HeaderContainer = styled.View``; // Animated

const CollapsedHeaderContainer = styled.View``; // Animated

const HeaderOverlay = styled.View``;

const HeaderView = styled.View`
  position: absolute;
  width: 100%;
  top: 30px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LeftHeaderView = styled.View`
  flex-direction: row;
  margin-left: 10px;
`;
const RightHeaderView = styled.View`
  flex-direction: row;
  margin-right: 10px;
`;

const ClubTopTabs = ({
  route: {
    params: { item },
  },
  navigation,
}) => {
  const [heartSelected, setHeartSelected] = useState<boolean>(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const expand = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 200],
    extrapolate: "clamp",
  });

  const renderClubHome = (props) => <ClubHome {...props} scrollY={scrollY} />;

  const AnimatedHeaderContainer =
    Animated.createAnimatedComponent(HeaderContainer);

  scrollY.addListener(() => {
    console.log("Y Value:", scrollY);
  });

  return (
    <Container>
      <AnimatedHeaderContainer>
        <ClubHeader
          height={230}
          imageURI={
            "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470"
          }
        />
      </AnimatedHeaderContainer>
      <CollapsedHeaderContainer>
        <HeaderOverlay></HeaderOverlay>
      </CollapsedHeaderContainer>
      <HeaderView>
        <LeftHeaderView>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="md-chevron-back-sharp" size={24} color="white" />
          </TouchableOpacity>
        </LeftHeaderView>
        <RightHeaderView>
          <TouchableOpacity onPress={() => setHeartSelected(!heartSelected)}>
            {heartSelected ? (
              <Ionicons name="md-heart" size={24} color="white" />
            ) : (
              <Ionicons name="md-heart-outline" size={24} color="white" />
            )}
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name="ellipsis-vertical"
              size={24}
              color="white"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        </RightHeaderView>
      </HeaderView>

      <TopTab.Navigator
        initialRouteName="ClubHome"
        screenOptions={{
          swipeEnabled: false,
        }}
        tabBar={(props) => <ClubTabBar {...props} scrollY={scrollY} />}
      >
        <TopTab.Screen
          options={{ tabBarLabel: "모임 정보" }}
          name="ClubHome"
          initialParams={{ item }}
        >
          {renderClubHome}
        </TopTab.Screen>
        <TopTab.Screen options={{ tabBarLabel: "게시물" }} name="ClubFeed">
          {ClubFeed}
        </TopTab.Screen>
      </TopTab.Navigator>
    </Container>
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
          headerShown: false,
        }}
      />
    </NativeStack.Navigator>
  );
};

export default ClubStack;
