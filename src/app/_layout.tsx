import { firebase } from '@react-native-firebase/messaging';
import '../global.css';
import { Slot } from 'expo-router';

firebase.initializeApp({
    appId: 'com.quangtrong1506.test.tb',
    projectId: 'test-tb-nen',
});
export default function Layout() {
    return <Slot />;
}
