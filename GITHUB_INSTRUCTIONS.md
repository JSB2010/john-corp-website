# GitHub Repository Setup Instructions

Follow these steps to create a GitHub repository and push this code:

## 1. Create a new repository on GitHub

1. Go to [GitHub](https://github.com/) and sign in to your account
2. Click on the "+" icon in the top-right corner and select "New repository"
3. Enter "john-corp-website" as the Repository name
4. Add a description: "Ultra-modern website for John Corp featuring their Jizz Tech adhesive products"
5. Make sure the repository is set to "Public"
6. Do NOT initialize the repository with a README, .gitignore, or license
7. Click "Create repository"

## 2. Push your code to GitHub

After creating the repository, GitHub will show you commands to push an existing repository. Follow these commands in your terminal:

```bash
# Make sure you're in the project directory
cd john-corp-website

# Add all files to git
git add .

# Commit the files
git commit -m "Initial commit: John Corp website with Apple-inspired design"

# Add the remote repository URL (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/john-corp-website.git

# Push the code to GitHub
git push -u origin main
```

If your default branch is named "master" instead of "main", use this command instead:
```bash
git push -u origin master
```

## 3. Verify your repository

After pushing, refresh your GitHub repository page to see all your files. The website code should now be available publicly on GitHub.
