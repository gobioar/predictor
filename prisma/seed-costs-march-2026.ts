import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PERIOD = { anio: 2026, mes: 3, nombre: "Marzo 2026 sin Impuestos" };

const costData = [
  { sku: "LZ-GO-P-SH89", producto: "Estuche 950 Alto - Caña de Azúcar", costoUnitario: 115.6 },
  { sku: "LZ-GO-TW500", producto: "Bowl 500 - Caña de Azúcar", costoUnitario: 45.49 },
  { sku: "LZ-GO-TWG700", producto: "Tapa Bowl 500 - Caña de Azúcar", costoUnitario: 35.25 },
  { sku: "LZ-GO-75W(W)", producto: "Bowl 1000 - Caña de Azúcar", costoUnitario: 97.61 },
  { sku: "LZ-GO-75W", producto: "Bowl 1000 Marron - Caña de Azúcar", costoUnitario: 97.61 },
  { sku: "LZ-GO-75G(W)", producto: "Tapa Bowl 1000 - Caña de Azúcar", costoUnitario: 67.99 },
  { sku: "LZ-GO-75G", producto: "Tapa Bowl 1000 Marron - Caña de Azúcar", costoUnitario: 67.99 },
  { sku: "LZ-GO-TW12", producto: "Dip 2oz - Caña de Azúcar", costoUnitario: 19.97 },
  { sku: "LZ-GO-TW16", producto: "Tapa Dip 2oz - Caña de Azúcar", costoUnitario: 14.21 },
  { sku: "LZ-GO-YP06", producto: "Bandeja 850 Rectangular - Caña de Azúcar", costoUnitario: 86.86 },
  { sku: "LZ-GO-YP07", producto: "Tapa Bandeja 850 Rectangular - Caña de Azúcar", costoUnitario: 79.16 },
  { sku: "WD-101K", producto: "Cuchillo 16cm - Madera", costoUnitario: 14.65 },
  { sku: "WD-102S", producto: "Cuchara 16cm - Madera", costoUnitario: 16.03 },
  { sku: "WD-103F", producto: "Tenedor 16cm - Madera", costoUnitario: 15.22 },
  { sku: "TM-C007", producto: "Vaso 8oz (240ml) - Caña de Azúcar", costoUnitario: 75.55 },
  { sku: "GO-ZW1000S", producto: "Bowl 850 - Caña de Azúcar", costoUnitario: 97.3 },
  { sku: "GO-ZW1000G", producto: "Tapa Bowl 850 - Caña de Azúcar", costoUnitario: 50.01 },
  { sku: "LZ-GO-T-HB06", producto: "Estuche 500 Cuadrado - Caña de Azúcar", costoUnitario: 111.66 },
  { sku: "LZ-GO-B004", producto: "Estuche 600 Rectangular - Caña de Azúcar", costoUnitario: 97.5 },
  { sku: "TM-G003", producto: "Tapa Vaso 8oz - Caña de Azúcar", costoUnitario: 73.57 },
  { sku: "TM-C002", producto: "Vaso 12oz (355ml) - Caña de Azúcar", costoUnitario: 94.03 },
  { sku: "TM-C002-01", producto: "Vaso 12oz (355ml) - Para Fríos - Caña de Azúcar", costoUnitario: 94.03 },
  { sku: "TM-G004", producto: "Tapa Vaso 12oz y 14oz - Caña de Azúcar", costoUnitario: 81.41 },
  { sku: "TM-B102", producto: "Estuche 950 Bajo - Caña de Azúcar", costoUnitario: 203.04 },
  { sku: "LZ-GO-SH09-3", producto: "Estuche 1500 con 3 Compartimentos - Caña de Azúcar", costoUnitario: 304.62 },
  { sku: "WD-104SP", producto: "Cuchara 7cm - Madera", costoUnitario: 18 },
  { sku: "01-0004", producto: "Plato 17cm - Fibra Natural", costoUnitario: 41.78 },
  { sku: "01-0005", producto: "Plato 22cm - Fibra Natural", costoUnitario: 67.71 },
  { sku: "PCHL-0002", producto: "Plato 18cm Blanco - Papel Kraft", costoUnitario: 61.75 },
  { sku: "PCHL-0001", producto: "Plato 18cm Natural - Papel Kraft", costoUnitario: 61.75 },
  { sku: "PGRL-0002", producto: "Plato 23cm Blanco - Papel Kraft", costoUnitario: 80.96 },
  { sku: "PGRL-0001", producto: "Plato 23cm Natural - Papel Kraft", costoUnitario: 80.96 },
  { sku: "0543-01-03", producto: "Estuche Papas Fritas 12x8x6cm - Papel Kraft", costoUnitario: 54.76 },
  { sku: "0024-01-01", producto: "Estuche Sandwich 21x11x8cm - Papel Kraft", costoUnitario: 113.37 },
  { sku: "0542-01-01", producto: "Estuche Hamburguesa Chico 9x8x7cm - Papel Kraft", costoUnitario: 44.66 },
  { sku: "0541-01-01", producto: "Estuche Hamburguesa Grande 14x14x9cm - Papel Kraft", costoUnitario: 95.23 },
  { sku: "0192-01-01", producto: "Estuche 103 con Tapa Papel Kraft", costoUnitario: 194.6 },
  { sku: "0193-01-01", producto: "Estuche 103 con Tapa y Ventana Papel Kraft", costoUnitario: 285.8 },
  { sku: "0601-01-01", producto: "Estuche 105 sin Tapa Papel Kraft", costoUnitario: 199.83 },
  { sku: "0603-01-01", producto: "Estuche 105 con Tapa Papel Kraft", costoUnitario: 225.87 },
  { sku: "0152-01-01", producto: "Estuche 105 con Tapa y Ventana Papel Kraft", costoUnitario: 233.57 },
  { sku: "0194-01-01", producto: "Estuche 107 sin Tapa Papel Kraft", costoUnitario: 285.56 },
  { sku: "0195-01-01", producto: "Estuche 107 con Tapa Papel Kraft", costoUnitario: 371.95 },
  { sku: "0196-01-01", producto: "Estuche 107 con Tapa y Ventana Papel Kraft", costoUnitario: 454.25 },
  { sku: "01-0006", producto: "Bandeja 102 (300ml / 14x11x3cm) - Fibra Natural", costoUnitario: 59.07 },
  { sku: "09-0056", producto: "Tapa Bandeja 102 - PET Cristal", costoUnitario: 79.68 },
  { sku: "01-0007", producto: "Bandeja 103 (550ml / 18x12x3cm) - Fibra Natural", costoUnitario: 80.67 },
  { sku: "09-0050", producto: "Tapa Bandeja 103 - PET Cristal", costoUnitario: 109.4 },
  { sku: "01-0012", producto: "Bandeja 105 (900ml / 18x15x4cm) - Fibra Natural", costoUnitario: 212.13 },
  { sku: "09-0058", producto: "Tapa Bandeja 105 - PET Cristal", costoUnitario: 159.37 },
  { sku: "01-0002", producto: "Bandeja 105 Ovalada (750ml / 22x14x4cm) - Fibra Natural", costoUnitario: 152.14 },
  { sku: "09-0023", producto: "Tapa Bandeja 105 Ovalada - PET Cristal", costoUnitario: 122.9 },
  { sku: "0085-01-01", producto: "Caja para Wok (1450 cm3 - 49 Oz) Papel Kraft", costoUnitario: 321.65 },
  { sku: "0081-01-01", producto: "Caja para Wok (360 cm3 - 12 Oz) Papel Kraft", costoUnitario: 89.94 },
  { sku: "0087-01-01", producto: "Caja para Wok (360 cm3 - 12 Oz) Papel Kraft", costoUnitario: 123.14 },
  { sku: "0082-01-01", producto: "Caja para Wok (730 cm3 - 24 Oz) Papel Kraft", costoUnitario: 180.55 },
  { sku: "0086-01-01", producto: "Caja para Wok (750 cm3 - 25 Oz) Papel Kraft", costoUnitario: 200.55 },
  { sku: "BFM-001", producto: "Bandeja N1 12x9cm - Papel Kraft", costoUnitario: 31.25 },
  { sku: "BFM-002", producto: "Bandeja N2 16x13cm - Papel Kraft", costoUnitario: 42 },
  { sku: "BFM-003", producto: "Bandeja N3 18x14cm - Papel Kraft", costoUnitario: 51 },
  { sku: "BFM-005", producto: "Bandeja N4 20x17cm - Papel Kraft", costoUnitario: 33.6 },
  { sku: "BOL-0020", producto: "Bolsa con Fuelle N2 9x18cm", costoUnitario: 6.93 },
  { sku: "BOL-0022", producto: "Bolsa con Fuelle N3 11x25cm", costoUnitario: 8.82 },
  { sku: "BOL-0025", producto: "Bolsa con Fuelle N4A 15x23cm", costoUnitario: 9.29 },
  { sku: "BOL-0027", producto: "Bolsa con Fuelle N6 15x33cm", costoUnitario: 14.19 },
  { sku: "BOL-0029", producto: "Bolsa con Fuelle N7 19x35cm", costoUnitario: 16.54 },
  { sku: "BOL-0030", producto: "Bolsa con Fuelle N8 19x44cm", costoUnitario: 21.96 },
  { sku: "BOLSA-FM3-DU", producto: "Bolsa Cuadrada FM3 12x8x24cm", costoUnitario: 45.47 },
  { sku: "BOLSA-FM4-DU", producto: "Bolsa Cuadrada FM4 16x10x30cm", costoUnitario: 54.1 },
  { sku: "BOLSA-FM5-DU", producto: "Bolsa Cuadrada FM5 20x11x30cm", costoUnitario: 59 },
  { sku: "BOLSA-FM7-DU", producto: "Bolsa Cuadrada FM7 26x12x37cm", costoUnitario: 83.8 },
  { sku: "BOLSA-FM8-DU", producto: "Bolsa Cuadrada FM8 26x17x38cm", costoUnitario: 104.76 },
  { sku: "BOLSA-FM9-DU", producto: "Bolsa Cuadrada FM9 28x18x47cm", costoUnitario: 156.25 },
  { sku: "VSPB-0009", producto: "Collarín Multi Medida - Papel Kraft", costoUnitario: 20.21 },
  { sku: "0544-01-02", producto: "Cono Chico 14x9x4cm (Papas Fritas) - Papel Kraft", costoUnitario: 26.39 },
  { sku: "0149-01-01", producto: "Cono Grande 16x9x4cm (Papas Fritas) - Papel Kraft", costoUnitario: 33.77 },
  { sku: "CPV400", producto: "Portavaso Doble Universal - Papel Kraft", costoUnitario: 62.87 },
  { sku: "PV-0005M", producto: "Portavaso Doble Valija (Carry Tray) - Papel Kraft", costoUnitario: 71.4 },
  { sku: "SP0039", producto: "Sorbete 23cm (ø9mm) Natural - Papel Kraft", costoUnitario: 24.6 },
  { sku: "VPF-0016", producto: "Revolvedor 15cm - Madera", costoUnitario: 6.2 },
  { sku: "479", producto: "Vaso 14oz (415ml) - Caña de Azúcar", costoUnitario: 150.25 },
  { sku: "Imp-01", producto: "Impresiones 1000u", costoUnitario: 69.4 },
  { sku: "Imp-10", producto: "Impresiones 10000u", costoUnitario: 34.72 },
  { sku: "Imp-15", producto: "Impresiones 15000u", costoUnitario: 34.72 },
  { sku: "Imp-02", producto: "Impresiones 2000u", costoUnitario: 41.49 },
  { sku: "Imp-05", producto: "Impresiones 5000u", costoUnitario: 38.02 },
  { sku: "01-0013", producto: "Bowl 500 (500ml / Ø15cm) - Fibra Natural", costoUnitario: 95.08 },
  { sku: "09-0024", producto: "Tapa Bowl 500 - PET Cristal", costoUnitario: 51.32 },
  { sku: "01-0003", producto: "Bowl 1000 (1000ml / ø18cm) - Fibra Natural", costoUnitario: 212.13 },
  { sku: "ZP-280C", producto: "Bowl 250 - Caña de Azúcar", costoUnitario: 45.4 },
  { sku: "ZP-280CG", producto: "Tapa Bowl 250 - Caña de Azúcar", costoUnitario: 52.63 },
  { sku: "00012", producto: "Cuchara 16cm - TJ - Madera", costoUnitario: 30.78 },
  { sku: "2414", producto: "Cuchara 14cm - Innova - Madera", costoUnitario: 33.06 },
  { sku: "00128", producto: "Dip 2oz (60ml) - Biopack - Caña de Azúcar", costoUnitario: 117.98 },
  { sku: "0009-01-01", producto: "Dip 2oz (60ml 5x5x3cm) - Papel Kraft", costoUnitario: 50.06 },
  { sku: "M-BsAs", producto: "Envío de Muestras a Buenos Aires Interior", costoUnitario: 10800.83 },
  { sku: "ENV-05", producto: "Envío Mayorista CABA", costoUnitario: 20247.17 },
  { sku: "ENV-02", producto: "Envío Minorista CABA", costoUnitario: 4868.18 },
  { sku: "ENV-06", producto: "Envío Mayorista Zona Norte", costoUnitario: 32056.35 },
  { sku: "ENV-07", producto: "Envío Mayorista Zona Oeste", costoUnitario: 32056.35 },
  { sku: "ENV-08", producto: "Envío Mayorista Zona Sur", costoUnitario: 32056.35 },
  { sku: "ENV-03", producto: "Envío Minorista GBA 1", costoUnitario: 7150 },
  { sku: "ENV-04", producto: "Envío Minorista GBA 2", costoUnitario: 9524.35 },
  { sku: "M-CABA", producto: "Envío de Muestras a CABA", costoUnitario: 4867.17 },
  { sku: "M-Catam", producto: "Envío de Muestras a Catamarca", costoUnitario: 16427.46 },
  { sku: "M-Chub", producto: "Envío de Muestras a Chubut", costoUnitario: 18189.41 },
  { sku: "M-Chac", producto: "Envío de Muestras a Chaco", costoUnitario: 16427.46 },
  { sku: "M-Cor", producto: "Envío de Muestras a Córdoba", costoUnitario: 13071.73 },
  { sku: "M-Corri", producto: "Envío de Muestras a Corrientes", costoUnitario: 16427.46 },
  { sku: "M-Form", producto: "Envío de Muestras a Formosa", costoUnitario: 16427.46 },
  { sku: "M-GBA1", producto: "Envío de Muestras a GBA1", costoUnitario: 7150 },
  { sku: "M-GBA2", producto: "Envío de Muestras a GBA2", costoUnitario: 9524.1 },
  { sku: "M-Jujuy", producto: "Envío de Muestras a Jujuy", costoUnitario: 16427.46 },
  { sku: "M-Misio", producto: "Envío de Muestras a Misiones", costoUnitario: 16427.46 },
  { sku: "M-Neuq", producto: "Envío de Muestras a Neuquén", costoUnitario: 16427.46 },
  { sku: "M-Salta", producto: "Envío de Muestras a Salta", costoUnitario: 16427.46 },
  { sku: "M-Tucu", producto: "Envío de Muestras a Tucumán", costoUnitario: 13691.55 },
  { sku: "M-ERios", producto: "Envío de Muestras a Entre Ríos", costoUnitario: 13691.55 },
  { sku: "M-LaPam", producto: "Envío de Muestras a La Pampa", costoUnitario: 13691.55 },
  { sku: "M-LaRio", producto: "Envío de Muestras a La Rioja", costoUnitario: 16427.46 },
  { sku: "M-RioN", producto: "Envío de Muestras a Río Negro", costoUnitario: 18189.42 },
  { sku: "M-SanJ", producto: "Envío de Muestras a San Juan", costoUnitario: 13691.55 },
  { sku: "M-SanL", producto: "Envío de Muestras a San Luis", costoUnitario: 13691.55 },
  { sku: "M-SCruz", producto: "Envío de Muestras a Santa Cruz", costoUnitario: 18189.42 },
  { sku: "M-StaFé", producto: "Envío de Muestras a Santa Fé", costoUnitario: 13071.73 },
  { sku: "M-SdEst", producto: "Envío de Muestras a Santiago del Estero", costoUnitario: 16427.46 },
  { sku: "M-TdFueg", producto: "Envío de Muestras a Tierra del Fuego", costoUnitario: 34623.19 },
  { sku: "SER-005B", producto: "Servilletas 18x18cm Papel Tissue Beige", costoUnitario: 2.76 },
  { sku: "SER-0020", producto: "Servilletas 24x24cm Papel Tissue Beige", costoUnitario: 4.13 },
  { sku: "SER-0026", producto: "Servilletas 30x30cm Papel Tissue Beige", costoUnitario: 6.35 },
  { sku: "SER-0007", producto: "Servilletas 18x18cm Papel Tissue Beige Impresas", costoUnitario: 3.17 },
  { sku: "SER-0012", producto: "Servilletas 24x24cm Papel Tissue Beige Impresas", costoUnitario: 6.71 },
  { sku: "SER-0015L", producto: "Servilletas 30x30cm Papel Tissue Beige Impresas", costoUnitario: 10.34 },
  { sku: "SP0015", producto: "Sorbete 23cm (ø9mm) Blanco - Papel Kraft", costoUnitario: 24.6 },
  { sku: "09-0025", producto: "Tapa Bowl 1000 - PET Cristal", costoUnitario: 51.32 },
  { sku: "TM-C007-2", producto: "Vaso 8oz (240ml) para Tapas - Caña de Azúcar", costoUnitario: 75.55 },
  { sku: "TO-BC30", producto: "Bolsa Camiseta 20x30 - Bioplástico", costoUnitario: 26.02 },
  { sku: "TO-BC30L", producto: "Bolsa Camiseta 20x30 Impresa - Bioplástico", costoUnitario: 28.01 },
  { sku: "TO-BC40", producto: "Bolsa Camiseta 30x40 - Bioplástico", costoUnitario: 44.92 },
  { sku: "TO-BC40L", producto: "Bolsa Camiseta 30x40 Impresa - Bioplástico", costoUnitario: 46.98 },
  { sku: "TO-BC50", producto: "Bolsa Camiseta 40x50 - Bioplástico", costoUnitario: 89.85 },
  { sku: "TO-BC50L", producto: "Bolsa Camiseta 40x50 Impresa - Bioplástico", costoUnitario: 92.53 },
  { sku: "TO-BA20", producto: "Bolsa de Arranque 20x20 - Bioplástico", costoUnitario: 9.32 },
  { sku: "TO-BA20L", producto: "Bolsa de Arranque 20x20 Impresa - Bioplástico", costoUnitario: 10.25 },
  { sku: "TO-BA30", producto: "Bolsa de Arranque 20x30 - Bioplástico", costoUnitario: 13.67 },
  { sku: "TO-BA30L", producto: "Bolsa de Arranque 20x30 Impresa - Bioplástico", costoUnitario: 15.06 },
  { sku: "TO-BA40", producto: "Bolsa de Arranque 30x40 - Bioplástico", costoUnitario: 23.6 },
  { sku: "TO-BA40L", producto: "Bolsa de Arranque 30x40 Impresa - Bioplástico", costoUnitario: 26.22 },
  { sku: "TO-BR30", producto: "Bolsa Riñón 20x30 - Bioplástico", costoUnitario: 19.84 },
  { sku: "TO-BR30L", producto: "Bolsa Riñón 20x30 Impresa - Bioplástico", costoUnitario: 21.77 },
  { sku: "TO-BR40", producto: "Bolsa Riñón 30x40 - Bioplástico", costoUnitario: 42.98 },
  { sku: "TO-BR40L", producto: "Bolsa Riñón 30x40 Impresa - Bioplástico", costoUnitario: 44.97 },
  { sku: "TO-BR50", producto: "Bolsa Riñón 40x50 - Bioplástico", costoUnitario: 81.32 },
  { sku: "TO-BR50L", producto: "Bolsa Riñón 40x50 - Impresa - Bioplástico", costoUnitario: 83.48 },
  { sku: "LZ-GO-PSH08-3", producto: "Estuche 1250 con 3 Compartimentos - Caña de Azúcar", costoUnitario: 131.13 },
  { sku: "LZ-GO-TW04", producto: "Vaso 4oz (120ml) - Caña de Azúcar", costoUnitario: 27.55 },
  { sku: "477", producto: "Vaso 8oz (240ml) - Caña de Azúcar - Mayo26", costoUnitario: 99.67 },
  { sku: "478", producto: "Tapa Vaso 8oz - Caña de Azúcar - Mayo26", costoUnitario: 76.99 },
  { sku: "2915", producto: "Tapa Vaso 12oz y 14oz - Polipropileno - Mayo26", costoUnitario: 72.6 },
  { sku: "00013", producto: "Tenedor 16cm - TJ - Madera", costoUnitario: 31.4 },
  { sku: "WD-2424", producto: "Tenedor 16cm - Innova - Madera", costoUnitario: 18 },
] as const;

const blockedSkuPrefixes = ["IMP-", "ENV", "M-", "INT-"] as const;
const blockedNameTerms = ["envio", "impresion", "interes"] as const;

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

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

  console.log("Seed de costos unitarios Marzo 2026 finalizado.");
  console.log(`Período: ${PERIOD.nombre}`);
  console.log(`Costos creados: ${created}`);
  console.log(`Costos actualizados: ${updated}`);
  console.log(`SKUs omitidos por reglas de exclusión: ${skipped.length}`);
  console.log(
    `SKUs no encontrados: ${missing.length ? missing.join(", ") : "ninguno"}`,
  );
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
