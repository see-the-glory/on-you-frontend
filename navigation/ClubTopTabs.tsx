import React, { useState, useRef, useCallback, useMemo } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  Animated,
  ImageBackground,
  TouchableOpacity,
  ViewProps,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import ClubHome from "../screens/Club/ClubHome";
import ClubFeed from "../screens/Club/ClubFeed";
import styled from "styled-components/native";
import ClubHeader from "../components/ClubHeader";
import ClubTabBar from "../components/ClubTabBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dimensions } from "react-native";

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
  z-index: 2;
  width: 100%;
  top: 40px;
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

const HEADER_HEIGHT = 60;

const ClubTopTabs = ({
  route: {
    params: { item },
  },
  navigation,
}) => {
  const [heartSelected, setHeartSelected] = useState<boolean>(false);

  // Header Height Definition
  const { top } = useSafeAreaInsets();
  const { height: SCREEN_HEIGHT } = Dimensions.get("window");
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const defaultHeaderHeight = top + HEADER_HEIGHT;
  const headerConfig = useMemo(
    () => ({
      heightCollapsed: defaultHeaderHeight,
      heightExpanded: headerHeight,
    }),
    [defaultHeaderHeight, headerHeight]
  );
  const { heightCollapsed, heightExpanded } = headerConfig;
  const headerDiff =
    heightCollapsed > heightExpanded ? 150 : heightExpanded - heightCollapsed;

  // Animated Variables
  const scrollY = useRef(new Animated.Value(0)).current;
  const translateY = scrollY.interpolate({
    inputRange: [0, headerDiff],
    outputRange: [0, -headerDiff],
    extrapolate: "clamp",
  });
  const opacity = scrollY.interpolate({
    inputRange: [0, headerDiff],
    outputRange: [1, 0],
  });

  // Header Component Height Size Dynamic Check
  const handleHeaderLayout = useCallback<NonNullable<ViewProps["onLayout"]>>(
    (event) => setHeaderHeight(event.nativeEvent.layout.height),
    []
  );

  const renderClubHome = useCallback(
    (props) => (
      <ClubHome {...props} scrollY={scrollY} headerDiff={headerDiff} />
    ),
    [headerDiff]
  );

  return (
    <>
      <Container>
        <Animated.View
          style={{
            position: "absolute",
            flex: 1,
            width: "100%",
            height: SCREEN_HEIGHT + headerDiff,
            paddingTop: heightExpanded,
            transform: [{ translateY }],
          }}
        >
          <TopTab.Navigator
            initialRouteName="ClubHome"
            screenOptions={{
              swipeEnabled: false,
            }}
            tabBar={(props) => <ClubTabBar {...props} />}
            sceneContainerStyle={{ position: "absolute", zIndex: 1 }}
          >
            <TopTab.Screen
              options={{ tabBarLabel: "모임 정보" }}
              name="ClubHome"
              component={renderClubHome}
              initialParams={{ item }}
            />
            <TopTab.Screen
              options={{ tabBarLabel: "게시물" }}
              name="ClubFeed"
              component={ClubFeed}
            />
          </TopTab.Navigator>
        </Animated.View>

        <Animated.View
          onLayout={handleHeaderLayout}
          style={{
            transform: [{ translateY }],
            opacity,
          }}
        >
          <ClubHeader
            imageURI={
              "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470"
            }
          />
        </Animated.View>

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
      </Container>
    </>
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
