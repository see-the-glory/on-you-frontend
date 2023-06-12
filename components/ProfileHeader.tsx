import React from "react";
import { TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { Animated } from "react-native";
import CircleIcon from "./CircleIcon";
import { Entypo } from "@expo/vector-icons";
import { Profile } from "../api";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Iconify } from "react-native-iconify";
import FadeFastImage from "./FadeFastImage";

const NavigationView = styled.SafeAreaView<{ height: number }>`
  position: absolute;
  z-index: 3;
  width: 100%;
  height: ${(props: any) => props.height}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LeftNavigationView = styled.View`
  flex-direction: row;
  padding-left: 16px;
`;
const RightNavigationView = styled.View`
  flex-direction: row;
  padding-right: 16px;
`;

const Header = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const FilterView = styled.View`
  flex: 1;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
`;
const InfoView = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: 100px;
`;

const CollapsedNameView = styled.View`
  align-items: center;
`;

const CollapsedNameText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontB};
  font-size: 18px;
  line-height: 22px;
  color: #2b2b2b;
`;

const NameText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontB};
  font-size: 22px;
  color: white;
  margin: 10px 0px;
`;

const InfoDetailView = styled.View`
  flex-direction: row;
`;
const InfoDetailItem = styled.View`
  flex-direction: row;
  margin: 0px 5px;
`;
const InfoDetailText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 13px;
  color: white;
  margin: 0px 5px;
`;
const InfoDetailNumber = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 13px;
  color: ${(props: any) => props.theme.secondaryColor};
`;

const OptionView = styled.View`
  flex-direction: row;
`;
const OptionButton = styled.TouchableOpacity`
  background-color: rgba(255, 255, 255, 0.15);
  padding: 5px 20px;
  border: 1px solid white;
  border-radius: 30px;
  margin: 0px 5px;
`;
const OptionText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 14px;
  color: white;
`;

const CollapsedView = styled.SafeAreaView<{ height: number }>`
  justify-content: center;
  align-items: center;
  height: ${(props) => props.height}px;
`;

// ClubHome Header
export interface ProfileHeaderProps {
  isMe: boolean;
  disabledBack?: boolean;
  profile?: Profile;
  heightExpanded: number;
  heightCollapsed: number;
  scrollY: Animated.Value;
  headerDiff: number;
  headerHeight: number;
  tabBarHeight: number;
  goToPreferences: () => void;
  goToEditProfile: () => void;
  openOptionModal: () => void;
  openShareProfile: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  isMe,
  disabledBack,
  profile,
  headerHeight,
  heightExpanded,
  heightCollapsed,
  headerDiff,
  tabBarHeight,
  scrollY,
  goToPreferences,
  goToEditProfile,
  openOptionModal,
  openShareProfile,
}) => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const fadeIn = scrollY.interpolate({
    inputRange: [0, headerDiff],
    outputRange: [-3, 1],
  });

  const fadeOut = scrollY.interpolate({
    inputRange: [0, headerDiff / 2, headerDiff],
    outputRange: [1, 0, 0],
  });

  return (
    <>
      <NavigationView height={headerHeight} style={{ marginTop: top }}>
        <LeftNavigationView>
          {disabledBack ? null : (
            <TouchableOpacity onPress={navigation.goBack}>
              <Animated.View style={{ position: "absolute" }}>
                <Entypo name="chevron-thin-left" size={20} color="white" />
              </Animated.View>
              <Animated.View style={{ opacity: fadeIn }}>
                <Entypo name="chevron-thin-left" size={20} color="black" />
              </Animated.View>
            </TouchableOpacity>
          )}
        </LeftNavigationView>
        <RightNavigationView>
          {isMe ? (
            <TouchableOpacity onPress={openShareProfile} style={{ paddingLeft: 10, paddingRight: 1 }}>
              <Animated.View style={{ position: "absolute", left: 10, paddingRight: 1 }}>
                <Iconify icon="icon-park-outline:share" size={22} color="white" />
              </Animated.View>
              <Animated.View style={{ opacity: fadeIn }}>
                <Iconify icon="icon-park-outline:share" size={22} color="black" />
              </Animated.View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={openOptionModal} style={{ paddingLeft: 10, paddingRight: 1 }}>
              <Animated.View style={{ position: "absolute", left: 10, paddingRight: 1 }}>
                <Iconify icon="ant-design:ellipsis-outlined" size={26} color="white" style={{ transform: [{ rotate: "90deg" }], marginRight: -7 }} />
              </Animated.View>
              <Animated.View style={{ opacity: fadeIn }}>
                <Iconify icon="ant-design:ellipsis-outlined" size={26} color="black" style={{ transform: [{ rotate: "90deg" }], marginRight: -7 }} />
              </Animated.View>
            </TouchableOpacity>
          )}
        </RightNavigationView>
      </NavigationView>
      <Header style={{ height: heightExpanded + tabBarHeight }}>
        <View style={{ width: "100%", height: heightExpanded + tabBarHeight, position: "absolute" }}>
          <FadeFastImage style={{ width: "100%", height: heightExpanded + tabBarHeight }} uri={profile?.backgroundImage ?? undefined} />
        </View>
        <Animated.View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            width: "100%",
            zIndex: 2,
            height: heightExpanded + tabBarHeight,
            opacity: fadeIn,
            justifyContent: "flex-start",
            backgroundColor: "white",
          }}
        >
          <CollapsedView height={headerHeight} style={{ marginTop: top }}>
            <CollapsedNameView>
              <CollapsedNameText>{profile?.name ?? "이름"}</CollapsedNameText>
            </CollapsedNameView>
          </CollapsedView>
        </Animated.View>

        <FilterView>
          <Animated.View style={{ opacity: fadeOut, width: "75%" }}>
            <InfoView>
              <CircleIcon size={100} uri={profile?.thumbnail} />
              <NameText>{profile?.name}</NameText>
              {isMe ? (
                <OptionView>
                  <OptionButton onPress={goToEditProfile}>
                    <OptionText>{"프로필 수정"}</OptionText>
                  </OptionButton>
                  <OptionButton onPress={goToPreferences}>
                    <OptionText>{"내 정보 설정"}</OptionText>
                  </OptionButton>
                </OptionView>
              ) : (
                <InfoDetailView>
                  <InfoDetailItem>
                    <InfoDetailText>{"가입 모임"}</InfoDetailText>
                    <InfoDetailNumber>{profile?.clubs.length}</InfoDetailNumber>
                  </InfoDetailItem>
                  <InfoDetailItem>
                    <InfoDetailText>{"작성 피드"}</InfoDetailText>
                    <InfoDetailNumber>{profile?.feedNumber}</InfoDetailNumber>
                  </InfoDetailItem>
                </InfoDetailView>
              )}
            </InfoView>
          </Animated.View>
        </FilterView>
      </Header>
    </>
  );
};

export default ProfileHeader;
