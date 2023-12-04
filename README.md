# Paxnex-backend-API


Welcome to the Paxnex API Documentation. This API provides various functionalities for managing users, accounts, financial transactions. It offers a wide range of features to create, read, update, and delete data. This API is a RESTful APIs using Node.js, Express.js and Mongoose.


## Manual Installation

- git clone https://github.com/deedee-code/Paxnex-hackathon.git
- cd Paxnex-backend
- npm install
- Prepare the environment variables by generating .env file is the root directory to store your MONGODB_URI, JWT_SECRET and so on.
- npm run dev



## Table of Contents

- [Features](https://github.com/deedee-code/Paxnex-hackathon#features)
- [Environment Variables](https://github.com/deedee-code/Paxnex-hackathon#environment-variables)
<!-- - [API Documentation](https://github.com/deedee-code/Paxnex-hackathon#api-documentation) -->



## [Features](#features)

- **NoSQL database**: [MongoDB](https://www.mongodb.com/) object data modeling using [Mongoose](https://mongoosejs.com/)
- **Authentication and authorization**: using [JWT](https://jwt.io/) (access and refresh token)
- **Error handling**: error handling mechanism with specific result messages and codes
- **Email Sending**: for verification code by using [nodemailer](https://nodemailer.com/about/)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv)
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)



## [Environment Variables](#environment-variables)

The environment variables should be set in a '.env' file. The '.env' file should be created in your root folder.You should set the values of these keys:

```js
# PORT
PORT=PORT_HERE

# Mongoose URL
MONGODB_URI=MONGODB_URI_HERE

# JWT key for token
JWT_SECRET=JWT_SECRET_HERE

#Nodemailer user and pass
GOOGLE_USER=GOOGLE_USER_HERE
GOOGLE_PASS=GOOGLE_PASS_HERE

#paystack test/live secret key
PAYSTACK_SECRET_KEY=PAYSTACK_SECRET_KEY_HERE
```



<!-- ## [API Documentation](#api-documentation)

To view all APIs and learn all the details required for the requests and responses, click on this postman link: https://documenter.getpostman.com/view/26786258/2s9YeBfEXf -->



**THANK YOU!**
