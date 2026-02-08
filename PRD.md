# Contact Instructions - Product Requirements Document (PRD)

## Executive Summary

**Contact Instructions** is a personal communication management application that allows users to define and share "custom instructions" or preferences with their contacts (friends and family). Similar to ChatGPT's custom instructions feature, it acts as a **single source of truth** for communicating personal preferences, availability, and communication guidelines to selected individuals.

---

## Problem Statement

People often need to communicate their preferences, availability, and communication guidelines to friends and family. Currently, this requires:
- Repeatedly explaining preferences to different people
- Using multiple platforms (WhatsApp, Facebook, SMS, Email) to reach everyone
- No centralized way to update preferences and have them instantly visible to all relevant contacts

---

## Solution

A mobile application that provides:
1. A **single, centralized location** to define personal communication instructions
2. **Global instructions** that apply to everyone by default
3. **Contact-specific instructions** that can override global settings for individual contacts
4. **Real-time sharing** where contacts can view your latest instructions via a unique link
5. **Invitation system** where contacts must accept to receive access to your instructions

---

## Core Concepts

### 1. Global Instructions
Default preferences that apply to all contacts. Example:
> "I prefer text messages over calls for non-urgent matters. I try to reply within an hour."

### 2. Contact-Specific Instructions
Custom instructions that override global settings for individual contacts. Example:
> "Please call me only after 6 PM on weekdays. On weekends, I'm free anytime before noon."

### 3. Invitation Flow
- User adds a contact with their name and relation type
- Contact starts with **"Pending"** status
- User can send/resend invitation to the contact
- Contact accepts the invitation to view instructions
- Status changes to **"Accepted"** once invitation is accepted

---

## User Stories

### As a User (Instruction Creator):

| ID | Story | Priority |
|----|-------|----------|
| U1 | I want to set global instructions that apply to everyone | High |
| U2 | I want to add contacts with their name and relation (Family/Friend/Work/Other) | High |
| U3 | I want to set specific instructions that override global for individual contacts | High |
| U4 | I want to send invitations to contacts so they can view my instructions | High |
| U5 | I want to see which contacts have pending vs. accepted invitations | Medium |
| U6 | I want to preview how my instructions look to a specific contact | Medium |
| U7 | I want to search through my contacts | Low |

### As a Contact (Instruction Recipient):

| ID | Story | Priority |
|----|-------|----------|
| C1 | I want to receive an invitation to view someone's instructions | High |
| C2 | I want to accept an invitation and access their instructions | High |
| C3 | I want to see both global and specific instructions meant for me | High |
| C4 | I want to know when instructions were last updated | Low |

---

## Features & Screens

### Screen 1: Contacts List (Home)
The main screen showing all contacts.

**Features:**
- Display list of all contacts with:
  - Avatar (first letter of name with random color)
  - Name
  - Relation type
  - Status badge (Pending/Accepted)
- Search functionality (icon present, search implementation needed)
- Floating action button to add new contact
- Tap contact to view/edit their specific instructions

### Screen 2: Profile / Global Instructions
Settings page for defining global instructions.

**Features:**
- Text area to write global instructions
- Save button to persist changes
- Info text explaining these apply to everyone unless overridden

### Screen 3: Contact Details
View and manage a specific contact's instructions.

**Features:**
- Contact header with name and relation
- Status banner showing:
  - **Pending**: Yellow banner with "Resend Invite" button
  - **Accepted**: Green "Invitation Accepted" badge
- Global instructions preview (read-only, shows snippet)
- Specific instructions editor (text area)
- Save button for specific instructions
- Preview button to see contact's view

### Screen 4: Share Page (Contact's View)
What a contact sees when viewing your instructions.

**Features:**
- User avatar/logo
- "Instructions for [Contact Name]" heading
- Last updated timestamp
- **Important for You** card: Contact-specific instructions (highlighted)
- **General Context** card: Global instructions
- Branding footer

### Screen 5: Add Contact Dialog
Modal for adding a new contact.

**Features:**
- Name input field
- Relation dropdown (Family, Friend, Work, Other)
- Cancel and Add Contact buttons
- New contacts start with "Pending" status

---

## Data Models

### Contact
```typescript
interface Contact {
    id: string;                    // Unique identifier
    name: string;                  // Display name
    relation: string;              // 'Family' | 'Friend' | 'Work' | 'Other'
    status: 'pending' | 'accepted'; // Invitation status
    color: string;                 // Avatar background color (Tailwind class)
    specificInstructions?: string; // Contact-specific override instructions
}
```

### User Profile (Future)
```typescript
interface UserProfile {
    id: string;
    globalInstructions: string;
    displayName: string;
    // Future: email, notification preferences, etc.
}
```

---

## Technical Architecture

### For React Native / Mobile Implementation

#### Recommended Tech Stack
| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | React Native + Expo | Cross-platform (iOS/Android), familiar React patterns |
| Navigation | React Navigation | Industry standard for React Native |
| State Management | React Context + AsyncStorage | Simple, matches current implementation |
| Backend | Firebase / Supabase | Easy auth, real-time database, push notifications |
| Notifications | Expo Notifications | For sending invitation alerts |

