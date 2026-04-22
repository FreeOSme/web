# Trigger token (core -> web)

Use this approach in the `core` repository to trigger `web` without CI_JOB_TOKEN cross-project permissions.

## 1) Create variables in `core`

Create these CI/CD variables in `core`:

- `WEB_TRIGGER_TOKEN`: pipeline trigger token created in `web`.
- `WEB_PROJECT_ID`: numeric project id of `freeos.me/web`.

Optional:

- `WEB_TARGET_BRANCH`: defaults to `main`.

## 2) Add this job to `core` `.gitlab-ci.yml`

```yaml
trigger_web_pages:
  stage: deploy
  image: curlimages/curl:8.7.1
  variables:
    ALLOW_TRIGGER_WITHOUT_VARIABLES: "1"
  rules:
    - if: '$CI_COMMIT_TAG'
    - if: '$CI_COMMIT_BRANCH == "main"'
  script:
    - |
      set -eu
      test -n "$WEB_TRIGGER_TOKEN"
      test -n "$WEB_PROJECT_ID"
      TARGET_BRANCH="${WEB_TARGET_BRANCH:-main}"

      case "$WEB_PROJECT_ID" in
        *[!0-9]*|'')
          echo "WEB_PROJECT_ID must be numeric (GitLab project ID). Current value: $WEB_PROJECT_ID"
          exit 1
          ;;
      esac

      HTTP_CODE=$(curl --silent --show-error \
        --output /tmp/trigger-response.json \
        --write-out "%{http_code}" \
        --request POST \
        --form "token=$WEB_TRIGGER_TOKEN" \
        --form "ref=$TARGET_BRANCH" \
        --form "variables[CORE_REF]=$CI_COMMIT_SHA" \
        --form "variables[CORE_PROJECT_PATH]=$CI_PROJECT_PATH" \
        "$CI_API_V4_URL/projects/$WEB_PROJECT_ID/trigger/pipeline")

      echo "GitLab trigger HTTP status (with variables): $HTTP_CODE"
      cat /tmp/trigger-response.json

      if [ "$HTTP_CODE" = "201" ]; then
        exit 0
      fi

      if grep -q "Insufficient permissions to set pipeline variables" /tmp/trigger-response.json; then
        echo "Trigger token cannot set pipeline variables in target project."
        echo "To preserve CORE_REF/CORE_PROJECT_PATH, relax target project setting:"
        echo "Settings -> CI/CD -> Variables -> Minimum role to use pipeline variables in pipelines."

        if [ "${ALLOW_TRIGGER_WITHOUT_VARIABLES:-0}" = "1" ]; then
          HTTP_CODE_FALLBACK=$(curl --silent --show-error \
            --output /tmp/trigger-response-fallback.json \
            --write-out "%{http_code}" \
            --request POST \
            --form "token=$WEB_TRIGGER_TOKEN" \
            --form "ref=$TARGET_BRANCH" \
            "$CI_API_V4_URL/projects/$WEB_PROJECT_ID/trigger/pipeline")

          echo "GitLab trigger HTTP status (fallback without variables): $HTTP_CODE_FALLBACK"
          cat /tmp/trigger-response-fallback.json
          test "$HTTP_CODE_FALLBACK" = "201"
          exit 0
        fi
      fi

      exit 1
```

## 3) Create trigger token in `web`

In `web` project:

- `Settings` -> `CI/CD` -> `Pipeline triggers` -> `Add trigger`.
- Copy the generated token and store it in `core` as `WEB_TRIGGER_TOKEN`.

## Notes

- `web` is already configured to accept `CI_PIPELINE_SOURCE == "trigger"`.
- This avoids the `downstream pipeline cannot be created, insufficient permissions` error from multi-project CI_JOB_TOKEN triggers.
- If you get HTTP 400, the response body printed by this job usually points directly to the cause (`ref` missing/invalid, bad project id, pipeline blocked by rules, etc.).
- If the body says `Insufficient permissions to set pipeline variables`, the trigger token is valid but blocked from passing `variables[...]` by target project policy.
