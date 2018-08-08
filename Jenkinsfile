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
            dir ('ng-app') {
                sh 'export PATH=/sbin:/usr/sbin:/usr/bin:/usr/local/bin'
                sh 'npm install'
                sh 'npm test'
            }
          }
        }
  }
}
