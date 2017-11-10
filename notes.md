Call register with service account from metadata server (note, is bearer token which is already expired...)

    curl "https://www.google.com/cloudprint/register" -d "proxy=testme&name=dummy&capabilities={\"version\": \"1.0\"}&use_cdd=true" -H "Authorization: Bearer TOKEN"

Follow browser flow to authorize `invite_url` with the code from `registration_token`


Poll `/getauthcode` (with `printerid` from registration and `client_id` from service account) until registered, or 15 minutes pass

    curl "https://www.google.com/cloudprint/getauthcode?printerid=PRINTERID&oauth_client_id=CLIENTID" -H "Authorization: Bearer TOKEN"

Use `client_id`, `client_secret` (from project config), and `authorization_code` (from poll result) to get an access token

    curl "https://accounts.google.com/o/oauth2/token" -d "client_id=CLIENTID&redirect_uri=oob&grant_type=authorization_code&client_secret=CLIENTSECRET&code=AUTHORIZATION_CODE"

Use access token from authorization endpoint for the first 60 minutes, then need to use refresh token to get another access token...

List registered printers for this proxy

    curl "https://www.google.com/cloudprint/list" -H "Authorization: Bearer TOKEN" -d "proxy=testme"

Get printer details

    curl "https://www.google.com/cloudprint/printer" -H "Authorization: Bearer TOKEN" -d "proxy=testme&printerid=PRINTERID"

Attempt to fetch a print job

    curl "https://www.google.com/cloudprint/fetch" -H "Authorization: Bearer TOKEN" -d "proxy=testme&printerid=PRINTERID"

Update parameters

    curl "https://www.google.com/cloudprint/update" -H "Authorization: Bearer TOKEN" -d "proxy=testme&printerid=PRINTERID&gcp_version=2.0&content_types=application/pdf"
