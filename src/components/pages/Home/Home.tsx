import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, DeviceEventEmitter, Platform, StatusBar, useWindowDimensions, View } from "react-native";
import { useModalize } from "react-native-modalize";
import { useToast } from "react-native-toast-notifications";
import { useInfiniteQuery, useMutation, useQuery } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { BaseResponse, ErrorResponse, Feed, FeedApi, FeedDeletionRequest, FeedLikeRequest, FeedReportRequest, FeedsResponse, NotificationsResponse, UserApi, UserBlockRequest } from "api";
import FeedDetail from "@components/organisms/FeedDetail";
import feedSlice from "redux/slices/feed";
import { useAppDispatch } from "redux/store";
import { RootState } from "redux/store/reducers";
import FeedOptionModal from "../Feed/FeedOptionModal";
import FeedReportModal from "../Feed/FeedReportModal";
import RNFetchBlob from "rn-fetch-blob";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { Iconify } from "react-native-iconify";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainBottomTabParamList } from "@navigation/Tabs";
import { RootStackParamList } from "@navigation/Root";

const Loader = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: ${Platform.OS === "android" ? StatusBar.currentHeight : 0}px;
`;

const Container = styled.SafeAreaView`
  padding-top: ${Platform.OS === "android" ? StatusBar.currentHeight : 0}px;
  flex: 1;
`;

const HeaderView = styled.View<{ height: number }>`
  flex-direction: row;
  height: ${(props) => props.height}px;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 0px 10px;
`;

const LogoText = styled.Text`
  font-family: ${(props) => props.theme.englishSecondaryFontDB};
  font-size: 31px;
`;

const HeaderRightView = styled.View`
  flex-direction: row;
  height: 50px;
`;

const HeaderButton = styled.TouchableOpacity`
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const NotiView = styled.View``;
const NotiBadge = styled.View`
  position: absolute;
  top: 0px;
  right: 0px;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  z-index: 1;
  background-color: ${(props) => props.theme.accentColor};
  justify-content: center;
  align-items: center;
`;
const NotiBadgeText = styled.Text`
  color: white;
  font-size: 3px;
`;

