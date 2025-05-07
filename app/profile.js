import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../src/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';


const Profile = ({ navigation }) => {

  const [userToken, setUserToken] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [editingSection, setEditingSection] = useState(null);

  const getAuthToken = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      const token = await AsyncStorage.getItem('userToken');

      if (email !== null) {
        console.log('Email:', email);
       return [token,email]
      } else {
        console.log('No email found');
      }
    } catch (error) {
      console.error('Error reading email from storage:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
        const [userToken,userEmail] = await getAuthToken(); // <-- Await the async function
        console.log(userEmail)
        if (!userEmail) return;

        try {
          const response = await axios.get(`${API_BASE_URL}/profile/get`, {
            headers: { Authorization: `${userToken}` }
          });

          if (response.data.success) {
            const profileData = response.data.profile;
            setName(profileData.name || '');
            setAge(profileData.age || '');
            setGender(profileData.gender || '');
            setBloodGroup(profileData.bloodGroup || '');
            setMedicalHistory(profileData.medicalHistory || '');
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      };


    fetchData();
  }, [userEmail]);

  const handleSave = async () => {
    const profileData = {
      name,
      age,
      gender,
      bloodGroup,
      medicalHistory,
    };

    const result = await updateUserProfile(profileData);

    if (result.success) {
      Alert.alert('Success', 'Profile updated successfully');
      setEditingSection(null);
    } else {
      Alert.alert('Error', result.message || 'Failed to update profile');
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userEmail');
    } catch (e) {
      console.warn('Failed to clear async storage:', e);
    }
  };

  const handleLogout = async () => {
    const [userToken,userEmail] = await getAuthToken();

    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.post(`${API_BASE_URL}/logout`, null, {
                headers: { Authorization: `${userToken}` }
              });
            } catch (err) {
              console.warn('Server logout failed:', err.message);
            }

            await logout(); // This clears AsyncStorage
            router.replace('/login'); // Route to login
          }
        }
      ]
    );
  };


  const toggleEditSection = (section) => {
    setEditingSection(editingSection === section ? null : section);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Profile</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>General Information</Text>
            <TouchableOpacity onPress={() => toggleEditSection('general')}>
              <Text style={styles.editButton}>
                {editingSection === 'general' ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          {editingSection === 'general' ? (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#888"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Age"
                placeholderTextColor="#888"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Gender"
                placeholderTextColor="#888"
                value={gender}
                onChangeText={setGender}
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{name || '-- Not Set --'}</Text>

              <Text style={styles.infoLabel}>Age:</Text>
              <Text style={styles.infoValue}>{age || '-- Not Set --'}</Text>

              <Text style={styles.infoLabel}>Gender:</Text>
              <Text style={styles.infoValue}>{gender || '-- Not Set --'}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medical Information</Text>
            <TouchableOpacity onPress={() => toggleEditSection('medical')}>
              <Text style={styles.editButton}>
                {editingSection === 'medical' ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          {editingSection === 'medical' ? (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Blood Group"
                placeholderTextColor="#888"
                value={bloodGroup}
                onChangeText={setBloodGroup}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Medical History"
                placeholderTextColor="#888"
                value={medicalHistory}
                onChangeText={setMedicalHistory}
                multiline
                numberOfLines={4}
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.infoLabel}>Blood Group:</Text>
              <Text style={styles.infoValue}>{bloodGroup || '-- Not Set --'}</Text>

              <Text style={styles.infoLabel}>Medical History:</Text>
              <Text style={styles.infoValue}>{medicalHistory || '-- Not Set --'}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editButton: {
    color: '#38DD8C',
    fontSize: 16,
  },
  infoLabel: {
    fontSize: 16,
    color: '#BBBBBB',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    color: '#FFFFFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#38DD8C',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#E53935',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default Profile;