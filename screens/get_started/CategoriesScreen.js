import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc } from 'firebase/firestore';
import { auth, datab } from '../../firebase';

const categoriesData = [
  { name: 'Productivity', isChecked: false },
  { name: 'Health', isChecked: false },
  { name: 'Finance', isChecked: false },
  { name: 'Intellect', isChecked: false },
  { name: 'Creativity', isChecked: false },
];

const ChecklistScreen = () => {
  const navigation = useNavigation();

  const [categories, setCategories] = useState(categoriesData);

  const handleCategoryToggle = (index) => {
    const updatedCategories = [...categories];
    updatedCategories[index].isChecked = !updatedCategories[index].isChecked;
    setCategories(updatedCategories);
  };

  const handleNext = async () => {
    try {
      //create list of selected categories
      let checkedCategories = categories.filter(category => category.isChecked).map(category => category.name);
      
      //make a subcollection in users database with the selected categories as documents
      const promises = checkedCategories.map(async (categoryName) => {
        await setDoc(doc(datab, "users", auth.currentUser.uid, "categories", categoryName), {});
      });
    
      await Promise.all(promises);

      //navigate to next screen
      navigation.navigate("IconGetStarted")
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.body}>
      <View style={styles.center}>
        <Text style={styles.title}>Get Started</Text>
        <Text style={styles.subtitle}>Let's select the categories you want to keep track of every day!</Text>
      </View>

      {categories.map((category, index) => (
        <View key={index} style={styles.categoryContainer}>
          <View style={styles.categoryTxtContainer}>
            <Text style={styles.categoryTxt}>{category.name}</Text>
          </View>
          <TouchableOpacity
            style={[styles.radioButton, category.isChecked ? { borderColor: '#8E2EA6' } : { borderColor: '#D0B8E6' }]}
            onPress={() => handleCategoryToggle(index)}
          >
            {category.isChecked && <View style={styles.radioButtonInner} />}
          </TouchableOpacity>
        </View>
      ))}

      <View style={[styles.center, styles.btnContainer]}>
        <TouchableOpacity
          onPress={handleNext}
          style={styles.button}
        >
          <Text style={styles.btnText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChecklistScreen;

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
    width: '70%',
    marginTop: 32,
    marginBottom: 50,
    fontSize: 18,
    textAlign: 'center', 
  },
  categoryTxt: {
    fontSize: 32,
    fontWeight: '700',
  },
  categoryTxtContainer: {
    width: '70%',
    backgroundColor: '#D0B8E6',
    paddingVertical: 16,
    paddingLeft: 24,
    paddingRight: 48,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  radioButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 40,
  },
  radioButtonInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#8E2EA6',
  },
  button: {
    width: '60%',
    backgroundColor: '#AA7DC6',
    // position: 'absolute',
    // bottom: 0,
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
});
