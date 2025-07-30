````markdown
# UOP Study Buddy 🎓

UOP Study Buddy is a web application designed to help University of Portsmouth students find and connect with suitable study partners. The platform aims to solve the challenge of finding like-minded peers, promoting collaborative learning, and fostering a more interconnected and supportive university environment.

By matching students based on their course, availability, and academic confidence, the application makes it easier to form effective study groups, enhancing academic progress and the overall university experience.

## ✨ Key Features

* **Secure UoP Authentication**: Users sign in with their official University of Portsmouth Google account, ensuring a secure and verified user base.
* **Personalised User Profiles**: New users complete a multi-step setup form to detail their course, year, weekly availability, and confidence levels across various topics relevant to their department.
* **Advanced Student Matchmaking**: The system offers multiple algorithms to find the perfect study partner:
    * **Similarity Match**: Uses a Jaccard similarity algorithm to find peers with similar confidence levels across all course topics.
    * **Confidence Match**: Connects you with students who have an equal or higher confidence level in a specific topic you want to study.
    * **Department Match**: Finds other students within the same academic department.
* **Seamless Session Booking**: Users can view a partner's availability, select open slots, and send study session requests directly through the platform.
* **Interactive Dashboard**: A central hub to manage your academic collaborations. View incoming session requests, track confirmed bookings, and see a history of completed sessions.
* **Feedback and Ratings**: After a session is complete, users can provide a star rating and written feedback to help evaluate the quality of study partnerships.
* **Email Notifications**: Stay informed with automatic email notifications for new session requests, acceptances, and cancellations.

***

## 🛠️ Tech Stack

This project is built with a modern, scalable tech stack:

* **Framework**: **Next.js**
* **Language**: **TypeScript**
* **Frontend**: **React**
* **Styling**: **Tailwind CSS**
* **Database**: **Azure PostgreSQL**
* **Authentication**: **Google OAuth 2.0**
* **Form Management**: **Formik** & **Yup** for validation
* **Testing**: **Jest**
* **DevOps & CI/CD**: **Azure DevOps** (Azure Repos, Boards, and Pipelines)

***

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v20.7.0 or later)
* npm, yarn, or pnpm
* Access to a PostgreSQL database
* A Google Cloud project with OAuth 2.0 credentials enabled

### Installation

1.  **Clone the Repository**
    ```sh
    git clone [https://dev.azure.com/UP938751/_git/uop-study-buddy](https://dev.azure.com/UP938751/_git/uop-study-buddy)
    ```
2.  **Navigate to the App Directory**
    ```sh
    cd uop-study-buddy/uopsb-app
    ```
3.  **Install Dependencies**
    ```sh
    npm install
    ```
4.  **Set Up Environment Variables**

    Create a `.env.local` file in the `uopsb-app` directory and add the following environment variables with your own credentials:

    ```env
    # Google OAuth Credentials
    NEXT_PUBLIC_GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"

    # PostgreSQL Database Connection
    DB_HOST="YOUR_DB_HOST"
    DB_USER="YOUR_DB_USER"
    DB_PASSWORD="YOUR_DB_PASSWORD"
    DB_NAME="YOUR_DB_NAME"

    # Nodemailer (for email notifications)
    APP_PASSWORD="YOUR_GMAIL_APP_PASSWORD"
    
    # Application URL
    URL="http://localhost:3000"
    ```

5.  **Run the Development Server**
    ```sh
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

***

## 🚀 Usage

1.  **Sign In**: Access the application and sign in using an authorised University of Portsmouth (`@myport.ac.uk`) Google account. Unauthorised accounts will be denied access.
2.  **First-Time Setup**: New users will be guided through a multi-step form to provide their academic details, set their weekly availability, and rate their confidence in course-related topics.
3.  **Find a Partner**: Navigate to the "Study" page to search for partners. You can filter by:
    * **Department**: For general collaboration within your school.
    * **Similarity**: To find peers with a similar academic profile.
    * **Confidence**: To find a mentor or someone more knowledgeable on a specific topic.
4.  **Book a Session**: Once you find a suitable partner, view their profile and availability. Select one or more time slots and send a session request.
5.  **Manage Sessions**: Use the "Dashboard" to view pending requests, see your upcoming confirmed bookings, and cancel sessions if needed. The other user will be notified of any changes via email.

***

## 👨‍💻 Author

* **Taylor Aaron McFarlane** - [UP938751](https://dev.azure.com/UP938751)

This project was submitted in partial fulfilment of the requirements for the degree of Bachelor of Science in Software Engineering at the University of Portsmouth, supervised by Claudia Iacob.
````