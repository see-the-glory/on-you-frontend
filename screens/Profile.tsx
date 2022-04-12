import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import styled from "styled-components/native";

const Container = styled.SafeAreaView`
  position: relative;
  flex-direction: column;
  height: 100%;
`;

const Screen =styled.View`
  background-color: black;
  height: 1000%;
`

const Header =styled.View`
  flex-direction: row;
`

const ProfileImg=styled.Image`
  width: 150px;
  height: 150px;
  border-radius: 100px;
  top: 40px;
  left: 20px;
`
const ProfileText=styled.View`
  flex-direction: column;
  left: 40px;
  top: 40px;
`

const Content=styled.Text`
  color: white;
  margin-top: 10px;
  font-size: 20px;
`
const Interest=styled.View`
  position: relative;
  top: 100px;
`

const InterestTitle=styled.Text`
  color: white;
  font-size: 30px;
`

const InterestList=styled.Text`
  color: white;
  top: 10px;
  font-size: 20px;
  margin-top: 20px;
`

const MyGroup=styled.Text`
  top: 200px;
`

export default function Profile(){
    const [text,onChangeText]=React.useState("");
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isPress, setIsPress] = React.useState(true);

    const onChangeSearch = query => setSearchQuery(query);
    return(
        <Container>
            <ScrollView>
                <Screen>
                    <Header>
                        {/*<Image style={styles.logo} source={logo}/>*/}
                        <Text style={{
                            color:'white',
                            fontSize: 40,
                            fontWeight: "bold",
                        }}>OnYou</Text>
                    </Header>
                    <Header>
                        <View>
                            <ProfileImg source={{uri: 'https://i.pinimg.com/564x/79/3b/74/793b74d8d9852e6ac2adeca960debe5d.jpg'}}/>
                        </View>
                        <ProfileText>
                            <Content>이름: 문규빈</Content>
                            <Content>성별: 남</Content>
                            <Content>생년월일: 1995.09.23</Content>
                            <Content>교회: 시광교회</Content>
                        </ProfileText>
                    </Header>
                    <Interest>
                        <View>
                            <InterestTitle>관심사</InterestTitle>
                        </View>
                        <View>
                            <InterestList >독서</InterestList>
                            <InterestList >코딩</InterestList>
                            <InterestList >운동</InterestList>
                        </View>
                    </Interest>
                    <MyGroup >
                        <InterestTitle>내가 속한 모임</InterestTitle>
                    </MyGroup>
                </Screen>
            </ScrollView>
        </Container>

    )
}
