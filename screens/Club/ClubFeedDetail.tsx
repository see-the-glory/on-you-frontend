import React, { useCallback, useLayoutEffect, useState } from "react";
import { Alert, DeviceEventEmitter, FlatList, StatusBar, useWindowDimensions, View } from "react-native";
import { useModalize } from "react-native-modalize";
import { useToast } from "react-native-toast-notifications";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { Feed, FeedApi, FeedDeleteRequest, FeedReportRequest } from "../../api";
import CustomText from "../../components/CustomText";
import FeedDetail from "../../components/FeedDetail";
import { ClubFeedDetailScreenProps } from "../../Types/Club";
import FeedReportModal from "../Feed/FeedReportModal";
import FeedOptionModal from "../Feed/FeedOptionModal";
import { RootState } from "../../redux/store/reducers";

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
  navigation: { setOptions, navigate },
  route: {
    params: { clubData, feedData, targetIndex },
  },
}) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const me = useSelector((state: RootState) => state.auth.user);
  const toast = useToast();
  const { ref: myFeedOptionRef, open: openMyFeedOption, close: closeMyFeedOption } = useModalize();
  const { ref: otherFeedOptionRef, open: openOtherFeedOption, close: closeOtherFeedOption } = useModalize();
  const { ref: complainOptionRef, open: openComplainOption, close: closeComplainOption } = useModalize();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const modalOptionButtonHeight = 45;
  const feedDetailHeaderHeight = 54;
  const feedDetailInfoHeight = 36;
  const feedDetailContentHeight = 40;
  const itemSeparatorGap = 30;
  const itemLength = SCREEN_WIDTH + feedDetailHeaderHeight + feedDetailInfoHeight + feedDetailContentHeight + itemSeparatorGap;
  const [selectFeedId, setSelectFeedId] = useState<number>(-1);
  const [selectFeedData, setSelectFeedData] = useState<Feed>();

  const complainMutation = useMutation(FeedApi.reportFeed, {
    onSuccess: (res) => {
      if (res.status === 200) {
        toast.show(`신고 요청이 완료 되었습니다.`, {
          type: "success",
        });
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
        console.log(res);
        toast.show(`게시글이 삭제되었습니다.`, {
          type: "success",
        });
        DeviceEventEmitter.emit("ClubFeedRefetch");
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
  const goToComplain = () => {
    closeOtherFeedOption();
    openComplainOption();
  };
  const goToFeedComments = (feedIndex: number, feedId: number) => {
    navigate("FeedStack", { screen: "FeedComments", feedIndex, feedId });
  };
  const openFeedOption = (userId: number, feedId: number, feedData: Feed) => {
    setSelectFeedId(feedId);
    setSelectFeedData(feedData);
    if (userId === me?.id) openMyFeedOption();
    else openOtherFeedOption();
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

  const goToUpdateFeed = () => {
    closeMyFeedOption();
    navigate("HomeStack", { screen: "ModifiyFeed", feedData: selectFeedData });
  };

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

  useLayoutEffect(() => {
    setOptions({
      headerTitle: () => (
        <HeaderTitleView>
          <HeaderClubName>{clubData.name}</HeaderClubName>
          <HeaderText>게시글</HeaderText>
        </HeaderTitleView>
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
      <StatusBar barStyle={"dark-content"} />
      <FlatList
        // refreshing={refreshing}
        // onRefresh={onRefresh}
        // onEndReached={loadMore}
        data={feedData}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListFooterComponent={ListFooterComponent}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        initialScrollIndex={targetIndex}
        removeClippedSubviews={true}
      />

      <FeedOptionModal modalRef={myFeedOptionRef} buttonHeight={modalOptionButtonHeight} isMyFeed={true} goToUpdateFeed={goToUpdateFeed} deleteFeed={deleteFeed} goToComplain={goToComplain} />
      <FeedOptionModal modalRef={otherFeedOptionRef} buttonHeight={modalOptionButtonHeight} isMyFeed={false} goToUpdateFeed={goToUpdateFeed} deleteFeed={deleteFeed} goToComplain={goToComplain} />
      <FeedReportModal modalRef={complainOptionRef} buttonHeight={modalOptionButtonHeight} complainSubmit={complainSubmit} />
    </Container>
  );
};

export default ClubFeedDetail;
