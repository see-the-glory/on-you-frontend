import React, { useCallback, useEffect, useRef, useState } from "react";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import CircleIcon from "@components/atoms/CircleIcon";
import { Feed, LikeUser } from "api";
import { Alert, Animated, NativeSyntheticEvent, Platform, ScrollView, TextLayoutEventData, TouchableOpacity, View } from "react-native";
import moment from "moment";
import Carousel from "@components/atoms/Carousel";
import Tag from "@components/atoms/Tag";
import Collapsible from "react-native-collapsible";
import Pinchable from "react-native-pinchable";
import RNFetchBlob from "rn-fetch-blob";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Lottie from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { RootState } from "redux/store/reducers";
import { lightTheme } from "app/theme";
import { Iconify } from "react-native-iconify";
import LinkedText from "@components/atoms/LinkedText";
import FadeFastImage from "@components/atoms/FadeFastImage";

const Container = styled.View``;
const Header = styled.View<{ height: number }>`
  height: ${(props) => props.height}px;
  flex-direction: row;
  align-items: center;
  padding: 6px 10px;
`;

const HeaderInformation = styled.View`
  flex: 1;
  justify-content: center;
`;
const HeaderInformationTop = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const HeaderInformationBottom = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const HeaderText = styled.Text`
  font-size: 14px;
  line-height: 16px;
  font-family: ${(props) => props.theme.koreanFontB};
  color: #2b2b2b;
  margin-right: 5px;
`;

const Content = styled.View<{ padding: number }>`
  padding: 0px ${(props) => (props.padding ? props.padding : "0")}px;
`;
const Information = styled.View<{ height: number }>`
  height: ${(props) => props.height}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const InformationLeft = styled.View`
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

const CountingNumber = styled.Text`
  font-family: ${(props) => props.theme.koreanFontSB};
  font-size: 15px;
  margin-left: 3px;
`;
const CreatedTime = styled.Text`
  color: #9a9a9a;
  font-family: ${(props) => props.theme.koreanFontR};
  font-size: 12px;
`;
const ContentTextView = styled.Text<{ height?: number }>`
  ${(props) => (props.height ? `height: ${props.height}px` : "")};
`;
const ContentText = styled(LinkedText)`
  font-family: ${(props) => props.theme.koreanFontR};
  font-size: 14px;
  line-height: 20px;
  color: #2b2b2b;
`;

const ContentSubText = styled.Text`
  font-family: ${(props) => props.theme.koreanFontR};
  font-size: 13px;
  line-height: 19px;
  color: #5b5b5b;
`;

const HeartView = styled.View`
  position: absolute;
  left: 50%;
  margin-left: -50px;
  top: 150px;
  justify-content: center;
  align-items: center;
  z-index: 1;
  width: 100px;
`;

interface FeedDetailProps {
  feedData: Feed;
  feedIndex?: number;
  feedSize: number;
  headerHeight: number;
  infoHeight: number;
  contentHeight: number;
  showClubName?: boolean;
  isMyClubPost?: boolean;
  goToFeedOptionModal: (feedData?: Feed) => void;
  likeFeed?: (feedIndex?: number, feedId?: number) => void; // Feed 단독 화면에서는 index, id가 undefined
}

interface FeedDetailState {
  moreContent: boolean;
  textHeight: number;
  collapsedText: string;
  collapsedTextList: string[];
  remainedText: string;
}

