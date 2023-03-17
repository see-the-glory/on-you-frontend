import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { useLayoutEffect } from "react";
import { ActivityIndicator, Alert, DeviceEventEmitter, KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import CustomText from "../../components/CustomText";
import { useSelector } from "react-redux";
import { BaseResponse, ClubApi, ClubApproveRequest, ClubRejectRequest, ErrorResponse } from "../../api";
import { useMutation } from "react-query";
import { useToast } from "react-native-toast-notifications";
import { RootState } from "../../redux/store/reducers";
import moment from "moment";
import CustomTextInput from "../../components/CustomTextInput";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const MainView = styled.ScrollView`
  height: 100%;
  padding: 0px 20px;
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

const MemoTextInput = styled(CustomTextInput)`
  width: 100%;
  height: 300px;
  background-color: #f3f3f3;
  font-size: 16px;
  line-height: 23px;
  padding: 10px;
`;

const ClubJoinReject = ({
  route: {
    params: { clubId, actionId, actionerId, actionerName },
  },
  navigation: { navigate, goBack, setOptions, pop },
}) => {
  const toast = useToast();
  const [message, setMessage] = useState<string>("");

  const refetchEmit = () => {
    DeviceEventEmitter.emit("ClubNotificationRefresh");
    DeviceEventEmitter.emit("UserNotificationRefresh");
  };

  const rejectMutation = useMutation<BaseResponse, ErrorResponse, ClubRejectRequest>(ClubApi.rejectToClubJoin, {
    onSuccess: (res) => {
      toast.show(`가입신청 거절 메시지를 보냈습니다.`, { type: "success" });
      refetchEmit();
      pop(2);
    },
    onError: (error) => {
      console.log(`API ERROR | rejectToClubJoin ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const save = () => {
    if (message.trim() === "") return toast.show(`내용이 비어있습니다.`, { type: "danger" });
    const requestData: ClubRejectRequest = {
      clubId,
      actionId,
      userId: actionerId,
      message: message.trim(),
    };
    Alert.alert("가입 거절", "정말로 가입을 거절하시겠습니까?", [
      { text: "아니요", onPress: () => {} },
      {
        text: "예",
        onPress: () => {
          rejectMutation.mutate(requestData);
        },
      },
    ]);
  };

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={goBack}>
          <Entypo name="chevron-thin-left" size={20} color="black"></Entypo>
        </TouchableOpacity>
      ),
      headerRight: () =>
        rejectMutation.isLoading ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity onPress={save}>
            <CustomText style={{ color: "#2995FA", fontSize: 14, lineHeight: 20 }}>제출</CustomText>
          </TouchableOpacity>
        ),
    });
  }, [message, rejectMutation.isLoading]);

  return (
    <Container>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <MainView>
        <Header>
          <HeaderBoldText>{actionerName}</HeaderBoldText>
          <HeaderText>{`님에게 거절 사유를 전해주세요.`}</HeaderText>
        </Header>
        <MemoTextInput
          placeholder="가입 거절 사유를 입력해주세요."
          placeholderTextColor="#B0B0B0"
          textAlign="left"
          multiline={true}
          maxLength={255}
          textAlignVertical="top"
          onChangeText={(text: string) => setMessage(text)}
          onEndEditing={() => setMessage((prev) => prev.trim())}
          includeFontPadding={false}
        />
      </MainView>
    </Container>
  );
};

export default ClubJoinReject;
