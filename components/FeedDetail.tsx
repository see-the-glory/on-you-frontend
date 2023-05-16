import React, { useCallback, useEffect, useRef, useState } from "react";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import CircleIcon from "./CircleIcon";
import { Feed, LikeUser } from "../api";
import { Alert, Animated, NativeSyntheticEvent, Platform, ScrollView, TextLayoutEventData, TouchableOpacity, View } from "react-native";
import moment from "moment";
import Carousel from "./Carousel";
import Tag from "./Tag";
import Collapsible from "react-native-collapsible";
import Pinchable from "react-native-pinchable";
import RNFetchBlob from "rn-fetch-blob";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Lottie from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/reducers";
import { lightTheme } from "../theme";

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
const HeaderInformationView = styled.View`
  justify-content: center;
  align-items: flex-start;
`;

const HeaderNameView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const HeaderRightView = styled.View`
  height: 100%;
  justify-content: flex-end;
  padding-bottom: 10px;
`;
const HeaderText = styled.Text`
  font-size: 14px;
  line-height: 16px;
  font-family: ${(props: any) => props.theme.koreanFontEB};
  color: #2b2b2b;
  margin-right: 5px;
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

const CountingNumber = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontM};
  margin-left: 3px;
`;
const CreatedTime = styled.Text`
  color: #9a9a9a;
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 12px;
`;
const ContentTextView = styled.Text<{ height?: number }>`
  ${(props: any) => (props.height ? `height: ${props.height}px` : "")};
`;
const ContentText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 14px;
  line-height: 20px;
  color: #2b2b2b;
