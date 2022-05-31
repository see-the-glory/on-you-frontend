import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { Animated } from "react-native";
import { BlurView } from "expo-blur";

const Header = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const HeaderImage = styled.ImageBackground<{ height: number }>`
  width: 100%;
  height: ${(props) => props.height}px;
`;

const FilterView = styled.View`
  flex: 1;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
  align-items: center;
`;
const InformationView = styled.View`
  justify-content: center;
  margin-bottom: 25px;
`;

const CategoryView = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 5px;
`;

const CategoryBox = styled.View`
  background-color: rgba(255, 255, 255, 0.5);
  padding: 3px;
  border: 1px;
  border-radius: 5px;
  margin-left: 3px;
  margin-right: 3px;
`;

const ClubNameView = styled.View`
  align-items: center;
  margin-bottom: 5px;
`;

const ClubNameText = styled.Text`
  color: white;
  font-size: 28px;
  font-weight: 800;
`;

const ClubShortDescView = styled.View`
  align-items: center;
`;
const ClubShortDescText = styled.Text`
  color: white;
`;

const Break = styled.View`
  margin-bottom: 8px;
  margin-top: 8px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(255, 255, 255, 0.5);
`;

const DetailInfoView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const DetailInfoContent = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  margin-right: 5px;
`;

const ApplyButton = styled.TouchableOpacity`
  background-color: #295af5;
  padding: 5px;
  border-radius: 5px;
  align-items: center;
  margin-bottom: 25px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: 800;
`;

const CollapsedView = styled.View`
  top: 40px;
`;

const TText = styled.Text`
  color: white;
`;

interface ClubHaederProps {
  imageURI: string;
  heightExpanded: number;
  heightCollapsed: number;
  headerDiff: number;
  scrollY: Animated.Value;
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedFadeOutBox = Animated.createAnimatedComponent(View);

const ClubHeader: React.FC<ClubHaederProps> = ({
  imageURI,
  heightExpanded,
  heightCollapsed,
  headerDiff,
  scrollY,
}) => {
  const translateY = scrollY.interpolate({
    inputRange: [0, headerDiff],
    outputRange: [0, -headerDiff],
    extrapolate: "clamp",
  });
  const fadeIn = scrollY.interpolate({
    inputRange: [0, headerDiff],
    outputRange: [-3, 1],
  });

  const fadeOut = scrollY.interpolate({
    inputRange: [0, headerDiff / 2, headerDiff],
    outputRange: [1, 0, 0],
  });

  return (
    <Header>
      <HeaderImage source={{ uri: imageURI }} height={heightExpanded}>
        <AnimatedBlurView
          intensity={20}
          tint="dark"
          style={{
            position: "absolute",
            width: "100%",
            zIndex: 2,
            height: heightExpanded,
            opacity: fadeIn,
            justifyContent: "flex-start",
          }}
        >
          <CollapsedView>
            <ClubNameView>
              <ClubNameText>온유 프로젝트</ClubNameText>
            </ClubNameView>
            <ClubShortDescView>
              <ClubShortDescText>
                모임 어플리케이션을 개발하는 프로젝트의 모임입니다.
              </ClubShortDescText>
            </ClubShortDescView>
          </CollapsedView>
        </AnimatedBlurView>

        <FilterView>
          <AnimatedFadeOutBox style={{ opacity: fadeOut }}>
            <InformationView>
              <CategoryView>
                <CategoryBox>
                  <Text>창작</Text>
                </CategoryBox>
                <CategoryBox>
                  <Text>자기개발</Text>
                </CategoryBox>
              </CategoryView>
              <ClubNameView>
                <ClubNameText>온유 프로젝트</ClubNameText>
              </ClubNameView>
              <ClubShortDescView>
                <ClubShortDescText>
                  모임 어플리케이션을 개발하는 프로젝트의 모임입니다.
                </ClubShortDescText>
              </ClubShortDescView>
              <Break></Break>
              <DetailInfoView>
                <DetailInfoContent>
                  <Ionicons
                    name="calendar"
                    size={14}
                    color="yellow"
                    style={{ marginRight: 5 }}
                  />
                  <TText>May 7 | 14:00 PM</TText>
                </DetailInfoContent>
                <DetailInfoContent>
                  <Ionicons
                    name="md-person-circle-outline"
                    size={14}
                    color="yellow"
                    style={{ marginRight: 5 }}
                  />
                  <TText>멤버 모집 기간 아님</TText>
                </DetailInfoContent>
              </DetailInfoView>
            </InformationView>
          </AnimatedFadeOutBox>
        </FilterView>
      </HeaderImage>
    </Header>
  );
};

export default ClubHeader;
