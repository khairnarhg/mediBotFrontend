import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';
import { router } from 'expo-router';

const ChatbotScreen = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am MediBot. How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const fetchBotResponse = async (question) => {
    setIsLoading(true);

//    // Simulating API delay
//    setTimeout(() => {
//      // Sample responses - in a real app this would connect to your API
//      const sampleResponses = [
//        "Based on the symptoms you've described, this could be related to several conditions. I recommend consulting with a doctor for a proper diagnosis.",
//        "That's a common symptom for seasonal allergies. Have you noticed if it gets worse during specific seasons?",
//        "This might be something that requires medical attention. Consider scheduling an appointment with your healthcare provider.",
//        "From what you've shared, this sounds like it could be a minor issue, but monitoring it would be advisable.",
//        "I understand your concern. While I can provide information, remember that only a medical professional can give you a proper diagnosis."
//      ];
//
//      // Randomly select a response
//      const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
//
//      setMessages(prev => [...prev, { sender: 'bot', text: randomResponse }]);
//      setIsLoading(false);
//    }, 1500);

    // Commented out the actual API call for now
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ask`,
        {
          question: question,
          filename: "book1.pdf",
          user_id: "user_12345"
        }
      );

      const botResponse = response.data.answer || 'Sorry, I didn\'t understand that.';

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
      setIsLoading(false);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'Sorry, I encountered an error. Please try again later.'
      }]);
      setIsLoading(false);
    }

  };

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = input.trim();
      setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
      setInput('');
      fetchBotResponse(userMessage);
    }
  };

  const renderMessageText = (text) => {
    // Regex to find **bold** text
    const boldTextRegex = /\*\*(.*?)\*\*/g;
    const parts = text.split(boldTextRegex);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // Bold text
        return <Text key={index} style={styles.boldText}>{part}</Text>;
      } else {
        // Regular text
        return <Text key={index} style={styles.messageText}>{part}</Text>;
      }
    });
  };

  return (
  <>

    <View style={styles.container}>

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={msg.sender === 'user' ? styles.userMessage : styles.botMessage}
          >
            {renderMessageText(msg.text)}
          </View>
        ))}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#38DD8C" />
            <Text style={styles.loadingText}>Getting your answer...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
      <TouchableOpacity
                      style={styles.profileButton}
                      onPress={() => router.push('/profile')}
                    >
                      <Image
                        source={require('../../assets/images/profile.png')} // Make sure this icon exists
                        style={styles.profileIcon}
                      />
                    </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#888"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Image
            source={require('../../assets/images/upload.png')}
            style={styles.sendIcon}
          />
        </TouchableOpacity>


      </View>
    </View>
  </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  profileButton: {
//    position: 'absolute',
//    top: 40,
//    right: 20,
    backgroundColor: '#1c1c1c',
    borderRadius: 25,
    padding: 8,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },

  profileIcon: {
    width: 24,
    height: 24,
    tintColor: '#38DD8C',
  },
  chatContent: {
    paddingBottom: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3949ab',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#3D9B83',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  messageText: {
    color: '#FFFFFF',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#272727',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#272727',
    borderRadius: 10,
    padding: 10,
    color: '#FFFFFF',
    backgroundColor: '#1c1c1c',
  },
  sendButton: {
    backgroundColor: '#38DD8C',
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendIcon: {
    width: 30,
    height: 30,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  loadingText: {
    color: '#38DD8C',
    marginTop: 5,
    fontSize: 16,
  },
});

export default ChatbotScreen;