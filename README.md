# DISC Introduction: Reflection Survey

Next.js survey app with AWS SES email delivery.

> v0.1.1 — test GitHub push workflow When a participant submits, results are emailed to:

- The participant (their email address)
- `surveys@discconnector.com` (admin inbox)

## Getting started locally

```bash
cd disc-survey
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
|---|---|
| `AWS_REGION` | AWS region for SES (e.g. `us-east-1`) |
| `AWS_ACCESS_KEY_ID` | IAM access key (local dev; use IAM role in AWS) |
| `AWS_SECRET_ACCESS_KEY` | IAM secret key (local dev; use IAM role in AWS) |
| `SES_FROM_EMAIL` | Verified sender in SES (e.g. `surveys@discconnector.com`) |
| `SURVEY_ADMIN_EMAIL` | Admin inbox (default: `surveys@discconnector.com`) |
| `SURVEY_ID` | Session label included in emails |
| `ADMIN_PASSWORD` | Admin panel password |

## AWS SES setup

1. Open **Amazon SES** in the AWS Console.
2. Verify `discconnector.com` (or at minimum `surveys@discconnector.com`) as a sender identity.
3. If your account is still in the **SES sandbox**, either:
   - Request production access, or
   - Verify each recipient email while testing.
4. Create an IAM policy with `ses:SendEmail` and attach it to:
   - An IAM user (for local dev), or
   - The Amplify / ECS / App Runner execution role (for production).

## Deploy to AWS Amplify (recommended)

1. Push this repo to GitHub.
2. In AWS Amplify, create a new app and connect the repo.
3. Amplify auto-detects Next.js. Use the included `amplify.yml`.
4. Under **Environment variables**, add all variables from `.env.example`.
5. Attach an IAM role to Amplify with `ses:SendEmail` permission (instead of access keys in production).
6. Deploy.

## Deploy with Docker (App Runner / ECS)

```bash
docker build -t disc-survey .
docker run -p 3000:3000 \
  -e AWS_REGION=us-east-1 \
  -e SES_FROM_EMAIL=surveys@discconnector.com \
  -e SURVEY_ADMIN_EMAIL=surveys@discconnector.com \
  disc-survey
```

On AWS, attach an IAM role with SES permissions to the container service rather than embedding credentials.

## How submission works

1. User completes the survey and clicks **Submit Survey**.
2. The browser POSTs to `/api/submit`.
3. The API route formats all questions and answers into HTML + plain text.
4. Amazon SES sends two emails:
   - One to the participant
   - One to `surveys@discconnector.com`

## Project structure

- `src/app/api/submit/route.ts` — submission API endpoint
- `src/lib/email.ts` — AWS SES integration
- `src/lib/formatResults.ts` — email formatting
- `src/data/survey.json` — default survey questions
- `src/components/SurveyApp.tsx` — main survey UI

## Production build

```bash
npm run build
npm start
```
