import React from "react";
import styled from "styled-components/native";
import CustomText from "./CustomText";
import { Club, Notification } from "../api";

const Item = styled.View``;
const ItemTitle = styled(CustomText)`
  color: #8e8e8e;
`;
const TextView = styled.View`
  flex-direction: row;
`;
const ItemText = styled(CustomText)`
  font-size: 14px;
  line-height: 20px;
`;
const ItemBoldText = styled(CustomText)`
  font-size: 14px;
  line-height: 20px;
  font-family: "NotoSansKR-Bold";
`;

interface NotificationItemProps {
  notificationData: Notification;
  clubData: Club;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notificationData, clubData }) => {
  if (notificationData.actionType === "APPLY") {
    return (
      <Item>
        <ItemTitle>가입희망</ItemTitle>
        <TextView>
          <ItemBoldText>{notificationData.actionerName}</ItemBoldText>
          <ItemText>{`님이 `}</ItemText>
          <ItemBoldText>{clubData.name}</ItemBoldText>
          <ItemText>{` 가입을 희망합니다.`}</ItemText>
        </TextView>
      </Item>
    );
  } else {
    return <></>;
  }
};

export default NotificationItem;
