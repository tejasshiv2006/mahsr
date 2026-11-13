import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius, Spacing } from '../src/constants/theme';
import { useSearchStore } from '../src/store/useSearchStore';
import { registerForPushNotificationsAsync, sendTrainNotification } from '../src/Services/notificationService';
import { DEMO_FACILITIES } from '../src/Services/supabaseClient';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export default function AIAssistantScreen() {
  const router = useRouter();
  const { selectedTrain } = useSearchStore();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Namaste! I am your MAHSR Connect AI Navigation & Travel Guide 🚄. Ask me about station gates, lifts, waiting lounges, train alerts, or luggage rules!',
      time: 'Just now',
    },
  ]);

  const handleNavigationQuery = (query: string): string | null => {
    const q = query.toLowerCase();

    // Check database facility matches
    const matchedFacility = DEMO_FACILITIES.find((f) =>
      q.includes(f.name.toLowerCase()) || q.includes(f.category)
    );

    if (matchedFacility) {
      return `📍 [Station DB] ${matchedFacility.name} is on Floor ${matchedFacility.floor}.\n\nDetails: ${matchedFacility.description}. ${matchedFacility.is_accessible ? '♿ Wheelchair accessible.' : ''}`;
    }

    if (q.includes('gate') || q.includes('boarding')) {
      return `📍 [Station DB] Boarding gates for E5 Series Shinkansen are located on Concourse Level 1 (Gate 2B for Surat/Ahmedabad bound trains).`;
    }
    if (q.includes('lift') || q.includes('elevator') || q.includes('wheelchair') || q.includes('ramp')) {
      return `📍 [Station DB] Lift L2 & Wheelchair Ramps are located adjacent to Security Checkpoint A for direct access to Platform 2.`;
    }
    if (q.includes('waiting') || q.includes('lounge')) {
      return `📍 [Station DB] The Executive Waiting Lounge is located on Floor 1 near the Food Court area.`;
    }
    if (q.includes('help desk') || q.includes('information')) {
      return `📍 [Station DB] The Main Help Desk & Lost & Found center is located at Concourse Entrance Gate 1.`;
    }
    if (q.includes('coach') || q.includes('seat')) {
      return `📍 [Station DB] Standard & Executive Coaches (C1 - C8) align with Markings 10–18 on Platform 2. Check the overhead display upon reaching the platform.`;
    }

    return null;
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userQuery = inputText;
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userQuery,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = userQuery.toLowerCase();
    setInputText('');

    setTimeout(async () => {
      let replyText = "I can assist you with station navigation (gates, lifts, lounges), schedules, policies, and train alerts.";

      // 1. Navigation Database Query Check
      const navReply = handleNavigationQuery(query);
      if (navReply) {
        replyText = navReply;
      }
      // 2. Notification / Alert Command Handling
      else if (query.includes('notify') || query.includes('alert') || query.includes('reminder')) {
        if (selectedTrain) {
          try {
            const hasPermission = await registerForPushNotificationsAsync();
            if (hasPermission) {
              await sendTrainNotification(selectedTrain.name, selectedTrain.number, '3');
              replyText = `✅ Done! I have scheduled a push notification for ${selectedTrain.name} (${selectedTrain.number}) arriving on Platform 3.`;
            } else {
              replyText = "⚠️ Notification permissions are disabled in your device settings. Please enable them to receive alerts.";
            }
          } catch (err) {
            replyText = "❌ Failed to set up the notification alert.";
          }
        } else {
          replyText = "⚠️ Please select a train first from the search results so I know which train to set the alert for!";
        }
      } 
      // 3. App Knowledge Base Queries
      else if (query.includes('luggage') || query.includes('bag')) {
        replyText = "🧳 Each passenger is allowed up to 35 kg of cabin luggage for free. Extra baggage options can be selected during seat reservation.";
      } else if (query.includes('surat') || query.includes('platform')) {
        replyText = "🚉 Surat High-Speed Rail Station has 4 platforms. Bullet Express #20501 typically arrives on Platform 3.";
      } else if (query.includes('cancel') || query.includes('refund')) {
        replyText = "💸 Free cancellation is available up to 4 hours before departure with 95% instant refund back to your payment mode.";
      } else if (query.includes('speed') || query.includes('fast')) {
        replyText = "⚡ MAHSR bullet trains operate at a maximum speed of 320 km/h, connecting Mumbai and Ahmedabad in under 2 hours!";
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>MAHSR AI Guide</Text>
          <Text style={styles.onlineStatus}>● Online · Smart Assistant</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
          {messages.map((msg) => (
            <View 
              key={msg.id} 
              style={[
                styles.msgBubble, 
                msg.sender === 'user' ? styles.userBubble : styles.aiBubble
              ]}
            >
              {msg.sender === 'ai' && (
                <View style={styles.botAvatar}>
                  <Ionicons name="hardware-chip" size={14} color="#fff" />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={[styles.msgText, msg.sender === 'user' && styles.userMsgText]}>
                  {msg.text}
                </Text>
                <Text style={[styles.msgTime, msg.sender === 'user' && styles.userMsgTime]}>
                  {msg.time}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask 'Where is the gate?' or 'Where is the lift?'..."
            value={inputText}
            onChangeText={setInputText}
            placeholderTextColor={Colors.textSecondary}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: Spacing.base, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.divider 
  },
  backButton: { width: 36, height: 36, borderRadius: BorderRadius.full, backgroundColor: Colors.surfaceCard, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.divider },
  headerTitle: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  onlineStatus: { fontSize: 10, color: Colors.success, fontWeight: '700' },
  chatContent: { padding: Spacing.base, paddingBottom: 20 },
  msgBubble: { flexDirection: 'row', marginBottom: 14, maxWidth: '85%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: Colors.primary, borderRadius: 16, borderBottomRightRadius: 2, padding: 12 },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: Colors.surfaceCard, borderRadius: 16, borderBottomLeftRadius: 2, padding: 12, borderWidth: 1, borderColor: Colors.divider },
  botAvatar: { width: 24, height: 24, borderRadius: BorderRadius.md, backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  msgText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  userMsgText: { color: '#fff' },
  msgTime: { fontSize: 9, color: Colors.textSecondary, marginTop: 4, textAlign: 'right' },
  userMsgTime: { color: 'rgba(255,255,255,0.7)' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, backgroundColor: Colors.surfaceCard, borderTopWidth: 1, borderTopColor: Colors.divider },
  input: { flex: 1, height: 44, backgroundColor: '#FBFCFE', borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.divider, paddingHorizontal: 14, fontSize: 14, color: Colors.textPrimary, marginRight: 10 },
  sendButton: { width: 44, height: 44, borderRadius: BorderRadius.md, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center' },
});