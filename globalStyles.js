import { StyleSheet } from 'react-native';

// Define the color palette
export const colors = {
    grey50: '#F3F3F3',
    grey100: '#EBEBEB',
    grey200: '#C6C6C6',
    grey400: '#9B9B9B',
    grey600: '#727272',
    grey800: '#4B4B4B',
    health: '#ACF9AF',
  };

const globalStyles = StyleSheet.create({
    // body
    body: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: colors.grey50,
    },

    // header
    center: {
        alignItems: 'center',
    },
    title: {
        color: 'black',
        fontSize: 32,
        fontWeight: 'bold',
    },
    subtitle: {
        width: '70%',
        marginTop: 25,
        marginBottom: 50,
        fontSize: 18,
        color: colors.grey600,
        textAlign: 'center', 
    },

    // button    
    btnContainer: {
        position: 'absolute', 
        bottom: 70, 
        width: '100%'
    },
    button: {
        width: '40%',
        // backgroundColor: '#D7B4EC',
        // padding: 15,
        // borderRadius: 50,
        // alignItems: 'center',
    },
    btnText: {
        fontSize: 18,
        color: colors.grey50,
      },

    // input
    inputContainer: {
        width: "80%",
      },
    input: {
        backgroundColor: "white",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
      },
});

export default globalStyles;
