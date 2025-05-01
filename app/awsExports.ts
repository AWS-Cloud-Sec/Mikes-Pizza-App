import type { ResourcesConfig } from "aws-amplify";
const awsExports: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_WbPOW8DjF",
      userPoolClientId: "2kkh4u94kop7vu9o09ijscue6o",
      loginWith: {
        oauth: {
          domain: "https://us-east-1iiajpyalk.auth.us-east-1.amazoncognito.com",
          scopes: [
            "openid",
            "email",
            "phone",
            "profile",
            "aws.cognito.signin.user.admin",
          ],
          redirectSignIn: ["http://localhost:3000/"],
          redirectSignOut: ["http://localhost:3000/"],
          responseType: "code",
        },
        username: false,
        email: true,
        phone: true,
      },
    },
  },
};

export default awsExports;
