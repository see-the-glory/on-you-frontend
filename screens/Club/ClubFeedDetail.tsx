import React, { useCallback, useLayoutEffect, useState } from "react";
import { Alert, DeviceEventEmitter, EventSubscriptionVendor, FlatList, StatusBar, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useModalize } from "react-native-modalize";
import { useToast } from "react-native-toast-notifications";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { BaseResponse, ErrorResponse, Feed, FeedApi, FeedDeletionRequest, FeedLikeRequest, FeedReportRequest, UserApi, UserBlockRequest } from "../../api";
import CustomText from "../../components/CustomText";
import FeedDetail from "../../components/FeedDetail";
import { ClubFeedDetailScreenProps } from "../../Types/Club";
import FeedReportModal from "../Feed/FeedReportModal";
import FeedOptionModal from "../Feed/FeedOptionModal";
import { RootState } from "../../redux/store/reducers";
import { useAppDispatch } from "../../redux/store";
import clubSlice from "../../redux/slices/club";
import { Entypo } from "@expo/vector-icons";

const Container = styled.View``;
const HeaderTitleView = styled.View`
  justify-content: center;
  align-items: center;
`;
const HeaderClubName = styled(CustomText)`
  font-size: 14px;
  font-family: "NotoSansKR-Medium";
  color: #8e8e8e;
  line-height: 20px;
`;
const HeaderText = styled(CustomText)`
  font-size: 16px;
  font-family: "NotoSansKR-Medium";
  color: #2b2b2b;
  line-height: 20px;
`;

const ClubFeedDetail: React.FC<ClubFeedDetailScreenProps> = ({
  navigation: { setOptions, navigate, goBack },
  route: {
    params: { clubData, targetIndex },
  },
}) => {
  const me = useSelector((state: RootState) => state.auth.user);
  const feeds = useSelector((state: RootState) => state.club.feeds);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { ref: myFeedOptionRef, open: openMyFeedOption, close: closeMyFeedOption } = useModalize();
  const { ref: otherFeedOptionRef, open: openOtherFeedOption, close: closeOtherFeedOption } = useModalize();
  const { ref: complainOptionRef, open: openComplainOption, close: closeComplainOption } = useModalize();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const modalOptionButtonHeight = 45;
  const feedDetailHeaderHeight = 62;
  const feedDetailInfoHeight = 42;
  const feedDetailContentHeight = 40;
  const itemSeparatorGap = 20;
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
      closeMyFeedOption();
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
      closeOtherFeedOption();
    },
    onError: (error) => {
      console.log(`API ERROR | blockUser ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const goToComplain = () => {
    closeOtherFeedOption();
    openComplainOption();
  };

  const goToFeedComments = (feedIndex?: number, feedId?: number) => {
    if (feedIndex === undefined || feedId === undefined) return;
    navigate("FeedStack", { screen: "FeedComments", params: { feedIndex, feedId, clubId: clubData.id } });
  };

  const goToUpdateFeed = () => {
    closeMyFeedOption();
    navigate("FeedStack", { screen: "FeedModification", params: { feedData: selectFeedData } });
  };

  const openFeedOption = (feedData?: Feed) => {
    if (!feedData) return;
    setSelectFeedData(feedData);
    if (feedData?.userId === me?.id) openMyFeedOption();
    else openOtherFeedOption();
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
      onSuccess: (res) => {
        dispatch(clubSlice.actions.likeToggle(feedIndex));
      },
      onError: (error) => {
        console.log(`API ERROR | likeFeed ${error.code} ${error.status}`);
        toast.show(`${error.message ?? error.code}`, { type: "warning" });
      },
    });
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

  const loadMore = () => {
    console.log("ClubFeedDetail - Load more club feed!");
    DeviceEventEmitter.emit("ClubFeedLoadmore");
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
        openFeedOption={openFeedOption}
        goToFeedComments={goToFeedComments}
        likeFeed={likeFeed}
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
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <FlatList
        // refreshing={refreshing}
        // onRefresh={onRefresh}
        onEndReached={loadMore}
        data={feeds}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListFooterComponent={ListFooterComponent}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        initialScrollIndex={targetIndex}
        removeClippedSubviews={true}
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

export default ClubFeedDetail;
