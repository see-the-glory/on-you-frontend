import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import Swiper from "react-native-swiper";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import ClubList from "../components/ClubList";

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

const Wrapper = styled.View`
  flex: 1;
`;

const FloatingButton = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 50px;
  height: 50px;
  background-color: #e77f67;
  elevation: 5;
  box-shadow: 1px 1px 3px gray;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
`;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Clubs: React.FC<NativeStackScreenProps<any, "Clubs">> = ({
  navigation: { navigate },
}) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState([[{}]]);
  const [clubs, setClubs] = useState([{}]);

  const goToClub = (item) => {
    navigate("ClubStack", {
      screen: "ClubTopTabs",
      item,
    });
  };

  const goToCreation = () => {
    navigate("ClubCreationStack", {
      screen: "StepOne",
    });
  };

  const getCategories = () => {
    const item = {
      iconPath:
        "https://w7.pngwing.com/pngs/507/1014/png-transparent-computer-icons-board-game-video-game-dice-game-white-dice.png",
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
        organizationName: "시광교회",
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
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              goToClub(item);
            }}
          >
            <ClubList
              thumbnailPath={item.thumbnailPath}
              organizationName={item.organizationName}
              clubName={item.clubName}
              memberNum={item.memberNum}
            />
          </TouchableOpacity>
        )}
      />
      <FloatingButton onPress={goToCreation}>
        <Ionicons name="ios-add-sharp" size={28} color="white" />
      </FloatingButton>
    </Wrapper>
  );
};

export default Clubs;
