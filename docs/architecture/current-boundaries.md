# Current architecture boundary: single-team teaching app

This document describes the intentional starting point for the large-architecture practice story.

## Current facts

- The demo seed creates one Team: Product Studio.
- A Project belongs to exactly one Team.
- Project membership is stored separately from User identity.
- The application UI always opens the seeded Team and Project.
- There is no team switcher, organization onboarding, tenant-aware request context, or cross-team membership flow.
- There is no enforced tenant isolation policy at the database or service boundary yet.

## What this does not mean

The presence of a Team table does not mean the application is already multi-tenant SaaS. The model can represent a team, but the current product flow and security boundary assume one seeded team.

## The architecture exercise

The goal is not to implement every SaaS capability immediately. First use Wayfinder to decide:

1. Whether Team is the tenant boundary or whether a separate Organization is required.
2. Whether a User can belong to multiple Teams.
3. How Team membership and Project membership relate.
4. How tenant context is resolved and enforced on every read and write.
5. Which isolation controls belong in application services, database policies, or both.
6. How existing single-team data is migrated safely.
7. How unauthorized cross-team access is tested.

Do not treat this document as an approved target architecture. It records the current baseline and the questions that must be decided.
