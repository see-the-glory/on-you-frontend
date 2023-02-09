import React, { useState } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";

const Container = styled.View``;

const Indicator = styled.View<{ focused: boolean }>`
  margin: 0px 4px;
  background-color: ${(props: any) => (props.focused ? "#FF6534" : "#E0E0E0")};
  width: 4px;
  height: 4px;
  border-radius: 2px;
`;

const IndicatorWrapper = styled.View`
  width: 50px;
  position: absolute;
  bottom: 15px;
  left: 50%;
  margin-left: -25px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

interface CarouselProps {
  pages: any;
  pageWidth: number;
  gap: number;
  offset: number;
  initialScrollIndex: number;
  renderItem?: any;
  keyExtractor: any;
  ListEmptyComponent?: any;
  showIndicator?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({ pages, pageWidth, gap, offset, renderItem, initialScrollIndex, keyExtractor, ListEmptyComponent, showIndicator }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialScrollIndex);
  const onScroll = (e: any) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / (pageWidth + gap));
    setCurrentIndex(newIndex);
  };

  return (
    <Container>
      <FlatList
        horizontal
        pagingEnabled
        automaticallyAdjustContentInsets={false}
        onScroll={onScroll}
        contentContainerStyle={{ paddingHorizontal: offset + gap == 0 ? 0 : (offset + gap) / 2 }}
        data={pages}
        decelerationRate="fast"
        keyExtractor={keyExtractor}
        snapToInterval={pageWidth + gap}
        snapToAlignment="start"
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialScrollIndex}
        getItemLayout={(data, index) => ({ length: pageWidth + gap, offset: (pageWidth + gap) * index, index })}
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
      />
      {showIndicator ? (
        <IndicatorWrapper>
          {pages?.map((page: any, index: number) => (
            <Indicator key={index} focused={index == currentIndex} />
          ))}
        </IndicatorWrapper>
      ) : (
        <></>
      )}
    </Container>
  );
};

export default Carousel;
