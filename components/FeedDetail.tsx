import React, { PureComponent } from "react";
import { Ionicons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import CustomText from "./CustomText";
import CircleIcon from "./CircleIcon";
import { Feed } from "../api";
import { TouchableOpacity } from "react-native";
import moment from "moment";
import Carousel from "./Carousel";

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
const HeaderRightView = styled.View`
  height: 100%;
  justify-content: center;
`;
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
  isMine: boolean;
  openFeedOption: (userId: number, feedId: number) => void;
  goToFeedComments: (feedId: number) => void;
}

class FeedDetail extends PureComponent<FeedDetailProps> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <Container>
        <HeaderView padding={20} height={this.props.headerHeight}>
          <HeaderLeftView>
            <CircleIcon uri={this.props.feedData.thumbnail} size={36} kerning={10} />
            <HeaderText2>{this.props.feedData.userName}</HeaderText2>
          </HeaderLeftView>
          <HeaderRightView>
            <TouchableOpacity onPress={() => this.props.openFeedOption(this.props.feedData.userId, this.props.feedData.id)} style={{ paddingLeft: 10, paddingVertical: 5 }}>
              <Ionicons name="ellipsis-vertical" size={14} color="black" />
            </TouchableOpacity>
          </HeaderRightView>
        </HeaderView>
        <Carousel
          pages={this.props.feedData.imageUrls}
          pageWidth={this.props.feedSize}
          gap={0}
          offset={0}
          initialScrollIndex={0}
          keyExtractor={(item: string, index: number) => String(index)}
          showIndicator={true}
          renderItem={({ item, index }: { item: string; index: number }) => (
            <FastImage
              key={String(index)}
              source={item ? { uri: item } : require("../assets/basic.jpg")}
              style={{ width: this.props.feedSize, height: this.props.feedSize }}
              resizeMode={FastImage.resizeMode.contain}
            />
          )}
          ListEmptyComponent={<FastImage source={require("../assets/basic.jpg")} style={{ width: this.props.feedSize, height: this.props.feedSize }} />}
        />
        <ContentView padding={20}>
          <InformationView height={this.props.infoHeight}>
            <InformationLeftView>
              <InformationButton>
                <Ionicons name="heart-outline" size={20} color="black" />
                <CountingNumber>{this.props.feedData.likesCount}</CountingNumber>
              </InformationButton>
              <InformationButton onPress={() => this.props.goToFeedComments(this.props.feedData.id)}>
                <Ionicons name="md-chatbox-ellipses" size={20} color="black" />
                <CountingNumber>{this.props.feedData.commentCount}</CountingNumber>
              </InformationButton>
            </InformationLeftView>
            <InformationRightView>
              <CreatedTime>{moment(this.props.feedData.created, "YYYY-MM-DDThh:mm:ss").fromNow()}</CreatedTime>
            </InformationRightView>
          </InformationView>
          <ContentTextView height={this.props.contentHeight}>
            <ContentText>{this.props.feedData.content}</ContentText>
          </ContentTextView>
        </ContentView>
      </Container>
    );
  }
}

export default FeedDetail;
