# CodeQL Quick Reference Guide

## For Developers

### Viewing CodeQL Results

**On GitHub:**
1. Go to your repository on GitHub
2. Click **Security** tab
3. Select **Code scanning alerts**
4. Review findings by severity

**On Pull Requests:**
- CodeQL results appear in the **Checks** section
- Click "Details" to see specific findings

### Responding to Findings

**If you find a real vulnerability:**
```bash
# 1. Create a branch
git checkout -b fix/codeql-issue-123

# 2. Fix the issue following the CodeQL recommendation
# 3. Test your changes
# 4. Push and create a PR
```

**If it's a false positive:**
1. Go to the specific finding on GitHub
2. Click "Dismiss"
3. Select reason: "Not a real problem"
4. Add explanation (e.g., "Library sanitizes input")
5. Dismiss the alert

### Common CodeQL Issues (Python)

| Issue | Typical Cause | Fix |
|-------|---------------|-----|
| SQL Injection | String concatenation in queries | Use parameterized queries (SQLAlchemy handles this) |
| Command Injection | Using `os.system()` with user input | Use `subprocess` with proper escaping or `shlex.quote()` |
| Path Traversal | Unsanitized file paths | Use `pathlib.Path` and validate inputs |

### Common CodeQL Issues (JavaScript)

| Issue | Typical Cause | Fix |
|-------|---------------|-----|
| XSS (Cross-Site Scripting) | Unsanitized HTML/JS injection | Use React JSX (automatic escaping) |
| CSRF | Missing token validation | Add CSRF tokens to state-changing requests |
| Hardcoded Secrets | API keys in code | Use environment variables (.env files) |

### Local Development Workflow

```bash
# Before pushing, check CodeQL would find issues
# (This helps catch issues early)

# Fix any obvious security issues locally
# The CI will run full CodeQL on push

# Write tests for security fixes
npm test   # Frontend
pytest     # Backend
```

### Team Responsibility

| Role | Responsibility |
|------|-----------------|
| **Developer** | Fix findings before merging PRs |
| **Reviewer** | Verify fixes don't introduce new issues |
| **Maintainer** | Manage false positive dismissals & track metrics |

---

## For Security & DevOps Teams

### Configuring Branch Protection

To require CodeQL to pass before merging:

1. Go to repository **Settings**
2. Click **Branches**
3. Add rule for `main` branch
4. Enable "Require status checks to pass before merging"
5. Add "CodeQL" to required checks

### Monitoring CodeQL Metrics

**Dashboard View:**
- Go to **Security** → **Code scanning alerts**
- Track findings over time
- Monitor trend of new vs resolved issues

**Critical Issues Tracking:**
- Create GitHub Issues for critical findings
- Link to CodeQL alerts
- Track resolution progress

### Integration with CI/CD

**Block Merge on Critical Issues:**

Edit `.github/workflows/codeql-analysis.yml`:

```yaml
- name: Check CodeQL Results
  run: |
    # Add script to fail if critical issues found
    # This enforces security gates in your pipeline
```

---

## FAQ

**Q: Why did CodeQL flag this?**
A: See [CODEQL_SETUP.md](CODEQL_SETUP.md) for detailed explanations of finding types.

**Q: How do I dismiss a false positive?**
A: On GitHub, click the finding → "Dismiss" → select reason → add explanation.

**Q: Does CodeQL slow down our CI?**
A: CodeQL adds ~5-10 minutes to CI pipeline. Matrix strategy analyzes Python and JavaScript separately.

**Q: Can we customize which rules run?**
A: Yes! Edit `.github/codeql-config.yml` to customize queries and paths.

**Q: What if we need to delay fixing something?**
A: Dismiss with explanation for now, create a GitHub Issue, and schedule a fix sprint.

---

## Useful Links

- 📚 [Full CodeQL Documentation](docs/CODEQL_SETUP.md)
- 🔒 [GitHub Security Documentation](https://docs.github.com/en/code-security)
- 🛡️ [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- 🐛 [CWE/SANS Top 25](https://cwe.mitre.org/top25/)

---

**Last Updated**: December 12, 2025
