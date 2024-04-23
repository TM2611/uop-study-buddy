import { SessionSlot, UserSessionData, UserType } from "@/app/types";

const appLink = process.env.URL;

const formatSession = (session: UserSessionData) => `
  Date: ${new Date(session.date).toLocaleDateString()}<br>
  Time: ${session.start_hour}:00 - ${session.end_hour}:00
`;

export const reqReceived = (
  user: UserType,
  topic: string,
  sessions: SessionSlot[]
) => `
    <h1>New Session Request</h1>
    <img src="${user.picture}" alt="${
  user.given_name
}'s picture" style="width: 100px; height: auto; border-radius: 50%;" />
    <p>You have received a new session request from ${user.given_name} ${
  user.family_name || ""
}
}). Here are the details:</p>
    <p>Topic: ${topic}</p>
    <ul>${sessions
      .map((session) => `<li>${formatSession(session)}</li>`)
      .join("")}</ul>
    <p>Please get in touch with ${user.given_name} at ${
  user.email
} to discuss the format and location of the study sessions.</p>
    <p>Click <a href="${appLink}">here</a> to visit the app</p>
  `;

export const reqAction = (
  user: UserType,
  session: UserSessionData,
  newStatus: string
) => `
  <h1>Booking ${newStatus}</h1>
  <img src="${user.picture}" alt="${
  user.given_name
}'s picture" style="width: 100px; height: auto; border-radius: 50%;" />
  <p>${user.given_name} ${
  user.family_name || ""
} has ${newStatus.toLowerCase()} the following booking:</p>
  <p>Topic: ${session.topic_name}</p>
  <p>${formatSession(session)}</li>
  <p>Please contact ${user.given_name} at ${
  user.email
} to finalize the format and location of the study session.</p>
  <p>Click <a href="${appLink}">here</a> to visit the app</p>
  `;
