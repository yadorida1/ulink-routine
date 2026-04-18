// Firebase Authentication service
//
// INTEGRATION POINT: Firebase Auth
// ─────────────────────────────────────────────────────────────────────────────
// 1. Install: @react-native-firebase/app  @react-native-firebase/auth
// 2. For Sign in with Apple: @invertase/react-native-apple-authentication
// 3. For Sign in with Google: @react-native-google-signin/google-signin
// 4. Add google-services.json (Android) + GoogleService-Info.plist (iOS)
// 5. Replace mock implementations below with real Firebase Auth calls
// ─────────────────────────────────────────────────────────────────────────────
//
// Example real implementation:
//   import auth from '@react-native-firebase/auth';
//   import appleAuth from '@invertase/react-native-apple-authentication';
//   import { GoogleSignin } from '@react-native-google-signin/google-signin';

export interface AuthResult {
  success: boolean;
  userId?: string;
  displayName?: string;
  email?: string;
  error?: string;
}

export const signInWithApple = async (): Promise<AuthResult> => {
  // TODO:
  // const appleAuthRequestResponse = await appleAuth.performRequest({
  //   requestedOperation: appleAuth.Operation.LOGIN,
  //   requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
  // });
  // const { identityToken, nonce } = appleAuthRequestResponse;
  // const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
  // const { user } = await auth().signInWithCredential(appleCredential);
  // return { success: true, userId: user.uid, displayName: user.displayName ?? undefined };
  return { success: true, userId: 'mock_apple_uid', displayName: '사용자', email: 'user@icloud.com' };
};

export const signInWithGoogle = async (): Promise<AuthResult> => {
  // TODO:
  // await GoogleSignin.hasPlayServices();
  // const { idToken } = await GoogleSignin.signIn();
  // const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  // const { user } = await auth().signInWithCredential(googleCredential);
  // return { success: true, userId: user.uid, displayName: user.displayName ?? undefined };
  return { success: true, userId: 'mock_google_uid', displayName: '사용자', email: 'user@gmail.com' };
};

export const signOut = async (): Promise<void> => {
  // TODO: await auth().signOut();
};

export const getCurrentUser = (): { userId: string; displayName?: string; email?: string } | null => {
  // TODO:
  // const user = auth().currentUser;
  // if (!user) return null;
  // return { userId: user.uid, displayName: user.displayName ?? undefined, email: user.email ?? undefined };
  return null;
};

export const onAuthStateChanged = (
  callback: (user: { userId: string } | null) => void,
): (() => void) => {
  // TODO:
  // return auth().onAuthStateChanged((user) => {
  //   callback(user ? { userId: user.uid } : null);
  // });
  callback(null);
  return () => {};
};
