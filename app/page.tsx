"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IUser } from "@/models/user.model";
import { CircleX } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data } = useSession();
  const user = data?.user as IUser;

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-2xl">Welcome, {user?.name}</h1>
        {!user?.phoneNo?.isVerified && (
          <Alert variant="destructive" className="mb-5">
            <CircleX color="red" />
            <AlertTitle>Your Phone No is not Verified!</AlertTitle>
            <AlertDescription>
              <Link href={"/verify-phoneno"}>
                <b>Click Here</b> to verify now.
              </Link>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
