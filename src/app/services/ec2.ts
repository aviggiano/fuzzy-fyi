import { config } from "@app/config";
import { EC2, waitUntilInstanceRunning } from "@aws-sdk/client-ec2";
const ec2 = new EC2({ apiVersion: "2016-11-15" });

export async function runInstance({
  instanceType,
  userData,
}: {
  instanceType: string;
  userData: string;
}): Promise<string> {
  const data = await ec2.runInstances({
    ImageId: config.aws.ec2.amiId,
    KeyName: config.aws.ec2.keyName,
    InstanceType: instanceType,
    UserData: userData,
    MinCount: 1,
    MaxCount: 1,
  });
  const instanceId = data.Instances![0].InstanceId!;
  await waitUntilInstanceRunning(
    { client: ec2, maxWaitTime: 20 },
    { InstanceIds: [instanceId] }
  );

  await ec2.associateIamInstanceProfile({
    IamInstanceProfile: {
      Arn: config.aws.ec2.instanceProfileArn,
    },
    InstanceId: instanceId,
  });
  return instanceId;
}

export async function terminateInstance({
  instanceId,
}: {
  instanceId: string;
}): Promise<void> {
  await ec2.terminateInstances({
    InstanceIds: [instanceId],
  });
}
