const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');
admin.initializeApp(functions.config().firebase);
firebase.initializeApp(functions.config().firebase);
const cors = require('cors')({origin: true});

const ref = admin.database().ref();

exports.sendPasswordEmailOnUserCreate = functions.auth.user().onCreate(event => {
    firebase.auth().sendPasswordResetEmail(event.data.email);
});

exports.deleteUserRecordOnDelete = functions.auth.user().onDelete(event => {
    const uid = event.data.uid;
    ref.child(`/users/${uid}`).remove()
    .then(() => {
        return firebase.storage().ref(`/profilePics/${uid}`).delete();
    })
    .catch(err => {
        console.log(err.message);
    });
    
});

exports.updateCompanyWithTeams = functions.database
    .ref('/teams/{name}')
    .onWrite(event => {
        console.log(event);
        const team = event.data.val();
        console.log(team);
        return admin.database().ref(`/companies/${team.company}/teams/${team.name}`).set(team.name)
        .catch(err => {
            console.log(err.message);
        });
    });

exports.updateUserAuthAccount = functions.database
    .ref('/users/{uid}')
    .onWrite(event => {
        const user = event.data.val();

        if (user.uid){
            admin.auth().updateUser(user.uid, {
                email: user.email,
                displayName: `${user.firstName} ${user.lastName}`,
                disabled: user.role === 'inactive' ? true : false,
                photoURL: user.photoUrl
            }).catch(err => {
                console.log(err.message);
            });
        }
    });

// exports.disableUser = functions.auth.user().(event => {
//     ref.child(`/users/${event.data.uid}`).set({
//         isDeleted: true
//     });
// });


// exports.createUser = functions.https.onRequest((req, res) => {
//     if (req.method === 'PUT') {
//         res.status(403).send('Forbidden!');
//     }
//     console.log(req);
//     let user = req.body.data.val();
//     console.log(`creating new user: ${user}`);
//     return admin.auth().createUser({
//         email: user.email,
//         phoneNumber: user.phone,
//         password: 'J!jf!j2j2j3jk56j!@#KLJ#!h1g12ha',
//         displayName: `${user.firstName} ${user.lastName}`,
//         photoUrl: user.photoUrl || 'http://i0.kym-cdn.com/entries/icons/original/000/002/203/20533_cooldog.jpg'
//     }).then(newUser => {
//         user.uid = newUser.uid;
//         console.log(`new user created: ${user}`);
//         return ref(`/users/${user.uid}`).set(user);
//     }).then(() => {
//         console.log('user saved the database')
//         return firebase.auth().sendPasswordResetEmail(user.email);
//     }).then(() => {
//         res.status(200).send('success!');
//     })
//     .catch(err => {
//         console.log(err.message);
//         res.status(500).send(err.message);
//     });
//     // cors(req, res, () => {
//     //     console.log(req);
//     //     let user = req.body.data.val();
//     //     console.log(`creating new user: ${user}`);
//     //     return admin.auth().createUser({
//     //         email: user.email,
//     //         phoneNumber: user.phone,
//     //         password: 'J!jf!j2j2j3jk56j!@#KLJ#!h1g12ha',
//     //         displayName: `${user.firstName} ${user.lastName}`,
//     //         photoUrl: user.photoUrl || 'http://i0.kym-cdn.com/entries/icons/original/000/002/203/20533_cooldog.jpg'
//     //     }).then(newUser => {
//     //         user.uid = newUser.uid;
//     //         console.log(`new user created: ${user}`);
//     //         return ref(`/users/${user.uid}`).set(user);
//     //     }).then(() => {
//     //         console.log('user saved the database')
//     //         return firebase.auth().sendPasswordResetEmail(user.email);
//     //     }).then(() => {
//     //         res.status(200).send('success!');
//     //     })
//     //     .catch(err => {
//     //         console.log(err.message);
//     //         res.status(500).send(err.message);
//     //     })
//     // });
// });

// exports.createNewUser = functions.database
//     .ref('/users/{email}')
//     .onWrite((event) => {
//         let user = event.data.val();
//         console.log(`user created in databse: ${user}`);

//         admin.auth().createUser({
//             email: user.email,
//             phoneNumber: user.phone,
//             password: 'J!jf!j2j2j3jk56j!@#KLJ#!h1g12ha',
//             displayName: `${user.firstName} ${user.lastName}`,
//             photoUrl: user.photoUrl || 'http://i0.kym-cdn.com/entries/icons/original/000/002/203/20533_cooldog.jpg'
//         })
//         .then(newUser => {
//             user.uid = newUser.uid;
//             console.log(`user created: ${user}`);
//             return ref(`/users/${user.email}`).set(user);
//         })
//         .then(() => {
//             console.log(`user updated. Sending password reset email to ${user.email}`);
//             return firebase.auth().sendPasswordResetEmail(user.email);
//         })
//         .then(() => {
//             console.log('password reset email sent!');
//         })
//         .catch(err => {
//             console.log(err.message);
//         });
//     })
// exports.createNewUser = functions.https.onCreate((request, response) => {
//     debugger;
//     let user = request.data;
//     return admin.auth().createUser({
//         email: user.email,
//         phoneNumber: user.phone,
//         password: 'J!jf!j2j2j3jk56j!@#KLJ#!h1g12ha',
//         displayName: `${user.firstName} ${user.lastName}`,
//         photoUrl: user.photoUrl || 'http://i0.kym-cdn.com/entries/icons/original/000/002/203/20533_cooldog.jpg'
//     }).then(newUser => {
//         user.uid = newUser.uid;
//         return ref(`/users/${user.uid}`).set(user);
//     }).then(() => {
//         return firebase.auth().sendPasswordResetEmail(user.email);
//     }).catch(err => {
//         console.log(err.message);
//     })
// });





// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
