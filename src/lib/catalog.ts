// === VENDAMAIS CATÁLOGO DEMONSTRATIVO ===
// Produtos plausíveis para demonstração de hipermercado digital.
// Marcas genéricas/fictícias. Imagens: Unsplash (licença livre).

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  image: string;
  price: number;
  previousPrice?: number;
  unitPrice: string;
  unit: string;
  weight?: string;
  stock: number;
  promotion?: string;
  tags?: string[];
  rating?: number;
  ratingCount?: number;
  byWeight?: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  image: string;
  subcategories: string[];
};

export const categories: Category[] = [
  {
    id: "hortifruti", name: "Hortifruti", slug: "hortifruti", icon: "🥬", color: "#16a34a",
    image: "https://images.unsplash.com/photo-1542838132-25c8eb958dd2?w=400&q=80",
    subcategories: ["Frutas", "Legumes", "Verduras", "Temperos"],
  },
  {
    id: "acougue", name: "Açougue", slug: "acougue", icon: "🥩", color: "#dc2626",
    image: "https://images.unsplash.com/photo-1607623814075-e51dfba4d609?w=400&q=80",
    subcategories: ["Bovinos", "Suínos", "Frango", "Peixes"],
  },
  {
    id: "padaria", name: "Padaria", slug: "padaria", icon: "🍞", color: "#d97706",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
    subcategories: ["Pães", "Bolos", "Tortas", "Salgados"],
  },
  {
    id: "frios", name: "Frios", slug: "frios", icon: "🧀", color: "#0891b2",
    image: "https://images.unsplash.com/photo-1486297678162-eb685247596d?w=400&q=80",
    subcategories: ["Queijos", "Presuntos", "Salames", "Frios Fatiados"],
  },
  {
    id: "laticinios", name: "Laticínios", slug: "laticinios", icon: "🥛", color: "#3b82f6",
    image: "https://images.unsplash.com/photo-1563636617719-31e4e6c7bb7a?w=400&q=80",
    subcategories: ["Leites", "Iogurtes", "Manteigas", "Cremes"],
  },
  {
    id: "bebidas", name: "Bebidas", slug: "bebidas", icon: "🥤", color: "#7c3aed",
    image: "https://images.unsplash.com/photo-1622480945781-ce494a8b2d4b?w=400&q=80",
    subcategories: ["Refrigerantes", "Sucos", "Águas", "Energéticos"],
  },
  {
    id: "mercearia", name: "Mercearia", slug: "mercearia", icon: "🥫", color: "#92400e",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&q=80",
    subcategories: ["Cereais", "Massas", "Conservas", "Biscoitos"],
  },
  {
    id: "congelados", name: "Congelados", slug: "congelados", icon: "🧊", color: "#0ea5e9",
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b7b89?w=400&q=80",
    subcategories: ["Pizzas", "Hambúrgueres", "Sorvetes", "Vegetais"],
  },
  {
    id: "limpeza", name: "Limpeza", slug: "limpeza", icon: "🧽", color: "#0891b2",
    image: "https://images.unsplash.com/photo-1581579188861-9495fa5abeb2?w=400&q=80",
    subcategories: ["Lavanderia", "Cozinha", "Banheiro", "Multiuso"],
  },
  {
    id: "higiene", name: "Higiene", slug: "higiene", icon: "🧴", color: "#ec4899",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80",
    subcategories: ["Shampoos", "Sabonetes", "Cuidados", "Perfumaria"],
  },
  {
    id: "bebe", name: "Bebê", slug: "bebe", icon: "🍼", color: "#f472b6",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80",
    subcategories: ["Fórmulas", "Fraldas", "Higiene", "Acessórios"],
  },
  {
    id: "pet", name: "Pet", slug: "pet", icon: "🐾", color: "#8b5cf6",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&q=80",
    subcategories: ["Rações", "Higiene", "Acessórios", "Petiscos"],
  },
];

const img = (url: string) => `${url}?w=400&h=400&fit=crop&q=80`;

