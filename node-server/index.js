
var admin = require('firebase-admin')
var functions = require('firebase-functions')

admin.database.enableLogging(true);

var serviceAccount = require('./key.json')

var mainApp = admin.initializeApp({
    //    credential: admin.credential.applicationDefault(),
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://argent-public.firebaseio.com",
    projectId: "argent-public"
}, 'main');
/*
admin.initializeApp(functions.config().firebase);
*/

var db = mainApp.database();

var clientid = db.ref("config/clientid")
var ref = db.ref("printers")

clientid.on("value", function(snapshot) {
    console.log(snapshot.val());
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});
clientid.off("value");
