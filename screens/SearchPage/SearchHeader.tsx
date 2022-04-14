import React from 'react';
import {Pressable, Text, TextInput, useWindowDimensions, View} from 'react-native';

function SearchHeader(){
    const{width}=useWindowDimensions();
    return(
        <View>
            <TextInput placeholder="검색어를 입력해라" autoFocus/>
            <Pressable>
                <Text>X</Text>
            </Pressable>
        </View>
    )
}
export default SearchHeader;