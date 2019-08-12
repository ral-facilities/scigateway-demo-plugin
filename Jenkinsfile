#!groovy
pipeline {
    agent { label 'sl7'}
    stages {
        stage('Preparation') {
            steps {
                checkout scm
                sh 'npm i'
            }
        }
        stage('Unit Tests') {
            steps {
                sh 'npm run test:ci'
            }
            post {
                always {
                    junit 'junit.xml'
                }
            }
        }
    }
}
