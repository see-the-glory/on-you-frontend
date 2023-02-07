import React from "react";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";
import CustomText from "./CustomText";

const BundleContainer = styled.View<{ size: number; kerning: number; opacity: number }>`
  height: ${(props: any) => props.size}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-left: ${(props: any) => -props.kerning}px;
  opacity: ${(props: any) => props.opacity};
`;

const Container = styled.View<{ kerning: number; zIndex: number }>`
  position: relative;
  justify-content: center;
  align-items: center;
  margin-left: ${(props: any) => props.kerning}px;
  z-index: ${(props: any) => props.zIndex};
`;
const Backplate = styled.View<{ size: number }>`
  width: ${(props: any) => props.size}px;
  height: ${(props: any) => props.size}px;
  border-radius: ${(props: any) => Math.ceil(props.size / 2)}px;
  justify-content: center;
  align-items: center;
  border: 1px;
  border-color: rgba(0, 0, 0, 0);
  box-shadow: 1px 1px 1px gray;
  elevation: 10;
  background-color: white;
`;

const IconImage = styled(FastImage)<{ size: number }>`
  width: ${(props: any) => props.size - 2}px;
  height: ${(props: any) => props.size - 2}px;
  border-radius: ${(props: any) => Math.ceil(props.size / 2)}px;
`;

const EmptyCircleView = styled.View<{ size: number }>`
  width: ${(props: any) => props.size - 2}px;
  justify-content: center;
  align-items: center;
  height: ${(props: any) => props.size - 2}px;
  border-radius: ${(props: any) => Math.ceil(props.size / 2)}px;
  background-color: #6f6f6f;
`;

const EmptyCircleText = styled(CustomText)`
  font-family: "NotoSansKR-Medium";
  font-size: 9px;
  line-height: 12px;
  color: white;
`;

interface CircleIconBundleProps {
  size: number;
  uris?: string[];
  badge?: "check-circle" | "stars";
  kerning?: number;
  opacity?: number;
}

const CircleIconBundle: React.FC<CircleIconBundleProps> = ({ size, uris, kerning, opacity }) => {
  return (
    <BundleContainer size={size} kerning={kerning ?? 0} opacity={opacity ?? 1}>
      {uris?.slice(0, 10).map((uri, index) => (
        <Container key={index} kerning={kerning ?? 0} zIndex={-index}>
          <Backplate size={size}>
            <IconImage source={uri ? { uri: uri } : require("../assets/basic.jpg")} size={size} />
          </Backplate>
        </Container>
      ))}
      {uris && uris.length > 0 ? (
        <Container key={uris.length} kerning={kerning ? -4 : 0} zIndex={-uris.length}>
          <Backplate size={size}>
            <EmptyCircleView size={size}>
              <EmptyCircleText>{`+${uris.length}`}</EmptyCircleText>
            </EmptyCircleView>
          </Backplate>
        </Container>
      ) : (
        <></>
      )}
    </BundleContainer>
  );
};

export default CircleIconBundle;
