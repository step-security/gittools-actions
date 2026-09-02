# Example

```yaml
  steps:
  - uses: step-security/gittools-actions/gitreleasemanager/publish@v4
    name: Publish release with GitReleaseManager
    with:
      token: ${{ secrets.GITHUB_TOKEN }}
      repository: 'someOwner/someRepo'
      milestone: '0.1.0'
```
