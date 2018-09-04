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
            docker build --tag ${DOCKER_REGISTRY_ADDRESS}/${STORE_NAMESPACE}/ep-store:\$(jq -r .version package.json) \
              --build-arg BUILD_DATE="\$(date --rfc-3339=seconds)" --build-arg VERSION=\$(jq -r .version package.json) \
              --build-arg VCS_REF=\$(git rev-parse HEAD) -f ./docker/dev/Dockerfile .
            eval "\$(aws ecr get-login --no-include-email)"
            docker push ${DOCKER_REGISTRY_ADDRESS}/${STORE_NAMESPACE}/ep-store:\$(jq -r .version package.json)
          """
        }
      }
      stage('UNDEPLOY_EXISTING') {
        // Remove if exists: working directory, docker containers, and images
        sh """
          ssh -i ${EC2_INSTANCE_SSH_KEY} ${EC2_INSTANCE_USER}@${EC2_INSTANCE_HOST} \"\"\"
            if [ -d ref-store-service ]; then
              cd ~
              rm -rf ref-store-service
            fi
            if [ ! -z \\\"\\\$(docker ps -aq)\\\" ]; then
              docker rm -f \\\$(docker ps -aq)
            fi
            if [ ! -z \\\"\\\$(docker images -q)\\\" ]; then
              docker rmi \\\$(docker images -q)
            fi
          \"\"\"
        """
      }
      stage('DEPLOY') {
        // Create the working directory
        sh """
          ssh -i ${EC2_INSTANCE_SSH_KEY} ${EC2_INSTANCE_USER}@${EC2_INSTANCE_HOST} "mkdir -p ref-store-service"
        """

        // Copy over new deployment files
        sh """
          scp -i ${EC2_INSTANCE_SSH_KEY} -r scm/* ${EC2_INSTANCE_USER}@${EC2_INSTANCE_HOST}:~/ref-store-service
          scp -i ${EC2_INSTANCE_SSH_KEY} -r ${env.WORKSPACE}/solrHome/${SOLR_HOME_PATH} ${EC2_INSTANCE_USER}@${EC2_INSTANCE_HOST}:/ep
        """

        // Deploy new version
        sh """
          ssh -i ${EC2_INSTANCE_SSH_KEY} ${EC2_INSTANCE_USER}@${EC2_INSTANCE_HOST} \"\"\"
            export REGISTRY_ADDRESS=${DOCKER_REGISTRY_ADDRESS}
            export STORE_NAMESPACE=${STORE_NAMESPACE}
            export CORTEX_NAMESPACE=${CORTEX_NAMESPACE}
            export STORE_IMAGE_TAG=${STORE_IMAGE_TAG}
            export DOCKER_IMAGE_TAG=${DOCKER_IMAGE_TAG}
            export SOLR_HOME_CONFIG=\$(basename ${SOLR_HOME_PATH})
            export CORTEX=http://${EC2_INSTANCE_HOST}:9080
            export STORE=${STORE_NAME}

            cd ref-store-service/docker/dev
            eval '\$(aws ecr get-login --no-include-email)'
            docker-compose up -d
          \"\"\"
        """

        currentBuild.description = "Image Tag: ${DOCKER_IMAGE_TAG}"
      }
      stage('TEST') {
        // Add JAVA_HOME and JAVA + MAVEN to path
        withEnv( ["JAVA_HOME=${tool 'jdk8u66'}" , "PATH+JDK=${JAVA_HOME}/bin", "PATH+MAVEN=${tool 'maven-3.5.2'}/bin"] ){
          dir('scm') {
            // Download google chrome using script from https://intoli.com/blog/installing-google-chrome-on-centos/
            sh """
              curl https://intoli.com/install-google-chrome.sh | bash
              sudo mv /usr/bin/google-chrome-stable /usr/bin/google-chrome
            """
            // Replace selenium.session.baseurl and run tests using headless chrome
            try {
              sh """
                cd test
                sed -i.bak \"s@\\(<selenium\\.session\\.baseurl>\\)[^<]*\\(<\\/selenium.session.baseurl>\\)@\\1http://${EC2_INSTANCE_HOST}:8080\\2@\" ./pom.xml
                mvn -v
                mvn clean install -Dcucumber.option=\"--tags @smoketest\" -Pheadlesschrome -s settings.xml
              """
            } finally {
              cucumber fileIncludePattern: '**/store.json', sortingMethod: 'ALPHABETICAL'
            }
          }
        }
      }
    }
  }
}
