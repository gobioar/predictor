import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SalesRow = {
  sku: string;
  unidadesVendidas: number;
};

type SalesPeriod = {
  periodo: {
    anio: number;
    mes: number;
    nombre: string;
  };
  items: SalesRow[];
};

const salesData: SalesPeriod[] = [
  {
    periodo: { anio: 2026, mes: 1, nombre: "Enero 2026" },
    items: [
      { sku: "VPF-0016", unidadesVendidas: 43801 },
      { sku: "01-0005", unidadesVendidas: 41776 },
      { sku: "01-0004", unidadesVendidas: 32675 },
      { sku: "01-0007", unidadesVendidas: 17583 },
      { sku: "01-0012", unidadesVendidas: 16960 },
      { sku: "01-0013", unidadesVendidas: 9509 },
      { sku: "01-0006", unidadesVendidas: 8032 },
      { sku: "09-0058", unidadesVendidas: 7810 },
      { sku: "PV-0005M", unidadesVendidas: 7501 },
      { sku: "2915", unidadesVendidas: 7000 },
      { sku: "SP0039", unidadesVendidas: 5671 },
      { sku: "09-0050", unidadesVendidas: 5558 },
      { sku: "01-0003", unidadesVendidas: 5253 },
      { sku: "09-0024", unidadesVendidas: 5134 },
      { sku: "0544-01-02", unidadesVendidas: 5001 },
      { sku: "01-0002", unidadesVendidas: 4879 },
      { sku: "WD-104SP", unidadesVendidas: 4350 },
      { sku: "09-0023", unidadesVendidas: 3954 },
      { sku: "PGRL-0001", unidadesVendidas: 3926 },
      { sku: "PCHL-0001", unidadesVendidas: 3850 },
      { sku: "VSPB-0009", unidadesVendidas: 3600 },
      { sku: "09-0056", unidadesVendidas: 3557 },
      { sku: "00013", unidadesVendidas: 3500 },
      { sku: "CPV400", unidadesVendidas: 3400 },
      { sku: "478", unidadesVendidas: 3000 },
      { sku: "00012", unidadesVendidas: 2600 },
      { sku: "0543-01-03", unidadesVendidas: 2401 },
      { sku: "PGRL-0002", unidadesVendidas: 2200 },
      { sku: "0024-01-01", unidadesVendidas: 1941 },
      { sku: "0149-01-01", unidadesVendidas: 1901 },
      { sku: "PCHL-0002", unidadesVendidas: 1750 },
      { sku: "SP0015", unidadesVendidas: 1581 },
      { sku: "BFM-001", unidadesVendidas: 1128 },
      { sku: "09-0025", unidadesVendidas: 1078 },
      { sku: "BOL-0025", unidadesVendidas: 1000 },
      { sku: "479", unidadesVendidas: 956 },
      { sku: "BFM-003", unidadesVendidas: 777 },
      { sku: "BFM-002", unidadesVendidas: 553 },
      { sku: "0192-01-01", unidadesVendidas: 360 },
      { sku: "0082-01-01", unidadesVendidas: 360 },
      { sku: "0541-01-01", unidadesVendidas: 260 },
      { sku: "0542-01-01", unidadesVendidas: 240 },
      { sku: "BFM-005", unidadesVendidas: 127 },
      { sku: "0085-01-01", unidadesVendidas: 120 },
      { sku: "0603-01-01", unidadesVendidas: 100 },
    ],
  },
  {
    periodo: { anio: 2026, mes: 2, nombre: "Febrero 2026" },
    items: [
      { sku: "VPF-0016", unidadesVendidas: 67301 },
      { sku: "SER-0012", unidadesVendidas: 50000 },
      { sku: "01-0004", unidadesVendidas: 33801 },
      { sku: "01-0005", unidadesVendidas: 32825 },
      { sku: "PCHL-0001", unidadesVendidas: 9851 },
      { sku: "0149-01-01", unidadesVendidas: 9401 },
      { sku: "SP0039", unidadesVendidas: 9366 },
      { sku: "01-0003", unidadesVendidas: 9100 },
      { sku: "PV-0005M", unidadesVendidas: 7801 },
      { sku: "01-0013", unidadesVendidas: 5975 },
      { sku: "0544-01-02", unidadesVendidas: 5125 },
      { sku: "09-0025", unidadesVendidas: 4925 },
      { sku: "479", unidadesVendidas: 4652 },
      { sku: "01-0007", unidadesVendidas: 4551 },
      { sku: "01-0012", unidadesVendidas: 4375 },
      { sku: "01-0006", unidadesVendidas: 4275 },
      { sku: "PGRL-0001", unidadesVendidas: 4151 },
      { sku: "WD-104SP", unidadesVendidas: 3850 },
      { sku: "09-0058", unidadesVendidas: 3700 },
      { sku: "01-0002", unidadesVendidas: 3401 },
      { sku: "VSPB-0009", unidadesVendidas: 3400 },
      { sku: "09-0024", unidadesVendidas: 3150 },
      { sku: "09-0023", unidadesVendidas: 3051 },
      { sku: "PGRL-0002", unidadesVendidas: 2951 },
      { sku: "PCHL-0002", unidadesVendidas: 2851 },
      { sku: "478", unidadesVendidas: 2800 },
      { sku: "CPV400", unidadesVendidas: 2775 },
      { sku: "09-0050", unidadesVendidas: 2476 },
      { sku: "BFM-002", unidadesVendidas: 2100 },
      { sku: "SP0015", unidadesVendidas: 2056 },
      { sku: "2915", unidadesVendidas: 2000 },
      { sku: "09-0056", unidadesVendidas: 1900 },
      { sku: "BFM-001", unidadesVendidas: 1400 },
      { sku: "BFM-003", unidadesVendidas: 800 },
      { sku: "BFM-005", unidadesVendidas: 650 },
      { sku: "0024-01-01", unidadesVendidas: 635 },
      { sku: "0543-01-03", unidadesVendidas: 400 },
      { sku: "0541-01-01", unidadesVendidas: 390 },
      { sku: "0192-01-01", unidadesVendidas: 360 },
      { sku: "0082-01-01", unidadesVendidas: 240 },
      { sku: "0542-01-01", unidadesVendidas: 240 },
    ],
  },
  {
    periodo: { anio: 2026, mes: 3, nombre: "Marzo 2026" },
    items: [
      { sku: "01-0004", unidadesVendidas: 45925 },
      { sku: "01-0005", unidadesVendidas: 24400 },
      { sku: "VPF-0016", unidadesVendidas: 24300 },
      { sku: "01-0012", unidadesVendidas: 11200 },
      { sku: "PV-0005M", unidadesVendidas: 8225 },
      { sku: "01-0007", unidadesVendidas: 8025 },
      { sku: "09-0058", unidadesVendidas: 7000 },
      { sku: "PGRL-0001", unidadesVendidas: 6950 },
      { sku: "01-0013", unidadesVendidas: 6425 },
      { sku: "PCHL-0001", unidadesVendidas: 6275 },
      { sku: "01-0003", unidadesVendidas: 5875 },
      { sku: "VSPB-0009", unidadesVendidas: 5550 },
      { sku: "01-0006", unidadesVendidas: 5125 },
      { sku: "SP0039", unidadesVendidas: 4725 },
      { sku: "01-0002", unidadesVendidas: 4525 },
      { sku: "WD-104SP", unidadesVendidas: 4375 },
      { sku: "BFM-003", unidadesVendidas: 4125 },
      { sku: "2915", unidadesVendidas: 3875 },
      { sku: "479", unidadesVendidas: 3775 },
      { sku: "09-0023", unidadesVendidas: 3750 },
      { sku: "0544-01-02", unidadesVendidas: 3725 },
      { sku: "09-0025", unidadesVendidas: 3500 },
      { sku: "BFM-001", unidadesVendidas: 3350 },
      { sku: "PGRL-0002", unidadesVendidas: 3100 },
      { sku: "PCHL-0002", unidadesVendidas: 2800 },
      { sku: "09-0024", unidadesVendidas: 2675 },
      { sku: "0543-01-03", unidadesVendidas: 2650 },
      { sku: "01-0008", unidadesVendidas: 2400 },
      { sku: "478", unidadesVendidas: 2000 },
      { sku: "09-0050", unidadesVendidas: 1900 },
      { sku: "0024-01-01", unidadesVendidas: 1700 },
      { sku: "CPV400", unidadesVendidas: 1625 },
      { sku: "0082-01-01", unidadesVendidas: 990 },
      { sku: "09-0056", unidadesVendidas: 950 },
      { sku: "BFM-005", unidadesVendidas: 750 },
      { sku: "SP0015", unidadesVendidas: 672 },
      { sku: "0192-01-01", unidadesVendidas: 480 },
      { sku: "0149-01-01", unidadesVendidas: 475 },
      { sku: "BFM-002", unidadesVendidas: 400 },
      { sku: "0541-01-01", unidadesVendidas: 390 },
      { sku: "0542-01-01", unidadesVendidas: 240 },
      { sku: "0081-01-01", unidadesVendidas: 60 },
    ],
  },
  {
    periodo: { anio: 2026, mes: 4, nombre: "Abril 2026" },
    items: [
      { sku: "VPF-0016", unidadesVendidas: 65400 },
      { sku: "01-0004", unidadesVendidas: 31900 },
      { sku: "477", unidadesVendidas: 30000 },
      { sku: "01-0003", unidadesVendidas: 25275 },
      { sku: "01-0005", unidadesVendidas: 20175 },
      { sku: "09-0025", unidadesVendidas: 17300 },
      { sku: "01-0007", unidadesVendidas: 13950 },
      { sku: "01-0013", unidadesVendidas: 11825 },
      { sku: "09-0050", unidadesVendidas: 11100 },
      { sku: "01-0012", unidadesVendidas: 9525 },
      { sku: "01-0006", unidadesVendidas: 9225 },
      { sku: "PCHL-0001", unidadesVendidas: 8875 },
      { sku: "01-0002", unidadesVendidas: 7625 },
      { sku: "09-0023", unidadesVendidas: 6975 },
      { sku: "PV-0005M", unidadesVendidas: 6825 },
      { sku: "SER-005B", unidadesVendidas: 6000 },
      { sku: "VSPB-0009", unidadesVendidas: 5950 },
      { sku: "09-0058", unidadesVendidas: 5075 },
      { sku: "09-0024", unidadesVendidas: 3650 },
      { sku: "BFM-003", unidadesVendidas: 3300 },
      { sku: "PCHL-0002", unidadesVendidas: 3175 },
      { sku: "WD-104SP", unidadesVendidas: 2975 },
      { sku: "479", unidadesVendidas: 2700 },
      { sku: "CPV400", unidadesVendidas: 2600 },
      { sku: "PGRL-0002", unidadesVendidas: 2350 },
      { sku: "BFM-002", unidadesVendidas: 2350 },
      { sku: "2915", unidadesVendidas: 2250 },
      { sku: "01-0008", unidadesVendidas: 1925 },
      { sku: "SP0039", unidadesVendidas: 1900 },
      { sku: "PGRL-0001", unidadesVendidas: 1675 },
      { sku: "0149-01-01", unidadesVendidas: 1525 },
      { sku: "BOLSA-FM9-DU", unidadesVendidas: 1500 },
      { sku: "BFM-005", unidadesVendidas: 1150 },
      { sku: "BFM-001", unidadesVendidas: 1100 },
      { sku: "09-0056", unidadesVendidas: 1000 },
      { sku: "0085-01-01", unidadesVendidas: 900 },
      { sku: "0544-01-02", unidadesVendidas: 825 },
      { sku: "SP0015", unidadesVendidas: 768 },
      { sku: "0543-01-03", unidadesVendidas: 525 },
      { sku: "0541-01-01", unidadesVendidas: 260 },
      { sku: "0081-01-01", unidadesVendidas: 240 },
      { sku: "0082-01-01", unidadesVendidas: 60 },
      { sku: "0024-01-01", unidadesVendidas: 25 },
    ],
  },
];

