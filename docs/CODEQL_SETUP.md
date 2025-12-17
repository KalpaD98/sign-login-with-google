# CodeQL Setup and Configuration

## Overview

CodeQL is a powerful static analysis tool that helps identify potential security vulnerabilities and code quality issues in your codebase. This project has been configured to run CodeQL analysis on both Python (backend) and JavaScript (frontend) code.

## What is CodeQL?

CodeQL is a semantic code analysis engine that:
- Treats code as data
- Analyzes Python, JavaScript, TypeScript, Java, C/C++, and other languages
- Identifies potential security vulnerabilities, bugs, and code quality issues
- Integrates seamlessly with GitHub

For more information, visit: [CodeQL Documentation](https://codeql.github.com/)

## Configuration Files

### `.github/workflows/codeql-analysis.yml`

This is the main GitHub Actions workflow file that:
- Runs on push to `main` and `develop` branches
- Runs on all pull requests to `main` and `develop`
- Runs on a weekly schedule (Monday at 2 AM UTC)
- Analyzes both Python and JavaScript code
- Uses CodeQL Action v4 (latest as of 2025)

**Key Features:**
- Matrix strategy to analyze both languages
- Autobuild step for JavaScript
- Security events are written to the repository
- 360-minute timeout for complex analyses

### `.github/codeql-config.yml`

This configuration file customizes CodeQL behavior:
- Specifies which paths to analyze
- Excludes test files and dependencies
- Configures query sets
- Provides granular control over analysis

## How It Works

### Automated Analysis

1. **On Push**: When you push code to `main` or `develop` branches, CodeQL automatically runs
2. **On Pull Request**: CodeQL analyzes any pull request targeting `main` or `develop`
3. **Scheduled**: CodeQL runs weekly (Monday at 2 AM UTC) for proactive scanning

### Results

CodeQL analysis results are available in:
1. **Security Tab**: `Settings > Code security and analysis > Code scanning`
2. **Pull Request Checks**: Shows CodeQL results inline for PRs
3. **Details Tab**: View detailed findings with severity levels

## Severity Levels

CodeQL findings are classified as:
- **Critical**: Immediate security risk
- **High**: Serious vulnerability or issue
- **Medium**: Potential issue requiring attention
- **Low**: Minor code quality suggestion
- **Note**: Informational findings

## Supported Languages and Features

### Python
- Security vulnerability detection
- Code quality analysis
- Framework-specific checks (Django, Flask, etc.)
- SQL injection detection
- Command injection detection
- Path traversal detection

### JavaScript/TypeScript
- Security vulnerability detection
- Code quality analysis
- React-specific checks
- Express.js checks
- DOM-based vulnerabilities
- Cross-site scripting (XSS) detection
- Cross-site request forgery (CSRF) patterns

## Viewing Results

### In GitHub Web Interface

1. Navigate to your repository on GitHub
2. Click on the **Security** tab
3. Select **Code scanning alerts**
4. View and manage findings:
   - Dismiss false positives with explanations
   - Track remediation progress
   - Enable/disable specific rule types

### In Pull Requests

When CodeQL runs on a PR:
- Results appear in the **Checks** tab
- Critical/High severity issues block merging (if configured)
- You can view detailed findings and fix suggestions

## Running CodeQL Locally (Optional)

To run CodeQL analysis locally:

```bash
# Install CodeQL CLI
# Follow instructions at: https://codeql.github.com/docs/codeql-cli/

# Create a CodeQL database
codeql database create <database-path> --language=python --source-root=./backend
codeql database create <database-path> --language=javascript --source-root=./frontend

# Run analysis
codeql database analyze <database-path> --format=csv --output=results.csv
```

## Best Practices

### 1. **Regular Monitoring**
- Check CodeQL results regularly (weekly recommended)
- Address critical and high-severity findings promptly
- Use dismissals with clear explanations for false positives

### 2. **Fix Issues Systematically**
- Start with critical/high severity issues
- Create separate PRs for security fixes
- Include tests for vulnerabilities fixed

### 3. **Prevention**
- Address CodeQL findings before merging PRs
- Use the configuration to focus on relevant rules
- Keep dependencies updated to prevent known vulnerabilities

### 4. **Team Communication**
- Share CodeQL findings in team discussions
- Use them as teaching points for secure coding
- Establish standards for what issues to address

## Configuration Customization

To customize CodeQL analysis:

### Exclude Additional Paths

Edit `.github/codeql-config.yml`:

```yaml
paths-ignore:
  - "**/custom-pattern/**"
  - "**/vendor/**"
```

### Change Analysis Frequency

Edit `.github/workflows/codeql-analysis.yml`:

```yaml
schedule:
  # Run daily at 2 AM UTC
  - cron: "0 2 * * *"
```

### Add Custom Queries

Reference custom query packs in the workflow:

```yaml
- name: Initialize CodeQL
  uses: github/codeql-action/init@v4
  with:
    languages: ${{ matrix.language }}
    queries: security-and-quality,path/to/custom-queries
```

## Troubleshooting

### CodeQL Analysis Takes Too Long

- **Solution 1**: Increase the `timeout-minutes` in the workflow
- **Solution 2**: Exclude large dependency directories in `codeql-config.yml`
- **Solution 3**: Reduce analysis scope if not needed

### High Number of False Positives

- Dismiss findings with clear explanations
- Consider using custom query sets
- Adjust rule severity settings

### Missing Analysis Results

- Check that the workflow file exists and is properly formatted
- Verify branch protections aren't blocking the workflow
- Check the **Actions** tab for workflow execution logs

## Security Considerations

### Private Repositories

- CodeQL results are private by default
- Only accessible to repository maintainers and authorized users
- No results are sent to external services

### Public Repositories

- CodeQL results are public on GitHub
- Consider the implications of exposing vulnerability locations
- Use dismissals to manage sensitive information

## Additional Resources

- [CodeQL Documentation](https://codeql.github.com/)
- [GitHub Code Scanning](https://docs.github.com/en/code-security/code-scanning)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)

## Support and Feedback

For issues or feedback related to CodeQL:

1. Check [GitHub CodeQL Discussions](https://github.com/github/codeql/discussions)
2. Review [Known Issues](https://github.com/github/codeql/issues)
3. Report new issues with detailed reproduction steps
4. Share queries and improvements with the community

---

**Last Updated**: December 12, 2025
**CodeQL Action Version**: v4 (Node.js 24 runtime)
