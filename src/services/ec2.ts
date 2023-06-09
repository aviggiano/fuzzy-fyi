import { config } from "@config";
import { EC2 } from "@aws-sdk/client-ec2";
const ec2 = new EC2({ apiVersion: "2016-11-15" });

export async function runInstance({
  instanceType,
  userData,
  amiId,
}: {
  instanceType: string;
  userData: string;
  amiId: string;
}): Promise<string> {
  const data = await ec2.runInstances({
    ImageId: amiId,
    KeyName: config.aws.ec2.keyName,
    InstanceType: instanceType,
    UserData: userData,
    MinCount: 1,
    MaxCount: 1,
  });
  const instanceId = data.Instances![0].InstanceId!;
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
