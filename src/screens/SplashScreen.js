// src/screens/SplashScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';

const SplashScreen = () => {
  const [animationFinished, setAnimationFinished] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0]; // Initial opacity is 0
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    // Fade in the bot image
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade to opacity 1
      duration: 2000, // Duration for fade-in
      useNativeDriver: true, // Use native driver for better performance
    }).start();

    // Set a timer to finish the animation after 2 seconds
    const timer = setTimeout(() => {
      // Fade out the bot image after it has appeared
      Animated.timing(fadeAnim, {
        toValue: 0, // Fade to opacity 0
        duration: 1000, // Duration for fade-out
        useNativeDriver: true, // Use native driver for better performance
      }).start();

      setAnimationFinished(true); // Mark animation as finished
    }, 2000); // Adjust to match your fade-in duration

    return () => clearTimeout(timer);
  }, [fadeAnim]);

  useEffect(() => {
    if (animationFinished) {
      // After animation finishes, go directly to chat screen (bypassing login)
      router.replace('/login');
    }
  }, [animationFinished]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Animated.Image
          source={require('../../assets/images/MediBot.png')} // Adjust the path to your chatbot icon image
          style={[styles.icon, { opacity: fadeAnim }]} // Apply animated opacity
        />
        <Text style={styles.title}>Welcome to MediBot</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212', // Background color for dark mode
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    width: 256, // Size of the chatbot icon (adjust as necessary)
    height: 256, // Size of the chatbot icon (adjust as necessary)
    marginBottom: 20, // Space between the icon and the title
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
});

export default SplashScreen;