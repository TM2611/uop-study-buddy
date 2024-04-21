import nodemailer from "nodemailer";
import { SessionSlot, SessionStatus } from "@/app/types";

interface EmailOptions {
  to: string;
  topic: string;
  status: SessionStatus;
  sessions: SessionSlot[];
}

const newRequestReceivedEmail = (
  requesterEmail: string,
  topic: string,
  sessions: SessionSlot[]
) => `
  <h1>New Session Request</h1>
  <p>You have received a new session request from ${requesterEmail}. Here are the details:</p>
  <p>Topic: ${topic}</p>
  <ul>${sessions.map((session) => `<li>${session}</li>`).join("")}</ul>
`;

const requestAcceptedEmail = (
  acceptorEmail: string,
  topic: string,
  sessions: SessionSlot[]
) => `
  <h1>Session Request Accepted</h1>
  <p>${acceptorEmail} has accepted your session request. Here are the details:</p>
  <p>Topic: ${topic}</p>
  <ul>${sessions.map((session) => `<li>${session}</li>`).join("")}</ul>
`;
const requestDeclinedEmail = (
  declinerEmail: string,
  topic: string,
  sessions: SessionSlot[]
) => `
  <h1>Session Request Declined</h1>
  <p>${declinerEmail} has declined your session request. Here are the details:</p>
  <p>Topic: ${topic}</p>
  <ul>${sessions.map((session) => `<li>${session}</li>`).join("")}</ul>
`;

const bookingCancelledEmail = (
  cancellerEmail: string,
  topic: string,
  sessions: SessionSlot[]
) => `
  <h1>Booking Cancelled</h1>
  <p>${cancellerEmail} has cancelled the following booking:</p>
  <p>Topic: ${topic}</p>
  <ul>${sessions.map((session) => `<li>${session}</li>`).join("")}</ul>
`;

const statusFunction = {
  ACCEPTED: requestAcceptedEmail,
  DECLINED: requestDeclinedEmail,
  CANCELLED: bookingCancelledEmail,
  PENDING: newRequestReceivedEmail,
};
const sendEmail = async (options: EmailOptions) => {
  const email = "uopstudy.notification@gmail.com";
  const password = process.env.EMAIL_PASSWORD;
  console.log(email, password);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: password,
    },
  });

  const emailFunction =
    statusFunction[options.status as keyof typeof statusFunction];
  console.log(emailFunction);
  const html = emailFunction(options.to, options.topic, options.sessions);

  // Define the email options
  const mailOptions = {
    from: email,
    to: options.to,
    html: html,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
