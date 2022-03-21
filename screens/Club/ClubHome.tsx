import React from "react";
import { View, Text, Image, Dimensions } from "react-native";
import styled from "styled-components/native";

const Container = styled.ScrollView`
  flex: 1;
`;

const Thumbnail = styled.Image<{ height: number }>`
  width: 100%;
  height: ${(props) => props.height}px;
`;

const IntroductionView = styled.View`
  width: 100%;
  margin-top: -40px;
  justify-content: center;
  align-items: center;
`;

const InstroductionCard = styled.View`
  width: 85%;
  height: 200px;
  border-radius: 12px;
  background-color: white;
  elevation: 5;
  box-shadow: 1px 1px 3px gray;
`;

const TitleView = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 15px;
`;

const ClubTitle = styled.Text`
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 5px;
`;

const OrginizationTitle = styled.Text`
  font-size: 12px;
  font-weight: 300;
`;

const ContentView = styled.View`
  margin-left: 20px;
  margin-right: 20px;
`;

const ContentText = styled.Text`
  font-size: 16px;
`;

const ClubHome = ({
  navigation: { navigate },
  route: {
    params: { item },
  },
}) => {
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const imageHeight = Math.floor((SCREEN_WIDTH / 16) * 9);
  console.log(item);
  return (
    <Container>
      <Thumbnail
        source={{ url: item.thumbnailPath }}
        resizeMode="cover"
        height={imageHeight}
      />
      <IntroductionView>
        <InstroductionCard>
          <TitleView>
            <ClubTitle>{item.clubName}</ClubTitle>
            <OrginizationTitle>{item.organizationName}</OrginizationTitle>
          </TitleView>
          <ContentView>
            <ContentText>Hello World!</ContentText>
          </ContentView>
        </InstroductionCard>
      </IntroductionView>
    </Container>
  );
};

export default ClubHome;
