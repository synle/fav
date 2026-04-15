# CLAUDE.md

## GitHub Raw File URLs

When referencing raw file content from GitHub repos (e.g. `synle/bashrc`), use the GitHub Contents API:

```
https://api.github.com/repos/synle/bashrc/contents/webapp/common.scss
```

Do NOT use these URL patterns:

- `curl -L "https://github.com/synle/bashrc/blob/HEAD/webapp/common.scss?raw=true"`
- `https://raw.githubusercontent.com/synle/bashrc/HEAD/webapp/common.scss`
