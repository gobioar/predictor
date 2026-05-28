import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PERIOD = { anio: 2026, mes: 2, nombre: "Febrero 2026 sin Impuestos" };

const csv = `SKU,Producto,CostoUnitario
LZ-GO-P-SH89,Estuche 950 Alto - Caña de Azúcar,119.27
LZ-GO-TW500,Bowl 500 - Caña de Azúcar,46.95
LZ-GO-TWG700,Tapa Bowl 500 - Caña de Azúcar,36.37
LZ-GO-75W(W),Bowl 1000 - Caña de Azúcar,100.73
LZ-GO-75W,Bowl 1000 Marron - Caña de Azúcar,100.73
LZ-GO-75G(W),Tapa Bowl 1000 - Caña de Azúcar,70.17
LZ-GO-75G,Tapa Bowl 1000 Marron - Caña de Azúcar,70.17
LZ-GO-TW12,Dip 2oz - Caña de Azúcar,20.60
LZ-GO-TW16,Tapa Dip 2oz - Caña de Azúcar,14.66
LZ-GO-YP06,Bandeja 850 Rectangular - Caña de Azúcar,89.62
LZ-GO-YP07,Tapa Bandeja 850 Rectangular - Caña de Azúcar,81.67
WD-101K,Cuchillo 16cm - Madera,15.12
WD-102S,Cuchara 16cm - Madera,16.54
WD-103F,Tenedor 16cm - Madera,15.71
TM-C007,Vaso 8oz (240ml) - Caña de Azúcar,77.95
GO-ZW1000S,Bowl 850 - Caña de Azúcar,100.41
GO-ZW1000G,Tapa Bowl 850 - Caña de Azúcar,51.61
LZ-GO-T-HB06,Estuche 500 Cuadrado - Caña de Azúcar,115.20
LZ-GO-B004,Estuche 600 Rectangular - Caña de Azúcar,100.59
TM-G003,Tapa Vaso 8oz - Caña de Azúcar,75.90
TM-C002,Vaso 12oz (355ml) - Caña de Azúcar,97.01
TM-C002-01,Vaso 12oz (355ml) - Para Fríos - Caña de Azúcar,97.01
TM-G004,Tapa Vaso 12oz y 14oz - Caña de Azúcar,83.99
TM-B102,Estuche 950 Bajo - Caña de Azúcar,209.48
LZ-GO-SH09-3,Estuche 1500 con 3 Compartimentos - Caña de Azúcar,314.28
WD-104SP,Cuchara 7cm - Madera,18.00
01-0004,Plato 17cm - Fibra Natural,41.78
01-0005,Plato 22cm - Fibra Natural,63.28
PCHL-0002,Plato 18cm Blanco - Papel Kraft,61.75
PCHL-0001,Plato 18cm Natural - Papel Kraft,61.75
PGRL-0002,Plato 23cm Blanco - Papel Kraft,80.96
PGRL-0001,Plato 23cm Natural - Papel Kraft,80.96
0543-01-03,Estuche Papas Fritas 12x8x6cm - Papel Kraft,61.61
0024-01-01,Estuche Sandwich 21x11x8cm - Papel Kraft,127.54
0542-01-01,Estuche Hamburguesa Chico 9x8x7cm - Papel Kraft,51.23
0541-01-01,Estuche Hamburguesa Grande 14x14x9cm - Papel Kraft,93.07
0192-01-01,Estuche 103 con Tapa Papel Kraft,194.60
0193-01-01,Estuche 103 con Tapa y Ventana Papel Kraft,285.80
0601-01-01,Estuche 105 sin Tapa Papel Kraft,199.83
0603-01-01,Estuche 105 con Tapa Papel Kraft,225.87
0152-01-01,Estuche 105 con Tapa y Ventana Papel Kraft,233.57
0194-01-01,Estuche 107 sin Tapa Papel Kraft,285.56
0195-01-01,Estuche 107 con Tapa Papel Kraft,371.95
0196-01-01,Estuche 107 con Tapa y Ventana Papel Kraft,454.25
01-0006,Bandeja 102 (300ml / 14x11x3cm) - Fibra Natural,59.07
09-0056,Tapa Bandeja 102 - PET Cristal,79.68
01-0007,Bandeja 103 (550ml / 18x12x3cm) - Fibra Natural,80.67
09-0050,Tapa Bandeja 103 - PET Cristal,109.40
01-0012,Bandeja 105 (900ml / 18x15x4cm) - Fibra Natural,172.88
09-0058,Tapa Bandeja 105 - PET Cristal,51.32
01-0002,Bandeja 105 Ovalada (750ml / 22x14x4cm) - Fibra Natural,152.14
09-0023,Tapa Bandeja 105 Ovalada - PET Cristal,122.90
0085-01-01,Caja para Wok (1450 cm3 - 49 Oz) Papel Kraft,321.65
0081-01-01,Caja para Wok (360 cm3 - 12 Oz) Papel Kraft,89.94
0087-01-01,Caja para Wok (360 cm3 - 12 Oz) Papel Kraft,123.14
0082-01-01,Caja para Wok (730 cm3 - 24 Oz) Papel Kraft,158.82
0086-01-01,Caja para Wok (750 cm3 - 25 Oz) Papel Kraft,200.55
BFM-001,Bandeja N1 12x9cm - Papel Kraft,28.00
BFM-002,Bandeja N2 16x13cm - Papel Kraft,42.00
BFM-003,Bandeja N3 18x14cm - Papel Kraft,47.50
BFM-005,Bandeja N4 20x17cm - Papel Kraft,33.60
BOL-0020,Bolsa con Fuelle N2 9x18cm,6.93
BOL-0022,Bolsa con Fuelle N3 11x25cm,8.82
BOL-0025,Bolsa con Fuelle N4A 15x23cm,9.29
BOL-0027,Bolsa con Fuelle N6 15x33cm,14.19
BOL-0029,Bolsa con Fuelle N7 19x35cm,16.54
BOL-0030,Bolsa con Fuelle N8 19x44cm,21.96
BOLSA-FM3-DU,Bolsa Cuadrada FM3 12x8x24cm,45.47
BOLSA-FM4-DU,Bolsa Cuadrada FM4 16x10x30cm,54.10
BOLSA-FM5-DU,Bolsa Cuadrada FM5 20x11x30cm,59.00
BOLSA-FM7-DU,Bolsa Cuadrada FM7 26x12x37cm,83.80
BOLSA-FM8-DU,Bolsa Cuadrada FM8 26x17x38cm,104.76
BOLSA-FM9-DU,Bolsa Cuadrada FM9 28x18x47cm,156.25
VSPB-0009,Collarín Multi Medida - Papel Kraft,20.21
0544-01-02,Cono Chico 14x9x4cm (Papas Fritas) - Papel Kraft,24.74
0149-01-01,Cono Grande 16x9x4cm (Papas Fritas) - Papel Kraft,35.76
CPV400,Portavaso Doble Universal - Papel Kraft,62.87
PV-0005M,Portavaso Doble Valija (Carry Tray) - Papel Kraft,71.40
SP0039,Sorbete 23cm (ø9mm) Natural - Papel Kraft,24.60
VPF-0016,Revolvedor 15cm - Madera,4.40
479,Vaso 14oz (415ml) - Caña de Azúcar,116.75
Imp-01,Impresiones 1000u,69.40
Imp-10,Impresiones 10000u,34.72
Imp-15,Impresiones 15000u,34.72
Imp-02,Impresiones 2000u,41.49
Imp-05,Impresiones 5000u,38.02
01-0013,Bowl 500 (500ml / Ø15cm) - Fibra Natural,95.08
09-0024,Tapa Bowl 500 - PET Cristal,51.32
01-0003,Bowl 1000 (1000ml / ø18cm) - Fibra Natural,172.88
ZP-280C,Bowl 250 - Caña de Azúcar,46.84
ZP-280CG,Tapa Bowl 250 - Caña de Azúcar,54.30
00012,Cuchara 16cm - TJ - Madera,30.78
2414,Cuchara 14cm - Innova - Madera,33.06
00128,Dip 2oz (60ml) - Biopack - Caña de Azúcar,117.98
0009-01-01,Dip 2oz (60ml 5x5x3cm) - Papel Kraft,62.57
M-BsAs,Envío de Muestras a Buenos Aires Interior,10800.83
ENV-05,Envío Mayorista CABA,20247.17
ENV-02,Envío Minorista CABA,4868.18
ENV-06,Envío Mayorista Zona Norte,32056.35
ENV-07,Envío Mayorista Zona Oeste,32056.35
ENV-08,Envío Mayorista Zona Sur,32056.35
ENV-03,Envío Minorista GBA 1,7150.00
ENV-04,Envío Minorista GBA 2,9524.35
M-CABA,Envío de Muestras a CABA,4867.17
M-Catam,Envío de Muestras a Catamarca,16427.46
M-Chub,Envío de Muestras a Chubut,18189.41
M-Chac,Envío de Muestras a Chaco,16427.46
M-Cor,Envío de Muestras a Córdoba,13071.73
M-Corri,Envío de Muestras a Corrientes,16427.46
M-Form,Envío de Muestras a Formosa,16427.46
M-GBA1,Envío de Muestras a GBA1,7150.00
M-GBA2,Envío de Muestras a GBA2,9524.10
M-Jujuy,Envío de Muestras a Jujuy,16427.46
M-Misio,Envío de Muestras a Misiones,16427.46
M-Neuq,Envío de Muestras a Neuquén,16427.46
M-Salta,Envío de Muestras a Salta,16427.46
M-Tucu,Envío de Muestras a Tucumán,13691.55
M-ERios,Envío de Muestras a Entre Ríos,13691.55
M-LaPam,Envío de Muestras a La Pampa,13691.55
M-LaRio,Envío de Muestras a La Rioja,16427.46
M-RioN,Envío de Muestras a Río Negro,18189.42
M-SanJ,Envío de Muestras a San Juan,13691.55
M-SanL,Envío de Muestras a San Luis,13691.55
M-SCruz,Envío de Muestras a Santa Cruz,18189.42
M-StaFé,Envío de Muestras a Santa Fé,13071.73
M-SdEst,Envío de Muestras a Santiago del Estero,16427.46
M-TdFueg,Envío de Muestras a Tierra del Fuego,34623.19
SER-005B,Servilletas 18x18cm Papel Tissue Beige,2.76
SER-0020,Servilletas 24x24cm Papel Tissue Beige,4.34
SER-0026,Servilletas 30x30cm Papel Tissue Beige,6.35
SER-0007,Servilletas 18x18cm Papel Tissue Beige Impresas,3.17
SER-0012,Servilletas 24x24cm Papel Tissue Beige Impresas,6.71
SER-0015L,Servilletas 30x30cm Papel Tissue Beige Impresas,10.34
SP0015,Sorbete 23cm (ø9mm) Blanco - Papel Kraft,24.60
09-0025,Tapa Bowl 1000 - PET Cristal,51.32
TM-C007-2,Vaso 8oz (240ml) para Tapas - Caña de Azúcar,77.95
TO-BC30,Bolsa Camiseta 20x30 - Bioplástico,26.85
TO-BC30L,Bolsa Camiseta 20x30 Impresa - Bioplástico,28.90
TO-BC40,Bolsa Camiseta 30x40 - Bioplástico,46.35
TO-BC40L,Bolsa Camiseta 30x40 Impresa - Bioplástico,48.47
TO-BC50,Bolsa Camiseta 40x50 - Bioplástico,92.69
TO-BC50L,Bolsa Camiseta 40x50 Impresa - Bioplástico,95.47
TO-BA20,Bolsa de Arranque 20x20 - Bioplástico,9.62
TO-BA20L,Bolsa de Arranque 20x20 Impresa - Bioplástico,10.57
TO-BA30,Bolsa de Arranque 20x30 - Bioplástico,14.11
TO-BA30L,Bolsa de Arranque 20x30 Impresa - Bioplástico,15.54
TO-BA40,Bolsa de Arranque 30x40 - Bioplástico,24.34
TO-BA40L,Bolsa de Arranque 30x40 Impresa - Bioplástico,27.05
TO-BR30,Bolsa Riñón 20x30 - Bioplástico,20.47
TO-BR30L,Bolsa Riñón 20x30 Impresa - Bioplástico,22.46
TO-BR40,Bolsa Riñón 30x40 - Bioplástico,44.34
TO-BR40L,Bolsa Riñón 30x40 Impresa - Bioplástico,46.39
TO-BR50,Bolsa Riñón 40x50 - Bioplástico,83.90
TO-BR50L,Bolsa Riñón 40x50 - Impresa - Bioplástico,86.13
LZ-GO-PSH08-3,Estuche 1250 con 3 Compartimentos - Caña de Azúcar,135.32
LZ-GO-TW04,Vaso 4oz (120ml) - Caña de Azúcar,28.42
477,Vaso 8oz (240ml) - Caña de Azúcar - Mayo26,99.67
478,Tapa Vaso 8oz - Caña de Azúcar - Mayo26,68.93
2915,Tapa Vaso 12oz y 14oz - Polipropileno - Mayo26,72.60
00013,Tenedor 16cm - TJ - Madera,31.40
WD-2424,Tenedor 16cm - Innova - Madera,18.00`;

