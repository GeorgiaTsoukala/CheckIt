import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Image, FlatList } from 'react-native';
import React, { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const GoalsScreen = () => {
  const navigation = useNavigation();
  const carouselRef = useRef(null);

  const data = [
    { title: 'Health', goals: ['Meditated', 'Exercised', 'Drunk enough water', 'Got enough sleep', 'Ate healthy'] },
    { title: 'Productivity', goals: ['Studied', 'Worked', 'Did hobbies', 'Scheduled my time', 'Reserved time for important tasks'] },
    { title: 'Intellect', goals: ['Went to cinema', 'Went to theater', 'Read a book', 'Read the news'] },
    // Add more categories as needed
  ];

  // const [goalStates, setGoalStates] = useState([...Array(data.length)].map(() => []));
  const [goalStates, setGoalStates] = useState(data.map(category => category.goals.map(() => false)));


  const handleToggle = (carouselIndex, goalIndex) => {
    const newGoalStates = [...goalStates];
    newGoalStates[carouselIndex][goalIndex] = !newGoalStates[carouselIndex][goalIndex];
    setGoalStates(newGoalStates);
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
                {goalStates[index][goalIndex] ? <Image source={require('../../assets/checked.png')}/> :
                <View style={styles.checkBox} />}
              </TouchableOpacity>
              <Text style={styles.goalTxt}>{goal}</Text>
            </View>
          )}
        />
      </View>
    );
  };

  return (
    <View style={styles.body}>
      <View style={styles.center}>
        <Text style={styles.title}>Get Started</Text>
        <Text style={styles.subtitle}>Now that you have selected the categories, let’s make a list of goals! </Text>
      </View>

      <View>
        <Carousel
          ref={carouselRef}
          data={data}
          renderItem={renderItem}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={Dimensions.get('window').width * 0.8}
          layout="default"
        />
        <Pagination
          dotsLength={data.length}
          activeDotIndex={carouselRef.current?.currentIndex || 0}
          containerStyle={{ marginTop: -15 }}
          dotStyle={styles.dotStyle}
          inactiveDotStyle={styles.inactiveDotStyle}
          inactiveDotOpacity={0.6}
          inactiveDotScale={0.8}
        />
      </View>

      <View style={styles.center}>
        <TouchableOpacity
          onPress={() => {console.log(`${goalStates}`)/*navigation.replace('BottomNavigation');*/}}
          style={styles.button}
        >
          <Text style={styles.btnText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GoalsScreen;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#F6E8F3',
  },
  center: {
    alignItems: 'center',
  },
  title: {
    color: '#63086B',
    fontSize: 32,
  },
  subtitle: {
    width: '80%',
    marginTop: 32,
    marginBottom: 50,
    fontSize: 18,
    textAlign: 'center',
  },
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
    marginRight: 10,
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
    marginRight: 10,
  }
});
