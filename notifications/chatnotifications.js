var admin = require("firebase-admin");
const Express = require("express");
const bodyParser = require("body-parser");

const Notification = require("../models/notificationItem");
const verify = require("../routes/authVerify");
const Joi = require("@hapi/joi");

var serviceAccount = require("./serviceAccountKey.json");
var fcm = require('fcm-notification');
const registerSchema = Joi.object({
    ntoken: Joi.string().min(3).required(),
    id: Joi.string().min(3).required(),
});
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const certPath = admin.credential.cert(serviceAccount);

var FCM = new fcm(certPath);

const router = Express.Router();
router.post("/register", async (req, res) => {

    const notificationtoken = await Notification.findOne({ email: req.body.ntoken });
    const userId = await Notification.findOne({ email: req.body.id });

    if (notificationtoken) {
        res.status(400).send("device already registed");
        return;
    }

    const notification = new Notification({
        id: req.body.id,
        ntoken: req.body.ntoken,

    });
    try {
        //VALIDATION OF USER INPUTS

        const { error } = await registerSchema.validateAsync(req.body);
        //WE CAN JUST GET THE ERROR(IF EXISTS) WITH OBJECT DECONSTRUCTION

        //   IF ERROR EXISTS THEN SEND BACK THE ERROR
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        } else {
            //NEW USER IS ADDED

            const savenotification = await notification.save();
            res.status(200).send({ message: "Successfully registered FCM Token!" });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post("/notifications", async (req, res) => {

    try {
        const { tokens, title, body, imageUrl } = req.body;
        let message = {
            android: {
                notification: {
                    title: title,
                    body: body,
                },
            },
            token: tokens
        };

        FCM.send(message, function (err, resp) {
            if (err) {
                throw err;
            } else {
                console.log('Successfully sent notification');
            }
        });

    } catch (err) {
        throw err;
    }

});
module.exports = router;