import React, { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { ClubApi, ClubCreationRequest } from "../../api";
import CustomText from "../../components/CustomText";
import CustomTextInput from "../../components/CustomTextInput";
import { ClubCreationStepThreeScreenProps } from "../../Types/Club";

const Container = styled.ScrollView`
  flex: 1;
  padding: 0px 20px;
`;

const HeaderView = styled.View`
  align-items: center;
  justify-content: center;
  margin: 20px 0px 10px 0px;
`;

const H1 = styled(CustomText)`
  font-size: 18px;
  line-height: 25px;
  font-family: "NotoSansKR-Bold";
  margin: 10px 0px;
`;

const H2 = styled(CustomText)`
  font-size: 14px;
  color: #5c5c5c;
  margin-bottom: 15px;
`;

const Content = styled.View`
  width: 100%;
`;

const ContentItem = styled.View`
  width: 100%;
  flex: 1;
  margin-bottom: 30px;
`;

const ItemTitle = styled(CustomText)`
  font-size: 13px;
  line-height: 19px;
  color: #b0b0b0;
  margin-bottom: 8px;
`;

const ItemText = styled(CustomText)`
  font-size: 9px;
  line-height: 15px;
  padding: 8px 0px;
  color: #8c8c8c;
`;

const ShortDescInput = styled(CustomTextInput)`
  width: 100%;
  font-size: 12px;
  line-height: 17px;
  padding: 8px;
  background-color: #f3f3f3;
  text-align: center;
`;

const LongDescInput = styled(CustomTextInput)`
  width: 100%;
  height: 300px;
  font-size: 12px;
  line-height: 20px;
  padding: 12px;
  background-color: #f3f3f3;
`;

const FooterView = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  margin: 30px 0px 80px 0px;
`;
const NextButton = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: ${(props) => (props.disabled ? "#c4c4c4" : "#295AF5")};
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled(CustomText)`
  font-size: 18px;
  line-height: 25px;
  font-family: "NotoSansKR-Bold";
  color: white;
`;

const ClubCreationStepThree: React.FC<ClubCreationStepThreeScreenProps> = ({
  route: {
    params: { category1, category2, clubName, maxNumber, isApproveRequired, phoneNumber, organizationName, imageURI },
  },
  navigation: { navigate },
}) => {
  const token = useSelector((state) => state.AuthReducers.authToken);
  const [clubShortDesc, setClubShortDesc] = useState<string>("");
  const [clubLongDesc, setClubLongDesc] = useState<string>("");
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

  const mutation = useMutation(ClubApi.createClub, {
    onSuccess: (res) => {
      console.log(res);
      setDisableSubmit(false);
      if (res.status === 200) {
        return navigate("ClubCreationSuccess", {
          clubData: res.data,
        });
      } else {
        console.log(`mutation success but please check status code`);
        console.log(res);
        return navigate("ClubCreationFail", {});
      }
    },
    onError: (error) => {
      console.log("--- Error ---");
      console.log(`error: ${error}`);
      setDisableSubmit(false);
      return navigate("ClubCreationFail", {});
    },
    onSettled: (res, error) => {},
  });

  const onSubmit = () => {
    const data = {
      category1Id: category1,
      clubName,
      clubMaxMember: maxNumber,
      clubShortDesc,
      clubLongDesc,
      contactPhone: phoneNumber,
      organizationName,
      isApproveRequired,
    };

    if (category2 !== -1) data.category2Id = category2;

    console.log(data);

    const splitedURI = new String(imageURI).split("/");

    const requestData: ClubCreationRequest =
      imageURI === null
        ? {
            image: null,
            data,
            token,
          }
        : {
            image: {
              uri: imageURI.replace("file://", ""),
              type: "image/jpeg",
              name: splitedURI[splitedURI.length - 1],
            },
            data,
            token,
          };

    setDisableSubmit(true);
    mutation.mutate(requestData);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={10} style={{ flex: 1 }}>
        <Container
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <HeaderView>
            <H1>모임 소개</H1>
            <H2>모임을 소개해주세요.</H2>
          </HeaderView>
          <Content>
            <ContentItem>
              <ItemTitle>간단 소개</ItemTitle>
              <ShortDescInput
                placeholder="36자 이내로 간단 소개글을 적어주세요."
                placeholderTextColor="#B0B0B0"
                value={clubShortDesc}
                textAlign="center"
                multiline={true}
                maxLength={36}
                textAlignVertical="center"
                onChangeText={(value: string) => setClubShortDesc(value)}
              />
              <ItemText>ex) 매일 묵상훈련과 책모임을 함께하는 '경청'입니다!</ItemText>
            </ContentItem>
            <ContentItem>
              <ItemTitle>상세 소개</ItemTitle>
              <LongDescInput
                placeholder="모임의 상세 소개글을 적어주세요."
                placeholderTextColor="#B0B0B0"
                value={clubLongDesc}
                textAlign="left"
                multiline={true}
                maxLength={1000}
                textAlignVertical="top"
                onChangeText={(value: string) => setClubLongDesc(value)}
              />
            </ContentItem>
          </Content>
          <FooterView>
            <NextButton onPress={onSubmit} disabled={clubShortDesc === "" || clubLongDesc === "" || disableSubmit}>
              <ButtonText>완료</ButtonText>
            </NextButton>
          </FooterView>
        </Container>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default ClubCreationStepThree;
