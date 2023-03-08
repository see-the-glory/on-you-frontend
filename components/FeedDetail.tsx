import React, { PureComponent } from "react";
import { Ionicons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import CustomText from "./CustomText";
import CircleIcon from "./CircleIcon";
import { Feed } from "../api";
import { NativeSyntheticEvent, ScrollView, TextLayoutEventData, TouchableOpacity, View } from "react-native";
import moment from "moment";
import Carousel from "./Carousel";
import Tag from "./Tag";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Collapsible from "react-native-collapsible";

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
const HeaderNameView = styled.View`
  justify-content: center;
  align-items: flex-start;
`;
const HeaderRightView = styled.View`
  height: 100%;
  justify-content: flex-end;
  padding-bottom: 10px;
`;
const HeaderText = styled(CustomText)`
  font-size: 16px;
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
const ContentTextView = styled.Text<{ height: number }>`
  ${(props: any) => (props.height ? `height: ${props.height}px` : "")};
`;
const ContentText = styled(CustomText)`
  font-size: 14px;
  color: #2b2b2b;
`;

const ContentSubText = styled(CustomText)`
  font-size: 14px;
  color: #9a9a9a;
`;

interface FeedDetailProps {
  feedData: Feed;
  feedIndex: number;
  feedSize: number;
  headerHeight: number;
  infoHeight: number;
  contentHeight: number;
  showClubName?: boolean;
  openFeedOption: (feedData: Feed) => void;
  goToFeedComments: (feedIndex: number, feedId: number) => void;
  goToClub?: (clubId: number) => void;
  likeFeed?: (feedIndex: number, feedId: number) => void;
}

interface FeedDetailState {
  isCollapsed: boolean;
  moreContent: boolean;
  textHeight: number;
  collapsedText: string;
  remainedText: string;
}

class FeedDetail extends PureComponent<FeedDetailProps, FeedDetailState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isCollapsed: true,
      moreContent: false,
      textHeight: 0,
      collapsedText: "",
      remainedText: "",
    };
  }
  render() {
    // prettier-ignore
    const onTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
      const moreContent = event.nativeEvent.lines.length > 2 ? true : false;
      const collapsedText = event.nativeEvent.lines.slice(0, 2).map((line) => line.text).join("").trim();
      const remainedText = moreContent ? event.nativeEvent.lines.slice(2).map((line) => line.text).join("").trim() : "";
      const textHeight = moreContent ? event.nativeEvent.lines.slice(2).length * this.props.contentHeight : 0;
      this.setState({ ...this.state, textHeight, moreContent, collapsedText, remainedText });
    };

    const contentTextTouch = () => {
      if (this.state.moreContent && this.state.isCollapsed) this.setState({ ...this.state, isCollapsed: !this.state.isCollapsed });
      else this.props.goToFeedComments(this.props.feedIndex, this.props.feedData?.id);
    };
    return (
      <Container>
        <HeaderView padding={10} height={this.props.headerHeight}>
          <HeaderLeftView>
            <CircleIcon uri={this.props.feedData?.thumbnail} size={46} kerning={6} />
            <HeaderNameView>
              <HeaderText>{this.props.feedData?.userName}</HeaderText>
              {this.props.showClubName ? (
                <TouchableWithoutFeedback onPress={() => (this.props.goToClub ? this.props.goToClub(this.props.feedData?.clubId) : {})}>
                  <Tag name={this.props.feedData?.clubName} textColor="white" backgroundColor="#C4C4C4" />
                </TouchableWithoutFeedback>
              ) : (
                <></>
              )}
            </HeaderNameView>
          </HeaderLeftView>
          <HeaderRightView>
            <TouchableOpacity onPress={() => this.props.openFeedOption(this.props.feedData)} style={{ paddingLeft: 10 }}>
              <Ionicons name="ellipsis-vertical" size={15} color="black" style={{ marginRight: -5 }} />
            </TouchableOpacity>
          </HeaderRightView>
        </HeaderView>
        <Carousel
          pages={this.props.feedData?.imageUrls}
          pageWidth={this.props.feedSize}
          gap={0}
          offset={0}
          initialScrollIndex={0}
          keyExtractor={(item: string, index: number) => String(index)}
          showIndicator={this.props.feedData?.imageUrls?.length > 1}
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
        <ContentView padding={10}>
          <InformationView height={this.props.infoHeight}>
            <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "flex-start" }}>
              <InformationLeftView>
                <InformationButton onPress={() => (this.props.likeFeed ? this.props.likeFeed(this.props.feedIndex, this.props.feedData?.id) : {})}>
                  {this.props.feedData?.likeYn ? (
                    <Ionicons name="heart" size={26} color="#FF551F" style={{ marginLeft: -2, marginRight: -2 }} />
                  ) : (
                    <Ionicons name="heart-outline" size={26} color="black" style={{ marginLeft: -2, marginRight: -2 }} />
                  )}
                  <CountingNumber>{this.props.feedData?.likesCount}</CountingNumber>
                </InformationButton>
                <InformationButton onPress={() => this.props.goToFeedComments(this.props.feedIndex, this.props.feedData?.id)}>
                  <Ionicons name="md-chatbox-ellipses" size={24} color="black" style={{}} />
                  <CountingNumber>{this.props.feedData?.commentCount}</CountingNumber>
                </InformationButton>
              </InformationLeftView>
              <InformationRightView>
                <CreatedTime>{moment(this.props.feedData?.created, "YYYY-MM-DDThh:mm:ss").fromNow()}</CreatedTime>
              </InformationRightView>
            </View>
          </InformationView>
          <ScrollView style={{ height: 0 }}>
            <ContentText onTextLayout={onTextLayout}>{this.props.feedData?.content}</ContentText>
          </ScrollView>
          <TouchableWithoutFeedback onPress={contentTextTouch}>
            <ContentTextView height={this.props.contentHeight}>
              <ContentText>{this.state.collapsedText}</ContentText>
              {this.state.moreContent && this.state.isCollapsed ? (
                <>
                  {" "}
                  <ContentText>{`...`}</ContentText>
                  <ContentSubText>{` 더 보기`}</ContentSubText>
                </>
              ) : (
                <></>
              )}
            </ContentTextView>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={contentTextTouch}>
            <Collapsible collapsed={this.state.isCollapsed} style={{ height: this.state.textHeight }}>
              <ContentTextView>
                <ContentText>{this.state.remainedText}</ContentText>
              </ContentTextView>
            </Collapsible>
          </TouchableWithoutFeedback>
        </ContentView>
      </Container>
    );
  }
}

export default FeedDetail;
