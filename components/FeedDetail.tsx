import React, { PureComponent } from "react";
import { Ionicons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import CustomText from "./CustomText";
import CircleIcon from "./CircleIcon";
import { Feed, LikeUser } from "../api";
import { Alert, NativeSyntheticEvent, Platform, ScrollView, TextLayoutEventData, TouchableOpacity, View } from "react-native";
import moment from "moment";
import Carousel from "./Carousel";
import Tag from "./Tag";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Collapsible from "react-native-collapsible";
import Pinchable from "react-native-pinchable";
import RNFetchBlob from "rn-fetch-blob";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

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

const InformationIconButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-right: 3px;
`;

const InformationNumberButton = styled.TouchableOpacity`
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
  line-height: 20px;
  color: #2b2b2b;
`;

const ContentSubText = styled(CustomText)`
  font-size: 14px;
  line-height: 20px;
  color: #9a9a9a;
`;

interface FeedDetailProps {
  feedData?: Feed;
  feedIndex?: number;
  feedSize: number;
  headerHeight: number;
  infoHeight: number;
  contentHeight: number;
  showClubName?: boolean;
  isMyClubPost?: boolean;
  openFeedOption: (feedData?: Feed) => void;
  goToFeedComments: (feedIndex?: number, feedId?: number) => void; // Feed 단독 화면에서는 index, id가 undefined
  goToFeedLikes: (likeUsers: LikeUser[]) => void;
  goToClub?: (clubId?: number) => void;
  likeFeed?: (feedIndex?: number, feedId?: number) => void; // Feed 단독 화면에서는 index, id가 undefined
}

interface FeedDetailState {
  isCollapsed: boolean;
  moreContent: boolean;
  textHeight: number;
  collapsedText: string;
  collapsedTextList: string[];
  remainedText: string;
}

class FeedDetail extends PureComponent<FeedDetailProps, FeedDetailState> {
  lastTapTime?: number;
  constructor(props: any) {
    super(props);
    this.state = {
      isCollapsed: true,
      moreContent: false,
      textHeight: 0,
      collapsedText: "",
      collapsedTextList: [],
      remainedText: "",
    };
    this.lastTapTime = undefined;
  }

  doubleTap() {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (this.lastTapTime && now - this.lastTapTime < DOUBLE_PRESS_DELAY) {
      if (this.props.likeFeed) {
        this.props.likeFeed(this.props.feedIndex, this.props.feedData?.id);
      }
    } else {
      this.lastTapTime = now;
    }
  }

  downloadImage(url?: string) {
    if (!url) return;
    if (!this.props.isMyClubPost) return;
    let fileName = url.split("/").pop();
    let path = Platform.OS === "android" ? `${RNFetchBlob.fs.dirs.DownloadDir}` : `${RNFetchBlob.fs.dirs.CacheDir}`;
    path += `/OnYou/${fileName}`;
    Alert.alert("사진 저장", "이 사진을 저장하시겠습니까?", [
      { text: "아니요" },
      {
        text: "예",
        onPress: () => {
          RNFetchBlob.config({
            addAndroidDownloads: {
              useDownloadManager: true,
              notification: true,
              path,
            },
            path,
          })
            .fetch("GET", url)
            .then((res) => {
              if (Platform.OS === "ios") {
                const filePath = res.path();
                CameraRoll.save(filePath, {
                  type: "photo",
                  album: "OnYou",
                }).then(() => {
                  RNFetchBlob.fs.unlink(filePath);
                });
              }
            });
        },
      },
    ]);
  }

  render() {
    // prettier-ignore
    const onTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
      const moreContent = event.nativeEvent.lines.length > 2 ? true : false;
      const collapsedTextList = event.nativeEvent.lines.slice(0, 2).map(line => line.text);
      const collapsedText = collapsedTextList.join("").trim();
      const remainedText = moreContent ? event.nativeEvent.lines.slice(2).map((line) => line.text).join("").trim() : "";
      const textHeight = moreContent ? (event.nativeEvent.lines.slice(2).length * (this.props.contentHeight / 2)) : 0;
      this.setState({ ...this.state, textHeight, moreContent, collapsedText, collapsedTextList, remainedText });
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
                  <Tag name={this.props.feedData?.clubName ?? ""} textColor="white" backgroundColor="#C4C4C4" />
                </TouchableWithoutFeedback>
              ) : (
                <></>
              )}
            </HeaderNameView>
          </HeaderLeftView>
          <HeaderRightView>
            <TouchableOpacity onPress={() => this.props.openFeedOption(this.props.feedData)} style={{ paddingLeft: 15, paddingTop: 15 }}>
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
          showIndicator={(this.props.feedData?.imageUrls?.length ?? 0) > 1 ? true : false}
          renderItem={({ item, index }: { item: string; index: number }) => (
            <Pinchable>
              <TouchableOpacity activeOpacity={1} onPress={() => this.doubleTap()} onLongPress={() => this.downloadImage(item)}>
                <FastImage
                  key={String(index)}
                  source={item ? { uri: item } : require("../assets/basic.jpg")}
                  style={{ width: this.props.feedSize, height: this.props.feedSize }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </TouchableOpacity>
            </Pinchable>
          )}
          ListEmptyComponent={<FastImage source={require("../assets/basic.jpg")} style={{ width: this.props.feedSize, height: this.props.feedSize }} />}
        />
        <ContentView padding={10}>
          <InformationView height={this.props.infoHeight}>
            <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "flex-start" }}>
              <InformationLeftView>
                <InformationIconButton onPress={() => (this.props.likeFeed ? this.props.likeFeed(this.props.feedIndex, this.props.feedData?.id) : {})}>
                  {this.props.feedData?.likeYn ? (
                    <Ionicons name="heart" size={26} color="#FF551F" style={{ marginLeft: -2, marginRight: -2 }} />
                  ) : (
                    <Ionicons name="heart-outline" size={26} color="black" style={{ marginLeft: -2, marginRight: -2 }} />
                  )}
                </InformationIconButton>
                <InformationNumberButton activeOpacity={1} onPress={() => this.props.goToFeedLikes(this.props.feedData?.likeUserList ?? [])}>
                  <CountingNumber>{this.props.feedData?.likesCount}</CountingNumber>
                </InformationNumberButton>
                <InformationIconButton activeOpacity={1} onPress={() => this.props.goToFeedComments(this.props.feedIndex, this.props.feedData?.id)}>
                  <Ionicons name="md-chatbox-ellipses" size={24} color="black" />
                </InformationIconButton>
                <InformationNumberButton activeOpacity={1} onPress={() => this.props.goToFeedComments(this.props.feedIndex, this.props.feedData?.id)}>
                  <CountingNumber>{this.props.feedData?.commentCount}</CountingNumber>
                </InformationNumberButton>
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
              {this.state.moreContent && this.state.isCollapsed ? (
                <>
                  <ContentText>{`${
                    this.state.collapsedTextList.length > 1 && this.state.collapsedTextList[1].length > 15 ? this.state.collapsedText.slice(0, -8) : this.state.collapsedText
                  }...`}</ContentText>
                  <ContentSubText>{` 더 보기`}</ContentSubText>
                </>
              ) : (
                <ContentText>{this.state.collapsedText}</ContentText>
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
