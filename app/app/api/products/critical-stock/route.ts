import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Stok sayısı minStock'tan az olan ürünleri getir
    const criticalProducts = await prisma.product.findMany({
      where: {
        stock: {
          lte: prisma.product.fields.minStock
        }
      },
      select: {
        id: true,
        name: true,
        stock: true,
        minStock: true,
        category: {
          select: { name: true }
        }
      }
    });

    // Manuel filtreleme (Prisma field karşılaştırması için)
    const allProducts = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        stock: true,
        minStock: true,
        category: {
          select: { name: true }
        }
      }
    });

    const critical = allProducts.filter(p => p.stock <= p.minStock);

    return NextResponse.json(critical);
  } catch (error) {
    console.error("Kritik stok hatası:", error);
    return NextResponse.json(
      { error: "Kritik stok verisi alınamadı" },
      { status: 500 }
    );
  }
}