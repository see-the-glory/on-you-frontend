import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useMemo, useRef } from "react";
import { View, useWindowDimensions, StatusBar, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components/native";
import ProfileHeader from "../../components/ProfileHeader";
import TabBar from "../../components/TabBar";
import UserFeed from "./UserFeed";
import UserInstroduction from "./UserInstroduction";

const Container = styled.View`
  flex: 1;
`;

const HEADER_EXPANDED_HEIGHT = 270;
const HEADER_HEIGHT = 56;
const TAB_BAR_HEIGHT = 46;

const Profile: React.FC<NativeStackScreenProps<any, "Profile">> = ({ route: { params }, navigation: { navigate, goBack, setOptions } }) => {
  const TopTab = createMaterialTopTabNavigator();

  // Header Height Definition
  const { top } = useSafeAreaInsets();
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const headerConfig = useMemo(
    () => ({
      heightCollapsed: top + HEADER_HEIGHT,
      heightExpanded: HEADER_EXPANDED_HEIGHT,
    }),
    [top, HEADER_HEIGHT, HEADER_EXPANDED_HEIGHT]
  );
  const { heightCollapsed, heightExpanded } = headerConfig;
  const headerDiff = heightExpanded - heightCollapsed;

  const scrollY = useRef(new Animated.Value(0)).current;
  const translateY = scrollY.interpolate({
    inputRange: [0, headerDiff],
    outputRange: [0, -headerDiff],
    extrapolate: "clamp",
  });

  const screenScrollRefs = useRef<any>({});

  const renderUserInstroduction = useCallback(
    (props: any) => {
      return (
        <Animated.ScrollView
          ref={(ref: any) => {
            screenScrollRefs.current["UserInstroduction"] = ref;
          }}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
          style={{
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, headerDiff],
                  outputRange: [-headerDiff, 0],
                  extrapolate: "clamp",
                }),
              },
            ],
          }}
          contentContainerStyle={{
            paddingTop: headerDiff,
            paddingBottom: headerDiff,
            minHeight: SCREEN_HEIGHT + headerDiff,
          }}
        >
          <UserInstroduction />
        </Animated.ScrollView>
      );
    },
    [headerDiff]
  );

  const goToPreferences = () => {
    navigate("Preferences");
  };

  const goToEditProfile = () => {};

  return (
    <Container>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <ProfileHeader
        headerHeight={HEADER_HEIGHT}
        tabBarHeight={TAB_BAR_HEIGHT}
        heightExpanded={heightExpanded}
        heightCollapsed={heightCollapsed}
        headerDiff={headerDiff}
        scrollY={scrollY}
        goToPreferences={goToPreferences}
        goToEditProfile={goToEditProfile}
      />

      <Animated.View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          zIndex: 2,
          flex: 1,
          width: "100%",
          height: SCREEN_HEIGHT + headerDiff,
          paddingTop: heightExpanded,
          transform: [{ translateY }],
        }}
      >
        <TopTab.Navigator
          initialRouteName="UserInstroduction"
          screenOptions={{ swipeEnabled: false }}
          tabBar={(props) => <TabBar {...props} height={TAB_BAR_HEIGHT} rounding={true} />}
          sceneContainerStyle={{ position: "absolute", zIndex: 1 }}
        >
          <TopTab.Screen options={{ tabBarLabel: "소개" }} name="UserInstroduction" component={renderUserInstroduction} />
          <TopTab.Screen options={{ tabBarLabel: "작성한 피드" }} name="UserFeed" component={UserFeed} />
        </TopTab.Navigator>
      </Animated.View>
    </Container>
  );
};

export default Profile;