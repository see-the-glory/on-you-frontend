import React, { useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import { useSelector } from "react-redux";
import { useMutation } from "react-query";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useToast } from "react-native-toast-notifications";
import CustomText from "../../components/CustomText";
import { RootState } from "../../redux/store/reducers";
import { AccountWithdrawRequest, UserApi } from "../../api";
import { Alert } from "react-native";
import { logout } from "../../redux/slices/auth";
import { useAppDispatch } from "../../redux/store";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const MenuItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
`;

const MenuItemText = styled(CustomText)`
  color: #2e2e2e;
  font-family: "NotoSansKR-Medium";
  font-size: 16px;
  line-height: 22px;
`;

const TouchMenu = styled.View`
  height: 50px;
  border-bottom-width: 1px;
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

const Account: React.FC<NativeStackScreenProps<any, "Profile">> = ({ navigation: { navigate } }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const toast = useToast();
  const dispatch = useAppDispatch();

  const mutation = useMutation(UserApi.withdrawAccount, {
    onSuccess: (res) => {
      if (res.status === 200) {
        console.log(res);
        toast.show("탈퇴에 성공하였습니다.", {
          type: "success",
        });
        dispatch(logout());
      } else {
        console.log(`withdrawAccount mutation success but please check status code`);
        console.log(`status: ${res.status}`);
        toast.show(`탈퇴에 실패하였습니다. (Error Code: ${res.status})`, {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      console.log("--- withdrawAccount Error ---");
      console.log(`error: ${error}`);
    },
  });

  const onSubmit = () => {
    const requestData: AccountWithdrawRequest = { token };
    mutation.mutate(requestData);
  };

  const goToScreen = (screen: string) => {
    navigate("ProfileStack", {
      screen,
    });
  };

  const handleAlert = () => {
    Alert.alert(
      "탈퇴",
      "탈퇴 후 계정 복구는 불가합니다. 정말로 탈퇴하시겠습니까?",
      [
        {
          text: "네",
          onPress: () => onSubmit(),
          style: "cancel",
        },
        { text: "아니요", onPress: () => console.log("취소") },
      ],
      { cancelable: false }
    );
  };

  const items: AccountItem[] = [
    {
      title: "비밀번호 변경",
      onPress: () => goToScreen("ChangePw"),
    },
    {
      title: "차단된 계정",
      onPress: () => goToScreen("BlockUserList"),
    },
    {
      title: "탈퇴",
      onPress: handleAlert,
    },
  ];

  return (
    <Container>
      {items.map((item, index) => (
        <TouchMenu key={index}>
          <MenuItem onPress={item.onPress}>
            <MenuItemText>{item.title}</MenuItemText>
            <ChevronBox>
              <Feather name="chevron-right" color="#CCCCCC" size={22} />
            </ChevronBox>
          </MenuItem>
        </TouchMenu>
      ))}
    </Container>
  );
};

export default Account;
