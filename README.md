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
- **Framework**: [Vike](https://vike.dev/) (React meta-framework)
- **React**: v19 with React Query for state management
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Animations**: Motion (Framer Motion successor)
- **UI Components**: Radix UI primitives
- **Internationalization**: i18next (Polish primary, English planned)
- **Forms**: React Hook Form with Zod validation

### Backend (`api/`)
- **Runtime**: AWS Lambda (Node.js 20)
- **Language**: TypeScript
- **Build Tool**: esbuild
- **Email Templates**: Maizzle framework
- **API**: OpenAPI 3.0 with Zod schema validation
- **AWS Services**: SES, SNS, DynamoDB, S3

### Infrastructure (`cdk/`)
- **Infrastructure as Code**: AWS CDK v2
- **CI/CD**: GitHub Actions integration
- **Hosting**: CloudFront + S3
- **Domain**: Route 53 DNS management
- **SSL**: AWS Certificate Manager

### Development Tools
- **Monorepo**: Turborepo for task orchestration
- **Package Manager**: Yarn v4 with workspaces
- **Code Quality**: ESLint with comprehensive rule set
- **Type Checking**: TypeScript across all packages
- **Containerization**: Docker support for production builds

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+
- **Yarn** 4.9.2+ (configured via `packageManager` field)
- **AWS CLI** (for deployment)
- **AWS CDK** v2 (installed globally)

### Installation

```bash
# Clone the repository
git clone https://github.com/amileszko/landing-dev-mileszko.git
cd landing-dev-mileszko

# Install dependencies for all workspaces
yarn install
```

### Environment Setup

Create `.env` file in the root directory:

```bash
# Required for website development
API_URL=https://api.mileszko.pl

# Optional
GOOGLE_TAG_MANAGER_ID=your-gtm-id
HOST_NAME=https://localhost:3000
```

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
```

## 🌐 Website Features

### Content Structure
- **Multi-language Support**: Polish (primary), English (planned)
- **Service Pages**: Specialized pages for Founders, CTOs, and Recruiters
- **Portfolio**: Project showcases with real production results
- **Blog**: Technical articles with Markdown support
- **Contact Form**: Integrated with backend API

### Performance Optimizations
- **SSG/SSR**: Server-side generation via Vike
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: WebP format with fallbacks
- **SEO**: Comprehensive meta tags and structured data
- **Analytics**: Google Tag Manager integration

## 🔧 API Services

### Contact Form Handler
- Validates form submissions using Zod schemas
- Sends confirmation emails via AWS SES
- Stores messages in DynamoDB
- SNS notifications for new messages

### Email System
- **Templates**: Responsive HTML emails built with Maizzle
- **Delivery**: AWS SES with bounce/complaint handling
- **Notifications**: Real-time alerts for new contact messages

### API Endpoints
- `POST /contact` - Submit contact form
- OpenAPI 3.0 specification auto-generated from Zod schemas

## ☁️ Infrastructure & Deployment

### AWS Architecture
- **Frontend**: CloudFront CDN + S3 static hosting
- **API**: API Gateway + Lambda functions
- **Database**: DynamoDB for message storage
- **Email**: SES for transactional emails
- **Monitoring**: CloudWatch logs and metrics

### Deployment Pipeline
```bash
# Deploy infrastructure
yarn cdk:synth
yarn cdk:deploy

# Manual deployment commands
cd cdk && cdk deploy --all --require-approval=never
```

### Production Domains
- **Website**: `mileszko.pl`
- **API**: `api.mileszko.pl`

## 📊 Monitoring & Analytics

- **Google Tag Manager**: Enhanced ecommerce tracking
- **AWS CloudWatch**: Lambda performance monitoring
- **SES**: Email delivery and bounce tracking
- **Contact Form**: Conversion and spam filtering metrics

## 🔒 Security Features

- **HTTPS Everywhere**: SSL certificates via AWS ACM  
- **Content Security Policy**: Comprehensive CSP headers
- **Input Validation**: Zod schemas for all API inputs
- **Rate Limiting**: API Gateway throttling
- **CORS**: Properly configured cross-origin policies

## 🧪 Quality Assurance

### Code Quality
- **ESLint**: 15+ plugin comprehensive linting setup
- **TypeScript**: Strict mode across all packages  
- **Prettier**: Code formatting (via Stylistic ESLint)
- **Import Organization**: Automated import sorting

### Testing Strategy
- **Type Safety**: Full TypeScript coverage
- **Schema Validation**: Runtime validation with Zod
- **Build Verification**: Multi-package build testing

## 📚 Project Scripts

```bash
# Development
yarn website:start       # Start website dev server
yarn website:preview     # Preview production build

# Building
yarn website:build       # Build website for production
yarn api:build          # Build all Lambda functions
yarn cdk:synth          # Generate CloudFormation templates

# Deployment
yarn cdk:deploy         # Deploy infrastructure to AWS

# Quality
yarn check-types        # TypeScript checking across packages
yarn lint              # ESLint across all packages
```

## 🤝 Contributing

This is a personal project, but if you're interested in the architecture or have suggestions:

1. Review the code structure and patterns
2. Check the issue tracker for known items
3. Feel free to fork for your own landing page needs

## 📄 License

This project is private and proprietary. The code serves as a professional portfolio piece and business website.

## 📞 Contact

- **Website**: [mileszko.pl](https://mileszko.pl)
- **Email**: kontakt@mileszko.pl
- **LinkedIn**: Connect via the website

---

**Built with**: React 19 • TypeScript • AWS CDK • Turborepo • Tailwind CSS 4

*This README serves as both documentation and a showcase of technical communication skills.*
