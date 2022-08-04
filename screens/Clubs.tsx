import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import Swiper from "react-native-swiper";
import { ActivityIndicator, Alert, Dimensions, FlatList, Platform, StatusBar, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ClubList from "../components/ClubList";
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";
import { Category, CategoryResponse, ClubApi, Club, ClubsResponse, ClubsParams } from "../api";
import { ClubListScreenProps } from "../types/club";

const Loader = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: ${Platform.OS === "android" ? StatusBar.currentHeight : 0};
`;

const CategoryButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;
const CategoryName = styled.Text`
  font-size: 18px;
  color: gray;
`;

const SelectedCategoryName = styled.Text`
  font-weight: 700;
  font-size: 18px;
  color: black;
`;

// Club ScrollView

const Container = styled.SafeAreaView`
  flex: 1;
  padding-top: ${Platform.OS === "android" ? StatusBar.currentHeight : 0};
`;

const HeaderView = styled.View`
  height: 100px;
`;

const HeaderSection = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-top-width: 1px;
  border-top-color: #e9e9e9;
  border-bottom-width: 1px;
  border-bottom-color: #e9e9e9;
`;

const HeaderItem = styled.View`
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const MainView = styled.View`
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
  border: 1px;
  border-color: white;
`;

const Clubs: React.FC<ClubListScreenProps> = ({ navigation: { navigate } }) => {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<ClubsParams>({
    categoryId: null,
    clubState: null,
    minMember: null,
    maxMember: null,
    sort: "created",
    showRecruiting: null,
    showMy: null,
  });
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [isPageTransition, setIsPageTransition] = useState<boolean>(false);
  const {
    isLoading: clubsLoading,
    data: clubs,
    isRefetching: isRefetchingClubs,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<ClubsResponse>(["clubs", params], ClubApi.getClubs, {
    getNextPageParam: (currentPage) => {
      if (currentPage) return currentPage.hasNext === false ? null : currentPage.responses.content[currentPage.responses.content.length - 1].customCursor;
    },
    onSuccess: (res) => {
      setIsPageTransition(false);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const {
    isLoading: categoryLoading,
    data: category,
    isRefetching: isRefetchingCategory,
  } = useQuery<CategoryResponse>(["getCategories"], ClubApi.getCategories, {
    onSuccess: (res) => {
      setCategoryData([
        {
          description: "All Category",
          id: 0,
          name: "전체",
          thumbnail: null,
          order: null,
        },
        ...res.data,
      ]);
    },
    onError: (err) => {
      console.log(err);
    },
  });

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

  const setCategory = (categoryId: number) => {
    let curParams = params;
    curParams.categoryId = categoryId !== 0 ? categoryId : null;
    setParams(curParams);
    setSelectedCategory(categoryId);
    setIsPageTransition(true);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["clubs"]);
    setRefreshing(false);
  };

  const loadMore = () => {
    if (hasNextPage) fetchNextPage();
  };
  const loading = categoryLoading && clubsLoading;

  return loading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Container>
      <HeaderView>
        <FlatList
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{}}
          ItemSeparatorComponent={() => <View style={{ marginHorizontal: 10 }} />}
          horizontal
          data={categoryData}
          keyExtractor={(item: Category) => item.id + ""}
          renderItem={({ item, index }: { item: Category; index: number }) => (
            <CategoryButton
              style={{
                paddingLeft: index === 0 ? 20 : 0,
                paddingRight: index === Number(category?.data.length) ? 20 : 0,
              }}
              onPress={() => setCategory(index)}
            >
              {index === selectedCategory ? <SelectedCategoryName>{item.name}</SelectedCategoryName> : <CategoryName>{item.name}</CategoryName>}
            </CategoryButton>
          )}
        />
        <HeaderSection>
          <HeaderItem>
            <Text>상세 필터</Text>
            <TouchableOpacity
              style={{
                height: 35,
                justifyContent: "center",
              }}
            >
              <Feather name="filter" size={14} color="black" />
            </TouchableOpacity>
          </HeaderItem>
          <View
            style={{
              borderLeftWidth: 0.5,
              borderRightWidth: 0.5,
              height: "100%",
              borderColor: "#e9e9e9",
            }}
          ></View>
          <HeaderItem>
            <Text>최신순</Text>
            <TouchableOpacity
              style={{
                height: 35,
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons name="sort" size={14} color="black" />
            </TouchableOpacity>
          </HeaderItem>
        </HeaderSection>
      </HeaderView>
      <MainView>
        {clubsLoading || isPageTransition ? (
          <Loader>
            <ActivityIndicator />
          </Loader>
        ) : (
          <FlatList
            refreshing={refreshing}
            onRefresh={onRefresh}
            onEndReached={loadMore}
            data={clubs?.pages.map((page) => page.responses.content).flat()}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            numColumns={2}
            keyExtractor={(item: Club, index: number) => String(index)}
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
                  clubShortDesc={item.clubShortDesc}
                  categories={item.categories}
                  recruitStatus={item.recruitStatus}
                />
              </TouchableOpacity>
            )}
          />
        )}
      </MainView>
      <FloatingButton onPress={goToCreation}>
        <Ionicons name="ios-add-sharp" size={28} color="white" />
      </FloatingButton>
    </Container>
  );
};

export default Clubs;
