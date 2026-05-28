import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PERIOD = { anio: 2026, mes: 1, nombre: "Precio Venta Promedio Enero 2026" };

const csv = `SKU,Producto,PrecioVentaPromedio
VPF-0016,Revolvedor 15cm - Madera,6.83
01-0005,Plato 22cm - Fibra Natural,103.22
01-0004,Plato 17cm - Fibra Natural,65.47
WD-103F,Tenedor 16cm - Madera,52.39
LZ-GO-75W(W),Bowl 1000 - Cana de Azucar,307.54
01-0007,Bandeja 103 (550ml / 18x12x3cm) - Fibra Natural,107.57
01-0012,Bandeja 105 (900ml / 18x15x4cm) - Fibra Natural,248.62
LZ-GO-TW12,Dip 2oz - Cana de Azucar,110.82
WD-101K,Cuchillo 16cm - Madera,49.26
LZ-GO-75G(W),Tapa Bowl 1000 - Cana de Azucar,94.27
LZ-GO-P-SH89,Estuche 950 Alto - Cana de Azucar,337.36
GO-ZW1000S,Bowl 850 - Cana de Azucar,322.32
TM-C002,Vaso 12oz (355ml) - Cana de Azucar,188.58
01-0013,Bowl 500 (500ml / diam 15cm) - Fibra Natural,158.13
01-0006,Bandeja 102 (300ml / 14x11x3cm) - Fibra Natural,77.27
09-0058,Tapa Bandeja 105 - PET Cristal,232.48
TM-C007,Vaso 8oz (240ml) - Cana de Azucar,188.01
PV-0005M,Portavaso Doble Valija (Carry Tray) - Papel Kraft,97.06
LZ-GO-TW16,Tapa Dip 2oz - Cana de Azucar,28.54
2915,Tapa Vaso 12oz y 14oz - Polipropileno - Mayo26,89.61
GO-ZW1000G,Tapa Bowl 850 - Cana de Azucar,83.74
SP0039,Sorbete 23cm (diam 9mm) Natural - Papel Kraft,34.51
LZ-GO-B004,Estuche 600 Rectangular - Cana de Azucar,259.91
09-0050,Tapa Bandeja 103 - PET Cristal,146.09
01-0003,Bowl 1000 (1000ml / diam 18cm) - Fibra Natural,267.10
WD-102S,Cuchara 16cm - Madera,61.85
09-0024,Tapa Bowl 500 - PET Cristal,94.41
0544-01-02,Cono Chico 14x9x4cm (Papas Fritas) - Papel Kraft,45.80
TO-BC50L,Bolsa Camiseta 40x50 Impresa - Bioplastico,210.75
01-0002,Bandeja 105 Ovalada (750ml / 22x14x4cm) - Fibra Natural,233.30
WD-104SP,Cuchara 7cm - Madera,27.40
09-0023,Tapa Bandeja 105 Ovalada - PET Cristal,203.06
PGRL-0001,Plato 23cm Natural - Papel Kraft,104.08
PCHL-0001,Plato 18cm Natural - Papel Kraft,89.86
LZ-GO-TW500,Bowl 500 - Cana de Azucar,188.29
TM-G004,Tapa Vaso 12oz y 14oz - Cana de Azucar,126.46
VSPB-0009,Collarin Multi Medida - Papel Kraft,34.91
09-0056,Tapa Bandeja 102 - PET Cristal,106.23
00013,Tenedor 16cm - TJ - Madera,62.69
CPV400,Portavaso Doble Universal - Papel Kraft,73.65
478,Tapa Vaso 8oz - Cana de Azucar - Mayo26,100.00
TM-G003,Tapa Vaso 8oz - Cana de Azucar,118.58
ZP-280C,Bowl 250 - Cana de Azucar,202.29
00012,Cuchara 16cm - TJ - Madera,44.16
LZ-GO-TWG700,Tapa Bowl 500 - Cana de Azucar,53.33
0543-01-03,Estuche Papas Fritas 12x8x6cm - Papel Kraft,50.43
LZ-GO-T-HB06,Estuche 500 Cuadrado - Cana de Azucar,260.91
PGRL-0002,Plato 23cm Blanco - Papel Kraft,110.80
0024-01-01,Estuche Sandwich 21x11x8cm - Papel Kraft,150.50
0149-01-01,Cono Grande 16x9x4cm (Papas Fritas) - Papel Kraft,50.51
PCHL-0002,Plato 18cm Blanco - Papel Kraft,89.37
LZ-GO-PSH08-3,Estuche 1250 con 3 Compartimentos - Cana de Azucar,418.50
SP0015,Sorbete 23cm (diam 9mm) Blanco - Papel Kraft,31.95
BFM-001,Bandeja N1 12x9cm - Papel Kraft,45.69
09-0025,Tapa Bowl 1000 - PET Cristal,232.90
BOL-0025,Bolsa con Fuelle N4A 15x23cm,15.95
479,Vaso 14oz (415ml) - Cana de Azucar,207.95
BFM-003,Bandeja N3 18x14cm - Papel Kraft,55.77
BFM-002,Bandeja N2 16x13cm - Papel Kraft,63.20
LZ-GO-YP06,Bandeja 850 Rectangular - Cana de Azucar,227.28
LZ-GO-YP07,Tapa Bandeja 850 Rectangular - Cana de Azucar,216.35
0082-01-01,Caja para Wok (730 cm3 - 24 Oz) Papel Kraft,257.34
0192-01-01,Estuche 103 con Tapa Papel Kraft,392.00
TO-BA40,Bolsa de Arranque 30x40 - Bioplastico,74.10
TO-BC50,Bolsa Camiseta 40x50 - Bioplastico,273.76
ZP-280CG,Tapa Bowl 250 - Cana de Azucar,92.47
0541-01-01,Estuche Hamburguesa Grande 14x14x9cm - Papel Kraft,177.00
0542-01-01,Estuche Hamburguesa Chico 9x8x7cm - Papel Kraft,97.00
LZ-GO-TW04,Vaso 4oz (120ml) - Cana de Azucar,79.20
TM-B102,Estuche 950 Bajo - Cana de Azucar,332.50
BFM-005,Bandeja N4 20x17cm - Papel Kraft,61.98
0085-01-01,Caja para Wok (1450 cm3 - 49 Oz) Papel Kraft,449.81
TO-BR30,Bolsa Rinon 20x30 - Bioplastico,68.87
0603-01-01,Estuche 105 con Tapa Papel Kraft,444.00
TO-BC30L,Bolsa Camiseta 20x30 Impresa - Bioplastico,95.00
LZ-GO-SH09-3,Estuche 1500 con 3 Compartimentos - Cana de Azucar,284.58
Imp-01,Impresiones 1000u,0
Imp-02,Impresiones 2000u,0
Imp-05,Impresiones 5000u,0
ENV-02,Envio Minorista CABA,0
ENV-03,Envio Minorista GBA 1,0
ENV-04,Envio Minorista GBA 2,0
ENV-05,Envio Mayorista CABA,0
ENV-06,Envio Mayorista Zona Norte,0
ENV-07,Envio Mayorista Zona Oeste,0
Env-01,Envio,0
Int-Tarjeta,Interes tarjeta,0
M-BsAs,Envio de Muestras a Buenos Aires Interior,0
M-Cor,Envio de Muestras a Cordoba,0
M-SanL,Envio de Muestras a San Luis,0
TO-BA20,Bolsa de Arranque 20x20 - Bioplastico,25.00
TO-BA30,Bolsa de Arranque 20x30 - Bioplastico,35.00`;

