# Yelp Camp App

This is an express application. This app does not use any of the front end frameworks (ReactJS, AngularJS, VueJS, etc...) for front-end part of development. The intention behind creating this web application was to learn **Backend Development**.
The following are some of the technologies and dependencies of this applicaiton :-

- Used [Bootstrap](https://getbootstrap.com/docs/4.5/getting-started/introduction/) for CSS and enhancing UI
- Used [Express JS](https://expressjs.com/) and [Node JS](https://nodejs.org/en/docs/) for Backend
- Used [MongoDB](https://www.mongodb.com/) and [Mongoose ODM](https://mongoosejs.com/docs/guide.html) for Database Operations
- Used [PassportJS](http://www.passportjs.org/) for User Authentication
- Used [MongoDB Atlas](https://docs.atlas.mongodb.com/) to host Cloud Database
- Used [Heroku](https://www.heroku.com) Cloud Application Platform to host the entire project on Web
- Used [Bing Maps API](https://docs.microsoft.com/en-us/bingmaps/v8-web-control/?redirectedfrom=MSDN) for rendering of Map
- Used [Opencage API](https://opencagedata.com/api) for geolocation and geocoding services
- Used [Multer](https://github.com/expressjs/multer#readme) for File/Image Upload
- Used [Cloudinary](https://cloudinary.com/documentation) to host Media/Images uploaded by _User_

## Run Locally

To install and run this application locally, follow these steps :-

- **PREREQUISITES**

  Make sure that you have already installed **node** and **npm**. if not, then you can visit the official site for assistance for that matter. Once you have installed both **node** and **npm**, check if they have been correctly installed on your machine by typing these commands in your _terminal_
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
  npx nodemon
  ```
  OR
  ```
  nodemon
  ```
  If yoy have `nodemon` installed on your machine _globally_

### POINTS TO PONDER

- The last command will start a **_local server_** that will accessible on `localhost:3000`
- You must have **_MongoDB_** installed on your machine and it must be running before **STEP 4**.
- The Map feature does not work on _local version_ due to API key usage restrictions.
- For Maps to work, you must acquire your own _API keys_.
- You can either obatin those from the same sources (Bing and Opencage) or you can obtain from other Sources.
- If you wish to switch from _Opencage API_ for geolocation to other providers, make sure to change the [Node-geocoder](https://www.npmjs.com/package/node-geocoder) `options` configuration within the application.

#### LIST OF ENVIRONMENT VARIABLES

- `SERVER_SECRET` - For server secret used in Express-Session
- `DATABASEURL` - For url of database
- `GEOCODER_API_KEY` - API key provided by Opencage (Used in Geolocation)
- `CLOUDINARY_API_KEY` - API Key provided by Cloudinary
- `CLOUDINARY_API_SECRET` - API Secret provided by Cloudinary

## Visit On Web

If you want to see the production version of the **YelpCampApp**, you can simply visit [YelpCampApp](https://yelpcampapp.herokuapp.com).

## Note

- The production build and the test version of _yelpcampap_ might differ in some features since they are in development phase.
- Sometimes, you might find the production app version of _yelpcampapp_ down for _maintainance_ work.
