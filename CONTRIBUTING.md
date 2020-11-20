# Contributing

## Publish a new release

- Create a new release (ie.: v1.0.0)
- Check `This is a pre-release`
- A GitHub workflow will run and build the code and update the release.
- Once the build is completed, publish the release.

## Testing

```bash
yarn install
yarn test
```

## Note about `aws-sdk`

`aws-sdk` is placed as a devDependency in the projet in order to build smaller zip file for the distribution.

From the [Building Lambda functions with Node.js](https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html) documentation:

> Your code runs in an environment that includes the AWS SDK for JavaScript, with credentials from an AWS Identity and Access Management (IAM) role that you manage.