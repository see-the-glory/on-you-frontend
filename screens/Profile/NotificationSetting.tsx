import React, { useState } from "react";
import { Switch, View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { UserApi, UserPushAlarmRequest } from "../../api";
import CustomText from "../../components/CustomText";
import { RootState } from "../../redux/store/reducers";

const Container = styled.ScrollView`
  flex: 1;
`;
const Header = styled.View`
  padding: 10px 20px;
`;
const HeaderTitle = styled(CustomText)`
  font-family: "NotoSansKR-Bold";
  font-size: 16px;
  line-height: 22px;
  color: #2b2b2b;
  margin-bottom: 5px;
`;

const HeaderText = styled(CustomText)`
  font-size: 11px;
  color: #b0b0b0;
`;

const Main = styled.View`
  padding: 0px 20px;
`;

const Item = styled.View`
  margin: 5px 0px;
`;

const ItemSub = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ItemTitle = styled(CustomText)`
  font-size: 16px;
  line-height: 22px;
  color: #2b2b2b;
  margin-bottom: 5px;
`;

const ItemText = styled(CustomText)`
  font-size: 11px;
  color: #b0b0b0;
`;

const NotificationSetting = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const toast = useToast();
  const [userPush, setUserPush] = useState<boolean>(true);
  const [clubPush, setClubPush] = useState<boolean>(true);

  const setPushAlarmMutation = useMutation(UserApi.setPushAlarm, {
    onSuccess: (res) => {
      if (res.status !== 200) {
        console.log(`setPushAlarm success but please check status code`);
        console.log(`status: ${res.status}`);
        console.log(res);
        toast.show(`설정에 실패했습니다. (Error Code: ${res.status})`, {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      console.log("--- Error setPushAlarm ---");
      console.log(`error: ${error}`);
      toast.show(`Error Code: ${error}`, {
        type: "warning",
      });
    },
  });

  const onValueChange = (alarmType: "USER" | "CLUB") => {
    let isOnOff: "Y" | "N" = "Y";
    if (alarmType === "USER") {
      isOnOff = !userPush ? "Y" : "N";
      setUserPush((prev) => !prev);
    }
    if (alarmType === "CLUB") {
      isOnOff = !clubPush ? "Y" : "N";
      setClubPush((prev) => !prev);
    }

    const requestData: UserPushAlarmRequest = {
      token,
      data: {
        alarmType: alarmType === "USER" ? "HOME" : alarmType,
        isOnOff,
      },
    };

    console.log(requestData);
    setPushAlarmMutation.mutate(requestData);
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>{`푸쉬 알림`}</HeaderTitle>
        <HeaderText>{`모임 가입과 관련된 메세지의 푸쉬 알림을 설정합니다.\n알람이 오지 않을 경우 휴대폰 > 설정 > 알림 > OnYou를 확인해주세요.`}</HeaderText>
      </Header>
      <Main>
        <Item>
          <ItemSub>
            <ItemTitle>{`개인 알람`}</ItemTitle>
            <Switch
              trackColor={{ false: "#D4D4D4", true: "#FF6534" }}
              thumbColor={"white"}
              onValueChange={() => onValueChange("USER")}
              value={userPush}
              style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
            />
          </ItemSub>
          <ItemText>{`홈화면 알림창에서 확인 할 수 있는 모임 가입 신청 결과`}</ItemText>
        </Item>
        <Item>
          <ItemSub>
            <ItemTitle>{`모임 알람`}</ItemTitle>
            <Switch
              trackColor={{ false: "#D4D4D4", true: "#FF6534" }}
              thumbColor={"white"}
              onValueChange={() => onValueChange("CLUB")}
              value={clubPush}
              style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
            />
          </ItemSub>
          <ItemText>{`관리자로 있는 모임에서 가입 신청서를 확인할 수 있는 메세지 박스`}</ItemText>
        </Item>
      </Main>
    </Container>
  );
};

export default NotificationSetting;
