# ILA Global — Full-Stack Education & Career Architecture Platform

A full-stack enterprise web application for **ILA Global** (International Learning Alliance), featuring a **React 19 + TypeScript** frontend coupled with a high-performance **Django REST Framework (DRF)** backend powered by Google Gemini AI.

---

## 📖 Architecture & Integration Blueprint

> 🌟 **Complete Backend Integration Guide**: See [DRF_BACKEND_INTEGRATION_BLUEPRINT.md](file:///d:/ILA/ila-acc-web-main-11.09.26/DRF_BACKEND_INTEGRATION_BLUEPRINT.md) for the end-to-end blueprint, exhaustive endpoint catalog, payload schemas, and React hooks.
> 
> 🤖 **AI Engine Hub Integration Guide**: See [AI_ENGINE_HUB_URL_INTEGRATION_GUIDE.md](file:///d:/ILA/ila-acc-web-main-11.09.26/AI_ENGINE_HUB_URL_INTEGRATION_GUIDE.md) for standalone curriculum generation deep-linking.

---

## 🚀 Key Modules & Endpoints

| Domain Module | Frontend Section | DRF Backend App | Key Capabilities |
|---|---|---|---|
| **Study Abroad** | `src/pages/StudyAbroadPage.tsx` | `apps.study_abroad` | Real-time AI Resume Parser (Gemini), Dynamic Tie-ups, ATS Kanban, Privacy Shield |
| **Work While You Study** | `src/pages/WorkWhileYouStudyPage.tsx` | `apps.work_study` | Dynamic packages, selectable course streams, candidate progression, JD promotion to Ads |
| **Communication Engine** | `src/components/admin/CommunicationHub.tsx` | `apps.communication_engine` | Multi-channel automated trigger rules (WhatsApp/Email/SMS), live simulation, dispatch audit logs |
| **Job Search & Placements** | `src/pages/JobsPage.tsx` | `apps.job_search` | Partner company listings, Blue Card filtering, AI Resume Skill-Matcher |
| **Rewards & Loyalty** | `src/pages/RewardsPage.tsx` | `apps.rewards_plan` | 4-Tier plans, points earning rules, redemption catalog, social media promotion broadcasts |
| **Intake Tracking CRM** | `src/components/admin/IntakeTrackingHub.tsx` | `apps.intake_tracking` | Department inbounds, automated follow-up rules, live marketing campaign broadcasts |
| **AI Course Creator** | `src/components/admin/CourseCreator.tsx` | `apps.education_core` | AI Engine Hub curriculum generation, batch scheduling, library archive |

---

## 🛠️ Tech Stack

* **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite 6](https://vite.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
* **Backend**: [Django 5](https://www.djangoproject.com/), [Django REST Framework](https://www.django-rest-framework.org/), [django-cors-headers](https://github.com/adamchainz/django-cors-headers)
* **AI & Intelligence**: Google Gemini Pro API (`gemini-3.5-pro-preview`, `gemini-2.5-pro`), NLP heuristic extraction
* **Database**: SQLite (Development) / PostgreSQL (Production)

---

## ⚡ Getting Started (Full-Stack Setup)

### 1. Start the Django REST Framework Backend
```powershell
cd django_backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt   # or django djangorestframework django-cors-headers google-genai
python manage.py migrate
python manage.py runserver 8000
```
API Root is live at: `http://127.0.0.1:8000/api/v1/`

### 2. Start the React Frontend
```powershell
# In the project root directory
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
ila-acc-web-main-11.09.26/
├── django_backend/              # Django 5 + DRF Backend Root
│   ├── config/                  # Settings, CORS, URL configuration
│   └── apps/                    # Domain-driven DRF Apps
│       ├── communication_engine/# Multi-channel lifecycle triggers & logs
│       ├── intake_tracking/     # Front-office CRM & social campaigns
│       ├── job_search/          # Vacancies, Blue Card & AI resume matching
│       ├── rewards_plan/        # Tiers, points catalog & redemption
│       ├── study_abroad/        # Gemini AI resume parsing, ATS & courses
│       └── work_study/          # Dynamic packages, streams & HOD progression
├── src/                         # React 19 Frontend Root
│   ├── components/              # Modular UI components (admin, abroad, education, jobs)
│   ├── hooks/                   # Custom React service & query hooks
│   ├── pages/                   # Application page views & dashboards
│   ├── services/api/            # Unified DRF Axios client & typed service modules
│   └── types/                   # TypeScript interfaces & domain models
├── DRF_BACKEND_INTEGRATION_BLUEPRINT.md  # Master DRF Integration Specification
└── AI_ENGINE_HUB_URL_INTEGRATION_GUIDE.md # AI Hub Deep-Linking Guide
```

