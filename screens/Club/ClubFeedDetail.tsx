import React, { useLayoutEffect } from "react";
import { FlatList, useWindowDimensions, View } from "react-native";
import styled from "styled-components/native";
import { Feed } from "../../api";
import CustomText from "../../components/CustomText";
import FeedDetail from "../../components/FeedDetail";
import { ClubFeedDetailScreenProps } from "../../Types/Club";

const HeaderTitleView = styled.View`
  justify-content: center;
  align-items: center;
  padding: 8px 0px;
`;
const HeaderClubName = styled(CustomText)`
  font-size: 14px;
  font-family: "NotoSansKR-Medium";
  color: #8e8e8e;
  line-height: 20px;
`;
const HeaderText = styled(CustomText)`
  font-size: 18px;
  font-family: "NotoSansKR-Medium";
  color: #2b2b2b;
  line-height: 25px;
`;

const ClubFeedDetail: React.FC<ClubFeedDetailScreenProps> = ({
  navigation: { setOptions, navigate },
  route: {
    params: { clubData, feedData, targetIndex },
  },
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  useLayoutEffect(() => {
    setOptions({
      headerTitle: () => (
        <HeaderTitleView>
          <HeaderClubName>{clubData.name}</HeaderClubName>
          <HeaderText>게시글</HeaderText>
        </HeaderTitleView>
      ),
    });
  }, []);

  return (
    <FlatList
      // refreshing={refreshing}
      // onRefresh={onRefresh}
      // onEndReached={loadMore}
      data={feedData}
      ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
      ListFooterComponent={() => <View style={{ height: 60 }} />}
      keyExtractor={(item: Feed, index: number) => String(index)}
      renderItem={({ item, index }: { item: Feed; index: number }) => <FeedDetail feedData={item} feedSize={SCREEN_WIDTH} />}
      initialScrollIndex={targetIndex}
    />
  );
};

export default ClubFeedDetail;
