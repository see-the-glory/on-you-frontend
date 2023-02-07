import React, { useEffect } from "react";
import { Entypo } from "@expo/vector-icons";
import { useLayoutEffect } from "react";
import { Alert, DeviceEventEmitter, StatusBar, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import CustomText from "../../components/CustomText";
import { useSelector } from "react-redux";
import { ClubApi, ClubApproveRequest, ClubRejectRequest } from "../../api";
import { useMutation } from "react-query";
import { useToast } from "react-native-toast-notifications";
import { RootState } from "../../redux/store/reducers";

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
  font-size: 14px;
  line-height: 20px;
`;
const HeaderBoldText = styled(CustomText)`
  font-size: 14px;
  line-height: 20px;
  font-family: "NotoSansKR-Bold";
`;
const Content = styled.View``;
const MessageView = styled.ScrollView`
  height: 250px;
  border: 1px solid #dcdcdc;
`;
const ContentText = styled(CustomText)`
  margin: 5px 5px;
  color: #343434;
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
    params: { clubData, actionId, actionerName, actionerId, applyMessage },
  },
  navigation: { navigate, goBack, setOptions },
}) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const toast = useToast();
  const rejectMutation = useMutation(ClubApi.rejectToClubJoin, {
    onSuccess: (res) => {
      console.log(res);
      if (res.status === 200 && res.resultCode === "OK") {
        toast.show(`가입신청을 거절했습니다.`, {
          type: "warning",
        });
        goBack();
      } else {
        console.log(`rejectToClubJoin mutation success but please check status code`);
        console.log(`status: ${res.status}`);
        console.log(res);
        toast.show(`${res.message} (Error Code: ${res.status})`, {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      console.log("--- Error rejectToClubJoin ---");
      console.log(`error: ${error}`);
      toast.show(`Error Code: ${error}`, {
        type: "warning",
      });
    },
  });
  const approveMutation = useMutation(ClubApi.approveToClubJoin, {
    onSuccess: (res) => {
      console.log(res);
      if (res.status === 200 && res.resultCode === "OK") {
        toast.show(`가입신청을 수락했습니다.`, {
          type: "success",
        });
        goBack();
      } else {
        console.log(`approveToClubJoin mutation success but please check status code`);
        console.log(`status: ${res.status}`);
        console.log(res);
        toast.show(`${res.message} (Error Code: ${res.status})`, {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      console.log("--- Error approveToClubJoin ---");
      console.log(`error: ${error}`);
      toast.show(`Error Code: ${error}`, {
        type: "warning",
      });
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

    return () => {
      DeviceEventEmitter.emit("NotificationRefresh");
    };
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
            token,
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
            token,
          };
          approveMutation.mutate(data);
        },
      },
    ]);
  };

  return (
    <Container>
      <StatusBar barStyle={"dark-content"} />
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
      </Content>
      <Footer>
        <RejectButton onPress={reject}>
          <ButtonText>거절</ButtonText>
        </RejectButton>
        <AcceptButton onPress={approve}>
          <ButtonText>수락</ButtonText>
        </AcceptButton>
      </Footer>
    </Container>
  );
};

export default ClubApplication;
