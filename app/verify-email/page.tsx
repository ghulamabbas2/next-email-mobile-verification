"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { CircleX, SquareCheckBig } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const VerifyEmail = () => {
  const { toast } = useToast();

  const [loading, setLoading] = React.useState(false);
  const [verified, setVerified] = React.useState(false);
  const [error, setError] = React.useState(false);

  const searchParams = useSearchParams();
  const verifyToken = searchParams.get("verifyToken");
  const id = searchParams.get("id");

  const initialized = React.useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      verifyEmail();
    }
  }, []);

  const verifyEmail = async () => {
    if (!verifyToken || !id)
      return toast({ variant: "destructive", title: "Invalid URL" });

    setLoading(true);

    try {
      const res = await fetch(
        `/api/verify-email?verifyToken=${verifyToken}&id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        setLoading(false);
        setVerified(true);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
  };

  if (loading)
    return (
      <h1 className="flex justify-center items-center h-screen">
        Verifying your Email address. Please wait...
      </h1>
    );

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md">
        {verified && (
          <Alert variant="default" className="mb-5">
            <SquareCheckBig color="green" />
            <AlertTitle>Email Verified!</AlertTitle>
            <AlertDescription>
              Your email has been verified successfully.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-5">
            <CircleX color="red" />
            <AlertTitle>Email Verified Failed!</AlertTitle>
            <AlertDescription>
              Your verification token is invalid or Expired.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
