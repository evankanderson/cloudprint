
var admin = require('firebase-admin')
var functions = require('firebase-functions')

// admin.database.enableLogging(true);

var mainApp = admin.initializeApp({
    // Note that the default credentials will need both 
    // auth/cloud-platform and auth/userinfo.email
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://argent-public.firebaseio.com",
}, 'main');

var db = mainApp.database();

console.log("Created database: " + db);

var clientid = db.ref("config/client_id")
var ref = db.ref("printers")

console.log("Created references!");

clientid.once("value").then(function(snapshot) {
    console.log("READ: " + snapshot.val());
});

console.log("Finished read.");

// TODO(evan): exit cleanly after the function finishes
