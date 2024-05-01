#!/usr/bin/env bash

set -euo pipefail

echo "--- Publish API Docs"

buildkite-agent artifact download "api_docs_changes.diff" .

if [[ -s "api_docs_changes.diff" ]]; then
  echo "Changes detected in API Docs"
  git apply api_docs_changes.diff
  rm api_docs_changes.diff
else
  echo "No changes detected in API Docs"
  exit 0
fi

git config --global user.name kibanamachine
git config --global user.email '42973632+kibanamachine@users.noreply.github.com'

branch="api_docs_$(date +%F_%H-%M-%S)"
git checkout -b "$branch"
git add ./*.docnav.json
git add api_docs
git commit -m "[api-docs] Daily api_docs build"

git push origin "$branch"

prUrl=$(gh pr create --repo elastic/kibana --base main --head "$branch" --title "[api-docs] $(date +%F) Daily api_docs build" --body "Generated by $BUILDKITE_BUILD_URL" --label "release_note:skip" --label "docs")
echo "Opened PR: $prUrl"
gh pr merge --repo elastic/kibana --auto --squash "$prUrl"

GH_TOKEN="$KIBANA_CI_GITHUB_TOKEN" gh pr review --repo elastic/kibana --approve -b "Automated review from $BUILDKITE_BUILD_URL" "$prUrl"