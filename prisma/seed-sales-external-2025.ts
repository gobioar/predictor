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

const salesData2025: SalesPeriod[] = [
  {
    periodo: { anio: 2025, mes: 6, nombre: "Junio 2025" },
    items: [
      { sku: "VPF-0016", unidadesVendidas: 36000 },
      { sku: "SP0039", unidadesVendidas: 8350 },
      { sku: "01-0004", unidadesVendidas: 7596 },
      { sku: "PCHL-0001", unidadesVendidas: 5010 },
      { sku: "01-0005", unidadesVendidas: 4401 },
      { sku: "01-0007", unidadesVendidas: 4375 },
      { sku: "PCHL-0002", unidadesVendidas: 4285 },
      { sku: "PGRL-0001", unidadesVendidas: 3050 },
      { sku: "PV-0005M", unidadesVendidas: 2867 },
      { sku: "CPV400", unidadesVendidas: 2625 },
      { sku: "01-0006", unidadesVendidas: 2275 },
      { sku: "0543-01-03", unidadesVendidas: 2050 },
      { sku: "09-0050", unidadesVendidas: 1975 },
      { sku: "0544-01-02", unidadesVendidas: 1950 },
      { sku: "01-0002", unidadesVendidas: 1900 },
      { sku: "09-0023", unidadesVendidas: 1750 },
      { sku: "09-0056", unidadesVendidas: 1675 },
      { sku: "VSPB-0009", unidadesVendidas: 1550 },
      { sku: "0024-01-01", unidadesVendidas: 760 },
      { sku: "PGRL-0002", unidadesVendidas: 482 },
      { sku: "0541-01-01", unidadesVendidas: 400 },
      { sku: "0149-01-01", unidadesVendidas: 350 },
      { sku: "01-0012", unidadesVendidas: 265 },
      { sku: "09-0058", unidadesVendidas: 250 },
      { sku: "BFM-003", unidadesVendidas: 225 },
      { sku: "BOLSA-FM8-DU", unidadesVendidas: 200 },
      { sku: "0082-01-01", unidadesVendidas: 160 },
      { sku: "BOLSA-FM4-DU", unidadesVendidas: 100 },
      { sku: "BOLSA-FM7-DU", unidadesVendidas: 100 },
      { sku: "BFM-001", unidadesVendidas: 100 },
      { sku: "BFM-002", unidadesVendidas: 75 },
      { sku: "0085-01-01", unidadesVendidas: 50 },
      { sku: "0086-01-01", unidadesVendidas: 40 },
      { sku: "0081-01-01", unidadesVendidas: 30 },
      { sku: "BOLSA-FM3-DU", unidadesVendidas: 25 },
      { sku: "0603-01-01", unidadesVendidas: 11 },
      { sku: "0193-01-01", unidadesVendidas: 1 },
      { sku: "0196-01-01", unidadesVendidas: 1 },
    ],
  },
  {
    periodo: { anio: 2025, mes: 7, nombre: "Julio 2025" },
    items: [
      { sku: "01-0004", unidadesVendidas: 14600 },
      { sku: "VPF-0016", unidadesVendidas: 11000 },
      { sku: "01-0005", unidadesVendidas: 10525 },
      { sku: "VSPB-0009", unidadesVendidas: 6200 },
      { sku: "PGRL-0001", unidadesVendidas: 4610 },
      { sku: "PCHL-0001", unidadesVendidas: 4275 },
      { sku: "PCHL-0002", unidadesVendidas: 4225 },
      { sku: "0024-01-01", unidadesVendidas: 3120 },
      { sku: "PV-0005M", unidadesVendidas: 2605 },
      { sku: "01-0012", unidadesVendidas: 2285 },
      { sku: "09-0058", unidadesVendidas: 2110 },
      { sku: "WD-104SP", unidadesVendidas: 2000 },
      { sku: "01-0007", unidadesVendidas: 1776 },
      { sku: "0149-01-01", unidadesVendidas: 1700 },
      { sku: "BFM-003", unidadesVendidas: 1550 },
      { sku: "09-0050", unidadesVendidas: 1526 },
      { sku: "01-0002", unidadesVendidas: 1126 },
      { sku: "09-0023", unidadesVendidas: 951 },
      { sku: "0544-01-02", unidadesVendidas: 850 },
      { sku: "BFM-005", unidadesVendidas: 800 },
      { sku: "BFM-001", unidadesVendidas: 525 },
      { sku: "SP0039", unidadesVendidas: 500 },
      { sku: "BOL-0020", unidadesVendidas: 500 },
      { sku: "01-0006", unidadesVendidas: 410 },
      { sku: "BOLSA-FM7-DU", unidadesVendidas: 400 },
      { sku: "CPV400", unidadesVendidas: 350 },
      { sku: "09-0056", unidadesVendidas: 260 },
      { sku: "BOL-0030", unidadesVendidas: 250 },
      { sku: "BFM-002", unidadesVendidas: 200 },
      { sku: "0085-01-01", unidadesVendidas: 130 },
      { sku: "0543-01-03", unidadesVendidas: 110 },
      { sku: "BOL-0025", unidadesVendidas: 100 },
      { sku: "479", unidadesVendidas: 100 },
      { sku: "PGRL-0002", unidadesVendidas: 63 },
      { sku: "0192-01-01", unidadesVendidas: 50 },
      { sku: "0086-01-01", unidadesVendidas: 1 },
    ],
  },
  {
    periodo: { anio: 2025, mes: 8, nombre: "Agosto 2025" },
    items: [
      { sku: "VPF-0016", unidadesVendidas: 22700 },
      { sku: "01-0004", unidadesVendidas: 14975 },
      { sku: "01-0005", unidadesVendidas: 11075 },
      { sku: "PGRL-0001", unidadesVendidas: 4925 },
      { sku: "PCHL-0001", unidadesVendidas: 4750 },
      { sku: "PCHL-0002", unidadesVendidas: 4700 },
      { sku: "PV-0005M", unidadesVendidas: 4650 },
      { sku: "0149-01-01", unidadesVendidas: 3350 },
      { sku: "CPV400", unidadesVendidas: 3100 },
      { sku: "SP0039", unidadesVendidas: 2680 },
      { sku: "0544-01-02", unidadesVendidas: 2050 },
      { sku: "01-0007", unidadesVendidas: 1900 },
      { sku: "01-0002", unidadesVendidas: 1775 },
      { sku: "479", unidadesVendidas: 1500 },
      { sku: "09-0023", unidadesVendidas: 1425 },
      { sku: "01-0006", unidadesVendidas: 1400 },
      { sku: "VSPB-0009", unidadesVendidas: 1400 },
      { sku: "0024-01-01", unidadesVendidas: 1155 },
      { sku: "BFM-003", unidadesVendidas: 1100 },
      { sku: "09-0050", unidadesVendidas: 950 },
      { sku: "BOL-0020", unidadesVendidas: 800 },
      { sku: "09-0056", unidadesVendidas: 750 },
      { sku: "BFM-005", unidadesVendidas: 400 },
      { sku: "01-0012", unidadesVendidas: 300 },
      { sku: "0543-01-03", unidadesVendidas: 300 },
      { sku: "09-0058", unidadesVendidas: 275 },
      { sku: "PGRL-0002", unidadesVendidas: 264 },
      { sku: "BOLSA-FM3-DU", unidadesVendidas: 250 },
      { sku: "0082-01-01", unidadesVendidas: 210 },
      { sku: "BOL-0030", unidadesVendidas: 200 },
      { sku: "BFM-002", unidadesVendidas: 100 },
      { sku: "BOL-0025", unidadesVendidas: 100 },
      { sku: "BOLSA-FM7-DU", unidadesVendidas: 100 },
      { sku: "0085-01-01", unidadesVendidas: 60 },
      { sku: "0086-01-01", unidadesVendidas: 30 },
      { sku: "0193-01-01", unidadesVendidas: 25 },
      { sku: "BFM-001", unidadesVendidas: 25 },
    ],
  },
  {
    periodo: { anio: 2025, mes: 9, nombre: "Septiembre 2025" },
    items: [
      { sku: "VPF-0016", unidadesVendidas: 40005 },
      { sku: "01-0004", unidadesVendidas: 39531 },
      { sku: "01-0013", unidadesVendidas: 21000 },
      { sku: "2414", unidadesVendidas: 16500 },
      { sku: "BOL-0020", unidadesVendidas: 12050 },
      { sku: "BOL-0025", unidadesVendidas: 12000 },
      { sku: "01-0005", unidadesVendidas: 11156 },
      { sku: "PCHL-0001", unidadesVendidas: 8975 },
      { sku: "PV-0005M", unidadesVendidas: 8880 },
      { sku: "0544-01-02", unidadesVendidas: 5350 },
      { sku: "VSPB-0009", unidadesVendidas: 5154 },
      { sku: "479", unidadesVendidas: 4419 },
      { sku: "01-0007", unidadesVendidas: 4406 },
      { sku: "PGRL-0001", unidadesVendidas: 4375 },
      { sku: "0149-01-01", unidadesVendidas: 4050 },
      { sku: "BFM-001", unidadesVendidas: 3725 },
      { sku: "01-0002", unidadesVendidas: 2956 },
      { sku: "01-0012", unidadesVendidas: 2706 },
      { sku: "PCHL-0002", unidadesVendidas: 2650 },
      { sku: "BOLSA-FM7-DU", unidadesVendidas: 2600 },
      { sku: "09-0058", unidadesVendidas: 2456 },
      { sku: "09-0023", unidadesVendidas: 2431 },
      { sku: "01-0006", unidadesVendidas: 2306 },
      { sku: "09-0050", unidadesVendidas: 2256 },
      { sku: "CPV400", unidadesVendidas: 2155 },
      { sku: "09-0024", unidadesVendidas: 2000 },
      { sku: "SP0039", unidadesVendidas: 1799 },
      { sku: "BOLSA-FM8-DU", unidadesVendidas: 1300 },
      { sku: "09-0056", unidadesVendidas: 956 },
      { sku: "PGRL-0002", unidadesVendidas: 722 },
      { sku: "BFM-003", unidadesVendidas: 450 },
      { sku: "BFM-002", unidadesVendidas: 450 },
      { sku: "0024-01-01", unidadesVendidas: 385 },
      { sku: "BFM-005", unidadesVendidas: 375 },
      { sku: "0543-01-03", unidadesVendidas: 350 },
      { sku: "BOLSA-FM3-DU", unidadesVendidas: 200 },
      { sku: "0082-01-01", unidadesVendidas: 120 },
      { sku: "0196-01-01", unidadesVendidas: 120 },
      { sku: "0085-01-01", unidadesVendidas: 90 },
      { sku: "BOLSA-FM4-DU", unidadesVendidas: 75 },
      { sku: "0081-01-01", unidadesVendidas: 60 },
      { sku: "0086-01-01", unidadesVendidas: 60 },
      { sku: "0192-01-01", unidadesVendidas: 50 },
    ],
  },
  {
    periodo: { anio: 2025, mes: 10, nombre: "Octubre 2025" },
    items: [
      { sku: "01-0004", unidadesVendidas: 42325 },
      { sku: "VPF-0016", unidadesVendidas: 35550 },
      { sku: "01-0005", unidadesVendidas: 11650 },
      { sku: "01-0006", unidadesVendidas: 11500 },
      { sku: "09-0056", unidadesVendidas: 9875 },
      { sku: "BFM-001", unidadesVendidas: 9050 },
      { sku: "01-0007", unidadesVendidas: 6850 },
      { sku: "PV-0005M", unidadesVendidas: 6600 },
      { sku: "0544-01-02", unidadesVendidas: 6250 },
      { sku: "PCHL-0001", unidadesVendidas: 5700 },
      { sku: "SP0039", unidadesVendidas: 5325 },
      { sku: "VSPB-0009", unidadesVendidas: 4800 },
      { sku: "PGRL-0001", unidadesVendidas: 4500 },
      { sku: "09-0023", unidadesVendidas: 3600 },
      { sku: "01-0002", unidadesVendidas: 3550 },
      { sku: "479", unidadesVendidas: 3425 },
      { sku: "09-0050", unidadesVendidas: 3175 },
      { sku: "01-0012", unidadesVendidas: 2800 },
      { sku: "PCHL-0002", unidadesVendidas: 2800 },
      { sku: "01-0013", unidadesVendidas: 2700 },
      { sku: "00012", unidadesVendidas: 2600 },
      { sku: "BOLSA-FM9-DU", unidadesVendidas: 2500 },
      { sku: "CPV400", unidadesVendidas: 2500 },
      { sku: "09-0024", unidadesVendidas: 2100 },
      { sku: "09-0058", unidadesVendidas: 2075 },
      { sku: "BOL-0025", unidadesVendidas: 2000 },
      { sku: "0192-01-01", unidadesVendidas: 1660 },
      { sku: "0149-01-01", unidadesVendidas: 1350 },
      { sku: "PGRL-0002", unidadesVendidas: 1311 },
      { sku: "BOL-0020", unidadesVendidas: 1200 },
      { sku: "BOL-0030", unidadesVendidas: 1200 },
      { sku: "BOLSA-FM7-DU", unidadesVendidas: 1150 },
      { sku: "BOLSA-FM8-DU", unidadesVendidas: 1125 },
      { sku: "0024-01-01", unidadesVendidas: 1010 },
      { sku: "BOL-0027", unidadesVendidas: 1000 },
      { sku: "BOL-0029", unidadesVendidas: 1000 },
      { sku: "478", unidadesVendidas: 1000 },
      { sku: "BOLSA-FM5-DU", unidadesVendidas: 1000 },
      { sku: "BOLSA-FM4-DU", unidadesVendidas: 1000 },
      { sku: "BFM-003", unidadesVendidas: 850 },
      { sku: "2414", unidadesVendidas: 600 },
      { sku: "BOLSA-FM3-DU", unidadesVendidas: 525 },
      { sku: "09-0025", unidadesVendidas: 500 },
      { sku: "01-0003", unidadesVendidas: 500 },
      { sku: "SP0015", unidadesVendidas: 240 },
      { sku: "BFM-005", unidadesVendidas: 200 },
      { sku: "BFM-002", unidadesVendidas: 200 },
      { sku: "0085-01-01", unidadesVendidas: 120 },
      { sku: "0543-01-03", unidadesVendidas: 100 },
      { sku: "0082-01-01", unidadesVendidas: 90 },
      { sku: "0081-01-01", unidadesVendidas: 60 },
      { sku: "0086-01-01", unidadesVendidas: 30 },
    ],
  },
  {
    periodo: { anio: 2025, mes: 11, nombre: "Noviembre 2025" },
    items: [
      { sku: "BOLSA-FM3-DU", unidadesVendidas: 75 },
      { sku: "0085-01-01", unidadesVendidas: 34 },
      { sku: "0081-01-01", unidadesVendidas: 3 },
      { sku: "0192-01-01", unidadesVendidas: 1 },
      { sku: "0086-01-01", unidadesVendidas: 1 },
      { sku: "01-0004", unidadesVendidas: 42325 },
      { sku: "VPF-0016", unidadesVendidas: 35550 },
      { sku: "01-0005", unidadesVendidas: 11650 },
      { sku: "01-0006", unidadesVendidas: 11500 },
      { sku: "09-0056", unidadesVendidas: 9875 },
      { sku: "BFM-001", unidadesVendidas: 9050 },
      { sku: "01-0007", unidadesVendidas: 6850 },
      { sku: "PV-0005M", unidadesVendidas: 6600 },
      { sku: "0544-01-02", unidadesVendidas: 6250 },
      { sku: "PCHL-0001", unidadesVendidas: 5700 },
      { sku: "SP0039", unidadesVendidas: 5325 },
      { sku: "VSPB-0009", unidadesVendidas: 4800 },
      { sku: "PGRL-0001", unidadesVendidas: 4500 },
      { sku: "09-0023", unidadesVendidas: 3600 },
      { sku: "01-0002", unidadesVendidas: 3550 },
      { sku: "479", unidadesVendidas: 3425 },
      { sku: "09-0050", unidadesVendidas: 3175 },
      { sku: "01-0012", unidadesVendidas: 2800 },
      { sku: "PCHL-0002", unidadesVendidas: 2800 },
      { sku: "01-0013", unidadesVendidas: 2700 },
      { sku: "00012", unidadesVendidas: 2600 },
      { sku: "BOLSA-FM9-DU", unidadesVendidas: 2500 },
      { sku: "CPV400", unidadesVendidas: 2500 },
      { sku: "09-0024", unidadesVendidas: 2100 },
      { sku: "09-0058", unidadesVendidas: 2075 },
      { sku: "BOL-0025", unidadesVendidas: 2000 },
      { sku: "0149-01-01", unidadesVendidas: 1350 },
      { sku: "PGRL-0002", unidadesVendidas: 1311 },
      { sku: "BOL-0020", unidadesVendidas: 1200 },
      { sku: "BOL-0030", unidadesVendidas: 1200 },
      { sku: "BOLSA-FM7-DU", unidadesVendidas: 1150 },
      { sku: "BOLSA-FM8-DU", unidadesVendidas: 1125 },
      { sku: "0024-01-01", unidadesVendidas: 1010 },
      { sku: "BOL-0027", unidadesVendidas: 1000 },
      { sku: "BOL-0029", unidadesVendidas: 1000 },
      { sku: "478", unidadesVendidas: 1000 },
      { sku: "BOLSA-FM5-DU", unidadesVendidas: 1000 },
      { sku: "BOLSA-FM4-DU", unidadesVendidas: 1000 },
      { sku: "BFM-003", unidadesVendidas: 850 },
      { sku: "2414", unidadesVendidas: 600 },
      { sku: "09-0025", unidadesVendidas: 500 },
      { sku: "01-0003", unidadesVendidas: 500 },
      { sku: "SP0015", unidadesVendidas: 240 },
      { sku: "BFM-005", unidadesVendidas: 200 },
      { sku: "BFM-002", unidadesVendidas: 200 },
    ],
  },
  {
    periodo: { anio: 2025, mes: 12, nombre: "Diciembre 2025" },
    items: [
      { sku: "VPF-0016", unidadesVendidas: 34703 },
      { sku: "01-0004", unidadesVendidas: 28677 },
      { sku: "00012", unidadesVendidas: 13576 },
      { sku: "01-0005", unidadesVendidas: 12602 },
      { sku: "01-0006", unidadesVendidas: 11206 },
      { sku: "09-0056", unidadesVendidas: 9054 },
      { sku: "01-0013", unidadesVendidas: 8926 },
      { sku: "PCHL-0001", unidadesVendidas: 7701 },
      { sku: "01-0007", unidadesVendidas: 6907 },
      { sku: "SP0039", unidadesVendidas: 6850 },
      { sku: "VSPB-0009", unidadesVendidas: 5452 },
      { sku: "PGRL-0001", unidadesVendidas: 4626 },
      { sku: "0544-01-02", unidadesVendidas: 4575 },
      { sku: "PV-0005M", unidadesVendidas: 4455 },
      { sku: "PCHL-0002", unidadesVendidas: 4351 },
      { sku: "01-0003", unidadesVendidas: 3426 },
      { sku: "09-0050", unidadesVendidas: 3231 },
      { sku: "CPV400", unidadesVendidas: 3204 },
      { sku: "0024-01-01", unidadesVendidas: 3012 },
      { sku: "01-0012", unidadesVendidas: 2960 },
      { sku: "09-0024", unidadesVendidas: 2900 },
      { sku: "0149-01-01", unidadesVendidas: 2851 },
      { sku: "479", unidadesVendidas: 2825 },
      { sku: "PGRL-0002", unidadesVendidas: 2751 },
      { sku: "09-0058", unidadesVendidas: 2428 },
      { sku: "01-0002", unidadesVendidas: 2252 },
      { sku: "BFM-003", unidadesVendidas: 2050 },
      { sku: "09-0023", unidadesVendidas: 2027 },
      { sku: "SER-005B", unidadesVendidas: 2000 },
      { sku: "BOL-0025", unidadesVendidas: 2000 },
      { sku: "09-0025", unidadesVendidas: 1701 },
      { sku: "WD-104SP", unidadesVendidas: 1450 },
      { sku: "0009-01-01", unidadesVendidas: 1400 },
      { sku: "BFM-001", unidadesVendidas: 1026 },
      { sku: "BFM-005", unidadesVendidas: 852 },
      { sku: "0543-01-03", unidadesVendidas: 751 },
      { sku: "BFM-002", unidadesVendidas: 251 },
      { sku: "0082-01-01", unidadesVendidas: 180 },
      { sku: "SP0015", unidadesVendidas: 101 },
      { sku: "0085-01-01", unidadesVendidas: 60 },
      { sku: "00013", unidadesVendidas: 1 },
    ],
  },
];

