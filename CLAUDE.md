# CLAUDE.md

Context for Claude Code when working in this repo.

## Project

Workout Room — a personal iOS app for me and my partner to track workouts. Not for distribution; just for the two of us.

## Stack

- Swift + SwiftUI
- iOS 17+
- SwiftData for persistence (default — change if designs require otherwise)
- MVVM where it makes sense, but keep it pragmatic for a 2-person app

## Conventions

- Prefer simple, readable code over clever abstractions
- One feature per branch: `feature/<thing>`
- Commits: short, present tense ("add rest timer")
- Don't add dependencies without asking

## Design

Designs are provided separately. Build to spec — match spacing, typography, and colors exactly. Ask before deviating.

## What to do first

When I open this repo with you, I'll share designs. Wait for them before scaffolding the Xcode project so the structure matches what's actually being built.
