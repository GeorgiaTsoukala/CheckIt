import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Image, FlatList } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { AntDesign } from '@expo/vector-icons';
import { auth, datab } from '../../firebase';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import Toast from 'react-native-simple-toast';
import globalStyles from '../../globalStyles';
import { Button } from 'react-native-paper';

const GoalsScreen = () => {
  const navigation = useNavigation();
  const carouselRef = useRef(null);

  const [categories, setCategories] = useState([]); //stores selected categories
  const [filteredData, setFilteredData] = useState([]); //stores data (title:..., goals:[...]) of chosen categories
  const [goalStates, setGoalStates] = useState({}); //stores checkboxes states
  const [page, setPage] = useState(0); //stores carousel paging

  useEffect(() => {
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

  const handleToggle = (carouselIndex, goalIndex) => {
    const newGoalStates = [...goalStates];
    newGoalStates[carouselIndex][goalIndex] = !newGoalStates[carouselIndex][goalIndex];
    setGoalStates(newGoalStates);
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

  const renderItem = ({ item: { title, goals }, index }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.categoryTxtContainer}>
          <Text style={styles.categoryTxt}>{title}</Text>
        </View>
        <FlatList
          data={goals}
          keyExtractor={(goal, index) => index.toString()}
          renderItem={({ item: goal, index: goalIndex }) => (
            <View style={styles.goalContainer}>
              <TouchableOpacity 
                onPress={() => handleToggle(index, goalIndex)} 
                style={styles.containerCheckBox}
              >
                {goalStates[index][goalIndex] 
                ? 
                  <AntDesign name="checksquare" size={24} color="#8E2EA6" />
                : <View style={styles.checkBox} />}
              </TouchableOpacity>
              <Text style={styles.goalTxt}>{goal}</Text>
            </View>
          )}
        />
      </View>
    );
  };

  return (
    <View style={globalStyles.body}>
      <View style={globalStyles.center}>
        <Text style={globalStyles.title}>Get Started</Text>
        <Text style={globalStyles.subtitle}>Now that you have selected the categories, let’s make a list of goals! </Text>
      </View>

      <View>
        <Carousel
          ref={carouselRef}
          onSnapToItem={(page) => setPage(page)}
          data={filteredData}
          renderItem={renderItem}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={Dimensions.get('window').width * 0.8}
          layout="default"
        />
        <Pagination
          dotsLength={filteredData.length}
          activeDotIndex={page}
          carouselRef={carouselRef}
          containerStyle={{ marginTop: -20 }}
          dotStyle={{width: 10, height: 10, borderRadius: 10, backgroundColor: '#8E2EA6'}}
          inactiveDotStyle={{backgroundColor: '#D0B8E6'}}
          inactiveDotOpacity={0.6}
          inactiveDotScale={0.7}
        />
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
  categoryTxt: {
    fontSize: 32,
    fontWeight: '700',
  },
  categoryTxtContainer: {
    width: '90%',
    backgroundColor: '#D0B8E6',
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 30
  },
  slide: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  goalTxt: {
    fontSize: 16,
    marginLeft: 10,
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
  }
});