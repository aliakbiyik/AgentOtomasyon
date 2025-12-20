import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed başlıyor...')

  // Kategoriler
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Telefonlar', description: 'Akıllı telefonlar ve aksesuarları' }
    }),
    prisma.category.create({
      data: { name: 'Laptoplar', description: 'Dizüstü bilgisayarlar' }
    }),
    prisma.category.create({
      data: { name: 'Tabletler', description: 'Tablet bilgisayarlar' }
    }),
    prisma.category.create({
      data: { name: 'Aksesuarlar', description: 'Elektronik aksesuarlar' }
    })
  ])
  console.log('✅ Kategoriler oluşturuldu')

  // Ürünler
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'iPhone 15 Pro',
        description: 'Apple iPhone 15 Pro 256GB',
        price: 64999.99,
        stock: 25,
        minStock: 5,
        categoryId: categories[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Samsung Galaxy S24',
        description: 'Samsung Galaxy S24 Ultra 512GB',
        price: 54999.99,
        stock: 30,
        minStock: 5,
        categoryId: categories[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'MacBook Pro 14"',
        description: 'Apple MacBook Pro 14 inch M3 Pro',
        price: 84999.99,
        stock: 15,
        minStock: 3,
        categoryId: categories[1].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Dell XPS 15',
        description: 'Dell XPS 15 Intel i7 32GB RAM',
        price: 52999.99,
        stock: 20,
        minStock: 5,
        categoryId: categories[1].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'iPad Pro 12.9"',
        description: 'Apple iPad Pro 12.9 inch M2 256GB',
        price: 44999.99,
        stock: 18,
        minStock: 4,
        categoryId: categories[2].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Samsung Galaxy Tab S9',
        description: 'Samsung Galaxy Tab S9 Ultra',
        price: 34999.99,
        stock: 22,
        minStock: 5,
        categoryId: categories[2].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'AirPods Pro 2',
        description: 'Apple AirPods Pro 2. Nesil',
        price: 8999.99,
        stock: 50,
        minStock: 10,
        categoryId: categories[3].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Apple Watch Series 9',
        description: 'Apple Watch Series 9 45mm GPS',
        price: 16999.99,
        stock: 3,
        minStock: 5,
        categoryId: categories[3].id
      }
    })
  ])
  console.log('✅ Ürünler oluşturuldu')

  // Müşteriler
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Ahmet Yılmaz',
        email: 'ahmet@email.com',
        phone: '05321234567',
        address: 'İstanbul, Kadıköy'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Ayşe Demir',
        email: 'ayse@email.com',
        phone: '05331234567',
        address: 'Ankara, Çankaya'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Mehmet Kaya',
        email: 'mehmet@email.com',
        phone: '05341234567',
        address: 'İzmir, Karşıyaka'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Fatma Şahin',
        email: 'fatma@email.com',
        phone: '05351234567',
        address: 'Bursa, Nilüfer'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Ali Öztürk',
        email: 'ali@email.com',
        phone: '05361234567',
        address: 'Antalya, Muratpaşa'
      }
    })
  ])
  console.log('✅ Müşteriler oluşturuldu')

  // Çalışanlar
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        name: 'Zeynep Arslan',
        email: 'zeynep@techstore.com',
        phone: '05371234567',
        department: 'Satış',
        position: 'Satış Müdürü',
        salary: 45000
      }
    }),
    prisma.employee.create({
      data: {
        name: 'Can Yıldız',
        email: 'can@techstore.com',
        phone: '05381234567',
        department: 'Teknik Destek',
        position: 'Destek Uzmanı',
        salary: 35000
      }
    }),
    prisma.employee.create({
      data: {
        name: 'Elif Korkmaz',
        email: 'elif@techstore.com',
        phone: '05391234567',
        department: 'İnsan Kaynakları',
        position: 'HR Uzmanı',
        salary: 38000
      }
    }),
    prisma.employee.create({
      data: {
        name: 'Burak Çelik',
        email: 'burak@techstore.com',
        phone: '05401234567',
        department: 'Muhasebe',
        position: 'Muhasebe Uzmanı',
        salary: 40000
      }
    })
  ])
  console.log('✅ Çalışanlar oluşturuldu')

  // Siparişler
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-001',
      customerId: customers[0].id,
      totalAmount: 64999.99,
      status: 'DELIVERED',
      items: {
        create: [
          { productId: products[0].id, quantity: 1, price: 64999.99 }
        ]
      }
    }
  })

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-002',
      customerId: customers[1].id,
      totalAmount: 93999.98,
      status: 'SHIPPED',
      items: {
        create: [
          { productId: products[2].id, quantity: 1, price: 84999.99 },
          { productId: products[6].id, quantity: 1, price: 8999.99 }
        ]
      }
    }
  })

  const order3 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-003',
      customerId: customers[2].id,
      totalAmount: 54999.99,
      status: 'CONFIRMED',
      items: {
        create: [
          { productId: products[1].id, quantity: 1, price: 54999.99 }
        ]
      }
    }
  })

  const order4 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-004',
      customerId: customers[3].id,
      totalAmount: 44999.99,
      status: 'PENDING',
      items: {
        create: [
          { productId: products[4].id, quantity: 1, price: 44999.99 }
        ]
      }
    }
  })
  console.log('✅ Siparişler oluşturuldu')

  // Faturalar
  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-001',
      orderId: order1.id,
      amount: 64999.99,
      taxAmount: 11700,
      totalAmount: 76699.99,
      status: 'PAID',
      paidAt: new Date()
    }
  })

  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-002',
      orderId: order2.id,
      amount: 93999.98,
      taxAmount: 16920,
      totalAmount: 110919.98,
      status: 'PENDING'
    }
  })
  console.log('✅ Faturalar oluşturuldu')

  // Ticketlar
  await prisma.ticket.create({
    data: {
      ticketNumber: 'TKT-001',
      customerId: customers[0].id,
      assignedToId: employees[1].id,
      subject: 'iPhone ekran sorunu',
      description: 'Telefonumun ekranında çizikler var, garanti kapsamında değişim istiyorum.',
      status: 'IN_PROGRESS',
      priority: 'HIGH'
    }
  })

  await prisma.ticket.create({
    data: {
      ticketNumber: 'TKT-002',
      customerId: customers[2].id,
      subject: 'Kargo gecikmesi',
      description: 'Siparişim 3 gündür kargoda görünüyor ama teslim edilmedi.',
      status: 'OPEN',
      priority: 'MEDIUM'
    }
  })

  await prisma.ticket.create({
    data: {
      ticketNumber: 'TKT-003',
      customerId: customers[4].id,
      assignedToId: employees[1].id,
      subject: 'Ürün iade talebi',
      description: 'Aldığım kulaklık beklentilerimi karşılamadı, iade etmek istiyorum.',
      status: 'OPEN',
      priority: 'LOW'
    }
  })
  console.log('✅ Ticketlar oluşturuldu')

  // CV Başvuruları
  await prisma.cVApplication.create({
    data: {
      name: 'Deniz Acar',
      email: 'deniz@email.com',
      phone: '05411234567',
      position: 'Satış Temsilcisi',
      cvText: '5 yıl perakende deneyimi, müşteri ilişkileri konusunda uzman...',
      status: 'PENDING'
    }
  })

  await prisma.cVApplication.create({
    data: {
      name: 'Selin Yıldırım',
      email: 'selin@email.com',
      phone: '05421234567',
      position: 'Teknik Destek Uzmanı',
      cvText: '3 yıl IT destek deneyimi, donanım ve yazılım konularında bilgili...',
      status: 'SHORTLISTED',
      aiScore: 85,
      aiAnalysis: 'Güçlü teknik bilgi, iletişim becerileri iyi. Pozisyon için uygun.'
    }
  })
  console.log('✅ CV Başvuruları oluşturuldu')

  // Giderler
  await prisma.expense.create({
    data: {
      description: 'Ofis kirası',
      amount: 25000,
      category: 'Kira'
    }
  })

  await prisma.expense.create({
    data: {
      description: 'Elektrik faturası',
      amount: 3500,
      category: 'Fatura'
    }
  })

  await prisma.expense.create({
    data: {
      description: 'Personel maaşları',
      amount: 158000,
      category: 'Maaş'
    }
  })
  console.log('✅ Giderler oluşturuldu')

  console.log('🎉 Seed tamamlandı!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })