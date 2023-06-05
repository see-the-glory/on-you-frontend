import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { Animated } from "react-native";
import { BlurView } from "expo-blur";
import { Club, ClubResponse, ClubRole } from "../api";
import CircleIcon from "./CircleIcon";
import Tag from "./Tag";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { lightTheme } from "../theme";
import { Iconify } from "react-native-iconify";
import FadeFastImage from "./FadeFastImage";
import { useQueryClient } from "react-query";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

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

const NotiView = styled.View``;
const NotiBadge = styled.View`
  position: absolute;
  top: 0px;
  right: -4px;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  z-index: 1;
  background-color: ${(props: any) => props.theme.accentColor};
  justify-content: center;
  align-items: center;
`;
const NotiBadgeText = styled.Text`
  color: white;
  font-size: 6px;
`;

const Header = styled.View`
  width: 100%;
  justify-content: center;
  z-index: 2;
  align-items: center;
  background-color: #e3e3e3;
`;

const FilterView = styled.View`
  flex: 1;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  padding-top: 70px;
  justify-content: center;
  align-items: center;
`;
const InformationView = styled.View`
  justify-content: center;
`;

const CategoryView = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 5px;
`;

const ClubNameView = styled.View`
  align-items: center;
  margin-bottom: 8px;
`;

const ClubNameText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontB};
  font-size: 28px;
  line-height: 33px;
  color: white;
`;

const ClubShortDescView = styled.View`
  align-items: center;
`;
const ClubShortDescText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontM};
  font-size: 14px;
  line-height: 18px;
  color: white;
`;

const Break = styled.View`
  margin: 10px 0px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(255, 255, 255, 0.5);
`;

const DetailInfoView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const DetailInfoItem = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  margin-right: 5px;
`;

const DetailItemTitle = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 11px;
  color: ${(props: any) => props.theme.secondaryColor};
  margin-right: 3px;
`;

const DetailItemText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 12px;
  color: white;
`;

const CollapsedView = styled.SafeAreaView<{ height: number }>`
  justify-content: center;
  align-items: center;
  height: ${(props) => props.height}px;
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

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedFadeOutBox = Animated.createAnimatedComponent(View);

// ClubHome Header
export interface ClubHomeHaederProps {
  clubId: number;
  clubRole?: ClubRole;
  notiCount: number;
  openClubOptionModal: () => void;
  headerHeight: number;
  heightExpanded: number;
  heightCollapsed: number;
  scrollY: Animated.Value;
  headerDiff: number;
}

const ClubHeader: React.FC<ClubHomeHaederProps> = ({ clubId, clubRole, notiCount, openClubOptionModal, headerHeight, heightExpanded, heightCollapsed, headerDiff, scrollY }) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const queryClient = useQueryClient();
  const clubData = queryClient.getQueryData<ClubResponse>(["getClub", clubId])?.data;
  const master = clubData?.members?.find((member) => member.role === "MASTER");
  const { top } = useSafeAreaInsets();
  const fadeIn = scrollY.interpolate({
    inputRange: [0, headerDiff],
    outputRange: [-1, 1],
  });

  const fadeOut = scrollY.interpolate({
    inputRange: [0, headerDiff / 2, headerDiff],
    outputRange: [1, 0, 0],
  });

  const goClubNotification = () => {
    const clubNotificationProps = {
      clubData,
      clubRole,
    };
    navigation.push("ClubNotification", clubNotificationProps);
  };

  return (
    <>
      <NavigationView height={headerHeight} style={{ marginTop: top }}>
        <LeftNavigationView>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Animated.View style={{ position: "absolute" }}>
              <Entypo name="chevron-thin-left" size={20} color="white" />
            </Animated.View>
            <Animated.View style={{ opacity: fadeIn }}>
              <Entypo name="chevron-thin-left" size={20} color="black" />
            </Animated.View>
          </TouchableOpacity>
        </LeftNavigationView>
        <RightNavigationView>
          {["MASTER", "MANAGER", "MEMBER"].includes(clubRole?.role) ? (
            <TouchableOpacity onPress={goClubNotification} style={{ paddingHorizontal: 8 }}>
              <Animated.View style={{ position: "absolute", left: 8 }}>
                <NotiView>
                  {notiCount > 0 ? <NotiBadge>{/* <NotiBadgeText>{notiCount}</NotiBadgeText> */}</NotiBadge> : <></>}
                  <Iconify icon="fluent:mail-48-regular" size={24} color="white" />
                </NotiView>
              </Animated.View>
              <Animated.View style={{ opacity: fadeIn }}>
                <NotiView>
                  {notiCount > 0 ? <NotiBadge>{/* <NotiBadgeText>{notiCount}</NotiBadgeText> */}</NotiBadge> : <></>}
                  <Iconify icon="fluent:mail-48-regular" size={24} color="black" />
                </NotiView>
              </Animated.View>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={openClubOptionModal} style={{ paddingLeft: 10, paddingRight: 1 }}>
            <Animated.View style={{ position: "absolute", left: 10 }}>
              <Ionicons name="ellipsis-vertical-sharp" size={22} color="white" />
            </Animated.View>
            <Animated.View style={{ opacity: fadeIn }}>
              <Ionicons name="ellipsis-vertical-sharp" size={22} color="black" />
            </Animated.View>
          </TouchableOpacity>
        </RightNavigationView>
      </NavigationView>
      <Header style={{ width: "100%", height: heightExpanded }}>
        <View style={{ width: "100%", height: heightExpanded, position: "absolute" }}>
          <FadeFastImage style={{ width: "100%", height: heightExpanded }} uri={clubData?.thumbnail ?? undefined} />
        </View>
        <Animated.View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            width: "100%",
            zIndex: 2,
            height: heightExpanded,
            opacity: fadeIn,
            justifyContent: "flex-start",
            backgroundColor: "white",
          }}
        >
          <CollapsedView height={headerHeight} style={{ marginTop: top }}>
            <CollapsedNameView>
              <CollapsedNameText>{clubData?.name}</CollapsedNameText>
            </CollapsedNameView>
          </CollapsedView>
        </Animated.View>

        <FilterView>
          <AnimatedFadeOutBox style={{ opacity: fadeOut, width: "75%" }}>
            <InformationView>
              <CategoryView>
                {clubData?.categories?.map((category, index) => (
                  <Tag key={`category_${index}`} name={category.name} backgroundColor={"rgba(255, 255, 255, 0.5)"} textColor={"black"} textStyle={{ fontSize: 12, lineHeight: 14 }} />
                ))}
              </CategoryView>
              <ClubNameView>
                <ClubNameText>{clubData?.name}</ClubNameText>
              </ClubNameView>
              <ClubShortDescView>
                <ClubShortDescText>{clubData?.clubShortDesc}</ClubShortDescText>
              </ClubShortDescView>
              <Break />
              <DetailInfoView>
                <DetailInfoItem>
                  <Iconify icon="ph:star-fill" size={16} color={lightTheme.secondaryColor} style={{ marginRight: 2 }} />

                  <DetailItemTitle>{`리더`}</DetailItemTitle>
                  {master ? (
                    <>
                      <CircleIcon size={18} uri={master.thumbnail} kerning={3} />
                      <DetailItemText>{master.name}</DetailItemText>
                    </>
                  ) : (
                    <DetailItemText>{`없음`}</DetailItemText>
                  )}
                </DetailInfoItem>
                <DetailInfoItem>
                  <Iconify icon="fe:users" size={16} color={lightTheme.secondaryColor} style={{ marginRight: 2 }} />
                  <DetailItemTitle>{`멤버`}</DetailItemTitle>
                  <DetailItemText>{clubData?.recruitNumber}</DetailItemText>
                  <DetailItemText style={{ color: "#C0C0C0" }}>{` / ${clubData?.maxNumber ? `${clubData?.maxNumber} 명` : `무제한`}`}</DetailItemText>
                </DetailInfoItem>
                <DetailInfoItem>
                  <Iconify icon="material-symbols:feed-rounded" size={16} color={lightTheme.secondaryColor} style={{ marginRight: 2 }} />
                  <DetailItemTitle>{`피드`}</DetailItemTitle>
                  <DetailItemText>{clubData?.feedNumber}</DetailItemText>
                </DetailInfoItem>
              </DetailInfoView>
            </InformationView>
          </AnimatedFadeOutBox>
        </FilterView>
      </Header>
    </>
  );
};

export default ClubHeader;
