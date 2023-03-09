import React from "react";
import { Entypo } from "@expo/vector-icons";
import { useLayoutEffect } from "react";
import { Alert, DeviceEventEmitter, StatusBar, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import CustomText from "../../components/CustomText";
import { useSelector } from "react-redux";
import { BaseResponse, ClubApi, ClubApproveRequest, ClubRejectRequest, ErrorResponse } from "../../api";
import { useMutation } from "react-query";
import { useToast } from "react-native-toast-notifications";
import { RootState } from "../../redux/store/reducers";
import moment from "moment";

const SCREEN_PADDING_SIZE = 20;

const Container = styled.SafeAreaView`
  flex: 1;
`;
const Header = styled.View`
  height: 80px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const HeaderText = styled(CustomText)`
  font-size: 16px;
  line-height: 21px;
`;
const HeaderBoldText = styled(HeaderText)`
  font-family: "NotoSansKR-Bold";
`;
const Content = styled.View``;
const MessageView = styled.ScrollView`
  height: 250px;
  border: 1px solid #dcdcdc;
`;

const CreatedTimeView = styled.View`
  justify-content: center;
  align-items: flex-end;
`;
const CreatedTimeText = styled(CustomText)`
  color: #8e8e8e;
`;
const ContentText = styled(CustomText)`
  margin: 8px;
  color: #343434;
  font-size: 14px;
  line-height: 20px;
`;

const Footer = styled.View`
  flex-direction: row;
  position: absolute;
  bottom: 0px;
  height: 70px;
`;
const RejectButton = styled.TouchableOpacity`
  width: 50%;
  background-color: #b0b0b0;
  justify-content: center;
  align-items: center;
`;
const AcceptButton = styled.TouchableOpacity`
  width: 50%;
  background-color: #295af5;
  justify-content: center;
  align-items: center;
`;
const ButtonText = styled(CustomText)`
  font-family: "NotoSansKR-Medium";
  font-size: 20px;
  line-height: 26px;
  color: white;
`;

const ClubApplication = ({
  route: {
    params: { clubData, actionId, actionerName, actionerId, applyMessage, createdTime, processDone },
  },
  navigation: { navigate, goBack, setOptions },
}) => {
  const toast = useToast();

  const refetchEmit = () => {
    DeviceEventEmitter.emit("ClubRefetch");
    DeviceEventEmitter.emit("ClubNotificationRefresh");
    DeviceEventEmitter.emit("UserNotificationRefresh");
  };

  const rejectMutation = useMutation<BaseResponse, ErrorResponse, ClubRejectRequest>(ClubApi.rejectToClubJoin, {
    onSuccess: (res) => {
      toast.show(`가입신청을 거절했습니다.`, { type: "warning" });
      refetchEmit();
      goBack();
    },
    onError: (error) => {
      console.log(`API ERROR | rejectToClubJoin ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });
  const approveMutation = useMutation<BaseResponse, ErrorResponse, ClubApproveRequest>(ClubApi.approveToClubJoin, {
    onSuccess: (res) => {
      toast.show(`가입신청을 수락했습니다.`, { type: "success" });
      refetchEmit();
      goBack();
    },
    onError: (error) => {
      console.log(`API ERROR | approveMutation ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });
  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={goBack}>
          <Entypo name="chevron-thin-left" size={20} color="black"></Entypo>
        </TouchableOpacity>
      ),
    });
  }, []);

  const reject = () => {
    Alert.alert("가입 거절", "정말로 가입을 거절하시겠습니까?", [
      { text: "아니요", onPress: () => {} },
      {
        text: "예",
        onPress: () => {
          let data: ClubRejectRequest = {
            clubId: clubData.id,
            actionId: actionId,
            userId: actionerId,
          };
          rejectMutation.mutate(data);
        },
      },
    ]);
  };

  const approve = () => {
    Alert.alert("가입 승인", "정말로 가입을 승인하시겠습니까?", [
      { text: "아니요", onPress: () => {} },
      {
        text: "예",
        onPress: () => {
          let data: ClubApproveRequest = {
            clubId: clubData.id,
            actionId: actionId,
            userId: actionerId,
          };
          approveMutation.mutate(data);
        },
      },
    ]);
  };

  return (
    <Container>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <Header style={{ paddingHorizontal: SCREEN_PADDING_SIZE }}>
        <HeaderBoldText>{actionerName}</HeaderBoldText>
        <HeaderText>{`님이 `}</HeaderText>
        <HeaderBoldText>{clubData.name}</HeaderBoldText>
        <HeaderText>{` 가입을 희망합니다.`}</HeaderText>
      </Header>
      <Content style={{ paddingHorizontal: SCREEN_PADDING_SIZE }}>
        <MessageView>
          <ContentText>{applyMessage}</ContentText>
        </MessageView>
        <CreatedTimeView>
          <CreatedTimeText>{moment(createdTime).tz("Asia/Seoul").format("YYYY-MM-DD  A h시 mm분")}</CreatedTimeText>
        </CreatedTimeView>
      </Content>
      {processDone !== true ? (
        <Footer>
          <RejectButton onPress={reject} disabled={rejectMutation.isLoading || approveMutation.isLoading}>
            <ButtonText>거절</ButtonText>
          </RejectButton>
          <AcceptButton onPress={approve} disabled={rejectMutation.isLoading || approveMutation.isLoading}>
            <ButtonText>수락</ButtonText>
          </AcceptButton>
        </Footer>
      ) : (
        <></>
      )}
    </Container>
  );
};

export default ClubApplication;
