# CvSorter

A fullstack CV sorting and job matching platform using Node.js, Express, PostgreSQL, React, and OpenAI.

## Project Structure
- **Backend:** Node.js, Express, PostgreSQL (MVC + Repository pattern)
- **Frontend:** React (see `client/`)
- **Shared Types:** Zod/Drizzle schemas in `shared/`

---

## Database Schema (Main Entities)

### User
| Field      | Type      | Description           |
|----------- |---------- |----------------------|
| id         | integer   | Primary key          |
| username   | string    | Unique, required     |
| password   | string    | Hashed, required     |
| isAdmin    | boolean   | Admin flag           |
| name       | string    | Optional             |
| email      | string    | Optional             |
| createdAt  | timestamp | Auto, default now    |

### Candidate
| Field           | Type            | Description                |
|---------------- |---------------- |---------------------------|
| id              | integer         | Primary key                |
| name            | string          | Required                   |
| email           | string          | Optional                   |
| phone           | string          | Optional                   |
| position        | string          | Optional                   |
| experience      | string          | Optional                   |
| skills          | string[]        | Array of skills            |
| education       | Education[]     | Array of education objects |
| workHistory     | WorkExperience[]| Array of work objects      |
| resumeText      | string          | Raw text                   |
| originalFileName| string          | Original file name         |
| matchScore      | integer         | Calculated match score     |
| createdAt       | timestamp       | Auto, default now          |
| userId          | integer         | FK to users                |

#### Education
| Field      | Type    |
|------------|---------|
| degree     | string  |
| institution| string  |
| period     | string  |

#### WorkExperience
| Field      | Type    |
|------------|---------|
| title      | string  |
| company    | string  |
| period     | string  |
| description| string  |
| skills     | string[]|

### Job Description
| Field               | Type      |
|-------------------- |----------|
| id                  | integer  |
| title               | string   |
| department          | string   |
| location            | string   |
| employmentType      | string   |
| description         | string   |
| responsibilities    | string[] |
| requirements        | string[] |
| requiredSkills      | string[] |
| preferredSkills     | string[] |
| minimumExperience   | integer  |
| preferredExperience | integer  |
| educationRequirements| string[]|
| active              | boolean  |
| createdAt           | timestamp|

### Candidate Assessment
| Field              | Type      |
|------------------- |----------|
| id                 | integer  |
| candidateId        | integer  |
| jobDescriptionId   | integer  |
| overallScore       | integer  |
| skillsMatchScore   | integer  |
| experienceMatchScore| integer |
| educationMatchScore| integer  |
| keyStrengths       | string[] |
| developmentAreas   | string[] |
| insights           | string   |
| rank               | integer  |
| assessmentDate     | timestamp|

### BlogPost
| Field        | Type      |
|------------- |----------|
| id           | integer  |
| title        | string   |
| slug         | string   |
| content      | string   |
| summary      | string   |
| imageUrl     | string   |
| authorId     | integer  |
| authorName   | string   |
| tags         | string[] |
| published    | boolean  |
| publishedAt  | timestamp|
| createdAt    | timestamp|
| updatedAt    | timestamp|

---

## API Routes

### Auth
| Method | Endpoint         | Description         |
|--------|------------------|--------------------|
| POST   | /api/register    | Register user      |
| POST   | /api/login       | Login user         |
| POST   | /api/logout      | Logout user        |
| GET    | /api/user        | Get current user   |

### Candidates (all require authentication)
| Method | Endpoint              | Description                |
|--------|-----------------------|---------------------------|
| GET    | /api/candidates       | List all candidates       |
| GET    | /api/candidates/:id   | Get candidate by ID       |
| POST   | /api/candidates       | Create new candidate      |
| PUT    | /api/candidates/:id   | Update candidate by ID    |
| DELETE | /api/candidates/:id   | Delete candidate by ID    |

### Job Descriptions (all require authentication)
| Method | Endpoint                        | Description                        |
|--------|----------------------------------|------------------------------------|
| GET    | /api/job-descriptions           | List/search job descriptions       |
| POST   | /api/job-descriptions           | Create new job description         |
| GET    | /api/job-descriptions/:id       | Get job description by ID          |
| PATCH  | /api/job-descriptions/:id       | Update job description by ID       |

---

## Notes
- All endpoints return JSON.
- Auth endpoints do not require authentication; all others do.
- See `shared/schema.ts` for full Zod/TypeScript types.
- Follows MVC and repository pattern for backend structure.

---

## Getting Started
1. Install dependencies: `npm install`
2. Configure your `.env` for PostgreSQL and OpenAI
3. Start the backend: `npm run dev` (or `npm start`)
4. Start the frontend: `cd client && npm install && npm run dev`

---

## License
MIT 
