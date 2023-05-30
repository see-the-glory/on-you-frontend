import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, useWindowDimensions, Animated, TouchableOpacity, DeviceEventEmitter } from "react-native";
import FastImage from "react-native-fast-image";
import { useToast } from "react-native-toast-notifications";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { UserApi, ErrorResponse, Feed, FeedsResponse, Profile } from "../../api";
import clubSlice from "../../redux/slices/club";
import { useAppDispatch } from "../../redux/store";
import { RootState } from "../../redux/store/reducers";
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
  background-color: white;
`;

const EmptyText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 14px;
  line-height: 20px;
  color: #acacac;
  justify-content: center;
  align-items: center;
`;

export interface UserFeedProps {
  userId?: number;
  profile?: Profile;
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
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const numColumn = 3;
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
    onSuccess: (res) => {},
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
    setRefreshing(false);
  };

  const goToUserFeedDetail = (index: number) => {
    const userFeedDetailProps = {
      userId,
      profile,
      targetIndex: index,
      fetchNextPage,
    };
    return navigation.push("UserFeedDetail", userFeedDetailProps);
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
        paddingBottom: actionButtonHeight,
        backgroundColor: "white",
        minHeight: SCREEN_HEIGHT + headerCollapsedHeight,
        flexGrow: 1,
      }}
      // refreshing={refreshing}
      // onRefresh={onRefresh}
      onEndReached={loadMore}
      data={feedData?.pages?.flatMap((page: FeedsResponse) => page.responses.content) ?? []}
      keyExtractor={(item: Feed, index: number) => String(index)}
      numColumns={numColumn}
      columnWrapperStyle={{ paddingBottom: 1 }}
      ListEmptyComponent={() => (
        <EmptyView>
          <EmptyText>{`작성된 게시글이 없습니다.`}</EmptyText>
        </EmptyView>
      )}
      renderItem={({ item, index }: { item: Feed; index: number }) => (
        <TouchableOpacity key={String(index)} onPress={() => goToUserFeedDetail(index)} style={index % 3 === 1 ? { marginHorizontal: 1 } : {}}>
          <FeedImage size={feedSize} source={item?.imageUrls && item?.imageUrls[0] ? { uri: item.imageUrls[0] } : require("../../assets/basic.jpg")} />
        </TouchableOpacity>
      )}
    />
  );
};

export default UserFeed;
