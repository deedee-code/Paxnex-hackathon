const mongoose = require('mongoose');

const dbConnect = async () => {

    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database Connected Successfully")
    } catch (error) {
        console.error(error)
    }

}

module.exports = dbConnect;