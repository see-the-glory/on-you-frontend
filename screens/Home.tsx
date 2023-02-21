import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, DeviceEventEmitter, Platform, StatusBar, useWindowDimensions, View } from "react-native";
import FastImage from "react-native-fast-image";
import { useModalize } from "react-native-modalize";
import { useToast } from "react-native-toast-notifications";
import { useInfiniteQuery, useMutation } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { Feed, FeedApi, FeedDeletionRequest, FeedLikeRequest, FeedReportRequest, FeedsResponse, UserApi, UserBlockRequest } from "../api";
import FeedDetail from "../components/FeedDetail";
import feedSlice from "../redux/slices/feed";
import { useAppDispatch } from "../redux/store";
import { RootState } from "../redux/store/reducers";
import { HomeScreenProps } from "../types/feed";
import FeedOptionModal from "./Feed/FeedOptionModal";
import FeedReportModal from "./Feed/FeedReportModal";

const Loader = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: ${Platform.OS === "android" ? StatusBar.currentHeight : 0}px;
`;

const Container = styled.SafeAreaView``;

const HeaderView = styled.View<{ height: number }>`
  height: ${(props: any) => props.height}px;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

const HeaderRightView = styled.View`
  position: absolute;
  flex-direction: row;
  right: 0%;
  padding: 0px 10px;
  height: 50px;
`;

const HeaderButton = styled.TouchableOpacity`
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: 0px 10px;
`;

