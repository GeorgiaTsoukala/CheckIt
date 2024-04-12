import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth, datab } from '../firebase';
import { MaterialIcons } from '@expo/vector-icons';
import globalStyles from '../globalStyles';
import { doc, getDoc } from 'firebase/firestore';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [goals, setGoals] = useState([]);
  const [activeButton, setActiveButton] = useState("");

  useEffect(() => {
    updateScreen();
  }, []);

  const updateScreen = async () => {
    const response = await getDoc(doc(datab, "users", auth.currentUser.uid));
    if (response?.data() && response.data().name) {      
      setName(response.data().name);
    }
  };

  const handleSignOut = async () => {
    try {      
      await signOut(auth).then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'IconGetStarted' }]
        });
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleButtonPress = async (buttonName) => {
    try {
      // Fetch goals based on the button pressed
      const response = await getDoc(doc(datab, "users", auth.currentUser.uid, "categories", buttonName));
      if (response?.data() && response.data().goals) {      
        setGoals(response.data().goals);
      } else {
        setGoals([]);
      }
      setActiveButton(buttonName);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  return (
    <View style={globalStyles.body}>
      <View style={globalStyles.center}>
        <MaterialIcons
          name="logout"
          size={20}
          style={{
            alignSelf: "flex-end",
            marginTop: 25,
            marginRight: 25,
            color: "black",
          }}
          onPress={handleSignOut}
        />
        <Text style={globalStyles.title}>Hello {name}</Text>
        <Text style={globalStyles.subtitle}>You are doing great so far!</Text>
        <ScrollView 
          horizontal={true} 
          contentContainerStyle={styles.buttonContainer}
          snapToAlignment={'start'} // Align the left edge of the content to the left side of the ScrollView
          snapToInterval={'27%'}
        >
          <TouchableOpacity 
            style={[styles.button, activeButton === 'Health' ? styles.activeButton : null]} 
            onPress={() => handleButtonPress('Health')}
          >
            <Text style={[styles.buttonText, activeButton === 'Health' ? styles.activeButtonText : null]}>Health</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, activeButton === 'Productivity' ? styles.activeButton : null]} 
            onPress={() => handleButtonPress('Productivity')}
          >
            <Text style={[styles.buttonText, activeButton === 'Productivity' ? styles.activeButtonText : null]}>Productivity</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, activeButton === 'Finance' ? styles.activeButton : null]} 
            onPress={() => handleButtonPress('Finance')}
          >
            <Text style={[styles.buttonText, activeButton === 'Finance' ? styles.activeButtonText : null]}>Finance</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, activeButton === 'Intellect' ? styles.activeButton : null]} 
            onPress={() => handleButtonPress('Intellect')}
          >
            <Text style={[styles.buttonText, activeButton === 'Intellect' ? styles.activeButtonText : null]}>Intellect</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, activeButton === 'Creativity' ? styles.activeButton : null]} 
            onPress={() => handleButtonPress('Creativity')}
          >
            <Text style={[styles.buttonText, activeButton === 'Creativity' ? styles.activeButtonText : null]}>Creativity</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Display goals or message */}
      <View style={styles.goalsContainer}>
        {goals.length > 0 ? (
          <>
            <Text style={styles.goalsTitle}>{activeButton} Goals</Text>
            {goals.map((goal, index) => (
              <View key={index} style={styles.goalBox}>
                <Text>{goal}</Text>
                {/* Add additional information and progress bar here */}
              </View>
            ))}
          </>
        ) : (
          <Text style={styles.noGoalsText}>No goals selected for {activeButton}</Text>
        )}
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: '100%'
  },
  button: {
    backgroundColor: '#8E2EA6',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    width: '25%',
  },
  buttonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'light',
  },
  activeButton: {
    backgroundColor: '#FFFFFF',
  },
  activeButtonText: {
    color: 'black',
  },
  goalsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  goalsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  goalBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  noGoalsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});



