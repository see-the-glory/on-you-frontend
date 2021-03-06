import React, { useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { ClubApi, ClubCreationRequest } from "../../api";
import { ClubCreationStepThreeScreenProps } from "../../types/club";

const Container = styled.ScrollView`
  flex: 1;
`;

const HeaderView = styled.View`
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 20px;
`;

const H1 = styled.Text`
  font-size: 28px;
  font-weight: 900;
  margin-bottom: 15px;
`;

const H2 = styled.Text`
  font-size: 18px;
  color: #5c5c5c;
`;

const SectionView = styled.View`
  width: 100%;
`;

const FieldView = styled.View`
  justify-content: center;
  margin-left: 50px;
  margin-right: 50px;
  margin-top: 30px;
`;

const FieldNameText = styled.Text`
  font-size: 21px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const ExampleText = styled.Text`
  font-size: 12px;
  margin-left: 5px;
  color: #8c8c8c;
`;

const BrifeTextInput = styled.TextInput`
  border-radius: 10px;
  background-color: #f3f3f3;
  font-size: 14px;
  padding: 15px;
  margin-bottom: 10px;
`;

const DetailTextInput = styled.TextInput`
  height: 130px;
  border-radius: 10px;
  background-color: #f3f3f3;
  font-size: 14px;
  padding: 15px;
`;

const NextButton = styled.TouchableOpacity`
  width: 200px;
  height: 40px;
  background-color: #295af5;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  margin-bottom: 80px;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: white;
`;

const ClubCreationStepThree: React.FC<ClubCreationStepThreeScreenProps> = ({
  route: {
    params: {
      category1,
      category2,
      clubName,
      clubMemberCount,
      approvalMethod,
      imageURI,
    },
  },
  navigation: { navigate },
}) => {
  const token = useSelector((state) => state.AuthReducers.authToken);
  const [briefIntroText, setBriefIntroText] = useState<string>("");
  const [detailIntroText, setDetailIntroText] = useState<string>("");

  const mutation = useMutation(ClubApi.createClub, {
    onSuccess: (res) => {
      if (res.status === 200 && res.json?.resultCode === "OK") {
        return navigate("ClubCreationSuccess", {
          clubData: res.json?.data,
        });
      } else {
        console.log(`mutation success but please check status code`);
        console.log(`status: ${res.status}`);
        console.log(res.json);
        return navigate("ClubCreationFail", {});
      }
    },
    onError: (error) => {
      console.log("--- Error ---");
      console.log(`error: ${error}`);
      return navigate("ClubCreationFail", {});
    },
    onSettled: (res, error) => {},
  });

  const onSubmit = () => {
    // console.log("category1: " + category1);
    // console.log("category2: " + category2);
    // console.log("clubName: " + clubName);
    // console.log("clubMemberCount: " + clubMemberCount);
    // console.log("briefIntroText: " + briefIntroText);
    // console.log("detailIntroText " + detailIntroText);
    // console.log("approvalMethod " + approvalMethod);
    // console.log("imageURI " + imageURI);

    const data = {
      category1Id: category1,
      category2Id: category2,
      clubName,
      clubMaxMember: clubMemberCount,
      clubShortDesc: briefIntroText,
      clubLongDesc: detailIntroText,
      isApproveRequired: approvalMethod === 0 ? "N" : "Y",
    };

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

    mutation.mutate(requestData);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <HeaderView>
          <H1>?????? ??????</H1>
          <H2>????????? ??????????????????.</H2>
        </HeaderView>
        <SectionView>
          <FieldView>
            <FieldNameText>?????? ??????</FieldNameText>
            <BrifeTextInput
              placeholder="30??? ????????? ?????? ???????????? ???????????????."
              textAlign="left"
              multiline={true}
              maxLength={30}
              textAlignVertical="top"
              onChangeText={(text) => setBriefIntroText(text)}
            />
            <ExampleText>
              ex) ?????? ??????????????? ???????????? ???????????? '??????'?????????!
            </ExampleText>
          </FieldView>
          <FieldView>
            <FieldNameText>?????? ??????</FieldNameText>
            <DetailTextInput
              placeholder="????????? ?????? ???????????? ???????????????.
              ex) ????????????, ????????????, ???????????? ???"
              textAlign="left"
              multiline={true}
              maxLength={1000}
              textAlignVertical="top"
              onChangeText={(text) => setDetailIntroText(text)}
            />
          </FieldView>
        </SectionView>
        <NextButton onPress={onSubmit}>
          <ButtonText>??????</ButtonText>
        </NextButton>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default ClubCreationStepThree;
