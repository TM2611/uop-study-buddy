import nodemailer from "nodemailer";
import { SessionSlot, SessionStatus, UserType } from "@/app/types";
import * as templates from "@/lib/mail/templates";

const email = "uopstudy.notification@gmail.com";
interface RequestEmailOptions {
  to: UserType;
  from: UserType;
  topic: string;
  status: SessionStatus;
  sessions: SessionSlot[];
}
const getEmailSubject = (status: SessionStatus) => {
  switch (status) {
    case "ACCEPTED":
      return "Session Request Accepted";
    case "REJECTED":
      return "Session Request Declined";
    case "CANCELLED":
      return "Booking Cancelled";
    case "PENDING":
    default:
      return "New Session Request";
  }
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: email,
    pass: process.env.APP_PASSWORD,
  },
});

export const sendRequestEmail = async (options: RequestEmailOptions) => {
  const emailFunction = templates.requestReceivedEmail;
  const html = emailFunction(options.from, options.topic, options.sessions);

  const mailOptions = {
    from: email,
    to: options.to.email,
    subject: `UOPSB Notification: ${getEmailSubject(options.status)}`,
    html: html,
  };

  await transporter.sendMail(mailOptions);
};
