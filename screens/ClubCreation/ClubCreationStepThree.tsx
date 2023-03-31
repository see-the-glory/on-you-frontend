import { Entypo } from "@expo/vector-icons";
import React, { useLayoutEffect, useState } from "react";
import { DeviceEventEmitter, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useMutation } from "react-query";
import styled from "styled-components/native";
import { ClubApi, ClubCreationData, ClubCreationRequest, ClubCreationResponse, ErrorResponse } from "../../api";
import BottomButton from "../../components/BottomButton";
import CustomText from "../../components/CustomText";
import CustomTextInput from "../../components/CustomTextInput";
import { ClubCreationStepThreeScreenProps } from "../../Types/Club";

const MainView = styled.View`
  width: 100%;
`;

const HeaderView = styled.View`
  align-items: center;
  justify-content: center;
  padding: 20px 0px;
`;

const H1 = styled(CustomText)`
  font-size: 18px;
  line-height: 25px;
  font-family: "NotoSansKR-Bold";
`;

const H2 = styled(CustomText)`
  font-size: 14px;
  line-height: 20px;
  color: #5c5c5c;
`;

const Content = styled.View``;

const ContentItem = styled.View`
  margin-bottom: 20px;
`;

const ItemTitle = styled(CustomText)`
  font-size: 13px;
  line-height: 19px;
  margin-bottom: 8px;
`;

const ItemText = styled(CustomText)`
  font-size: 11px;
  line-height: 15px;
  padding: 6px 0px;
  color: #8c8c8c;
`;

const ItemTitleView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const InfoText = styled(CustomText)`
  font-size: 12px;
  color: #b5b5b5;
`;

const ShortDescInput = styled(CustomTextInput)`
  width: 100%;
  font-size: 14px;
  line-height: 20px;
  padding: 12px;
  background-color: #f3f3f3;
  text-align: center;
`;

const LongDescInput = styled(CustomTextInput)`
  width: 100%;
  height: 250px;
  font-size: 14px;
  line-height: 20px;
  padding: 12px;
  background-color: #f3f3f3;
`;

const ClubCreationStepThree: React.FC<ClubCreationStepThreeScreenProps> = ({
  route: {
    params: { category1, category2, clubName, maxNumber, isApproveRequired, phoneNumber, organizationName, imageURI },
  },
  navigation: { navigate, setOptions, goBack },
}) => {
  const toast = useToast();
  const [clubShortDesc, setClubShortDesc] = useState<string>("");
  const [clubLongDesc, setClubLongDesc] = useState<string>("");
  const shortDescMax = 20;
  const longDescMax = 3000;
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);

  const mutation = useMutation<ClubCreationResponse, ErrorResponse, ClubCreationRequest>(ClubApi.createClub, {
    onSuccess: (res) => {
      setDisableSubmit(false);
      DeviceEventEmitter.emit("ClubListRefetch");
      navigate("ClubCreationSuccess", { clubData: res.data });
    },
    onError: (error) => {
      console.log(`API ERROR | createClub ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
      navigate("ClubCreationFail", {});
    },
  });

  const onSubmit = () => {
    if (category1 === -1 && category2 === -1) {
      toast.show(`카테고리가 설정되어있지 않습니다.`, { type: "warning" });
      return;
    } else if (!imageURI) {
      toast.show(`모임 프로필 이미지가 설정되지 않았습니다.`, { type: "warning" });
      return;
    } else if (category1 === -1 && category2 !== -1) {
      category1 = category2;
      category2 = -1;
    }

    const data: ClubCreationData = {
      category1Id: category1,
      clubName,
      clubMaxMember: maxNumber,
      clubShortDesc: clubShortDesc.trim(),
      clubLongDesc: clubLongDesc.trim(),
      contactPhone: phoneNumber,
      organizationName,
      isApproveRequired,
    };

    if (category2 !== -1) data.category2Id = category2;

    console.log(data);

    const splitedURI = new String(imageURI).split("/");
    const requestData: ClubCreationRequest = {
      image: {
        uri: Platform.OS === "android" ? imageURI : imageURI.replace("file://", ""),
        type: "image/jpeg",
        name: splitedURI[splitedURI.length - 1],
      },
      data,
    };
    setDisableSubmit(true);
    mutation.mutate(requestData);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={90} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <MainView>
          <HeaderView>
            <H1>모임 소개</H1>
            <H2>모임을 소개해주세요.</H2>
          </HeaderView>
          <Content>
            <ContentItem>
              <ItemTitleView>
                <ItemTitle>간단 소개</ItemTitle>
                <InfoText>{`${clubShortDesc.length} / ${shortDescMax}`}</InfoText>
              </ItemTitleView>
              <ShortDescInput
                placeholder="20자 이내로 간단 소개글을 적어주세요."
                placeholderTextColor="#B0B0B0"
                value={clubShortDesc}
                textAlign="center"
                maxLength={shortDescMax}
                textAlignVertical="center"
                onChangeText={(value: string) => setClubShortDesc(value)}
                onEndEditing={() => setClubShortDesc((prev) => prev.trim())}
                includeFontPadding={false}
              />
              <ItemText>{`ex) 묵상훈련을 하는 책모임입니다.`}</ItemText>
            </ContentItem>
            <ContentItem>
              <ItemTitleView>
                <ItemTitle>상세 소개</ItemTitle>
                <InfoText>{`${clubLongDesc.length} / ${longDescMax}`}</InfoText>
              </ItemTitleView>
              <LongDescInput
                placeholder="모임의 상세 소개글을 적어주세요."
                placeholderTextColor="#B0B0B0"
                value={clubLongDesc}
                textAlign="left"
                multiline={true}
                maxLength={longDescMax}
                textAlignVertical="top"
                onChangeText={(value: string) => setClubLongDesc(value)}
                onEndEditing={() => setClubLongDesc((prev) => prev.trim())}
                includeFontPadding={false}
              />
            </ContentItem>
          </Content>
        </MainView>
      </ScrollView>

      <BottomButton
        onPress={onSubmit}
        disabled={clubShortDesc === "" || clubLongDesc === "" || disableSubmit}
        backgroundColor={"#FF6534"}
        title={"완료"}
        contentContainerStyle={Platform.OS === "android" ? { position: "relative" } : {}}
      />
    </KeyboardAvoidingView>
  );
};

export default ClubCreationStepThree;
