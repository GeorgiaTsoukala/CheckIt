import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Image, FlatList, ScrollView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, datab } from '../../firebase';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import Toast from 'react-native-simple-toast';
import globalStyles, { MyCheckbox, colors } from '../../globalStyles';
import { Button, Chip, Divider } from 'react-native-paper';

const GoalsScreen = () => {
  const navigation = useNavigation();
  const carouselRef = useRef(null);

  const [categories, setCategories] = useState([]); //stores selected categories
  const [filteredData, setFilteredData] = useState([]); //stores data (title:..., goals:[...]) of chosen categories
  const [goalStates, setGoalStates] = useState({}); //stores checkboxes states
  const [page, setPage] = useState(0); //stores carousel paging

  const [selectedCategory, setSelectedCategory] = useState(null); //selected category from Chip to be displayed


  useEffect(() => {

    setSelectedCategory('Health')

    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(datab, "users", auth.currentUser.uid, "categories"));
        const categoryList = [];
        querySnapshot.forEach((doc) => {
          categoryList.push(doc.id);  
        });
        setCategories(categoryList);
      } catch (error) {
        console.error('Error fetching selected categories:', error);
      }
    }

    fetchCategories();

  }, []);

  useEffect(() => {
    const data = [
      { title: 'Health', goals: ['Meditate', 'Exercise', 'Drink enough water', 'Get enough sleep', 'Eat healthy'] },
      { title: 'Productivity', goals: ['Study', 'Work', 'Do hobbies', 'Schedule my time', 'Reserve time for important tasks'] },
      { title: 'Intellect', goals: ['Go to cinema', 'Go to theater', 'Read a book', 'Read the news'] },
      { title: 'Finance', goals: ['Save some money', 'No impulse buys'] },
      { title: 'Creativity', goals: ['Do some DIY', 'Paint', 'Crochet'] }
      // Add more categories if needed
    ];
   
    const filteredD = data.filter(category => categories.includes(category.title))
    setFilteredData(filteredD)

    setGoalStates(filteredD.map(category => category.goals.map(() => false)))

  }, [categories]) 

  const handleToggle = (categoryIndex, goalIndex) => {
    const newGoalStates = [...goalStates];
    newGoalStates[categoryIndex][goalIndex] = !newGoalStates[categoryIndex][goalIndex];
    setGoalStates(newGoalStates);
  };

  const chipColor = {
    'Productivity': colors.productivity,
    'Health': colors.health,
    'Finance': colors.finance,
    'Creativity': colors.creativity,
    'Intellect': colors.intellect
  }

  const catIcons = {
    'Productivity': 'lightbulb-on-outline', 
    'Health': 'heart-plus-outline', 
    'Finance': 'hand-coin-outline', 
    'Intellect': 'drama-masks', 
    'Creativity': 'lightbulb-on-outline'
  };

  const handleDone = async () => {
    try {
      let emptyCategory = false;

      for (let i = 0; i < filteredData.length; i++) {
        // Extract selected goals from filteredData & goalStates
        const { title, goals } = filteredData[i];
        const selectedGoals = goals.filter((goal, index) => goalStates[i][index]);

        if (selectedGoals.length === 0) {
          emptyCategory = true;
          break;
        } else {
          // Save selected goals in the corresponding category document in categories collection
          await setDoc(doc(datab, "users", auth.currentUser.uid, "categories", title), { goals: selectedGoals });
        }
      }

      if (emptyCategory) { // If any category has no selected goals, show a toast message
        // alert('Please select at least one goal for each category.');
        Toast.show('Please select at least one goal for each category.')
      } else {
        // Remove existing screens from the stack, add BottomNavigation to it and navigate there
        navigation.reset({
          index: 0,
          routes: [{ name: 'BottomNavigation' }]
        });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Toggles the selection state of a category
  const handleChipPress = (category) => {
    console.log(categories)
    console.log(filteredData.find(item => item.title === category).goals)
    setSelectedCategory((prevCategory) => (prevCategory === category ? null : category));
  };

  return (
    <View style={globalStyles.body}>
      <View style={globalStyles.center}>
        <Text style={globalStyles.title}>Get Started</Text>
        <Text style={globalStyles.subtitle}>Now that you have selected the categories, let’s make a list of goals! </Text>
      

        {/* categories */}
        <ScrollView horizontal>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 20, flexGrow: 1}}>
            {categories.map((key) => (
              <Chip
                theme={{colors: {secondaryContainer: selectedCategory === key ? chipColor[key] : colors.grey100}}}
                icon={({ size, color }) => (
                    <MaterialCommunityIcons name={catIcons[key]} size={20} color="#000" />
                )}
                rippleColor={'transparent'}
                key={key}
                style={{marginRight: 8, borderRadius: 50, paddingHorizontal: 16, paddingVertical: 10, fontSize:24}}
                selected={selectedCategory === key}
                onPress={() => handleChipPress(key)}
              >
                {key}
              </Chip>
            ))}
          </View>
        </ScrollView>
      </View>


      {/* goals */}
      <View style={styles.goalListContainer}>
        { filteredData && filteredData.find(item => item.title === selectedCategory) &&    
          <FlatList
            data={filteredData.find(item => item.title === selectedCategory).goals}
            keyExtractor={(goal, index) => index.toString()}
            renderItem={({ item: goal, index: goalIndex }) => (
              <View>
                <View style={styles.goalContainer}>
                  <TouchableOpacity onPress={() => {handleToggle(filteredData.findIndex(item => item.title === selectedCategory), goalIndex)}}>
                    {goalStates[filteredData.findIndex(item => item.title === selectedCategory)][goalIndex] 
                      ? 
                      <MyCheckbox myBgColor={chipColor[selectedCategory]} myColor={'black'}></MyCheckbox>
                      : <MyCheckbox myBgColor={colors.grey50} myColor={colors.grey600}></MyCheckbox>
                    }
                  </TouchableOpacity>
                  <Text style={styles.goalTxt}>{goal}</Text>
                </View>
                { goalIndex != filteredData.find(item => item.title === selectedCategory).goals.length - 1 && <Divider /> }
              </View>
            )}
          />
        }
      </View>

      {/* button */}
      <View style={[globalStyles.center, globalStyles.btnContainer]} >
        <Button mode="contained" onPress={handleDone} style={globalStyles.button} buttonColor='black'>
          <Text style={globalStyles.btnText}>Done</Text>
        </Button>
      </View>

    </View>
  );
};

export default GoalsScreen;

const styles = StyleSheet.create({
  goalListContainer: {
    backgroundColor: 'white',
    marginTop: 24,
    marginHorizontal: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  goalTxt: {
    fontSize: 16,
    marginLeft: 16,
  },
});