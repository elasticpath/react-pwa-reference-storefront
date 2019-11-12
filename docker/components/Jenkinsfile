node {
   stage('Publish') {
    docker build --build-arg NPM_TOKEN=$NPM_TOKEN -f ./docker/components/Dockerfile .
   }
}
