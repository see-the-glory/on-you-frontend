import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Alert, DeviceEventEmitter, StatusBar, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useModalize } from "react-native-modalize";
import { useToast } from "react-native-toast-notifications";
import { useMutation, useQuery } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { BaseResponse, Club, ErrorResponse, Feed, FeedApi, FeedDeletionRequest, FeedLikeRequest, FeedReportRequest, FeedResponse, UserApi, UserBlockRequest } from "../../api";
import FeedDetail from "../../components/FeedDetail";
import FeedReportModal from "../Feed/FeedReportModal";
import FeedOptionModal from "../Feed/FeedOptionModal";
import { RootState } from "../../redux/store/reducers";
import { Entypo } from "@expo/vector-icons";
import RNFetchBlob from "rn-fetch-blob";

const Loader = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Container = styled.ScrollView``;

const FeedSelection = ({
  navigation: { setOptions, navigate, goBack },
  route: {
    params: { selectFeedId },
  },
}) => {
  const me = useSelector((state: RootState) => state.auth.user);
  const toast = useToast();
  const { ref: myFeedOptionRef, open: openMyFeedOption, close: closeMyFeedOption } = useModalize();
  const { ref: otherFeedOptionRef, open: openOtherFeedOption, close: closeOtherFeedOption } = useModalize();
  const { ref: complainOptionRef, open: openComplainOption, close: closeComplainOption } = useModalize();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const [feedData, setFeedData] = useState<Feed>();
  const modalOptionButtonHeight = 45;
  const feedDetailHeaderHeight = 62;
  const feedDetailInfoHeight = 42;
  const feedDetailContentHeight = 40;
  const itemSeparatorGap = 20;

  const { refetch: feedRefetch } = useQuery<FeedResponse, ErrorResponse>(["getFeed", selectFeedId], FeedApi.getFeed, {
    onSuccess: (res) => {
      setFeedData(res?.data);
    },
    onError: (error) => {
      console.log(`API ERROR | getFeed ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

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

  const goToClub = (clubId?: number) => {
    if (clubId) navigate("ClubStack", { screen: "ClubTopTabs", params: { clubData: { id: clubId } } });
  };

  const goToComplain = () => {
    closeOtherFeedOption();
    openComplainOption();
  };

  const goToFeedComments = (feedIndex?: number, feedId?: number) => {
    navigate("FeedStack", { screen: "FeedComments", params: { feedIndex, feedId: feedId ?? selectFeedId, clubId: feedData?.clubId } });
  };

  const goToUpdateFeed = () => {
    closeMyFeedOption();
    navigate("FeedStack", { screen: "FeedModification", params: { feedData } });
  };

  const openFeedOption = (feedData?: Feed) => {
    if (!feedData) return;
    if (feedData?.userId === me?.id) openMyFeedOption();
    else openOtherFeedOption();
  };

  const deleteFeed = () => {
    if (!feedData) {
      toast.show("게시글 정보가 잘못되었습니다.", { type: "warning" });
      return;
    }

    const requestData: FeedDeletionRequest = { feedId: selectFeedId };

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
    const requestData: FeedLikeRequest = { feedId: selectFeedId };
    likeFeedMutation.mutate(requestData, {
      onSuccess: (res) => {
        setFeedData((prev) => {
          if (!prev) return;
          if (prev.likeYn) prev.likesCount--;
          else prev.likesCount++;
          prev.likeYn = !prev?.likeYn;
          return prev;
        });
      },
      onError: (error) => {
        console.log(`API ERROR | likeFeed ${error.code} ${error.status}`);
        toast.show(`${error.message ?? error.code}`, { type: "warning" });
      },
    });
  }, []);

  const blockUser = () => {
    if (!feedData) {
      toast.show("게시글 정보가 잘못되었습니다.", { type: "warning" });
      return;
    }

    const requestData: UserBlockRequest = { userId: feedData?.userId };

    Alert.alert(
      `${feedData?.userName}님을 차단하시곘어요?`,
      `${feedData?.userName}님의 게시글을 볼 수 없게 됩니다. 상대방에게는 회원님이 차단했다는 정보를 알리지 않습니다.`,
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
          feedData?.imageUrls?.map((url) => {
            let fileName = url.split("/").pop();
            RNFetchBlob.config({
              addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: `${RNFetchBlob.fs.dirs.DCIMDir}/${fileName}`,
              },
            }).fetch("GET", url);
          });
          closeOtherFeedOption();
        },
      },
    ]);
  };

  const complainSubmit = (reason: string) => {
    if (!feedData) {
      toast.show("게시글 정보가 잘못되었습니다.", { type: "warning" });
      return;
    }
    const requestData: FeedReportRequest = {
      feedId: selectFeedId,
      data: { reason },
    };
    complainMutation.mutate(requestData);
    closeComplainOption();
  };

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black"></Entypo>
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    let feedRefetchSubscription = DeviceEventEmitter.addListener("SelectFeedRefetch", () => {
      console.log("Feed Selection - Feed Refetch Event");
      feedRefetch();
    });
    return () => {
      feedRefetchSubscription.remove();
    };
  }, []);

  return !feedData ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Container>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <FeedDetail
        feedData={feedData}
        feedSize={SCREEN_WIDTH}
        headerHeight={feedDetailHeaderHeight}
        infoHeight={feedDetailInfoHeight}
        contentHeight={feedDetailContentHeight}
        openFeedOption={openFeedOption}
        goToFeedComments={goToFeedComments}
        likeFeed={likeFeed}
        goToClub={goToClub}
        showClubName={true}
      />

      <FeedOptionModal
        modalRef={myFeedOptionRef}
        buttonHeight={modalOptionButtonHeight}
        isMyFeed={true}
        goToUpdateFeed={goToUpdateFeed}
        deleteFeed={deleteFeed}
        goToComplain={goToComplain}
        blockUser={blockUser}
        downloadImages={downloadImages}
      />
      <FeedOptionModal
        modalRef={otherFeedOptionRef}
        buttonHeight={modalOptionButtonHeight}
        isMyFeed={false}
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

export default FeedSelection;
