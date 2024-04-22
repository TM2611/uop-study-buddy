import { SessionSlot, UserType } from "@/app/types";

const appLink = process.env.URL;

const formatSession = (session: SessionSlot) => `
  Date: ${session.date}<br>
  Day: ${session.day}<br>
  Start Hour: ${session.start_hour}<br>
  End Hour: ${session.end_hour}
`;

export const requestReceivedEmail = (
  user: UserType,
  topic: string,
  sessions: SessionSlot[]
) => `
  <h1>New Session Request</h1>
  <p>You have received a new session request from ${user.given_name} (${
  user.email
}). Here are the details:</p>
  <p>Topic: ${topic}</p>
  <ul>${sessions
    .map((session) => `<li>${formatSession(session)}</li>`)
    .join("")}</ul>
  <p>Click <a href="${appLink}">here</a> to view the request in the app.</p>
`;

export const requestAcceptedEmail = (
  user: UserType,
  topic: string,
  sessions: SessionSlot[]
) => `
  <h1>Session Request Accepted</h1>
  <p>${user.given_name} (${
  user.email
})   has accepted your session request. Here are the details:</p>
  <p>Topic: ${topic}</p>
  <ul>${sessions
    .map((session) => `<li>${formatSession(session)}</li>`)
    .join("")}</ul>
  <p>Click <a href="${appLink}">here</a> to view the session in the app.</p>
`;

export const requestDeclinedEmail = (
  user: UserType,
  topic: string,
  sessions: SessionSlot[]
) => `
  <h1>Session Request Declined</h1>
  <p>${user.given_name} (${
  user.email
}) has declined your session request. Here are the details:</p>
  <p>Topic: ${topic}</p>
  <ul>${sessions
    .map((session) => `<li>${formatSession(session)}</li>`)
    .join("")}</ul>
  <p>Click <a href="${appLink}">here</a> to view the app.</p>
`;

export const bookingCancelledEmail = (
  user: UserType,
  topic: string,
  sessions: SessionSlot[]
) => `
  <h1>Booking Cancelled</h1>
  <p>${user.given_name} (${user.email}) has cancelled the following booking:</p>
  <p>Topic: ${topic}</p>
  <ul>${sessions
    .map((session) => `<li>${formatSession(session)}</li>`)
    .join("")}</ul>
  <p>Click <a href="${appLink}">here</a> to view the app.</p>
`;
