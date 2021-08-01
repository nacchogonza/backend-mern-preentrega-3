import nodemailer from "nodemailer";
import { logger } from "./logger";

const gmailUser = "nachomgonzalez93@gmail.com";
const gmailPass = "ouikpvfrztcmqqhy";

const transporterGmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
});

const sendGmailEmail = (mailOptions) => {
  transporterGmail.sendMail(mailOptions, (err, info) => {
    if (err) {
      logger.log("error", err);
      return err;
    }
    logger.log("info", info);
  });
};

export { sendGmailEmail };
