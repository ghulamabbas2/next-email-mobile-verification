"use client";

import { IUser } from "@/models/user.model";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data } = useSession();
  const user = data?.user as IUser;

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-2xl">Welcome, {user?.name}</h1>
      </div>
    </div>
  );
}
