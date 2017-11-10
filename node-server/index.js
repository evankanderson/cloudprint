
var admin = require('firebase-admin');
var functions = require('firebase-functions');
var google = require('googleapis');
var request = require('request-promise-native');

// admin.database.enableLogging(true);

var mainApp = admin.initializeApp({
    // Note that the default credentials will need both 
    // auth/cloud-platform and auth/userinfo.email
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://argent-public.firebaseio.com",
}, 'main');

var db = mainApp.database();

var wakey = db.ref("config/wakey");

wakey.transaction(function(data) {
    console.log("Examining: " + data + " (" + typeof data + ")");
    if (data == null) {
        return "wakey";
    }
    if (data == "wakey") {
        return "wakey-wakey";
    }
    return;
}).then(function(result) {
    console.log((result.committed? "Wrote" : "Failed") + " to update to " +
		result.snapshot.ref.toString() + ": " + result.snapshot.val());
});

config = db.ref("config").once("value");

config.then(function(snapshot) {
    var c = snapshot.val();
    if (c.client_id == null || c.client_secret == null) {
	console.log("Could not read OAuth client config: " + snapshot.val());
	return;
    }
    var oauth2 = new google.auth.OAuth2(c.client_id, c.client_secret);

    var printers = db.ref("printers");

    printers.orderByKey().on("child_added", function(snapshot) {
	printerInfo = snapshot.val();
	if (printerInfo == null || printerInfo.refresh == null) {
	    console.log(snapshot.key + " is missing refresh token: " + JSON.stringify(printerInfo));
	    return;
	}
	oauth2.setCredentials({refresh_token: printerInfo.refresh});
	access = oauth2.getAccessToken(
	    function(err, token) {
		if (err != null || token == null) {
		    console.log("Unable to fetch access token for " + snapshot.key + ": " + err);
		    return
		}
		list = request({
		    method: 'POST',
		    uri: "https://www.google.com/cloudprint/list",
		    formData: { proxy: "testme" },
		    headers: {
			Authorization: "Bearer " + token
		    }
		});
		list.then(function (result) {
		    console.log("LIST: " + result);
		});
	    });
        console.log("Processing printer " + snapshot.key);
    });
});



// TODO(evan): exit cleanly after the function finishes
