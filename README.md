# Yelp Camp App

This is an express application. This app does not use any of the front end frameworks (ReactJS, AngularJS, VueJS, etc...) for development.
The intention behind creating this web application was to learn **Backend Development**.
However, there are some features of this applicaiton :-

- Used Bootstrap for CSS
- Front End developed using EJS Templating
- Used [Express JS](https://www.expressjs.org) and [Node JS](https://https://www.nodejs.org) for Backend
- Used MongoDB and [Mongoose](https://www.mongoosejs.com) for Database Operations
- Used [PassportJS](https://www.passportjs.com) for User Authentication
- Used MongoDB Atlas to host Cloud Database
- Used [Heroku](https://www.heroku.com) CLI to host the entire project on Web
- Used Bing Maps API for rendering of Map
- Used Opencage API for geolocation and geocoding services
- Used Moment JS to display time since _campground_ and _comment_ was created
- Used [Multer](https://github.com/expressjs/multer#readme) for Image Upload
- Used Cloudinary to host images/media uploaded by _User_

## Run Locally

To install and run this application locally, follow these steps :-

- **PREREQUISITES**
  make sure that you have already installed **node** and **npm**. if not, then you can visit the official site for assistance for that matter. Once you have installed both **node** and **npm**, check if they have been correctly installed on your machine byt typing these commands in your _terminal_
  For Node
  ```
  node --version
  ```
  For npm
  ```
  npm --version
  ```
  Once you have correctly installed both on your machine, follow these steps further !
- **STEP 1** - Fork this repository
- **STEP 2** - Clone this repository to your local machine
  ```
  git clone <repository url>
  ```
- **STEP 3** - Install all the dependencies of the app
  ```
  npm install
  ```
- **STEP 4** - Run this applicaiton on your local machine by typing the following on your terminal
  ```
  npm start
  ```

### Points to Ponder

- The last command will start a **_local server_** that will accessible on `localhost:3000`
- The Map feature does not work on _local version_ due to API key usage restrictions.
- For Maps to work, you must acquire your own _API keys_.
- You can either obatin those from the same sources (Bing and Opencage) or you can obtain from other Sources.
- If you wish to switch from _Opencage API_ for geolocation to other providers, you must change the [Node-geocoder](https://www.npmjs.com/package/node-geocoder) `options` configuration within the application.
- For geocoding and geolocation services to work, you must save your API key as an environment variable by the name **_GEOCODER_API_KEY_**

## Visit On Web

If you want to watch the production version of the **YelpCampApp**, you can simply visit [YelpCamp](https://yelpcampapp.herokuapp.com) to watch the production build in action.

### Note

- the production build and the test version of _yelpcampap_ might differ in some features since they are in development phase.