const blockedSkuPrefixes = ["IMP-", "ENV", "M-", "INT-"] as const;
const blockedNameTerms = ["envio", "impresion", "interes"] as const;

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const costData = csv
  .trim()
  .split("\n")
  .slice(1)
  .map((line) => {
    const [sku, producto, costoUnitario] = line.split(",");
    return {
      sku: sku.trim(),
      producto: producto.trim(),
      costoUnitario: Number(costoUnitario),
    };
  });

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

  for (const item of costData) {
    if (!Number.isFinite(item.costoUnitario)) {
      throw new Error(`Costo inválido para SKU ${item.sku}`);
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
        data: { costoUnitarioPromedio: new Prisma.Decimal(item.costoUnitario) },
      });
      updated += 1;
    } else {
      await prisma.precioCostoMensualItem.create({
        data: {
          periodoId: periodo.id,
          productoId: producto.id,
          precioVentaPromedio: new Prisma.Decimal(0),
          costoUnitarioPromedio: new Prisma.Decimal(item.costoUnitario),
        },
      });
      created += 1;
    }
  }

  const check = await prisma.precioCostoMensualPeriodo.findUnique({
    where: { anio_mes: { anio: 2026, mes: 2 } },
    select: { nombre: true, anio: true, mes: true, _count: { select: { items: true } } },
  });

  console.log("Seed de costos unitarios Febrero 2026 finalizado.");
  console.log(`Período: ${PERIOD.nombre}`);
  console.log(`Costos creados: ${created}`);
  console.log(`Costos actualizados: ${updated}`);
  console.log(`SKUs omitidos por reglas de exclusión: ${skipped.length}`);
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