const explicitlyBlockedSkus = new Set([
  "IMP-01",
  "IMP-02",
  "IMP-05",
  "ENV-02",
  "ENV-03",
  "ENV-04",
  "ENV-05",
  "ENV-06",
  "ENV-07",
  "ENV-01",
  "INT-TARJETA",
  "M-BSAS",
  "M-COR",
  "M-SANL",
  "TO-BA20",
  "TO-BA30",
]);

const blockedSkuPrefixes = ["ENV-", "IMP-", "M-", "INT-"] as const;
const blockedNameTerms = ["envio", "impresion", "interes", "cargo financiero"] as const;

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const priceData = Array.from(
  csv
    .trim()
    .split("\n")
    .slice(1)
    .reduce((map, line) => {
      const [sku, producto, precioVentaPromedio] = line.split(",");
      map.set(sku.trim(), {
        sku: sku.trim(),
        producto: producto.trim(),
        precioVentaPromedio: Number(precioVentaPromedio),
      });
      return map;
    }, new Map<string, { sku: string; producto: string; precioVentaPromedio: number }>())
    .values(),
);

const shouldSkipInput = (item: { sku: string; producto: string; precioVentaPromedio: number }) => {
  const normalizedSku = item.sku.trim().toUpperCase();
  const normalizedProduct = normalizeText(item.producto);

  return (
    item.precioVentaPromedio <= 0 ||
    explicitlyBlockedSkus.has(normalizedSku) ||
    blockedSkuPrefixes.some((prefix) => normalizedSku.startsWith(prefix)) ||
    blockedNameTerms.some((term) => normalizedProduct.includes(term))
  );
};

