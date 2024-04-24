# Workflow Runs Action

![GitHub release (latest by date)](https://img.shields.io/github/v/release/satvik-s/workflow-runs-action)
[![GitHub Super-Linter](https://github.com/satvik-s/workflow-runs-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/satvik-s/workflow-runs-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/satvik-s/workflow-runs-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/satvik-s/workflow-runs-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/satvik-s/workflow-runs-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/satvik-s/workflow-runs-action/actions/workflows/codeql-analysis.yml)

GitHub action to get summary of workflow runs.

## Configuration

Please refer to [action definition](action.yml).

### Sample Workflow

```yml
name: check-stale-workflow-runs
on:
  schedule:
    - cron: '*/5 * * * *'

jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - name: workflow-runs
        uses: satvik-s/workflow-runs-action@v0.0.3
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          workflow-run-status: 'waiting'
```

## License

This project is released under the terms of the [MIT License](LICENSE)
