import Link from "next/link";

export default function main() {
  return (
    <>
      <div>
        <h1>Welcome</h1>
        <br></br>
        <div className="footer">
          <Link href="/client"> Go to client side</Link>
          <Link href="/org/org_admin"> Go to admin side</Link>
        </div>
      </div>
    </>
  );
}
