import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, DeviceEventEmitter, FlatList, Platform, StatusBar, Text, useWindowDimensions, View } from "react-native";
import FastImage from "react-native-fast-image";
import { useModalize } from "react-native-modalize";
import { useToast } from "react-native-toast-notifications";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { Feed, FeedApi, FeedDeleteRequest, FeedReportRequest, FeedsResponse } from "../api";
import FeedDetail from "../components/FeedDetail";
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
  const queryClient = useQueryClient();
  const token = useSelector((state: RootState) => state.auth.token);
  const me = useSelector((state: RootState) => state.auth.user);
  const toast = useToast();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { ref: myFeedOptionRef, open: openMyFeedOption, close: closeMyFeedOption } = useModalize();
  const { ref: otherFeedOptionRef, open: openOtherFeedOption, close: closeOtherFeedOption } = useModalize();
  const { ref: complainOptionRef, open: openComplainOption, close: closeComplainOption } = useModalize();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const homeHeaderHeight = 50;
  const modalOptionButtonHeight = 45;
  const feedDetailHeaderHeight = 62;
  const feedDetailInfoHeight = 36;
  const feedDetailContentHeight = 40;
  const itemSeparatorGap = 30;
  const [selectFeedId, setSelectFeedId] = useState<number>(-1);
  const navigation = useNavigation();
  //getFeeds ( 무한 스크롤 )
  const {
    isLoading: feedsLoading,
    data: feeds,
    isRefetching: isRefetchingFeeds,
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
      console.log(res.pages.length);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    console.log("Home - add listner");
    let homeFeedSubscription = DeviceEventEmitter.addListener("HomeFeedRefetch", () => {
      feedsRefetch();
    });

    return () => {
      console.log("Home - remove listner");
      homeFeedSubscription.remove();
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["feeds"]);
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
  const deleteFeedMutation = useMutation(FeedApi.feedDelete, {
    onSuccess: (res) => {
      if (res.status === 200) {
        console.log(res);
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
  const goToClub = useCallback((clubId: number) => {
    navigation.navigate("ClubStack", { screen: "ClubTopTabs", clubData: { id: clubId } });
  }, []);

  const goToFeedComments = useCallback((feedId: number) => {
    navigation.navigate("FeedStack", { screen: "FeedComments", feedId });
  }, []);

  const goToFeedCreation = useCallback(() => {
    navigation.navigate("HomeStack", {
      screen: "MyClubSelector",
      userId: me?.id,
    });
  }, [me]);

  const openFeedOption = (userId: number, feedId: number) => {
    setSelectFeedId(feedId);
    if (userId === me?.id) openMyFeedOption();
    else openOtherFeedOption();
  };
  const goToComplain = () => {
    closeOtherFeedOption();
    openComplainOption();
  };

  const deleteFeed = () => {
    if (selectFeedId === -1) {
      toast.show("게시글 정보가 잘못되었습니다.", {
        type: "warning",
      });
      return;
    }
    const requestData: FeedDeleteRequest = {
      token,
      data: {
        id: selectFeedId,
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

  const goToUpdateFeed = () => {};

  const complainSubmit = () => {
    if (selectFeedId === -1) {
      toast.show("게시글 정보가 잘못되었습니다.", {
        type: "warning",
      });
      return;
    }
    const requestData: FeedReportRequest = {
      token,
      data: {
        id: selectFeedId,
        reason: "SPAM",
      },
    };
    complainMutation.mutate(requestData);
  };

  const keyExtractor = useCallback((item: Feed, index: number) => String(index), []);
  const ItemSeparatorComponent = useCallback(() => <View style={{ height: itemSeparatorGap }} />, []);
  const ListFooterComponent = useCallback(() => <View style={{ height: 100 }} />, []);
  const renderItem = useCallback(
    ({ item, index }: { item: Feed; index: number }) => (
      <FeedDetail
        key={`Feed_${index}`}
        feedData={item}
        feedSize={SCREEN_WIDTH}
        headerHeight={feedDetailHeaderHeight}
        infoHeight={feedDetailInfoHeight}
        contentHeight={feedDetailContentHeight}
        showClubName={true}
        goToClub={goToClub}
        openFeedOption={openFeedOption}
        goToFeedComments={goToFeedComments}
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
      <StatusBar barStyle={"dark-content"} />
      <HeaderView height={homeHeaderHeight}>
        <FastImage source={require("../assets/home_logo.png")} style={{ width: 100, height: 30 }} />
        <HeaderRightView>
          <HeaderButton>
            <MaterialIcons name="notifications" size={20} color="black" />
          </HeaderButton>
          <HeaderButton onPress={goToFeedCreation}>
            <MaterialIcons name="add-photo-alternate" size={20} color="black" />
          </HeaderButton>
        </HeaderRightView>
      </HeaderView>
      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={loadMore}
        data={feeds?.pages?.map((page) => page?.responses?.content).flat()}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListFooterComponent={ListFooterComponent}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        removeClippedSubviews={true}
      />

      <FeedOptionModal modalRef={myFeedOptionRef} buttonHeight={modalOptionButtonHeight} isMyFeed={true} goToUpdateFeed={goToUpdateFeed} deleteFeed={deleteFeed} goToComplain={goToComplain} />
      <FeedOptionModal modalRef={otherFeedOptionRef} buttonHeight={modalOptionButtonHeight} isMyFeed={false} goToUpdateFeed={goToUpdateFeed} deleteFeed={deleteFeed} goToComplain={goToComplain} />
      <FeedReportModal modalRef={complainOptionRef} buttonHeight={modalOptionButtonHeight} complainSubmit={complainSubmit} />
    </Container>
  );
};
export default Home;
