import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/database'

// Initialize Firebase
var config = {
	apiKey: "AIzaSyDs1rMkzAdcYcP8j5OaKe-aaKZN51AX9OQ",
	authDomain: "ez-delivery-bd76e.firebaseapp.com",
	databaseURL: "https://ez-delivery-bd76e.firebaseio.com",
	projectId: "ez-delivery-bd76e",
	storageBucket: "ez-delivery-bd76e.appspot.com",
	messagingSenderId: "65886739967",
	appId: "1:65886739967:web:97b933c1671b9a5b4d1bca"
};

firebase.initializeApp(config);
// firebase.storage();
// firebase.firestore().settings({ timestampsInSnapshots: true });

export default firebase;
