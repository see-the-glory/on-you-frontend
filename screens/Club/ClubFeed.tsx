import React, { useEffect, useState } from "react";
import { ActivityIndicator, useWindowDimensions, Animated, TouchableOpacity, DeviceEventEmitter, Platform } from "react-native";
import FastImage from "react-native-fast-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";
import { useInfiniteQuery, useQueryClient } from "react-query";
import styled from "styled-components/native";
import { ClubApi, ErrorResponse, Feed, FeedsResponse } from "../../api";
import feedSlice from "../../redux/slices/feed";
import { useAppDispatch } from "../../redux/store";
import { ClubFeedScreenProps } from "../../Types/Club";

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const FeedImage = styled(FastImage)<{ size: number }>`
  width: ${(props: any) => props.size}px;
  height: ${(props: any) => props.size}px;
`;

const EmptyView = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  padding-top: 200px;
  background-color: #f5f5f5;
`;

const EmptyText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 14px;
  line-height: 20px;
  color: #acacac;
  justify-content: center;
  align-items: center;
`;

export interface ClubFeedParamList {
  scrollY: Animated.Value;
  headerDiff: number;
  headerCollapsedHeight: number;
  actionButtonHeight: number;
  syncScrollOffset: (screenName: string) => void;
  screenScrollRefs: any;
}

const ClubFeed: React.FC<ClubFeedScreenProps & ClubFeedParamList> = ({
  navigation: { navigate, push },
  route: {
    name: screenName,
    params: { clubData },
  },
  scrollY,
  headerDiff,
  headerCollapsedHeight,
  actionButtonHeight,
  syncScrollOffset,
  screenScrollRefs,
}) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const numColumn = 3;
  const feedSize = Math.round(SCREEN_WIDTH / 3) - 1;
  const {
    isLoading: feedsLoading,
    data: queryFeedData,
    isRefetching: isRefetchingFeeds,
    hasNextPage,
    refetch: feedsRefetch,
    fetchNextPage,
  } = useInfiniteQuery<FeedsResponse, ErrorResponse>(["getClubFeeds", clubData.id], ClubApi.getClubFeeds, {
    getNextPageParam: (currentPage) => {
      if (currentPage) {
        return currentPage.hasData === true ? currentPage.responses?.content[currentPage.responses?.content.length - 1].customCursor : null;
      }
    },
    onSuccess: (res) => {
      if (res.pages[res.pages.length - 1].responses) dispatch(feedSlice.actions.addFeed({ feeds: res.pages[res.pages.length - 1].responses.content }));
    },
    onError: (error) => {
      console.log(`API ERROR | getClubFeeds ${error.code} ${error.status}`);
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

  useEffect(() => {
    console.log("ClubFeed - add listner");
    let clubFeedRefetchSub = DeviceEventEmitter.addListener("ClubFeedRefetch", () => {
      console.log("ClubFeed - Club Feed Refetch Event");
      onRefresh();
    });

    return () => {
      console.log("ClubFeed - remove listner");
      clubFeedRefetchSub.remove();
      queryClient.removeQueries({ queryKey: ["getClubFeeds"] });
    };
  }, []);

  const goToClubFeedDetail = (index: number) => {
    const clubFeedDetailProps = {
      clubData,
      targetIndex: index,
      fetchNextPage,
    };
    return push("ClubFeedDetail", clubFeedDetailProps);
  };

  return feedsLoading || refreshing ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Animated.FlatList
      ref={(ref) => {
        screenScrollRefs.current[screenName] = ref;
      }}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      contentOffset={{ x: 0, y: 0 }}
      onMomentumScrollEnd={(event) => syncScrollOffset(screenName)}
      onScrollEndDrag={() => syncScrollOffset(screenName)}
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
        backgroundColor: "#F5F5F5",
        minHeight: SCREEN_HEIGHT + headerCollapsedHeight,
        flexGrow: 1,
      }}
      onEndReachedThreshold={0.5}
      onEndReached={loadMore}
      data={queryFeedData?.pages?.flatMap((page: FeedsResponse) => page.responses.content) ?? []}
      keyExtractor={(item: Feed, index: number) => String(index)}
      numColumns={numColumn}
      columnWrapperStyle={{ paddingBottom: 1 }}
      ListEmptyComponent={() => (
        <EmptyView>
          <EmptyText>{`작성된 게시글이 없습니다.`}</EmptyText>
        </EmptyView>
      )}
      renderItem={({ item, index }: { item: Feed; index: number }) => (
        <TouchableOpacity key={String(index)} onPress={() => goToClubFeedDetail(index)} style={index % 3 === 1 ? { marginHorizontal: 1 } : {}}>
          <FeedImage size={feedSize} source={item?.imageUrls && item?.imageUrls[0] ? { uri: item.imageUrls[0] } : require("../../assets/basic.jpg")} />
        </TouchableOpacity>
      )}
    />
  );
};

export default ClubFeed;
