import { useEffect, useRef } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';
import { Capacitor } from '@capacitor/core';
import { db, auth } from '@/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useSettings } from '@/context/SettingsContext';
import { getApiUrl } from '@/lib/api';

export function useNativeNotifications() {
  const { notificationsEnabled } = useSettings();
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!notificationsEnabled) {
      console.log('Push notifications are disabled in settings.');
      return;
    }

    if (!Capacitor.isNativePlatform()) {
      console.log('Push notifications: Web environment detected, skipping registration.');
      return;
    }

    const setupPush = async () => {
      try {
        let permStatus = await PushNotifications.checkPermissions();
        if (permStatus.receive === 'prompt') {
          permStatus = await PushNotifications.requestPermissions();
        }
        if (permStatus.receive !== 'granted') {
          console.warn('Push notifications permission not granted');
          return;
        }

        await PushNotifications.register();

        await PushNotifications.addListener('registration', async (token) => {
          console.log('Push registration successful, token:', token.value);
          
          // Original logic: Subscribe to topic via our server
          try {
            await fetch(getApiUrl('/api/admin/subscribe-to-topic'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: token.value, topic: 'new_orders' })
            });
            console.log('Successfully subscribed to new_orders topic');
          } catch (subscribeErr) {
            console.error('Error subscribing to topic:', subscribeErr);
          }

          // Fetch FCM token and map to user profile if logged in
          try {
            const fcmTokenResult = await FCM.getToken();
            const fcmToken = fcmTokenResult.token;
            tokenRef.current = fcmToken;

            const currentUser = auth.currentUser;
            if (currentUser) {
              const userDocRef = doc(db, 'users', currentUser.uid);
              await updateDoc(userDocRef, { fcmToken });
              console.log('FCM token mapped to user profile on registration:', currentUser.uid);
            }
          } catch (tokenErr) {
            console.error('Error fetching FCM token:', tokenErr);
          }
        });

        await PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push received in foreground: ', notification);
        });
      } catch (err) {
        console.error('Error setting up push notifications:', err);
      }
    };

    setupPush();

    // Cleanup listeners if component unmounts
    return () => {
      if (Capacitor.isNativePlatform()) {
        PushNotifications.removeAllListeners();
      }
    };
  }, [notificationsEnabled]);

  // Listen to Auth State Changes to map token when user logs in reactively
  useEffect(() => {
    if (!Capacitor.isNativePlatform() || !notificationsEnabled) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && tokenRef.current) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          await updateDoc(userDocRef, { fcmToken: tokenRef.current });
          console.log('FCM token mapped to user profile on auth change:', user.uid);
        } catch (err) {
          console.error('Error mapping FCM token on auth change:', err);
        }
      }
    });

    return () => unsubscribe();
  }, [notificationsEnabled]);
}
