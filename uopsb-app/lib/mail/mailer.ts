import nodemailer from "nodemailer";
import {
  ActionSessionStatus,
  SessionSlot,
  SessionStatus,
  UserSessionData,
  UserType,
} from "@/app/types";
import * as templates from "@/lib/mail/templates";

const email = "uopstudy.notification@gmail.com";
interface RequestEmailOptions {
  to: UserType;
  from: UserType;
  topic: string;
  status: SessionStatus;
  sessions: SessionSlot[];
}
interface ActionEmailOptions {
  partner: UserType;
  newStatus: ActionSessionStatus;
  session: UserSessionData;
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
  const html = templates.reqReceived(
    options.from,
    options.topic,
    options.sessions
  );

  const mailOptions = {
    from: email,
    to: options.to.email,
    subject: `UOPSB Notification: ${getEmailSubject(options.status)}`,
    html: html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendActionEmail = async (options: ActionEmailOptions) => {
  const html = templates.reqAction(
    options.partner,
    options.session,
    options.newStatus
  );

  const mailOptions = {
    from: email,
    to: options.session.email,
    subject: `UOPSB Notification: Session Request ${options.newStatus}`,
    html: html,
  };

  await transporter.sendMail(mailOptions);
};
