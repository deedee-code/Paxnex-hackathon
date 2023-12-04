const express = require('express');
require('dotenv').config();
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dbConnect = require('./src/config/database');
const authRoute = require('./src/routes/authRoute');
const settingRoute = require('./src/routes/settingRoute');
const walletRoute = require('./src/routes/walletRoute');
const transactionRoute = require('./src/routes/transactionRoute')



dbConnect();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/api/user', authRoute);
app.use('/api/setting', settingRoute);
app.use('/api/wallet', walletRoute);
app.use('/api/transaction', transactionRoute)



io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);

    socket.on('login', (email) => {
        console.log('User logged in: ' + email);

        socket.emit('loginNotification', {
            message: `User ${email} has logged in.`
        });
    });

    socket.on('enableEmail', (email) => {
        console.log('User enabled email: ' + email);

        socket.emit('emailEnableNotification', {
            message: `User ${email} has enabled email notifications.`
        });
    });

    socket.on('enableTransaction', (email) => {
        console.log('User enabled transaction: ' + email);

        socket.emit('transactionEnableNotification', {
            message: `User ${email} has enabled transaction notifications.`
        });
    });

    socket.on('transaction', (transactionData) => {
        console.log('Transaction occurred: ' + transactionData.transactionId);

        socket.emit('transactionNotification', {
            message: `Transaction ${transactionData.transactionId} occurred.`
        });
    });
});


app.get('/', (req, res) => {
    res.send("Server is running Successfully...")
})


app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
})