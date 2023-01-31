import React from "react";
import { Ionicons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import CustomText from "./CustomText";
import CircleIcon from "./CircleIcon";
import { Feed } from "../api";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Container = styled.View``;
const HeaderView = styled.View<{ padding: number; height: number }>`
  height: ${(props: any) => props.height}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px ${(props: any) => (props.padding ? props.padding : "0")}px;
`;
const HeaderLeftView = styled.View`
  flex-direction: row;
  align-items: center;
`;
const HeaderRightView = styled.View``;
const HeaderText2 = styled(CustomText)`
  font-size: 18px;
  font-family: "NotoSansKR-Medium";
  color: #2b2b2b;
  line-height: 25px;
`;
const ContentView = styled.View<{ padding: number }>`
  padding: 0px ${(props: any) => (props.padding ? props.padding : "0")}px;
`;
const InformationView = styled.View<{ height: number }>`
  height: ${(props: any) => props.height}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const InformationLeftView = styled.View`
  flex-direction: row;
  align-items: center;
`;
const InformationButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-right: 12px;
`;

const CountingNumber = styled(CustomText)`
  margin-left: 3px;
`;
const InformationRightView = styled.View``;
const CreatedTime = styled(CustomText)`
  color: #9a9a9a;
`;
const ContentTextView = styled.View<{ height: number }>`
  height: ${(props: any) => props.height}px;
`;
const ContentText = styled(CustomText)`
  font-size: 14px;
  color: #2b2b2b;
`;

interface FeedDetailProps {
  feedData: Feed;
  feedSize: number;
  headerHeight: number;
  infoHeight: number;
  contentHeight: number;
}

const FeedDetail: React.FC<FeedDetailProps> = ({ feedData, feedSize, headerHeight, infoHeight, contentHeight }) => {
  const navigation = useNavigation();
  const goToFeedComments = () => {
    return navigation.navigate("FeedStack", { screen: "FeedComments", feedId: feedData.id });
  };
  return (
    <Container>
      <HeaderView padding={20} height={headerHeight}>
        <HeaderLeftView>
          <CircleIcon uri={feedData.thumbnail} size={36} kerning={10} />
          <HeaderText2>{feedData.userName}</HeaderText2>
        </HeaderLeftView>
        <HeaderRightView>
          <TouchableOpacity style={{ paddingLeft: 10, paddingVertical: 5 }}>
            <Ionicons name="ellipsis-vertical" size={14} color="black" />
          </TouchableOpacity>
        </HeaderRightView>
      </HeaderView>
      <FastImage source={feedData.imageUrls[0] ? { uri: feedData.imageUrls[0] } : require("../assets/basic.jpg")} style={{ width: feedSize, height: feedSize }} />
      <ContentView padding={20}>
        <InformationView height={infoHeight}>
          <InformationLeftView>
            <InformationButton>
              <Ionicons name="heart-outline" size={20} color="black" />
              <CountingNumber>{feedData.likesCount}</CountingNumber>
            </InformationButton>
            <InformationButton onPress={goToFeedComments}>
              <Ionicons name="ios-chatbox-ellipses-sharp" size={20} color="black" />
              <CountingNumber>{feedData.commentCount}</CountingNumber>
            </InformationButton>
          </InformationLeftView>
          <InformationRightView>
            <CreatedTime>{feedData.created}</CreatedTime>
          </InformationRightView>
        </InformationView>
        <ContentTextView height={contentHeight}>
          <ContentText>{feedData.content}</ContentText>
        </ContentTextView>
      </ContentView>
    </Container>
  );
};

export default FeedDetail;
