import React, { useCallback, useLayoutEffect, useState } from "react";
import { Alert, DeviceEventEmitter, FlatList, Platform, StatusBar, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useModalize } from "react-native-modalize";
import { useToast } from "react-native-toast-notifications";
import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { BaseResponse, ErrorResponse, Feed, FeedApi, FeedDeletionRequest, FeedLikeRequest, FeedReportRequest, FeedsResponse, LikeUser, UserApi, UserBlockRequest } from "api";
import FeedDetail from "@components/organisms/FeedDetail";
import FeedReportModal from "../Feed/FeedReportModal";
import FeedOptionModal from "../Feed/FeedOptionModal";
import { RootState } from "redux/store/reducers";
import { useAppDispatch } from "redux/store";
import { Entypo } from "@expo/vector-icons";
import RNFetchBlob from "rn-fetch-blob";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import feedSlice from "redux/slices/feed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ClubStackParamList } from "@navigation/ClubStack";

const Container = styled.View``;
const HeaderTitleView = styled.View`
  justify-content: center;
  align-items: center;
`;
const HeaderClubName = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontM};
  font-size: 13px;
  color: #8e8e8e;
  line-height: 21px;
`;
const HeaderText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontM};
  font-size: 15px;
  line-height: 20px;
  color: #2b2b2b;
`;

const ClubFeedDetail: React.FC<NativeStackScreenProps<ClubStackParamList, "ClubFeedDetail">> = ({
  navigation: { setOptions, navigate, goBack },
  route: {
    params: { clubData, targetIndex, fetchNextPage },
  },
}) => {
  const queryClient = useQueryClient();
  const me = useSelector((state: RootState) => state.auth.user);
  const myRole = useSelector((state: RootState) => state.club[clubData?.id]?.role);
  const [query, setQuery] = useState<InfiniteData<FeedsResponse> | undefined>(queryClient.getQueryData<InfiniteData<FeedsResponse>>(["getClubFeeds", clubData?.id]));
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { ref: feedOptionRef, open: openFeedOption, close: closeFeedOption } = useModalize();
  const { ref: complainOptionRef, open: openComplainOption, close: closeComplainOption } = useModalize();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const modalOptionButtonHeight = 45;
  const feedDetailHeaderHeight = 52;
  const feedDetailInfoHeight = 42;
  const feedDetailContentHeight = 40;
  const itemSeparatorGap = 30;
  const itemLength = SCREEN_WIDTH + feedDetailHeaderHeight + feedDetailInfoHeight + feedDetailContentHeight + itemSeparatorGap;
  const [selectFeedData, setSelectFeedData] = useState<Feed>();

  const complainMutation = useMutation<BaseResponse, ErrorResponse, FeedReportRequest>(FeedApi.reportFeed, {
    onSuccess: (res) => {
      toast.show(`신고 요청이 완료 되었습니다.`, { type: "success" });
    },
    onError: (error) => {
      console.log(`API ERROR | reportFeed ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const deleteFeedMutation = useMutation<BaseResponse, ErrorResponse, FeedDeletionRequest>(FeedApi.deleteFeed, {
    onSuccess: (res) => {
      toast.show(`게시글이 삭제되었습니다.`, { type: "success" });
      DeviceEventEmitter.emit("HomeAllRefetch");
      DeviceEventEmitter.emit("ClubFeedRefetch");
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
      DeviceEventEmitter.emit("ClubFeedRefetch");
      closeFeedOption();
    },
    onError: (error) => {
      console.log(`API ERROR | blockUser ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const goToComplain = () => {
    closeFeedOption();
    openComplainOption();
  };

  const goToUpdateFeed = () => {
    closeFeedOption();
    navigate("FeedStack", { screen: "FeedModification", params: { feedData: selectFeedData } });
  };

  const goToFeedOptionModal = (feedData?: Feed) => {
    if (!feedData) return;
    setSelectFeedData(feedData);
    openFeedOption();
  };

  const deleteFeed = () => {
    if (selectFeedData === undefined || selectFeedData?.id === -1) {
      toast.show("게시글 정보가 잘못되었습니다.", { type: "warning" });
      return;
    }

    const requestData: FeedDeletionRequest = { feedId: selectFeedData.id };

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

  const blockUser = () => {
    if (selectFeedData === undefined || selectFeedData?.id === -1) {
      toast.show("게시글 정보가 잘못되었습니다.", {
        type: "warning",
      });
      return;
    }

    const requestData: UserBlockRequest = { userId: selectFeedData.userId };

    Alert.alert(
      `${selectFeedData.userName}님을 차단하시곘어요?`,
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
            let fileName = url.split("/").pop();
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

  const loadMore = async () => {
    if (!fetchNextPage) return;
    if (query?.pages[query?.pages.length - 1].hasData) {
      const q = await fetchNextPage();
      setQuery(q.data);
    }
  };

  useLayoutEffect(() => {
    setOptions({
      headerTitle: () => (
        <HeaderTitleView>
          <HeaderClubName>{clubData.name}</HeaderClubName>
          <HeaderText>게시물</HeaderText>
        </HeaderTitleView>
      ),

      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black"></Entypo>
        </TouchableOpacity>
      ),
    });
  }, []);

  const keyExtractor = useCallback((item: Feed, index: number) => String(index), []);
  const renderItem = useCallback(
    ({ item, index }: { item: Feed; index: number }) => (
      <FeedDetail
        key={`ClubFeed_${index}`}
        feedData={item}
        feedIndex={index}
        feedSize={SCREEN_WIDTH}
        headerHeight={feedDetailHeaderHeight}
        infoHeight={feedDetailInfoHeight}
        contentHeight={feedDetailContentHeight}
        goToFeedOptionModal={goToFeedOptionModal}
        likeFeed={likeFeed}
        isMyClubPost={["MASTER", "MANAGER", "MEMBER"].includes(myRole ?? "") ? true : false}
      />
    ),
    []
  );
  const ItemSeparatorComponent = useCallback(() => <View style={{ height: itemSeparatorGap }} />, []);
  const ListFooterComponent = useCallback(() => <View style={{ height: 100 }} />, []);
  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: itemLength,
      offset: itemLength * index,
      index,
    }),
    []
  );
  return (
    <Container>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
      <FlatList
        // refreshing={refreshing}
        // onRefresh={onRefresh}
        onEndReached={loadMore}
        data={query?.pages?.flatMap((page) => page.responses.content) ?? []}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListFooterComponent={ListFooterComponent}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        initialScrollIndex={targetIndex}
        removeClippedSubviews={true}
      />

      <FeedOptionModal
        modalRef={feedOptionRef}
        buttonHeight={modalOptionButtonHeight}
        isMyFeed={selectFeedData?.userId === me?.id}
        isMyClubPost={["MASTER", "MANAGER", "MEMBER"].includes(myRole ?? "") ? true : false}
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

export default ClubFeedDetail;
