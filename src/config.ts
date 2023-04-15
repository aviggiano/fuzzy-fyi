export const config = {
  aws: {
    region: process.env.AAWS_REGION || process.env.AWS_REGION!,
    ec2: {
      amiId: process.env.AAWS_EC2_AMI_ID || process.env.AWS_EC2_AMI_ID!,
      keyName: process.env.AAWS_EC2_KEY_NAME || process.env.AWS_EC2_KEY_NAME!,
      accessKeyId:
        process.env.AAWS_EC2_ACCESS_KEY_ID ||
        process.env.AWS_EC2_ACCESS_KEY_ID!,
      secretAccessKey:
        process.env.AAWS_EC2_SECRET_ACCESS_KEY ||
        process.env.AWS_EC2_SECRET_ACCESS_KEY!,
      instanceTypes: [
        "t3.large",
        "t3.xlarge",
        "t3.2xlarge",
        "m5.large",
        "m5.xlarge",
        "m5.2xlarge",
        "c5.large",
        "c5.xlarge",
        "c5.2xlarge",
      ],
      instanceHourlyCosts: [
        "0.0832",
        "0.1664",
        "0.3328",
        "0.096",
        "0.192",
        "0.384",
        "0.085",
        "0.17",
        "0.34",
      ],
    },
    s3: {
      bucket: process.env.AAWS_S3_BUCKET || process.env.AWS_S3_BUCKET!,
    },
  },
  github: {
    auth: {
      token: process.env.GITHUB_AUTH_TOKEN!,
    },
  },
  git: {
    sha: process.env.GIT_SHA || "HEAD",
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
