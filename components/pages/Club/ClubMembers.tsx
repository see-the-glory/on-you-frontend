import { Entypo } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { TouchableOpacity, useWindowDimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { Member } from "../../../api";
import { ClubStackParamList } from "../../../navigation/ClubStack";
import CircleIcon from "../../atoms/CircleIcon";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const MemberLineView = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 25px;
  margin-top: 2px;
`;
const TitleView = styled.View`
  margin-bottom: 10px;
`;
const Title = styled.Text`
  font-size: 13px;
  color: #bababa;
`;
const MemberTextView = styled.View`
  margin-left: 5px;
  margin-bottom: 20px;
`;
const MemberText = styled.Text`
  font-size: 11px;
  line-height: 17px;
  color: #b0b0b0;
`;

const ClubMembers: React.FC<NativeStackScreenProps<ClubStackParamList, "ClubMembers">> = ({
  route: {
    params: { members },
  },
  navigation: { setOptions, goBack, push },
}) => {
  const MEMBER_ICON_KERNING = 20;
  const MEMBER_ICON_SIZE = 40;
  const SCREEN_PADDING_SIZE = 20;
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const [memberData, setMemberData] = useState<Member[][]>();
  const [managerData, setManagerData] = useState<Member[][]>();
  const [masterData, setMasterData] = useState<Member>();
  const memberCountPerLine = Math.floor((SCREEN_WIDTH - SCREEN_PADDING_SIZE) / (MEMBER_ICON_SIZE + MEMBER_ICON_KERNING));

  useEffect(() => {
    const memberList: Member[] = [];
    const managerList: Member[] = [];
    const memberBundle: Member[][] = [];
    const managerBundle: Member[][] = [];
    for (let i = 0; i < members?.length; ++i) {
      if (members[i].role?.toUpperCase() === "MASTER") {
        setMasterData(members[i]);
      } else if (members[i].role?.toUpperCase() === "MANAGER") {
        managerList.push(members[i]);
      } else if (members[i].role?.toUpperCase() === "MEMBER") {
        memberList.push(members[i]);
      }
    }
    for (var i = 0; i < memberList.length; i += memberCountPerLine) {
      memberBundle.push(memberList.slice(i, i + memberCountPerLine));
    }
    for (var i = 0; i < managerList.length; i += memberCountPerLine) {
      managerBundle.push(managerList.slice(i, i + memberCountPerLine));
    }
    setMemberData(memberBundle);
    setManagerData(managerBundle);

    console.log(memberBundle);
    console.log(managerBundle);
  }, []);

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);

  const goToProfile = (userId: number) => push("ProfileStack", { screen: "Profile", params: { userId } });

  return (
    <Container>
      <ScrollView contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING_SIZE }}>
        <TitleView>
          <Title>Leader</Title>
        </TitleView>
        {masterData ? (
          <MemberLineView>
            <CircleIcon onPress={() => goToProfile(masterData?.id)} size={MEMBER_ICON_SIZE} uri={masterData?.thumbnail} name={masterData?.name} badge={masterData?.role} />
          </MemberLineView>
        ) : (
          <MemberTextView>
            <MemberText>리더가 없습니다.</MemberText>
          </MemberTextView>
        )}
        {managerData?.length ?? 0 > 0 ? (
          <TitleView>
            <Title>Manager</Title>
          </TitleView>
        ) : null}
        {managerData?.length ?? 0 > 0
          ? managerData?.map((bundle, index) => {
              return (
                <MemberLineView key={index}>
                  {bundle.map((item, index) => {
                    return (
                      <CircleIcon key={index} onPress={() => goToProfile(item?.id)} size={MEMBER_ICON_SIZE} uri={item?.thumbnail} name={item?.name} kerning={MEMBER_ICON_KERNING} badge={item?.role} />
                    );
                  })}
                </MemberLineView>
              );
            })
          : null}

        {memberData?.length ?? 0 > 0 ? (
          <TitleView>
            <Title>Member</Title>
          </TitleView>
        ) : null}
        {memberData?.length ?? 0 > 0
          ? memberData?.map((bundle, index) => {
              return (
                <MemberLineView key={index}>
                  {bundle.map((item, index) => {
                    return <CircleIcon key={index} onPress={() => goToProfile(item?.id)} size={MEMBER_ICON_SIZE} uri={item?.thumbnail} name={item?.name} kerning={MEMBER_ICON_KERNING} />;
                  })}
                </MemberLineView>
              );
            })
          : null}
      </ScrollView>
    </Container>
  );
};

export default ClubMembers;
