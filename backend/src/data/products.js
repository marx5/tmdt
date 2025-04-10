const products = [
  {
    name: 'Áo Hoodie Nỉ Bông Unisex',
    image: '/images/hoodie.jpg',
    images: [
      '/images/hoodie-1.jpg',
      '/images/hoodie-2.jpg',
      '/images/hoodie-3.jpg'
    ],
    description: 'Áo hoodie chất liệu nỉ bông mềm mại, giữ ấm tốt, phù hợp cả nam và nữ. Phong cách thời trang đường phố.',
    brand: 'Local Brand',
    category: 'Clothing',
    price: 640000,
    countInStock: 15,
    rating: 4.6,
    numReviews: 18,
    colors: [
      {
        name: 'Đen',
        code: '#000000',
        sizes: [
          { size: 'S', quantity: 5 },
          { size: 'M', quantity: 5 },
          { size: 'L', quantity: 5 }
        ]
      },
      {
        name: 'Xám',
        code: '#808080',
        sizes: [
          { size: 'S', quantity: 3 },
          { size: 'M', quantity: 3 },
          { size: 'L', quantity: 3 }
        ]
      }
    ],
    isFeatured: true,
    discount: 10,
    tags: ['hoodie', 'unisex', 'winter', 'casual'],
    specifications: {
      'Chất liệu': 'Nỉ bông 100%',
      'Xuất xứ': 'Việt Nam',
      'Bảo hành': '6 tháng'
    }
  },
  {
    name: 'Áo Thun Form Rộng Tay Lỡ',
    image: '/images/tshirt.jpg',
    images: [
      '/images/tshirt-1.jpg',
      '/images/tshirt-2.jpg',
      '/images/tshirt-3.jpg'
    ],
    description: 'Áo thun unisex form rộng, tay lỡ, cotton 100% thấm hút mồ hôi, thoải mái khi mặc hằng ngày.',
    brand: 'Genz Wear',
    category: 'Clothing',
    price: 370000,
    countInStock: 20,
    rating: 4.3,
    numReviews: 22,
    colors: [
      {
        name: 'Trắng',
        code: '#FFFFFF',
        sizes: [
          { size: 'S', quantity: 7 },
          { size: 'M', quantity: 7 },
          { size: 'L', quantity: 6 }
        ]
      }
    ],
    isFeatured: false,
    discount: 0,
    tags: ['tshirt', 'unisex', 'summer', 'basic'],
    specifications: {
      'Chất liệu': 'Cotton 100%',
      'Xuất xứ': 'Việt Nam',
      'Bảo hành': '3 tháng'
    }
  },
  {
    name: 'Quần Jean Ống Rộng Nữ Lưng Cao',
    image: '/images/jeans.jpg',
    images: [
      '/images/jeans-1.jpg',
      '/images/jeans-2.jpg',
      '/images/jeans-3.jpg'
    ],
    description: 'Quần jean nữ lưng cao, ống rộng tôn dáng, chất vải không co giãn, dễ phối đồ.',
    brand: 'Hàn Fashion',
    category: 'Clothing',
    price: 710000,
    countInStock: 10,
    rating: 4.8,
    numReviews: 30,
    colors: [
      {
        name: 'Xanh Đậm',
        code: '#000080',
        sizes: [
          { size: '28', quantity: 3 },
          { size: '29', quantity: 3 },
          { size: '30', quantity: 4 }
        ]
      },
      {
        name: 'Xanh Nhạt',
        code: '#87CEEB',
        sizes: [
          { size: '28', quantity: 2 },
          { size: '29', quantity: 2 },
          { size: '30', quantity: 2 }
        ]
      }
    ],
    isFeatured: true,
    discount: 15,
    tags: ['jeans', 'women', 'fashion', 'casual'],
    specifications: {
      'Chất liệu': 'Denim 100%',
      'Xuất xứ': 'Hàn Quốc',
      'Bảo hành': '6 tháng'
    }
  },
  {
    name: 'Áo Khoác Bomber Cổ Điển',
    image: '/images/bomber.jpg',
    images: [
      '/images/bomber-1.jpg',
      '/images/bomber-2.jpg',
      '/images/bomber-3.jpg'
    ],
    description: 'Áo bomber thời trang với thiết kế cổ điển, lớp vải dày dặn giữ ấm tốt, phù hợp mùa lạnh.',
    brand: 'Coolmate',
    category: 'Clothing',
    price: 860000,
    countInStock: 9,
    rating: 4.7,
    numReviews: 14,
    colors: [
      {
        name: 'Đen',
        code: '#000000',
        sizes: [
          { size: 'M', quantity: 3 },
          { size: 'L', quantity: 3 },
          { size: 'XL', quantity: 3 }
        ]
      }
    ],
    isFeatured: true,
    discount: 20,
    tags: ['jacket', 'unisex', 'winter', 'fashion'],
    specifications: {
      'Chất liệu': 'Polyester 100%',
      'Xuất xứ': 'Việt Nam',
      'Bảo hành': '12 tháng'
    }
  },
  {
    name: 'Quần Short Thể Thao Unisex',
    image: '/images/shorts.jpg',
    images: [
      '/images/shorts-1.jpg',
      '/images/shorts-2.jpg',
      '/images/shorts-3.jpg'
    ],
    description: 'Quần short thể thao co giãn, thoáng khí, thích hợp vận động và mặc ở nhà.',
    brand: 'Nike',
    category: 'Clothing',
    price: 490000,
    countInStock: 12,
    rating: 4.5,
    numReviews: 16,
    colors: [
      {
        name: 'Xanh Navy',
        code: '#000080',
        sizes: [
          { size: 'S', quantity: 4 },
          { size: 'M', quantity: 4 },
          { size: 'L', quantity: 4 }
        ]
      },
      {
        name: 'Đen',
        code: '#000000',
        sizes: [
          { size: 'S', quantity: 3 },
          { size: 'M', quantity: 3 },
          { size: 'L', quantity: 3 }
        ]
      }
    ],
    isFeatured: false,
    discount: 0,
    tags: ['shorts', 'sport', 'unisex', 'summer'],
    specifications: {
      'Chất liệu': 'Polyester 85%, Spandex 15%',
      'Xuất xứ': 'Thái Lan',
      'Bảo hành': '6 tháng'
    }
  },
  {
    name: 'Áo Sơ Mi Trắng Cổ Đức',
    image: '/images/shirt.jpg',
    images: [
      '/images/shirt-1.jpg',
      '/images/shirt-2.jpg',
      '/images/shirt-3.jpg'
    ],
    description: 'Áo sơ mi trắng cổ đức, thiết kế đơn giản lịch sự, phù hợp công sở hoặc đi học.',
    brand: 'Routine',
    category: 'Clothing',
    price: 560000,
    countInStock: 5,
    rating: 4.2,
    numReviews: 10,
    colors: [
      {
        name: 'Trắng',
        code: '#FFFFFF',
        sizes: [
          { size: 'S', quantity: 2 },
          { size: 'M', quantity: 2 },
          { size: 'L', quantity: 1 }
        ]
      }
    ],
    isFeatured: false,
    discount: 0,
    tags: ['shirt', 'formal', 'office'],
    specifications: {
      'Chất liệu': 'Cotton 100%',
      'Xuất xứ': 'Việt Nam',
      'Bảo hành': '3 tháng'
    }
  },
  {
    name: 'Áo Khoác Dù Unisex Chống Nước',
    image: '/images/windbreaker.jpg',
    images: [
      '/images/windbreaker-1.jpg',
      '/images/windbreaker-2.jpg',
      '/images/windbreaker-3.jpg'
    ],
    description: 'Áo khoác dù nhẹ, chống gió và nước nhẹ, có mũ trùm, thích hợp cho đi phượt hoặc thể thao.',
    brand: 'Highland',
    category: 'Clothing',
    price: 740000,
    countInStock: 8,
    rating: 4.4,
    numReviews: 11,
    colors: [
      {
        name: 'Xanh Navy',
        code: '#000080',
        sizes: [
          { size: 'M', quantity: 3 },
          { size: 'L', quantity: 3 },
          { size: 'XL', quantity: 2 }
        ]
      },
      {
        name: 'Đen',
        code: '#000000',
        sizes: [
          { size: 'M', quantity: 2 },
          { size: 'L', quantity: 2 },
          { size: 'XL', quantity: 2 }
        ]
      }
    ],
    isFeatured: false,
    discount: 0,
    tags: ['jacket', 'unisex', 'raincoat', 'sport'],
    specifications: {
      'Chất liệu': 'Polyester 100%',
      'Xuất xứ': 'Việt Nam',
      'Bảo hành': '12 tháng'
    }
  },
  {
    name: 'Áo Croptop Gân Body Nữ',
    image: '/images/croptop.jpg',
    description: 'Áo croptop nữ ôm body, chất liệu gân co giãn nhẹ, tôn dáng và dễ phối đồ mùa hè.',
    brand: 'Basic Chic',
    category: 'Clothing',
    price: 320000,
    countInStock: 14,
    rating: 4.6,
    numReviews: 17,
    colors: [
      {
        name: 'Đen',
        code: '#000000',
        sizes: [
          { size: 'S', quantity: 5 },
          { size: 'M', quantity: 5 },
          { size: 'L', quantity: 4 }
        ]
      },
      {
        name: 'Trắng',
        code: '#FFFFFF',
        sizes: [
          { size: 'S', quantity: 4 },
          { size: 'M', quantity: 4 },
          { size: 'L', quantity: 3 }
        ]
      }
    ],
    isFeatured: false,
    discount: 0,
    tags: ['croptop', 'women', 'summer', 'fashion'],
    specifications: {
      'Chất liệu': 'Cotton 95%, Spandex 5%',
      'Xuất xứ': 'Việt Nam',
      'Bảo hành': '3 tháng'
    }
  },
  {
    name: 'Váy Baby Doll Tay Phồng',
    image: '/images/babydoll.jpg',
    description: 'Váy babydoll dễ thương, chất vải đũi mát mẻ, tay phồng cổ vuông, thích hợp đi chơi, đi tiệc.',
    brand: 'Dollie',
    category: 'Clothing',
    price: 660000,
    countInStock: 6,
    rating: 4.8,
    numReviews: 13,
    colors: [
      {
        name: 'Hồng',
        code: '#FFC0CB',
        sizes: [
          { size: 'S', quantity: 2 },
          { size: 'M', quantity: 2 },
          { size: 'L', quantity: 2 }
        ]
      },
      {
        name: 'Xanh Mint',
        code: '#98FF98',
        sizes: [
          { size: 'S', quantity: 1 },
          { size: 'M', quantity: 1 },
          { size: 'L', quantity: 1 }
        ]
      }
    ],
    isFeatured: false,
    discount: 0,
    tags: ['dress', 'women', 'party', 'summer'],
    specifications: {
      'Chất liệu': 'Đũi 100%',
      'Xuất xứ': 'Việt Nam',
      'Bảo hành': '3 tháng'
    }
  },
  {
    name: 'Áo Polo Nam Classic Fit',
    image: '/images/polo.jpg',
    description: 'Áo polo nam cổ điển, chất liệu cotton thoáng mát, phù hợp đi làm và dạo phố.',
    brand: 'Polo Basic',
    category: 'Clothing',
    price: 540000,
    countInStock: 18,
    rating: 4.5,
    numReviews: 15,
    colors: [
      {
        name: 'Xanh Navy',
        code: '#000080',
        sizes: [
          { size: 'M', quantity: 6 },
          { size: 'L', quantity: 6 },
          { size: 'XL', quantity: 6 }
        ]
      },
      {
        name: 'Trắng',
        code: '#FFFFFF',
        sizes: [
          { size: 'M', quantity: 5 },
          { size: 'L', quantity: 5 },
          { size: 'XL', quantity: 5 }
        ]
      }
    ],
    isFeatured: false,
    discount: 0,
    tags: ['polo', 'men', 'formal', 'casual'],
    specifications: {
      'Chất liệu': 'Cotton 100%',
      'Xuất xứ': 'Việt Nam',
      'Bảo hành': '3 tháng'
    }
  },
  {
    name: 'Áo Len Cổ Lọ Mùa Đông',
    image: '/images/sweater.jpg',
    description: 'Áo len cổ lọ giữ ấm tốt, chất len mịn không ngứa, thiết kế Hàn Quốc thời trang.',
    brand: 'Winter Mood',
    category: 'Clothing',
    price: 810000,
    countInStock: 7,
    rating: 4.7,
    numReviews: 12,
    colors: [
      {
        name: 'Xám',
        code: '#808080',
        sizes: [
          { size: 'M', quantity: 3 },
          { size: 'L', quantity: 3 },
          { size: 'XL', quantity: 1 }
        ]
      },
      {
        name: 'Be',
        code: '#F5F5DC',
        sizes: [
          { size: 'M', quantity: 2 },
          { size: 'L', quantity: 2 },
          { size: 'XL', quantity: 1 }
        ]
      }
    ],
    isFeatured: false,
    discount: 0,
    tags: ['sweater', 'unisex', 'winter', 'fashion'],
    specifications: {
      'Chất liệu': 'Len 100%',
      'Xuất xứ': 'Hàn Quốc',
      'Bảo hành': '6 tháng'
    }
  },
  {
    name: 'Quần Jogger Kaki Unisex',
    image: '/images/jogger.jpg',
    description: 'Quần jogger kaki ống bo, phù hợp đi chơi hoặc tập thể thao, có túi kéo tiện lợi.',
    brand: 'Urban Street',
    category: 'Clothing',
    price: 610000,
    countInStock: 13,
    rating: 4.4,
    numReviews: 9,
    colors: [
      {
        name: 'Xám',
        code: '#808080',
        sizes: [
          { size: 'S', quantity: 4 },
          { size: 'M', quantity: 4 },
          { size: 'L', quantity: 4 }
        ]
      },
      {
        name: 'Đen',
        code: '#000000',
        sizes: [
          { size: 'S', quantity: 3 },
          { size: 'M', quantity: 3 },
          { size: 'L', quantity: 3 }
        ]
      }
    ],
    isFeatured: false,
    discount: 0,
    tags: ['jogger', 'unisex', 'sport', 'casual'],
    specifications: {
      'Chất liệu': 'Kaki 100%',
      'Xuất xứ': 'Việt Nam',
      'Bảo hành': '6 tháng'
    }
  }
];

export default products;
