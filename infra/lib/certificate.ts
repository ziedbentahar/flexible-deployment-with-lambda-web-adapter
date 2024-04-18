import { aws_certificatemanager, aws_route53 } from "aws-cdk-lib";
import { ICertificate } from "aws-cdk-lib/aws-certificatemanager";
import { Construct } from "constructs";

export interface CertificateProps {
  hostedZoneDomainName: string;
  domainName: string;
}

export class Certificate extends Construct {
  public readonly certificate: ICertificate;

  constructor(scope: Construct, id: string, props: CertificateProps) {
    super(scope, id);

    const { hostedZoneDomainName, domainName } = props!;

    const hostedZone = aws_route53.HostedZone.fromLookup(this, "hosted-zone", {
      domainName: hostedZoneDomainName,
    });

    this.certificate = new aws_certificatemanager.Certificate(
      this,
      "some-api-certificate",
      {
        domainName,
        validation:
          aws_certificatemanager.CertificateValidation.fromDns(hostedZone),
      }
    );
  }
}
