# 🐕 Husky Setup Documentation

## Overview

This project uses **Husky** to manage Git hooks and ensure code quality before commits. Husky runs pre-commit checks to format code, lint files, and validate commit messages.

## 🛠️ **Setup**

### **Installation**
```bash
npm install --save-dev husky lint-staged
npx husky init
```

### **Configuration**

#### **package.json**
```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "biome format --write",
      "biome check"
    ],
    "*.{json,md}": [
      "biome format --write"
    ]
  }
}
```

#### **Git Hooks**

**Pre-commit Hook** (`.husky/pre-commit`)
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**Commit Message Hook** (`.husky/commit-msg`)
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Validates commit message format
commit_regex='^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .{1,50}'

if ! grep -qE "$commit_regex" "$1"; then
    echo "❌ Invalid commit message format."
    echo "✅ Use format: type(scope): description"
    exit 1
fi
```

## 🚀 **How It Works**

### **Pre-commit Process**
1. **Format Code** - Biome formats all staged files
2. **Lint Code** - Biome checks for code quality issues
3. **Type Check** - TypeScript type checking (optional)
4. **Commit** - If all checks pass, commit proceeds

### **Commit Message Validation**
- **Format**: `type(scope): description`
- **Types**: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
- **Scope**: Optional module or feature name
- **Description**: Brief description (max 50 chars)

## 📝 **Commit Message Examples**

### **Valid Messages**
```bash
feat: add user creation drawer
fix(auth): resolve login validation issue
docs: update README with new features
style: format code with biome
refactor(users): improve user controller structure
test: add unit tests for user service
chore: update dependencies
```

### **Invalid Messages**
```bash
# ❌ Too long
feat: add a very long description that exceeds the character limit

# ❌ Missing type
add user feature

# ❌ Invalid type
update: fix something

# ❌ No description
feat:
```

## 🔧 **Customization**

### **Add More Hooks**
```bash
# Add pre-push hook
npx husky add .husky/pre-push "npm run test"

# Add post-merge hook
npx husky add .husky/post-merge "npm install"
```

### **Modify Lint-staged Rules**
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "biome format --write",
      "biome check",
      "npm run type-check"
    ],
    "*.{css,scss}": [
      "prettier --write"
    ]
  }
}
```

## 🚨 **Troubleshooting**

### **Hook Not Running**
```bash
# Reinstall hooks
npm run prepare

# Check hook permissions
chmod +x .husky/pre-commit .husky/commit-msg
```

### **Skip Hooks (Emergency)**
```bash
# Skip pre-commit hooks
git commit --no-verify -m "emergency fix"

# Skip specific hook
SKIP_LINT_STAGED=1 git commit -m "skip linting"
```

### **Debug Issues**
```bash
# Run lint-staged manually
npx lint-staged

# Check hook content
cat .husky/pre-commit
```

## 📊 **Benefits**

### **Code Quality**
- ✅ **Consistent Formatting** - All code follows same style
- ✅ **Lint Errors Caught** - Issues found before commit
- ✅ **Type Safety** - TypeScript errors prevented
- ✅ **Standard Commits** - Consistent commit history

### **Team Collaboration**
- ✅ **No Bad Commits** - Quality gates prevent issues
- ✅ **Clear History** - Conventional commits for better tracking
- ✅ **Automated Checks** - No manual review needed for formatting
- ✅ **CI/CD Ready** - Hooks work with continuous integration

## 🔗 **Related Tools**

- **Biome** - Fast linter and formatter
- **lint-staged** - Run linters on staged files
- **Conventional Commits** - Standard commit message format
- **commitlint** - Advanced commit message validation (optional)

---

**Husky ensures your codebase stays clean and consistent! 🎯**
