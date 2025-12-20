import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, phone, position, cvText } = await request.json();

    // Veritabanına kaydet
    const application = await prisma.cVApplication.create({
      data: {
        name,
        email,
        phone,
        position,
        cvText,
        status: 'PENDING'
      }
    });

    // n8n webhook'a gönder (otomatik AI değerlendirme için)
    try {
      await fetch('http://localhost:5678/webhook/cv-auto-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: application.id,
          name,
          email,
          phone,
          position,
          cvText
        })
      });
    } catch (n8nError) {
      console.error('n8n webhook hatası:', n8nError);
      // n8n hatası olsa bile başvuru kaydedildi, devam et
    }

    return NextResponse.json({
      success: true,
      application: {
        id: application.id,
        name: application.name,
        position: application.position
      }
    });
  } catch (error) {
    console.error("CV başvuru hatası:", error);
    return NextResponse.json(
      { error: "Başvuru kaydedilemedi" },
      { status: 500 }
    );
  }
}