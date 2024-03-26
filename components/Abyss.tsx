import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StatusBar, View, Text, StyleSheet, useWindowDimensions, Dimensions, Button, TouchableOpacity, TextInput, ScrollView} from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import {useDerivedValue, useSharedValue, withTiming} from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets,  } from 'react-native-safe-area-context';
import { Canvas, Paint, Rect, runSpring, useValue, LinearGradient, vec, runTiming  } from '@shopify/react-native-skia';


const Abyss = ({children, mode}) => {
    // const {width, height} = useWindowDimensions();
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const insets = useSafeAreaInsets();

    let topColor = useSharedValue(mode == 'dark' ? '#080a2b' : '#767de8')
    let bottomColor = useSharedValue(mode == 'dark' ? '#370a4a' : '#edc2ff')
    const colorPair = useDerivedValue(() => {
        return [topColor.value, bottomColor.value];
    },[]);
    
    useFocusEffect(
        useCallback(() => {
            randomColorPicker
            const intervalId = setInterval(() => {
                // console.log('changing')
                randomColorPicker()
                //set topColor/bottomColor to different values
            }, 5000);
        },[])
    );

    const [colorOptions, setColorOptions] = useState(()=> {
        if (mode === 'dark') {
            return ['#080a2b', '#370a4a','#06000f','#4f3175', '#12154d', '#16011f', '#060a47','#150185','#2d2e45', '#2b1757','#270540','#310140','#380433','#462e73','#8b0d9e' ];
        } else {
            return ['#888eeb','#e6bcf7','#8f62d1','#f0e8fa', '#abadcc', '#cc68f7', '#fcfdff', '#8976f5','#b2b2b8','#bba3f0','#d425f7','#f2c9ff','#e3badf', '#cdbbf0','#fad6ff'];
        }
    });

    const randomColorPicker = () => {
        let randomColor1 = Math.floor(Math.random() * 15)
        let randomColor2 = Math.floor(Math.random() * 15)
        let randomMilliseconds = Math.floor(Math.random() * 2000)
        topColor.value = withTiming(colorOptions[randomColor1], {
            duration: 5000})
        setTimeout(() => {
            bottomColor.value = withTiming(colorOptions[randomColor2], {
                duration: 5000})
        }, randomMilliseconds);
    };
    
    return (
        <>
            <StatusBar barStyle="light-content" /> 
            <SafeAreaView style={{ flex: 1, backgroundColor: "black"}}>
                <View style={{flex:1}}>
                    <Canvas style={{...waitingStyles.main}}>
                        <Rect x={0} y={0} width={width} height={height}>
                            <LinearGradient
                                start={vec(0,0)}
                                end={vec(width, height)}
                                colors={colorPair}
                            ></LinearGradient>
                        </Rect>
                    </Canvas>
                    {children} 
                </View>
            </SafeAreaView>
        </>
    )
}

const waitingStyles = StyleSheet.create({
    main: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        flex: 1
    }
})

export default Abyss;

//Referance: https://www.youtube.com/watch?v=ZSPvvGU2LBg