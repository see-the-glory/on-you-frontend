import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Alert, DeviceEventEmitter, StatusBar, TouchableOpacity, useWindowDimensions, Platform } from "react-native";
import { useModalize } from "react-native-modalize";
import { useToast } from "react-native-toast-notifications";
import { useMutation, useQuery } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { BaseResponse, ErrorResponse, Feed, FeedApi, FeedDeletionRequest, FeedLikeRequest, FeedReportRequest, FeedResponse, LikeUser, UserApi, UserBlockRequest } from "../../../api";
import FeedDetail from "../../organisms/FeedDetail";
import FeedReportModal from "./FeedReportModal";
import FeedOptionModal from "./FeedOptionModal";
import { RootState } from "../../../redux/store/reducers";
import { Entypo } from "@expo/vector-icons";
import RNFetchBlob from "rn-fetch-blob";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { useAppDispatch } from "../../../redux/store";
import feedSlice from "../../../redux/slices/feed";
import { FeedStackParamList } from "../../../navigation/FeedStack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const Loader = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Container = styled.ScrollView``;

const FeedSelection: React.FC<NativeStackScreenProps<FeedStackParamList, "FeedSelection">> = ({
  navigation: { setOptions, navigate, goBack },
  route: {
    params: { selectFeedId },
  },
}) => {
  const me = useSelector((state: RootState) => state.auth.user);
  const toast = useToast();
  const dispatch = useAppDispatch();
  const { ref: feedOptionRef, open: openFeedOption, close: closeFeedOption } = useModalize();
  const { ref: complainOptionRef, open: openComplainOption, close: closeComplainOption } = useModalize();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const [feedData, setFeedData] = useState<Feed>();
  const modalOptionButtonHeight = 45;
  const feedDetailHeaderHeight = 52;
  const feedDetailInfoHeight = 42;
  const feedDetailContentHeight = 40;

  const { refetch: feedRefetch } = useQuery<FeedResponse, ErrorResponse>(["getFeed", selectFeedId], FeedApi.getFeed, {
    onSuccess: (res) => {
      const data = { ...res?.data, id: selectFeedId };
      dispatch(feedSlice.actions.addFeed({ feedId: selectFeedId, feed: data }));
      setFeedData(data);
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
    navigate("FeedStack", { screen: "FeedModification", params: { feedData } });
  };

  const goToFeedOptionModal = (feedData?: Feed) => {
    if (!feedData) return;
    openFeedOption();
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
        // setFeedData((prev) => {
        //   if (!prev) return;
        //   if (prev.likeYn) prev.likesCount--;
        //   else prev.likesCount++;
        //   prev.likeYn = !prev?.likeYn;
        //   return prev;
        // });
      },
      onError: (error) => {
        console.log(`API ERROR | likeFeed ${error.code} ${error.status}`);
        toast.show(`${error.message ?? error.code}`, { type: "warning" });
      },
    });

    dispatch(feedSlice.actions.likeToggle({ feedId }));
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
      <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
      <FeedDetail
        feedData={feedData}
        feedSize={SCREEN_WIDTH}
        headerHeight={feedDetailHeaderHeight}
        infoHeight={feedDetailInfoHeight}
        contentHeight={feedDetailContentHeight}
        goToFeedOptionModal={goToFeedOptionModal}
        likeFeed={likeFeed}
        showClubName={true}
      />

      <FeedOptionModal
        modalRef={feedOptionRef}
        buttonHeight={modalOptionButtonHeight}
        isMyFeed={feedData.userId === me?.id}
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
