var admin = require("firebase-admin");
const Express = require("express");
const bodyParser = require("body-parser");

const Notification = require("../models/notificationItem");
const verify = require("../routes/authVerify");
const Joi = require("@hapi/joi");

var serviceAccount = require("./serviceAccountKey.json");

const registerSchema = Joi.object({
    ntoken: Joi.string().min(3).required(),
    id: Joi.string().min(3).required(),
});
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


const router = Express.Router();
router.post("/register", verify, async (req, res) => {

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

        const { title, body, imageUrl } = req.body;
        const results = await Notification.find().exec();
        await admin.messaging().sendMulticast({
            tokens,
            notification: {
                title,
                body,
                imageUrl,
            },
        });
        res.status(200).json({ message: "Successfully sent notifications!" });
    } catch (err) {
        res
            .status(err.status || 500)
            .json({ message: err.message || "Something went wrong!" });
    }
});
module.exports = router;