import { Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

function LogoSign() {
  return (
    <Link href="/">
      <Box
        display="flex"
        justifyContent="center"
        flexDirection="row"
        alignItems="center"
        gap="16px"
      >
        <Image src="/fuzzy-fyi.png" width="48" height="48" alt="fuzzy" />
        <h1>fuzzy</h1>
      </Box>
    </Link>
  );
}

export default LogoSign;
