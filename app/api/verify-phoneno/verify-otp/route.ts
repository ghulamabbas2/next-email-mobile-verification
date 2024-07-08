import User, { IUser } from "@/models/user.model";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILLO_SERVICE_ID!;

const client = twilio(accountSid, authToken);

export async function GET(request: NextRequest) {
  try {
    const getSession = async (req: NextRequest) => {
      const session = await getToken({ req });
      return session;
    };

    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as IUser;
    const { searchParams } = new URL(request.url);
    const otp = searchParams.get("otp") as string;

    // Verify OTP
    const twillioResponse = await client.verify.v2
      .services(serviceId)
      .verificationChecks.create({
        to: `+${user.phoneNo.value}`,
        code: otp,
      });

    if (twillioResponse.status === "approved") {
      await User.findByIdAndUpdate(user._id, { "phoneNo.isVerified": true });
      return NextResponse.json({ verified: true }, { status: 200 });
    } else {
      return NextResponse.json({ verified: false }, { status: 500 });
    }
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
