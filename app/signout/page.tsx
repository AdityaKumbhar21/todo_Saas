"use client"

import { useClerk } from "@clerk/nextjs";

const signOut = () => {
  const { signOut } = useClerk();

  return (
    <button onClick={() => signOut({ redirectUrl: "/sign-in" })}>
      Logout
    </button>
  );
};

export default signOut;
