import React from "react";
import styled from "styled-components/native";
import CustomText from "./CustomText";
import { Club, Notification } from "../api";
import moment from "moment";

const Item = styled.View``;
const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const ItemTitle = styled(CustomText)`
  color: #8e8e8e;
`;
const ItemDateText = styled(CustomText)`
  font-size: 10px;
  line-height: 14px;
  color: #9a9a9a;
`;
const TextView = styled.View`
  flex-direction: row;
`;
const ItemText = styled(CustomText)<{ processDone: boolean }>`
  font-size: 14px;
  line-height: 20px;
  ${(props: any) => (props.processDone ? "color: #8E8E8E" : "")};
`;
const ItemBoldText = styled(ItemText)`
  font-family: "NotoSansKR-Bold";
`;

interface NotificationItemProps {
  notificationData: Notification;
  clubData: Club;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notificationData, clubData }) => {
  if (notificationData?.actionType === "APPLY") {
    return (
      <Item>
        <Header>
          <ItemTitle>가입희망</ItemTitle>
          <ItemDateText>{moment(notificationData?.created, "YYYY-MM-DDThh:mm:ss").fromNow()}</ItemDateText>
        </Header>
        <TextView>
          <ItemBoldText processDone={notificationData?.processDone}>{notificationData?.actionerName}</ItemBoldText>
          <ItemText processDone={notificationData?.processDone}>{`님이 `}</ItemText>
          <ItemBoldText processDone={notificationData?.processDone}>{clubData?.name}</ItemBoldText>
          <ItemText processDone={notificationData?.processDone}>{` 가입을 희망합니다.`}</ItemText>
        </TextView>
      </Item>
    );
  } else {
    return <></>;
  }
};

export default NotificationItem;
