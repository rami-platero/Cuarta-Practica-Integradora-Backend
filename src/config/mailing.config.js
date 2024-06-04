import { config } from "./variables.config.js";
import nodemailer from 'nodemailer'

export const mailingTransport = nodemailer.createTransport({
  service: config.mailing.service,
  port: 587,
  auth: {
    user: config.mailing.user,
    pass: config.mailing.password,
  },
});
