## User Authentication
This microservice will:
- authenticate user using OAuth (google/github)
- save jwt token in browser for future access of user id and payload

## Auth workflow
- access code -> token (oauth login)
- token -> payload (browser to backend)
