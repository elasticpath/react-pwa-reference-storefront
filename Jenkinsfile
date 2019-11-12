#!groovy

timestamps {
  ansiColor('xterm') {
    node('node-small') {
      stage('SETUP') {
        deleteDir()
        dir('scm'){
          checkout scm
        }
        dir('solrHome') {
          git branch: SOLR_HOME_BRANCH, url: SOLR_HOME_GIT_URL
        }
      }
      stage('BUILD') {
        dir('scm') {
          // Build the docker image, push to aws
          sh """
            docker build --tag ${DOCKER_REGISTRY_ADDRESS}/${STORE_NAMESPACE}/ep-blueprint-dev:\$(jq -r .version package.json) \
              --build-arg BUILD_DATE="\$(date --rfc-3339=seconds)" --build-arg VERSION=\$(jq -r .version package.json) \
              --build-arg VCS_REF=\$(git rev-parse HEAD) -f ./docker/dev/Dockerfile .
            eval "\$(aws ecr get-login --no-include-email)"
            docker tag ${DOCKER_REGISTRY_ADDRESS}/${STORE_NAMESPACE}/ep-blueprint-dev:\$(jq -r .version package.json) ${DOCKER_REGISTRY_ADDRESS}/${STORE_NAMESPACE}/ep-blueprint-dev:latest
            docker push ${DOCKER_REGISTRY_ADDRESS}/${STORE_NAMESPACE}/ep-blueprint-dev:\$(jq -r .version package.json)
            docker push ${DOCKER_REGISTRY_ADDRESS}/${STORE_NAMESPACE}/ep-blueprint-dev:latest
          """
        }
      }
    }
  }
}