async function main() {
  const periodo = await prisma.precioCostoMensualPeriodo.upsert({
    where: { anio_mes: { anio: PERIOD.anio, mes: PERIOD.mes } },
    update: { nombre: PERIOD.nombre },
    create: PERIOD,
  });

  let created = 0;
  let updated = 0;
  const skipped: string[] = [];
  const missing: string[] = [];

  for (const item of priceData) {
    if (!Number.isFinite(item.precioVentaPromedio)) {
      throw new Error(`Precio invalido para SKU ${item.sku}`);
    }

    if (shouldSkipInput(item)) {
      skipped.push(item.sku);
      continue;
    }

    const producto = await prisma.producto.findUnique({
      where: { sku: item.sku },
      select: {
        id: true,
        nombre: true,
        tipoProductoVenta: { select: { nombre: true } },
      },
    });

    if (!producto) {
      missing.push(item.sku);
      console.warn(`[WARN] SKU no encontrado: ${item.sku} - ${item.producto}`);
      continue;
    }

    const normalizedProductName = normalizeText(producto.nombre);
    if (
      producto.tipoProductoVenta.nombre === "Servicios" ||
      blockedNameTerms.some((term) => normalizedProductName.includes(term))
    ) {
      skipped.push(item.sku);
      continue;
    }

    const existingItem = await prisma.precioCostoMensualItem.findUnique({
      where: {
        periodoId_productoId: {
          periodoId: periodo.id,
          productoId: producto.id,
        },
      },
      select: { id: true },
    });

    if (existingItem) {
      await prisma.precioCostoMensualItem.update({
        where: { id: existingItem.id },
        data: { precioVentaPromedio: new Prisma.Decimal(item.precioVentaPromedio) },
      });
      updated += 1;
    } else {
      await prisma.precioCostoMensualItem.create({
        data: {
          periodoId: periodo.id,
          productoId: producto.id,
          precioVentaPromedio: new Prisma.Decimal(item.precioVentaPromedio),
          costoUnitarioPromedio: new Prisma.Decimal(0),
        },
      });
      created += 1;
    }
  }

  const check = await prisma.precioCostoMensualPeriodo.findUnique({
    where: { anio_mes: { anio: PERIOD.anio, mes: PERIOD.mes } },
    select: {
      nombre: true,
      anio: true,
      mes: true,
      _count: { select: { items: true } },
      items: {
        where: {
          OR: [
            { producto: { sku: { startsWith: "Imp-" } } },
            { producto: { sku: { startsWith: "ENV" } } },
            { producto: { sku: { startsWith: "Env" } } },
            { producto: { sku: { startsWith: "M-" } } },
            { producto: { sku: { startsWith: "Int-" } } },
          ],
        },
        select: {
          precioVentaPromedio: true,
          producto: { select: { sku: true, nombre: true } },
        },
      },
    },
  });

  console.log("Seed de precios venta promedio Enero 2026 finalizado.");
  console.log(`Periodo: ${PERIOD.nombre}`);
  console.log(`Precios creados: ${created}`);
  console.log(`Precios actualizados: ${updated}`);
  console.log(`SKUs omitidos por reglas de exclusion: ${skipped.join(", ") || "ninguno"}`);
  console.log(
    `SKUs no encontrados: ${missing.length ? missing.join(", ") : "ninguno"}`,
  );
  console.log(`Verificacion periodo guardado: ${JSON.stringify(check)}`);
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
