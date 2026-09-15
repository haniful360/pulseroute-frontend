# 🚀 Next.js Starter Template

This repository contains a Next.js template for creating new projects with the latest features and best practices.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://npmjs.com/)
- [Git](https://git-scm.com/)

## Step By Step Instruction For Setup

Follow these steps to quickly initialize your new project from the template repository.

---

#### 1\. Clone the Repository

Run the following `git clone` command in your terminal to download the template repository to your local machine.

```bash
git clone https://github.com/Binary-Mindz/next-js-project-template.git
```

---

#### 2\. Rename the Directory

Rename the newly cloned directory from `next-js-project-template` to your desired **project name** (e.g., `my-new-app`).

```bash
mv next-js-project-template your-project-name
```

---

#### 3\. Navigate to the Project Directory

Change your current directory to the new project folder.

```bash
cd your-project-name
```

---

#### 4\. Remove the Existing `.git` Folder

Since this is a new project based on a template, you should remove the template's `.git` history folder so you can initialize your own new repository.

##### 1. Using Git Bash

```bash
rm -rf .git
```

##### 2. Using Command Prompt

```cmd
rmdir /s /q .git
```

##### 3. Using PowerShell

You can also use **PowerShell** to remove the `.git` folder.

```powershell
Remove-Item -Recurse -Force .git
```

##### 4. Using File Explorer (Manual Way)

> _Steps:_

1. Open **File Explorer** and navigate to your project directory.
2. **Show hidden files** (since `.git` is a hidden folder):
   - Click on the **"View"** tab at the top.
   - Check the box next to **Hidden items**.

3. Find the `.git` folder and delete it like any other folder.

#### 5\. Initialize a New Git Repository (Next Step)

After removing the old history, initialize a fresh Git repository for your new project.

```bash
git init
```

---

#### 6\. Check Package Versions

Run the following command to see all available updates. This command checks and lists outdated dependencies in your project, but it does not modify your package.json yet.

```bash
npx ncu
```

#### 7\. Update All Packages to the Latest Version

To update all dependencies to their latest versions, run the following command. This will update your package.json to the latest versions of all dependencies, and then install those updated versions into your project.

```bash
npm run update-deps
```

> **_Congratulations You have successfully completed all the steps!! You are good to go. 🚀_**

## Now, you can start building your projects with the latest dependencies.

<p style="color: red;"><strong>Note:</strong> The following steps are not required. They are just for specific version controlling. You can access the full documentation <a href="https://www.npmjs.com/package/npm-check-updates" target="_blank">here</a>.</p>

### Semantic Versioning (Optional)

In semantic versioning, the version number consists of three parts: `MAJOR.MINOR.PATCH`.

- **PATCH** (Rightmost number) refers to bug fixes.
- **MINOR** (Middle number) refers to backwards-compatible new features.
- **MAJOR** (Leftmost number) refers to breaking changes or new features that are not backwards-compatible.

---

##### 1. Update Patches version.

Start by updating all patches. Patches are bug fixes, and they are usually safe and shouldn't break anything in your project.

Run the following command to update patches:

```bash
npx ncu -u -t patch
```

After updating, run `npm install` to apply the changes. Test your application to ensure everything is working. If everything is fine, commit the changes.

---

##### 2. Update Minor Versions

Next, update all minor versions. Minor updates generally add new features in a backwards-compatible way, so they should not break your code.

Run the following command to update minor versions:

```bash
npx ncu -u -t minor
```

After updating, run `npm install` to apply the changes. Test your application to ensure everything is working. If everything is fine, commit the changes.

---

##### 3. Update Major Versions

Finally, update all major versions. Major updates may introduce breaking changes, so it's important to check the release notes for each update before proceeding. Update each major version in a separate commit to ensure you can easily revert if necessary.

To update a specific package (e.g., `node-fetch`), run:

```bash
npx ncu -u -f package_name
```

After updating, run `npm install` to apply the changes. Test your application to ensure everything is working. If everything is fine, commit the changes.

Repeat this for each package that needs a major update.

---
