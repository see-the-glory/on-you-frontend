import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { useLayoutEffect } from "react";
import { ActivityIndicator, Alert, DeviceEventEmitter, StatusBar, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import CustomText from "@components/atoms/CustomText";
import { BaseResponse, ClubApi, ClubRejectRequest, ErrorResponse } from "api";
import { useMutation } from "react-query";
import { useToast } from "react-native-toast-notifications";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ClubStackParamList } from "@navigation/ClubStack";

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

const HeaderText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 16px;
  line-height: 21px;
`;
const HeaderBoldText = styled(HeaderText)`
  font-family: ${(props: any) => props.theme.koreanFontB};
`;

const MemoInfo = styled.View`
  align-items: flex-end;
  justify-content: center;
  padding: 5px 0px;
`;

const InfoText = styled.Text`
  font-size: 12px;
  color: #b5b5b5;
`;

const MemoTextInput = styled.TextInput`
  font-family: ${(props: any) => props.theme.koreanFontR};
  width: 100%;
  height: 300px;
  background-color: #f3f3f3;
  font-size: 16px;
  line-height: 23px;
  padding: 10px;
`;

const ClubJoinReject: React.FC<NativeStackScreenProps<ClubStackParamList, "ClubJoinReject">> = ({
  route: {
    params: { clubId, actionId, actionerId, actionerName },
  },
  navigation: { navigate, goBack, setOptions },
}) => {
  const toast = useToast();
  const [message, setMessage] = useState<string>("");
  const maxLength = 1000;

  const eventEmit = () => {
    DeviceEventEmitter.emit("ClubNotificationRefresh");
    DeviceEventEmitter.emit("UserNotificationRefresh");
    DeviceEventEmitter.emit("ClubApplicationProcessDone");
  };

  const rejectMutation = useMutation<BaseResponse, ErrorResponse, ClubRejectRequest>(ClubApi.rejectToClubJoin, {
    onSuccess: (res) => {
      toast.show(`가입신청 거절 메시지를 보냈습니다.`, { type: "success" });
      eventEmit();
      goBack();
    },
    onError: (error) => {
      console.log(`API ERROR | rejectToClubJoin ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const save = () => {
    if (message.trim() === "") return toast.show(`내용이 비어있습니다.`, { type: "danger" });
    if (!actionerId) return toast.show(`잘못된 접근입니다.`, { type: "warning" });
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
      <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
      <MainView>
        <Header>
          <HeaderBoldText>{actionerName}</HeaderBoldText>
          <HeaderText>{`님에게 거절 사유를 전해주세요.`}</HeaderText>
        </Header>
        <MemoInfo>
          <InfoText>{`${message.length} / ${maxLength} 자`}</InfoText>
        </MemoInfo>
        <MemoTextInput
          placeholder="가입 거절 사유를 입력해주세요."
          placeholderTextColor="#B0B0B0"
          textAlign="left"
          multiline={true}
          maxLength={maxLength}
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