#### Alternative: Flutter
| Layer | Technology |
|-------|------------|
| Framework | Flutter |
| State | Riverpod / Provider |
| Backend | Firebase |

---

## API Requirements (Backend)

### Authentication
- User registration/login (email, phone, or social)
- Generate invite tokens for contacts

### User Endpoints
```
POST   /api/users                    # Create user
GET    /api/users/:id                # Get user profile
PUT    /api/users/:id/instructions   # Update global instructions
```

### Contacts Endpoints
```
GET    /api/contacts                 # List all contacts
POST   /api/contacts                 # Add new contact
GET    /api/contacts/:id             # Get contact details
PUT    /api/contacts/:id             # Update contact instructions
DELETE /api/contacts/:id             # Remove contact
POST   /api/contacts/:id/invite      # Send/resend invitation
```

### Invitation Endpoints
```
GET    /api/invites/:token           # Get invitation details
POST   /api/invites/:token/accept    # Accept invitation
```

### Share Endpoints
```
GET    /api/share/:shareId           # Get instructions for contact view
```

---

## UI/UX Guidelines

### Visual Design
- **Theme**: Dark mode by default (current implementation uses Zinc 950 background)
- **Accent Color**: Violet 500 (`#8b5cf6`) as primary
- **Typography**: Clean, modern sans-serif
- **Border Radius**: 0.75rem (rounded-xl) for cards and buttons
- **Shadows**: Subtle colored shadows on primary buttons

### Mobile-First Design
- Bottom navigation bar with 2 tabs: Contacts, Profile
- Floating Action Button (FAB) for quick add contact
- Touch-friendly tap targets (minimum 44x44 pixels)
- Pull-to-refresh for contact list (to implement)

### Status Indicators
- **Pending**: Yellow color scheme with Send icon
- **Accepted**: Green color scheme with CheckCircle icon

---

## Implementation Phases

### Phase 1: Core Mobile App (MVP)
- [ ] Set up React Native + Expo project
- [ ] Implement navigation (Tab + Stack)
- [ ] Create Contacts List screen
- [ ] Create Profile screen with global instructions
- [ ] Create Contact Details screen
- [ ] Create Add Contact dialog/screen
- [ ] Local storage persistence (AsyncStorage)

### Phase 2: Backend Integration
- [ ] Set up Firebase/Supabase project
- [ ] Implement authentication (sign up/login)
- [ ] Create database schema for users, contacts, invitations
- [ ] Implement API endpoints
- [ ] Replace local storage with cloud sync

### Phase 3: Invitation System
- [ ] Generate unique share links
- [ ] Send invitations via SMS or deep link
- [ ] Create invitation acceptance flow
- [ ] Real-time status updates

### Phase 4: Contact's Experience
- [ ] Create web view for share pages (or in-app WebView)
- [ ] Push notifications when instructions update
- [ ] "Mark as read" functionality

### Phase 5: Polish & Extras
- [ ] Search contacts functionality
- [ ] Edit/delete contacts
- [ ] Multiple instruction templates
- [ ] Analytics and usage tracking
- [ ] Offline support

---

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Platform Support | iOS 14+ and Android 10+ |
| Load Time | < 2 seconds initial load |
| Offline Support | Core features work offline, sync when online |
| Data Privacy | End-to-end encryption for instructions (optional) |
| Accessibility | WCAG 2.1 Level AA compliance |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| User Retention | 40% D7 retention | Analytics |
| Invites Sent | 3+ invites per user | Database |
| Invite Acceptance | 50% acceptance rate | Database |
| Daily Active Users | Growth month-over-month | Analytics |

---

## Appendix

### Current Implementation Reference

The existing NextJS web app implements:
- ✅ Contact list with avatar, name, relation, status
- ✅ Add Contact dialog with name and relation
- ✅ Profile page with global instructions editor
- ✅ Contact details with specific instructions editor
- ✅ Share page showing both instruction types
- ✅ Mobile-first responsive design
- ✅ Dark theme with violet accent
- ✅ Local storage persistence
- ⚠️ Search (icon only, not implemented)
- ⚠️ Real invitations (simulated in current build)
- ⚠️ Backend/API (not implemented)
- ⚠️ Authentication (not implemented)

### File Structure Reference (Current Web App)
```
instructions_app/
├── app/
│   ├── (main)/
│   │   ├── page.tsx           # Contacts list (home)
│   │   ├── layout.tsx         # Main layout with nav
│   │   ├── contact/[id]/
│   │   │   └── page.tsx       # Contact details
│   │   └── profile/
│   │       └── page.tsx       # Global instructions
│   ├── share/[id]/
│   │   └── page.tsx           # Share view for contacts
│   ├── components/
│   │   └── AddContactDialog.tsx
│   └── context/
│       └── contacts-context.tsx   # State management
├── components/
│   └── mobile-nav.tsx         # Bottom navigation
└── lib/
    └── utils.ts               # Utility functions (cn)
```

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-09 | Auto-generated | Initial PRD based on existing implementation |

---

*This document serves as the complete specification for rebuilding the Contact Instructions app as a native mobile application.*