const Home: React.FC<HomeScreenProps> = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const me = useSelector((state: RootState) => state.auth.user);
  const feeds = useSelector((state: RootState) => state.feed.data);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { ref: myFeedOptionRef, open: openMyFeedOption, close: closeMyFeedOption } = useModalize();
  const { ref: otherFeedOptionRef, open: openOtherFeedOption, close: closeOtherFeedOption } = useModalize();
  const { ref: complainOptionRef, open: openComplainOption, close: closeComplainOption } = useModalize();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const homeHeaderHeight = 50;
  const modalOptionButtonHeight = 45;
  const feedDetailHeaderHeight = 62;
  const feedDetailInfoHeight = 42;
  const feedDetailContentHeight = 40;
  const itemSeparatorGap = 20;
  const [selectFeedData, setSelectFeedData] = useState<Feed>();
  const navigation = useNavigation();
  let scrollY = useRef(new Animated.Value(0)).current;
  let animatedHeaderOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
  });

  //getFeeds ( 무한 스크롤 )
  const {
    isLoading: feedsLoading,
    isRefetching: isRefetchingFeeds,
    data: queryFeedData,
    hasNextPage,
    refetch: feedsRefetch,
    fetchNextPage,
  } = useInfiniteQuery<FeedsResponse>(["feeds", { token }], FeedApi.getFeeds, {
    getNextPageParam: (lastPage) => {
      if (lastPage) {
        return lastPage.hasNext === false ? null : lastPage.responses?.content[lastPage.responses?.content.length - 1].customCursor;
      }
    },
    onSuccess: (res) => {
      dispatch(feedSlice.actions.addFeed(res.pages[res.pages.length - 1].responses.content));
    },
    onError: (error) => {
      console.log(error);
      toast.show(`Error Code: ${error}`, {
        type: "warning",
      });
    },
  });

  useEffect(() => {
    console.log("Home - add listner");
    let homeFeedSubscription = DeviceEventEmitter.addListener("HomeFeedRefetch", () => {
      onRefresh();
    });

    return () => {
      console.log("Home - remove listner");
      homeFeedSubscription.remove();
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    const result = await feedsRefetch();
    dispatch(feedSlice.actions.refreshFeed(result?.data?.pages?.map((page) => page?.responses?.content).flat() ?? []));
    setRefreshing(false);
  };

  const loadMore = () => {
    if (hasNextPage) fetchNextPage();
  };

  const complainMutation = useMutation(FeedApi.reportFeed, {
    onSuccess: (res) => {
      if (res.status === 200) {
        toast.show(`신고 요청이 완료 되었습니다.`, {
          type: "success",
        });
        onRefresh();
        closeComplainOption();
      } else {
        console.log("--- feedReport Error ---");
        console.log(res);
        toast.show(`Error Code: ${res.status}`, {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      console.log("--- feedReport Error ---");
      console.log(error);
      toast.show(`Error Code: ${error}`, {
        type: "warning",
      });
    },
  });
  const deleteFeedMutation = useMutation(FeedApi.deleteFeed, {
    onSuccess: (res) => {
      if (res.status === 200) {
        toast.show(`게시글이 삭제되었습니다.`, {
          type: "success",
        });
        onRefresh();
        closeMyFeedOption();
      } else {
        console.log("--- deleteFeed Error ---");
        console.log(res);
        toast.show(`Error Code: ${res.status}`, {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      console.log("--- deleteFeed Error ---");
      console.log(error);
      toast.show(`Error Code: ${error}`, {
        type: "warning",
      });
    },
  });
  const likeFeedMutation = useMutation(FeedApi.likeFeed);

  const blockUserMutation = useMutation(UserApi.blockUser, {
    onSuccess: (res) => {
      if (res.status === 200) {
        toast.show(`사용자를 차단했습니다.`, {
          type: "success",
        });
        onRefresh();
        closeMyFeedOption();
      } else {
        console.log("--- blockUser Error ---");
        console.log(res);
        toast.show(`Error Code: ${res.status}`, {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      console.log("--- blockUser Error ---");
      console.log(error);
      toast.show(`Error Code: ${error}`, {
        type: "warning",
      });
    },
  });

  const likeFeed = useCallback((feedIndex: number, feedId: number) => {
    const requestData: FeedLikeRequest = {
      data: { id: feedId },
      token,
    };
    likeFeedMutation.mutate(requestData, {
      onSuccess: (res) => {
        if (res.status === 200) {
          dispatch(feedSlice.actions.likeToggle(feedIndex));
        } else {
          console.log(res);
          toast.show(`Like Feed Fail (Error Code: ${res.status}`, {
            type: "warning",
          });
        }
      },
      onError: (error) => {
        console.log(error);
        toast.show(`Error Code: ${error}`, {
          type: "warning",
        });
      },
    });
  }, []);

  const goToClub = useCallback((clubId: number) => {
    navigation.navigate("ClubStack", { screen: "ClubTopTabs", clubData: { id: clubId } });
  }, []);

  const goToFeedComments = useCallback((feedIndex: number, feedId: number) => {
    navigation.navigate("FeedStack", { screen: "FeedComments", feedIndex, feedId });
  }, []);

  const goToUpdateFeed = () => {
    closeMyFeedOption();
    navigation.navigate("HomeStack", { screen: "ModifiyFeed", feedData: selectFeedData });
  };

  const goToFeedCreation = useCallback(() => {
    navigation.navigate("HomeStack", {
      screen: "MyClubSelector",
      userId: me?.id,
    });
  }, [me]);

  const openFeedOption = (feedData: Feed) => {
    setSelectFeedData(feedData);
    if (feedData.userId === me?.id) openMyFeedOption();
    else openOtherFeedOption();
  };
  const goToComplain = () => {
    closeOtherFeedOption();
    openComplainOption();
  };

  const deleteFeed = () => {
    if (selectFeedData === undefined || selectFeedData?.id === -1) {
      toast.show("게시글 정보가 잘못되었습니다.", {
        type: "warning",
      });
      return;
    }
    const requestData: FeedDeletionRequest = {
      token,
      data: {
        id: selectFeedData.id,
      },
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

  const complainSubmit = () => {
    if (selectFeedData === undefined || selectFeedData?.id === -1) {
      toast.show("게시글 정보가 잘못되었습니다.", {
        type: "warning",
      });
      return;
    }
    const requestData: FeedReportRequest = {
      token,
      data: {
        id: selectFeedData.id,
        reason: "SPAM",
      },
    };
    complainMutation.mutate(requestData);
  };

  const blockUser = () => {
    if (selectFeedData === undefined || selectFeedData?.id === -1) {
      toast.show("게시글 정보가 잘못되었습니다.", {
        type: "warning",
      });
      return;
    }

    const requestData: UserBlockRequest = {
      token,
      data: {
        userId: selectFeedData.userId,
      },
    };

    Alert.alert(
      "사용자 차단",
      "정말로 이 사용자를 차단하시겠습니까?",
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
        goToClub={goToClub}
        openFeedOption={openFeedOption}
        goToFeedComments={goToFeedComments}
        likeFeed={likeFeed}
      />
    ),
    []
  );

  return feedsLoading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Container>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <HeaderView height={homeHeaderHeight}>
        <FastImage source={require("../assets/home_logo.png")} style={{ width: 100, height: 30 }} />
        <HeaderRightView>
          <HeaderButton>
            <MaterialIcons name="notifications" size={23} color="black" />
          </HeaderButton>
          <HeaderButton onPress={goToFeedCreation}>
            <MaterialIcons name="add-photo-alternate" size={23} color="black" />
          </HeaderButton>
        </HeaderRightView>
      </HeaderView>
      <Animated.View style={{ width: "100%", borderBottomWidth: 0.5, borderBottomColor: "rgba(0,0,0,0.3)", opacity: animatedHeaderOpacity }} />
      <Animated.FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={loadMore}
        data={feeds}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListFooterComponent={ListFooterComponent}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        removeClippedSubviews={true}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      />

      <FeedOptionModal
        modalRef={myFeedOptionRef}
        buttonHeight={modalOptionButtonHeight}
        isMyFeed={true}
        goToUpdateFeed={goToUpdateFeed}
        deleteFeed={deleteFeed}
        goToComplain={goToComplain}
        blockUser={blockUser}
      />
      <FeedOptionModal
        modalRef={otherFeedOptionRef}
        buttonHeight={modalOptionButtonHeight}
        isMyFeed={false}
        goToUpdateFeed={goToUpdateFeed}
        deleteFeed={deleteFeed}
        goToComplain={goToComplain}
        blockUser={blockUser}
      />
      <FeedReportModal modalRef={complainOptionRef} buttonHeight={modalOptionButtonHeight} complainSubmit={complainSubmit} />
    </Container>
  );
};
export default Home;
