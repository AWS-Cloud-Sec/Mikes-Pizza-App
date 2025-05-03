## AWS Amplify Next.js (App Router) Starter Template

A full-stack food ordering web application with Stripe payment integration, order tracking, cart functionality and order history for creating applications using Next.js (App Router) and AWS Amplify, emphasizing easy setup for authentication, menu navigation, ordering food, processing payments with StripeAPI, and the database on Railway.

The backend for our food ordering app split tasks into smaller, secure backend services and microservices. The API Gateway acts as the entry point, routing requests to placing an order to the right service requested for Users on their accounts, orders for purchases, or menu for food items. Payments are handled safely by Stripe, while data is stored in Railway DB and S3 for images. Security tools like Guard Duty and IAM protect the system, and Lambda runs code without servers. After an order, SNS sends confirmations, and Postman tests everything.


## Overview

This template equips you with a foundational Next.js application integrated with AWS Amplify, streamlined for scalability and performance. It is ideal for developers looking to jumpstart their project with pre-configured AWS services like Cognito, AppSync, and Railway.

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-name>
```

2. Install dependencies:
```bash
npm install
```

3. Install additional dependencies:
```bash
npm install react-icons @types/react-icons
```


6. Set up the development environment:
```bash
npm run dev
```

## System Design and Architecture:
- Frontend Hosting: AWS Amplify
- Backend Logic: AWS Lambda
- API Management: AWS API Gateway (As proxy)
- Database: Railway (External Database Service)
- Authentication: Amazon Cognito
- Monitoring Activity: Guard Duty and CloudTrail
- Management: Amazon IAM
- Payment Card Processing: Stripe (External) 
- Backend Testing: Postman (External)


## Features

- **Authentication**: Setup with Amazon Cognito for secure user authentication.
- **API**: Ready-to-use GraphQL endpoint with AWS AppSync.
- **Database**: Real-time database powered by Railway.
- **Browse Menu**: View and add items to your cart.
- **Saving Cart data**: Cart contents are saved. We can add, remove, and update item quantities.
- **Secure Checkout**: Stripe integration for safe payments.
- **Order Tracking**: Track your order status, wiew past orders on the track order page., and estimated delivery time.
- **Order History**: View past orders with itemized details.
- **Responsive UI**: Desktop and mobile responsive.
- **Error Handling**: User-friendly error and loading states.

Pizza Application UI: 

Menu UI:
![menu](https://github.com/user-attachments/assets/6c81cd47-04a9-4674-8cf0-d808799a427f)

Cart UI:
![cart](https://github.com/user-attachments/assets/ed105f98-9d39-4af9-ab77-9d6bb655fd12)

Checkout + Payment process:
![payment](https://github.com/user-attachments/assets/72add8b1-6266-45ff-939b-38efbf74b0bb)

Order History: 
![orderhistory](https://github.com/user-attachments/assets/6600e53f-7bed-4276-9baa-ea54bc4f92cf)


## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
