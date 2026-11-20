#!/usr/bin/env bash
# Fails when .changeset/ holds a changeset the Version Packages PR did not consume. Used by CI on
# PRs into main (the promotion) and by the release job on main, so both apply the same rule.
#
#   bash scripts/check-changesets-consumed.sh pr        # a PR into main: block the promotion
#   bash scripts/check-changesets-consumed.sh release   # push to main: stop before npm
#
# Run it from the repository root. It needs only the checkout.
#
# Empty changesets (`pnpm changeset --empty`, front matter with no packages) release nothing, and
# changesets/action neither versions nor publishes while only empty ones are pending (it logs "All
# changesets are empty" and stops; on develop it opens no Version PR to consume them). So they are
# deleted from the checkout first (nothing is committed): the release job relies on that to publish.
#
# Any other changeset left means one landed on develop after the Version PR was merged. On main,
# changesets/action would switch to version mode and fail opening a PR, without publishing.
set -euo pipefail

mode=${1:-}
case "$mode" in
  pr) recovery='Merge the Version Packages PR on develop, then update this promotion PR with develop (a PR from develop updates by itself) so the check runs again.' ;;
  release) recovery='Merge the Version Packages PR on develop, then promote develop → main again.' ;;
  *)
    echo 'usage: check-changesets-consumed.sh pr|release' >&2
    exit 2
    ;;
esac

shopt -s nullglob

for f in .changeset/*.md; do
  [ "$(basename "$f")" = README.md ] && continue
  if [ "$(sed -n '1,2p' "$f" | tr -d '\r' | paste -sd '|')" = '---|---' ]; then
    echo "empty changeset: $f"
    rm "$f"
  fi
done

pending=()
for f in .changeset/*.md; do
  [ "$(basename "$f")" = README.md ] && continue
  pending+=("$f")
done

if [ ${#pending[@]} -gt 0 ]; then
  echo "::error::Changesets the Version Packages PR did not consume (${#pending[@]}):"
  for f in "${pending[@]}"; do
    echo "::error file=$f::Not consumed by the Version Packages PR: $f"
  done
  echo "::error::$recovery"
  exit 1
fi

echo 'Every changeset was consumed by the Version Packages PR.'
