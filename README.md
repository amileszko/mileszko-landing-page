# Amadeusz Mileszko - Landing Page

A modern, fully-featured personal landing page built as a monorepo showcasing professional services in MVP development, FinOps, and system architecture.

## 📋 Project Overview

Professional landing page for Amadeusz Mileszko - Senior Full-Stack Architect specializing in:

- 🚀 **MVP SaaS Development** - Build production-ready MVPs in 6 weeks
- 💰 **FinOps Optimization** - Reduce cloud OPEX by up to 80%
- 🔧 **Legacy Refactoring** - Modernize systems without downtime
- 📈 **Scalable Architecture** - Design systems that grow with your business

**Live Site**: [mileszko.pl](https://mileszko.pl)

## 🏗️ Monorepo Structure

This project uses **Turborepo** with **Yarn Workspaces** to manage three main packages:

```
├── website/          # React-based landing page (Vike framework)
├── api/              # AWS Lambda functions for backend services
├── cdk/              # AWS CDK infrastructure as code
└── README.md         # This file
```

## 🛠️ Technology Stack

### Frontend (`website/`)
- **Framework**: [Vike](https://vike.dev/) 0.4 (React meta-framework)
- **React**: v19.3 with React Query 5
- **Styling**: Tailwind CSS v4.3
- **Build Tool**: Vite 8
- **Animations**: Motion 14 (Framer Motion successor)
- **UI Components**: Radix UI primitives
- **Internationalization**: i18next 27 / react-i18next 18 (Polish primary, English planned)
- **Forms**: React Hook Form with Zod validation

### Backend (`api/`)
- **Runtime**: AWS Lambda (Node.js 26)
- **Language**: TypeScript
- **Build Tool**: esbuild 0.28
- **Email Templates**: Maizzle 5 (legacy template syntax; v6 migration tracked separately)
- **API**: OpenAPI 3.0 with Zod schema validation
- **AWS Services**: SES, SNS, DynamoDB, S3

### Infrastructure (`cdk/`)
- **Infrastructure as Code**: AWS CDK 2.278
- **CI/CD**: AWS CodePipeline + CDK Pipelines
- **Hosting**: CloudFront + S3
- **Domain**: Route 53 DNS management
- **SSL**: AWS Certificate Manager

### Development Tools
- **Monorepo**: Turborepo 2.11
- **Package Manager**: Yarn 4.19 (vendored in `.yarn/releases`)
- **Code Quality**: ESLint 10 with type-aware rules
- **Type Checking**: TypeScript 6 compiler API plus TypeScript 7 native fast check
- **Tests**: Vitest unit tests and Playwright visual/functional regression
- **Containerization**: Docker support for production builds

## 🚀 Quick Start

### Prerequisites

- **Node.js** 26 LTS (see `.nvmrc`; the minimum supported by the package engines is 24)
- **Yarn** 4.19.0 (vendored via `.yarn/releases`; Corepack is optional)
- **AWS CLI** (for deployment)
- **AWS CDK** v2 (installed locally in the `cdk` workspace)

### Installation

```bash
# Clone the repository
git clone https://github.com/amileszko/mileszko-landing-page.git
cd mileszko-landing-page

# Install dependencies for all workspaces
yarn install
```

### Environment Setup

Create the website env file from the example:

```bash
cp website/.env.example website/.env
```

Required values:

```bash
API_URL=https://api.mileszko.pl
HOST_NAME=https://mileszko.pl
```

`GOOGLE_TAG_MANAGER_ID` is optional. `HOST_NAME` is required for production builds so canonical URLs and the sitemap cannot silently fall back to `localhost`.

## 🏃‍♂️ Development

### Start Development Server

```bash
# Start website in development mode
yarn website:start

# The site will be available at https://localhost:3000
```

### Build Commands

```bash
# Build all packages
yarn build

# Build specific packages
yarn website:build
yarn api:build

# Type checking across all packages
yarn check-types

# Linting
yarn lint

# Unit tests
yarn test

# Visual regression (build first, then compare screenshots)
yarn website:build
yarn test:visual
```

## 🌐 Website Features

### Content Structure
- **Multi-language Support**: Polish (primary), English (planned)
- **Service Pages**: Specialized pages for Founders, CTOs, and Recruiters
- **Portfolio**: Project showcases with real production results
- **Blog**: Technical articles with Markdown support
- **Contact Form**: Integrated with backend API

### Performance Optimizations
- **SSG**: Static generation via Vike
- **Code Splitting**: Route-based splitting
- **Assets**: WebP images and optimized local assets
- **SEO**: Meta tags, canonical URLs, sitemap, structured data
- **Analytics**: Google Tag Manager with Consent Mode defaults

## 🔧 API Services

### Contact Form Handler
- Validates form submissions using Zod schemas
- Sends confirmation emails via AWS SES
- Stores messages in DynamoDB
- SNS notifications for new messages

### Email System
- **Templates**: Responsive HTML emails built with Maizzle
- **Delivery**: AWS SES with DKIM signing
- **Notifications**: Real-time alerts for new contact messages
- **Feedback handling**: SES configuration set with a bounce-rate alarm; no feedback SNS topic

### API Endpoints
- `POST /contact/messages` - Submit contact form
- OpenAPI 3.0 specification auto-generated from Zod schemas

## ☁️ Infrastructure & Deployment

### AWS Architecture
- **Frontend**: CloudFront CDN + S3 static hosting
- **API**: API Gateway + Lambda functions
- **Database**: DynamoDB for message storage
- **Email**: SES for transactional emails
- **Monitoring**: CloudWatch logs and metrics

### Deployment Pipeline
Deployment is handled by the AWS CDK Pipeline (`LandingPagePipeline`) on pushes to `main`.

```bash
# Validate infrastructure locally (requires Docker)
yarn cdk:synth

# Manual deployment
yarn cdk:deploy
```

### Production Domains
- **Website**: `mileszko.pl`
- **API**: `api.mileszko.pl`

## 📊 Monitoring & Analytics

- **Google Tag Manager**: Consent-aware analytics setup
- **AWS CloudWatch**: Lambda logs, three contact/API/SES alarms, and one email alarm topic
- **SES**: Domain verification, DKIM signing, configuration set, and a bounce-rate alarm
- **Retention**: DynamoDB TTL, deletion protection, and S3 lifecycle; no PITR, AWS Backup, or S3 versioning
- **Deployment**: production is updated as a separate, approved deployment step.

## 🔒 Security Features

- **HTTPS Everywhere**: ACM certificates and CloudFront HTTPS redirect
- **TLS**: CloudFront minimum TLS 1.2_2021; API custom domain TLS 1.2
- **Input Validation**: Zod schemas for API inputs
- **CORS**: Restricted to the production website origin
- **Private Storage**: S3 public access blocked; DynamoDB/S3 encrypted at rest
- **Application controls**: CSP/HSTS/security headers, contact-endpoint rate limiting, PII retention, email escaping, and file validation are implemented in source
- **Edge controls**: OAC, response headers, cache headers, AAAA/CAA records, and a us-east-1 certificate stack are defined in CDK
- **Deployment**: live production is updated through the deployment runbook, not by this source tree alone.

## 🧪 Quality Assurance

### Code Quality
- **ESLint**: 10 with type-aware rules and React/Tailwind/i18n plugins
- **TypeScript**: TS 6 compiler API plus TS 7 native fast check
- **Formatting**: ESLint Stylistic rules
- **Import Organization**: Automated import sorting

### Testing
- **Unit tests**: Vitest for API schemas/template utilities, route resolution, and CloudFront functions
- **Core coverage gate**: `test:coverage:core` covers the unit-testable logic and enforces thresholds
- **Full coverage report**: `test:coverage:all` includes all TypeScript/TSX source and is informational, not a gate
- **Visual regression**: Playwright snapshots for all 28 routes plus 404 at desktop/mobile
- **Functional smoke test**: Contact form submission through the generated OpenAPI client
- **Build verification**: Multi-package builds and CDK synth

## 📚 Project Scripts

```bash
# Development
yarn website:start       # Start website dev server
yarn website:preview     # Preview production build

# Building
yarn build               # Build all workspaces
yarn website:build       # Build website for production
yarn api:build           # Build all Lambda functions
yarn cdk:synth           # Generate CloudFormation templates

# Quality
yarn lint                # ESLint
yarn check-types         # TypeScript 6 + TypeScript 7 checks
yarn check-types:fast    # TypeScript 7 native only
yarn test                # Vitest unit tests
yarn test:coverage:core  # Gated coverage for core unit-testable logic
yarn test:coverage:all   # Full-source informational coverage report
yarn test:visual         # Playwright visual/functional tests (build first)

# Deployment
yarn cdk:deploy          # Deploy infrastructure to AWS
```

## 🤝 Contributing

This is a personal project, but if you're interested in the architecture or have suggestions:

1. Review the code structure and patterns
2. Check the issue tracker for known items
3. Feel free to fork for your own landing page needs

## 📄 License

This is a personal, proprietary project. The public repository is provided for portfolio and review purposes; no open-source license is granted unless a `LICENSE` file is added.

## 📞 Contact

- **Website**: [mileszko.pl](https://mileszko.pl)
- **Email**: kontakt@mileszko.pl
- **LinkedIn**: Connect via the website

---

**Built with**: React 19.3 • TypeScript 6/7 • Vite 8 • Vike 0.4 • AWS CDK 2.278 • Turborepo • Tailwind CSS 4.3

*This README serves as both documentation and a showcase of technical communication skills.*
