import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CheckBox = ({ label, isChecked, onChange }) => {
  const handleToggle = () => {
    onChange(!isChecked);
  };

  return (
    <TouchableOpacity onPress={handleToggle} style={styles.container}>
      <View style={[styles.checkBox, isChecked && styles.checkedBox]}>
        {isChecked && <View style={styles.checkmark} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkedBox: {
    backgroundColor: 'blue', // Change color when checked
  },
  checkmark: {
    width: 10,
    height: 10,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
  },
});

export default CheckBox;
