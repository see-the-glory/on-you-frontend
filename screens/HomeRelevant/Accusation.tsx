import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { useMutation, useQuery } from "react-query";
import { useSelector } from "react-redux";
import { ReportFeedScreenProps } from "../../types/feed";
import { FeedApi, FeedLikeRequest, FeedReportRequest } from "../../api";
import CustomText from "../../components/CustomText";
const Container = styled.SafeAreaView`
  position: relative;
  height: 100%;
`;

const AccTop = styled.View`
  top: 20px;
  position: relative;
  left: 20px;
`;

const AccInfo = styled.View`
  top: 20px;
  margin-top: 10px;
`;

const AccHeader = styled.Text`
  font-size: 22px;
  padding-bottom: 15px;
  position: relative;
`;
const AccSubHeader = styled(CustomText)`
  font-size: 13px;
  color: darkgray;
`

const AccTitle = styled(CustomText)`
  text-align: center;
  font-size: 30px;
  top: 20px;
  font-weight: bold;
  color: red;
`;

const AccText = styled(CustomText)`
  font-size: 20px;
  border: 0.5px solid lightgray;
  padding: 15px;
  color: black;
`;

interface ReportReason{
  title:string,
  reason:string,
}

const Accusation:React.FC<ReportFeedScreenProps>=({ navigation:
  { navigate},
                                                    route:{params:{feedData}} }) =>{
  const token = useSelector((state) => state.AuthReducers.authToken);

  console.log(feedData.id)
  const[reportReason,setReportReason]=useState<ReportReason[]>();
  
  const mutation = useMutation( FeedApi.reportFeed, {
    onSuccess: (res) => {
      if (res.status === 200) {
        console.log(res)
      } else {
        console.log(`mutation success but please check status code`);
        console.log(res);
        // return navigate("Home", {});
      }
    },
    onError: (error) => {
      console.log("--- Error ---");
      console.log(`error: ${error}`);
      // return navigate("Home", {});
    },
    onSettled: (res, error) => {},
  });

  const ReportFeed=(reason:string)=>{
    const data={
      userId:feedData.userId,
      id:feedData.id,
      reason:reason,
    };
    console.log(data);
    const ReportData:FeedReportRequest=
      {
        data,
        token,
      }

    mutation.mutate(ReportData);
  };

  const ReportComplete = (reason:string) => {
    ReportFeed(reason)
    navigate("HomeStack", {
      screen: "ReportComplete",
    });
  };

  return (
    <Container>
      {/*<AccTitle>신고</AccTitle>*/}
      <View>
        <AccTop>
          <AccHeader>신고가 필요한 게시물인가요?</AccHeader>
          <AccSubHeader>신고유형을 선택해 주세요. 관리자에게 신고 접수가 진행됩니다.</AccSubHeader>
        </AccTop>
        <AccInfo>
          <TouchableOpacity>
            <AccText onPress={()=>ReportComplete('SPAM')}>스팸</AccText>
          </TouchableOpacity>
          <TouchableOpacity>
            <AccText onPress={()=>ReportComplete('FRAUD')}>사기 또는 거짓</AccText>
          </TouchableOpacity>
          <TouchableOpacity>
            <AccText onPress={()=>ReportComplete('HATE')}>혐오 발언 또는 상징</AccText>
          </TouchableOpacity>
          <TouchableOpacity>
            <AccText onPress={()=>ReportComplete('PORNO')}>성인물</AccText>
          </TouchableOpacity>
        </AccInfo>
      </View>
    </Container>
  );
}

export default Accusation;