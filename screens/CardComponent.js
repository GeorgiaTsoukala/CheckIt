import React from 'react';
import { Dimensions, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Card = ({ category, goals, checkboxStates, onToggle, savedData }) => {
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
                disabled = {savedData} // not working yet!
                onPress={() => onToggle(index)}
                style={styles.containerCheckBox}
              >
                {/* Display checkbox based on state */}
                {checkboxStates[index] ?
                  <MaterialIcons name="check-box" size={28} color="#8E2EA6" />
                  :
                  <MaterialIcons name="check-box-outline-blank" size={28} color="#8E2EA6" />
                }
              </TouchableOpacity>
              : <MaterialIcons name="check-box-outline-blank" size={28} color="grey" />
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
        flex: 1, 
        flexDirection: 'column', 
        marginBottom: 16,
        marginHorizontal: 20, 
        borderRadius: 16,
        backgroundColor: cardIsActive ? '#ffffff' : '#d3d3d3', 
        opacity: cardIsActive ? 1 : 0.5,
        padding: 24 
    }),

    cardTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 20
    },

    // goals
    goalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    goalTxt: {
        fontSize: 16,
        marginLeft: 20,
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
})
