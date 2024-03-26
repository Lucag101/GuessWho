import { View, Text} from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import Abyss from './Abyss';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styles from './Styles'

const Instructions = () => {
    const navigation = useNavigation();

    let instructionList1 = ["Welcome!\n\nIn case you've never played, let's go over the instructions", 
                            "First, you'll be given a set of prompts and have 45 seconds to respond to each of them",
                            "After submitting, you'll see the anonymous responses of all other players",
                            "Next, you'll award points to your favorite response",
                            "You will also get points for correctly guessing which player said what",
                            "You have 45 seconds per prompt\n\nGood luck!"]
    const [instructionText, setInstructionText] = useState(instructionList1[0])
    const currentIndex = useRef(0);
        
    useFocusEffect(
        useCallback(() => {
            const interval = setInterval(() => {
                currentIndex.current += 1;
            
                // Check if the end of the array is reached
                if (currentIndex.current < instructionList1.length) {
                    setInstructionText(instructionList1[currentIndex.current]);
                } else {
                    console.log('end of instructions')
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'QuestionAnswer' }],
                    });
                    // navigation.navigate("QuestionAnswer");
                    clearInterval(interval);
                }
            }, 500); 
            return () => clearInterval(interval);
        },[])
    );

    return(
        <Abyss mode={'dark'}>
            <View style={[styles.main, styles.background]}>
                <Text style={[styles.instructions]}>{instructionText}</Text>
            </View>
        </Abyss>
    )
};

export default Instructions;