import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PERIOD = { anio: 2026, mes: 2, nombre: "Precio Venta Promedio Febrero 2026" };

const csv = `SKU,Producto,PrecioVentaPromedio
VPF-0016,Revolvedor 15cm - Madera,7.89
WD-103F,Tenedor 16cm - Madera,53.45
01-0004,Plato 17cm - Fibra Natural,75.74
01-0005,Plato 22cm - Fibra Natural,98.95
WD-102S,Cuchara 16cm - Madera,55.07
LZ-GO-TW12,Dip 2oz - Cana de Azucar,94.74
GO-ZW1000S,Bowl 850 - Cana de Azucar,277.19
GO-ZW1000G,Tapa Bowl 850 - Cana de Azucar,76.05
LZ-GO-TW16,Tapa Dip 2oz - Cana de Azucar,41.93
TM-C007,Vaso 8oz (240ml) - Cana de Azucar,203.61
LZ-GO-P-SH89,Estuche 950 Alto - Cana de Azucar,368.53
LZ-GO-TW04,Vaso 4oz (120ml) - Cana de Azucar,74.25
LZ-GO-75W(W),Bowl 1000 - Cana de Azucar,287.56
PCHL-0001,Plato 18cm Natural - Papel Kraft,95.28
0149-01-01,Cono Grande 16x9x4cm (Papas Fritas) - Papel Kraft,58.82
SP0039,Sorbete 23cm (diam 9mm) Natural - Papel Kraft,39.78
LZ-GO-75G(W),Tapa Bowl 1000 - Cana de Azucar,93.56
LZ-GO-TW500,Bowl 500 - Cana de Azucar,211.91
01-0003,Bowl 1000 (1000ml / diam 18cm) - Fibra Natural,268.43
LZ-GO-TWG700,Tapa Bowl 500 - Cana de Azucar,54.45
PV-0005M,Portavaso Doble Valija (Carry Tray) - Papel Kraft,117.41
TO-BA20,Bolsa de Arranque 20x20 - Bioplastico,25.32
TO-BC50,Bolsa Camiseta 40x50 - Bioplastico,221.03
01-0013,Bowl 500 (500ml / diam 15cm) - Fibra Natural,150.06
0544-01-02,Cono Chico 14x9x4cm (Papas Fritas) - Papel Kraft,45.97
TM-C002,Vaso 12oz (355ml) - Cana de Azucar,221.54
TO-BC40,Bolsa Camiseta 30x40 - Bioplastico,116.75
09-0025,Tapa Bowl 1000 - PET Cristal,233.37
479,Vaso 14oz (415ml) - Cana de Azucar,218.21
01-0007,Bandeja 103 (550ml / 18x12x3cm) - Fibra Natural,155.32
TO-BA40,Bolsa de Arranque 30x40 - Bioplastico,65.83
01-0012,Bandeja 105 (900ml / 18x15x4cm) - Fibra Natural,283.72
01-0006,Bandeja 102 (300ml / 14x11x3cm) - Fibra Natural,109.04
PGRL-0001,Plato 23cm Natural - Papel Kraft,129.32
LZ-GO-B004,Estuche 600 Rectangular - Cana de Azucar,257.49
WD-104SP,Cuchara 7cm - Madera,34.16
09-0058,Tapa Bandeja 105 - PET Cristal,277.36
LZ-GO-T-HB06,Estuche 500 Cuadrado - Cana de Azucar,277.67
01-0002,Bandeja 105 Ovalada (750ml / 22x14x4cm) - Fibra Natural,203.18
VSPB-0009,Collarin Multi Medida - Papel Kraft,34.67
09-0024,Tapa Bowl 500 - PET Cristal,96.98
09-0023,Tapa Bandeja 105 Ovalada - PET Cristal,189.30
TM-G003,Tapa Vaso 8oz - Cana de Azucar,110.92
PGRL-0002,Plato 23cm Blanco - Papel Kraft,130.09
PCHL-0002,Plato 18cm Blanco - Papel Kraft,103.30
478,Tapa Vaso 8oz - Cana de Azucar - Mayo26,116.96
CPV400,Portavaso Doble Universal - Papel Kraft,109.55
TM-G004,Tapa Vaso 12oz y 14oz - Cana de Azucar,124.82
09-0050,Tapa Bandeja 103 - PET Cristal,182.77
TM-B102,Estuche 950 Bajo - Cana de Azucar,393.20
BFM-002,Bandeja N2 16x13cm - Papel Kraft,73.07
SP0015,Sorbete 23cm (diam 9mm) Blanco - Papel Kraft,31.93
2915,Tapa Vaso 12oz y 14oz - Polipropileno - Mayo26,110.70
09-0056,Tapa Bandeja 102 - PET Cristal,128.83
LZ-GO-YP06,Bandeja 850 Rectangular - Cana de Azucar,211.70
TO-BA20L,Bolsa de Arranque 20x20 Impresa - Bioplastico,30.02
LZ-GO-YP07,Tapa Bandeja 850 Rectangular - Cana de Azucar,186.33
BFM-001,Bandeja N1 12x9cm - Papel Kraft,55.69
TO-BA30,Bolsa de Arranque 20x30 - Bioplastico,37.42
TO-BR40L,Bolsa Rinon 30x40 Impresa - Bioplastico,126.35
BFM-003,Bandeja N3 18x14cm - Papel Kraft,71.96
LZ-GO-SH09-3,Estuche 1500 con 3 Compartimentos - Cana de Azucar,433.97
BFM-005,Bandeja N4 20x17cm - Papel Kraft,68.25
0024-01-01,Estuche Sandwich 21x11x8cm - Papel Kraft,220.53
TO-BA30L,Bolsa de Arranque 20x30 Impresa - Bioplastico,42.00
0543-01-03,Estuche Papas Fritas 12x8x6cm - Papel Kraft,99.69
0541-01-01,Estuche Hamburguesa Grande 14x14x9cm - Papel Kraft,177.00
0192-01-01,Estuche 103 con Tapa Papel Kraft,392.00
TO-BC40L,Bolsa Camiseta 30x40 Impresa - Bioplastico,123.86
ZP-280C,Bowl 250 - Cana de Azucar,131.48
ZP-280CG,Tapa Bowl 250 - Cana de Azucar,91.27
0082-01-01,Caja para Wok (730 cm3 - 24 Oz) Papel Kraft,305.68
0542-01-01,Estuche Hamburguesa Chico 9x8x7cm - Papel Kraft,97.00
TO-BR30,Bolsa Rinon 20x30 - Bioplastico,48.89
TO-BR30L,Bolsa Rinon 20x30 Impresa - Bioplastico,68.00
TO-BR50,Bolsa Rinon 40x50 - Bioplastico,215.25
ENV-02,Envio Minorista CABA,0
ENV-05,Envio Mayorista CABA,0
ENV-03,Envio Minorista GBA 1,0
ENV-04,Envio Minorista GBA 2,0
ENV-06,Envio Mayorista Zona Norte,0
Env-01,Envio,0
M-BsAs,Envio de Muestras a Buenos Aires Interior,0`;

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
          ],
        },
        select: { producto: { select: { sku: true } } },
      },
    },
  });

  console.log("Seed de precios venta promedio Febrero 2026 finalizado.");
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
