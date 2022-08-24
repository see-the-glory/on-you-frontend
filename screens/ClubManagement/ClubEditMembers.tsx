import React, { useEffect, useMemo, useState } from "react";
import { FlatList, SectionList, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import styled from "styled-components/native";
import { Member } from "../../api";
import CircleIcon from "../../components/CircleIcon";
import CustomText from "../../components/CustomText";
import { ClubEditMembersProps, MemberBundle } from "../../types/Club";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const Header = styled.View`
  justify-content: center;
  align-items: center;
  padding: 10px 0px;
`;

const HeaderText = styled(CustomText)`
  font-size: 9px;
  color: #959595;
`;
const ContentItem = styled.View<{ col: number }>`
  flex: ${(props) => 1 / props.col};
  justify-content: center;
  align-items: flex-start;
`;

const ItemTitleView = styled.View`
  width: 100%;
  background-color: white;
  border-bottom-width: 1px;
  border-bottom-color: #cecece;
`;

const ItemTitle = styled(CustomText)`
  font-size: 10px;
  line-height: 16px;
  color: #b0b0b0;
`;

const SectionText = styled(CustomText)`
  padding: 15px 0px;
  text-align: center;
  font-size: 9px;
  line-height: 15px;
  color: #b0b0b0;
`;

const ItemText = styled(CustomText)`
  font-size: 9px;
  line-height: 15px;
  padding: 8px 0px;
  color: #8c8c8c;
`;

interface MemberBundle {
  title: string;
  data: MemberList[];
}

interface MemberList {
  list: Member[];
}

const ClubEditMembers: React.FC<ClubEditMembersProps> = ({
  navigation: { navigate, setOptions, goBack },
  route: {
    params: { clubData },
  },
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [bundles, setBundles] = useState<MemberBundle[]>();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const ICON_SIZE = 45;
  const DEFAULT_PADDING = 40;
  const COLUMN_SIZE = Math.floor((SCREEN_WIDTH - DEFAULT_PADDING) / (ICON_SIZE + 10));

  const save = () => {
    console.log(clubData.members);
    onRefresh();
  };

  const onRefresh = () => {
    setRefreshing(true);
    console.log("refresh!");
    setMemberData();
    setRefreshing(false);
  };

  const setMemberData = () => {
    console.log("set member data!");

    const masters: Member[] = [];
    const managers: Member[] = [];
    const members: Member[] = [];

    clubData.members.map((member) => {
      if (member.role === "MASTER") masters.push(member);
      else if (member.role === "MANAGER") managers.push(member);
      else members.push(member);
    });

    setBundles([
      {
        title: "MASTER",
        data: masters.division(COLUMN_SIZE).map((list) => {
          return { list };
        }),
      },
      {
        title: "MANAGER",
        data: managers.division(COLUMN_SIZE).map((list) => {
          return { list };
        }),
      },
      {
        title: "MEMBER",
        data: members.division(COLUMN_SIZE).map((list) => {
          return { list };
        }),
      },
    ]);
  };

  useEffect(() => {
    setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={save}>
          <CustomText style={{ color: "#2995FA", fontSize: 14, lineHeight: 20 }}>저장</CustomText>
        </TouchableOpacity>
      ),
    });
    setMemberData();
  }, []);

  const loading = bundles?.length === 0 ? true : false;

  return (
    <Container>
      <Header>
        <HeaderText>모임 리더와 매니저는 회원 관리와 모임 관리의 권한이 있습니다.</HeaderText>
      </Header>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <SectionList
          refreshing={refreshing}
          onRefresh={onRefresh}
          sections={bundles}
          keyExtractor={(item: MemberList, index: number) => String(index)}
          contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 20, width: "100%" }}
          renderSectionHeader={({ section: { title } }) => (
            <ItemTitleView>
              <ItemTitle>{title}</ItemTitle>
            </ItemTitleView>
          )}
          renderSectionFooter={({ section: { data } }) => (data.length === 0 ? <SectionText>비어 있습니다.</SectionText> : null)}
          SectionSeparatorComponent={() => <View style={{ height: 15 }} />}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          renderItem={({ item }: { item: MemberList }) => (
            <FlatList
              key={COLUMN_SIZE}
              data={item.list}
              numColumns={COLUMN_SIZE}
              keyExtractor={(item: Member, index: number) => String(index)}
              renderItem={({ item }: { item: Member }) => (
                <ContentItem col={COLUMN_SIZE}>
                  {item.role !== null && item.role !== "MEMBER" ? (
                    <CircleIcon size={ICON_SIZE} uri={item.thumbnail} name={item.name} badge={item.role === "MASTER" ? "stars" : "check-circle"} />
                  ) : (
                    <CircleIcon size={ICON_SIZE} uri={item.thumbnail} name={item.name} />
                  )}
                </ContentItem>
              )}
            />
          )}
        />
      )}
    </Container>
  );
};

Array.prototype.division = function (n) {
  var arr = this;
  var len = arr.length;
  var cnt = Math.floor(len / n) + (Math.floor(len % n) > 0 ? 1 : 0);
  var tmp = [];

  for (var i = 0; i < cnt; i++) {
    tmp.push(arr.splice(0, n));
  }

  return tmp;
};

export default ClubEditMembers;
