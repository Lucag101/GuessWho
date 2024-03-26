import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import styles from './Styles'
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { AnimatedSVGPath } from "react-native-svg-animations"; // https://www.npmjs.com/package/react-native-svg-animations

const QuestionAdder = () => {

    const [questionList, setQuestionList] = useState([])
    const [showInstructionText, setShowInstructionText] = useState(true)
    const [showReadyGo, setShowReadyGo] = useState(false)
    const [showMainView, setShowMainView] = useState(false)
    const [newQuestion, setNewQuestion] = useState('')
    const newQuestionInput = useRef(null);
    // understanding useRef: https://chat.openai.com/share/396908db-3e64-4226-9171-37a0f38fe04b

    const readSetGo = ['Ready?', 'Set...', 'Go!']

    const [introText, setIntroText] = useState(readSetGo[0])
    const currentIndex = useRef(0);
    const startQuestions = () => {
        setShowInstructionText(false);
        setShowReadyGo(true);
        const interval = setInterval(() => {
            // Increment the index
            currentIndex.current += 1;
        
            // Check if the end of the array is reached
            if (currentIndex.current < readSetGo.length) {
                setIntroText(readSetGo[currentIndex.current]);
            } else {
                // Clear the interval and update showMainView
            //   clearInterval(interval);
                setShowReadyGo(false)
                setShowMainView(true);
                // addNewQuestion();
            }
        }, 800); // 3000 milliseconds = 3 seconds
        
        return () => clearInterval(interval); // Cleanup interval on component unmount

    }

    function addNewQuestion() {
        if (newQuestion != '') {
            setQuestionList([...questionList, newQuestion]);
        setNewQuestion('');
        }
        setTimeout(() => {
            newQuestionInput.current.focus();
        }, 1000);
    }

    // help with the timer: https://chat.openai.com/share/a3fe5711-5b6e-46ac-8b43-c7253284cd47
    const [timer, setTimer] = useState(10);
    useEffect(() => {
        if (showMainView) {
            const timerInterval = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        clearInterval(timerInterval); // Stop the interval when timer is less than or equal to 1
                        if (prevTimer === 0) {
                            // Schedule a console log for 5 seconds later only when the timer hits 0
                            setTimeout(() => {
                                console.log("time's up");
                                //function that occurs when timer is done.
                            }, 5000); // 5000 milliseconds = 5 seconds
                        }
                        return prevTimer; // Return the current timer value without decrementing
                    }
                    return prevTimer - 1; // Decrement the timer
                });
            }, 1000);

            return () => {
                clearInterval(timerInterval);
            };
        }
    }, [showMainView]);

    const customSlideInDown = {
        from: {
          translateY: -200, // Start off-screen
        },
        to: {
          translateY: 0, // End at its natural position
        },
    };

    //_______SUB VIEWS_________
    
    const [lastIndex, setLastIndex] = useState(-1);
    useEffect(() => {
      // Detect if new questions have been added
      if (questionList.length - 1 > lastIndex) {
        setLastIndex(questionList.length - 1); // Update the index of the last question
      }
    }, [questionList, lastIndex]);

    const mainView = () => {
        return (
            <View style={[styles.questionContainer]}>
                <Animatable.View
                    style={[styles.titleBox]}
                    animation={customSlideInDown}
                    // iterationCount={1} 
                    direction="normal" 
                    duration={600} // Duration in milliseconds
                    useNativeDriver={true}
                    delay={200}
                >
                    <Text style={[styles.instructionText]}> {timer} </Text>
                </Animatable.View>
                {/* <View style={styles.adderBox}>
                    <AnimatedSVGPath
                        strokeColor={"black"}
                        duration={5000}
                        strokeWidth={5}
                        strokeLinecap={"round"}
                        strokeDashArray={[42.76482137044271, 42.76482137044271]}
                        // height={200}
                        // width={200}
                        scale={1}
                        delay={100}
                        d={"M2 12 a10 10 0 0 1 10 -10 h280 a10 10 0 0 1 10 10 v76 a10 10 0 0 1 -10 10 h-280 a10 10 0 0 1 -10 -10 z"}
                        loop={false}
                    />
                </View> */}
                <View style={[styles.newQuestionBox]}>
                    <ScrollView>
                        {questionList.map((question, index) => {
                            const isLastAdded = index === lastIndex;
                            return(
                            <Animatable.View
                            key={index}
                            // animation="slideInUp"
                            animation={isLastAdded ? "slideInUp" : undefined}
                            iterationCount={1} 
                            direction="normal" 
                            duration={1000} // Duration in milliseconds
                            useNativeDriver={true}
                            >
                                <Text style={[styles.question]} key={index}> {question} </Text>
                            </Animatable.View>
                            )
                        })}
                    </ScrollView>
                </View>
                <View style={styles.adderBox}>
                    <TextInput
                        ref = {newQuestionInput}
                        style={[styles.inputBox, styles.inputBoxQuestion]}
                        onChangeText={setNewQuestion}
                        value={newQuestion}
                        placeholder="New question..."
                        placeholderTextColor="white"
                        maxLength={100}
                        autoCapitalize="sentences"
                        autoFocus={true}
                        // returnKeyType="done"
                        // onKeyPress={(newQuestion) => console.log(newQuestion)}
                        onSubmitEditing={() => addNewQuestion()}
                    />
                </View>

            </View>
        )
    }

    //_______MAIN VIEW__________
    return (
        <View style={[styles.main]}>
            <LinearGradient
            colors={['#b251db', '#757eff']}
            style={styles.background}
            >
                {showInstructionText && 
                (<View>
                    <Text style={[styles.instructions]}> 
                        You have 90 seconds to write as many questions as you can think up.
                        {'\n'}{'\n'}Other players will choose which questions to answer later on, so make them good.
                    </Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.slightButton} onPress={startQuestions}>
                            <Text style={[styles.buttonText]}>Start</Text>
                        </TouchableOpacity>
                    </View>
                </View>)}
                
                {showReadyGo && (<Text style={[styles.instructionText]}> {introText} </Text>)}
                {showMainView && mainView()}

            </LinearGradient>
        </View>
    )

}

export default QuestionAdder;