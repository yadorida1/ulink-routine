import { useState, useCallback } from 'react';
import { UserState, AuthStatus, SubscriptionStatus } from '../types';
import { mockUserState } from '../data/mockData';

// INTEGRATION POINT: AsyncStorage + Firebase Auth
// Persist userState to AsyncStorage and sync with Firebase Auth listener:
//
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged((user) => {
//       if (user) {
//         setUserState(prev => ({ ...prev, authStatus: 'signedIn', userId: user.userId }));
//       } else {
//         setUserState(prev => ({ ...prev, authStatus: 'guest' }));
//       }
//     });
//     return unsubscribe;
//   }, []);

export const useUserState = () => {
  const [userState, setUserState] = useState<UserState>(mockUserState);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const signIn = useCallback(
    (userId: string, displayName?: string, email?: string) => {
      setUserState(prev => ({
        ...prev,
        authStatus: 'signedIn' as AuthStatus,
        userId,
        displayName,
        email,
      }));
    },
    [],
  );

  const signOut = useCallback(() => {
    setUserState({
      authStatus: 'guest',
      subscriptionStatus: 'free',
      activeTopicCount: 1,
    });
  }, []);

  const upgradeToPremium = useCallback(() => {
    setUserState(prev => ({
      ...prev,
      subscriptionStatus: 'premium' as SubscriptionStatus,
    }));
  }, []);

  // Returns what action is needed when user taps "Add Topic"
  const canAddTopic = useCallback((): 'allowed' | 'needs_login' | 'needs_premium' => {
    if (userState.authStatus === 'guest') return 'needs_login';
    if (userState.subscriptionStatus === 'free') return 'needs_premium';
    return 'allowed';
  }, [userState]);

  const isGuest = userState.authStatus === 'guest';
  const isPremium = userState.subscriptionStatus === 'premium';

  return {
    userState,
    isGuest,
    isPremium,
    showLoginPrompt,
    setShowLoginPrompt,
    signIn,
    signOut,
    upgradeToPremium,
    canAddTopic,
  };
};
