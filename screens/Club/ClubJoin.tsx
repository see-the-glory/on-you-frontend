import React, { useEffect, useLayoutEffect, useState } from "react";
import { DeviceEventEmitter, KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity } from "react-native";
import CustomText from "../../components/CustomText";
import styled from "styled-components/native";
import CustomTextInput from "../../components/CustomTextInput";
import { useMutation } from "react-query";
import { ClubApi, ClubApplyRequest } from "../../api";
import { useSelector } from "react-redux";
import { useToast } from "react-native-toast-notifications";
import { RootState } from "../../redux/store/reducers";

const Container = styled.SafeAreaView`
  flex: 1;
`;
const MainView = styled.ScrollView`
  height: 100%;
  padding: 0px 20px;
`;

const Header = styled.View`
  width: 100%;
  padding: 10px 0px;
`;

const HeaderTitle = styled(CustomText)`
  font-size: 16px;
  line-height: 21px;
`;

const HeaderText = styled(CustomText)`
  font-size: 12px;
  color: #b5b5b5;
  margin: 5px 0px;
`;

const MemoTextInput = styled(CustomTextInput)`
  width: 100%;
  height: 300px;
  background-color: #f3f3f3;
  font-size: 16px;
  line-height: 21px;
  padding: 10px;
`;

const ClubJoin = ({
  navigation: { navigate, goBack, setOptions },
  route: {
    params: { clubData },
  },
}) => {
  const [memo, setMemo] = useState<string>("");
  const token = useSelector((state: RootState) => state.auth.token);
  const toast = useToast();

  const clubApplyMutation = useMutation(ClubApi.applyClub, {
    onSuccess: (res) => {
      if (res.status === 200 && res.resultCode === "OK") {
        toast.show(`가입 신청이 완료되었습니다.`, {
          type: "success",
        });
        goBack();
      } else {
        console.log(`mutation success but please check status code`);
        console.log(`status: ${res.status}`);
        console.log(res);
        toast.show(`${res.message} (Error Code: ${res.status})`, {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      console.log("--- Error ---");
      console.log(`error: ${error}`);
      toast.show(`Error Code: ${error}`, {
        type: "warning",
      });
    },
  });

  const save = () => {
    const requestData: ClubApplyRequest = {
      clubId: clubData.id,
      memo,
      token,
    };

    clubApplyMutation.mutate(requestData);
  };

  useLayoutEffect(() => {
    console.log(`ClubJoin useLayoutEffect`);
    setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={save}>
          <CustomText style={{ color: "#2995FA", fontSize: 14, lineHeight: 20 }}>제출</CustomText>
        </TouchableOpacity>
      ),
    });
  }, [memo]);

  useEffect(() => {
    return () => {
      DeviceEventEmitter.emit("ClubRefetch");
    };
  }, []);

  return (
    <Container>
      <StatusBar barStyle={"dark-content"} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={10} style={{ flex: 1 }}>
        <MainView>
          <Header>
            <HeaderTitle>{`클럽의 가입 희망을 환영합니다!\n클럽 리더에게 신청자의 정보를 알려주세요.`}</HeaderTitle>
            <HeaderText>{`ex) 이름, 연락처, 교회명과 소속부서명, 함께하고 싶은 이유 등`}</HeaderText>
          </Header>
          <MemoTextInput
            placeholder="신청서를 작성해보세요."
            placeholderTextColor="#B0B0B0"
            textAlign="left"
            multiline={true}
            maxLength={100}
            textAlignVertical="top"
            onChangeText={(text: string) => setMemo(text)}
            onEndEditing={() => setMemo((prev) => prev.trim())}
            includeFontPadding={false}
          />
        </MainView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default ClubJoin;
