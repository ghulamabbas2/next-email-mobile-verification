"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";
import { IUser } from "@/models/user.model";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";

const VerifyPhoneNO = () => {
  const [otpValue, setOtpValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const { data } = useSession();
  const user = data?.user as IUser;

  const { toast } = useToast();

  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      sendOTP();
    }
  }, []);

  const sendOTP = async () => {
    try {
      if (user?.phoneNo?.isVerified) {
        return router.push("/");
      }

      setLoading(true);

      const response = await fetch("/api/verify-phoneno/send-otp");
      const data = await response.json();

      if (data?.sent) {
        setLoading(false);
        toast({
          title: "OTP Sent",
          description: "OTP has been sent to your phone no",
        });
      } else {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "OTP Sent Failed",
          description: "Try again later.",
        });
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const verifyOTP = async () => {
    try {
      if (!otpValue) {
        return toast({
          variant: "destructive",
          title: "Pleae enter OTP",
        });
      }

      setLoading(true);

      const response = await fetch(
        `/api/verify-phoneno/verify-otp?otp=${otpValue}`
      );
      const data = await response.json();

      if (data?.verified) {
        setLoading(false);
        toast({
          title: "OTP Verified",
        });
        router.push("/");
      } else {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "OTP Verification Failed",
          description: "Try again later.",
        });
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Verify Phone No</CardTitle>
            <CardDescription>Enter OTP to verify your Phone NO</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex justify-center space-y-2">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(value) => setOtpValue(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={verifyOTP} disabled={loading}>
              {loading ? "Loading..." : "Verify"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VerifyPhoneNO;
