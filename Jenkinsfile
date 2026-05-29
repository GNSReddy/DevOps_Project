pipeline {

    agent any

    environment {
        FRONTEND_IMAGE = "gnsr/frontend-image:v1"
        BACKEND_IMAGE  = "gnsr/backend-image:v1"
        AUTH_IMAGE     = "gnsr/auth-image:v1"
    }

    stages {

        stage('Checkout Code') {
    steps {
        git branch: 'main',
            url: 'https://github.com/GNSReddy/DevOps_Project.git'
    }
}

        stage('Build Frontend Image') {
            steps {
                script {
                    docker.build("${FRONTEND_IMAGE}", "./frontend")
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                script {
                    docker.build("${BACKEND_IMAGE}", "./backend")
                }
            }
        }

        stage('Build Auth Image') {
            steps {
                script {
                    docker.build("${AUTH_IMAGE}", "./auth-service")
                }
            }
        }

        stage('Push Frontend Image') {
            steps {
                script {
                    docker.withRegistry(
                        'https://index.docker.io/v1/',
                        'dockerhub-creds'
                    ) {
                        docker.image("${FRONTEND_IMAGE}").push()
                    }
                }
            }
        }

        stage('Push Backend Image') {
            steps {
                script {
                    docker.withRegistry(
                        'https://index.docker.io/v1/',
                        'dockerhub-creds'
                    ) {
                        docker.image("${BACKEND_IMAGE}").push()
                    }
                }
            }
        }

        stage('Push Auth Image') {
            steps {
                script {
                    docker.withRegistry(
                        'https://index.docker.io/v1/',
                        'dockerhub-creds'
                    ) {
                        docker.image("${AUTH_IMAGE}").push()
                    }
                }
            }
        }

        stage('Deploy Application') {
            steps {
                bat 'docker compose down'
                bat 'docker compose up -d'
            }
        }
    }

    post {

        success {
            echo 'Build Successful'
        }

        failure {
            echo 'Build Failed'
        }
    }
}