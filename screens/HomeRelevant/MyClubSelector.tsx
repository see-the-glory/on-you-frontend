import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList, Button, TextInput, Alert, Animated, ActivityIndicator, Image } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Dimensions } from "react-native";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { Club, MyClubResponse, MyClub, ClubResponse, ClubApi, ClubsResponse } from "../../api";
const Container = styled.SafeAreaView`
  flex: 1;
  height: 100%;
  position: absolute;
  width: 100%;
`;

const IntroText = styled.Text`
  text-align: right;
  padding: 10px 14px 0 0;
  font-size: 10px;
  color: #b0b0b0;
`;

const ReplyContainer = styled.View`
  height: 100%;
`;

const LogoImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 100px;
  left: 10px;
  top: 10px;
`;
const ContentMent = styled.View`
  flex: 1;
  flex-direction: row;
`;
const MentId = styled.Text`
  color: black;
  font-weight: bold;
  font-size: 15px;
`;

const Ment = styled.Text`
  color: black;
  margin-left: 10px;
  width: 200px;
`;

const TitleView = styled.SafeAreaView`
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 15px;
`;

const ClubArea = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  width: 100%;
  padding: 10px 20px 0 20px;
  border-style: solid;
  border-bottom-color: #e9e9e9;
  border-bottom-width: 1px;
  align-self: flex-start;
  height: 100%;
`;

const ClubImg = styled.Image`
  width: 37.2px;
  height: 36.1px;
  border-radius: 100px;
  flex-grow: 0;
  background-color: #c4c4c4;
`;

const ClubMy = styled.View``;
const ClubId = styled.Text`
  color: black;
  font-size: 12px;
  left: 8px;
  font-weight: bold;
`;

const Comment = styled.Text`
  color: black;
  margin-left: 10px;
  width: 200px;
  left: 5px;
  font-size: 12px;
  font-weight: 300;
`;

const CommentMent = styled.View`
  flex-direction: row;
  padding-bottom: 4px;
`;

const CommentRemainder = styled.View`
  flex-direction: row;
`;

const Like = styled.Text`
  justify-content: flex-start;
`;
const FieldInput = styled.TextInput`
  height: 40px;
  border-radius: 5px;
  background-color: #f3f3f3;
  font-size: 15px;
  width: 100%;
`;

const ReplyArea = styled.View`
  display: flex;
  flex-direction: row;
  padding: 10px 0 10px 20px;
  border: solid 0.5px #c4c4c4;
  bottom: 0;
`;

const ReplyInput = styled.TextInput`
  color: #b0b0b0;
  left: 15px;
`;

const ReplyImg = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 100px;
`;

const ReplyButton = styled.TouchableOpacity``;
const ReplyDone = styled.Text`
  color: #63abff;
  font-size: 15px;
  font-weight: bold;
  left: 550%;
  width: 30px;
  height: 24px;
  top: 15%;
`;

const CtrgArea = styled.View`
  width: 50px;
  height: 15px;
  flex-grow: 0;
  margin: 0.1px 6px 13.9px 8px;
  border-radius: 3px;
  background-color: #c4c4c4;
`;

const CtgrText = styled.View`
  margin: 3px 5px 3px 5px;
`;

const ProjectNm = styled.Text`
  width: auto;
  height: 15px;
  top: -2px;
  flex-grow: 0;
  font-size: 9px;
  font-weight: 500;
  font-style: normal;
  text-align: center;
  color: #fff;
`;
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const MyClubSelector: React.FC<NativeStackScreenProps<any, "MyClubSelector">> = ({ navigation: { navigate } }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [Home, setHome] = useState([{}]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getmyClubs = () => {
    return fetch(`http://3.39.190.23:8080/api/clubs`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
  };

  const token = useSelector((state) => state.AuthReducers.authToken);
  const { data: myClubs, isLoading: myClubsLoading } = useQuery<MyClubResponse>(["getmyClubs"], getmyClubs, {
    //useQuery(["getFeeds", token], FeedApi.getFeeds, {
    onSuccess: (res) => {
      // 성공했을 때, 데이터를 조작하면 된다..
      console.log(res);
    },
    onError: (err) => {
      console.log(`[getmyClubs error] ${err}`);
    },
  });

  const getHome = () => {
    const result = [];
    for (let i = 0; i < 5; ++i) {
      result.push({
        id: i,
        img: "https://i.pinimg.com/564x/96/a1/11/96a111a649dd6d19fbde7bcbbb692216.jpg",
        name: "문규빈",
        content: "",
        memberNum: Math.ceil(Math.random() * 10),
      });
    }

    setHome(result);
  };

  const getData = async () => {
    await Promise.all([getHome()]);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  };

  const goToHome = () => {
    navigate("Tabs", {
      screen: "Home",
    });
  };

  const goToImage = () => {
    navigate("HomeStack", {
      screen: "ImageSelecter",
    });
  };

  return (
    <Container>
      <IntroText>가입한 모임 List</IntroText>
      <ReplyContainer>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            refreshing={refreshing}
            onRefresh={onRefresh}
            keyExtractor={(item: Club, index: number) => String(index)}
            data={myClubs?.data}
            renderItem={({ item, index }: { item: Club; index: number }) => (
              <ClubArea onPress={goToImage}>
                {/*<CommentImg source={{uri: 'https://i.pinimg.com/564x/13/05/7c/13057c33d7ad3f50ea99bc44b388ebcb.jpg'}}/>*/}
                {/*<ClubImg source={{uri:item.thumbnail}}/>*/}
                <ClubMy>
                  <CommentMent>
                    <ClubId>{item.clubShortDesc}</ClubId>
                  </CommentMent>
                  <CommentRemainder>
                    <CtrgArea>
                      <CtgrText>
                        <ProjectNm>{item.clubShortDesc}</ProjectNm>
                      </CtgrText>
                    </CtrgArea>
                    {/*<CtrgArea>
                      <CtgrText>
                        <ProjectNm>
                          {item.clubLongDesc}
                        </ProjectNm>
                      </CtgrText>
                    </CtrgArea>*/}
                  </CommentRemainder>
                </ClubMy>
              </ClubArea>
            )}
          />
        )}
      </ReplyContainer>
    </Container>
  );
};
export default MyClubSelector;
