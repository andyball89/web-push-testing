Installation/Running
 - Clone repo 
 - "npm install" 
 - "npm run dev" 
 - localhost url should be visible in console, navigate there. 
 - Ensure the self signed cert is added/allowed in keychain.

Testing
- Run in both Chrome and Safari on MacOS. (Chrome first to ensure values are correctly returned.)
- Open the site and confirm that you see a message 'service worker running'
- Click the subscribe button
- When asked for permissions, allow. (In safari in the demo, you must do this imeedately as we use a timer to execute the subscription code since the promise from permissions request does not return as it does in other browsers)
- Note the resulting subscription object details shown (or lack thereof).

