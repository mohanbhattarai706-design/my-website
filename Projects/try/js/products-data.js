const products = [
  {
    id: "ginger",
    name: "Ginger",
    category: "root",
    categoryLabel: "Root",
    desc: "Premium quality fresh ginger with a bold, spicy aroma. Hand-selected from top-grade farms in China. Perfect for culinary, beverage, and medicinal use. Available year-round in bulk quantities.",
    origin: "China",
    img: "Pictures demo/Ginger.avif",
    extraImgs: [
      "Pictures demo/Ginger 1.avif",
      "Pictures demo/Ginger 2.jpeg"
    ],
    specs: {
      "Form": "Whole Root",
      "Origin": "China",
      "Grade": "Premium",
      "Season": "Year Round (Peak: Oct – Jan)"
    }
  },
  {
    id: "garlic",
    name: "Garlic",
    category: "root",
    categoryLabel: "Root",
    desc: "Firm, full-flavored garlic bulbs with tight skins and intense aroma. Excellent shelf life makes them ideal for wholesale distribution to retailers and food processors.",
    origin: "China",
    img: "Pictures demo/Garlic.png",
    extraImgs: [
      "Pictures demo/Garlic 1.jpeg",
      "Pictures demo/Garlic 2.png"
    ],
    specs: {
      "Form": "Whole Bulb",
      "Origin": "China",
      "Grade": "Grade A",
      "Season": "Year Round (Peak: Jun – Sep)"
    }
  },
  {
    id: "peeled-garlic",
    name: "Peeled Garlic",
    category: "root",
    categoryLabel: "Root",
    desc: "Ready-to-use peeled garlic cloves, cleaned and available vacuum sealed or jarred for maximum freshness. Saves prep time while delivering the same bold flavor.",
    origin: "China",
    img: "Pictures demo/Peeled Garlic.png",
    extraImgs: [
      "Pictures demo/Peeled Garlic 1.png",
      "Pictures demo/Peeled Garlic 2.jpeg"
    ],
    specs: {
      "Form": "Peeled Cloves",
      "Origin": "China",
      "Packaging": "Vacuum Sealed or Jarred",
      "Season": "Year Round (Peak: Jun – Sep)"
    }
  },
  {
    id: "asian-pears",
    name: "Yellow Asian Pears",
    category: "fruit",
    categoryLabel: "Fruit",
    desc: "Crisp, apple-like texture with a delicate floral sweetness. Yellow Asian pears are prized in East Asian markets and premium retail. Each piece is individually graded for size and quality.",
    origin: "China",
    img: "Pictures demo/Asian Pears.png",
    extraImgs: [
      "Pictures demo/Asian Pears 1.png",
      "Pictures demo/Asian Pears 2.jpeg"
    ],
    specs: {
      "Variety": "Yellow Asian",
      "Origin": "China",
       "Grade": "Premium",
      "Season": "Year Round (Peak: Sep – Dec)"
    }
  },
  {
    id: "Brown Asian Pears",
    name: "Brown Asian Pears",
    category: "fruit",
    categoryLabel: "Fruit",
    desc: "The brown Asian pear stands out with its amber skin and crisp texture reminiscent of an apple. Its white, juicy, and delicately sweet flesh offers a refreshing experience — perfect as a snack, in salads, or paired with savoury dishes. High in fiber and low in calories, it combines indulgence and wellness in an elegant fruit. Harvested at peak ripeness, it embodies the freshness of Asian tradition.",
    origin: "China",
    img: "Pictures demo/Nashi Pears.jpg",
    extraImgs: [
      "Pictures demo/Nashi pears 1.jpeg",
      "Pictures demo/Nashi Pears 2.jpeg"
    ],
    specs: {
      "Variety": "Brown Asian",
      "Origin": "China",
       "Grade": "Premium",
      "Season": "Year Round (Peak: Sep – Dec)"
    }
  },
  {
    id: "fuji-apple",
    name: "Fuji Apple",
    category: "fruit",
    categoryLabel: "Fruit",
    desc: "World-renowned Fuji apples — extra crisp with a balanced sweet-tart profile. One of the most sought-after apple varieties globally, with consistent size and brilliant coloring.",
    origin: "China",
    img: "Pictures demo/fuji apple.jpeg",
    extraImgs: [
      "Pictures demo/fuji apple 1.jpeg",
      "Pictures demo/fuji apple 2.jpeg",
      "Pictures demo/fuji apple 3.png"
    ],
    specs: {
      "Variety": "Fuji",
      "Origin": "China",
      "Grade": "Class 1",
      "Season": "Year Round (Peak: Oct – Dec)"
    }
  },
  {
    id: "honey-pomelo",
    name: "Honey Pomelo",
    category: "fruit",
    categoryLabel: "Fruit",
    desc: "Large, fragrant honey pomelos with a mild sweetness and minimal bitterness. A celebration fruit beloved across Asia and increasingly popular in North American specialty markets.",
    origin: "China",
    img: "Pictures demo/honey pomelo.png",
    extraImgs: [
      "Pictures demo/honey pomelo 1.png"
    ],
    specs: {
      "Type": "Honey",
      "Origin": "China",
       "Grade": "Premium",
      "Season": "Seasonal (Sep – Feb, Peak: Nov – Jan)"
    }
  },
  {
    id: "3-red-pomelo",
    name: "3 Red Pomelo",
    category: "fruit",
    categoryLabel: "Fruit",
    desc: "A curated triple-variety red pomelo selection offering vibrant ruby flesh, rich flavor, and stunning presentation. Ideal for premium retail and gift markets.",
    origin: "China",
    img: "Pictures demo/3 Red Pomelo.png",
    extraImgs: [
      "Pictures demo/3 Red Pomelo 1.png"
    ],
    specs: {
      "Type": "3-Variety Red",
      "Origin": "China",
      "Presentation": "Premium Pack",
      "Season": "Seasonal (Sep – Feb, Peak: Nov – Jan)"
    }
  },
  {
    id: "red-pomelo",
    name: "Red Pomelo",
    category: "fruit",
    categoryLabel: "Fruit",
    desc: "Vibrant red-fleshed pomelo with a rich, sweet-tangy taste. The striking ruby interior makes it a standout on premium retail shelves and an excellent gifting fruit.",
    origin: "China",
    img: "Pictures demo/Red Pomelo.jpeg",
    extraImgs: [
      "Pictures demo/Red Pomelo 1.png"
    ],
    specs: {
      "Type": "Red Flesh",
      "Origin": "China",
      "Grade": "Premium",
      "Season": "Seasonal (Sep – Feb, Peak: Nov – Jan)"
    }
  },
  {
    id: "carrots",
    name: "Carrots",
    category: "root",
    categoryLabel: "Root",
    desc: "Crisp, vibrant orange carrots with a naturally sweet flavor. Consistently sized and washed, ready for retail display or direct food service. Available year-round.",
    origin: "China",
    img: "Pictures demo/Carrot.png",
    extraImgs: [
      "Pictures demo/Carrot 1.jpeg"
    ],
    specs: {
      "Type": "Orange",
      "Origin": "China",
      "Form": "Whole / Washed",
      "Season": "Year Round"
    }
  },
  {
    id: "indian-carrots",
    name: "Indian Carrots",
    category: "root",
    categoryLabel: "Root",
    desc: "Deep-red Indian variety carrots with an intensely sweet flavor and rich color. Highly sought in South Asian grocery retail and specialty markets across Canada.",
    origin: "China",
    img: "Pictures demo/Carrot Indian.png",
    extraImgs: [
      "Pictures demo/Carrot Indian 1.jpeg"
    ],
    specs: {
      "Type": "Indian Variety",
      "Origin": "China",
      "Grade": "Premium",
      "Season": "Year Round"
    }
  },
  {
    id: "purple-sweet-potatoes",
    name: "Purple Sweet Potatoes",
    category: "root",
    categoryLabel: "Root",
    desc: "Visually stunning purple sweet potatoes with an earthy sweetness and anthocyanin-rich violet flesh. Strong demand in health food and specialty retail markets.",
    origin: "China",
    img: "Pictures demo/Purple Sweet Potatoes.png",
    extraImgs: [
      "Pictures demo/Purple Sweet Potatoes 1.png"
    ],
    specs: {
      "Type": "Purple",
      "Origin": "China",
      "Grade": "Premium",
      "Season": "Year Round (Peak: Sep – Nov)"
    }
  },
  {
    id: "snap-peas",
    name: "Snap Peas",
    category: "vegetable",
    categoryLabel: "Vegetable",
    desc: "Plump, crunchy snap peas with a sweet flavor. Eaten whole, pod and all — a favourite in fresh produce aisles and restaurant kitchens across Canada.",
    origin: "China",
    img: "Pictures demo/Snap Peas.png",
    extraImgs: [
      "Pictures demo/Snap Peas 1.jpeg"
    ],
    specs: {
      "Type": "Snap Pea",
      "Origin": "China",
       "Grade": "Premium",
      "Season": "Year Round (Oct - Jan)"
    }
  },
  {
    id: "snow-peas",
    name: "Snow Peas",
    category: "vegetable",
    categoryLabel: "Vegetable",
    desc: "Flat, tender snow peas with a delicate sweet flavor. A staple in Asian stir-fry cuisine and increasingly popular in North American fresh produce sections.",
    origin: "China",
    img: "Pictures demo/Snow Peas.jpeg",
    extraImgs: [
      "Pictures demo/Snow Peas 1.jpeg",
      "Pictures demo/Snow Peas 2.png"
    ],
    specs: {
      "Type": "Snow Pea",
      "Origin": "China",
       "Grade": "Premium",
      "Season": "Year Round (Oct - Jan)"
    }
  },
  {
    id: "shallots",
    name: "Shallots",
    category: "root",
    categoryLabel: "Root",
    desc: "Premium shallots with a mild, sweet onion flavor and subtle garlic notes. Highly valued in gourmet cooking, sauces, and fine dining kitchens across Canada.",
    origin: "China",
    img: "Pictures demo/Shallots.jpeg",
    extraImgs: [
      "Pictures demo/Shallots 1.png"
    ],
    specs: {
      "Type": "Red Shallot",
      "Origin": "China",
      "Grade": "Premium",
      "Season": "Year Round (Peak: Jun – Sep)"
    }
  }
];
