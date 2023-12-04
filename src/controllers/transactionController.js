const https = require('https');

const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY




const initializeTransaction = async (req, res) => {
    const email = req.body.email;
    const amount = req.body.amount;
    // params
    const params = JSON.stringify({
        "email": email,
        "amount": amount * 100
    })

    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
        method: 'POST',
        headers: {
            Authorization: `Bearer ${SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
    }

    const reqPaystack = https.request(options, async resPaystack => {
        let data = ''

        resPaystack.on('data', (chunk) => {
            data += chunk
        });

        resPaystack.on('end', async () => {

            console.log(JSON.parse(data))
            return res.status(200).send(data)
        })

    }).on('error', error => {
        console.error(error)
        return res.status(500).send(error)
    })

    reqPaystack.write(params)
    reqPaystack.end()

}


const verifyTransaction = async (req, res) => {
    const https = require('https');
    const transactionReference = req.params.reference;

    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: `/transaction/verify/${transactionReference}`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${SECRET_KEY}`,
        },
    };

    const request = https.request(options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            try {
                const responseData = JSON.parse(data);
                // Process and handle the verified transaction data
                console.log(responseData);
                res.status(200).send(responseData);
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: 'Failed to parse transaction data' });
            }
        });
    });

    request.on('error', (error) => {
        console.error(error);
        res.status(500).send({ error: 'Network error occurred' });
    });

    request.end();
};





exports.initializeTransaction = initializeTransaction;
exports.verifyTransaction = verifyTransaction;
