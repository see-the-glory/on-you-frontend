import React from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";

interface CarouselProps {
  pages: any;
  pageWidth: number;
  gap: number;
  offset: number;
  initialScrollIndex: number;
  renderItem?: any;
  keyExtractor: any;
}

const Carousel: React.FC<CarouselProps> = ({ pages, pageWidth, gap, offset, renderItem, initialScrollIndex, keyExtractor }) => {
  return (
    <FlatList
      horizontal
      pagingEnabled
      automaticallyAdjustContentInsets={false}
      contentContainerStyle={{ paddingHorizontal: offset + gap / 2 }}
      data={pages}
      decelerationRate="fast"
      keyExtractor={keyExtractor}
      snapToInterval={pageWidth + gap}
      snapToAlignment="start"
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={initialScrollIndex}
      getItemLayout={(data, index) => ({ length: pageWidth + gap, offset: (pageWidth + gap) * index, index })}
      renderItem={renderItem}
    />
  );
};

export default Carousel;
