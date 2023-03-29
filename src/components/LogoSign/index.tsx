import { styled } from "@mui/material";
import Image from "next/image";
import Link from "@components/Link";

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        display: flex;
        text-decoration: none;
        align-items: center;
        gap: 12px;
        width: 53px;
        margin: 0 auto;
        font-weight: ${theme.typography.fontWeightBold};
`
);

function LogoSign() {
  return (
    <LogoWrapper href="/">
      <Image src="/fuzzy-fyi.png" width="48" height="48" alt="fuzzy-fyi" />
      <h1>fuzzy.fyi</h1>
    </LogoWrapper>
  );
}

export default LogoSign;
