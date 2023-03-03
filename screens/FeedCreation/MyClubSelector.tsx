import React, { useLayoutEffect } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
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

const IntroText = styled(CustomText)`
  padding: 10px 0px 0px 20px;
  color: #b0b0b0;
`;

const ReplyContainer = styled.View`
  height: 100%;
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
  padding-left: 1%;
  color: black;
  font-size: 17px;
  font-weight: 500;
  padding-top: 2%;
`;

const CommentRemainder = styled.View`
  flex-direction: row;
`;

const HeaderNameView = styled.View`
  justify-content: center;
  align-items: flex-start;
  padding-left: 4px;
  bottom: 1px;
`;

const CategoryView = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 5px;
`;

const CategoryBox = styled.View`
  background-color: #c4c4c4;
  padding: 1px 3px;
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
        <IntroText>가입한 모임 List</IntroText>
        <ReplyContainer>
          {myClubInfoLoading ? (
              <ActivityIndicator />
          ) : (
              <FlatList
                  keyExtractor={(item: MyClub, index: number) => String(index)}
                  data={myClub?.data}
                  renderItem={({ item, index }: { item: MyClub; index: number }) => (
                      <>
                        {item.applyStatus === "APPROVED" ? (
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
                                          <CategoryBox>
                                            <CategoryNameText>{name.name}</CategoryNameText>
                                          </CategoryBox>
                                        </CategoryView>
                                    );
                                  })}
                                </CommentRemainder>
                              </HeaderNameView>
                            </ClubArea>
                        ) : null}
                      </>
                  )}
              />
          )}
        </ReplyContainer>
      </Container>
  );
};
export default MyClubSelector;
