# CI/CD Notes for Beginners (Node.js + GitHub Actions + EC2)

## 1. What is CI/CD?

CI/CD is a practice used to automate software development workflows.

CI/CD consists of:

- CI → Continuous Integration
- CD → Continuous Delivery / Continuous Deployment

Goal:

- Catch bugs early
- Reduce manual work
- Deploy faster and more reliably

---

# 2. Continuous Integration (CI)

## What is CI?

Continuous Integration means automatically verifying code whenever developers make changes.

Instead of manually testing every change, a tool automatically runs tests whenever code is pushed or a Pull Request is created.

---

## Why do we need CI?

Imagine 5 developers are working on the same project.

Developer A:

- Login Feature

Developer B:

- Payment Feature

Developer C:

- Task Feature

Developer D:

- Notification Feature

Developer E:

- Profile Feature

A new feature may accidentally break an old feature.

Without CI:

```text
Developer pushes code
      ↓
Code gets merged
      ↓
Production breaks
```

With CI:

```text
Developer pushes code
      ↓
Tests run automatically
      ↓
If tests fail → Merge blocked
      ↓
If tests pass → Merge allowed
```

---

# 3. CI Workflow

Typical flow:

```text
Developer creates feature branch
        ↓
Writes code
        ↓
Writes test cases
        ↓
Creates Pull Request
        ↓
GitHub Actions runs tests
        ↓
Tests Pass → Merge
Tests Fail → Fix Code
```

---

# 4. What is GitHub Actions?

GitHub Actions is GitHub's automation tool.

It can automate:

- Testing
- Building
- Deploying
- Running scripts
- Scheduling tasks

Workflows are written in YAML files.

Location:

```text
.github/workflows/
```

Example:

```text
.github/workflows/ci.yml
```

---

# 5. CI Workflow Example

```yaml
name: CI Pipeline

on:
  pull_request:
    branches:
      - main

  push:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install Dependencies
        run: npm ci # install Dependencies, similar to npm install but npm ci more sticter than npm install (exmple package.json and packege-lock.json out of sync)

      - name: Run ESLint
        run: npm run lint

      - name: Check Prettier Formatting
        run: npm run format:check

      - name: Run Tests
        run: npm test
```

---

# 6. Understanding CI Workflow

## name

```yaml
name: CI Pipeline
```

Workflow name shown in GitHub Actions.

---

## on

```yaml
on:
```

Specifies when the workflow should run.

Example:

```yaml
on:
  push:
    branches:
      - main
```

Meaning:

Run workflow whenever code is pushed to main.

---

## jobs

```yaml
jobs:
```

Contains all tasks to execute.

Example:

```yaml
jobs:
  test:
```

Creates a job named "test".

---

## runs-on

```yaml
runs-on: ubuntu-latest
```

GitHub creates a temporary Linux machine.

Think:

```text
Fresh Ubuntu Machine
      ↓
Run Workflow
      ↓
Delete Machine
```

---

## steps

```yaml
steps:
```

List of actions executed one by one.

---

## checkout

```yaml
uses: actions/checkout@v4
```

Downloads repository code into the temporary machine.

Without checkout:

```text
Machine exists
But project code doesn't exist
```

---

## setup-node

```yaml
uses: actions/setup-node@v4
```

Installs Node.js.

---

## npm install

```yaml
run: npm install / npm ci
why ci is prefferd
```

Installs project dependencies.

---

## npm test

```yaml
run: npm run lint
run: npm run format:check (reminder its format : check not form y )
run: npm test
```

Runs Jest tests.

---

# 7. How Jest Finds Tests

Jest automatically scans for files like:

```text
*.test.js
*.spec.js
```

Examples:

```text
task.test.js
auth.test.js
login.test.js
```

No need to manually specify every file.

Running:

```bash
npm test
```

runs all discovered test files.

---

# 8. How Multiple Developers Handle Tests

Common doubt:

"Does every developer create separate test files?"

Answer:

Yes.

Example:

```text
tests/

login.test.js
task.test.js
payment.test.js
profile.test.js
```

Developer A:

```text
task.test.js
```

Developer B:

```text
payment.test.js
```

Developer C:

```text
profile.test.js
```

When merged, all tests become part of the project.

---

# 9. Why Do All Tests Run?

Suppose:

```text
login.test.js
task.test.js
payment.test.js
```

exist in main.

Developer modifies payment code.

CI runs:

```text
login.test.js
task.test.js
payment.test.js
```

all together.

Reason:

We must ensure new changes don't break existing features.

---

# 10. What is CD?

CD automates deployment.

Instead of manually:

```text
SSH
git pull
npm install
pm2 restart
```

GitHub performs it automatically.

---

# 11. Continuous Delivery vs Continuous Deployment

Many beginners confuse these.

---

## Continuous Delivery

Flow:

```text
Push Code
    ↓
Tests Pass
    ↓
Ready For Deployment
    ↓
Human Approval Required
    ↓
Deploy
```

Deployment process is automated.

Decision to deploy is manual.

---

## Continuous Deployment

Flow:

```text
Push Code
    ↓
Tests Pass
    ↓
Deploy Automatically
```

No human approval.

Everything happens automatically.

---

# 12. Which One Did We Build?

Our deployment workflow:

```yaml
on:
  push:
    branches:
      - main
```

After push:

```text
Push
 ↓
Deploy
```

This is:

```text
Continuous Deployment
```

because no approval step exists.

---

# 13. Continuous Delivery Using GitHub Environments

Create:

```text
Settings
  ↓
Environments
  ↓
production
```

Add:

```text
Required Reviewers
```

Now flow becomes:

```text
Push
 ↓
Tests Pass
 ↓
Waiting For Approval
 ↓
Approve
 ↓
Deploy
```

This is Continuous Delivery.

---

# 14. Initial Deployment vs Future Deployments

Important Interview Question.

CI/CD usually handles updates.

Initial server setup is done manually.

---

## Initial Setup (One Time)

EC2:

```text
Launch EC2
Install Node.js
Install Git
Clone Repository
Install PM2
Configure Nginx
Start Application
```

Example:

```bash
npm install -g pm2
```

```bash
pm2 start server.js --name taskflow_api
```

---

## Future Deployments

After setup:

```text
Git Push
 ↓
GitHub Actions
 ↓
SSH Into EC2
 ↓
git pull
 ↓
npm install
 ↓
pm2 restart
```

Fully automated.

---

# 15. Deployment Workflow Example

```yaml
name: Deploy to EC2

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to EC2
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USERNAME }}
          key: ${{ secrets.EC2_PRIVATE_KEY }}
          script: |
            cd /home/ubuntu/taskflow-api

            git pull origin main

            npm install

            # TypeScript Projects:
            # npm run build

            pm2 restart taskflow_api
```

---

# 16. GitHub Secrets Used

Store sensitive values inside:

```text
Repository
 ↓
Settings
 ↓
Secrets and Variables
 ↓
Actions
```

Example:

```text
EC2_HOST
EC2_USERNAME
EC2_PRIVATE_KEY
```

Never hardcode these inside workflow files.

---

# Interview Summary

CI:

- Automatically tests code changes.

CD:

- Automatically deploys code changes.

Continuous Delivery:

- Human approval required before deployment.

Continuous Deployment:

- Deployment happens automatically after tests pass.

GitHub Actions:

- Automation tool used to implement CI/CD.

Jest:

- Automatically discovers and runs all test files.

PM2:

- Keeps Node.js applications running and manages restarts.

EC2:

- Server where application is deployed.
