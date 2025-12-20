import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: "Email gerekli" },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { email: email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      }
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Müşteri bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Auth hatası:", error);
    return NextResponse.json(
      { error: "Giriş yapılamadı" },
      { status: 500 }
    );
  }
}

// Yeni müşteri kaydı
export async function POST(request: Request) {
  try {
    const { name, email, phone } = await request.json();

    // Email zaten var mı kontrol et
    const existing = await prisma.customer.findUnique({
      where: { email }
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu email zaten kayıtlı" },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      }
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Kayıt hatası:", error);
    return NextResponse.json(
      { error: "Kayıt oluşturulamadı" },
      { status: 500 }
    );
  }
}