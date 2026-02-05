# Task Management Project

A simple web-based task management application deployed at leni-menage.fr. The app helps users organize tasks and shopping lists by grouping items into reusable patterns and viewing multiple lists at once.

## Overview

The app is divided into three main parts:
- Main section — where you write and manage tasks.
- Pattern section — where you create, edit, and save patterns (task groups).
- Tabs (top bar) — where you switch between patterns and view multiple lists simultaneously.

Concepts:
- Pattern: A named group or template of tasks (e.g., "Groceries", "Weekend chores", "Work tasks").
- Task: An individual item inside a pattern (e.g., "Buy milk", "Wash dishes").

## Features and their purpose

- Main section (Tasks)
  - Add tasks: Quickly add new items to the currently selected pattern.
  - Edit tasks: Update task text to correct or refine descriptions.
  - Mark complete / incomplete: Track which tasks are done.
  - Delete tasks: Remove tasks you no longer need.
  - Purpose: Provide a focused area to manage the items you need to do or buy.

- Patterns (Task groups)
  - Create and save patterns: Save commonly used groups of tasks as patterns you can reuse.
  - Rename and delete patterns: Keep patterns organized and up to date.
  - Purpose: Let users create reusable lists (shopping lists, packing lists, recurring task sets) so they don't have to retype the same items.

- Tabs (Multiple lists)
  - Switch patterns using tabs at the top of the page.
  - Open/view two different lists at the same time (useful for comparing or moving items between lists).
  - Purpose: Support multi-list workflows (e.g., compare "Household" and "Grocery" lists or manage tasks across projects).

- Save button
  - Persist the current page state (tasks and pattern changes).
  - Purpose: Ensure changes are stored and not lost between sessions.

- Backend & Hosting
  - Firebase (Realtime Database or Firestore) hosts the server and stores the database.
  - Purpose: Provide persistent storage and optional real-time sync across devices.

- Deployment
  - Live site: leni-menage.fr
  - Purpose: Public access to the application via a friendly domain.

## How to use (basic workflow)

1. Open the website (leni-menage.fr).
2. Use the tabs at the top to choose an existing pattern or create a new one.
3. In the main section, add tasks for the selected pattern:
   - Type a task and press the Add button (or Enter).
   - Edit a task inline if needed.
   - Mark tasks as complete when done.
4. Save your changes using the Save button to persist to the backend.
5. Switch to another tab/pattern to view or edit a different list. You can have two lists visible and work across them.

## Why this is useful

- Reusable patterns save time when you maintain recurring lists (shopping, packing, recurring chores).
- Tabs make it easy to manage multiple lists without losing context.
- Cloud storage via Firebase means your lists are available across devices and sessions.
- Simple, focused UI for quick task entry and management.

## Technical notes (for maintainers)

- Backend: Firebase (hosting and database). Make sure Firebase config (API keys, project id, etc.) is set up in the project before deployment.
- Persistence: Tasks and patterns are stored in the Firebase database; ensure read/write rules are configured appropriately.
- Deployment: Hosted on Firebase Hosting and accessible at leni-menage.fr.

## To improve / future ideas

- Add user authentication so each user has private pattern lists.
- Enable pattern sharing between users.
- Add drag-and-drop reordering for tasks.
- Add due dates, reminders, and priority flags.
- Provide import/export (CSV/JSON) for patterns and tasks.

## Contact

Maintainer: leni.menage@outlook.fr
