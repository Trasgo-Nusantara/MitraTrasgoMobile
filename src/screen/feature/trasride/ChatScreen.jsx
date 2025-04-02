import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, COMPONENT_STYLES } from '../../../lib/constants';

const { width } = Dimensions.get('window');

const ChatScreen = ({route}) => {
  const {idDriver,idOrder,idUser} = route.params
  const [message, setMessage] = useState(''); // Untuk mengontrol input pesan
  const [messages, setMessages] = useState([
    // { id: 1, text: 'Halo! Titik jemput sesuai aplikasi ?', sender: 'other' },
  ]);
  
  // Referensi ScrollView untuk memanipulasi scroll
  const scrollViewRef = useRef();

  // Fungsi untuk menangani pengiriman pesan
  const sendMessage = () => {
    if (message.trim() !== '') {
      const newMessage = { id: messages.length + 1, text: message, sender: 'user' };
      setMessages([...messages, newMessage]);
      setMessage(''); // Menghapus input pesan setelah dikirim
    }
  };

  // Gunakan useEffect untuk scroll otomatis ke bawah setiap kali ada perubahan pada pesan
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
    console.log(idDriver,idOrder,idUser)
  }, [messages]); // Akan dijalankan setiap kali pesan berubah

  return (
    <View style={[COMPONENT_STYLES.container, { padding: 0 }]}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <ScrollView
        contentContainerStyle={[COMPONENT_STYLES.scrollView, styles.chatContainer]}
        ref={scrollViewRef} // Menghubungkan ref ke ScrollView
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[styles.messageContainer, msg.sender === 'user' ? styles.userMessage : styles.otherMessage]}
          >
            <Text style={[styles.messageText]}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Text dan Send Button */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Ketik pesan..."
          placeholderTextColor="gray"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  messageContainer: {
    marginVertical: 8,
    padding: 10,
    borderRadius: 15,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.lightGray,
  },
  messageText: {
    fontSize: 16,
    color: COLORS.white,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  textInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    backgroundColor: COLORS.lightGray,
    borderRadius: 15,
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;
