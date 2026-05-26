import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const familiasIniciales = [
  "Estuches",
  "Bandejas",
  "Bowls",
  "Vasos",
  "Platos",
  "Cubiertos",
  "Accesorios",
  "Bolsas Camiseta",
  "Bolsas de Arranque",
  "Bolsas Riñón",
  "Bolsas Fondo Cuadrado",
  "Bolsas Fondo Americano",
  "Servilletas",
];

const tiposIniciales = [
  "Bioplástico",
  "Servicios",
  "Papel Kraft",
  "Fibra Natural",
  "Madera",
  "Bagazo de Caña de Azúcar",
];

const productosIniciales = [
  { sku: "LZ-GO-YP09", nombre: "Plato 22cm Blanco - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "LZ-GO-YP08", nombre: "Plato 17cm Blanco - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "LZ-GO-TW04", nombre: "Vaso 4oz (120ml) - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "LZ-GO-PSH08-3", nombre: "Estuche 1250 con 3 Compartimentos - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "TO-BR50L", nombre: "Bolsa Riñón 40x50 - Impresa - Bioplástico", tipo: "Bioplástico" },
  { sku: "TO-BR50", nombre: "Bolsa Riñón 40x50 - Bioplástico", tipo: "Bioplástico" },
  { sku: "TO-BR40L", nombre: "Bolsa Riñón 30x40 Impresa - Bioplástico", tipo: "Bioplástico" },
  { sku: "TO-BR40", nombre: "Bolsa Riñón 30x40 - Bioplástico", tipo: "Bioplástico" },
  { sku: "TO-BR30L", nombre: "Bolsa Riñón 20x30 Impresa - Bioplástico", tipo: "Bioplástico" },
  { sku: "TO-BR30", nombre: "Bolsa Riñón 20x30 - Bioplástico", tipo: "Bioplástico" },
  { sku: "TO-BC50L", nombre: "Bolsa Camiseta 40x50 Impresa - Bioplástico", tipo: "Bioplástico" },
  { sku: "TO-BC50", nombre: "Bolsa Camiseta 40x50 - Bioplástico", tipo: "Bioplástico" },
  { sku: "TO-BC40L", nombre: "Bolsa Camiseta 30x40 Impresa - Bioplástico", tipo: "Bioplástico" },
  { sku: "TO-BC40", nombre: "Bolsa Camiseta 30x40 - Bioplástico", tipo: "Bioplástico" },
  { sku: "TO-BC30L", nombre: "Bolsa Camiseta 20x30 Impresa - Bioplástico", tipo: "Bioplástico" },
  { sku: "TO-BC30", nombre: "Bolsa Camiseta 20x30 - Bioplástico", tipo: "Bioplástico" },
  { sku: "TO-BA40L", nombre: "Bolsa de Arranque 30x40 Impresa - Bioplástico", tipo: "Bioplástico" },
  { sku: "TO-BA40", nombre: "Bolsa de Arranque 30x40 - Bioplástico", tipo: "Bioplástico" },
  { sku: "TO-BA30L", nombre: "Bolsa de Arranque 20x30 Impresa - Bioplástico", tipo: "Bioplástico" },
  { sku: "TO-BA30", nombre: "Bolsa de Arranque 20x30 - Bioplástico", tipo: "Bioplástico" },
  { sku: "TO-BA20L", nombre: "Bolsa de Arranque 20x20 Impresa - Bioplástico", tipo: "Bioplástico" },
  { sku: "TO-BA20", nombre: "Bolsa de Arranque 20x20 - Bioplástico", tipo: "Bioplástico" },
  { sku: "TM-C002-01", nombre: "Vaso 12oz (355ml) - Para Fríos - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "LZ-GO-YP07", nombre: "Tapa Bandeja 850 Rectangular - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "LZ-GO-YP06", nombre: "Bandeja 850 Rectangular - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "ZP-280CG", nombre: "Tapa Bowl 250 - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "ZP-280C", nombre: "Bowl 250 - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "TM-C007-2", nombre: "Vaso 8oz (240ml) para Tapas - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "TM-G004", nombre: "Tapa Vaso 12oz y 14oz - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "TM-C002", nombre: "Vaso 12oz (355ml) - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "TM-G003", nombre: "Tapa Vaso 8oz - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "TM-C007", nombre: "Vaso 8oz (240ml) - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "TC01B004", nombre: "Estuche 450", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "LZ-GO-T-HB06", nombre: "Estuche 500 Cuadrado - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "TM-B102", nombre: "Estuche 950 Bajo - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "WD-103F", nombre: "Tenedor 16cm - Madera", tipo: "Madera" },
  { sku: "WD-102S", nombre: "Cuchara 16cm - Madera", tipo: "Madera" },
  { sku: "WD-101K", nombre: "Cuchillo 16cm - Madera", tipo: "Madera" },
  { sku: "TC01L027", nombre: "Bowl 450 - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "LZ-GO-TWG700", nombre: "Tapa Bowl 500 - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "LZ-GO-TW500", nombre: "Bowl 500 - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "TC01L002G", nombre: "Tapa Bowl 750 - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "TC01L002", nombre: "Bowl 750 - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "JNYH-02", nombre: "Bowl 850 Oval - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "GO-ZW1000S", nombre: "Bowl 850 - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "GO-ZW1000G", nombre: "Tapa Bowl 850 - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "TM-L103G", nombre: "Tapa Bowl 1000 Bajo - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "TM-L103", nombre: "Bowl 1000 Bajo - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "LZ-GO-75G(W)", nombre: "Tapa Bowl 1000 - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "LZ-GO-75W(W)", nombre: "Bowl 1000 - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "LZ-GO-TW16", nombre: "Tapa Dip 2oz - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "LZ-GO-TW12", nombre: "Dip 2oz - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "LZ-GO-SH89-2", nombre: "Estuche 950 con Compartimento - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "LZ-GO-SH09-3", nombre: "Estuche 1500 con 3 Compartimentos - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "LZ-GO-P-SH89", nombre: "Estuche 950 Alto - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "LZ-GO-B004", nombre: "Estuche 600 Rectangular - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "LZ-GO-75W", nombre: "Bowl 1000 Marron - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "LZ-GO-75G", nombre: "Tapa Bowl 1000 Marron - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "LZ-GO-1500WS", nombre: "Bowl 1250 - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
  { sku: "LZ-GO-1500WGS", nombre: "Tapa Bowl 1250 - Caña de Azúcar", tipo: "Bagazo de Caña de Azúcar" },
] as const;

const productosExternos = [
  { sku: "GW-2406", nombre: "Cuchillo 16cm -Innova - Madera", tipoProductoVenta: "Madera" },
  { sku: "01-0009", nombre: "Estuche 1250 (1250ml / 20x21x8cm) - Fibra Natural", tipoProductoVenta: "Fibra Natural" },
  { sku: "01-0008", nombre: "Estuche 950 Alto (950ml / 23x15x8 cm) - Fibra Natural", tipoProductoVenta: "Fibra Natural" },
  { sku: "2915", nombre: "Tapa Vaso 12oz y 14oz - Polipropileno - Mayo26", tipoProductoVenta: "Bagazo de Caña de Azúcar" },
  { sku: "478", nombre: "Tapa Vaso 8oz - Caña de Azúcar - Mayo26", tipoProductoVenta: "Bagazo de Caña de Azúcar" },
  { sku: "477", nombre: "Vaso 8oz (240ml) - Caña de Azúcar - Mayo26", tipoProductoVenta: "Bagazo de Caña de Azúcar" },
  { sku: "WD-2424", nombre: "Tenedor 16cm - Innova - Madera", tipoProductoVenta: "Madera" },
  { sku: "00013", nombre: "Tenedor 16cm - TJ - Madera", tipoProductoVenta: "Madera" },
  { sku: "0009-01-01", nombre: "Dip 2oz (60ml 5x5x3cm) - Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "00128", nombre: "Dip 2oz (60ml) - Biopack - Caña de Azúcar", tipoProductoVenta: "Bagazo de Caña de Azúcar" },
  { sku: "SP0015", nombre: "Sorbete 23cm (ø9mm) Blanco - Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "00012", nombre: "Cuchara 16cm - TJ - Madera", tipoProductoVenta: "Madera" },
  { sku: "01-0003", nombre: "Bowl 1000 (1000ml / ø18cm) - Fibra Natural", tipoProductoVenta: "Fibra Natural" },
  { sku: "09-0025", nombre: "Tapa Bowl 1000 - PET Cristal", tipoProductoVenta: "Fibra Natural" },
  { sku: "2414", nombre: "Cuchara 14cm - Innova - Madera", tipoProductoVenta: "Madera" },
  { sku: "SER-0015L", nombre: "Servilletas 30x30cm Papel Tissue Beige Impresas", tipoProductoVenta: "Papel Kraft" },
  { sku: "SER-0012", nombre: "Servilletas 24x24cm Papel Tissue Beige Impresas", tipoProductoVenta: "Papel Kraft" },
  { sku: "SER-0007", nombre: "Servilletas 18x18cm Papel Tissue Beige Impresas", tipoProductoVenta: "Papel Kraft" },
  { sku: "SER-0026", nombre: "Servilletas 30x30cm Papel Tissue Beige", tipoProductoVenta: "Papel Kraft" },
  { sku: "SER-0020", nombre: "Servilletas 24x24cm Papel Tissue Beige", tipoProductoVenta: "Papel Kraft" },
  { sku: "SER-005B", nombre: "Servilletas 18x18cm Papel Tissue Beige", tipoProductoVenta: "Papel Kraft" },
  { sku: "09-0024", nombre: "Tapa Bowl 500 - PET Cristal", tipoProductoVenta: "Fibra Natural" },
  { sku: "01-0013", nombre: "Bowl 500 (500ml / Ø15cm) - Fibra Natural", tipoProductoVenta: "Fibra Natural" },
  { sku: "479", nombre: "Vaso 14oz (415ml) - Caña de Azúcar", tipoProductoVenta: "Bagazo de Caña de Azúcar" },
  { sku: "BOLSA-FM9-DU", nombre: "Bolsa Cuadrada FM9 28x18x47cm", tipoProductoVenta: "Papel Kraft" },
  { sku: "WD-104SP", nombre: "Cuchara 7cm - Madera", tipoProductoVenta: "Madera" },
  { sku: "0544-01-02", nombre: "Cono Chico 14x9x4cm (Papas Fritas) - Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "0149-01-01", nombre: "Cono Grande 16x9x4cm (Papas Fritas) - Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "PGRL-0002", nombre: "Plato 23cm Blanco - Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "PGRL-0001", nombre: "Plato 23cm Natural - Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "PCHL-0002", nombre: "Plato 18cm Blanco - Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "PCHL-0001", nombre: "Plato 18cm Natural - Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "01-0005", nombre: "Plato 22cm - Fibra Natural", tipoProductoVenta: "Fibra Natural" },
  { sku: "01-0004", nombre: "Plato 17cm - Fibra Natural", tipoProductoVenta: "Fibra Natural" },
  { sku: "0196-01-01", nombre: "Estuche 107 con Tapa y Ventana Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "0195-01-01", nombre: "Estuche 107 con Tapa Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "0194-01-01", nombre: "Estuche 107 sin Tapa Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "0152-01-01", nombre: "Estuche 105 con Tapa y Ventana Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "0603-01-01", nombre: "Estuche 105 con Tapa Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "0601-01-01", nombre: "Estuche 105 sin Tapa Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "0193-01-01", nombre: "Estuche 103 con Tapa y Ventana Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "0192-01-01", nombre: "Estuche 103 con Tapa Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "0024-01-01", nombre: "Estuche Sandwich 21x11x8cm - Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "0542-01-01", nombre: "Estuche Hamburguesa Chico 9x8x7cm - Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "0541-01-01", nombre: "Estuche Hamburguesa Grande 14x14x9cm - Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "0543-01-03", nombre: "Estuche Papas Fritas 12x8x6cm - Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "0085-01-01", nombre: "Caja para Wok (1450 cm3 - 49 Oz) Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "0086-01-01", nombre: "Caja para Wok (750 cm3 - 25 Oz) Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "0082-01-01", nombre: "Caja para Wok (730 cm3 - 24 Oz) Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "0087-01-01", nombre: "Caja para Wok (360 cm3 - 12 Oz) Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "0081-01-01", nombre: "Caja para Wok (360 cm3 - 12 Oz) Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "BOLSA-FM8-DU", nombre: "Bolsa Cuadrada FM8 26x17x38cm", tipoProductoVenta: "Papel Kraft" },
  { sku: "BOLSA-FM7-DU", nombre: "Bolsa Cuadrada FM7 26x12x37cm", tipoProductoVenta: "Papel Kraft" },
  { sku: "BOLSA-FM4-DU", nombre: "Bolsa Cuadrada FM4 16x10x30cm", tipoProductoVenta: "Papel Kraft" },
  { sku: "BOLSA-FM5-DU", nombre: "Bolsa Cuadrada FM5 20x11x30cm", tipoProductoVenta: "Papel Kraft" },
  { sku: "BOLSA-FM3-DU", nombre: "Bolsa Cuadrada FM3 12x8x24cm", tipoProductoVenta: "Papel Kraft" },
  { sku: "BOL-0030", nombre: "Bolsa con Fuelle N8 19x44cm", tipoProductoVenta: "Papel Kraft" },
  { sku: "BOL-0029", nombre: "Bolsa con Fuelle N7 19x35cm", tipoProductoVenta: "Papel Kraft" },
  { sku: "BOL-0027", nombre: "Bolsa con Fuelle N6 15x33cm", tipoProductoVenta: "Papel Kraft" },
  { sku: "BOL-0025", nombre: "Bolsa con Fuelle N4A 15x23cm", tipoProductoVenta: "Papel Kraft" },
  { sku: "BOL-0022", nombre: "Bolsa con Fuelle N3 11x25cm", tipoProductoVenta: "Papel Kraft" },
  { sku: "BOL-0020", nombre: "Bolsa con Fuelle N2 9x18cm", tipoProductoVenta: "Papel Kraft" },
  { sku: "09-0023", nombre: "Tapa Bandeja 105 Ovalada - PET Cristal", tipoProductoVenta: "Fibra Natural" },
  { sku: "01-0002", nombre: "Bandeja 105 Ovalada (750ml / 22x14x4cm) - Fibra Natural", tipoProductoVenta: "Fibra Natural" },
  { sku: "09-0058", nombre: "Tapa Bandeja 105 - PET Cristal", tipoProductoVenta: "Fibra Natural" },
  { sku: "01-0012", nombre: "Bandeja 105 (900ml / 18x15x4cm) - Fibra Natural", tipoProductoVenta: "Fibra Natural" },
  { sku: "09-0050", nombre: "Tapa Bandeja 103 - PET Cristal", tipoProductoVenta: "Fibra Natural" },
  { sku: "01-0007", nombre: "Bandeja 103 (550ml / 18x12x3cm) - Fibra Natural", tipoProductoVenta: "Fibra Natural" },
  { sku: "09-0056", nombre: "Tapa Bandeja 102 - PET Cristal", tipoProductoVenta: "Fibra Natural" },
  { sku: "01-0006", nombre: "Bandeja 102 (300ml / 14x11x3cm) - Fibra Natural", tipoProductoVenta: "Fibra Natural" },
  { sku: "VPF-0016", nombre: "Revolvedor 15cm - Madera", tipoProductoVenta: "Madera" },
  { sku: "SP0039", nombre: "Sorbete 23cm (ø9mm) Natural - Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "VSPB-0009", nombre: "Collarín Multi Medida - Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "PV-0005M", nombre: "Portavaso Doble Valija (Carry Tray) - Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "CPV400", nombre: "Portavaso Doble Universal - Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "BFM-005", nombre: "Bandeja N4 20x17cm - Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "BFM-003", nombre: "Bandeja N3 18x14cm - Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "BFM-002", nombre: "Bandeja N2 16x13cm - Papel Kraft", tipoProductoVenta: "Papel Kraft" },
  { sku: "BFM-001", nombre: "Bandeja N1 12x9cm - Papel Kraft", tipoProductoVenta: "Papel Kraft" },
] as const;

function inferirFamilia(nombre: string) {
  const value = nombre.toLowerCase();

  if (value.includes("tapa bowl")) return "Bowls";
  if (value.includes("bowl")) return "Bowls";
  if (value.includes("estuche")) return "Estuches";
  if (value.includes("bandeja")) return "Bandejas";
  if (value.includes("plato")) return "Platos";
  if (value.includes("tapa vaso")) return "Vasos";
  if (value.includes("vaso")) return "Vasos";
  if (value.includes("tenedor")) return "Cubiertos";
  if (value.includes("cuchara")) return "Cubiertos";
  if (value.includes("cuchillo")) return "Cubiertos";
  if (value.includes("servilleta")) return "Servilletas";
  if (value.includes("bolsa camiseta")) return "Bolsas Camiseta";
  if (value.includes("bolsa riñón")) return "Bolsas Riñón";
  if (value.includes("bolsa de arranque")) return "Bolsas de Arranque";
  if (value.includes("bolsa")) return "Bolsas Fondo Cuadrado";
  if (value.includes("dip")) return "Accesorios";

  return "Accesorios";
}

async function upsertFamilia(nombre: string) {
  return prisma.familiaProducto.upsert({
    where: { nombre },
    update: {},
    create: { nombre },
  });
}

async function upsertTipo(nombre: string) {
  return prisma.tipoProductoVenta.upsert({
    where: { nombre },
    update: {},
    create: { nombre },
  });
}

function getInitialUserConfig() {
  const isProduction = process.env.NODE_ENV === "production";
  const email = process.env.ADMIN_EMAIL ?? (isProduction ? undefined : "admin@gobio.ar");
  const password =
    process.env.ADMIN_PASSWORD ?? (isProduction ? undefined : "admin123456");
  const name = process.env.ADMIN_NAME ?? (isProduction ? undefined : "Admin GoBio");

  if (!email || !password || !name) {
    throw new Error(
      "ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_NAME are required to seed the initial user in production.",
    );
  }

  return { email: email.trim().toLowerCase(), password, name: name.trim() };
}

async function seedInitialUser() {
  const user = getInitialUserConfig();
  const existingUser = await prisma.user.findUnique({
    where: { email: user.email },
    select: { id: true },
  });

  if (existingUser) return;

  await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      passwordHash: await bcrypt.hash(user.password, 12),
      active: true,
    },
  });
}

async function main() {
  await seedInitialUser();

  for (const nombre of familiasIniciales) {
    await upsertFamilia(nombre);
  }

  for (const nombre of tiposIniciales) {
    await upsertTipo(nombre);
  }

  for (const producto of productosIniciales) {
    const [familia, tipoProductoVenta] = await Promise.all([
      upsertFamilia(inferirFamilia(producto.nombre)),
      upsertTipo(producto.tipo),
    ]);

    await prisma.producto.upsert({
      where: { sku: producto.sku },
      update: {
        nombre: producto.nombre,
        familiaId: familia.id,
        tipoProductoVentaId: tipoProductoVenta.id,
        tipoProduccion: "Propio",
        activo: true,
      },
      create: {
        sku: producto.sku,
        nombre: producto.nombre,
        familiaId: familia.id,
        tipoProductoVentaId: tipoProductoVenta.id,
        tipoProduccion: "Propio",
        activo: true,
      },
    });
  }

  for (const producto of productosExternos) {
    if (String(producto.tipoProductoVenta) === "Servicios") continue;

    const [familia, tipoProductoVenta] = await Promise.all([
      upsertFamilia(inferirFamilia(producto.nombre)),
      upsertTipo(producto.tipoProductoVenta),
    ]);

    await prisma.producto.upsert({
      where: { sku: producto.sku },
      update: {
        nombre: producto.nombre,
        familiaId: familia.id,
        tipoProductoVentaId: tipoProductoVenta.id,
        tipoProduccion: "Externo",
        activo: true,
      },
      create: {
        sku: producto.sku,
        nombre: producto.nombre,
        familiaId: familia.id,
        tipoProductoVentaId: tipoProductoVenta.id,
        tipoProduccion: "Externo",
        activo: true,
      },
    });
  }

  await prisma.forecastConfig.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
