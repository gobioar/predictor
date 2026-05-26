import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type PeriodKey =
  | "2023-11"
  | "2023-12"
  | "2024-01"
  | "2024-02"
  | "2024-03"
  | "2024-04"
  | "2024-05"
  | "2024-06"
  | "2024-07"
  | "2024-08"
  | "2024-09"
  | "2024-10";

type SalesRow = {
  sku: string;
  values: Record<PeriodKey, number>;
};

const periodNames: Record<PeriodKey, string> = {
  "2023-11": "Noviembre 2023",
  "2023-12": "Diciembre 2023",
  "2024-01": "Enero 2024",
  "2024-02": "Febrero 2024",
  "2024-03": "Marzo 2024",
  "2024-04": "Abril 2024",
  "2024-05": "Mayo 2024",
  "2024-06": "Junio 2024",
  "2024-07": "Julio 2024",
  "2024-08": "Agosto 2024",
  "2024-09": "Septiembre 2024",
  "2024-10": "Octubre 2024",
};

const periodKeys = Object.keys(periodNames) as PeriodKey[];

const salesData: SalesRow[] = [
  {
    sku: "LZ-GO-YP06",
    values: {
      "2023-11": 0,
      "2023-12": 0,
      "2024-01": 0,
      "2024-02": 0,
      "2024-03": 0,
      "2024-04": 0,
      "2024-05": 0,
      "2024-06": 0,
      "2024-07": 0,
      "2024-08": 0,
      "2024-09": 0,
      "2024-10": 0,
    },
  },
  {
    sku: "LZ-GO-75W(W)",
    values: {
      "2023-11": 2275,
      "2023-12": 1700,
      "2024-01": 2575,
      "2024-02": 2750,
      "2024-03": 1625,
      "2024-04": 1375,
      "2024-05": 2150,
      "2024-06": 1000,
      "2024-07": 3575,
      "2024-08": 23475,
      "2024-09": 10810,
      "2024-10": 26375,
    },
  },
  {
    sku: "ZP-280C",
    values: {
      "2023-11": 0,
      "2023-12": 0,
      "2024-01": 0,
      "2024-02": 0,
      "2024-03": 0,
      "2024-04": 0,
      "2024-05": 0,
      "2024-06": 0,
      "2024-07": 0,
      "2024-08": 0,
      "2024-09": 0,
      "2024-10": 0,
    },
  },
  {
    sku: "LZ-GO-TW500",
    values: {
      "2023-11": 2150,
      "2023-12": 350,
      "2024-01": 50,
      "2024-02": 50,
      "2024-03": 100,
      "2024-04": 250,
      "2024-05": 0,
      "2024-06": 30500,
      "2024-07": 5020,
      "2024-08": 24860,
      "2024-09": 150,
      "2024-10": 690,
    },
  },
  {
    sku: "GO-ZW1000S",
    values: {
      "2023-11": 3600,
      "2023-12": 2900,
      "2024-01": 2610,
      "2024-02": 2780,
      "2024-03": 3625,
      "2024-04": 12690,
      "2024-05": 23770,
      "2024-06": 2400,
      "2024-07": 22590,
      "2024-08": 8230,
      "2024-09": 900,
      "2024-10": 5500,
    },
  },
  {
    sku: "WD-102S",
    values: {
      "2023-11": 2500,
      "2023-12": 2835,
      "2024-01": 325,
      "2024-02": 4100,
      "2024-03": 1625,
      "2024-04": 575,
      "2024-05": 375,
      "2024-06": 950,
      "2024-07": 3390,
      "2024-08": 635,
      "2024-09": 1855,
      "2024-10": 14590,
    },
  },
  {
    sku: "WD-101K",
    values: {
      "2023-11": 2130,
      "2023-12": 885,
      "2024-01": 785,
      "2024-02": 3185,
      "2024-03": 600,
      "2024-04": 400,
      "2024-05": 150,
      "2024-06": 425,
      "2024-07": 1035,
      "2024-08": 2260,
      "2024-09": 3625,
      "2024-10": 12695,
    },
  },
  {
    sku: "LZ-GO-TW12",
    values: {
      "2023-11": 0,
      "2023-12": 0,
      "2024-01": 0,
      "2024-02": 0,
      "2024-03": 0,
      "2024-04": 0,
      "2024-05": 0,
      "2024-06": 0,
      "2024-07": 600,
      "2024-08": 80,
      "2024-09": 6320,
      "2024-10": 10300,
    },
  },
  {
    sku: "LZ-GO-SH09-3",
    values: {
      "2023-11": 0,
      "2023-12": 200,
      "2024-01": 100,
      "2024-02": 850,
      "2024-03": 100,
      "2024-04": 0,
      "2024-05": 50,
      "2024-06": 100,
      "2024-07": 200,
      "2024-08": 0,
      "2024-09": 0,
      "2024-10": 2000,
    },
  },
  {
    sku: "LZ-GO-T-HB06",
    values: {
      "2023-11": 0,
      "2023-12": 0,
      "2024-01": 0,
      "2024-02": 0,
      "2024-03": 0,
      "2024-04": 0,
      "2024-05": 0,
      "2024-06": 0,
      "2024-07": 0,
      "2024-08": 0,
      "2024-09": 3700,
      "2024-10": 0,
    },
  },
  {
    sku: "LZ-GO-B004",
    values: {
      "2023-11": 2850,
      "2023-12": 5500,
      "2024-01": 2250,
      "2024-02": 4450,
      "2024-03": 4675,
      "2024-04": 5500,
      "2024-05": 6450,
      "2024-06": 4500,
      "2024-07": 3900,
      "2024-08": 4660,
      "2024-09": 220,
      "2024-10": 3650,
    },
  },
  {
    sku: "LZ-GO-P-SH89",
    values: {
      "2023-11": 8600,
      "2023-12": 6400,
      "2024-01": 6450,
      "2024-02": 7500,
      "2024-03": 8850,
      "2024-04": 11400,
      "2024-05": 5900,
      "2024-06": 6730,
      "2024-07": 9950,
      "2024-08": 7400,
      "2024-09": 7500,
      "2024-10": 12080,
    },
  },
  {
    sku: "TM-B102",
    values: {
      "2023-11": 3250,
      "2023-12": 3900,
      "2024-01": 13150,
      "2024-02": 15,
      "2024-03": 275,
      "2024-04": 230,
      "2024-05": 820,
      "2024-06": 980,
      "2024-07": 580,
      "2024-08": 31250,
      "2024-09": 2020,
      "2024-10": 22440,
    },
  },
  {
    sku: "LZ-GO-YP08",
    values: {
      "2023-11": 0,
      "2023-12": 0,
      "2024-01": 0,
      "2024-02": 0,
      "2024-03": 0,
      "2024-04": 0,
      "2024-05": 0,
      "2024-06": 0,
      "2024-07": 0,
      "2024-08": 0,
      "2024-09": 1175,
      "2024-10": 2900,
    },
  },
  {
    sku: "LZ-GO-YP09",
    values: {
      "2023-11": 0,
      "2023-12": 0,
      "2024-01": 500,
      "2024-02": 0,
      "2024-03": 250,
      "2024-04": 830,
      "2024-05": 0,
      "2024-06": 50,
      "2024-07": 1200,
      "2024-08": 250,
      "2024-09": 172,
      "2024-10": 725,
    },
  },
  {
    sku: "LZ-GO-YP07",
    values: {
      "2023-11": 0,
      "2023-12": 0,
      "2024-01": 0,
      "2024-02": 0,
      "2024-03": 0,
      "2024-04": 0,
      "2024-05": 0,
      "2024-06": 0,
      "2024-07": 0,
      "2024-08": 0,
      "2024-09": 0,
      "2024-10": 0,
    },
  },
  {
    sku: "LZ-GO-75G(W)",
    values: {
      "2023-11": 1850,
      "2023-12": 1700,
      "2024-01": 2575,
      "2024-02": 2750,
      "2024-03": 1625,
      "2024-04": 1375,
      "2024-05": 2150,
      "2024-06": 1000,
      "2024-07": 3575,
      "2024-08": 23475,
      "2024-09": 10060,
      "2024-10": 20250,
    },
  },
  {
    sku: "ZP-280CG",
    values: {
      "2023-11": 0,
      "2023-12": 0,
      "2024-01": 0,
      "2024-02": 0,
      "2024-03": 0,
      "2024-04": 0,
      "2024-05": 0,
      "2024-06": 0,
      "2024-07": 0,
      "2024-08": 0,
      "2024-09": 0,
      "2024-10": 0,
    },
  },
  {
    sku: "LZ-GO-TWG700",
    values: {
      "2023-11": 2150,
      "2023-12": 350,
      "2024-01": 50,
      "2024-02": 50,
      "2024-03": 100,
      "2024-04": 250,
      "2024-05": 0,
      "2024-06": 30500,
      "2024-07": 5020,
      "2024-08": 24710,
      "2024-09": 50,
      "2024-10": 800,
    },
  },
  {
    sku: "GO-ZW1000G",
    values: {
      "2023-11": 5500,
      "2023-12": 3000,
      "2024-01": 2710,
      "2024-02": 2760,
      "2024-03": 3425,
      "2024-04": 12310,
      "2024-05": 25820,
      "2024-06": 2000,
      "2024-07": 22460,
      "2024-08": 8060,
      "2024-09": 400,
      "2024-10": 4730,
    },
  },
  {
    sku: "LZ-GO-TW16",
    values: {
      "2023-11": 0,
      "2023-12": 0,
      "2024-01": 0,
      "2024-02": 0,
      "2024-03": 0,
      "2024-04": 0,
      "2024-05": 0,
      "2024-06": 0,
      "2024-07": 600,
      "2024-08": 70,
      "2024-09": 6340,
      "2024-10": 10050,
    },
  },
  {
    sku: "TM-G004",
    values: {
      "2023-11": 6150,
      "2023-12": 0,
      "2024-01": 1250,
      "2024-02": 2000,
      "2024-03": 50,
      "2024-04": 1600,
      "2024-05": 2300,
      "2024-06": 500,
      "2024-07": 2350,
      "2024-08": 3100,
      "2024-09": 2150,
      "2024-10": 3250,
    },
  },
  {
    sku: "TM-G003",
    values: {
      "2023-11": 3750,
      "2023-12": 2000,
      "2024-01": 1000,
      "2024-02": 2400,
      "2024-03": 50,
      "2024-04": 1700,
      "2024-05": 3750,
      "2024-06": 2200,
      "2024-07": 250,
      "2024-08": 100,
      "2024-09": 7100,
      "2024-10": 2300,
    },
  },
  {
    sku: "WD-103F",
    values: {
      "2023-11": 6475,
      "2023-12": 1790,
      "2024-01": 1460,
      "2024-02": 4360,
      "2024-03": 930,
      "2024-04": 1250,
      "2024-05": 480,
      "2024-06": 900,
      "2024-07": 2880,
      "2024-08": 2960,
      "2024-09": 7225,
      "2024-10": 16425,
    },
  },
  {
    sku: "TM-C002",
    values: {
      "2023-11": 6600,
      "2023-12": 0,
      "2024-01": 4200,
      "2024-02": 4050,
      "2024-03": 1630,
      "2024-04": 2160,
      "2024-05": 4250,
      "2024-06": 1650,
      "2024-07": 4750,
      "2024-08": 4650,
      "2024-09": 3900,
      "2024-10": 3780,
    },
  },
  {
    sku: "TM-C007",
    values: {
      "2023-11": 3750,
      "2023-12": 6800,
      "2024-01": 4500,
      "2024-02": 8550,
      "2024-03": 18750,
      "2024-04": 21100,
      "2024-05": 18550,
      "2024-06": 18450,
      "2024-07": 30900,
      "2024-08": 8900,
      "2024-09": 34100,
      "2024-10": 14950,
    },
  },
];

