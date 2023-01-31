import React from "react";
import { Ionicons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import CustomText from "./CustomText";
import CircleIcon from "./CircleIcon";
import { Feed, FeedApi, FeedReportRequest } from "../api";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import Carousel from "./Carousel";
import { Portal } from "react-native-portalize";
import { Modalize, useModalize } from "react-native-modalize";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { useToast } from "react-native-toast-notifications";

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
const HeaderRightView = styled.View`
  height: 100%;
  justify-content: center;
`;
const HeaderText2 = styled(CustomText)`
  font-size: 18px;
  font-family: "NotoSansKR-Medium";
  color: #2b2b2b;
  line-height: 25px;
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
const InformationButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-right: 12px;
`;

const CountingNumber = styled(CustomText)`
  margin-left: 3px;
`;
const InformationRightView = styled.View``;
const CreatedTime = styled(CustomText)`
  color: #9a9a9a;
`;
const ContentTextView = styled.View<{ height: number }>`
  height: ${(props: any) => props.height}px;
`;
const ContentText = styled(CustomText)`
  font-size: 14px;
  color: #2b2b2b;
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

interface FeedDetailProps {
  feedData: Feed;
  feedSize: number;
  headerHeight: number;
  infoHeight: number;
  contentHeight: number;
  isMine: boolean;
}

const FeedDetail: React.FC<FeedDetailProps> = ({ feedData, feedSize, headerHeight, infoHeight, contentHeight, isMine }) => {
  const token = useSelector((state: any) => state.AuthReducers.authToken);
  const toast = useToast();
  const navigation = useNavigation();
  const { ref: feedOptionRef, open: openFeedOption, close: closeFeedOption } = useModalize();
  const { ref: complainOptionRef, open: openComplainOption, close: closeComplainOption } = useModalize();
  const complainMutation = useMutation(FeedApi.reportFeed);
  const goToComplain = () => {
    closeFeedOption();
    openComplainOption();
  };
  const goToFeedComments = () => {
    return navigation.navigate("FeedStack", { screen: "FeedComments", feedId: feedData.id });
  };

  const feedOptionList = isMine ? [{ name: "수정" }, { name: "삭제", warning: true }] : [{ name: "신고", onPress: goToComplain }];
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
  const feedOptionSheetHeight = optionButtonHeight * feedOptionList.length + 60;
  const complainOptionSheetHeight = optionButtonHeight * complainOptionList.length + 145;

  const complainSubmit = () => {
    const requestData: FeedReportRequest = {
      token,
      data: {
        id: feedData.id,
        reason: "SPAM",
      },
    };
    console.log(requestData);

    complainMutation.mutate(requestData, {
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
  };

  return (
    <>
      <Container>
        <HeaderView padding={20} height={headerHeight}>
          <HeaderLeftView>
            <CircleIcon uri={feedData.thumbnail} size={36} kerning={10} />
            <HeaderText2>{feedData.userName}</HeaderText2>
          </HeaderLeftView>
          <HeaderRightView>
            <TouchableOpacity onPress={() => openFeedOption()} style={{ paddingLeft: 10, paddingVertical: 5 }}>
              <Ionicons name="ellipsis-vertical" size={14} color="black" />
            </TouchableOpacity>
          </HeaderRightView>
        </HeaderView>
        <Carousel
          pages={feedData.imageUrls}
          pageWidth={feedSize}
          gap={0}
          offset={0}
          initialScrollIndex={0}
          keyExtractor={(item: string, index: number) => String(index)}
          showIndicator={true}
          renderItem={({ item, index }: { item: string; index: number }) => (
            <FastImage source={item ? { uri: item } : require("../assets/basic.jpg")} style={{ width: feedSize, height: feedSize }} resizeMode={FastImage.resizeMode.contain} />
          )}
          ListEmptyComponent={<FastImage source={require("../assets/basic.jpg")} style={{ width: feedSize, height: feedSize }} />}
        />
        <ContentView padding={20}>
          <InformationView height={infoHeight}>
            <InformationLeftView>
              <InformationButton>
                <Ionicons name="heart-outline" size={20} color="black" />
                <CountingNumber>{feedData.likesCount}</CountingNumber>
              </InformationButton>
              <InformationButton onPress={goToFeedComments}>
                <Ionicons name="md-chatbox-ellipses" size={20} color="black" />
                <CountingNumber>{feedData.commentCount}</CountingNumber>
              </InformationButton>
            </InformationLeftView>
            <InformationRightView>
              <CreatedTime>{moment(feedData.created, "YYYY-MM-DDThh:mm:ss").fromNow()}</CreatedTime>
            </InformationRightView>
          </InformationView>
          <ContentTextView height={contentHeight}>
            <ContentText>{feedData.content}</ContentText>
          </ContentTextView>
        </ContentView>
      </Container>
      <Portal>
        <Modalize
          ref={feedOptionRef}
          modalHeight={feedOptionSheetHeight}
          handlePosition="inside"
          handleStyle={{ top: 14, height: 3, width: 35 }}
          modalStyle={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        >
          <ModalContainer style={{ flex: 1 }}>
            {feedOptionList.map((option, index) => (
              <>
                {index > 0 ? <Break sep={1} /> : <></>}
                <OptionButton onPress={option.onPress} height={optionButtonHeight}>
                  <OptionName warning={option.warning}>{option.name}</OptionName>
                </OptionButton>
              </>
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
              <>
                {index > 0 ? <Break sep={1} /> : <></>}
                <OptionButton onPress={complainSubmit} height={optionButtonHeight} padding={20} alignItems={"flex-start"}>
                  <OptionName>{option.name}</OptionName>
                </OptionButton>
              </>
            ))}
          </ModalContainer>
        </Modalize>
      </Portal>
    </>
  );
};

export default FeedDetail;
