import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema untuk memvalidasi token
const tokenSchema = z.object({
  sub: z.string(),
  id: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Validasi token
    const validatedToken = tokenSchema.parse(token);

    // Validasi user existence
    const user = await prisma.user.findUnique({
      where: { id: validatedToken.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create or update session dengan data yang sudah divalidasi
    const session = await prisma.session.upsert({
      where: {
        sessionToken: validatedToken.sub,
      },
      update: {
        accessToken: validatedToken.sub,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      create: {
        sessionToken: validatedToken.sub,
        userId: validatedToken.id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        accessToken: validatedToken.sub,
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("Session tracking error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Validasi token
    const validatedToken = tokenSchema.parse(token);

    await prisma.session.delete({
      where: {
        sessionToken: validatedToken.sub,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Session deletion error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
