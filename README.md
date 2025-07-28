# MEDIAFLOW - 🚀 Serverless Media Processing Pipeline on AWS

This project demonstrates a highly scalable, event-driven media processing pipeline using various AWS services. It supports file uploads, asynchronous processing, and real-time notifications.

## 📌 Architecture Overview

The architecture is divided into the following key layers:

### 1. *User Layer*
- *Client:* Any user-facing application or frontend.
- *API Gateway:* Handles HTTP requests from users.
- *Authentication Service:* Verifies users before allowing access to upload or process data.

### 2. *Storage Layer*
- *S3 Bucket:* Stores uploaded media files.
- *CloudFront (CDN):* Delivers static content like images or processed files quickly to end users.

### 3. *Process Layer*
- *SQS Queue:* Decouples file upload and processing using a message queue.
- *ECS Cluster (Fargate or EC2):* Hosts microservices (e.g., Docker containers) to process uploaded media files.
- *AWS Lambda:* Used for lightweight, serverless executions like image resizing, metadata extraction, or sending alerts.
- *Database (e.g., RDS or DynamoDB):* Stores processed file data, metadata, or user information.
- *Notification Service:* Sends processing status updates to users (e.g., via email, SMS, or push notifications).

### 4. *Monitoring Layer*
- *CloudWatch:* Monitors logs, metrics, and events.
- *Auto Scaling:* Dynamically adjusts ECS instances based on workload.

## 🧱 AWS Services Used

| Service       | Purpose                                                             |
|---------------|---------------------------------------------------------------------|
| S3            | File storage                                                        |
| SQS           | Message queue for asynchronous processing                           |
| ECS           | Container orchestration for microservices                           |
| Lambda        | Serverless functions for quick tasks like image processing          |
| CloudFront    | CDN for fast content delivery                                       |
| CloudWatch    | Monitoring and metrics                                              |
| API Gateway   | Routing and request handling                                        |
| RDS/DynamoDB  | Structured/NoSQL database for storing metadata                      |
| SNS/SES/SQS   | Sending notifications                                               |

🔧 Setup Instructions
## Clone this repo

git clone https://github.com/yourusername/aws-media-pipeline.git
cd aws-media-pipeline

## Deploy Infrastructure
Use Terraform, AWS CDK, or CloudFormation from the infrastructure/ folder.

## Deploy ECS Services
Containerize your processing service using Docker and deploy to ECS using Fargate or EC2 launch type.

## Deploy Lambda Functions
Upload or deploy using the AWS CLI or the Serverless Framework.

## Configure S3 Event Trigger
Set up S3 to trigger SQS when a new file is uploaded.

## Set Up API Gateway and Auth
Use Amazon Cognito or custom JWT-based auth for API protection.

## Use Cases
### 1. Media processing (images, videos, audio)
### 2. Scalable content delivery
### 3. Asynchronous file processing
### 4. Real-time user notifications

### 📈 Scalability and Monitoring
CloudWatch tracks ECS/Lambda metrics, request logs, and errors.
Auto Scaling ensures services scale based on demand.
SQS decouples components for improved reliability.

### 📸 Diagram

![architecture](https://github.com/user-attachments/assets/db3adb74-66d3-40cd-ad5f-febf8f411092)

### Complete Documentation - [CCL Report.pdf](https://github.com/user-attachments/files/21472106/CCL.Report.pdf)
