import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PERIOD = { anio: 2026, mes: 3, nombre: "Precio Venta Promedio Marzo 2026" };

const csv = `SKU,Producto,PrecioVentaPromedio
WD-102S,Cuchara 16cm - Madera,50.21
01-0004,Plato 17cm - Fibra Natural,80.10
WD-103F,Tenedor 16cm - Madera,55.13
LZ-GO-P-SH89,Estuche 950 Alto - Caña de Azúcar,334.09
LZ-GO-75W(W),Bowl 1000 - Caña de Azúcar,299.22
LZ-GO-75G(W),Tapa Bowl 1000 - Caña de Azúcar,85.50
GO-ZW1000S,Bowl 850 - Caña de Azúcar,261.53
LZ-GO-TW500,Bowl 500 - Caña de Azúcar,213.62
GO-ZW1000G,Tapa Bowl 850 - Caña de Azúcar,77.31
01-0005,Plato 22cm - Fibra Natural,113.35
VPF-0016,Revolvedor 15cm - Madera,9.73
TO-BA40,Bolsa de Arranque 30x40 - Bioplástico,63.83
LZ-GO-TWG700,Tapa Bowl 500 - Caña de Azúcar,57.96
01-0012,Bandeja 105 (900ml / 18x15x4cm) - Fibra Natural,309.18
WD-101K,Cuchillo 16cm - Madera,56.61
LZ-GO-PSH08-3,Estuche 1250 con 3 Compartimentos - Caña de Azúcar,361.73
PV-0005M,Portavaso Doble Valija (Carry Tray) - Papel Kraft,115.88
01-0007,Bandeja 103 (550ml / 18x12x3cm) - Fibra Natural,155.15
TM-C007,Vaso 8oz (240ml) - Caña de Azúcar,214.67
TO-BA20L,Bolsa de Arranque 20x20 Impresa - Bioplástico,29.11
TO-BA20,Bolsa de Arranque 20x20 - Bioplástico,25.61
TM-C002,Vaso 12oz (355ml) - Caña de Azúcar,198.19
LZ-GO-YP06,Bandeja 850 Rectangular - Caña de Azúcar,206.35
09-0058,Tapa Bandeja 105 - PET Cristal,292.85
PGRL-0001,Plato 23cm Natural - Papel Kraft,121.41
01-0013,Bowl 500 (500ml / Ø15cm) - Fibra Natural,164.84
PCHL-0001,Plato 18cm Natural - Papel Kraft,101.63
LZ-GO-YP07,Tapa Bandeja 850 Rectangular - Caña de Azúcar,172.30
01-0003,Bowl 1000 (1000ml / ø18cm) - Fibra Natural,309.73
VSPB-0009,Collarín Multi Medida - Papel Kraft,35.92
01-0006,Bandeja 102 (300ml / 14x11x3cm) - Fibra Natural,118.43
SP0039,Sorbete 23cm (ø9mm) Natural - Papel Kraft,43.51
01-0002,Bandeja 105 Ovalada (750ml / 22x14x4cm) - Fibra Natural,265.72
TO-BA30,Bolsa de Arranque 20x30 - Bioplástico,36.38
LZ-GO-T-HB06,Estuche 500 Cuadrado - Caña de Azúcar,282.28
WD-104SP,Cuchara 7cm - Madera,32.44
BFM-003,Bandeja N3 18x14cm - Papel Kraft,83.00
LZ-GO-TW04,Vaso 4oz (120ml) - Caña de Azúcar,84.15
2915,Tapa Vaso 12oz y 14oz - Polipropileno - Mayo26,128.20
479,Vaso 14oz (415ml) - Caña de Azúcar,225.74
09-0023,Tapa Bandeja 105 Ovalada - PET Cristal,221.62
0544-01-02,Cono Chico 14x9x4cm (Papas Fritas) - Papel Kraft,49.29
09-0025,Tapa Bowl 1000 - PET Cristal,221.92
BFM-001,Bandeja N1 12x9cm - Papel Kraft,55.61
PGRL-0002,Plato 23cm Blanco - Papel Kraft,127.52
LZ-GO-B004,Estuche 600 Rectangular - Caña de Azúcar,289.51
PCHL-0002,Plato 18cm Blanco - Papel Kraft,108.37
09-0024,Tapa Bowl 500 - PET Cristal,122.10
0543-01-03,Estuche Papas Fritas 12x8x6cm - Papel Kraft,77.21
LZ-GO-TW12,Dip 2oz - Caña de Azúcar,112.28
01-0008,Estuche 950 Alto (950ml / 23x15x8 cm) - Fibra Natural,361.92
LZ-GO-TW16,Tapa Dip 2oz - Caña de Azúcar,28.80
TO-BC40L,Bolsa Camiseta 30x40 Impresa - Bioplástico,121.18
TO-BC50,Bolsa Camiseta 40x50 - Bioplástico,235.98
478,Tapa Vaso 8oz - Caña de Azúcar - Mayo26,112.50
09-0050,Tapa Bandeja 103 - PET Cristal,192.14
TO-BC40,Bolsa Camiseta 30x40 - Bioplástico,111.66
TO-BA30L,Bolsa de Arranque 20x30 Impresa - Bioplástico,37.14
0024-01-01,Estuche Sandwich 21x11x8cm - Papel Kraft,210.65
CPV400,Portavaso Doble Universal - Papel Kraft,112.87
TO-BR30,Bolsa Riñón 20x30 - Bioplástico,64.27
TM-B102,Estuche 950 Bajo - Caña de Azúcar,401.20
TM-G003,Tapa Vaso 8oz - Caña de Azúcar,142.65
ZP-280C,Bowl 250 - Caña de Azúcar,194.95
0082-01-01,Caja para Wok (730 cm3 - 24 Oz) Papel Kraft,333.98
09-0056,Tapa Bandeja 102 - PET Cristal,170.65
TO-BA40L,Bolsa de Arranque 30x40 Impresa - Bioplástico,58.08
TO-BC50L,Bolsa Camiseta 40x50 Impresa - Bioplástico,240.11
BFM-005,Bandeja N4 20x17cm - Papel Kraft,98.62
TO-BC30L,Bolsa Camiseta 20x30 Impresa - Bioplástico,78.82
SP0015,Sorbete 23cm (ø9mm) Blanco - Papel Kraft,40.88
ZP-280CG,Tapa Bowl 250 - Caña de Azúcar,74.79
TO-BR30L,Bolsa Riñón 20x30 Impresa - Bioplástico,65.28
TO-BR40,Bolsa Riñón 30x40 - Bioplástico,129.24
0192-01-01,Estuche 103 con Tapa Papel Kraft,392.00
0149-01-01,Cono Grande 16x9x4cm (Papas Fritas) - Papel Kraft,72.52
BFM-002,Bandeja N2 16x13cm - Papel Kraft,88.53
0541-01-01,Estuche Hamburguesa Grande 14x14x9cm - Papel Kraft,177.00
TO-BC30,Bolsa Camiseta 20x30 - Bioplástico,86.84
0542-01-01,Estuche Hamburguesa Chico 9x8x7cm - Papel Kraft,97.00
TO-BR50,Bolsa Riñón 40x50 - Bioplástico,229.31
TO-BR50L,Bolsa Riñón 40x50 - Impresa - Bioplástico,224.00
TM-G004,Tapa Vaso 12oz y 14oz - Caña de Azúcar,126.00
0081-01-01,Caja para Wok (360 cm3 - 12 Oz) Papel Kraft,346.23
LZ-GO-SH09-3,Estuche 1500 con 3 Compartimentos - Caña de Azúcar,478.50`;

const blockedSkuPrefixes = ["IMP-", "ENV", "M-", "INT-"] as const;
const blockedNameTerms = ["envio", "impresion", "interes"] as const;

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const priceData = csv
  .trim()
  .split("\n")
  .slice(1)
  .map((line) => {
    const [sku, producto, precioVentaPromedio] = line.split(",");
    return {
      sku: sku.trim(),
      producto: producto.trim(),
      precioVentaPromedio: Number(precioVentaPromedio),
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
    where: { anio_mes: { anio: 2026, mes: 3 } },
    select: { nombre: true, anio: true, mes: true, _count: { select: { items: true } } },
  });

  console.log("Seed de precios venta promedio Marzo 2026 finalizado.");
  console.log(`Período: ${PERIOD.nombre}`);
  console.log(`Precios creados: ${created}`);
  console.log(`Precios actualizados: ${updated}`);
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