const Home: React.FC<NativeStackScreenProps<MainBottomTabParamList, "Home">> = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const me = useSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [notiCount, setNotiCount] = useState<number>(0);
  const { ref: feedOptionRef, open: openFeedOption, close: closeFeedOption } = useModalize();
  const { ref: complainOptionRef, open: openComplainOption, close: closeComplainOption } = useModalize();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const homeHeaderHeight = 50;
  const modalOptionButtonHeight = 45;
  const feedDetailHeaderHeight = 52;
  const feedDetailInfoHeight = 42;
  const feedDetailContentHeight = 40;
  const itemSeparatorGap = 30;
  const [selectFeedData, setSelectFeedData] = useState<Feed>();
  const scrollY = useRef(new Animated.Value(0)).current;
  const animatedHeaderOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
  });
  const homeFlatlistRef = useRef<Animated.FlatList<Feed>>(null);

  //getFeeds ( 무한 스크롤 )
  const {
    isLoading: feedsLoading,
    isRefetching: isRefetchingFeeds,
    data: queryFeedData,
    hasNextPage,
    refetch: feedsRefetch,
    fetchNextPage,
  } = useInfiniteQuery<FeedsResponse, ErrorResponse>(["getFeeds"], FeedApi.getFeeds, {
    getNextPageParam: (lastPage) => {
      if (lastPage) {
        return lastPage.hasData === true ? lastPage.responses?.content[lastPage.responses?.content.length - 1].customCursor : null;
      }
    },
    onSuccess: (res) => {
      if (res.pages[res.pages.length - 1].responses) dispatch(feedSlice.actions.addFeeds({ feeds: res?.pages[res.pages.length - 1]?.responses?.content ?? [] }));
    },
    onError: (error) => {
      console.log(`API ERROR | getFeeds ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
    staleTime: 5000,
    cacheTime: 15000,
  });

  const {
    data: userNotifications,
    isLoading: notiLoading,
    refetch: notiRefetch,
  } = useQuery<NotificationsResponse, ErrorResponse>(["getUserNotifications"], UserApi.getUserNotifications, {
    onSuccess: (res) => {
      if (Array.isArray(res?.data)) setNotiCount(res?.data.filter((item) => !item?.read).length);
    },
    onError: (error) => {
      console.log(`API ERROR | getUserNotifications ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  useEffect(() => {
    const homeFeedSubscription = DeviceEventEmitter.addListener("HomeAllRefetch", () => {
      onRefresh();
    });

    const homeNotiSubscription = DeviceEventEmitter.addListener("HomeNotiRefetch", () => {
      notiRefetch();
    });

    const homeFeedScrollToTopSubscription = DeviceEventEmitter.addListener("HomeFeedScrollToTop", () => {
      homeFlatlistRef?.current?.scrollToOffset({ animated: true, offset: 0 });
    });

    return () => {
      homeFeedSubscription.remove();
      homeNotiSubscription.remove();
      homeFeedScrollToTopSubscription.remove();
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await notiRefetch();
    const result = await feedsRefetch();
    dispatch(feedSlice.actions.refreshFeed({ feeds: result?.data?.pages?.flatMap((page) => page?.responses?.content) ?? [] }));
    setRefreshing(false);
  };

  const loadMore = () => {
    if (hasNextPage) fetchNextPage();
  };

  const complainMutation = useMutation<BaseResponse, ErrorResponse, FeedReportRequest>(FeedApi.reportFeed, {
    onSuccess: (res) => {
      toast.show(`신고 요청이 완료 되었습니다.`, { type: "success" });
      onRefresh();
    },
    onError: (error) => {
      console.log(`API ERROR | reportFeed ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });
  const deleteFeedMutation = useMutation<BaseResponse, ErrorResponse, FeedDeletionRequest>(FeedApi.deleteFeed, {
    onSuccess: (res) => {
      toast.show(`게시글이 삭제되었습니다.`, { type: "success" });
      onRefresh();
      closeFeedOption();
    },
    onError: (error) => {
      console.log(`API ERROR | deleteFeed ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });
  const likeFeedMutation = useMutation<BaseResponse, ErrorResponse, FeedLikeRequest>(FeedApi.likeFeed);

  const blockUserMutation = useMutation<BaseResponse, ErrorResponse, UserBlockRequest>(UserApi.blockUser, {
    onSuccess: (res) => {
      toast.show(`사용자를 차단했습니다.`, { type: "success" });
      onRefresh();
      closeFeedOption();
    },
    onError: (error) => {
      console.log(`API ERROR | blockUser ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const goToUpdateFeed = () => {
    closeFeedOption();
    navigation.navigate("FeedStack", { screen: "FeedModification", params: { feedData: selectFeedData } });
  };

  const goToUserNotification = useCallback(() => {
    navigation.navigate("ProfileStack", { screen: "UserNotification" });
  }, []);

  const goToFeedCreation = useCallback(() => {
    navigation.navigate("FeedStack", { screen: "ClubSelection" });
  }, []);

  const goToFeedOptionModal = (feedData?: Feed) => {
    if (!feedData) return;
    setSelectFeedData(feedData);
    openFeedOption();
  };
  const goToComplain = () => {
    closeFeedOption();
    openComplainOption();
  };

  const likeFeed = useCallback((feedIndex?: number, feedId?: number) => {
    if (feedIndex === undefined || feedId === undefined) return;
    const requestData: FeedLikeRequest = { feedId };
    likeFeedMutation.mutate(requestData, {
      onSuccess: (res) => {},
      onError: (error) => {
        console.log(`API ERROR | likeFeed ${error.code} ${error.status}`);
        toast.show(`${error.message ?? error.code}`, { type: "warning" });
      },
    });

    dispatch(feedSlice.actions.likeToggle({ feedId }));
  }, []);

  const deleteFeed = () => {
    if (selectFeedData === undefined || selectFeedData?.id === -1) {
      toast.show("게시글 정보가 잘못되었습니다.", { type: "warning" });
      return;
    }
    const requestData: FeedDeletionRequest = {
      feedId: selectFeedData.id,
    };

    Alert.alert(
      "게시물 삭제",
      "정말로 해당 게시물을 삭제하시겠습니까?",
      [
        {
          text: "아니요",
          style: "cancel",
        },
        {
          text: "네",
          onPress: () => {
            deleteFeedMutation.mutate(requestData);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const complainSubmit = (reason: string) => {
    if (selectFeedData === undefined || selectFeedData?.id === -1) {
      toast.show("게시글 정보가 잘못되었습니다.", { type: "warning" });
      return;
    }
    const requestData: FeedReportRequest = {
      feedId: selectFeedData.id,
      data: { reason },
    };
    complainMutation.mutate(requestData);
    closeComplainOption();
  };

  const blockUser = () => {
    if (selectFeedData === undefined || selectFeedData?.id === -1) {
      toast.show("게시글 정보가 잘못되었습니다.", { type: "warning" });
      return;
    }

    const requestData: UserBlockRequest = { userId: selectFeedData.userId };

    Alert.alert(
      `${selectFeedData.userName}님을 차단하시겠어요?`,
      `${selectFeedData.userName}님의 게시글을 볼 수 없게 됩니다. 상대방에게는 회원님이 차단했다는 정보를 알리지 않습니다.`,
      [
        {
          text: "아니요",
          style: "cancel",
        },
        {
          text: "네",
          onPress: () => {
            blockUserMutation.mutate(requestData);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const downloadImages = () => {
    Alert.alert("사진 저장", "이 피드의 사진을 전부 저장하시겠습니까?", [
      { text: "아니요" },
      {
        text: "예",
        onPress: () => {
          selectFeedData?.imageUrls?.map((url) => {
            const fileName = url.split("/").pop();
            let path = Platform.OS === "android" ? `${RNFetchBlob.fs.dirs.DownloadDir}` : `${RNFetchBlob.fs.dirs.CacheDir}`;
            path += `/OnYou/${fileName}`;
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
          });
          closeFeedOption();
        },
      },
    ]);
  };

  const keyExtractor = useCallback((item: Feed, index: number) => String(index), []);
  const ItemSeparatorComponent = useCallback(() => <View style={{ height: itemSeparatorGap }} />, []);
  const ListFooterComponent = useCallback(() => <View style={{ height: 100 }} />, []);
  const renderItem = useCallback(
    ({ item, index }: { item: Feed; index: number }) => (
      <FeedDetail
        key={`Feed_${index}`}
        feedData={item}
        feedIndex={index}
        feedSize={SCREEN_WIDTH}
        headerHeight={feedDetailHeaderHeight}
        infoHeight={feedDetailInfoHeight}
        contentHeight={feedDetailContentHeight}
        showClubName={true}
        goToFeedOptionModal={goToFeedOptionModal}
        likeFeed={likeFeed}
      />
    ),
    [me]
  );

  return feedsLoading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Container>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
      <HeaderView height={homeHeaderHeight}>
        <LogoText>{`ON YOU`}</LogoText>
        <HeaderRightView>
          <HeaderButton onPress={goToUserNotification} style={{ paddingHorizontal: 8 }}>
            <NotiView>
              {!notiLoading && notiCount > 0 ? <NotiBadge>{/* <NotiBadgeText>{notiCount}</NotiBadgeText> */}</NotiBadge> : <></>}
              <Iconify icon="mdi:bell" size={23} color="black" />
            </NotiView>
          </HeaderButton>
          <HeaderButton onPress={goToFeedCreation} style={{ paddingLeft: 12 }}>
            <Iconify icon="mdi:plus-box-multiple" size={23} color="black" />
          </HeaderButton>
        </HeaderRightView>
      </HeaderView>
      <Animated.View style={{ width: "100%", borderBottomWidth: 0.5, borderBottomColor: "#cccccc", opacity: animatedHeaderOpacity }} />
      <Animated.FlatList
        ref={homeFlatlistRef}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={loadMore}
        onEndReachedThreshold={0.7}
        data={queryFeedData?.pages?.flatMap((page: FeedsResponse) => page.responses.content) ?? []}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListFooterComponent={ListFooterComponent}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        removeClippedSubviews={true}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      />

      <FeedOptionModal
        modalRef={feedOptionRef}
        buttonHeight={modalOptionButtonHeight}
        isMyFeed={selectFeedData?.userId === me?.id}
        goToUpdateFeed={goToUpdateFeed}
        deleteFeed={deleteFeed}
        goToComplain={goToComplain}
        blockUser={blockUser}
        downloadImages={downloadImages}
      />

      <FeedReportModal modalRef={complainOptionRef} buttonHeight={modalOptionButtonHeight} complainSubmit={complainSubmit} />
    </Container>
  );
};
export default Home;
