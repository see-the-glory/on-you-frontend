import React, { useState, useEffect, useRef } from "react";
import { ActivityIndicator, DeviceEventEmitter, FlatList, Platform, StatusBar, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import styled from "styled-components/native";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import ClubGrid from "@components/organisms/ClubGrid";
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";
import { Category, CategoryResponse, ClubApi, Club, ClubsResponse, ClubsParams, ErrorResponse } from "api";
import { Modalize, useModalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { Slider } from "@miblanchard/react-native-slider";
import { useToast } from "react-native-toast-notifications";
import BottomButton from "@components/atoms/BottomButton";
import { lightTheme } from "app/theme";
import { Iconify } from "react-native-iconify";
import ClubList from "@components/organisms/ClubList";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainBottomTabParamList } from "@navigation/Tabs";
import SearchButton from "@components/atoms/SearchButton";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@navigation/Root";

const Loader = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: ${Platform.OS === "android" ? StatusBar.currentHeight : 0}px;
`;

const CategoryButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;
const CategoryName = styled.Text`
  font-family: ${(props) => props.theme.koreanFontR};
  font-size: 15px;
  line-height: 17px;
  color: #8e8e8e;
`;

const SelectedCategoryName = styled.Text`
  font-family: ${(props) => props.theme.koreanFontB};
  font-size: 15px;
  line-height: 18px;
`;

const Container = styled.SafeAreaView`
  padding-top: ${Platform.OS === "android" ? StatusBar.currentHeight : 0}px;
  flex: 1;
`;

const HeaderView = styled.View`
  height: 170px;
`;

const TitleSection = styled.View`
  flex-direction: row;
  height: 50px;
  padding: 0px 10px;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.Text`
  font-family: ${(props) => props.theme.koreanFontB};
  font-size: 20px;
  color: ${(props) => props.theme.accentColor};
`;

const LayoutTypeToggle = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const TypeText = styled.Text`
  font-family: ${(props) => props.theme.koreanFontR};
  font-size: 11px;
  color: #6f6f6f;
  margin-right: 5px;
`;

const SearchSection = styled.View`
  height: 40px;
  padding: 0px 10px;
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
  height: 32px;
`;

const HeaderItem = styled.View`
  flex: 1;
  padding: 0px 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const HeaderItemText = styled.Text`
  font-family: ${(props) => props.theme.koreanFontR};
  font-size: 13px;
`;

const MainView = styled.View`
  flex: 1;
`;

const EmptyView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const EmptyText = styled.Text`
  font-family: ${(props) => props.theme.koreanFontR};
  font-size: 14px;
  line-height: 20px;
  color: #acacac;
  justify-content: center;
  align-items: center;
`;

const FloatingButton = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 50px;
  height: 50px;
  background-color: ${(props) => props.theme.accentColor};
  elevation: 5;
  box-shadow: 1px 1px 3px gray;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  border: 1px;
  border-color: white;
`;

const ModalContainer = styled.View`
  flex: 1;
  padding: 35px 20px 20px 20px;
`;

const ItemView = styled.View`
  flex-direction: row;
  margin: 8px 0px;
`;

const ItemLeftView = styled.View`
  flex: 0.23;
`;
const ItemRightView = styled.View`
  flex: 0.77;
`;
const ItemNameText = styled.Text`
  font-family: ${(props) => props.theme.koreanFontM};
  font-size: 16px;
  line-height: 18px;
`;
const ItemContentText = styled.Text`
  font-family: ${(props) => props.theme.koreanFontR};
  font-size: 15px;
`;
const ItemContentSubText = styled.Text`
  font-family: ${(props) => props.theme.koreanFontR};
  font-size: 12px;
`;
const ItemContentButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const CheckBox = styled.View`
  height: 17px;
  width: 17px;
  justify-content: center;
  align-items: center;
  border: 1px solid #d4d4d4;
  margin-left: 8px;
  background-color: white;
`;

const SortingItemView = styled.View`
  justify-content: center;
  align-items: center;
`;
const SortingItemButton = styled.TouchableOpacity`
  padding: 7px 0px;
  margin: 3px 0px;
`;
const SortingItemText = styled.Text<{ selected: boolean }>`
  font-size: 15px;
  color: ${(props) => (props.selected ? props.theme.accentColor : "#b0b0b0")};
  font-family: ${(props) => (props.selected ? props.theme.koreanFontM : props.theme.koreanFontR)};
`;

interface ClubSortItem {
  title: string;
  sortType: string;
  orderBy: string;
}

const Find: React.FC<NativeStackScreenProps<MainBottomTabParamList, "Find">> = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const toast = useToast();
  const filterMinNumber = 0;
  const filterMaxNumber = 100;
  const [params, setParams] = useState<ClubsParams>({
    categoryId: 0,
    minMember: filterMinNumber,
    maxMember: filterMaxNumber,
    sortType: "created",
    orderBy: "DESC",
    showRecruiting: 0,
    showMy: 0,
  });
  const [usingFilter, setUsingFilter] = useState<boolean>(false);
  const [memberRange, setMemberRange] = useState<number | number[]>([filterMinNumber, filterMaxNumber]);
  let sliderTimeoutId: number;
  const [showRecruiting, setShowRecruiting] = useState<number>(0);
  const [showMy, setShowMy] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [isPageTransition, setIsPageTransition] = useState<boolean>(false);
  const { ref: filteringSheetRef, open: openFilteringSheet, close: closeFilteringSheet } = useModalize();
  const { ref: sortingSheetRef, open: openSortingSheet, close: closeSortingSheet } = useModalize();
  const [sortItem, setSortItem] = useState<ClubSortItem[]>();
  const [selectedSortIndex, setSelectedSortIndex] = useState<number>(0);
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const colSize = Math.round(SCREEN_WIDTH / 2);
  const clubsFlatlistRef = useRef<FlatList<Club>>();
  const [layoutType, setLayoutType] = useState<"list" | "grid">("grid");

  const {
    isLoading: clubsLoading,
    data: clubs,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<ClubsResponse, ErrorResponse>(["clubs", params], ClubApi.getClubs, {
    getNextPageParam: (lastPage) => {
      if (lastPage) {
        return lastPage.hasData === true ? lastPage.responses?.content[lastPage.responses?.content.length - 1].customCursor : null;
      }
    },
    onSuccess: () => {
      setIsPageTransition(false);
    },
    onError: (error) => {
      console.log(`API ERROR | getClubs ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const { isLoading: categoryLoading, data: category } = useQuery<CategoryResponse, ErrorResponse>(["getCategories"], ClubApi.getCategories, {
    onError: (error) => {
      console.log(`API ERROR | getCategories ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const goToClub = (clubId: number) => {
    const clubTopTabsProps = {
      clubId,
    };
    return navigation.navigate("ClubStack", {
      screen: "ClubTopTabs",
      params: clubTopTabsProps,
    });
  };

  const goToCreation = () => {
    return navigation.navigate("ClubCreationStack", { screen: "ClubCreationStepOne", params: { category } });
  };

  const goToSearch = () => {
    return navigation.navigate("Search");
  };

  const setClubsCategoryParams = (categoryId: number) => {
    const curParams: ClubsParams = params;
    curParams.categoryId = categoryId;
    setParams(curParams);
    setSelectedCategory(categoryId);
    setIsPageTransition(true);
  };

  const setClubsFilterParams = () => {
    const curParams: ClubsParams = params;
    curParams.showRecruiting = showRecruiting;
    curParams.showMy = showMy;
    curParams.minMember = Array.isArray(memberRange) ? memberRange[0] : null;
    curParams.maxMember = Array.isArray(memberRange) ? memberRange[1] : null;
    if (curParams.showRecruiting || curParams.showMy || curParams.minMember !== filterMinNumber || curParams.maxMember !== filterMaxNumber) setUsingFilter(true);
    else setUsingFilter(false);

    setParams(curParams);
    setIsPageTransition(true);
  };

  const setClubsSortingParams = (sortIndex: number) => {
    setSelectedSortIndex(sortIndex);
    const curParams: ClubsParams = params;
    if (sortItem !== undefined) {
      curParams.sortType = sortItem[sortIndex].sortType;
      curParams.orderBy = sortItem[sortIndex].orderBy;
      setParams(curParams);
      setIsPageTransition(true);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["clubs"]);
    setRefreshing(false);
  };

  const loadMore = () => {
    if (hasNextPage) fetchNextPage();
  };

  const toggleLayoutType = () => {
    setLayoutType((prev) => (prev === "grid" ? "list" : "grid"));
  };

  const gridRenderItem = ({ item, index }: { item: Club; index: number }) => (
    <TouchableOpacity
      onPress={() => {
        goToClub(item.id);
      }}
      style={index % 2 === 0 ? { marginRight: 0.5 } : { marginLeft: 0.5 }}
    >
      <ClubGrid
        thumbnailPath={item.thumbnail}
        organizationName={item.organizationName}
        clubName={item.name}
        memberNum={item.recruitNumber}
        clubShortDesc={item.clubShortDesc}
        categories={item.categories}
        recruitStatus={item.recruitStatus}
        colSize={colSize}
      />
    </TouchableOpacity>
  );

  const listRenderItem = ({ item }: { item: Club }) => <ClubList clubData={item} onPress={() => goToClub(item.id)} />;

  const loading = categoryLoading && clubsLoading;

  useEffect(() => {
    setSortItem([
      {
        title: "최신개설 모임 순",
        sortType: "created",
        orderBy: "DESC",
      },
      {
        title: "멤버수 많은 순",
        sortType: "recruitNum",
        orderBy: "DESC",
      },
      {
        title: "멤버수 적은 순",
        sortType: "recruitNum",
        orderBy: "ASC",
      },
      {
        title: "게시글 많은 순",
        sortType: "feedNum",
        orderBy: "DESC",
      },
      // {
      //   title: "하트 많은 순",
      //   sortType: "likesNum",
      //   orderBy: "DESC",
      // },
    ]);

    const clubListSubscription = DeviceEventEmitter.addListener("ClubListRefetch", () => {
      onRefresh();
    });

    const clubListScrollToTopSubscription = DeviceEventEmitter.addListener("ClubListScrollToTop", () => {
      clubsFlatlistRef?.current?.scrollToOffset({ animated: true, offset: 0 });
    });

    return () => {
      clubListSubscription.remove();
      clubListScrollToTopSubscription.remove();
    };
  }, []);

  return loading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <>
      <Container>
        <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
        <HeaderView>
          <TitleSection>
            <Title>{`정기모임`}</Title>
            <LayoutTypeToggle onPress={toggleLayoutType}>
              {layoutType === "list" ? (
                <>
                  <TypeText>{`그리드로 보기`}</TypeText>
                  <Iconify icon="ion:grid" size={16} color="#6F6F6F" style={{ marginLeft: 2 }} />
                </>
              ) : (
                <>
                  <TypeText>{`리스트로 보기`}</TypeText>
                  <Iconify icon="ion:list-sharp" size={18} color="#6F6F6F" />
                </>
              )}
            </LayoutTypeToggle>
          </TitleSection>
          <SearchSection>
            <SearchButton text="모임을 검색하세요" onPress={goToSearch} />
          </SearchSection>
          <FlatList
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{}}
            ItemSeparatorComponent={() => <View style={{ marginHorizontal: 10 }} />}
            horizontal
            data={[
              {
                description: "All Category",
                id: 0,
                name: "전체",
                thumbnail: null,
                order: null,
              },
              ...(category?.data ?? []),
            ]}
            keyExtractor={(item: Category) => String(item.id)}
            renderItem={({ item, index }: { item: Category; index: number }) => (
              <CategoryButton
                style={{
                  paddingLeft: index === 0 ? 10 : 0,
                  paddingRight: index === Number(category?.data.length) ? 10 : 0,
                }}
                onPress={() => {
                  if (selectedCategory !== item.id) setClubsCategoryParams(item.id);
                }}
              >
                {index === selectedCategory ? <SelectedCategoryName>{item.name}</SelectedCategoryName> : <CategoryName>{item.name}</CategoryName>}
              </CategoryButton>
            )}
          />
          <HeaderSection>
            <HeaderItem>
              <TouchableOpacity activeOpacity={1} onPress={() => openFilteringSheet()}>
                <HeaderItemText>상세 필터</HeaderItemText>
              </TouchableOpacity>
              <TouchableOpacity style={{ height: 35, justifyContent: "center" }} onPress={() => openFilteringSheet()}>
                <Feather name="filter" size={14} color={usingFilter ? lightTheme.accentColor : "black"} />
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
              <TouchableOpacity activeOpacity={1} onPress={() => openSortingSheet()}>
                <HeaderItemText>{sortItem ? sortItem[selectedSortIndex].title : "최신순"}</HeaderItemText>
              </TouchableOpacity>
              <TouchableOpacity style={{ height: 35, justifyContent: "center" }} onPress={() => openSortingSheet()}>
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
              ref={clubsFlatlistRef}
              contentContainerStyle={{ flexGrow: 1 }}
              refreshing={refreshing}
              onRefresh={onRefresh}
              onEndReached={loadMore}
              onEndReachedThreshold={0.7}
              data={clubs?.pages?.map((page) => page?.responses?.content).flat()}
              ListFooterComponent={() => <View />}
              ListFooterComponentStyle={{ marginBottom: 60 }}
              keyExtractor={(item: Club, index: number) => String(index)}
              ListEmptyComponent={() => (
                <EmptyView>
                  <EmptyText>{`조건에 해당하는 모임이 없습니다.`}</EmptyText>
                </EmptyView>
              )}
              key={layoutType}
              ItemSeparatorComponent={layoutType === "grid" ? () => <View style={{ height: 25 }} /> : undefined}
              numColumns={layoutType === "grid" ? 2 : undefined}
              columnWrapperStyle={layoutType === "grid" ? { justifyContent: "space-between" } : undefined}
              renderItem={layoutType === "grid" ? gridRenderItem : listRenderItem}
            />
          )}
        </MainView>
        <FloatingButton onPress={goToCreation}>
          <Feather name="plus" size={30} color="white" />
        </FloatingButton>
      </Container>

      <Portal>
        <Modalize
          ref={filteringSheetRef}
          modalHeight={245}
          handlePosition="inside"
          handleStyle={{ top: 14, height: 3, width: 35, backgroundColor: "#d4d4d4" }}
          modalStyle={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
          FooterComponent={
            <BottomButton
              onPress={() => {
                closeFilteringSheet();
                if (params.showRecruiting !== showRecruiting || params.showMy !== showMy || memberRange[0] !== params.minMember || memberRange[1] !== params.maxMember) setClubsFilterParams();
              }}
              backgroundColor={lightTheme.accentColor}
              title={"모임 보기"}
            />
          }
          onOpen={() => {
            if (Platform.OS === "android") {
              StatusBar.setBackgroundColor("black", true);
              StatusBar.setBarStyle("light-content", true);
            }
          }}
          onClose={() => {
            if (Platform.OS === "android") {
              StatusBar.setBackgroundColor("white", true);
              StatusBar.setBarStyle("dark-content", true);
            }
          }}
        >
          <ModalContainer>
            <ItemView>
              <ItemLeftView>
                <ItemNameText>모집 상태</ItemNameText>
              </ItemLeftView>
              <ItemRightView>
                <ItemContentButton
                  onPress={() => {
                    setShowRecruiting((prev) => (prev === 0 ? 1 : 0));
                  }}
                >
                  <ItemContentText>멤버 모집중인 모임만 보기</ItemContentText>
                  <CheckBox>
                    <Ionicons name="checkmark-sharp" size={15} color={showRecruiting ? lightTheme.accentColor : "white"} />
                  </CheckBox>
                </ItemContentButton>
              </ItemRightView>
            </ItemView>

            <ItemView>
              <ItemLeftView>
                <ItemNameText>멤버 수</ItemNameText>
              </ItemLeftView>
              <ItemRightView>
                <Slider
                  animateTransitions
                  containerStyle={{ height: 20, marginBottom: 3 }}
                  value={memberRange}
                  onValueChange={(value) => {
                    clearTimeout(sliderTimeoutId);
                    sliderTimeoutId = setTimeout(() => {
                      setMemberRange(value);
                    }, 100);
                  }}
                  onSlidingComplete={(value) => setMemberRange(value)}
                  minimumValue={filterMinNumber}
                  minimumTrackTintColor={lightTheme.accentColor}
                  maximumValue={filterMaxNumber}
                  maximumTrackTintColor="#E8E8E8"
                  step={5}
                  thumbTintColor="white"
                  trackStyle={{ height: 2 }}
                  thumbStyle={{ width: 14, height: 14, borderWidth: 1, borderColor: lightTheme.accentColor }}
                />
                <ItemContentSubText>{Array.isArray(memberRange) ? `최소 ${memberRange[0]} 명 이상 최대 ${memberRange[1]} 명 이하` : ``}</ItemContentSubText>
              </ItemRightView>
            </ItemView>

            <ItemView>
              <ItemLeftView>
                <ItemNameText>내 모임</ItemNameText>
              </ItemLeftView>
              <ItemRightView>
                <ItemContentButton
                  onPress={() => {
                    setShowMy((prev) => (prev === 0 ? 1 : 0));
                  }}
                >
                  <ItemContentText>내가 가입된 모임만 보기</ItemContentText>
                  <CheckBox>
                    <Ionicons name="checkmark-sharp" size={15} color={showMy ? lightTheme.accentColor : "#e8e8e8"} />
                  </CheckBox>
                </ItemContentButton>
              </ItemRightView>
            </ItemView>
          </ModalContainer>
        </Modalize>
      </Portal>

      <Portal>
        <Modalize
          ref={sortingSheetRef}
          modalHeight={220}
          handlePosition="inside"
          handleStyle={{ top: 14, height: 3, width: 35, backgroundColor: "#d4d4d4" }}
          modalStyle={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
          onOpen={() => {
            if (Platform.OS === "android") {
              StatusBar.setBackgroundColor("black", true);
              StatusBar.setBarStyle("light-content", true);
            }
          }}
          onClose={() => {
            if (Platform.OS === "android") {
              StatusBar.setBackgroundColor("white", true);
              StatusBar.setBarStyle("dark-content", true);
            }
          }}
        >
          <ModalContainer>
            <SortingItemView>
              {sortItem?.map((item, index) => (
                <SortingItemButton
                  key={index}
                  onPress={() => {
                    if (selectedSortIndex !== index) {
                      closeSortingSheet();
                      setClubsSortingParams(index);
                    }
                  }}
                >
                  <SortingItemText selected={selectedSortIndex === index}>{item.title}</SortingItemText>
                </SortingItemButton>
              ))}
            </SortingItemView>
          </ModalContainer>
        </Modalize>
      </Portal>
    </>
  );
};

export default Find;
