export const config = {
  aws: {
    region: process.env.AWS_REGION!,
    ec2: {
      amiId: process.env.AWS_EC2_AMI_ID!,
      keyName: process.env.AWS_EC2_KEY_NAME!,
      instanceProfileArn: process.env.AWS_EC2_INSTANCE_PROFILE_ARN!,
    },
  },
};
