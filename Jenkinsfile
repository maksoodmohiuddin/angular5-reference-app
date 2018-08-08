pipeline {
  agent any
  stages {
    stage('myStage'){
      steps {
        sh 'ls -la'
      }
    }
    stage('Build') {
      steps {
        sh 'ls'
      }
    }
    stage('Test') {
          steps {
            sh 'echo "MWA Demo Running Test"'
            sh 'cd ng-app'
            sh 'ls'
          }
        }
  }
}