export const products: Product[] = [
  // === HORTIFRUTI ===
  { id: "h01", slug: "banana-prata-kg", name: "Banana Prata", brand: "VendaMais", category: "hortifruti", subcategory: "Frutas", image: img("https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e"), price: 5.99, previousPrice: 7.49, unitPrice: "R$ 5,99/kg", unit: "kg", weight: "1 kg", stock: 120, promotion: "oferta", tags: ["fresco", "nacional"], rating: 4.5, ratingCount: 128, byWeight: true },
  { id: "h02", slug: "maca-gala-kg", name: "Maçã Gala", brand: "VendaMais", category: "hortifruti", subcategory: "Frutas", image: img("https://images.unsplash.com/photo-1568702846914-96b3d0f00f93"), price: 8.99, previousPrice: 11.99, unitPrice: "R$ 8,99/kg", unit: "kg", weight: "1 kg", stock: 85, promotion: "oferta", tags: ["fresco"], rating: 4.7, ratingCount: 95, byWeight: true },
  { id: "h03", slug: "tomate-de-mesa-kg", name: "Tomate de Mesa", brand: "VendaMais", category: "hortifruti", subcategory: "Legumes", image: img("https://images.unsplash.com/photo-1546470427-e26264be0b0d"), price: 6.49, unitPrice: "R$ 6,49/kg", unit: "kg", weight: "1 kg", stock: 60, tags: ["fresco"], rating: 4.3, ratingCount: 67, byWeight: true },
  { id: "h04", slug: "alface-americana-un", name: "Alface Americana", brand: "VendaMais", category: "hortifruti", subcategory: "Verduras", image: img("https://images.unsplash.com/photo-1622205313165-46eeecefb9d1"), price: 3.49, unitPrice: "R$ 3,49/un", unit: "un", weight: "1 maço", stock: 40, tags: ["fresco"], rating: 4.2, ratingCount: 34 },
  { id: "h05", slug: "cenoura-kg", name: "Cenoura", brand: "VendaMais", category: "hortifruti", subcategory: "Legumes", image: img("https://images.unsplash.com/photo-1598452945058-8b7f4c8d3747"), price: 4.99, previousPrice: 6.49, unitPrice: "R$ 4,99/kg", unit: "kg", weight: "1 kg", stock: 70, promotion: "oferta", tags: ["fresco"], rating: 4.4, ratingCount: 52, byWeight: true },
  { id: "h06", slug: "laranja-pera-kg", name: "Laranja Pera", brand: "VendaMais", category: "hortifruti", subcategory: "Frutas", image: img("https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b"), price: 4.49, unitPrice: "R$ 4,49/kg", unit: "kg", weight: "1 kg", stock: 90, tags: ["fresco"], rating: 4.6, ratingCount: 41, byWeight: true },

  // === AÇOUGUE ===
  { id: "a01", slug: "picanha-bovina-kg", name: "Picanha Bovina", brand: "Fazenda VendaMais", category: "acougue", subcategory: "Bovinos", image: img("https://images.unsplash.com/photo-1607623814075-e51dfba4d609"), price: 69.90, previousPrice: 79.90, unitPrice: "R$ 69,90/kg", unit: "kg", weight: "~1,2 kg", stock: 35, promotion: "oferta", tags: ["premium", "churrasco"], rating: 4.9, ratingCount: 312, byWeight: true },
  { id: "a02", slug: "contra-file-kg", name: "Contrafilé", brand: "Fazenda VendaMais", category: "acougue", subcategory: "Bovinos", image: img("https://images.unsplash.com/photo-1603048719571-0f9c7c2f4d4e"), price: 54.90, unitPrice: "R$ 54,90/kg", unit: "kg", weight: "~1 kg", stock: 28, tags: ["premium"], rating: 4.7, ratingCount: 156, byWeight: true },
  { id: "a03", slug: "frango-inteiro-kg", name: "Frango Inteiro Caipira", brand: "Granja VendaMais", category: "acougue", subcategory: "Frango", image: img("https://images.unsplash.com/photo-1604503068373-2856c8f9d1e7"), price: 12.90, previousPrice: 15.90, unitPrice: "R$ 12,90/kg", unit: "kg", weight: "~2 kg", stock: 50, promotion: "oferta", tags: ["fresco"], rating: 4.5, ratingCount: 89, byWeight: true },
  { id: "a04", slug: "linguica-toscana-kg", name: "Linguiça Toscana", brand: "Fazenda VendaMais", category: "acougue", subcategory: "Suínos", image: img("https://images.unsplash.com/photo-1588165171080-c89acfa5ee83"), price: 29.90, unitPrice: "R$ 29,90/kg", unit: "kg", weight: "~0,8 kg", stock: 42, tags: ["churrasco"], rating: 4.6, ratingCount: 73, byWeight: true },
  { id: "a05", slug: "maminha-kg", name: "Maminha", brand: "Fazenda VendaMais", category: "acougue", subcategory: "Bovinos", image: img("https://images.unsplash.com/photo-1558030006-450675395492"), price: 49.90, previousPrice: 59.90, unitPrice: "R$ 49,90/kg", unit: "kg", weight: "~1,3 kg", stock: 22, promotion: "oferta", tags: ["premium"], rating: 4.8, ratingCount: 134, byWeight: true },

  // === PADARIA ===
  { id: "p01", slug: "pao-frances-kg", name: "Pão Francês", brand: "Padaria VendaMais", category: "padaria", subcategory: "Pães", image: img("https://images.unsplash.com/photo-1509440159596-0249088772ff"), price: 15.90, unitPrice: "R$ 15,90/kg", unit: "kg", weight: "1 kg", stock: 100, tags: ["fresco", "diario"], rating: 4.8, ratingCount: 245, byWeight: true },
  { id: "p02", slug: "pao-de-forma-integral-500g", name: "Pão de Forma Integral", brand: "VidaMais", category: "padaria", subcategory: "Pães", image: img("https://images.unsplash.com/photo-1510942205497-5d7c44e7c50f"), price: 7.49, previousPrice: 9.49, unitPrice: "R$ 14,98/kg", unit: "un", weight: "500 g", stock: 60, promotion: "oferta", tags: ["integral"], rating: 4.4, ratingCount: 87 },
  { id: "p03", slug: "bolo-de-chocolate-un", name: "Bolo de Chocolate", brand: "Padaria VendaMais", category: "padaria", subcategory: "Bolos", image: img("https://images.unsplash.com/photo-1578775431019-759b8b6c8b8e"), price: 24.90, unitPrice: "R$ 24,90/un", unit: "un", weight: "800 g", stock: 15, tags: ["fresco"], rating: 4.9, ratingCount: 56 },
  { id: "p04", slug: "croissant-un", name: "Croissant de Manteiga", brand: "Padaria VendaMais", category: "padaria", subcategory: "Pães", image: img("https://images.unsplash.com/photo-1555507036-ab1f4038808a"), price: 4.90, unitPrice: "R$ 4,90/un", unit: "un", weight: "60 g", stock: 80, tags: ["fresco", "diario"], rating: 4.7, ratingCount: 92 },

  // === FRIOS ===
  { id: "f01", slug: "queijo-mussarela-kg", name: "Queijo Mussarela Fatiado", brand: "Laticínios VendaMais", category: "frios", subcategory: "Queijos", image: img("https://images.unsplash.com/photo-1486297678162-eb685247596d"), price: 52.90, previousPrice: 62.90, unitPrice: "R$ 52,90/kg", unit: "kg", weight: "300 g", stock: 30, promotion: "oferta", tags: ["fatiado"], rating: 4.7, ratingCount: 143, byWeight: true },
  { id: "f02", slug: "presunto-fatiado-200g", name: "Presunto Fatiado", brand: "Frios VendaMais", category: "frios", subcategory: "Presuntos", image: img("https://images.unsplash.com/photo-1574096089510-3fb9d4d2c2b3"), price: 9.90, unitPrice: "R$ 49,50/kg", unit: "un", weight: "200 g", stock: 45, tags: ["fatiado"], rating: 4.3, ratingCount: 67 },
  { id: "f03", slug: "salame-italiano-150g", name: "Salame Italiano", brand: "Frios Premium", category: "frios", subcategory: "Salames", image: img("https://images.unsplash.com/photo-1626202373052-9d3b8e4d3b8e"), price: 18.90, unitPrice: "R$ 126,00/kg", unit: "un", weight: "150 g", stock: 25, tags: ["premium"], rating: 4.8, ratingCount: 41 },

  // === LATICÍNIOS ===
  { id: "l01", slug: "leite-integral-1l", name: "Leite Integral 1L", brand: "VidaMais", category: "laticinios", subcategory: "Leites", image: img("https://images.unsplash.com/photo-1563636617719-31e4e6c7bb7a"), price: 5.99, previousPrice: 6.89, unitPrice: "R$ 5,99/L", unit: "un", weight: "1 L", stock: 200, promotion: "oferta", tags: ["essencial"], rating: 4.6, ratingCount: 389 },
  { id: "l02", slug: "iogurte-natural-170g", name: "Iogurte Natural", brand: "VidaMais", category: "laticinios", subcategory: "Iogurtes", image: img("https://images.unsplash.com/photo-1571212515406-7c8e8b9d4d40"), price: 3.49, unitPrice: "R$ 20,53/L", unit: "un", weight: "170 g", stock: 150, tags: ["natural"], rating: 4.5, ratingCount: 124 },
  { id: "l03", slug: "manteiga-sal-200g", name: "Manteiga com Sal", brand: "Laticínios VendaMais", category: "laticinios", subcategory: "Manteigas", image: img("https://images.unsplash.com/photo-1589985270826-4b7bb7bc5b0c"), price: 8.90, previousPrice: 10.90, unitPrice: "R$ 44,50/kg", unit: "un", weight: "200 g", stock: 80, promotion: "oferta", tags: ["essencial"], rating: 4.7, ratingCount: 98 },
  { id: "l04", slug: "queijo-prato-kg", name: "Queijo Prato", brand: "Laticínios VendaMais", category: "laticinios", subcategory: "Queijos", image: img("https://images.unsplash.com/photo-1452195103389-5f2840b9b67a"), price: 45.90, unitPrice: "R$ 45,90/kg", unit: "kg", weight: "~0,5 kg", stock: 35, tags: ["fatiado"], rating: 4.5, ratingCount: 76, byWeight: true },

  // === BEBIDAS ===
  { id: "b01", slug: "coca-cola-2l", name: "Refrigerante Cola 2L", brand: "ColaPop", category: "bebidas", subcategory: "Refrigerantes", image: img("https://images.unsplash.com/photo-1622480945781-ce494a8b2d4b"), price: 9.49, previousPrice: 12.49, unitPrice: "R$ 4,75/L", unit: "un", weight: "2 L", stock: 180, promotion: "oferta", tags: ["essencial"], rating: 4.8, ratingCount: 567 },
  { id: "b02", slug: "suco-de-uva-1l", name: "Suco de Uva Integral 1L", brand: "SucoBom", category: "bebidas", subcategory: "Sucos", image: img("https://images.unsplash.com/photo-1600271886742-f049cd451bba"), price: 12.90, unitPrice: "R$ 12,90/L", unit: "un", weight: "1 L", stock: 90, tags: ["integral"], rating: 4.6, ratingCount: 134 },
  { id: "b03", slug: "agua-mineral-500ml", name: "Água Mineral 500ml", brand: "AquaPura", category: "bebidas", subcategory: "Águas", image: img("https://images.unsplash.com/photo-1560847468-5eef0e5b8c0f"), price: 2.49, unitPrice: "R$ 4,98/L", unit: "un", weight: "500 ml", stock: 300, tags: ["essencial"], rating: 4.4, ratingCount: 89 },
  { id: "b04", slug: "energetico-350ml", name: "Energético 350ml", brand: "EnergyMax", category: "bebidas", subcategory: "Energéticos", image: img("https://images.unsplash.com/photo-1631256208585-9c5e4d5c8e4e"), price: 7.99, previousPrice: 9.99, unitPrice: "R$ 22,83/L", unit: "un", weight: "350 ml", stock: 120, promotion: "oferta", tags: [], rating: 4.3, ratingCount: 156 },

  // === MERCEARIA ===
  { id: "m01", slug: "arroz-branco-5kg", name: "Arroz Branco Tipo 1 5kg", brand: "GrãoBom", category: "mercearia", subcategory: "Cereais", image: img("https://images.unsplash.com/photo-1586201375761-83865074e7fb"), price: 24.90, previousPrice: 29.90, unitPrice: "R$ 4,98/kg", unit: "un", weight: "5 kg", stock: 150, promotion: "oferta", tags: ["essencial", "compra-do-mes"], rating: 4.7, ratingCount: 423 },
  { id: "m02", slug: "feijao-carioca-1kg", name: "Feijão Carioca 1kg", brand: "GrãoBom", category: "mercearia", subcategory: "Cereais", image: img("https://images.unsplash.com/photo-1605000797499-95a51c5269ae"), price: 8.49, previousPrice: 10.49, unitPrice: "R$ 8,49/kg", unit: "un", weight: "1 kg", stock: 120, promotion: "oferta", tags: ["essencial"], rating: 4.6, ratingCount: 298 },
  { id: "m03", slug: "macarrao-espaguete-500g", name: "Macarrão Espaguete 500g", brand: "PastaBella", category: "mercearia", subcategory: "Massas", image: img("https://images.unsplash.com/photo-1551462147-37825b1d5dd6"), price: 3.99, unitPrice: "R$ 7,98/kg", unit: "un", weight: "500 g", stock: 200, tags: ["essencial"], rating: 4.5, ratingCount: 187 },
  { id: "m04", slug: "oleo-de-soja-900ml", name: "Óleo de Soja 900ml", brand: "CozinhaBom", category: "mercearia", subcategory: "Conservas", image: img("https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5"), price: 6.99, previousPrice: 8.99, unitPrice: "R$ 7,77/L", unit: "un", weight: "900 ml", stock: 140, promotion: "oferta", tags: ["essencial"], rating: 4.4, ratingCount: 156 },
  { id: "m05", slug: "cafe-torrado-500g", name: "Café Torrado 500g", brand: "CaféBom", category: "mercearia", subcategory: "Cereais", image: img("https://images.unsplash.com/photo-1559056199-641a0ac8b55e"), price: 14.90, previousPrice: 18.90, unitPrice: "R$ 29,80/kg", unit: "un", weight: "500 g", stock: 110, promotion: "oferta", tags: ["essencial"], rating: 4.8, ratingCount: 345 },
  { id: "m06", slug: "acucar-refinado-1kg", name: "Açúcar Refinado 1kg", brand: "DoceBom", category: "mercearia", subcategory: "Conservas", image: img("https://images.unsplash.com/photo-1610725664285-7c57e6c7e9b9"), price: 4.49, unitPrice: "R$ 4,49/kg", unit: "un", weight: "1 kg", stock: 160, tags: ["essencial"], rating: 4.3, ratingCount: 112 },
  { id: "m07", slug: "biscoito-recheado-150g", name: "Biscoito Recheado 150g", brand: "BiscoitoBom", category: "mercearia", subcategory: "Biscoitos", image: img("https://images.unsplash.com/photo-1587049352846-c4ecf2da0991"), price: 3.29, previousPrice: 4.49, unitPrice: "R$ 21,93/kg", unit: "un", weight: "150 g", stock: 180, promotion: "oferta", tags: [], rating: 4.2, ratingCount: 89 },

  // === CONGELADOS ===
  { id: "c01", slug: "pizza-margherita-400g", name: "Pizza Margherita 400g", brand: "PizzaFreddo", category: "congelados", subcategory: "Pizzas", image: img("https://images.unsplash.com/photo-1574071318508-1cdbab80d205"), price: 12.90, previousPrice: 16.90, unitPrice: "R$ 32,25/kg", unit: "un", weight: "400 g", stock: 75, promotion: "oferta", tags: [], rating: 4.5, ratingCount: 167 },
  { id: "c02", slug: "hamburguer-angus-400g", name: "Hambúrguer Angus 400g", brand: "MeatHouse", category: "congelados", subcategory: "Hambúrgueres", image: img("https://images.unsplash.com/photo-1561758033-d89a9ad46330"), price: 19.90, unitPrice: "R$ 49,75/kg", unit: "un", weight: "400 g", stock: 60, tags: ["premium"], rating: 4.7, ratingCount: 134 },
  { id: "c03", slug: "sorvete-chocolate-1l", name: "Sorvete de Chocolate 1L", brand: "GelatoBom", category: "congelados", subcategory: "Sorvetes", image: img("https://images.unsplash.com/photo-1497034825429-c343d7c6a68f"), price: 15.90, previousPrice: 19.90, unitPrice: "R$ 15,90/L", unit: "un", weight: "1 L", stock: 50, promotion: "oferta", tags: [], rating: 4.8, ratingCount: 234 },

  // === LIMPEZA ===
  { id: "cl01", slug: "detergente-louca-500ml", name: "Detergente Louças 500ml", brand: "LimpaBom", category: "limpeza", subcategory: "Cozinha", image: img("https://images.unsplash.com/photo-1581579188861-9495fa5abeb2"), price: 3.99, previousPrice: 5.49, unitPrice: "R$ 7,98/L", unit: "un", weight: "500 ml", stock: 200, promotion: "oferta", tags: ["essencial"], rating: 4.4, ratingCount: 178 },
  { id: "cl02", slug: "sabao-em-po-1kg", name: "Sabão em Pó 1kg", brand: "LimpaBom", category: "limpeza", subcategory: "Lavanderia", image: img("https://images.unsplash.com/photo-1610557892470-55d9e80e0b1b"), price: 12.90, previousPrice: 16.90, unitPrice: "R$ 12,90/kg", unit: "un", weight: "1 kg", stock: 130, promotion: "oferta", tags: ["essencial"], rating: 4.6, ratingCount: 245 },
  { id: "cl03", slug: "amaciante-2l", name: "Amaciante 2L", brand: "LimpaBom", category: "limpeza", subcategory: "Lavanderia", image: img("https://images.unsplash.com/photo-1611080508531-6c3b8e7e9b9e"), price: 11.90, unitPrice: "R$ 5,95/L", unit: "un", weight: "2 L", stock: 90, tags: ["essencial"], rating: 4.5, ratingCount: 123 },
  { id: "cl04", slug: "agua-sanitaria-2l", name: "Água Sanitária 2L", brand: "LimpaBom", category: "limpeza", subcategory: "Banheiro", image: img("https://images.unsplash.com/photo-1582058051505-8b8e9d4d2c2e"), price: 4.99, previousPrice: 6.49, unitPrice: "R$ 2,50/L", unit: "un", weight: "2 L", stock: 160, promotion: "oferta", tags: ["essencial"], rating: 4.3, ratingCount: 87 },

  // === HIGIENE ===
  { id: "hg01", slug: "shampo-350ml", name: "Shampoo 350ml", brand: "CuidaBom", category: "higiene", subcategory: "Shampoos", image: img("https://images.unsplash.com/photo-1556228720-195a672e8a03"), price: 9.90, previousPrice: 13.90, unitPrice: "R$ 28,29/L", unit: "un", weight: "350 ml", stock: 140, promotion: "oferta", tags: [], rating: 4.5, ratingCount: 198 },
  { id: "hg02", slug: "sabonete-85g", name: "Sabonete em Barra 85g", brand: "CuidaBom", category: "higiene", subcategory: "Sabonetes", image: img("https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec"), price: 2.49, unitPrice: "R$ 29,29/kg", unit: "un", weight: "85 g", stock: 300, tags: ["essencial"], rating: 4.4, ratingCount: 156 },
  { id: "hg03", slug: "papel-higienico-12rolos", name: "Papel Higiênico 12 Rolos", brand: "CuidaBom", category: "higiene", subcategory: "Higiene", image: img("https://images.unsplash.com/photo-1604881991720-f91add269314"), price: 14.90, previousPrice: 18.90, unitPrice: "R$ 1,24/rolo", unit: "un", weight: "12 un", stock: 110, promotion: "oferta", tags: ["essencial"], rating: 4.6, ratingCount: 287 },
  { id: "hg04", slug: "creme-dental-90g", name: "Creme Dental 90g", brand: "CuidaBom", category: "higiene", subcategory: "Higiene", image: img("https://images.unsplash.com/photo-1559591914-4c9e9d4d4d4d"), price: 4.49, previousPrice: 5.99, unitPrice: "R$ 49,89/kg", unit: "un", weight: "90 g", stock: 200, promotion: "oferta", tags: ["essencial"], rating: 4.5, ratingCount: 134 },

  // === BEBÊ ===
  { id: "bb01", slug: "formula-infantil-400g", name: "Fórmula Infantil 400g", brand: "BabyBom", category: "bebe", subcategory: "Fórmulas", image: img("https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4"), price: 32.90, previousPrice: 39.90, unitPrice: "R$ 82,25/kg", unit: "un", weight: "400 g", stock: 60, promotion: "oferta", tags: [], rating: 4.7, ratingCount: 89 },
  { id: "bb02", slug: "fraldas-tamanho-m-30un", name: "Fraldas Tamanho M 30un", brand: "BabyBom", category: "bebe", subcategory: "Fraldas", image: img("https://images.unsplash.com/photo-1622290291468-a28f7a7dc4a8"), price: 24.90, previousPrice: 32.90, unitPrice: "R$ 0,83/un", unit: "un", weight: "30 un", stock: 80, promotion: "oferta", tags: ["essencial"], rating: 4.8, ratingCount: 234 },

  // === PET ===
  { id: "pt01", slug: "racao-cachorro-10kg", name: "Ração Cães Adultos 10kg", brand: "PetBom", category: "pet", subcategory: "Rações", image: img("https://images.unsplash.com/photo-1450778869180-41d0601e046e"), price: 89.90, previousPrice: 109.90, unitPrice: "R$ 8,99/kg", unit: "un", weight: "10 kg", stock: 40, promotion: "oferta", tags: ["essencial"], rating: 4.7, ratingCount: 178 },
  { id: "pt02", slug: "racao-gato-3kg", name: "Ração Gatos Adultos 3kg", brand: "PetBom", category: "pet", subcategory: "Rações", image: img("https://images.unsplash.com/photo-1574158622682-e40e69881006"), price: 42.90, previousPrice: 52.90, unitPrice: "R$ 14,30/kg", unit: "un", weight: "3 kg", stock: 35, promotion: "oferta", tags: ["essencial"], rating: 4.6, ratingCount: 98 },
];

// === HELPERS ===
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(catId: string): Product[] {
  return products.filter((p) => p.category === catId);
}

export function getOffers(): Product[] {
  return products.filter((p) => p.promotion === "oferta");
}

export function getBestSellers(): Product[] {
  return products.filter((p) => (p.ratingCount ?? 0) > 150).sort((a, b) => (b.ratingCount ?? 0) - (a.ratingCount ?? 0));
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q)
  );
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function calcDiscount(price: number, previousPrice?: number): number {
  if (!previousPrice || previousPrice <= price) return 0;
  return Math.round(((previousPrice - price) / previousPrice) * 100);
}
