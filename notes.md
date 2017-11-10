# Call register with service account from metadata server (note, is bearer token which is already expired...)
   21  curl "https://www.google.com/cloudprint/register" -d "proxy=testme&name=dummy&capabilities={\"version\": \"1.0\"}&use_cdd=true" -H "Authorization: Bearer TOKEN"

# Follow browser flow to authorize `invite_url` with the code from `registration_token`


# Poll `/getauthcode` (with `printerid` from registration and `client_id` from service account) until registered, or 15 minutes pass
   22  curl "https://www.google.com/cloudprint/getauthcode?printerid=PRINTERID&oauth_client_id=CLIENTID" -H "Authorization: Bearer TOKEN"

# Use `client_id`, `client_secret` (from project config), and `authorization_code` (from poll result) to get an access token
   29  curl "https://accounts.google.com/o/oauth2/token" -d "client_id=CLIENTID&redirect_uri=oob&grant_type=authorization_code&client_secret=CLIENTSECRET&code=AUTHORIZATION_CODE"

# Use access token from authorization endpoint for the first 60 minutes, then need to use refresh token to get another access token...

# List registered printers for this proxy
   34  curl "https://www.google.com/cloudprint/list" -H "Authorization: Bearer TOKEN" -d "proxy=testme"

# Get printer details
   38  curl "https://www.google.com/cloudprint/printer" -H "Authorization: Bearer TOKEN" -d "proxy=testme&printerid=3385b1f3-6465-6ada-5c8f-6f4bdbc1c914"

# Attempt to fetch a print job
   39  curl "https://www.google.com/cloudprint/fetch" -H "Authorization: Bearer TOKEN" -d "proxy=testme&printerid=3385b1f3-6465-6ada-5c8f-6f4bdbc1c914"

# Update parameters
   40  curl "https://www.google.com/cloudprint/update" -H "Authorization: Bearer TOKEN" -d "proxy=testme&printerid=3385b1f3-6465-6ada-5c8f-6f4bdbc1c914&gcp_version=2.0&content_types=application/pdf"