function parsePeriodKey(key: PeriodKey) {
  const [year, month] = key.split("-").map(Number);
  return { anio: year, mes: month };
}

function normalizeUnits(value: number) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`Unidad vendida invalida: ${value}`);
  }

  return Math.trunc(value);
}

async function main() {
  const products = await prisma.producto.findMany({
    where: { sku: { in: salesData.map((row) => row.sku) } },
    select: { id: true, sku: true },
  });
  const productBySku = new Map(products.map((product) => [product.sku, product]));
  const missingSkus = new Set<string>();
  const periodSummaries: Array<{
    nombre: string;
    status: "creado" | "actualizado";
    itemsCreated: number;
    itemsUpdated: number;
  }> = [];

  for (const periodKey of periodKeys) {
    const { anio, mes } = parsePeriodKey(periodKey);
    const existingPeriod = await prisma.ventaMensualPeriodo.findUnique({
      where: { anio_mes: { anio, mes } },
    });
    const periodo = await prisma.ventaMensualPeriodo.upsert({
      where: { anio_mes: { anio, mes } },
      update: { nombre: periodNames[periodKey] },
      create: {
        nombre: periodNames[periodKey],
        anio,
        mes,
      },
    });

    let itemsCreated = 0;
    let itemsUpdated = 0;

    for (const row of salesData) {
      const product = productBySku.get(row.sku);

      if (!product) {
        missingSkus.add(row.sku);
        console.warn(`[WARN] SKU no encontrado: ${row.sku}`);
        continue;
      }

      const existingItem = await prisma.ventaMensualItem.findUnique({
        where: {
          periodoId_productoId: {
            periodoId: periodo.id,
            productoId: product.id,
          },
        },
      });

      await prisma.ventaMensualItem.upsert({
        where: {
          periodoId_productoId: {
            periodoId: periodo.id,
            productoId: product.id,
          },
        },
        update: {
          unidadesVendidas: normalizeUnits(row.values[periodKey]),
        },
        create: {
          periodoId: periodo.id,
          productoId: product.id,
          unidadesVendidas: normalizeUnits(row.values[periodKey]),
        },
      });

      if (existingItem) {
        itemsUpdated += 1;
      } else {
        itemsCreated += 1;
      }
    }

    periodSummaries.push({
      nombre: periodNames[periodKey],
      status: existingPeriod ? "actualizado" : "creado",
      itemsCreated,
      itemsUpdated,
    });
  }

  console.log("Carga de ventas historicas 2023/2024 finalizada.");
  for (const summary of periodSummaries) {
    console.log(
      `- ${summary.nombre}: ${summary.status}, ${summary.itemsCreated} items creados, ${summary.itemsUpdated} items actualizados`,
    );
  }

  if (missingSkus.size) {
    console.log(`SKUs no encontrados: ${Array.from(missingSkus).join(", ")}`);
  } else {
    console.log("SKUs no encontrados: ninguno");
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
