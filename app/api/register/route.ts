import bcrypt from "bcryptjs";
import User from "../../../models/user.model";
import { NextResponse } from "next/server";
import { dbConnect } from "@/config/dbConnect";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    const { name, email, password, phoneNo } = body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNo,
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Something went wrong" + error },
      { status: 500 }
    );
  }
}
