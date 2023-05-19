import React, { useState, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import { TouchableOpacity, StatusBar } from "react-native";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useMutation } from "react-query";
import { useToast } from "react-native-toast-notifications";
import { UserApi, BaseResponse, ErrorResponse, PasswordChangeRequest } from "../../../api";
import { AntDesign, Entypo } from "@expo/vector-icons";
import BottomButton from "../../../components/BottomButton";
import { lightTheme } from "../../../theme";

const Container = styled.View`
  flex: 1;
  padding: 20px 20px;
  background-color: white;
`;

const Item = styled.View`
  margin-bottom: 30px;
`;

const ItemText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontSB};
  font-size: 16px;
  color: ${(props: any) => props.theme.infoColor};
  margin-bottom: 10px;
`;

const Input = styled.TextInput<{ error: boolean }>`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => (props.error ? props.theme.accentColor : "#b3b3b3")};
`;

const ErrorText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  color: ${(props: any) => props.theme.accentColor};
  font-size: 12px;
  line-height: 14px;
`;

const ValidationView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-top: 7px;
`;
const ValidationItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 8px;
`;

const ValidationText = styled.Text`
  font-family: ${(props: any) => props.theme.englishFontL};
  color: #8e8e8e;
  font-size: 10px;
  line-height: 14px;
`;

const ChangePassword: React.FC<NativeStackScreenProps<any, "ChangePassword">> = ({ navigation: { navigate, setOptions, goBack } }) => {
  const toast = useToast();
  const [password, setPassword] = useState<string>("");
  const [checkPassword, setCheckPassword] = useState<string>("");

  const numReg = /[0-9]+/;
  const engReg = /[a-zA-Z]+/;
  const specialReg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]+/;

  const mutation = useMutation<BaseResponse, ErrorResponse, PasswordChangeRequest>(UserApi.changePassword, {
    onSuccess: (res) => {
      toast.show(`비밀번호 변경이 완료되었습니다.`, { type: "success" });
      navigate("Tabs", { screen: "Profile" });
    },
    onError: (error) => {
      console.log(`API ERROR | getClubs ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  useEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);

  const onSubmit = () => {
    if (password.length < 8) return toast.show(`변경불가: 8자리 이상이어야 합니다.`, { type: "danger" });
    if (!numReg.test(password)) return toast.show(`변경불가: 숫자가 포함되어야 합니다.`, { type: "danger" });
    if (!engReg.test(password)) return toast.show(`변경불가: 영문이 포함되어야 합니다.`, { type: "danger" });
    if (!specialReg.test(password)) return toast.show(`변경불가: 특문이 포함되어야 합니다.`, { type: "danger" });
    if (password !== checkPassword) return toast.show(`변경불가: 비밀번호가 서로 다릅니다.`, { type: "danger" });
    const requestData: PasswordChangeRequest = { password };
    mutation.mutate(requestData);
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
          <Item>
            <ItemText>{`비밀번호 재설정`}</ItemText>
            <Input
              placeholder="영문, 숫자, 특수문자 포함 8자 이상"
              placeholderTextColor={"#B0B0B0"}
              secureTextEntry={true}
              autoCorrect={false}
              onChangeText={(value: string) => setPassword(value)}
              includeFontPadding={false}
            />

            <ValidationView>
              <ValidationItem>
                <AntDesign name="check" size={12} color={engReg.test(password) ? lightTheme.primaryColor : "#8e8e8e"} />
                <ValidationText>{` 영문 포함`}</ValidationText>
              </ValidationItem>
              <ValidationItem>
                <AntDesign name="check" size={12} color={numReg.test(password) ? lightTheme.primaryColor : "#8e8e8e"} />
                <ValidationText>{` 숫자 포함`}</ValidationText>
              </ValidationItem>
              <ValidationItem>
                <AntDesign name="check" size={12} color={specialReg.test(password) ? lightTheme.primaryColor : "#8e8e8e"} />
                <ValidationText>{` 특수문자 포함`}</ValidationText>
              </ValidationItem>
              <ValidationItem>
                <AntDesign name="check" size={12} color={password.length > 7 ? lightTheme.primaryColor : "#8e8e8e"} />
                <ValidationText>{` 8자리 이상`}</ValidationText>
              </ValidationItem>
            </ValidationView>
          </Item>
          <Item>
            <ItemText>{`비밀번호 재입력`}</ItemText>
            <Input
              placeholder="영문, 숫자, 특수문자 포함 8자 이상"
              placeholderTextColor={"#B0B0B0"}
              secureTextEntry={true}
              autoCorrect={false}
              onChangeText={(value: string) => setCheckPassword(value)}
              includeFontPadding={false}
              error={password !== checkPassword && password !== "" && checkPassword !== ""}
            />
            {password !== checkPassword && password !== "" && checkPassword !== "" ? (
              <ValidationView>
                <AntDesign name="exclamationcircleo" size={12} color={lightTheme.accentColor} />
                <ErrorText>{` 입력을 다시 한번 확인해주세요.`}</ErrorText>
              </ValidationView>
            ) : (
              <></>
            )}
          </Item>
        </Container>
      </TouchableWithoutFeedback>
      <BottomButton
        title={"제출"}
        onPress={onSubmit}
        disabled={mutation.isLoading || !numReg.test(password) || !engReg.test(password) || !specialReg.test(password) || password !== checkPassword || password.length < 8}
      />
    </>
  );
};

export default ChangePassword;