const FeedDetail: React.FC<FeedDetailProps> = ({ feedData, feedIndex, feedSize, headerHeight, infoHeight, contentHeight, showClubName, isMyClubPost, goToFeedOptionModal, likeFeed }) => {
  const me = useSelector((state: RootState) => state.auth.user);
  const { likeYn, likesCount, commentCount } = useSelector((state: RootState) => state.feed[feedData?.id]);
  let lastTapTime: number | undefined = undefined;
  const heartRef = useRef<Lottie>(null);
  const bgHeartRef = useRef<Lottie>(null);
  const isFirstRun = useRef(true);
  const opacity = useRef(new Animated.Value(0)).current;
  const [isCollapsed, setIscollapsed] = useState<boolean>(true);
  const [contentState, setcontentState] = useState<FeedDetailState>({
    moreContent: false,
    textHeight: 0,
    collapsedText: "",
    collapsedTextList: [],
    remainedText: "",
  });
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  // prettier-ignore
  const onTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
    const moreContent = event.nativeEvent.lines.length > 2 ? true : false;
    const collapsedTextList = event.nativeEvent.lines.slice(0, 2).map(line => line.text);
    const collapsedText = collapsedTextList.join("").trim();
    const remainedText = moreContent ? event.nativeEvent.lines.slice(2).map((line) => line.text).join("").trim() : "";
    const textHeight = moreContent ? (event.nativeEvent.lines.slice(2).length * (contentHeight / 2)) : 0;
    setcontentState({ textHeight, moreContent, collapsedText, collapsedTextList, remainedText });
  };

  const contentTextTouch = () => {
    if (contentState.moreContent && isCollapsed) setIscollapsed(false);
    else goToFeedComments(feedData?.id);
  };

  useEffect(() => {
    if (isFirstRun.current) {
      if (likeYn) heartRef.current?.play(30, 30);
      else heartRef.current?.play(0, 0);
      isFirstRun.current = false;
    } else {
      bgHeartRef.current?.play(10, 25);
      if (likeYn) heartRef.current?.play(10, 25);
      else heartRef.current?.play(45, 60);
    }
  }, [likeYn]);

  const onPressHeart = () => {
    if (likeYn) heartRef.current?.play(45, 60);
    else heartRef.current?.play(10, 25);

    if (likeFeed) {
      likeFeed(feedIndex, feedData?.id);
    }
  };

  const doubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (lastTapTime && now - lastTapTime < DOUBLE_PRESS_DELAY) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();

      if (!likeYn && likeFeed) likeFeed(feedIndex, feedData?.id);

      bgHeartRef.current?.play(10, 25);
      heartRef.current?.play(10, 25);
    } else {
      lastTapTime = now;
    }
  };

  const goToProfile = useCallback((userId?: number) => navigation.push("ProfileStack", { screen: "Profile", params: { userId } }), []);

  const goToClub = useCallback((clubId?: number) => {
    if (clubId) navigation.push("ClubStack", { screen: "ClubTopTabs", params: { clubId } });
  }, []);

  const goToFeedComments = useCallback((feedId?: number) => {
    if (feedId === undefined) return;
    navigation.push("FeedStack", { screen: "FeedComments", params: { feedId } });
  }, []);

  const goToFeedLikes = useCallback(
    (likeUsers?: LikeUser[]) => {
      // 로그인 되어있다면, likeYn에 따라 likeUsers 목록에 내 정보를 넣거나 뺀다.
      if (me?.thumbnail && me?.name && me?.id) {
        likeUsers = likeUsers?.filter((user) => user.userId != me?.id);
        if (likeYn) likeUsers?.push({ thumbnail: me?.thumbnail, userName: me?.name, likeDate: moment().tz("Asia/Seoul").format("YYYY-MM-DDThh:mm:ss"), userId: me?.id });
      }

      if (!likeUsers || likeUsers.length === 0) return;
      navigation.push("FeedStack", { screen: "FeedLikes", params: { likeUsers } });
    },
    [likeYn]
  );

  const onBgHeartAnimationFinish = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const downloadImage = (url?: string) => {
    if (!url) return;
    if (!isMyClubPost) return;
    const fileName = url.split("/").pop();
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
  };

  const AnimatedHeartView = Animated.createAnimatedComponent(HeartView);

  return (
    <Container>
      <Header height={headerHeight}>
        <CircleIcon uri={feedData?.thumbnail} size={38} kerning={8} onPress={() => goToProfile(feedData?.userId)} />
        <HeaderInformation>
          <HeaderInformationTop>
            <TouchableOpacity activeOpacity={1} onPress={() => goToProfile(feedData?.userId)}>
              <HeaderText>{feedData?.userName}</HeaderText>
            </TouchableOpacity>
            {showClubName ? (
              <TouchableOpacity activeOpacity={1} onPress={() => goToClub(feedData?.clubId)}>
                <Tag name={feedData?.clubName ?? ""} contentContainerStyle={{ paddingLeft: 7, paddingRight: 7 }} textColor="#464646" backgroundColor="#E6E6E6" />
              </TouchableOpacity>
            ) : null}
          </HeaderInformationTop>
          <HeaderInformationBottom>
            <CreatedTime>{moment(feedData?.created, "YYYY-MM-DDThh:mm:ss").fromNow()}</CreatedTime>
            <TouchableOpacity onPress={() => goToFeedOptionModal(feedData)} style={{ paddingLeft: 15, marginRight: -10 }}>
              <Iconify icon="ant-design:ellipsis-outlined" size={20} color="black" style={{ marginRight: 7 }} />
            </TouchableOpacity>
          </HeaderInformationBottom>
        </HeaderInformation>
      </Header>
      <Carousel
        pages={feedData?.imageUrls}
        pageWidth={feedSize}
        gap={0}
        offset={0}
        initialScrollIndex={0}
        keyExtractor={(item: string, index: number) => String(index)}
        showIndicator={(feedData?.imageUrls?.length ?? 0) > 1 ? true : false}
        renderItem={({ item, index }: { item: string; index: number }) => (
          <Pinchable>
            <FadeFastImage
              activeOpacity={1}
              onPress={() => doubleTap()}
              onLongPress={() => downloadImage(item)}
              uri={item}
              style={{ width: feedSize, height: feedSize }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </Pinchable>
        )}
        ListEmptyComponent={<FadeFastImage uri={undefined} style={{ width: feedSize, height: feedSize }} />}
      />
      <AnimatedHeartView style={{ opacity }} pointerEvents="none">
        <Lottie
          ref={bgHeartRef}
          source={require("@lottie/like-background.json")}
          autoPlay={false}
          loop={false}
          speed={1.0}
          colorFilters={[{ keypath: "Filled", color: lightTheme.accentColor }]}
          onAnimationFinish={onBgHeartAnimationFinish}
          autoSize={true}
          style={{ width: 200, height: 200 }}
        />
      </AnimatedHeartView>
      <Content padding={10}>
        <Information height={infoHeight}>
          <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "flex-start" }}>
            <InformationLeft>
              <InformationIconButton activeOpacity={1} onPress={onPressHeart}>
                <Lottie
                  ref={heartRef}
                  source={require("@lottie/70547-like.json")}
                  autoPlay={false}
                  loop={false}
                  speed={1.5}
                  colorFilters={[
                    { keypath: "Filled", color: lightTheme.accentColor },
                    { keypath: "Empty", color: "#DBDBDB" },
                  ]}
                  style={{ width: 35, height: 35, marginLeft: -2 }}
                />
              </InformationIconButton>
              <InformationNumberButton activeOpacity={1} onPress={() => goToFeedLikes(feedData?.likeUserList ?? [])} style={{ marginLeft: -8, paddingRight: 4 }}>
                <CountingNumber>{likesCount}</CountingNumber>
              </InformationNumberButton>
              <InformationIconButton activeOpacity={1} onPress={() => goToFeedComments(feedData?.id)}>
                <Iconify icon="ph:chat-text" size={24} color="black" />
              </InformationIconButton>
              <InformationNumberButton activeOpacity={1} onPress={() => goToFeedComments(feedData?.id)}>
                <CountingNumber>{commentCount}</CountingNumber>
              </InformationNumberButton>
            </InformationLeft>
          </View>
        </Information>
        <ScrollView style={{ height: 0 }}>
          <ContentText onTextLayout={onTextLayout}>{feedData?.content}</ContentText>
        </ScrollView>
        <TouchableOpacity activeOpacity={1} onPress={contentTextTouch}>
          <ContentTextView height={contentHeight}>
            {contentState.moreContent && isCollapsed ? (
              <>
                <ContentText>{`${
                  contentState.collapsedTextList.length > 1 && contentState.collapsedTextList[1].length > 15 ? contentState.collapsedText.slice(0, -8) : contentState.collapsedText
                }  `}</ContentText>
                <ContentSubText>{` 더보기`}</ContentSubText>
              </>
            ) : (
              <ContentText>{contentState.collapsedText}</ContentText>
            )}
          </ContentTextView>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} onPress={contentTextTouch}>
          <Collapsible collapsed={isCollapsed} style={{ height: contentState.textHeight }}>
            <ContentTextView>
              <ContentText>{contentState.remainedText}</ContentText>
            </ContentTextView>
          </Collapsible>
        </TouchableOpacity>
      </Content>
    </Container>
  );
};

export default React.memo(FeedDetail);
