import { PrismaClient } from "@prisma/client";

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
  if (value.includes("bolsa camiseta")) return "Bolsas Camiseta";
  if (value.includes("bolsa riñón")) return "Bolsas Riñón";
  if (value.includes("bolsa de arranque")) return "Bolsas de Arranque";
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

async function main() {
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
        activo: true,
      },
      create: {
        sku: producto.sku,
        nombre: producto.nombre,
        familiaId: familia.id,
        tipoProductoVentaId: tipoProductoVenta.id,
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
