import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import { ActivityIndicator, Dimensions, FlatList, Platform, StatusBar } from "react-native";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { UserApi, Club, MyClubResponse, MyClub } from "../../api";
import CircleIcon from "../../components/CircleIcon";
import CustomText from "../../components/CustomText";
import { RootState } from "../../redux/store/reducers";
import { useToast } from "react-native-toast-notifications";

const SCREEN_WIDTH = Dimensions.get("window").width;

const Loader = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: ${Platform.OS === "android" ? StatusBar.currentHeight : 0}px;
`;

const Container = styled.SafeAreaView``;

const Title = styled.Text`
  font-size: 10px;
  color: #b0b0b0;
  margin: 15px 0 15px 20px;
`;

const MyClubWrap = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: #e9e9e9;
`;

const MyClubBox = styled.TouchableOpacity`
  flex-direction: row;
  height: 53px;
  align-items: center;
  background-color: #fff;
  padding-left: 20px;
`;

const MyClubTextBox = styled.View`
  padding: 0px 10px;
`;

const MyClubText = styled(CustomText)`
  font-size: 14px;
  font-family: "NotoSansKR-Medium";
`;

const MyClubPage: React.FC<NativeStackScreenProps<any, "ProfileStack">> = ({ navigation: { navigate } }, props) => {
  const [refreshing, setRefreshing] = useState(false);
  const toast = useToast();
  const token = useSelector((state: RootState) => state.auth.token);
  const {
    isLoading: myClubInfoLoading, // true or false
    data: myClub,
    refetch: myClubRefetch,
  } = useQuery<MyClubResponse>(["selectMyClubs", token], UserApi.selectMyClubs, {
    onSuccess: (res) => {
      if (res.status !== 200) {
        console.log("--- selectMyClubs Error ---");
        console.log(res);
        toast.show(`Error Code: ${res.status}`, {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      console.log("--- selectMyClubs Error ---");
      console.log(error);
      toast.show(`Error Code: ${error}`, {
        type: "warning",
      });
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    myClubRefetch();
    setRefreshing(false);
  };

  const goToClubStack = (clubData: Club) => {
    return navigate("ClubStack", {
      screen: "ClubTopTabs",
      clubData: { id: clubData.id },
    });
  };

  return myClubInfoLoading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Container>
      <Title>가입한 모임 List</Title>
      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        keyExtractor={(item: MyClub, index: number) => String(index)}
        data={myClub?.data}
        renderItem={({ item, index }: { item: MyClub; index: number }) => (
          <>
            {item.applyStatus === "APPROVED" ? (
              <MyClubWrap key={index}>
                <MyClubBox style={{ width: SCREEN_WIDTH }} onPress={() => goToClubStack(item)}>
                  <CircleIcon size={37} uri={item.thumbnail} />
                  <MyClubTextBox>
                    <MyClubText>{item.name}</MyClubText>
                  </MyClubTextBox>
                </MyClubBox>
              </MyClubWrap>
            ) : null}
          </>
        )}
      />
      <Title>가입 대기중인 List</Title>
      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        keyExtractor={(item: MyClub, index: number) => String(index)}
        data={myClub?.data}
        renderItem={({ item, index }: { item: MyClub; index: number }) => (
          <>
            {item.applyStatus === "APPLIED" ? (
              <MyClubWrap key={index}>
                <MyClubBox style={{ width: SCREEN_WIDTH }} onPress={() => goToClubStack(item)}>
                  <CircleIcon size={37} uri={item.thumbnail} />
                  <MyClubTextBox>
                    <MyClubText>{item.name}</MyClubText>
                  </MyClubTextBox>
                </MyClubBox>
              </MyClubWrap>
            ) : null}
          </>
        )}
      />
    </Container>
  );
};

export default MyClubPage;
