import React, { useLayoutEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity } from "react-native";
import CustomText from "../../../components/CustomText";
import styled from "styled-components/native";
import { useMutation } from "react-query";
import { BaseResponse, ErrorResponse, SuggestionSubmitRequest, UserApi } from "../../../api";
import { useToast } from "react-native-toast-notifications";
import { Entypo } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: white;
`;
const MainView = styled.ScrollView`
  height: 100%;
  padding: 0px 20px;
`;

const Header = styled.View`
  width: 100%;
  padding: 10px 0px;
`;

const MemoInfo = styled.View`
  align-items: flex-end;
  justify-content: center;
`;

const InfoText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 12px;
  color: #b5b5b5;
  margin-bottom: 10px;
`;

const HeaderTitle = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontM};
  font-size: 16px;
  line-height: 21px;
`;

const HeaderText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 12px;
  color: #b5b5b5;
  margin: 5px 0px;
`;

const MemoTextInput = styled.TextInput`
  font-family: ${(props: any) => props.theme.koreanFontR};
  width: 100%;
  height: 300px;
  background-color: #f3f3f3;
  font-size: 15px;
  padding: 10px;
`;

const Suggestion: React.FC<NativeStackScreenProps<any, "Suggestion">> = ({ navigation: { navigate, goBack, setOptions } }) => {
  const [content, setContent] = useState<string>("");
  const maxLength = 1000;
  const toast = useToast();

  const suggestionMutation = useMutation<BaseResponse, ErrorResponse, SuggestionSubmitRequest>(UserApi.submitSuggestion, {
    onSuccess: (res) => {
      toast.show(`건의사항이 제출되었습니다.`, { type: "success" });
      navigate("SuggestionSuccess", { content: content.trim() });
    },
    onError: (error) => {
      console.log(`API ERROR | submitSuggestion ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const save = () => {
    if (content.trim() === "") return toast.show(`내용이 비어있습니다.`, { type: "danger" });
    if (content.trim().length > maxLength) return toast.show(`내용이 너무 길어요.`, { type: "danger" });
    const requestData: SuggestionSubmitRequest = {
      content: content.trim(),
    };
    suggestionMutation.mutate(requestData);
  };

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () =>
        suggestionMutation.isLoading ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity onPress={save} disabled={content.trim() === ""}>
            <CustomText style={{ color: "#2995FA", fontSize: 14, lineHeight: 20, opacity: content.trim() === "" ? 0.3 : 1 }}>제출</CustomText>
          </TouchableOpacity>
        ),
    });
  }, [content, suggestionMutation.isLoading]);

  return (
    <Container>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={10} style={{ flex: 1 }}>
        <MainView>
          <Header>
            <HeaderTitle>{`On You 앱을 사용하시면서\n개선점이나 격려의 말을 전하고 싶으신가요?`}</HeaderTitle>
            <HeaderText>{`개발자에게 의견이 전송됩니다.`}</HeaderText>
          </Header>
          <MemoInfo>
            <InfoText>{`${content.length} / ${maxLength} 자`}</InfoText>
          </MemoInfo>
          <MemoTextInput
            placeholder="온유의 유저니까 온유한 마음으로 적어주기"
            placeholderTextColor="#B0B0B0"
            textAlign="left"
            multiline={true}
            maxLength={maxLength}
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
