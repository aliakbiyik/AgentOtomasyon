import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed başlıyor...')

  // Önce mevcut verileri temizle
  await prisma.orderItem.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.order.deleteMany()
  await prisma.ticket.deleteMany()
  await prisma.cVApplication.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.employee.deleteMany()

  console.log('✅ Eski veriler temizlendi')

  // Kategoriler
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Telefonlar', description: 'Akıllı telefonlar' } }),
    prisma.category.create({ data: { name: 'Bilgisayarlar', description: 'Laptop ve masaüstü' } }),
    prisma.category.create({ data: { name: 'Tabletler', description: 'Tablet cihazlar' } }),
    prisma.category.create({ data: { name: 'Aksesuarlar', description: 'Kulaklık, şarj aleti' } }),
    prisma.category.create({ data: { name: 'Giyilebilir Teknoloji', description: 'Akıllı saat' } }),
  ])
  console.log('✅ Kategoriler eklendi')

  // Ürünler
  const products = await Promise.all([
    // Telefonlar
    prisma.product.create({
      data: {
        name: 'iPhone 15 Pro Max',
        description: 'Apple iPhone 15 Pro Max, 256GB, Titanium Siyah. A17 Pro çip, 48MP kamera.',
        price: 84999.99,
        stock: 25,
        minStock: 5,
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
        categoryId: categories[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'iPhone 15',
        description: 'Apple iPhone 15, 128GB, Mavi. A16 Bionic çip, Dynamic Island.',
        price: 54999.99,
        stock: 40,
        minStock: 10,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
        categoryId: categories[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Samsung Galaxy S24 Ultra, 512GB. Snapdragon 8 Gen 3, 200MP kamera.',
        price: 79999.99,
        stock: 30,
        minStock: 8,
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
        categoryId: categories[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Samsung Galaxy S24',
        description: 'Samsung Galaxy S24, 256GB. Galaxy AI özellikleri, 50MP kamera.',
        price: 47999.99,
        stock: 35,
        minStock: 10,
        image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop',
        categoryId: categories[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Google Pixel 8 Pro',
        description: 'Google Pixel 8 Pro, 256GB. Tensor G3 çip, en iyi Android kamera.',
        price: 44999.99,
        stock: 3,
        minStock: 5,
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
        categoryId: categories[0].id
      }
    }),

    // Bilgisayarlar
    prisma.product.create({
      data: {
        name: 'MacBook Pro 14" M3 Pro',
        description: 'Apple MacBook Pro 14 inç, M3 Pro çip, 18GB RAM, 512GB SSD.',
        price: 89999.99,
        stock: 12,
        minStock: 3,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
        categoryId: categories[1].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'MacBook Air 15" M3',
        description: 'Apple MacBook Air 15 inç, M3 çip, 8GB RAM, 256GB SSD.',
        price: 54999.99,
        stock: 20,
        minStock: 5,
        image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop',
        categoryId: categories[1].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Dell XPS 15',
        description: 'Dell XPS 15, Intel Core i7, 16GB RAM, 512GB SSD, RTX 4050.',
        price: 62999.99,
        stock: 8,
        minStock: 3,
        image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop',
        categoryId: categories[1].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Lenovo ThinkPad X1 Carbon',
        description: 'Lenovo ThinkPad X1 Carbon Gen 11, Intel Core i7, 16GB RAM.',
        price: 54999.99,
        stock: 10,
        minStock: 3,
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
        categoryId: categories[1].id
      }
    }),

    // Tabletler
    prisma.product.create({
      data: {
        name: 'iPad Pro 12.9" M2',
        description: 'Apple iPad Pro 12.9 inç, M2 çip, 256GB, WiFi.',
        price: 47999.99,
        stock: 18,
        minStock: 5,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
        categoryId: categories[2].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'iPad Air',
        description: 'Apple iPad Air, M1 çip, 64GB, WiFi. 10.9 inç ekran.',
        price: 24999.99,
        stock: 25,
        minStock: 8,
        image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop',
        categoryId: categories[2].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Samsung Galaxy Tab S9 Ultra',
        description: 'Samsung Galaxy Tab S9 Ultra, 512GB. 14.6 inç AMOLED.',
        price: 42999.99,
        stock: 10,
        minStock: 3,
        image: 'https://images.unsplash.com/photo-1632882765546-1ee75f53becb?w=400&h=400&fit=crop',
        categoryId: categories[2].id
      }
    }),

    // Aksesuarlar
    prisma.product.create({
      data: {
        name: 'AirPods Pro 2',
        description: 'Apple AirPods Pro (2. nesil) USB-C. Aktif Gürültü Engelleme.',
        price: 9499.99,
        stock: 50,
        minStock: 15,
        image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop',
        categoryId: categories[3].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'AirPods Max',
        description: 'Apple AirPods Max, Space Gray. Yüksek kaliteli ses, ANC.',
        price: 18999.99,
        stock: 12,
        minStock: 3,
        image: 'https://images.unsplash.com/photo-1625245488600-f03fef636a3c?w=400&h=400&fit=crop',
        categoryId: categories[3].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Samsung Galaxy Buds2 Pro',
        description: 'Samsung Galaxy Buds2 Pro, Grafit. 24bit Hi-Fi ses.',
        price: 5999.99,
        stock: 40,
        minStock: 10,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop',
        categoryId: categories[3].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Apple MagSafe Şarj Aleti',
        description: 'Apple MagSafe Şarj Aleti, iPhone için kablosuz şarj.',
        price: 1499.99,
        stock: 100,
        minStock: 20,
        image: 'https://images.unsplash.com/photo-1622675363311-3e1904dc1885?w=400&h=400&fit=crop',
        categoryId: categories[3].id
      }
    }),

    // Giyilebilir Teknoloji
    prisma.product.create({
      data: {
        name: 'Apple Watch Ultra 2',
        description: 'Apple Watch Ultra 2, 49mm Titanium. GPS + Cellular.',
        price: 32999.99,
        stock: 15,
        minStock: 5,
        image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop',
        categoryId: categories[4].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Apple Watch Series 9',
        description: 'Apple Watch Series 9, 45mm. GPS, Kan oksijen, EKG.',
        price: 17999.99,
        stock: 30,
        minStock: 8,
        image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop',
        categoryId: categories[4].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Samsung Galaxy Watch 6 Classic',
        description: 'Samsung Galaxy Watch 6 Classic, 47mm. Döner çerçeve.',
        price: 12999.99,
        stock: 20,
        minStock: 5,
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop',
        categoryId: categories[4].id
      }
    }),
  ])
  console.log('✅ Ürünler eklendi')

  // Müşteriler
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Ahmet Yılmaz',
        email: 'ahmet@gmail.com',
        phone: '+905551234567',
        address: 'Atatürk Mah. Cumhuriyet Cad. No:15 Kadıköy/İstanbul',
        // password123 hash
        password: '$2a$10$X7.1.i.J.K.L.M.N.O.P.Q.R.S.T.U.V.W.X.Y.Z.0.1.2.3.4.5'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Ayşe Demir',
        email: 'ayse@gmail.com',
        phone: '+905557654321',
        address: 'Çankaya Mah. Ziya Gökalp Cad. No:8 Çankaya/Ankara',
        // password123 hash
        password: '$2a$10$X7.1.i.J.K.L.M.N.O.P.Q.R.S.T.U.V.W.X.Y.Z.0.1.2.3.4.5'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Elif Demir',
        email: 'elif@gmail.com',
        phone: '+905559876543',
        address: 'Bahçelievler Mah. Gül Sok. No:8 Çankaya/Ankara',
        // password123 hash
        password: '$2a$10$X7.1.i.J.K.L.M.N.O.P.Q.R.S.T.U.V.W.X.Y.Z.0.1.2.3.4.5'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Mehmet Kaya',
        email: 'mehmet@gmail.com',
        phone: '+905553456789',
        address: 'Alsancak Mah. Kordon Cad. No:42 Konak/İzmir',
        // password123 hash
        password: '$2a$10$X7.1.i.J.K.L.M.N.O.P.Q.R.S.T.U.V.W.X.Y.Z.0.1.2.3.4.5'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Zeynep Aksoy',
        email: 'zeynep@gmail.com',
        phone: '+905557891234',
        address: 'Nilüfer Mah. Park Sok. No:23 Nilüfer/Bursa',
        // password123 hash
        password: '$2a$10$X7.1.i.J.K.L.M.N.O.P.Q.R.S.T.U.V.W.X.Y.Z.0.1.2.3.4.5'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Ali Akbıyık',
        email: 'ali@gmail.com',
        phone: '+905522699693',
        address: 'Kızılay Mah. Atatürk Blv. No:100 Çankaya/Ankara',
        // password123 hash
        password: '$2a$10$X7.1.i.J.K.L.M.N.O.P.Q.R.S.T.U.V.W.X.Y.Z.0.1.2.3.4.5'
      }
    }),
  ])
  console.log('✅ Müşteriler eklendi')

  // Çalışanlar (startDate yerine hireDate kullanıyoruz)
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        name: 'Fatma Şahin',
        email: 'fatma@techstore.com',
        phone: '+905551111111',
        department: 'Satış',
        position: 'Satış Müdürü',
        salary: 45000,
        hireDate: new Date('2022-01-15')
      }
    }),
    prisma.employee.create({
      data: {
        name: 'Burak Öztürk',
        email: 'burak@techstore.com',
        phone: '+905552222222',
        department: 'Depo',
        position: 'Depo Sorumlusu',
        salary: 32000,
        hireDate: new Date('2022-06-01')
      }
    }),
    prisma.employee.create({
      data: {
        name: 'Selin Yıldız',
        email: 'selin@techstore.com',
        phone: '+905553333333',
        department: 'İnsan Kaynakları',
        position: 'İK Uzmanı',
        salary: 38000,
        hireDate: new Date('2023-02-01')
      }
    }),
    prisma.employee.create({
      data: {
        name: 'Emre Çelik',
        email: 'emre@techstore.com',
        phone: '+905554444444',
        department: 'Teknik Destek',
        position: 'Destek Uzmanı',
        salary: 35000,
        hireDate: new Date('2023-05-15')
      }
    }),
    prisma.employee.create({
      data: {
        name: 'Ayşe Korkmaz',
        email: 'ayse@techstore.com',
        phone: '+905555555555',
        department: 'Muhasebe',
        position: 'Muhasebe Uzmanı',
        salary: 40000,
        hireDate: new Date('2022-09-01')
      }
    }),
  ])
  console.log('✅ Çalışanlar eklendi')

  // Siparişler (shippingAddress kaldırıldı, PROCESSING yerine CONFIRMED)
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024001',
      customerId: customers[0].id,
      status: 'DELIVERED',
      totalAmount: 84999.99,
      items: {
        create: [
          { productId: products[0].id, quantity: 1, price: 84999.99 }
        ]
      }
    }
  })

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024002',
      customerId: customers[1].id,
      status: 'SHIPPED',
      totalAmount: 64499.98,
      items: {
        create: [
          { productId: products[5].id, quantity: 1, price: 54999.99 },
          { productId: products[12].id, quantity: 1, price: 9499.99 }
        ]
      }
    }
  })

  const order3 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024003',
      customerId: customers[2].id,
      status: 'CONFIRMED',
      totalAmount: 79999.99,
      items: {
        create: [
          { productId: products[2].id, quantity: 1, price: 79999.99 }
        ]
      }
    }
  })

  const order4 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024004',
      customerId: customers[3].id,
      status: 'PENDING',
      totalAmount: 32499.97,
      items: {
        create: [
          { productId: products[10].id, quantity: 1, price: 24999.99 },
          { productId: products[15].id, quantity: 1, price: 1499.99 },
          { productId: products[14].id, quantity: 1, price: 5999.99 }
        ]
      }
    }
  })

  const order5 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024005',
      customerId: customers[4].id,
      status: 'DELIVERED',
      totalAmount: 50999.98,
      items: {
        create: [
          { productId: products[16].id, quantity: 1, price: 32999.99 },
          { productId: products[17].id, quantity: 1, price: 17999.99 }
        ]
      }
    }
  })
  console.log('✅ Siparişler eklendi')

  // Faturalar
  await Promise.all([
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2024001',
        orderId: order1.id,
        amount: 84999.99,
        taxAmount: 15299.99,
        totalAmount: 100299.98,
        status: 'PAID',
        paidAt: new Date('2024-12-15')
      }
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2024002',
        orderId: order2.id,
        amount: 64499.98,
        taxAmount: 11609.99,
        totalAmount: 76109.97,
        status: 'PENDING'
      }
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2024003',
        orderId: order3.id,
        amount: 79999.99,
        taxAmount: 14399.99,
        totalAmount: 94399.98,
        status: 'PENDING'
      }
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2024005',
        orderId: order5.id,
        amount: 50999.98,
        taxAmount: 9179.99,
        totalAmount: 60179.97,
        status: 'PAID',
        paidAt: new Date('2024-12-18')
      }
    }),
  ])
  console.log('✅ Faturalar eklendi')

  // Destek Talepleri
  await Promise.all([
    prisma.ticket.create({
      data: {
        ticketNumber: 'TKT-2024001',
        customerId: customers[0].id,
        subject: 'iPhone ekran sorunu',
        description: 'Aldığım iPhone 15 Pro Max ekranında sarı leke var. Değişim istiyorum.',
        status: 'OPEN',
        priority: 'HIGH'
      }
    }),
    prisma.ticket.create({
      data: {
        ticketNumber: 'TKT-2024002',
        customerId: customers[1].id,
        subject: 'Kargo gecikmesi',
        description: 'Siparişim 5 gündür gelmedi, kargo takip numarası güncellenmiyor.',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        assignedToId: employees[3].id,
        aiSuggestion: 'Kargo firması ile iletişime geçilmeli, müşteriye güncel durum bildirilmeli.'
      }
    }),
    prisma.ticket.create({
      data: {
        ticketNumber: 'TKT-2024003',
        customerId: customers[2].id,
        subject: 'Fatura talebi',
        description: 'Kurumsal fatura almak istiyorum, şirket bilgilerimi nasıl ekleyebilirim?',
        status: 'RESOLVED',
        priority: 'LOW',
        assignedToId: employees[4].id,
        aiSuggestion: 'Müşteriye kurumsal fatura prosedürü açıklanmalı.'
      }
    }),
  ])
  console.log('✅ Destek talepleri eklendi')

  // CV Başvuruları (aiEvaluation yerine aiScore ve aiAnalysis)
  await Promise.all([
    prisma.cVApplication.create({
      data: {
        name: 'Deniz Yılmaz',
        email: 'deniz@gmail.com',
        phone: '+905556667788',
        position: 'Yazılım Geliştirici',
        cvText: 'Bilgisayar Mühendisliği mezunuyum. 3 yıl React ve Node.js deneyimim var.',
        status: 'PENDING'
      }
    }),
    prisma.cVApplication.create({
      data: {
        name: 'Ceren Aksoy',
        email: 'ceren@gmail.com',
        phone: '+905559998877',
        position: 'Satış Temsilcisi',
        cvText: 'İşletme mezunuyum. 5 yıl perakende satış deneyimim var.',
        status: 'REVIEWED',
        aiScore: 75,
        aiAnalysis: 'Satış deneyimi güçlü, dil bilgisi artı. Teknoloji sektörü deneyimi eksik.'
      }
    }),
    prisma.cVApplication.create({
      data: {
        name: 'Kaan Demir',
        email: 'kaan@gmail.com',
        phone: '+905551112233',
        position: 'Depo Sorumlusu',
        cvText: 'Lojistik bölümü mezunuyum. 4 yıl depo yönetimi deneyimim var.',
        status: 'PENDING'
      }
    }),
  ])
  console.log('✅ CV başvuruları eklendi')

  // Bildirimler
  await Promise.all([
    prisma.notification.create({
      data: {
        type: 'CRITICAL_STOCK',
        title: 'Kritik Stok Uyarısı',
        message: 'Google Pixel 8 Pro stoğu kritik seviyede (3 adet)',
        isRead: false
      }
    }),
    prisma.notification.create({
      data: {
        type: 'NEW_ORDER',
        title: 'Yeni Sipariş',
        message: 'ORD-2024004 numaralı yeni sipariş alındı',
        isRead: true
      }
    }),
  ])
  console.log('✅ Bildirimler eklendi')

  console.log('')
  console.log('🎉 Seed tamamlandı!')
  console.log('')
  console.log('📊 Özet:')
  console.log(`   - ${categories.length} kategori`)
  console.log(`   - ${products.length} ürün`)
  console.log(`   - ${customers.length} müşteri`)
  console.log(`   - ${employees.length} çalışan`)
  console.log(`   - 5 sipariş`)
  console.log(`   - 4 fatura`)
  console.log(`   - 3 destek talebi`)
  console.log(`   - 3 CV başvurusu`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })