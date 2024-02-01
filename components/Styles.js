import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    main : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        paddingVertical : '10%',
    },
    button: {
        borderRadius:10,
        borderWidth: 2,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: "80%",
    },
    newButton: {
        backgroundColor: "#b184e8",
        borderColor: "#d7bff5"
    },
    joinButton: {
        backgroundColor: "#f0afd2",
        borderColor: "#ffdbef"
    },
    slightButton: {
        borderWidth: 2,
        borderRadius: 30,
        // margin: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#b184e8",
        borderColor: "#d7bff5",
    },
    slightButtonAdjust:  {
        borderRadius:100,
        maxWidth: "20%",
    },
    buttonText: {
        color: "white",
        fontSize: 40,
        textShadowOffset:{width: 0, height: 0},
        textShadowRadius:10,
        paddingHorizontal: 10,
        fontFamily: "sans-serif-light", //options: sans-serif-thin, normal
    },
    newText: {
        textShadowColor : "#9886b0",
        padding: 10,
    },
    joinText: {
        textShadowColor : "#c295ae",
        padding: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
    },
    header: {
        fontSize: 60,
        fontWeight: 'bold',
        color:  '#723ca3', // '#170838',
        marginBottom: 20,
        fontFamily: "sans-serif-thin",
        textShadowOffset:{width: 0, height: 0},
        textShadowRadius:8,
        textShadowColor : "white",
        textAlign: 'center',
    },
    newGamePopup: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        padding: 25,
        marginBottom: 50,
    },
    textInput:{
        color: 'white',
        fontSize: 30,
        marginBottom: 20,
    },
    inputBox: {
        height: 60,
        borderWidth: 1,
        borderColor: 'white',
        color: 'white',
        paddingHorizontal: 10,
        borderRadius: 10,
        fontSize: 22,
        marginBottom: 20,
    },
    gameCode: {
        fontSize: 90,
    }
});