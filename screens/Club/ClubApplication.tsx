import React, { useEffect, useState } from "react";
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
import LinkedText from "../../components/LinkedText";

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

const HeaderText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 16px;
  line-height: 21px;
`;
const HeaderBoldText = styled(HeaderText)`
  font-family: ${(props: any) => props.theme.koreanFontB};
`;
const Content = styled.View``;
const MessageView = styled.ScrollView`
  height: 250px;
  border: 1px solid #dcdcdc;
`;

const CreatedTimeView = styled.View`
  justify-content: center;
  align-items: flex-end;
  padding: 5px 0px;
`;
const CreatedTimeText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 12px;
  color: #8e8e8e;
`;
const ContentText = styled(LinkedText)`
  font-family: ${(props: any) => props.theme.koreanFontR};
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
  background-color: ${(props: any) => props.theme.primaryColor};
  justify-content: center;
  align-items: center;
`;
const ButtonText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontSB};
  font-size: 20px;
  line-height: 23px;
  color: white;
`;

const ClubApplication = ({
  route: {
    params: { clubData, actionId, actionerName, actionerId, message, createdTime, processDone },
  },
  navigation: { navigate, goBack, setOptions },
}) => {
  const toast = useToast();
  const [showButton, setShowButton] = useState<boolean>(!processDone);

  const refetchEmit = () => {
    DeviceEventEmitter.emit("ClubNotificationRefresh");
    DeviceEventEmitter.emit("UserNotificationRefresh");
  };

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

  useEffect(() => {
    let processDoneChangeSubs = DeviceEventEmitter.addListener("ClubApplicationProcessDone", () => {
      console.log("ClubApplication - Process Done Event");
      setShowButton(false);
    });
    return () => {
      processDoneChangeSubs.remove();
    };
  }, []);

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
    const clubJoinRejectProps = {
      clubId: clubData?.id,
      actionId,
      actionerName,
      actionerId,
    };
    navigate("ClubJoinReject", clubJoinRejectProps);
  };

  const approve = () => {
    Alert.alert("가입 승인", "정말로 가입을 승인하시겠습니까?", [
      { text: "아니요", onPress: () => {} },
      {
        text: "예",
        onPress: () => {
          let data: ClubApproveRequest = {
            clubId: clubData?.id,
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
      <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
      <Header style={{ paddingHorizontal: SCREEN_PADDING_SIZE }}>
        <HeaderBoldText>{actionerName}</HeaderBoldText>
        <HeaderText>{`님이 `}</HeaderText>
        <HeaderBoldText>{clubData.name}</HeaderBoldText>
        <HeaderText>{` 가입을 희망합니다.`}</HeaderText>
      </Header>
      <Content style={{ paddingHorizontal: SCREEN_PADDING_SIZE }}>
        <MessageView>
          <ContentText>{message}</ContentText>
        </MessageView>
        <CreatedTimeView>
          <CreatedTimeText>{moment(createdTime).tz("Asia/Seoul").format("YYYY-MM-DD  A h시 mm분")}</CreatedTimeText>
        </CreatedTimeView>
      </Content>
      {showButton ? (
        <Footer>
          <RejectButton onPress={reject} disabled={approveMutation.isLoading}>
            <ButtonText>거절</ButtonText>
          </RejectButton>
          <AcceptButton onPress={approve} disabled={approveMutation.isLoading}>
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
