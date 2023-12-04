const https = require('https');
const fs = require('fs');
const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY



const customerAccount = async (req, res) => {
    // const https = require('follow-redirects').https;


    const options = {
        'method': 'POST',
        'hostname': 'api.paystack.co',
        'path': '/dedicated_account/assign',
        'headers': {
            Authorization: `Bearer ${SECRET_KEY}`,
            'Content-Type': 'application/json'
        },
        'maxRedirects': 20
    };

    const reqPaystack = https.request(options, function (resPaystack) {
        const chunks = [];

        resPaystack.on("data", function (chunk) {
            chunks.push(chunk);
        });

        resPaystack.on("end", function (chunk) {
            var body = Buffer.concat(chunks);
            res.send(body.toString());
        });

        resPaystack.on("error", function (error) {
            console.error(error);
        });
    });

    const postData = JSON.stringify({
        "email": req.body.email,
        "first_name": req.body.first_name,
        "middle_name": req.body.middle_name,
        "last_name": req.body.last_name,
        "phone": req.body.phone,
        "preferred_bank": "wema-bank",
        "country": "NG"
    });

    reqPaystack.write(postData);

    reqPaystack.end();
}



const createWallet = async (req, res) => {
    try {
        const customer = req.body.customer;
        const preferredBank = "wema-bank";

        const params = {
            customer,
            preferredBank,
        };

        const options = {
            hostname: "api.paystack.co",
            port: 443,
            path: "/dedicated_account",
            method: "POST",
            headers: {
                Authorization: `Bearer ${SECRET_KEY}`,
                "Content-Type": "application/json",
            },
        };

        const response = await new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = "";

                res.on("data", (chunk) => {
                    data += chunk;
                });

                res.on("end", () => {
                    try {
                        const responseData = JSON.parse(data);
                        resolve(responseData);
                        console.log(responseData);
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            req.on("error", (error) => {
                reject(error);
            });

            req.write(JSON.stringify(params));
            req.end();
        });

        res.status(200).send({ message: "Dedicated account created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error creating dedicated account" });
    }
};






exports.createWallet = createWallet;
exports.customerAccount = customerAccount;