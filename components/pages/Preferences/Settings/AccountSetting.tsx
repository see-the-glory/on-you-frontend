import React, { useEffect, useLayoutEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import { useSelector } from "react-redux";
import { useMutation } from "react-query";
import { Entypo, Feather } from "@expo/vector-icons";
import { useToast } from "react-native-toast-notifications";
import { RootState } from "../../../../redux/store/reducers";
import { BaseResponse, ErrorResponse, UserApi } from "../../../../api";
import { Alert, DeviceEventEmitter, TouchableOpacity } from "react-native";
import { logout } from "../../../../redux/slices/auth";
import { useAppDispatch } from "../../../../redux/store";
import { ProfileStackParamList } from "../../../../navigation/ProfileStack";

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: white;
`;

const MenuItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
`;

const MenuItemText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontM};
  color: #2e2e2e;
  font-size: 16px;
  line-height: 22px;
`;

const TouchMenu = styled.View`
  height: 50px;
  border-bottom-width: 0.5px;
  border-bottom-color: #dbdbdb;
  justify-content: center;
`;

const ChevronBox = styled.View`
  flex: 1;
  align-items: flex-end;
`;

interface AccountItem {
  title: string;
  onPress?: () => void;
}

const AccountSetting: React.FC<NativeStackScreenProps<ProfileStackParamList, "AccountSetting">> = ({ navigation: { navigate, goBack, setOptions } }) => {
  const toast = useToast();
  const fcmToken = useSelector((state: RootState) => state.auth.fcmToken);
  const dispatch = useAppDispatch();

  const withdrawMutation = useMutation<BaseResponse, ErrorResponse>(UserApi.withdrawAccount, {
    onSuccess: (res) => {
      toast.show("회원탈퇴 되었습니다.", { type: "success" });
      DeviceEventEmitter.emit("Logout", { fcmToken, isWitdrawUser: true });
      dispatch(logout());
    },
    onError: (error) => {
      console.log(`API ERROR | withdrawAccount ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);

  const goToScreen = (screen: string) => {
    navigate("ProfileStack", { screen });
  };

  const withdrawUser = () => {
    Alert.alert(
      "탈퇴",
      "탈퇴 후 계정 복구는 불가합니다.\n정말로 탈퇴하시겠습니까?",
      [
        {
          text: "네",
          onPress: () => {
            withdrawMutation.mutate();
          },
          style: "cancel",
        },
        { text: "아니요" },
      ],
      { cancelable: false }
    );
  };

  const items: AccountItem[] = [
    {
      title: "비밀번호 변경",
      onPress: () => goToScreen("ChangePassword"),
    },
    {
      title: "차단 계정 관리",
      onPress: () => goToScreen("BlockUserList"),
    },
    {
      title: "탈퇴",
      onPress: withdrawUser,
    },
  ];

  return (
    <Container>
      {items.map((item, index) => (
        <TouchMenu key={index}>
          <MenuItem onPress={item.onPress}>
            <MenuItemText>{item.title}</MenuItemText>
            <ChevronBox>
              <Entypo name="chevron-thin-right" size={20} color="#CFCFCF" />
            </ChevronBox>
          </MenuItem>
        </TouchMenu>
      ))}
    </Container>
  );
};

export default AccountSetting;
