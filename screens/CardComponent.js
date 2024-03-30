import React from 'react';
import { Dimensions, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Card = ({ category, goals, checkboxStates, onToggle }) => {
  const cardIsActive = category == 'Health';

  return (   
    <View style={styles.cardContainer(cardIsActive)}>
      <View>
        <Text style={styles.cardTitle}>{category}</Text>
      </View>
      <View>
        {goals.map((goal, index) => (
          <View key={index} style={styles.goalContainer}>
            {cardIsActive ?
              <TouchableOpacity 
                onPress={() => onToggle(index)} 
                style={styles.containerCheckBox}
              >
                {/* Display checkbox based on state */}
                {checkboxStates[index] ?
                  <AntDesign name="checksquare" size={24} color="#8E2EA6" />
                  :
                  <AntDesign name="checksquareo" size={24} color="#8E2EA6" />
                }
              </TouchableOpacity>
              : <View style={styles.checkBoxInactive} />
            } 
              <Text style={styles.goalTxt}>{goal}</Text>
            </View>
        ))}
      </View>
    </View>
  );
};

export default Card

const styles = StyleSheet.create({
    // card
    cardContainer: cardIsActive => ({ 
        maxWidth: width/2 -10 ,
        flex: 1, 
        flexDirection: 'column', 
        marginVertical: 5, 
        marginHorizontal: 5, 
        backgroundColor: cardIsActive ? '#A2B1F760' : '#d3d3d3', 
        borderRadius: 20,
        opacity: cardIsActive ? 1 : 0.5,
        padding: 16 
    }),
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 5
    },

    // goals
    goalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    goalTxt: {
        fontSize: 16,
        marginLeft: 10,
        flex: 1,
        flexWrap: 'wrap',
    },
    containerCheckBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkBox: {
        width: 24,
        height: 24,
        borderRadius: 5,
        borderWidth: 3,
        borderColor: '#d0b8e6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkBoxInactive: {
        width: 24,
        height: 24,
        borderRadius: 5,
        borderWidth: 3,
        borderColor: '#a9a9a9',
        justifyContent: 'center',
        alignItems: 'center',
    },
})
