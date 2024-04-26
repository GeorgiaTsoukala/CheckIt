import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { auth, datab } from '../../firebase';
import globalStyles from '../../globalStyles';
import { Button } from 'react-native-paper';
 
const ChecklistScreen = () => {
  const navigation = useNavigation();

  const [categories, setCategories] = useState([]); //this line only runs once during the initial rendering of the component

  // if we want the data of the selected categories to be reset every time the component renders, we need to init their state inside a useEffect function.
  useEffect(() => {
    // Load categories data when the component mounts
    const categoriesData = [
      { name: 'Productivity', isChecked: false },
      { name: 'Health', isChecked: true },
      { name: 'Finance', isChecked: false },
      { name: 'Intellect', isChecked: false },
      { name: 'Creativity', isChecked: false },
    ];
    setCategories(categoriesData);
  }, []);

  const handleCategoryToggle = (index) => {
    const updatedCategories = [...categories];
    updatedCategories[index].isChecked = !updatedCategories[index].isChecked;
    setCategories(updatedCategories);
  };

  const handleNext = async () => {
    try {
      // Get a reference to the categories collection
      const categoriesRef = collection(datab, "users", auth.currentUser.uid, "categories");

      // First, delete all documents inside the categories collection, if they exist
      const querySnapshot = await getDocs(categoriesRef);
      if (!querySnapshot.empty) {
          const deletePromises = querySnapshot.docs.map(async (doc) => {
              await deleteDoc(doc.ref);
          });
          await Promise.all(deletePromises);
      }

      console.log('Pressed Next');

      // Then add the selected categories to the database
      const checkedCategories = categories.filter(category => category.isChecked).map(category => category.name);
      const addCategoryPromises = checkedCategories.map(async (categoryName) => {
          await setDoc(doc(categoriesRef, categoryName), {});
      });
      await Promise.all(addCategoryPromises);

      // Place Goals screen in the stack and navigate there (with the ability to go back)
      navigation.navigate("Goals");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={globalStyles.body}>
      <View style={globalStyles.center}>
        <Text style={globalStyles.title}>Get Started</Text>
        <Text style={globalStyles.subtitle}>Let's select the categories you want to keep track of every day!</Text>
      </View>

      {categories.map((category, index) => (
        <View key={index} style={styles.categoryContainer}>
          <View style={styles.categoryTxtContainer}>
            <Text style={styles.categoryTxt}>{category.name}</Text>
          </View>
          <TouchableOpacity
            style={[styles.radioButton, category.isChecked ? { borderColor: '#8E2EA6' } : { borderColor: '#D0B8E6' }]}
            onPress={() => {category.name !== 'Health' && handleCategoryToggle(index)}}
          >
            {category.isChecked && <View style={styles.radioButtonInner} />}
          </TouchableOpacity>
        </View>
      ))}

      {/* button */}
      <View style={[globalStyles.center, globalStyles.btnContainer]} >
        <Button mode="contained" onPress={handleNext} style={globalStyles.button} buttonColor='black'>
          <Text style={globalStyles.btnText}>Next</Text>
        </Button>
      </View>
    </View>
  );
};

export default ChecklistScreen;

const styles = StyleSheet.create({
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
});
