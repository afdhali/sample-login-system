import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { signUpSchema } from "@/schemas/auth";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Server-side validation
    const validatedFields = signUpSchema.parse(body);

    // Sanitasi input
    const sanitizedEmail = validatedFields.email.toLowerCase().trim();
    const sanitizedUsername = validatedFields.username.trim();
    const sanitizedName = validatedFields.name.trim();

    // Check existing email/username
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: sanitizedEmail }, { username: sanitizedUsername }],
      },
    });

    if (existingUser?.email === sanitizedEmail) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    if (existingUser?.username === sanitizedUsername) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(validatedFields.password, 12);

    // Create user dengan data yang sudah divalidasi dan disanitasi
    const user = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        username: sanitizedUsername,
        name: sanitizedName,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("SignUp error:", error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    // Handle other errors secara generic
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
