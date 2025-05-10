# Future

## Scheduled export

The only big feature missing in for this to work exactly as I want it to is the ability to ingest the data into my own database.
For that I need a way to automatically export or backup the data. I've come to terms that this type of feature is really hard on iOS without a server, but for Android I've tried to implement the following (ordered from what I would like the most to the least):

1. Use background tasks to automatically copy the DB to a folder. Which can be shared with Syncthing or similar software. This would be the perfect solution for me, but I encountered problems with every library I have tried (https://github.com/transistorsoft/react-native-background-fetch/issues/565). I could try to write native code for it, but it's an effort I'm not willing to put in this at the moment
2. Use scheduled notifications to wake up the app and export the database. I would like to do this through local notifications, but with the current implementation, Expo can only wake up the app with Headless JS with remote push notifications (https://github.com/expo/expo/issues/28027#issuecomment-2325209552).
3. Allow users to select an external folder to use as the folder for their SQLite database file. It looks like Expo SQLite throws an error when trying to open a DB folder outside of the apps path. I think this is an OS limitation.
4. Setup remote push notifications. This means anyone trying to use the app would have to setup their own push notification system or I would have to offer some sort of public server which I'm not willing to do at the moment. On top of that Headless JS (which is also used for option 1) seems to not have a future ahead of it (https://github.com/facebook/react-native/issues/45731#issuecomment-2252845288 and https://github.com/facebook/react-native/issues/36816#issuecomment-2627467783)
5. Setup a self hostable server that can sync with the device and get a copy of the database every once in a while. This is probably the way to go and although it adds friction it resolves most of the problems since we can choose to sync the data as soon as the user changes something. Syncing database is not a simple problem to solve though (even if we don't support multiple users). I would like to give a go at this in the future
6. Have the ability to setup local notifications that remind the user to export data. Low value and low effort, but it might a start. Clicking the notification could export it automatically to a predefined folder

# Contributing

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
