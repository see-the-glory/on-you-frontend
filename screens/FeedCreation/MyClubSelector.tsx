import React, { useLayoutEffect } from "react";
import {ActivityIndicator, FlatList, ScrollView, TouchableOpacity} from "react-native";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { Club, MyClub, UserApi,MyClubsResponse } from "../../api";
import { MyClubSelectorScreenProps } from "../../types/feed";
import CustomText from "../../components/CustomText";
import { Entypo } from "@expo/vector-icons";
import Tag from "../../components/Tag";
const Container = styled.SafeAreaView`
  flex: 1;
`;

const GuideText = styled(CustomText)`
  padding: 10px 0px 0px 20px;
  color: #A0A0A0;
  font-size: 14px;
`

const IntroText = styled(CustomText)`
  padding: 10px 0px 0px 20px;
  color: #b0b0b0;
`;

const ReplyContainer = styled.View`
  height: 100%;
  padding-bottom: 40px;
`;

const ClubArea = styled.TouchableOpacity`
  flex-direction: row;
  width: 100%;
  height: auto;
  padding: 5px 15px 0 15px;
  border-style: solid;
  border-bottom-color: #e9e9e9;
  border-bottom-width: 1px;
  align-self: flex-start;
`;

const ClubImg = styled.Image`
  width: 46px;
  height: 46px;
  border-radius: 25px;
  margin: 5px;
`;

const ClubMy = styled.View`
  justify-content: center;
`;

const CommentMent = styled.View`
  flex-direction: row;
  padding-bottom: 4px;
`;

const ClubName = styled.Text`
  color: black;
  font-size: 17px;
  font-weight: 500;
  padding-top: 2%;
`;

const CommentRemainder = styled.View`
  flex-direction: row;
`;

const HeaderNameView = styled.View`
  padding-left: 2%;
  justify-content: center;
  align-items: flex-start;
  bottom: 1px;
`;

const CategoryView = styled.View``;

const CategoryBox = styled.View`
  background-color: #c4c4c4;
  border-radius: 3px;
  margin-left: 3px;
  margin-right: 3px;
`;

const CategoryNameText = styled(CustomText)`
  font-size: 12px;
  line-height: 16px;
  color: white;
`;

const MyClubSelector: React.FC<MyClubSelectorScreenProps> = ({
                                                               navigation: { setOptions, navigate, goBack },
                                                               route: {
                                                                 params: { userId },
                                                               },
                                                             }) => {
  const token = useSelector((state: any) => state.auth.token);

  const {
    isLoading: myClubInfoLoading, // true or false
    data: myClub,
  } = useQuery<MyClubsResponse>(["getMyClubs"], UserApi.getMyClubs);

  const goToImageSelect = (clubData: Club) => {
    return navigate("FeedStack", {
      screen: "ImageSelecter",
      userId: userId,
      clubId: clubData.id,
    });
  };

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
          <TouchableOpacity onPress={() => goBack()}>
            <Entypo name="chevron-thin-left" size={20} color="black" />
          </TouchableOpacity>
      ),
    });
  }, []);

  return (
      <Container>
        <GuideText>게시글을 업로드 할 모임을 선택하세요.</GuideText>
        <IntroText>가입한 모임 List</IntroText>
        <ReplyContainer>
          {myClubInfoLoading ? (
              <ActivityIndicator />
          ) : (
              <FlatList
                  keyExtractor={(item: MyClub, index: number) => String(index)}
                  data={myClub?.data?.filter(item=>item.applyStatus === "APPROVED")}
                  renderItem={({ item, index }: { item: MyClub; index: number }) => (
                          <ClubArea key={index} onPress={() => goToImageSelect(item)}>
                              <ClubImg source={{ uri: item.thumbnail }} />
                              <HeaderNameView>
                                  <CommentMent>
                                      <ClubName>{item.name}</ClubName>
                                  </CommentMent>
                                  <CommentRemainder>
                                      {item.categories?.map((name) => {
                                          return (
                                              <CategoryView>
                                                  <Tag name={name.name} textColor="white" backgroundColor="#C4C4C4" />
                                              </CategoryView>
                                          );
                                      })}
                                  </CommentRemainder>
                              </HeaderNameView>
                          </ClubArea>
                  )}
              />
          )}
        </ReplyContainer>
      </Container>
  );
};
export default MyClubSelector;
