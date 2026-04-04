
# NexHire — Freelance Portfolio Marketplace

A full-stack web application where freelancers showcase structured portfolios and clients discover, filter, and hire them.

## Tech Stack

| Module | Technology | Where Used |
|--------|-----------|------------|
| M1 | HTML5, CSS3, Bootstrap 5 | All pages, responsive layout |
| M2 | JavaScript, jQuery, DOM, Validation | legacy-search/search.html |
| M3 | AngularJS, Directives, Filters | angular-compare/compare.html |
| M4 | AJAX, REST API, JSON | jQuery AJAX + React fetch() calls |
| M5 | Node.js, Express, Sessions, Multer, Nodemailer | server/ |
| M6 | MongoDB, Mongoose | server/models/ |
| M7 | ReactJS, Hooks, React Router | client/src/ |

## Features
- Structured portfolio case studies (description, tech stack, role, challenges, outcome)
- Advanced filtering by skills, experience, availability, and budget
- Inquiry lifecycle tracking (sent → viewed → responded → accepted)
- Session-based authentication with bcrypt password hashing
- File upload for portfolio images
- Email notifications on inquiry
- AngularJS side-by-side freelancer comparison
- jQuery live search with real-time AJAX

## How to Run

### Backend
cd server
npm run dev

### Frontend
cd client
npm start

### AngularJS Compare Page
Open client/public/compare.html in browser

### jQuery Search Page
Open client/public/search.html in browser

## Environment Variables
Create a .env file in server/ with:
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
SESSION_SECRET=your_secret
EMAIL_USER=your_gmail
EMAIL_PASS=your_app_password