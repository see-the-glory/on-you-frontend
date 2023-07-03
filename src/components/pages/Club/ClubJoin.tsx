import React, { useLayoutEffect, useState } from "react";
import { ActivityIndicator, DeviceEventEmitter, StatusBar, TouchableOpacity } from "react-native";
import CustomText from "@components/atoms/CustomText";
import styled from "styled-components/native";
import { useMutation } from "react-query";
import { BaseResponse, ClubApi, ClubApplyRequest, ErrorResponse } from "api";
import { useToast } from "react-native-toast-notifications";
import { Entypo } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ClubStackParamList } from "@navigation/ClubStack";
import { clubJoinEvent } from "app/analytics";

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

const MemoInfo = styled.View`
  align-items: flex-end;
  justify-content: center;
  padding: 5px 0px;
`;

const InfoText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 12px;
  color: #b5b5b5;
`;

const HeaderTitle = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 16px;
  line-height: 23px;
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
  font-size: 16px;
  line-height: 23px;
  padding: 10px;
`;

const ClubJoin: React.FC<NativeStackScreenProps<ClubStackParamList, "ClubJoin">> = ({
  navigation: { navigate, goBack, setOptions },
  route: {
    params: { clubId, clubName },
  },
}) => {
  const [memo, setMemo] = useState<string>("");
  const maxLength = 1000;
  const toast = useToast();

  const clubApplyMutation = useMutation<BaseResponse, ErrorResponse, ClubApplyRequest>(ClubApi.applyClub, {
    onSuccess: (res) => {
      toast.show(`가입 신청이 완료되었습니다.`, { type: "success" });
      clubJoinEvent({ club_id: clubId, club_name: clubName ?? null });
      DeviceEventEmitter.emit("ClubRefetch");
      goBack();
    },
    onError: (error) => {
      console.log(`API ERROR | applyClub ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const save = () => {
    if (memo.trim() === "") return toast.show(`내용이 비어있습니다.`, { type: "danger" });
    const requestData: ClubApplyRequest = {
      clubId,
      message: memo.trim(),
    };

    clubApplyMutation.mutate(requestData);
  };

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () =>
        clubApplyMutation.isLoading ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity onPress={save}>
            <CustomText style={{ color: "#2995FA", fontSize: 14, lineHeight: 20 }}>제출</CustomText>
          </TouchableOpacity>
        ),
    });
  }, [memo, clubApplyMutation.isLoading]);

  return (
    <Container>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
      <MainView>
        <Header>
          <HeaderTitle>{`모임의 가입 희망을 환영합니다!\n모임 리더에게 신청자의 정보를 알려주세요.`}</HeaderTitle>
          <HeaderText>{`ex) 이름, 연락처, 교회명과 소속부서명, 함께하고 싶은 이유 등`}</HeaderText>
        </Header>
        <MemoInfo>
          <InfoText>{`${memo.length} / ${maxLength} 자`}</InfoText>
        </MemoInfo>
        <MemoTextInput
          placeholder="신청서를 작성해보세요."
          placeholderTextColor="#B0B0B0"
          textAlign="left"
          multiline={true}
          maxLength={1000}
          textAlignVertical="top"
          onChangeText={(text: string) => setMemo(text)}
          onEndEditing={() => setMemo((prev) => prev.trim())}
          includeFontPadding={false}
        />
      </MainView>
    </Container>
  );
};

export default ClubJoin;
