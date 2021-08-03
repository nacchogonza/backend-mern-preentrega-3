import clientTwilio from "twilio";
import { logger } from "./logger";

/* TWILIO CONFIG & UTILS */
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const accountToken = process.env.TWILIO_ACCOUNT_TOKEN;

const twilioFrom = process.env.TWILIO_FROM_SMS;

const twilioSender = clientTwilio(accountSid, accountToken);

const sendSms = async (data) => {
  
  try {
    const msg = await twilioSender.messages.create({
      body: data.body,
      from: twilioFrom,
      to: data.userPhone,
    });
    logger.log('info', `SMS enviado: ${msg.sid}`)
  } catch (error) {
    logger.log('error', `Error enviando SMS: ${error}`)
  }
};

export { sendSms };
