import React, { useCallback, useLayoutEffect, useState } from "react";
import { Alert, DeviceEventEmitter, FlatList, StatusBar, useWindowDimensions, View } from "react-native";
import { Modalize, useModalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { useToast } from "react-native-toast-notifications";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { Feed, FeedApi, FeedDeleteRequest, FeedReportRequest } from "../../api";
import CustomText from "../../components/CustomText";
import FeedDetail from "../../components/FeedDetail";
import { ClubFeedDetailScreenProps } from "../../Types/Club";

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

const ModalContainer = styled.View`
  flex: 1;
  padding: 35px 0px 20px 0px;
`;

const ModalHeader = styled.View<{ padding: number }>`
  padding: 0px ${(props: any) => (props.padding ? props.padding : 0)}px;
  margin-bottom: 15px;
`;
const ModalHeaderTitle = styled(CustomText)`
  font-size: 20px;
  font-family: "NotoSansKR-Bold";
  line-height: 28px;
`;
const ModalHeaderText = styled(CustomText)`
  color: #a0a0a0;
`;

const OptionButton = styled.TouchableOpacity<{ height: number; padding: number; alignItems: string }>`
  height: ${(props: any) => props.height}px;
  justify-content: center;
  align-items: ${(props: any) => (props.alignItems ? props.alignItems : "center")};
  padding: 0px ${(props: any) => (props.padding ? props.padding : 0)}px;
`;
const OptionName = styled(CustomText)<{ warning: boolean }>`
  font-size: 16px;
  color: ${(props: any) => (props.warning ? "#FF551F" : "#2b2b2b")};
`;
const Break = styled.View<{ sep: number }>`
  width: 100%;
  margin-bottom: ${(props: any) => props.sep}px;
  margin-top: ${(props: any) => props.sep}px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.2);
  opacity: 0.5;
`;

const ClubFeedDetail: React.FC<ClubFeedDetailScreenProps> = ({
  navigation: { setOptions, navigate },
  route: {
    params: { clubData, feedData, targetIndex },
  },
}) => {
  const token = useSelector((state: any) => state.AuthReducers.authToken);
  const me = useSelector((state: any) => state.UserReducers.user);
  const toast = useToast();
  const { ref: myFeedOptionRef, open: openMyFeedOption, close: closeMyFeedOption } = useModalize();
  const { ref: otherFeedOptionRef, open: openOtherFeedOption, close: closeOtherFeedOption } = useModalize();
  const { ref: complainOptionRef, open: openComplainOption, close: closeComplainOption } = useModalize();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const feedDetailHeaderHeight = 50;
  const feedDetailInfoHeight = 36;
  const feedDetailContentHeight = 40;
  const itemSeparatorGap = 30;
  const itemLength = SCREEN_WIDTH + feedDetailHeaderHeight + feedDetailInfoHeight + feedDetailContentHeight + itemSeparatorGap;
  const [selectFeedId, setSelectFeedId] = useState<number>(-1);

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
  const deleteFeedMutation = useMutation(FeedApi.feedDelete, {
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
  const goToFeedComments = (feedId: number) => {
    return navigate("FeedStack", { screen: "FeedComments", feedId });
  };
  const openFeedOption = (userId: number, feedId: number) => {
    setSelectFeedId(feedId);
    if (userId === me?.id) openMyFeedOption();
    else openOtherFeedOption();
  };

  const deleteFeed = () => {
    if (selectFeedId === -1) {
      return toast.show("게시글 정보가 잘못되었습니다.", {
        type: "warning",
      });
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

  const myFeedOptionList = [
    { name: "수정", warning: false, onPress: goToUpdateFeed },
    { name: "삭제", warning: true, onPress: deleteFeed },
  ];
  const otherFeedOptionList = [{ name: "신고", warning: false, onPress: goToComplain }];
  const complainOptionList = [
    { name: "스팸" },
    { name: "나체 이미지 또는 성적 이미지" },
    { name: "사기 또는 거짓" },
    { name: "혐오 발언 또는 혐오 이미지" },
    { name: "폭력, 괴롭힘" },
    { name: "불법 또는 규제 상품 판매" },
    { name: "자살 또는 자해" },
    { name: "기타" },
  ];
  const optionButtonHeight = 45;
  const complainOptionSheetHeight = optionButtonHeight * complainOptionList.length + 145;
  const myFeedOptionSheetHeight = optionButtonHeight * myFeedOptionList.length + 60;
  const otherFeedOptionSheetHeight = optionButtonHeight * otherFeedOptionList.length + 60;

  const complainSubmit = () => {
    if (selectFeedId === -1) {
      return toast.show("게시글 정보가 잘못되었습니다.", {
        type: "warning",
      });
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
        key={String(item.id)}
        feedData={item}
        feedSize={SCREEN_WIDTH}
        headerHeight={feedDetailHeaderHeight}
        infoHeight={feedDetailInfoHeight}
        contentHeight={feedDetailContentHeight}
        isMine={item.userId === me?.id}
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

      <Portal>
        <Modalize
          ref={myFeedOptionRef}
          modalHeight={myFeedOptionSheetHeight}
          handlePosition="inside"
          handleStyle={{ top: 14, height: 3, width: 35 }}
          modalStyle={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        >
          <ModalContainer style={{ flex: 1 }}>
            {myFeedOptionList.map((option, index) => (
              <View key={`myFeedOption_${index}`}>
                {index > 0 ? <Break sep={1} /> : <></>}
                <OptionButton onPress={option.onPress} height={optionButtonHeight}>
                  <OptionName warning={option.warning}>{option.name}</OptionName>
                </OptionButton>
              </View>
            ))}
          </ModalContainer>
        </Modalize>
      </Portal>

      <Portal>
        <Modalize
          ref={otherFeedOptionRef}
          modalHeight={otherFeedOptionSheetHeight}
          handlePosition="inside"
          handleStyle={{ top: 14, height: 3, width: 35 }}
          modalStyle={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        >
          <ModalContainer style={{ flex: 1 }}>
            {otherFeedOptionList.map((option, index) => (
              <View key={`otherFeedOption_${index}`}>
                {index > 0 ? <Break sep={1} /> : <></>}
                <OptionButton onPress={option.onPress} height={optionButtonHeight}>
                  <OptionName warning={option.warning}>{option.name}</OptionName>
                </OptionButton>
              </View>
            ))}
          </ModalContainer>
        </Modalize>
      </Portal>

      <Portal>
        <Modalize
          ref={complainOptionRef}
          modalHeight={complainOptionSheetHeight}
          handlePosition="inside"
          handleStyle={{ top: 14, height: 3, width: 35 }}
          modalStyle={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        >
          <ModalContainer style={{ flex: 1 }}>
            <ModalHeader padding={20}>
              <ModalHeaderTitle>신고가 필요한 게시물인가요?</ModalHeaderTitle>
              <ModalHeaderText>신고유형을 선택해주세요. 관리자에게 신고 접수가 진행됩니다.</ModalHeaderText>
            </ModalHeader>
            {complainOptionList.map((option, index) => (
              <View key={`complainOption_${index}`}>
                {index > 0 ? <Break sep={1} /> : <></>}
                <OptionButton onPress={complainSubmit} height={optionButtonHeight} padding={20} alignItems={"flex-start"}>
                  <OptionName>{option.name}</OptionName>
                </OptionButton>
              </View>
            ))}
          </ModalContainer>
        </Modalize>
      </Portal>
    </Container>
  );
};

export default ClubFeedDetail;
