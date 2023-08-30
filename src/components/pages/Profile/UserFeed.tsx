import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { ActivityIndicator, useWindowDimensions, Animated, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";
import { useInfiniteQuery } from "react-query";
import styled from "styled-components/native";
import { UserApi, ErrorResponse, Feed, FeedsResponse, UserProfile } from "api";
import FadeFastImage from "@components/atoms/FadeFastImage";
import feedSlice from "redux/slices/feed";
import { useAppDispatch } from "redux/store";

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const EmptyView = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  padding-top: 200px;
  background-color: white;
`;

const EmptyText = styled.Text`
  font-family: ${(props) => props.theme.koreanFontR};
  font-size: 14px;
  line-height: 20px;
  color: #acacac;
  justify-content: center;
  align-items: center;
`;

export interface UserFeedProps {
  userId?: number;
  profile?: UserProfile;
  scrollY: Animated.Value;
  headerDiff: number;
  headerCollapsedHeight: number;
  actionButtonHeight: number;
  syncScrollOffset: (screenName: string) => void;
  screenScrollRefs: any;
}

const UserFeed: React.FC<UserFeedProps> = ({ userId, profile, scrollY, headerDiff, headerCollapsedHeight, actionButtonHeight, syncScrollOffset, screenScrollRefs }) => {
  const toast = useToast();
  const route = useRoute();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const numColumn = 3;
  const { top } = useSafeAreaInsets();
  const feedSize = Math.round(SCREEN_WIDTH / 3) - 1;
  const {
    isLoading: feedsLoading,
    data: feedData,
    isRefetching: isRefetchingFeeds,
    hasNextPage,
    refetch: feedsRefetch,
    fetchNextPage,
  } = useInfiniteQuery<FeedsResponse, ErrorResponse>(userId ? ["getUserFeeds", userId] : ["getMyFeeds"], userId ? UserApi.getUserFeeds : UserApi.getMyFeeds, {
    getNextPageParam: (currentPage) => {
      if (currentPage) {
        return currentPage.hasData === true ? currentPage.responses?.content[currentPage.responses?.content.length - 1].customCursor : null;
      }
    },
    onSuccess: (res) => {
      if (res.pages[res.pages.length - 1].responses) dispatch(feedSlice.actions.addFeeds({ feeds: res?.pages[res.pages.length - 1]?.responses?.content ?? [] }));
    },
    onError: (error) => {
      console.log(`API ERROR | getUserFeeds | getMyFeeds ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
    staleTime: 5000,
    cacheTime: 15000,
  });

  const loadMore = () => {
    if (hasNextPage) fetchNextPage();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const result = await feedsRefetch();
    dispatch(feedSlice.actions.refreshFeed({ feeds: result?.data?.pages?.flatMap((page) => page?.responses?.content) ?? [] }));
    setRefreshing(false);
  };

  const goToUserFeedDetail = (index: number) => {
    const userFeedDetailProps = {
      userId,
      profile,
      targetIndex: index,
      fetchNextPage,
    };
    return navigation.push("ProfileStack", { screen: "UserFeedDetail", params: userFeedDetailProps });
  };

  return feedsLoading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Animated.FlatList
      ref={(ref) => {
        screenScrollRefs.current[route.name] = ref;
      }}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      contentOffset={{ x: 0, y: 0 }}
      onMomentumScrollEnd={(event) => syncScrollOffset(route.name)}
      onScrollEndDrag={() => syncScrollOffset(route.name)}
      style={{
        flex: 1,
        backgroundColor: "#F5F5F5",
        transform: [
          {
            translateY: scrollY.interpolate({
              inputRange: [0, headerDiff],
              outputRange: [-headerDiff, 0],
              extrapolate: "clamp",
            }),
          },
        ],
      }}
      contentContainerStyle={{
        paddingTop: headerDiff,
        paddingBottom: Platform.OS === "ios" ? actionButtonHeight + top : actionButtonHeight,
        backgroundColor: "white",
        minHeight: SCREEN_HEIGHT + headerCollapsedHeight,
        flexGrow: 1,
      }}
      onEndReachedThreshold={0.5}
      // refreshing={refreshing}
      // onRefresh={onRefresh}
      onEndReached={loadMore}
      data={profile?.isFeedPublic === "Y" ? feedData?.pages?.flatMap((page: FeedsResponse) => page.responses.content) ?? [] : []}
      keyExtractor={(item: Feed, index: number) => String(index)}
      numColumns={numColumn}
      columnWrapperStyle={{ paddingBottom: 1 }}
      ListEmptyComponent={() => (
        <EmptyView>
          <EmptyText>{profile?.isFeedPublic === "Y" ? `작성된 게시글이 없습니다.` : "비공개 상태입니다."}</EmptyText>
        </EmptyView>
      )}
      renderItem={({ item, index }: { item: Feed; index: number }) => (
        <FadeFastImage
          key={String(index)}
          uri={item?.imageUrls?.length ? item?.imageUrls[0] : undefined}
          style={{ width: feedSize, height: feedSize }}
          onPress={() => goToUserFeedDetail(index)}
          touchableOpacityStyle={{ marginHorizontal: index % 3 === 1 ? 1 : 0 }}
        />
      )}
    />
  );
};

export default UserFeed;