`;

const ContentSubText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
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
  feedData?: Feed;
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
    else goToFeedComments(feedIndex, feedData?.id);
  };

  useEffect(() => {
    if (isFirstRun.current) {
      if (feedData?.likeYn) heartRef.current?.play(30, 30);
      else heartRef.current?.play(0, 0);
      isFirstRun.current = false;
    } else {
      bgHeartRef.current?.play(10, 25);

      if (feedData?.likeYn) heartRef.current?.play(10, 25);
      else heartRef.current?.play(45, 60);
    }
  }, [feedData?.likeYn]);

  const onPressHeart = () => {
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

      if (feedData?.likeYn) {
        heartRef.current?.play(10, 25);
        bgHeartRef.current?.play(10, 25);
      } else {
        if (likeFeed) {
          likeFeed(feedIndex, feedData?.id);
        }
      }
    } else {
      lastTapTime = now;
    }
  };

  const goToProfile = useCallback((userId?: number) => navigation.push("ProfileStack", { screen: "Profile", params: { userId } }), []);

  const goToClub = useCallback((clubId?: number) => {
    if (clubId) navigation.push("ClubStack", { screen: "ClubTopTabs", params: { clubData: { id: clubId } } });
  }, []);

  const goToFeedComments = useCallback((feedIndex?: number, feedId?: number) => {
    if (feedIndex === undefined || feedId === undefined) return;
    navigation.push("FeedStack", { screen: "FeedComments", params: { feedIndex, feedId } });
  }, []);

  const goToFeedLikes = useCallback(
    (likeUsers?: LikeUser[]) => {
      // 로그인 되어있다면, likeYn에 따라 likeUsers 목록에 내 정보를 넣거나 뺀다.
      if (me?.thumbnail && me?.name && me?.id) {
        likeUsers = likeUsers?.filter((user) => user.userId != me?.id);
        if (feedData?.likeYn) likeUsers?.push({ thumbnail: me?.thumbnail, userName: me?.name, likeDate: moment().tz("Asia/Seoul").format("YYYY-MM-DDThh:mm:ss"), userId: me?.id });
      }

      if (!likeUsers || likeUsers.length === 0) return;
      navigation.push("FeedStack", { screen: "FeedLikes", params: { likeUsers } });
    },
    [feedData?.likeYn]
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
    let fileName = url.split("/").pop();
    let path = Platform.OS === "android" ? `${RNFetchBlob.fs.dirs.DCIMDir}/${fileName}` : `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}`;
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
                CameraRoll.save(filePath).then(() => {
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
      <HeaderView padding={10} height={headerHeight}>
        <HeaderLeftView>
          <CircleIcon uri={feedData?.thumbnail} size={38} kerning={6} onPress={() => goToProfile(feedData?.userId)} />
          <HeaderInformationView>
            <HeaderNameView>
              <TouchableOpacity activeOpacity={1} onPress={() => goToProfile(feedData?.userId)}>
                <HeaderText>{feedData?.userName}</HeaderText>
              </TouchableOpacity>
              {showClubName ? (
                <TouchableOpacity activeOpacity={1} onPress={() => goToClub(feedData?.clubId)}>
                  <Tag name={feedData?.clubName ?? ""} contentContainerStyle={{ paddingLeft: 7, paddingRight: 7 }} textColor="#464646" backgroundColor="#E6E6E6" />
                </TouchableOpacity>
              ) : null}
            </HeaderNameView>
            <CreatedTime>{moment(feedData?.created, "YYYY-MM-DDThh:mm:ss").fromNow()}</CreatedTime>
          </HeaderInformationView>
        </HeaderLeftView>
        <HeaderRightView>
          <TouchableOpacity onPress={() => goToFeedOptionModal(feedData)} style={{ paddingLeft: 15, paddingTop: 15, marginRight: -10 }}>
            <AntDesign name="ellipsis1" size={16} color="black" style={{ marginRight: 10 }} />
          </TouchableOpacity>
        </HeaderRightView>
      </HeaderView>
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
            <TouchableOpacity activeOpacity={1} onPress={() => doubleTap()} onLongPress={() => downloadImage(item)}>
              <FastImage key={String(index)} source={item ? { uri: item } : require("../assets/basic.jpg")} style={{ width: feedSize, height: feedSize }} resizeMode={FastImage.resizeMode.contain} />
            </TouchableOpacity>
          </Pinchable>
        )}
        ListEmptyComponent={<FastImage source={require("../assets/basic.jpg")} style={{ width: feedSize, height: feedSize }} />}
      />
      <AnimatedHeartView style={{ opacity }} pointerEvents="none">
        <Lottie
          ref={bgHeartRef}
          source={require("../assets/lottie/like-background.json")}
          autoPlay={false}
          loop={false}
          speed={1.0}
          colorFilters={[{ keypath: "Filled", color: lightTheme.accentColor }]}
          onAnimationFinish={onBgHeartAnimationFinish}
          autoSize={true}
          style={{ width: 200, height: 200 }}
        />
      </AnimatedHeartView>
      <ContentView padding={10}>
        <InformationView height={infoHeight}>
          <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "flex-start" }}>
            <InformationLeftView>
              <InformationIconButton activeOpacity={1} onPress={onPressHeart}>
                <Lottie
                  ref={heartRef}
                  source={require("../assets/lottie/70547-like.json")}
                  autoPlay={false}
                  loop={false}
                  speed={1.5}
                  colorFilters={[
                    { keypath: "Filled", color: lightTheme.accentColor },
                    { keypath: "Empty", color: "#000000" },
                  ]}
                  style={{ width: 35, height: 35, marginLeft: -2 }}
                />
              </InformationIconButton>
              <InformationNumberButton activeOpacity={1} onPress={() => goToFeedLikes(feedData?.likeUserList ?? [])} style={{ marginLeft: -10 }}>
                <CountingNumber>{feedData?.likesCount}</CountingNumber>
              </InformationNumberButton>
              <InformationIconButton activeOpacity={1} onPress={() => goToFeedComments(feedIndex, feedData?.id)}>
                <Ionicons name="md-chatbox-ellipses" size={24} color="black" />
              </InformationIconButton>
              <InformationNumberButton activeOpacity={1} onPress={() => goToFeedComments(feedIndex, feedData?.id)}>
                <CountingNumber>{feedData?.commentCount}</CountingNumber>
              </InformationNumberButton>
            </InformationLeftView>
          </View>
        </InformationView>
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
      </ContentView>
    </Container>
  );
};

export default React.memo(FeedDetail);
