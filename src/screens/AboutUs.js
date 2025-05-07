import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const AboutUs = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>About Us</Text>
        <Text style={styles.text}>
          We are a team dedicated to providing accurate and helpful information about health and wellness.
          Our goal is to assist users in making informed decisions about their health, offering a simple yet effective approach to medical advice.
        </Text>
        <Text style={styles.text}>
          Our app, MediBot, offers a chatbot for disease diagnosis, along with a profile feature to collect and analyze important health details.
        </Text>
        <Text style={styles.text}>
          We prioritize user privacy and provide a seamless experience with a modern, user-friendly interface, ensuring your health data is in safe hands.
        </Text>
        <Text style={styles.footer}>Thank you for choosing MediBot!</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff', // White text for header
    marginBottom: 15,
    textAlign: 'center', // Center the header
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#e0e0e0', // Light text for readability
    marginBottom: 15,
    textAlign: 'justify', // Justify text for better readability
  },
  footer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a3d2ca', // Soft green accent color for a friendly touch
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AboutUs;