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
  rules:
    - if: '$CI_COMMIT_TAG'
    - if: '$CI_COMMIT_BRANCH == "main"'
  script:
    - |
      test -n "$WEB_TRIGGER_TOKEN"
      test -n "$WEB_PROJECT_ID"
      TARGET_BRANCH="${WEB_TARGET_BRANCH:-main}"
      curl --fail --show-error --silent \
        --request POST \
        --form "token=$WEB_TRIGGER_TOKEN" \
        --form "ref=$TARGET_BRANCH" \
        --form "variables[CORE_REF]=$CI_COMMIT_SHA" \
        --form "variables[CORE_PROJECT_PATH]=$CI_PROJECT_PATH" \
        "$CI_API_V4_URL/projects/$WEB_PROJECT_ID/trigger/pipeline"
```

## 3) Create trigger token in `web`

In `web` project:

- `Settings` -> `CI/CD` -> `Pipeline triggers` -> `Add trigger`.
- Copy the generated token and store it in `core` as `WEB_TRIGGER_TOKEN`.

## Notes

- `web` is already configured to accept `CI_PIPELINE_SOURCE == "trigger"`.
- This avoids the `downstream pipeline cannot be created, insufficient permissions` error from multi-project CI_JOB_TOKEN triggers.
