import clientTwilio from "twilio";
import { logger } from "./logger";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const accountToken = process.env.TWILIO_ACCOUNT_TOKEN;

const twilioFromWpp = process.env.TWILIO_FROM_WPP;

const twilioSender = clientTwilio(accountSid, accountToken);

const sendWpp = async (data) => {
  console.log(data.userPhone);
  try {
    const msg = await twilioSender.messages.create({
      body: data.body,
      from: twilioFromWpp,
      to: data.userPhone,
    });
    logger.log('info', `Whatsapp enviado: ${msg.sid}`)
  } catch (error) {
    logger.log('error', `Error enviando Whatsapp: ${error}`)
  }
};

export { sendWpp };
