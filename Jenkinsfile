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
            sh 'npm test'
          }
        }
  }
}
