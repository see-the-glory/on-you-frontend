import { Entypo } from "@expo/vector-icons";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { LikeUser } from "../../api";
import CircleIcon from "../../components/CircleIcon";
import CustomText from "../../components/CustomText";

const Container = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const NameText = styled(CustomText)`
  font-family: "NotoSansKR-Medium";
  font-size: 14px;
  line-height: 20px;
`;

const FeedLikes = ({
  navigation: { setOptions, navigate, goBack },
  route: {
    params: { likeUsers },
  },
}) => {
  const keyExtractor = useCallback((item: LikeUser, index: number) => String(index), []);
  const ItemSeparatorComponent = useCallback(() => <View style={{ height: 10 }} />, []);
  const renderItem = useCallback(
    ({ item, index }: { item: LikeUser; index: number }) => (
      <Container>
        <CircleIcon size={38} uri={item.thumbnail} kerning={8} />
        <NameText>{item.userName}</NameText>
      </Container>
    ),
    []
  );

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
    <FlatList
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 15 }}
      data={likeUsers}
      ItemSeparatorComponent={ItemSeparatorComponent}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      removeClippedSubviews={true}
    />
  );
};

export default FeedLikes;
