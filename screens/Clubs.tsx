import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import Swiper from "react-native-swiper";
import { ActivityIndicator, Dimensions, FlatList, Text } from "react-native";
import styled from "styled-components/native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

// Category Slieder
const CategoryView = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

const CategoryItem = styled.TouchableOpacity`
  flex-direction: column;
  align-items: center;
`;

const CategoryIcon = styled.Image`
  width: 45px;
  height: 45px;
  border-radius: 50px;
  margin-bottom: 8px;
`;
const CategoryName = styled.Text``;

// Club ScrollView

const Club = styled.TouchableOpacity`
  width: 100%;
  height: 80px;
  margin-bottom: 20px;
  align-items: center;
  flex-direction: row;
`;

const ThumbnailImage = styled.Image`
  width: 100px;
  height: 75px;
  border-radius: 8px;
  margin-left: 20px;
`;

const ClubInfo = styled.View`
  width: 200px;
  height: 70px;
  margin-left: 20px;
  justify-content: space-evenly;
`;

const ChurchNameText = styled.Text`
  font-size: 12px;
`;
const ClubNameText = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;
const MemberNumView = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Wrapper = styled.View`
  flex: 1;
`;

const FloatingButton = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 50px;
  height: 50px;
  margin-right: 15px;
  margin-bottom: 15px;
  background-color: #e77f67;
  box-shadow: 1px 1px 2px gray;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
`;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Clubs: React.FC<NativeStackScreenProps<any, "Clubs">> = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([[{}]]);
  const [clubs, setClubs] = useState([{}]);

  const getCategories = () => {
    const item = {
      iconPath:
        "https://ima9ines.com/content/images/thumbs/0000017_featured-categories-plugin_300.png",
      name: "보드게임",
    };
    const result = Array.from({ length: 2 }, () =>
      Array.from({ length: 4 }, () => item)
    );

    setCategories(result);
  };

  const getClubs = () => {
    const result = [];
    for (var i = 0; i < 12; ++i) {
      result.push({
        id: i,
        thumbnailPath:
          "https://cdn.pixabay.com/photo/2015/03/30/14/35/love-699480_1280.jpg",
        churchName: "시광교회",
        clubName: "성경 읽기 너무 싫어",
        memberNum: Math.ceil(Math.random() * 10),
      });
    }

    setClubs(result);
  };

  const getData = async () => {
    await Promise.all([getCategories(), getClubs()]);
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

  return loading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Wrapper>
      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponentStyle={{ marginBottom: 30 }}
        ListHeaderComponent={
          <>
            <Swiper
              horizontal
              showsButtons
              showsPagination={false}
              loop={false}
              nextButton={
                <Ionicons name="ios-chevron-forward" size={20} color="black" />
              }
              prevButton={
                <Ionicons name="ios-chevron-back" size={20} color="black" />
              }
              containerStyle={{
                width: "100%",
                height: SCREEN_HEIGHT / 6,
              }}
            >
              {categories.map((bundle, index) => {
                return (
                  <CategoryView key={index}>
                    {bundle.map((item, index) => {
                      return (
                        <CategoryItem key={index} onPress={getData}>
                          <CategoryIcon
                            source={{
                              uri: item.iconPath,
                            }}
                          />
                          <CategoryName>{item.name}</CategoryName>
                        </CategoryItem>
                      );
                    })}
                  </CategoryView>
                );
              })}
            </Swiper>
          </>
        }
        data={clubs}
        keyExtractor={(item) => item.id + ""}
        renderItem={({ item, index }) => (
          <Club>
            <ThumbnailImage source={{ uri: item.thumbnailPath }} />
            <ClubInfo>
              <ChurchNameText>
                <Text>{item.churchName}</Text>
              </ChurchNameText>
              <ClubNameText>
                <Text>{item.clubName}</Text>
              </ClubNameText>
              <MemberNumView>
                <FontAwesome name="user-o" size={12} color="black" />
                <Text style={{ marginLeft: 7 }}>{item.memberNum} 명</Text>
              </MemberNumView>
            </ClubInfo>
          </Club>
        )}
      />
      <FloatingButton>
        <Ionicons name="ios-add-sharp" size={28} color="white" />
      </FloatingButton>
    </Wrapper>
  );
};

export default Clubs;
