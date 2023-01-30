import React from "react";
import { Ionicons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import CustomText from "./CustomText";
import CircleIcon from "./CircleIcon";
import { Feed } from "../api";
import { TouchableOpacity } from "react-native";

const Container = styled.View``;
const HeaderView = styled.View<{ padding: number }>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px ${(props: any) => (props.padding ? props.padding : "0")}px;
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
const InformationView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0px;
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
const ContentTextView = styled.View``;
const ContentText = styled(CustomText)`
  font-size: 14px;
  color: #2b2b2b;
`;

interface FeedDetailProps {
  feedData: Feed;
  feedSize: number;
}

const FeedDetail: React.FC<FeedDetailProps> = ({ feedData, feedSize }) => {
  return (
    <Container>
      <HeaderView padding={20}>
        <HeaderLeftView>
          <CircleIcon size={36} kerning={5} />
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
        <InformationView>
          <InformationLeftView>
            <InformationButton>
              <Ionicons name="heart-outline" size={20} color="black" />
              <CountingNumber>{feedData.likesCount}</CountingNumber>
            </InformationButton>
            <InformationButton>
              <Ionicons name="ios-chatbox-ellipses-sharp" size={20} color="black" />
              <CountingNumber>{feedData.commentCount}</CountingNumber>
            </InformationButton>
          </InformationLeftView>
          <InformationRightView>
            <CreatedTime>{feedData.created}</CreatedTime>
          </InformationRightView>
        </InformationView>
        <ContentTextView>
          <ContentText>{feedData.content}</ContentText>
        </ContentTextView>
      </ContentView>
    </Container>
  );
};

export default FeedDetail;
