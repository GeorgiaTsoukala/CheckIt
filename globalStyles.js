import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
    // body
    body: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#F6E8F3',
    },

    // header
    center: {
        alignItems: 'center',
    },
    title: {
        color: '#63086B',
        fontSize: 32,
    },
    subtitle: {
        width: '70%',
        marginTop: 32,
        marginBottom: 50,
        fontSize: 18,
        textAlign: 'center', 
    },

    // button
    button: {
        width: '60%',
        backgroundColor: '#AA7DC6',
        padding: 15,
        borderRadius: 50,
        alignItems: 'center',
    },
    btnText: {
        fontSize: 20,
        fontWeight: '500',
    },
    btnContainer: {
        position: 'absolute', 
        bottom: 30, 
        width: '100%'
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
