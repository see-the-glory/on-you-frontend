import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
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
import { useQuery, useQueryClient } from "react-query";
import {
  Category,
  CategoryResponse,
  ClubApi,
  Club,
  ClubsResponse,
} from "../api";
import { ClubListScreenProps } from "../types/club";

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

const Clubs: React.FC<ClubListScreenProps> = ({ navigation: { navigate } }) => {
  const queryClient = useQueryClient();
  const [categoryBundle, setCategoryBundle] = useState<Array<Array<Category>>>([
    [],
  ]);
  const {
    isLoading: clubsLoading,
    data: clubs,
    isRefetching: isRefetchingClubs,
  } = useQuery<ClubsResponse>(["clubs", "getClubs"], ClubApi.getClubs);

  const {
    isLoading: categoryLoading,
    data: category,
    isRefetching: isRefetchingCategory,
  } = useQuery<CategoryResponse>(
    ["clubs", "getCategories"],
    ClubApi.getCategories,
    {
      onSuccess: (res) => {
        const result = [];
        const categoryViewSize = 4;
        let pos = 0;

        while (pos < res.data.length) {
          result.push(res.data.slice(pos, pos + categoryViewSize));
          pos += categoryViewSize;
        }

        setCategoryBundle(result);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const goToClub = (clubData: Club) => {
    return navigate("ClubStack", {
      screen: "ClubTopTabs",
      params: {
        clubData,
      },
    });
  };

  const goToCreation = () => {
    return navigate("ClubCreationStack", {
      screen: "ClubCreationStepOne",
      params: { category },
    });
  };

  const onRefresh = async () => {
    queryClient.refetchQueries(["clubs"]);
  };

  const refreshing = isRefetchingCategory || isRefetchingClubs;
  const loading = categoryLoading || clubsLoading;
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
              {categoryBundle.map((bundle, index) => {
                return (
                  <CategoryView key={index}>
                    {bundle.map((item, index) => {
                      return (
                        <CategoryItem key={index} onPress={onRefresh}>
                          <CategoryIcon
                            source={{
                              uri: item.thumbnail
                                ? item.thumbnail
                                : "https://w7.pngwing.com/pngs/507/1014/png-transparent-computer-icons-board-game-video-game-dice-game-white-dice.png",
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
        data={clubs?.data.values}
        keyExtractor={(item: Club) => item.id + ""}
        renderItem={({ item }: { item: Club }) => (
          <TouchableOpacity
            onPress={() => {
              goToClub(item);
            }}
          >
            <ClubList
              thumbnailPath={item.thumbnail}
              organizationName={item.organizationName}
              clubName={item.name}
              memberNum={item.members.length}
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
