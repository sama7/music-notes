# music-notes

Music Notes was created to capture notes connected to your favorite songs. Whether it’s a random detail in a track, some interesting trivia, or memories with loved ones, you can capture and save it all with Music Notes.

To use Music Notes, log in securely to your Spotify account via the button on the homepage. You will then be able to select any of your saved playlists. Once a playlist is selected, you can add, edit, or delete your notes.

## Screenshots

![Screenshot of Music Notes homepage](https://i.imgur.com/TrNWrce.png)

![Screenshot of list of user's playlists](https://i.imgur.com/AwlDzjs.png)

![Screenshot of notes for Christmas playlist](https://i.imgur.com/bY7ChY1.png)

A live version of the website is available at https://musicnotes.herokuapp.com/. However, since the app is in ["Development Mode"](https://developer.spotify.com/documentation/web-api/concepts/quota-modes), new users need to be manually onboarded. You can follow the below instructions to create a clone of this app so you can run the site locally.

## Local Installation

1. Clone this repo or download and extract the ZIP onto your local machine.
2. Navigate to the project directory and run the below command to install the server dependencies:
```sh
npm install
```
3. Navigate to the `/client` directory and run the below command to install the client dependencies:
```sh
npm install
```
4. [Create an app](https://developer.spotify.com/dashboard/create) in the Spotify for Developers Dashboard. For Redirect URI, enter:
```sh
http://localhost:3000/callback
```
5. Visit the [Spotify for Developers Dashboard](https://developer.spotify.com/dashboard) and click on your app.
6. Click "Settings" in the top-right corner.
7. Note down your Client ID and Client Secret.
8. Go to the "User Management" section and onboard yourself as a user.
9. Create a MongoDB database by following [these instructions](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose#setting_up_the_mongodb_database) on MDN (Section: "Setting up the MongoDB database"). Note down the connection string. 
10. Create two collections within the database: `users` and `notes`.
11. Create a `config.env` file in the root directory of the project. Populate it with the below contents (replace the portions with square brackets as instructed):
```
DEV_MONGODB_URI=[ENTER CONNECTION STRING FROM STEP 9]
DEV_DB_NAME=[ENTER DATABASE NAME FROM STEP 9]
PORT=4000
CLIENT_SECRET=[ENTER CLIENT SECRET FROM STEP 7]
```
12. In `/routes/authorize.js`, update the value of the `client_id` constant to your Client ID from Step 7.
13. Create a `.env` file in the `client` directory of the project. Populate it with the below contents:
```
REACT_APP_ENV=development
REACT_APP_DEV_SERVER_PORT=4000
```

## Running the Local App
1. Navigate to the project directory in the command line and run the below command to start the server:
```sh
npm run devstart
```
2. Navigate to the `client` directory and run the below command in a separate command line or terminal window to start the client side of the app:
```sh
npm start
```
3. Navigate to `http://localhost:3000` in the web browser to access the app.
4. Enjoy!