export const SignIn = (credentials) => {
    return(dispatch, getState, { getFirebase }) => {
        // make async call to database
        const firebase = getFirebase();
        
        firebase.auth().signInWithEmailAndPassword(
            credentials.email,
            credentials.password
        ).then(() => {
            dispatch({type: 'LOGIN_SUCCESS'});
        }).catch((err) => {
            let toastErr    = '<span>'+err+'</span>';
            window.M.toast({html: toastErr});
            dispatch({type: 'LOGIN_ERROR', err});
        });
    }
}

export const SignOut = () => {
    return(dispatch, getState, { getFirebase }) => {
        // make async call to database
        const firebase = getFirebase();
        
        firebase.auth().signOut().then(() => {
            let toastErr    = '<span>Logged Out!</span>';
            window.M.toast({html: toastErr});
            dispatch({type: 'LOGOUT_SUCCESS'});
        }).catch((err) => {
            dispatch({type: 'LOGOUT_ERROR', err});
        });
    }
}

export const SignUp = (newUser) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
  
        firebase.auth().createUserWithEmailAndPassword(
            newUser.email, 
            newUser.password
        ).then((resp) => {
            //return firebase.database().ref('users/' + resp.user.uid).set({
            return firestore.collection('users').doc(resp.user.uid).set({
                displayName: newUser.username,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                cell: newUser.cellnumber,
                email: newUser.email
            });
        }).then(() => {
            let toastErr    = '<h3 class="center">Welcome to MyRide!</h3>';
            window.M.toast({html: toastErr});
            dispatch({ type: 'SIGNUP_SUCCESS' });
        }).catch((err) => {
            let toastErr    = '<span>'+err+'</span>';
            window.M.toast({html: toastErr});
            dispatch({ type: 'SIGNUP_ERROR', err});
        });
    }
}