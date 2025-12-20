import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { type, title, message } = await request.json();

    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
      },
    });

    return NextResponse.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error("Bildirim kaydetme hatası:", error);
    return NextResponse.json(
      { error: "Bildirim kaydedilemedi" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Bildirimler alınamadı:", error);
    return NextResponse.json(
      { error: "Bildirimler alınamadı" },
      { status: 500 }
    );
  }
}