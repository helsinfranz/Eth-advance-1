import Link from "next/link";

export default function org_admin_page() {
  return (
    <>
      <div>
        <h1>Welcome to Admin Navigation Page</h1>
        <br></br>
        <Link href="/"> Go to Index </Link>
        <br></br>
        <Link href="/org/org_register"> Go to Organization registration page </Link>
        <br></br>
        <Link href="/org/org_enlist"> Go to client enlistment page side</Link>
        <br></br>
        <Link href="/org/org_token_allot"> Go to Client token Allotment page </Link>
        <br></br>
        <Link href="/org/org_whitelist"> Go to Whitelisting page </Link>
        <br></br>
      </div>
    </>
  );
}
