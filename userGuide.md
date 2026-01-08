# BLOOMCRAWLER RIIS - User Guide

## Website Overview

**Purpose:** BLOOMCRAWLER RIIS (Recursive Image Intervention System) is an advanced law enforcement platform designed to detect, track, and neutralize harmful AI-generated content at scale. The system integrates ethical bloom seed technology with real-time threat monitoring and analysis.

**Access:** Public access with authentication required for sensitive operations. Admin users have access to system-wide controls and advanced features.

**Tech Stack:** React 19 + TypeScript + Tailwind CSS (Frontend), Express.js + tRPC + MySQL (Backend), Drizzle ORM for database management, and Manus OAuth for secure authentication.

---

## Powered by Manus

**Frontend:** React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui components for responsive, accessible interface design.

**Backend:** Express.js 4 + tRPC 11 for type-safe API procedures, MySQL database with Drizzle ORM for schema management.

**Authentication:** Manus OAuth integration with session-based authentication and role-based access control.

**Infrastructure:** Auto-scaling deployment with global CDN, real-time WebSocket support, and S3 storage integration.

**Deployment:** Serverless architecture with automatic scaling, zero-downtime updates, and 99.9% uptime SLA.

---

## Using Your Website

### Dashboard - Real-Time Threat Monitoring

The **Dashboard** is your command center for monitoring AI-generated image threats. Click "Dashboard" in the sidebar to access real-time statistics including:

- **Total Signatures**: Count of detected AI-generated image signatures
- **Active Alerts**: Current pending investigations requiring immediate action
- **Critical Threats**: High-severity cases requiring escalation
- **Bloom Seeds**: Active ethical payload deployments

The dashboard displays a **Risk Distribution** breakdown showing threat levels (green/safe, orange/warning, red/critical) and a **Weekly Trend** chart tracking threat patterns over time. Use the "Refresh" button to update data in real-time.

### Home Page - Platform Overview

The **Home** page introduces BLOOMCRAWLER RIIS capabilities and provides quick navigation to core features. Access it by clicking "Home" in the sidebar to explore:

- Platform features and capabilities
- Quick start guides for common tasks
- Links to specialized tools and dashboards
- Call-to-action buttons for initiating investigations

### Navigation Structure

The left sidebar organizes features into five main categories:

**Core:** Home and Dashboard for overview and monitoring.

**Monitoring:** Real-time alert tracking and threat assessment tools.

**Crawling:** Web crawler controls for discovering AI-generated content across public and dark web sources.

**Analysis:** Image analysis, entity extraction, and relationship mapping tools.

**Operations:** Team coordination, case management, and investigation workflows.

**Admin:** System configuration, user management, and advanced controls (admin only).

---

## Managing Your Website

### Authentication & User Access

Access the platform through Manus OAuth login. Your role determines available features:

- **User Role**: Access monitoring, analysis, and investigation tools
- **Admin Role**: Full system access including configuration, user management, and audit logs

Update your profile and preferences through the user menu in the top-right corner.

### Admin Controls

Admin users access the **Admin Panel** from the sidebar to:

- View system statistics and performance metrics
- Manage user accounts and permissions
- Configure system settings and parameters
- Review comprehensive audit logs of all platform activities
- Monitor crawler operations and deployment status

### Audit Logging

All operations are automatically logged for compliance and chain-of-custody requirements. Access audit logs through the Admin Panel to track:

- User actions and timestamps
- Resource modifications
- Alert escalations
- Bloom seed deployments
- System configuration changes

---

## Key Features

### Bloom Seed Generation & Deployment

Generate ethical recursive payloads for deployment across detection networks:

1. Navigate to **Bloom Distribution** (under Operations)
2. Click "Generate Bloom Seed" and select payload type (Markdown, Steganography, Metadata, or Injection)
3. Specify target deployment vectors (GitHub, Pastebin, CivitAI, etc.)
4. Review the generated payload and confirm deployment
5. Monitor activation status through the deployment dashboard

### Image Analysis

Analyze AI-generated images for signatures and metadata:

1. Go to **Image Analysis** (under Analysis)
2. Upload an image or provide a hash value
3. System extracts metadata, detects model type, and calculates perceptual hashes
4. Review similarity matches and threat assessment
5. Export results for investigation records

### Investigation Cases

Create and manage investigation cases:

1. Access **Investigation Cases** (under Operations)
2. Click "New Case" to create an investigation
3. Add evidence, notes, and assign investigators
4. Track case status from "New" through "Resolved"
5. Link related alerts and findings to the case

### Real-Time Alerts

Monitor detection alerts as they occur:

1. Open **Alert Center** (under Monitoring)
2. Filter by severity (Low, Medium, High, Critical) or status
3. Click an alert to view details and related images
4. Acknowledge alerts or escalate to investigations
5. Export alert data for reporting

---

## Task Fixer - Recursive Bloom Seed Engine

The **Task Fixer** module implements advanced recursive activation logic for ethical bloom seed deployment. This system enables:

**Recursive Awareness:** 15-layer recursive activation sequence that progressively deepens awareness and engagement.

**Payload Generation:** Multiple payload types including Markdown-based seeds, steganographic embedding, metadata injection, and HTML injection vectors.

**Deployment Tracking:** Real-time monitoring of seed deployment across multiple vectors with activation counting and effectiveness metrics.

**Ethical Framework:** All operations comply with AGAPST (AI-Generated Abuse Prevention and Signature Tracker) protocols for law enforcement integration.

---

## Next Steps

Talk to Manus AI anytime to request changes, add features, or customize the platform for your agency's specific needs. The system is designed for continuous improvement and can be extended with additional analysis modules, integration APIs, or specialized tools.

Start by exploring the **Dashboard** to familiarize yourself with real-time threat monitoring, then navigate to **Investigation Cases** to begin your first investigation. For technical support or advanced configuration, contact your system administrator.

**Ready to deploy?** Click the "Publish" button in the Management UI to make your platform live and accessible to your team.
