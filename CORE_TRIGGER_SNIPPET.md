# Trigger de web desde core

Añade este job al `.gitlab-ci.yml` del repo core para disparar el pipeline del repo web en cada push a `main` y en tags:

```yaml
trigger_web_pages:
  stage: deploy
  rules:
    - if: '$CI_COMMIT_TAG'
    - if: '$CI_COMMIT_BRANCH == "main"'
  trigger:
    project: freeos.me/web
    branch: main
    strategy: depend
  variables:
    CORE_REF: $CI_COMMIT_SHA
    CORE_PROJECT_PATH: $CI_PROJECT_PATH
```

Notas:

- En el proyecto web, el job `pages` ya acepta `CI_PIPELINE_SOURCE == "pipeline"`.
- `CORE_REF` usa `CI_COMMIT_SHA` para asegurar que la web se genera con el commit exacto de core.
- Si queréis usar una rama o tag fija de core, puedes pasar `CORE_REF` con ese valor en lugar del SHA.