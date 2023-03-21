import { config } from "@app/config";

import AWS from "aws-sdk";
AWS.config.update({ region: config.aws.region });

const ec2 = new AWS.EC2({ apiVersion: "2016-11-15" });

export async function runInstance({
  instanceType,
  userData,
}: {
  instanceType: AWS.EC2.InstanceType;
  userData: string;
}): Promise<string> {
  const data = await ec2
    .runInstances({
      ImageId: config.aws.ec2.amiId,
      KeyName: config.aws.ec2.keyName,
      InstanceType: instanceType,
      UserData: userData,
      MinCount: 1,
      MaxCount: 1,
    })
    .promise();
  const instanceId = data.Instances![0].InstanceId!;
  return instanceId;
}

export async function stopInstance({
  instanceId,
}: {
  instanceId: string;
}): Promise<void> {
  await ec2
    .stopInstances({
      InstanceIds: [instanceId],
    })
    .promise();
}
