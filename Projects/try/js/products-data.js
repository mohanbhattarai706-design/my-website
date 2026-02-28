const products = [
  {
    id: "ginger",
    name: "Ginger",
    category: "vegetable",
    categoryLabel: "Root Vegetable",
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
      "Season": "Year Round",
      "Min. Order": "10 kg"
    }
  },
  {
    id: "garlic",
    name: "Garlic",
    category: "vegetable",
    categoryLabel: "Root Vegetable",
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
      "Season": "Year Round",
      "Min. Order": "20 kg"
    }
  },
  {
    id: "peeled-garlic",
    name: "Peeled Garlic",
    category: "vegetable",
    categoryLabel: "Processed Vegetable",
    desc: "Ready-to-use peeled garlic cloves, cleaned and vacuum-packed for maximum freshness. Saves prep time while delivering the same bold flavor.",
    origin: "China",
    img: "Pictures demo/Peeled Garlic.png",
    extraImgs: [
      "Pictures demo/Peeled Garlic 1.png",
      "Pictures demo/Peeled Garlic 2.jpeg"
    ],
    specs: {
      "Form": "Peeled Cloves",
      "Origin": "China",
      "Packaging": "Vacuum Sealed",
      "Season": "Year Round",
      "Min. Order": "5 kg"
    }
  },
  {
    id: "asian-pears",
    name: "Asian Pears",
    category: "fruit",
    categoryLabel: "Exotic Fruit",
    desc: "Crisp, apple-like texture with a delicate floral sweetness. Asian pears are prized in East Asian markets and premium retail. Each piece is individually graded for size and quality.",
    origin: "China",
    img: "Pictures demo/Asian Pears.png",
    extraImgs: [
      "Pictures demo/Asian Pears 1.png",
      "Pictures demo/Asian Pears 2.jpeg"
    ],
    specs: {
      "Variety": "Asian",
      "Origin": "China",
      "Grade": "Export Grade",
      "Season": "Year Round",
      "Min. Order": "15 kg"
    }
  },
  {
    id: "nashi-brown-pears",
    name: "Nashi Brown Pears",
    category: "fruit",
    categoryLabel: "Exotic Fruit",
    desc: "The brown Asian pear, also known as golden nashi, stands out with its amber skin and crisp texture reminiscent of an apple. Its white, juicy, and delicately sweet flesh offers a refreshing experience—perfect as a snack, in salads, or paired with savoury dishes. High in fiber and low in calories, it combines indulgence and wellness in an elegant, exotic fruit. Harvested at peak ripeness, it embodies the freshness and finesse of Asian tradition.",
    origin: "China",
    img: "Pictures demo/Nashi Pears.jpg",
    extraImgs: [
    "Pictures demo/Nashi pears 1.jpeg",
    "Pictures demo/Nashi Pears 2.jpeg"
    ],
    specs: {
      "Variety": "Asian",
      "Origin": "China",
      "Grade": "Export Grade",
      "Season": "Year Round",
      "Min. Order": "15 kg"
    }
  },
  {
    id: "fuji-apple",
    name: "Fuji Apple",
    category: "fruit",
    categoryLabel: "Fresh Fruit",
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
      "Season": "Year Round",
      "Min. Order": "20 kg"
    }
  },
  {
    id: "honey-pomelo",
    name: "Honey Pomelo",
    category: "fruit",
    categoryLabel: "Citrus Fruit",
    desc: "Large, fragrant honey pomelos with a mild sweetness and minimal bitterness. A celebration fruit beloved across Asia and increasingly popular in North American specialty markets.",
    origin: "China",
    img: "Pictures demo/honey pomelo.png",
    extraImgs: [
      "Pictures demo/honey pomelo 1.png",
      "Pictures demo/honey pomelo 2.png"
    ],
    specs: {
      "Type": "Honey",
      "Origin": "China",
      "Size": "1.5–2 kg each",
      "Season": "Seasonal",
      "Min. Order": "25 kg"
    }
  },
  {
    id: "3-red-pomelo",
    name: "3 Red Pomelo",
    category: "fruit",
    categoryLabel: "Citrus Fruit",
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
      "Season": "Seasonal",
      "Min. Order": "20 kg"
    }
  },
  {
    id: "red-pomelo",
    name: "Red Pomelo",
    category: "fruit",
    categoryLabel: "Citrus Fruit",
    desc: "Vibrant red-fleshed pomelo with a rich, sweet-tangy taste. The striking ruby interior makes it a standout on premium retail shelves and an excellent gifting fruit.",
    origin: "China",
    img: "Pictures demo/Red Pomelo.png",
    extraImgs: [
      "Pictures demo/Red Pomelo 1.png",
      "Pictures demo/Red Pomelo 2.jpeg"
    ],
    specs: {
      "Type": "Red Flesh",
      "Origin": "China",
      "Grade": "Premium",
      "Season": "Seasonal",
      "Min. Order": "20 kg"
    }
  },
  {
    id: "carrots",
    name: "Carrots",
    category: "vegetable",
    categoryLabel: "Root Vegetable",
    desc: "Crisp, vibrant orange carrots with a naturally sweet flavor. Consistently sized and washed, ready for retail display or direct food service. Available year-round.",
    origin: "China",
    img: "Pictures demo/Carrot.png",
    extraImgs: [
      "Pictures demo/Carrot 1.png"
    ],
    specs: {
      "Type": "Orange",
      "Origin": "China",
      "Form": "Whole / Washed",
      "Season": "Year Round",
      "Min. Order": "25 kg"
    }
  },
  {
    id: "indian-carrots",
    name: "Indian Carrots",
    category: "vegetable",
    categoryLabel: "Specialty Vegetable",
    desc: "Deep-red Indian variety carrots with an intensely sweet flavor and rich color. Highly sought in South Asian grocery retail and specialty markets across Canada.",
    origin: "China",
    img: "Pictures demo/Carrot Indian.png",
    extraImgs: [
     "Pictures demo/Carrot Indian 1.png"
    ],
    specs: {
      "Type": "Indian Variety",
      "Origin": "China",
      "Season": "Winter Peak",
      "Grade": "Premium",
      "Min. Order": "15 kg"
    }
  },
  {
    id: "purple-sweet-potatoes",
    name: "Purple Sweet Potatoes",
    category: "vegetable",
    categoryLabel: "Root Vegetable",
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
      "Season": "Year Round",
      "Min. Order": "10 kg"
    }
  },
  {
    id: "snap-peas",
    name: "Snap Peas",
    category: "vegetable",
    categoryLabel: "Pod Vegetable",
    desc: "Plump, crunchy snap peas with a sweet flavor. Eaten whole, pod and all — a favourite in fresh produce aisles and restaurant kitchens across Canada.",
    origin: "China",
    img: "Pictures demo/Snap Peas.png",
    extraImgs: [
      "Pictures demo/Snap Peas 1.jpeg",
      "Pictures demo/Snap Peas 2.jpeg"
    ],
    specs: {
      "Type": "Snap Pea",
      "Origin": "China",
      "Form": "Whole Pod",
      "Season": "Year Round",
      "Min. Order": "10 kg"
    }
  },
  {
    id: "snow-peas",
    name: "Snow Peas",
    category: "vegetable",
    categoryLabel: "Pod Vegetable",
    desc: "Flat, tender snow peas with a delicate sweet flavor. A staple in Asian stir-fry cuisine and increasingly popular in North American fresh produce sections.",
    origin: "China",
    img: "Pictures demo/Snow Peas.jpeg",
    extraImgs: [
      "Pictures demo/Snow Peas 1.jpeg",
      "Pictures demo/Snow Peas 2.jpeg",
      "Pictures demo/Snow Peas 3.png"
    ],
    specs: {
      "Type": "Snow Pea",
      "Origin": "China",
      "Form": "Flat Pod",
      "Season": "Year Round",
      "Min. Order": "10 kg"
    }
  },
  {
  id: "shallots",
  name: "Shallots",
  category: "vegetable",
  categoryLabel: "Bulb Vegetable",
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
    "Season": "Year Round",
    "Min. Order": "10 kg"
  }
}
];
