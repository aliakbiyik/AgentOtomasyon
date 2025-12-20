import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { forecast } = await request.json();

    // Bu hafta ve gelecek haftanın tarihlerini hesapla
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1); // Pazartesi
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Pazar

    // Yeni tahmin oluştur
    const newForecast = await prisma.salesForecast.create({
      data: {
        weekStart: weekStart,
        weekEnd: weekEnd,
        prediction: 0,
        aiAnalysis: forecast,
      },
    });

    return NextResponse.json({
      success: true,
      data: newForecast,
    });
  } catch (error) {
    console.error("Satış tahmini kaydetme hatası:", error);
    return NextResponse.json(
      { error: "Satış tahmini kaydedilirken hata oluştu" },
      { status: 500 }
    );
  }
}