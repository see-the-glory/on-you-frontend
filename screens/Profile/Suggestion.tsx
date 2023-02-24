import React, { useLayoutEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity } from "react-native";
import CustomText from "../../components/CustomText";
import styled from "styled-components/native";
import CustomTextInput from "../../components/CustomTextInput";
import { useMutation } from "react-query";
import { SuggestionSubmitRequest, UserApi } from "../../api";
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
  font-family: "NotoSansKR-Medium";
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

const Suggestion = ({ navigation: { navigate, goBack, setOptions } }) => {
  const [content, setContent] = useState<string>("");
  const token = useSelector((state: RootState) => state.auth.token);
  const me = useSelector((state: RootState) => state.auth.user);
  const toast = useToast();

  const suggestionMutation = useMutation(UserApi.submitSuggestion, {
    onSuccess: (res) => {
      if (res.status === 200 && res.resultCode === "OK") {
        toast.show(`건의사항이 제출되었습니다.`, {
          type: "success",
        });
        goBack();
      } else {
        console.log(`submitSuggestion mutation success but please check status code`);
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
    const requestData: SuggestionSubmitRequest = {
      token,
      data: {
        content,
      },
    };
    suggestionMutation.mutate(requestData);
  };

  useLayoutEffect(() => {
    setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={save}>
          <CustomText style={{ color: "#2995FA", fontSize: 14, lineHeight: 20 }}>제출</CustomText>
        </TouchableOpacity>
      ),
    });
  }, [content]);

  return (
    <Container>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={10} style={{ flex: 1 }}>
        <MainView>
          <Header>
            <HeaderTitle>{`On You 앱을 사용하시면서\n개선점이나 격려의 말을 전하고 싶으신가요?`}</HeaderTitle>
            <HeaderText>{`개발자에게 의견이 전송됩니다.`}</HeaderText>
          </Header>
          <MemoTextInput
            placeholder="온유의 유저니까 온유한 마음으로 적어주기"
            placeholderTextColor="#B0B0B0"
            textAlign="left"
            multiline={true}
            maxLength={1000}
            textAlignVertical="top"
            onChangeText={(text: string) => setContent(text)}
            onEndEditing={() => setContent((prev) => prev.trim())}
            includeFontPadding={false}
          />
        </MainView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default Suggestion;