const shouldSkipSku = (sku: string) => {
  const normalizedSku = sku.trim().toUpperCase();
  return normalizedSku.startsWith("IMP-") || normalizedSku.includes("ENV");
};

async function main() {
  const summaries: Array<{
    periodo: string;
    created: number;
    updated: number;
    missingSkus: string[];
    skippedSkus: string[];
  }> = [];

  for (const periodData of salesData) {
    const { periodo } = periodData;
    const ventaPeriodo = await prisma.ventaMensualPeriodo.upsert({
      where: { anio_mes: { anio: periodo.anio, mes: periodo.mes } },
      update: { nombre: periodo.nombre },
      create: {
        nombre: periodo.nombre,
        anio: periodo.anio,
        mes: periodo.mes,
      },
    });

    let created = 0;
    let updated = 0;
    const missingSkus: string[] = [];
    const skippedSkus: string[] = [];

    for (const item of periodData.items) {
      if (shouldSkipSku(item.sku)) {
        skippedSkus.push(item.sku);
        console.warn(`[WARN] SKU excluido por regla preventiva: ${item.sku}`);
        continue;
      }

      const producto = await prisma.producto.findUnique({
        where: { sku: item.sku },
        select: {
          id: true,
          tipoProduccion: true,
          tipoProductoVenta: { select: { nombre: true } },
        },
      });

      if (!producto) {
        missingSkus.push(item.sku);
        console.warn(`[WARN] SKU no encontrado: ${item.sku}`);
        continue;
      }

      if (
        producto.tipoProduccion !== "Externo" ||
        producto.tipoProductoVenta.nombre === "Servicios"
      ) {
        skippedSkus.push(item.sku);
        console.warn(`[WARN] SKU excluido por no ser producto externo válido: ${item.sku}`);
        continue;
      }

      const existingItem = await prisma.ventaMensualItem.findUnique({
        where: {
          periodoId_productoId: {
            periodoId: ventaPeriodo.id,
            productoId: producto.id,
          },
        },
        select: { id: true },
      });

      await prisma.ventaMensualItem.upsert({
        where: {
          periodoId_productoId: {
            periodoId: ventaPeriodo.id,
            productoId: producto.id,
          },
        },
        update: { unidadesVendidas: item.unidadesVendidas },
        create: {
          periodoId: ventaPeriodo.id,
          productoId: producto.id,
          unidadesVendidas: item.unidadesVendidas,
        },
      });

      if (existingItem) {
        updated += 1;
      } else {
        created += 1;
      }
    }

    summaries.push({
      periodo: periodo.nombre,
      created,
      updated,
      missingSkus,
      skippedSkus,
    });
  }

  console.log("Carga de ventas externas 2026 finalizada.");
  for (const summary of summaries) {
    console.log(`- ${summary.periodo}`);
    console.log(`  items creados: ${summary.created}`);
    console.log(`  items actualizados: ${summary.updated}`);
    console.log(
      `  SKUs no encontrados: ${
        summary.missingSkus.length ? summary.missingSkus.join(", ") : "ninguno"
      }`,
    );
    if (summary.skippedSkus.length) {
      console.log(`  SKUs excluidos: ${summary.skippedSkus.join(", ")}`);
    }
  }
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