const blockedSkuPrefixes = ["IMP-", "ENV", "M-", "INT-"] as const;
const blockedNameTerms = ["envio", "impresion", "interes"] as const;

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const shouldSkipSku = (sku: string) => {
  const normalizedSku = sku.trim().toUpperCase();
  return blockedSkuPrefixes.some((prefix) => normalizedSku.startsWith(prefix));
};

const shouldSkipProduct = (producto: {
  nombre: string;
  tipoProduccion: string;
  tipoProductoVenta: { nombre: string };
}) => {
  const normalizedName = normalizeText(producto.nombre);
  return (
    producto.tipoProduccion !== "Externo" ||
    producto.tipoProductoVenta.nombre === "Servicios" ||
    blockedNameTerms.some((term) => normalizedName.includes(term))
  );
};

async function main() {
  const summaries: Array<{
    periodo: string;
    created: number;
    updated: number;
    missingSkus: string[];
    skippedSkus: string[];
  }> = [];

  for (const periodData of salesData2025) {
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
          nombre: true,
          tipoProduccion: true,
          tipoProductoVenta: { select: { nombre: true } },
        },
      });

      if (!producto) {
        missingSkus.push(item.sku);
        console.warn(`[WARN] SKU no encontrado: ${item.sku}`);
        continue;
      }

      if (shouldSkipProduct(producto)) {
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

  console.log("Carga de ventas externas 2025 finalizada.");
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
