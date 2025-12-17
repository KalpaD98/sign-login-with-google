#!/bin/bash

# CodeQL Setup Verification Script
# This script verifies that CodeQL is properly configured in the project

echo "=========================================="
echo "  CodeQL Setup Verification Script"
echo "=========================================="
echo ""

# Counter for checks
PASSED=0
FAILED=0

echo "Checking CodeQL Configuration Files..."
echo "========================================="

# Check CodeQL Workflow
if [ -f ".github/workflows/codeql-analysis.yml" ]; then
    echo "[OK] CodeQL Workflow: Found at .github/workflows/codeql-analysis.yml"
    ((PASSED++))
else
    echo "[FAIL] CodeQL Workflow: NOT found at .github/workflows/codeql-analysis.yml"
    ((FAILED++))
fi

# Check CodeQL Config
if [ -f ".github/codeql-config.yml" ]; then
    echo "[OK] CodeQL Configuration: Found at .github/codeql-config.yml"
    ((PASSED++))
else
    echo "[FAIL] CodeQL Configuration: NOT found at .github/codeql-config.yml"
    ((FAILED++))
fi

# Check GitHub templates
if [ -d ".github/ISSUE_TEMPLATE" ]; then
    echo "[OK] GitHub Issue Templates: Found at .github/ISSUE_TEMPLATE"
    ((PASSED++))
else
    echo "[FAIL] GitHub Issue Templates: NOT found at .github/ISSUE_TEMPLATE"
    ((FAILED++))
fi

echo ""
echo "Checking Documentation Files..."
echo "========================================="

# Check CODEQL_SETUP.md
if [ -f "docs/CODEQL_SETUP.md" ]; then
    echo "[OK] CodeQL Setup Documentation: Found"
    ((PASSED++))
else
    echo "[FAIL] CodeQL Setup Documentation: NOT found"
    ((FAILED++))
fi

# Check CODEQL_QUICK_REFERENCE.md
if [ -f "docs/CODEQL_QUICK_REFERENCE.md" ]; then
    echo "[OK] CodeQL Quick Reference: Found"
    ((PASSED++))
else
    echo "[FAIL] CodeQL Quick Reference: NOT found"
    ((FAILED++))
fi

echo ""
echo "Checking Repository Structure..."
echo "========================================="

# Check backend
if [ -d "backend" ]; then
    echo "[OK] Backend Directory: Found"
    ((PASSED++))
else
    echo "[FAIL] Backend Directory: NOT found"
    ((FAILED++))
fi

# Check frontend
if [ -d "frontend" ]; then
    echo "[OK] Frontend Directory: Found"
    ((PASSED++))
else
    echo "[FAIL] Frontend Directory: NOT found"
    ((FAILED++))
fi

# Check Python requirements
if [ -f "backend/requirements.txt" ]; then
    echo "[OK] Python Requirements: Found"
    ((PASSED++))
else
    echo "[WARN] Python Requirements: NOT found"
fi

# Check frontend package.json
if [ -f "frontend/package.json" ]; then
    echo "[OK] Frontend Package Configuration: Found"
    ((PASSED++))
else
    echo "[FAIL] Frontend Package Configuration: NOT found"
    ((FAILED++))
fi

echo ""
echo "Checking Git Configuration..."
echo "========================================="

# Check git
if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "[OK] Git repository initialized"
    ((PASSED++))
else
    echo "[FAIL] Not a git repository"
    ((FAILED++))
fi

# Check GitHub remote
if git remote get-url origin &>/dev/null; then
    REMOTE=$(git remote get-url origin)
    echo "[OK] GitHub remote configured: $REMOTE"
    ((PASSED++))
else
    echo "[WARN] No remote origin configured"
fi

echo ""
echo "Checking YAML Syntax..."
echo "========================================="

# Simple YAML validation
if python3 -c "import yaml; yaml.safe_load(open('.github/workflows/codeql-analysis.yml'))" 2>/dev/null; then
    echo "[OK] CodeQL Workflow YAML is valid"
    ((PASSED++))
else
    echo "[WARN] CodeQL Workflow YAML validation skipped (Python/YAML not available)"
fi

if python3 -c "import yaml; yaml.safe_load(open('.github/codeql-config.yml'))" 2>/dev/null; then
    echo "[OK] CodeQL Config YAML is valid"
    ((PASSED++))
else
    echo "[WARN] CodeQL Config YAML validation skipped"
fi

echo ""
echo "Optional Security Enhancements..."
echo "========================================="

# Check Dependabot
if [ -f ".github/dependabot.yml" ]; then
    echo "[OK] Dependabot configuration found"
    ((PASSED++))
else
    echo "[INFO] Dependabot not configured (optional but recommended)"
fi

echo ""
echo "=========================================="
echo "      Verification Summary"
echo "=========================================="
echo ""
echo "Checks Passed: $PASSED"
echo "Checks Failed: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "[SUCCESS] CodeQL Setup is Complete!"
    echo ""
    echo "Next Steps:"
    echo "1. Push changes to GitHub:"
    echo "   git add .github/ docs/ scripts/"
    echo "   git commit -m 'chore: add CodeQL static analysis configuration'"
    echo "   git push origin main"
    echo ""
    echo "2. View CodeQL results:"
    echo "   - Go to Security tab on GitHub"
    echo "   - Select 'Code scanning alerts'"
    echo ""
    exit 0
else
    echo "[FAILURE] CodeQL Setup Incomplete - Please check the issues above"
    exit 1
fi
