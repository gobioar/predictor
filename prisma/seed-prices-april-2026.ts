import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PERIOD = { anio: 2026, mes: 4, nombre: "Precio Venta Promedio Abril 2026" };

const csv = `SKU,Producto,PrecioVentaPromedio
LZ-GO-TW500,Bowl 500 - Caña de Azúcar,200.27
VPF-0016,Revolvedor 15cm - Madera,8.68
TM-B102,Estuche 950 Bajo - Caña de Azúcar,375.50
LZ-GO-TWG700,Tapa Bowl 500 - Caña de Azúcar,49.90
WD-102S,Cuchara 16cm - Madera,61.67
LZ-GO-TW12,Dip 2oz - Caña de Azúcar,95.26
WD-103F,Tenedor 16cm - Madera,57.82
01-0004,Plato 17cm - Fibra Natural,88.58
477,Vaso 8oz (240ml) - Caña de Azúcar - Mayo26,174.68
01-0003,Bowl 1000 (1000ml / ø18cm) - Fibra Natural,299.58
LZ-GO-TW16,Tapa Dip 2oz - Caña de Azúcar,26.07
ZP-280C,Bowl 250 - Caña de Azúcar,157.89
01-0005,Plato 22cm - Fibra Natural,120.16
LZ-GO-P-SH89,Estuche 950 Alto - Caña de Azúcar,322.43
LZ-GO-75W(W),Bowl 1000 - Caña de Azúcar,320.82
09-0025,Tapa Bowl 1000 - PET Cristal,224.39
LZ-GO-75G(W),Tapa Bowl 1000 - Caña de Azúcar,101.09
01-0007,Bandeja 103 (550ml / 18x12x3cm) - Fibra Natural,159.52
GO-ZW1000S,Bowl 850 - Caña de Azúcar,296.80
LZ-GO-YP06,Bandeja 850 Rectangular - Caña de Azúcar,189.44
LZ-GO-YP07,Tapa Bandeja 850 Rectangular - Caña de Azúcar,155.61
GO-ZW1000G,Tapa Bowl 850 - Caña de Azúcar,92.98
WD-101K,Cuchillo 16cm - Madera,56.27
01-0013,Bowl 500 (500ml / Ø15cm) - Fibra Natural,185.33
09-0050,Tapa Bandeja 103 - PET Cristal,210.67
ZP-280CG,Tapa Bowl 250 - Caña de Azúcar,41.39
01-0012,Bandeja 105 (900ml / 18x15x4cm) - Fibra Natural,303.17
01-0006,Bandeja 102 (300ml / 14x11x3cm) - Fibra Natural,111.73
TM-C007,Vaso 8oz (240ml) - Caña de Azúcar,203.55
PCHL-0001,Plato 18cm Natural - Papel Kraft,102.28
TO-BA30,Bolsa de Arranque 20x30 - Bioplástico,37.06
01-0002,Bandeja 105 Ovalada (750ml / 22x14x4cm) - Fibra Natural,312.39
09-0023,Tapa Bandeja 105 Ovalada - PET Cristal,247.06
PV-0005M,Portavaso Doble Valija (Carry Tray) - Papel Kraft,121.67
SER-005B,Servilletas 18x18cm Papel Tissue Beige,4.72
VSPB-0009,Collarín Multi Medida - Papel Kraft,37.68
LZ-GO-T-HB06,Estuche 500 Cuadrado - Caña de Azúcar,288.90
TO-BA40,Bolsa de Arranque 30x40 - Bioplástico,62.96
09-0058,Tapa Bandeja 105 - PET Cristal,285.12
LZ-GO-B004,Estuche 600 Rectangular - Caña de Azúcar,306.11
09-0024,Tapa Bowl 500 - PET Cristal,143.19
TO-BC50,Bolsa Camiseta 40x50 - Bioplástico,232.60
BFM-003,Bandeja N3 18x14cm - Papel Kraft,93.56
TO-BC40,Bolsa Camiseta 30x40 - Bioplástico,111.87
PCHL-0002,Plato 18cm Blanco - Papel Kraft,113.11
LZ-GO-PSH08-3,Estuche 1250 con 3 Compartimentos - Caña de Azúcar,395.44
WD-104SP,Cuchara 7cm - Madera,31.68
479,Vaso 14oz (415ml) - Caña de Azúcar,218.96
TO-BA20,Bolsa de Arranque 20x20 - Bioplástico,29.60
CPV400,Portavaso Doble Universal - Papel Kraft,99.76
LZ-GO-TW04,Vaso 4oz (120ml) - Caña de Azúcar,90.44
TO-BA30L,Bolsa de Arranque 20x30 Impresa - Bioplástico,38.25
BFM-002,Bandeja N2 16x13cm - Papel Kraft,78.16
PGRL-0002,Plato 23cm Blanco - Papel Kraft,130.33
2915,Tapa Vaso 12oz y 14oz - Polipropileno - Mayo26,127.34
TO-BC40L,Bolsa Camiseta 30x40 Impresa - Bioplástico,117.19
TM-C002,Vaso 12oz (355ml) - Caña de Azúcar,211.78
01-0008,Estuche 950 Alto (950ml / 23x15x8 cm) - Fibra Natural,376.39
SP0039,Sorbete 23cm (ø9mm) Natural - Papel Kraft,48.19
TO-BA20L,Bolsa de Arranque 20x20 Impresa - Bioplástico,26.02
PGRL-0001,Plato 23cm Natural - Papel Kraft,130.42
0149-01-01,Cono Grande 16x9x4cm (Papas Fritas) - Papel Kraft,62.80
BOLSA-FM9-DU,Bolsa Cuadrada FM9 28x18x47cm,282.15
TO-BR40,Bolsa Riñón 30x40 - Bioplástico,105.04
BFM-005,Bandeja N4 20x17cm - Papel Kraft,114.10
BFM-001,Bandeja N1 12x9cm - Papel Kraft,52.06
09-0056,Tapa Bandeja 102 - PET Cristal,120.93
TO-BR50,Bolsa Riñón 40x50 - Bioplástico,208.80
0085-01-01,Caja para Wok (1450 cm3 - 49 Oz) Papel Kraft,552.34
0544-01-02,Cono Chico 14x9x4cm (Papas Fritas) - Papel Kraft,52.33
TM-G003,Tapa Vaso 8oz - Caña de Azúcar,118.75
SP0015,Sorbete 23cm (ø9mm) Blanco - Papel Kraft,39.68
TO-BR30,Bolsa Riñón 20x30 - Bioplástico,59.66
0543-01-03,Estuche Papas Fritas 12x8x6cm - Papel Kraft,108.50
TO-BC30,Bolsa Camiseta 20x30 - Bioplástico,91.74
TO-BC50L,Bolsa Camiseta 40x50 Impresa - Bioplástico,219.59
0541-01-01,Estuche Hamburguesa Grande 14x14x9cm - Papel Kraft,168.15
0081-01-01,Caja para Wok (360 cm3 - 12 Oz) Papel Kraft,189.16
LZ-GO-SH09-3,Estuche 1500 con 3 Compartimentos - Caña de Azúcar,401.17
TO-BC30L,Bolsa Camiseta 20x30 Impresa - Bioplástico,74.54
TO-BR30L,Bolsa Riñón 20x30 Impresa - Bioplástico,60.18
0082-01-01,Caja para Wok (730 cm3 - 24 Oz) Papel Kraft,280.66
0024-01-01,Estuche Sandwich 21x11x8cm - Papel Kraft,590.10
ENV-05,Envío Mayorista CABA,0
ENV-02,Envío Minorista CABA,0
Env-01,Envío,0
ENV-06,Envío Mayorista Zona Norte,0
ENV-04,Envío Minorista GBA 2,0`;

const blockedSkuPrefixes = ["ENV-", "IMP-", "M-", "INT-"] as const;
const blockedNameTerms = ["envio", "impresion", "interes"] as const;

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

const shouldSkipInput = (item: { sku: string; producto: string }) => {
  const normalizedSku = item.sku.trim().toUpperCase();
  const normalizedProduct = normalizeText(item.producto);

  return (
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
      throw new Error(`Precio inválido para SKU ${item.sku}`);
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
    where: { anio_mes: { anio: 2026, mes: 4 } },
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
          ],
        },
        select: { producto: { select: { sku: true } } },
      },
    },
  });

  console.log("Seed de precios venta promedio Abril 2026 finalizado.");
  console.log(`Período: ${PERIOD.nombre}`);
  console.log(`Precios creados: ${created}`);
  console.log(`Precios actualizados: ${updated}`);
  console.log(`SKUs omitidos por reglas de exclusión: ${skipped.join(", ") || "ninguno"}`);
  console.log(
    `SKUs no encontrados: ${missing.length ? missing.join(", ") : "ninguno"}`,
  );
  console.log(`Verificación período guardado: ${JSON.stringify(check)}`);
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
