export const config = {
  aws: {
    region: process.env.AAWS_REGION || process.env.AWS_REGION!,
    ec2: {
      amiId: process.env.AAWS_EC2_AMI_ID || process.env.AWS_EC2_AMI_ID!,
      keyName: process.env.AAWS_EC2_KEY_NAME || process.env.AWS_EC2_KEY_NAME!,
      instanceProfileArn:
        process.env.AAWS_EC2_INSTANCE_PROFILE_ARN ||
        process.env.AWS_EC2_INSTANCE_PROFILE_ARN!,
      instanceTypes: ["c5.large", "c5.xlarge", "c5.2xlarge"],
    },
    s3: {
      bucket: process.env.AAWS_S3_BUCKET || process.env.AWS_S3_BUCKET!,
    },
  },
  backend: {
    url:
      process.env.NODE_ENV === "production"
        ? "https://app.fuzzy.fyi"
        : "http://localhost:3000",
    outputUrl: "https://assets.fuzzy.fyi",
  },
  runner: {
    jobId: process.env.JOB_ID!,
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
};
