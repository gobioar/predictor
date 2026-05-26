import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SalesRow = {
  sku: string;
  unidadesVendidas: number;
};

type SalesPeriod = {
  nombre: string;
  mes: number;
  anio: number;
  items: SalesRow[];
};

const periods: SalesPeriod[] = [
  {
    nombre: "Junio 2025",
    mes: 6,
    anio: 2025,
    items: [
      { sku: "LZ-GO-TW500", unidadesVendidas: 48580 },
      { sku: "TM-B102", unidadesVendidas: 45000 },
      { sku: "LZ-GO-TWG700", unidadesVendidas: 39225 },
      { sku: "WD-103F", unidadesVendidas: 28280 },
      { sku: "WD-102S", unidadesVendidas: 23425 },
      { sku: "ZP-280C", unidadesVendidas: 20000 },
      { sku: "TM-C007", unidadesVendidas: 15525 },
      { sku: "GO-ZW1000S", unidadesVendidas: 13450 },
      { sku: "GO-ZW1000G", unidadesVendidas: 12500 },
      { sku: "WD-101K", unidadesVendidas: 12480 },
      { sku: "TM-C002", unidadesVendidas: 11770 },
      { sku: "TM-G004", unidadesVendidas: 11475 },
      { sku: "LZ-GO-75W(W)", unidadesVendidas: 10635 },
      { sku: "ZP-280CG", unidadesVendidas: 10000 },
      { sku: "TM-G003", unidadesVendidas: 9950 },
      { sku: "LZ-GO-P-SH89", unidadesVendidas: 9580 },
      { sku: "LZ-GO-75G(W)", unidadesVendidas: 7535 },
      { sku: "LZ-GO-B004", unidadesVendidas: 4150 },
      { sku: "LZ-GO-TW12", unidadesVendidas: 1320 },
      { sku: "LZ-GO-SH09-3", unidadesVendidas: 1000 },
      { sku: "LZ-GO-TW16", unidadesVendidas: 780 },
      { sku: "LZ-GO-T-HB06", unidadesVendidas: 230 },
    ],
  },
  {
    nombre: "Julio 2025",
    mes: 7,
    anio: 2025,
    items: [
      { sku: "WD-102S", unidadesVendidas: 56615 },
      { sku: "LZ-GO-75W(W)", unidadesVendidas: 38600 },
      { sku: "LZ-GO-TW500", unidadesVendidas: 38306 },
      { sku: "LZ-GO-75G(W)", unidadesVendidas: 37500 },
      { sku: "LZ-GO-TWG700", unidadesVendidas: 33981 },
      { sku: "GO-ZW1000S", unidadesVendidas: 22235 },
      { sku: "WD-103F", unidadesVendidas: 20810 },
      { sku: "GO-ZW1000G", unidadesVendidas: 18860 },
      { sku: "LZ-GO-TW12", unidadesVendidas: 15795 },
      { sku: "LZ-GO-TW16", unidadesVendidas: 14285 },
      { sku: "LZ-GO-P-SH89", unidadesVendidas: 13560 },
      { sku: "TM-C007", unidadesVendidas: 13110 },
      { sku: "TM-C007-2", unidadesVendidas: 10000 },
      { sku: "WD-101K", unidadesVendidas: 8710 },
      { sku: "TM-G003", unidadesVendidas: 5560 },
      { sku: "LZ-GO-T-HB06", unidadesVendidas: 5455 },
      { sku: "TM-C002", unidadesVendidas: 4400 },
      { sku: "TM-G004", unidadesVendidas: 4150 },
      { sku: "LZ-GO-SH09-3", unidadesVendidas: 3817 },
      { sku: "LZ-GO-B004", unidadesVendidas: 3055 },
      { sku: "TM-C002-01", unidadesVendidas: 2000 },
    ],
  },
  {
    nombre: "Agosto 2025",
    mes: 8,
    anio: 2025,
    items: [
      { sku: "WD-103F", unidadesVendidas: 22520 },
      { sku: "WD-102S", unidadesVendidas: 16175 },
      { sku: "TM-C007", unidadesVendidas: 14775 },
      { sku: "LZ-GO-TW500", unidadesVendidas: 14170 },
      { sku: "TM-C007-2", unidadesVendidas: 12000 },
      { sku: "GO-ZW1000S", unidadesVendidas: 11100 },
      { sku: "LZ-GO-TW12", unidadesVendidas: 10780 },
      { sku: "GO-ZW1000G", unidadesVendidas: 10725 },
      { sku: "LZ-GO-TWG700", unidadesVendidas: 9670 },
      { sku: "LZ-GO-P-SH89", unidadesVendidas: 9650 },
      { sku: "LZ-GO-TW16", unidadesVendidas: 9550 },
      { sku: "LZ-GO-75W(W)", unidadesVendidas: 6325 },
      { sku: "WD-101K", unidadesVendidas: 5895 },
      { sku: "LZ-GO-75G(W)", unidadesVendidas: 5125 },
      { sku: "TM-G003", unidadesVendidas: 4775 },
      { sku: "LZ-GO-T-HB06", unidadesVendidas: 2755 },
      { sku: "LZ-GO-B004", unidadesVendidas: 2085 },
      { sku: "LZ-GO-SH09-3", unidadesVendidas: 1800 },
      { sku: "TM-G004", unidadesVendidas: 1525 },
      { sku: "LZ-GO-YP06", unidadesVendidas: 550 },
      { sku: "LZ-GO-YP07", unidadesVendidas: 550 },
      { sku: "LZ-GO-75G", unidadesVendidas: 500 },
      { sku: "LZ-GO-75W", unidadesVendidas: 500 },
      { sku: "TM-C002", unidadesVendidas: 225 },
    ],
  },
  {
    nombre: "Septiembre 2025",
    mes: 9,
    anio: 2025,
    items: [
      { sku: "WD-103F", unidadesVendidas: 40727 },
      { sku: "TM-C007", unidadesVendidas: 32444 },
      { sku: "WD-102S", unidadesVendidas: 28702 },
      { sku: "LZ-GO-75W(W)", unidadesVendidas: 19429 },
      { sku: "LZ-GO-75G(W)", unidadesVendidas: 18954 },
      { sku: "LZ-GO-TW500", unidadesVendidas: 18200 },
      { sku: "LZ-GO-P-SH89", unidadesVendidas: 16154 },
      { sku: "LZ-GO-TWG700", unidadesVendidas: 15450 },
      { sku: "GO-ZW1000S", unidadesVendidas: 15404 },
      { sku: "GO-ZW1000G", unidadesVendidas: 14704 },
      { sku: "WD-101K", unidadesVendidas: 8182 },
      { sku: "LZ-GO-TW12", unidadesVendidas: 7484 },
      { sku: "TM-G003", unidadesVendidas: 7269 },
      { sku: "LZ-GO-B004", unidadesVendidas: 6304 },
      { sku: "LZ-GO-TW16", unidadesVendidas: 5964 },
      { sku: "LZ-GO-T-HB06", unidadesVendidas: 5059 },
      { sku: "TM-G004", unidadesVendidas: 4469 },
      { sku: "LZ-GO-SH09-3", unidadesVendidas: 1704 },
      { sku: "LZ-GO-YP06", unidadesVendidas: 1029 },
      { sku: "LZ-GO-YP07", unidadesVendidas: 979 },
      { sku: "TM-C002", unidadesVendidas: 800 },
    ],
  },
  {
    nombre: "Octubre 2025",
    mes: 10,
    anio: 2025,
    items: [
      { sku: "WD-103F", unidadesVendidas: 46975 },
      { sku: "LZ-GO-P-SH89", unidadesVendidas: 43200 },
      { sku: "WD-102S", unidadesVendidas: 25150 },
      { sku: "TM-C007", unidadesVendidas: 24800 },
      { sku: "LZ-GO-75W(W)", unidadesVendidas: 15850 },
      { sku: "LZ-GO-75G(W)", unidadesVendidas: 15650 },
      { sku: "GO-ZW1000S", unidadesVendidas: 13800 },
      { sku: "LZ-GO-TW16", unidadesVendidas: 12300 },
      { sku: "LZ-GO-TW12", unidadesVendidas: 11725 },
      { sku: "WD-101K", unidadesVendidas: 11350 },
      { sku: "GO-ZW1000G", unidadesVendidas: 10675 },
      { sku: "LZ-GO-B004", unidadesVendidas: 5175 },
      { sku: "TM-G003", unidadesVendidas: 5175 },
      { sku: "TM-G004", unidadesVendidas: 4325 },
      { sku: "LZ-GO-YP06", unidadesVendidas: 2100 },
      { sku: "LZ-GO-SH09-3", unidadesVendidas: 1900 },
      { sku: "LZ-GO-T-HB06", unidadesVendidas: 1725 },
      { sku: "LZ-GO-TW500", unidadesVendidas: 1400 },
      { sku: "TM-C002", unidadesVendidas: 1350 },
      { sku: "LZ-GO-TWG700", unidadesVendidas: 1250 },
      { sku: "LZ-GO-YP07", unidadesVendidas: 1025 },
      { sku: "TM-B102", unidadesVendidas: 400 },
    ],
  },
  {
    nombre: "Noviembre 2025",
    mes: 11,
    anio: 2025,
    items: [
      { sku: "WD-103F", unidadesVendidas: 37981 },
      { sku: "TM-C007", unidadesVendidas: 14622 },
      { sku: "LZ-GO-75W(W)", unidadesVendidas: 10879 },
      { sku: "LZ-GO-75G(W)", unidadesVendidas: 10422 },
      { sku: "WD-101K", unidadesVendidas: 9607 },
      { sku: "TM-G003", unidadesVendidas: 9143 },
      { sku: "LZ-GO-P-SH89", unidadesVendidas: 8508 },
      { sku: "WD-102S", unidadesVendidas: 5928 },
      { sku: "LZ-GO-TW12", unidadesVendidas: 4279 },
      { sku: "TM-C002", unidadesVendidas: 4015 },
      { sku: "TM-G004", unidadesVendidas: 3741 },
      { sku: "LZ-GO-TW16", unidadesVendidas: 3579 },
      { sku: "LZ-GO-B004", unidadesVendidas: 2621 },
      { sku: "LZ-GO-SH09-3", unidadesVendidas: 1839 },
      { sku: "LZ-GO-T-HB06", unidadesVendidas: 1460 },
      { sku: "TM-B102", unidadesVendidas: 1017 },
      { sku: "GO-ZW1000S", unidadesVendidas: 1016 },
      { sku: "GO-ZW1000G", unidadesVendidas: 940 },
      { sku: "LZ-GO-YP06", unidadesVendidas: 698 },
      { sku: "LZ-GO-YP07", unidadesVendidas: 650 },
      { sku: "LZ-GO-TW500", unidadesVendidas: 400 },
      { sku: "LZ-GO-TWG700", unidadesVendidas: 400 },
      { sku: "ZP-280C", unidadesVendidas: 27 },
      { sku: "ZP-280CG", unidadesVendidas: 27 },
    ],
  },
  {
    nombre: "Diciembre 2025",
    mes: 12,
    anio: 2025,
    items: [
      { sku: "LZ-GO-P-SH89", unidadesVendidas: 28134 },
      { sku: "WD-103F", unidadesVendidas: 19179 },
      { sku: "GO-ZW1000S", unidadesVendidas: 14851 },
      { sku: "GO-ZW1000G", unidadesVendidas: 14453 },
      { sku: "TM-C007", unidadesVendidas: 11478 },
      { sku: "LZ-GO-75W(W)", unidadesVendidas: 9656 },
      { sku: "LZ-GO-75G(W)", unidadesVendidas: 9481 },
      { sku: "TM-C002", unidadesVendidas: 7702 },
      { sku: "LZ-GO-TW12", unidadesVendidas: 7200 },
      { sku: "LZ-GO-B004", unidadesVendidas: 6485 },
      { sku: "TM-G003", unidadesVendidas: 6058 },
      { sku: "TM-G004", unidadesVendidas: 5962 },
      { sku: "WD-101K", unidadesVendidas: 5628 },
      { sku: "LZ-GO-T-HB06", unidadesVendidas: 3880 },
      { sku: "LZ-GO-TW500", unidadesVendidas: 3352 },
      { sku: "LZ-GO-TWG700", unidadesVendidas: 3352 },
      { sku: "LZ-GO-TW16", unidadesVendidas: 3050 },
      { sku: "LZ-GO-YP06", unidadesVendidas: 2866 },
      { sku: "LZ-GO-SH09-3", unidadesVendidas: 2328 },
      { sku: "LZ-GO-YP07", unidadesVendidas: 1860 },
      { sku: "TO-BA40L", unidadesVendidas: 1200 },
      { sku: "TO-BC30L", unidadesVendidas: 500 },
      { sku: "ZP-280C", unidadesVendidas: 453 },
      { sku: "TM-B102", unidadesVendidas: 409 },
      { sku: "TO-BC50", unidadesVendidas: 400 },
      { sku: "TO-BA20", unidadesVendidas: 300 },
      { sku: "WD-102S", unidadesVendidas: 102 },
      { sku: "TO-BC30", unidadesVendidas: 100 },
      { sku: "ZP-280CG", unidadesVendidas: 3 },
    ],
  },
  {
    nombre: "Enero 2026",
    mes: 1,
    anio: 2026,
    items: [
      { sku: "WD-103F", unidadesVendidas: 32128 },
      { sku: "LZ-GO-75W(W)", unidadesVendidas: 20341 },
      { sku: "LZ-GO-TW12", unidadesVendidas: 14834 },
      { sku: "WD-101K", unidadesVendidas: 13402 },
      { sku: "LZ-GO-75G(W)", unidadesVendidas: 12816 },
      { sku: "LZ-GO-P-SH89", unidadesVendidas: 12018 },
      { sku: "GO-ZW1000S", unidadesVendidas: 10535 },
      { sku: "TM-C002", unidadesVendidas: 9658 },
      { sku: "TM-C007", unidadesVendidas: 7580 },
      { sku: "LZ-GO-TW16", unidadesVendidas: 7162 },
      { sku: "GO-ZW1000G", unidadesVendidas: 6284 },
      { sku: "LZ-GO-B004", unidadesVendidas: 5562 },
      { sku: "WD-102S", unidadesVendidas: 5154 },
      { sku: "TO-BC50L", unidadesVendidas: 5000 },
      { sku: "LZ-GO-TW500", unidadesVendidas: 3717 },
      { sku: "TM-G004", unidadesVendidas: 3656 },
      { sku: "TM-G003", unidadesVendidas: 2879 },
      { sku: "ZP-280C", unidadesVendidas: 2684 },
      { sku: "LZ-GO-TWG700", unidadesVendidas: 2515 },
      { sku: "LZ-GO-T-HB06", unidadesVendidas: 2284 },
      { sku: "LZ-GO-PSH08-3", unidadesVendidas: 1600 },
      { sku: "LZ-GO-YP06", unidadesVendidas: 392 },
      { sku: "LZ-GO-YP07", unidadesVendidas: 391 },
      { sku: "TO-BA40", unidadesVendidas: 300 },
      { sku: "TO-BC50", unidadesVendidas: 300 },
      { sku: "ZP-280CG", unidadesVendidas: 283 },
      { sku: "LZ-GO-TW04", unidadesVendidas: 200 },
      { sku: "TM-B102", unidadesVendidas: 173 },
      { sku: "TO-BR30", unidadesVendidas: 106 },
      { sku: "TO-BC30L", unidadesVendidas: 100 },
      { sku: "LZ-GO-SH09-3", unidadesVendidas: 58 },
      { sku: "TO-BA20", unidadesVendidas: 15 },
      { sku: "TO-BA30", unidadesVendidas: 5 },
    ],
  },
  {
    nombre: "Febrero 2026",
    mes: 2,
    anio: 2026,
    items: [
      { sku: "WD-103F", unidadesVendidas: 56028 },
      { sku: "WD-102S", unidadesVendidas: 30903 },
      { sku: "WD-101K", unidadesVendidas: 24603 },
      { sku: "LZ-GO-TW12", unidadesVendidas: 18901 },
      { sku: "GO-ZW1000S", unidadesVendidas: 14355 },
      { sku: "GO-ZW1000G", unidadesVendidas: 12880 },
      { sku: "LZ-GO-TW16", unidadesVendidas: 12001 },
      { sku: "TM-C007", unidadesVendidas: 10403 },
      { sku: "LZ-GO-P-SH89", unidadesVendidas: 10102 },
      { sku: "LZ-GO-TW04", unidadesVendidas: 10000 },
      { sku: "LZ-GO-75W(W)", unidadesVendidas: 9905 },
      { sku: "LZ-GO-75G(W)", unidadesVendidas: 9280 },
      { sku: "LZ-GO-TW500", unidadesVendidas: 9129 },
      { sku: "LZ-GO-TWG700", unidadesVendidas: 8854 },
      { sku: "TO-BA20", unidadesVendidas: 6619 },
      { sku: "TO-BC50", unidadesVendidas: 6002 },
      { sku: "TM-C002", unidadesVendidas: 5103 },
      { sku: "TO-BC40", unidadesVendidas: 5002 },
      { sku: "TO-BA40", unidadesVendidas: 4500 },
      { sku: "LZ-GO-B004", unidadesVendidas: 3879 },
      { sku: "LZ-GO-T-HB06", unidadesVendidas: 3678 },
      { sku: "TM-G003", unidadesVendidas: 2952 },
      { sku: "TM-G004", unidadesVendidas: 2654 },
      { sku: "TM-B102", unidadesVendidas: 2403 },
      { sku: "LZ-GO-YP06", unidadesVendidas: 1828 },
      { sku: "TO-BA20L", unidadesVendidas: 1800 },
      { sku: "LZ-GO-YP07", unidadesVendidas: 1753 },
      { sku: "TO-BA30", unidadesVendidas: 1202 },
      { sku: "TO-BR40L", unidadesVendidas: 1000 },
      { sku: "LZ-GO-SH09-3", unidadesVendidas: 671 },
      { sku: "TO-BA30L", unidadesVendidas: 600 },
      { sku: "TO-BC40L", unidadesVendidas: 300 },
      { sku: "ZP-280C", unidadesVendidas: 280 },
      { sku: "ZP-280CG", unidadesVendidas: 254 },
      { sku: "TO-BR30", unidadesVendidas: 107 },
      { sku: "TO-BR30L", unidadesVendidas: 100 },
      { sku: "TO-BR50", unidadesVendidas: 100 },
      { sku: "TO-BC30", unidadesVendidas: 2 },
    ],
  },
  {
    nombre: "Marzo 2026",
    mes: 3,
    anio: 2026,
    items: [
      { sku: "WD-102S", unidadesVendidas: 48500 },
      { sku: "WD-103F", unidadesVendidas: 45200 },
      { sku: "LZ-GO-P-SH89", unidadesVendidas: 29630 },
      { sku: "LZ-GO-75W(W)", unidadesVendidas: 29550 },
      { sku: "LZ-GO-75G(W)", unidadesVendidas: 28575 },
      { sku: "GO-ZW1000S", unidadesVendidas: 25750 },
      { sku: "LZ-GO-TW500", unidadesVendidas: 24775 },
      { sku: "GO-ZW1000G", unidadesVendidas: 24600 },
      { sku: "TO-BA40", unidadesVendidas: 19800 },
      { sku: "LZ-GO-TWG700", unidadesVendidas: 13675 },
      { sku: "WD-101K", unidadesVendidas: 10675 },
      { sku: "LZ-GO-PSH08-3", unidadesVendidas: 8600 },
      { sku: "TM-C007", unidadesVendidas: 7900 },
      { sku: "TO-BA20L", unidadesVendidas: 7800 },
      { sku: "TO-BA20", unidadesVendidas: 7200 },
      { sku: "TM-C002", unidadesVendidas: 7075 },
      { sku: "LZ-GO-YP06", unidadesVendidas: 7052 },
      { sku: "LZ-GO-YP07", unidadesVendidas: 6052 },
      { sku: "TO-BA30", unidadesVendidas: 4500 },
      { sku: "LZ-GO-T-HB06", unidadesVendidas: 4425 },
      { sku: "LZ-GO-TW04", unidadesVendidas: 4000 },
      { sku: "LZ-GO-B004", unidadesVendidas: 2850 },
      { sku: "LZ-GO-TW12", unidadesVendidas: 2650 },
      { sku: "LZ-GO-TW16", unidadesVendidas: 2350 },
      { sku: "TO-BC40L", unidadesVendidas: 2300 },
      { sku: "TO-BC50", unidadesVendidas: 2200 },
      { sku: "TO-BC40", unidadesVendidas: 1900 },
      { sku: "TO-BA30L", unidadesVendidas: 1800 },
      { sku: "TO-BR30", unidadesVendidas: 1600 },
      { sku: "TM-B102", unidadesVendidas: 1405 },
      { sku: "TM-G003", unidadesVendidas: 1250 },
      { sku: "ZP-280C", unidadesVendidas: 1125 },
      { sku: "TO-BA40L", unidadesVendidas: 900 },
      { sku: "TO-BC50L", unidadesVendidas: 900 },
      { sku: "TO-BC30L", unidadesVendidas: 700 },
      { sku: "ZP-280CG", unidadesVendidas: 550 },
      { sku: "TO-BR30L", unidadesVendidas: 500 },
      { sku: "TO-BR40", unidadesVendidas: 500 },
      { sku: "TO-BC30", unidadesVendidas: 300 },
      { sku: "TO-BR50", unidadesVendidas: 100 },
      { sku: "TO-BR50L", unidadesVendidas: 100 },
      { sku: "TM-G004", unidadesVendidas: 93 },
      { sku: "LZ-GO-SH09-3", unidadesVendidas: 25 },
    ],
  },
  {
    nombre: "Abril 2026",
    mes: 4,
    anio: 2026,
    items: [
      { sku: "LZ-GO-TW500", unidadesVendidas: 76950 },
      { sku: "TM-B102", unidadesVendidas: 64300 },
      { sku: "LZ-GO-TWG700", unidadesVendidas: 54225 },
      { sku: "WD-102S", unidadesVendidas: 39350 },
      { sku: "LZ-GO-TW12", unidadesVendidas: 36900 },
      { sku: "WD-103F", unidadesVendidas: 35800 },
      { sku: "LZ-GO-TW16", unidadesVendidas: 22850 },
      { sku: "ZP-280C", unidadesVendidas: 21700 },
      { sku: "LZ-GO-P-SH89", unidadesVendidas: 18950 },
      { sku: "LZ-GO-75W(W)", unidadesVendidas: 17914 },
      { sku: "LZ-GO-75G(W)", unidadesVendidas: 15200 },
      { sku: "GO-ZW1000S", unidadesVendidas: 13700 },
      { sku: "LZ-GO-YP06", unidadesVendidas: 13675 },
      { sku: "LZ-GO-YP07", unidadesVendidas: 13450 },
      { sku: "GO-ZW1000G", unidadesVendidas: 13225 },
      { sku: "WD-101K", unidadesVendidas: 12425 },
      { sku: "ZP-280CG", unidadesVendidas: 11000 },
      { sku: "TM-C007", unidadesVendidas: 8925 },
      { sku: "TO-BA30", unidadesVendidas: 8100 },
      { sku: "LZ-GO-T-HB06", unidadesVendidas: 5400 },
      { sku: "TO-BA40", unidadesVendidas: 5100 },
      { sku: "LZ-GO-B004", unidadesVendidas: 4525 },
      { sku: "TO-BC50", unidadesVendidas: 3500 },
      { sku: "TO-BC40", unidadesVendidas: 3300 },
      { sku: "LZ-GO-PSH08-3", unidadesVendidas: 3025 },
      { sku: "TO-BA20", unidadesVendidas: 2700 },
      { sku: "LZ-GO-TW04", unidadesVendidas: 2450 },
      { sku: "TO-BA30L", unidadesVendidas: 2400 },
      { sku: "TO-BC40L", unidadesVendidas: 2000 },
      { sku: "TM-C002", unidadesVendidas: 1950 },
      { sku: "TO-BA20L", unidadesVendidas: 1800 },
      { sku: "TO-BR40", unidadesVendidas: 1400 },
      { sku: "TO-BR50", unidadesVendidas: 1000 },
      { sku: "TM-G003", unidadesVendidas: 800 },
      { sku: "TO-BR30", unidadesVendidas: 700 },
      { sku: "TO-BC30", unidadesVendidas: 500 },
      { sku: "TO-BC50L", unidadesVendidas: 400 },
      { sku: "LZ-GO-SH09-3", unidadesVendidas: 150 },
      { sku: "TO-BC30L", unidadesVendidas: 100 },
      { sku: "TO-BR30L", unidadesVendidas: 100 },
    ],
  },
];

type LegacyPeriodKey =
  | "2024-11"
  | "2024-12"
  | "2025-01"
  | "2025-02"
  | "2025-03"
  | "2025-04"
  | "2025-05";

type LegacySalesRow = {
  sku: string;
  values: Record<LegacyPeriodKey, number>;
};

const legacyPeriodNames: Record<LegacyPeriodKey, string> = {
  "2024-11": "Noviembre 2024",
  "2024-12": "Diciembre 2024",
  "2025-01": "Enero 2025",
  "2025-02": "Febrero 2025",
  "2025-03": "Marzo 2025",
  "2025-04": "Abril 2025",
  "2025-05": "Mayo 2025",
};

const legacyPeriodKeys = Object.keys(legacyPeriodNames) as LegacyPeriodKey[];

const legacySalesData: LegacySalesRow[] = [
  { sku: "LZ-GO-YP06", values: { "2024-11": 0, "2024-12": 0, "2025-01": 0, "2025-02": 0, "2025-03": 0, "2025-04": 0, "2025-05": 0 } },
  { sku: "LZ-GO-75W(W)", values: { "2024-11": 32755, "2024-12": 17055, "2025-01": 10400, "2025-02": 2170, "2025-03": 31060, "2025-04": 8435, "2025-05": 8145 } },
  { sku: "ZP-280C", values: { "2024-11": 0, "2024-12": 0, "2025-01": 0, "2025-02": 0, "2025-03": 0, "2025-04": 0, "2025-05": 0 } },
  { sku: "LZ-GO-TW500", values: { "2024-11": 22300, "2024-12": 2400, "2025-01": 3325, "2025-02": 14725, "2025-03": 4800, "2025-04": 32956, "2025-05": 10130 } },
  { sku: "GO-ZW1000S", values: { "2024-11": 1500, "2024-12": 3950, "2025-01": 12300, "2025-02": 1075, "2025-03": 4120, "2025-04": 15645, "2025-05": 15375 } },
  { sku: "WD-102S", values: { "2024-11": 7320, "2024-12": 19225, "2025-01": 5230, "2025-02": 46570, "2025-03": 10155, "2025-04": 34340, "2025-05": 8110 } },
  { sku: "WD-101K", values: { "2024-11": 5305, "2024-12": 6555, "2025-01": 5040, "2025-02": 38400, "2025-03": 12310, "2025-04": 6495, "2025-05": 6925 } },
  { sku: "LZ-GO-TW12", values: { "2024-11": 3000, "2024-12": 1390, "2025-01": 1700, "2025-02": 710, "2025-03": 16800, "2025-04": 7860, "2025-05": 5660 } },
  { sku: "LZ-GO-SH09-3", values: { "2024-11": 800, "2024-12": 3200, "2025-01": 1400, "2025-02": 1200, "2025-03": 1400, "2025-04": 2800, "2025-05": 3000 } },
  { sku: "LZ-GO-T-HB06", values: { "2024-11": 600, "2024-12": 0, "2025-01": 600, "2025-02": 0, "2025-03": 0, "2025-04": 500, "2025-05": 1500 } },
  { sku: "LZ-GO-B004", values: { "2024-11": 2650, "2024-12": 2660, "2025-01": 2400, "2025-02": 5900, "2025-03": 6535, "2025-04": 8140, "2025-05": 6475 } },
  { sku: "LZ-GO-P-SH89", values: { "2024-11": 15960, "2024-12": 11600, "2025-01": 26200, "2025-02": 10850, "2025-03": 25465, "2025-04": 18284, "2025-05": 12725 } },
  { sku: "TM-B102", values: { "2024-11": 2570, "2024-12": 2210, "2025-01": 3210, "2025-02": 1100, "2025-03": 2250, "2025-04": 360, "2025-05": 150 } },
  { sku: "LZ-GO-YP08", values: { "2024-11": 2625, "2024-12": 750, "2025-01": 2750, "2025-02": 7525, "2025-03": 7075, "2025-04": 10075, "2025-05": 12930 } },
  { sku: "LZ-GO-YP09", values: { "2024-11": 1475, "2024-12": 2150, "2025-01": 2275, "2025-02": 5900, "2025-03": 4725, "2025-04": 5360, "2025-05": 6950 } },
  { sku: "LZ-GO-YP07", values: { "2024-11": 0, "2024-12": 0, "2025-01": 0, "2025-02": 0, "2025-03": 0, "2025-04": 0, "2025-05": 0 } },
  { sku: "LZ-GO-75G(W)", values: { "2024-11": 30105, "2024-12": 17955, "2025-01": 9900, "2025-02": 1720, "2025-03": 30785, "2025-04": 8330, "2025-05": 5950 } },
  { sku: "ZP-280CG", values: { "2024-11": 0, "2024-12": 0, "2025-01": 0, "2025-02": 0, "2025-03": 0, "2025-04": 0, "2025-05": 0 } },
  { sku: "LZ-GO-TWG700", values: { "2024-11": 22300, "2024-12": 2400, "2025-01": 3325, "2025-02": 2450, "2025-03": 3125, "2025-04": 31325, "2025-05": 7460 } },
  { sku: "GO-ZW1000G", values: { "2024-11": 1200, "2024-12": 3950, "2025-01": 12300, "2025-02": 1025, "2025-03": 3375, "2025-04": 15345, "2025-05": 14575 } },
  { sku: "LZ-GO-TW16", values: { "2024-11": 2500, "2024-12": 1020, "2025-01": 1700, "2025-02": 410, "2025-03": 16160, "2025-04": 7400, "2025-05": 4310 } },
  { sku: "TM-G004", values: { "2024-11": 1150, "2024-12": 3300, "2025-01": 500, "2025-02": 2100, "2025-03": 6050, "2025-04": 3300, "2025-05": 660 } },
  { sku: "TM-G003", values: { "2024-11": 300, "2024-12": 4850, "2025-01": 1500, "2025-02": 2100, "2025-03": 6650, "2025-04": 7550, "2025-05": 1950 } },
  { sku: "WD-103F", values: { "2024-11": 25420, "2024-12": 20855, "2025-01": 15490, "2025-02": 50970, "2025-03": 34405, "2025-04": 22795, "2025-05": 19700 } },
  { sku: "TM-C002", values: { "2024-11": 2800, "2024-12": 5850, "2025-01": 3500, "2025-02": 10630, "2025-03": 8450, "2025-04": 3725, "2025-05": 910 } },
  { sku: "TM-C007", values: { "2024-11": 15000, "2024-12": 25350, "2025-01": 10050, "2025-02": 4600, "2025-03": 35700, "2025-04": 14050, "2025-05": 18275 } },
];

function legacyPeriodToDate(key: LegacyPeriodKey) {
  const [anio, mes] = key.split("-").map(Number);
  return { anio, mes };
}

periods.unshift(
  ...legacyPeriodKeys.map((key) => {
    const { anio, mes } = legacyPeriodToDate(key);

    return {
      nombre: legacyPeriodNames[key],
      anio,
      mes,
      items: legacySalesData.map((row) => ({
        sku: row.sku,
        unidadesVendidas: row.values[key],
      })),
    };
  }),
);

function normalizeUnits(value: number) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`Unidad vendida inválida: ${value}`);
  }

  return Math.trunc(value);
}

async function main() {
  const missingSkus = new Set<string>();
  const summaries: Array<{
    nombre: string;
    status: "creado" | "actualizado";
    itemsLoaded: number;
  }> = [];

  for (const period of periods) {
    const existing = await prisma.ventaMensualPeriodo.findUnique({
      where: { anio_mes: { anio: period.anio, mes: period.mes } },
    });
    const periodo = await prisma.ventaMensualPeriodo.upsert({
      where: { anio_mes: { anio: period.anio, mes: period.mes } },
      update: { nombre: period.nombre },
      create: {
        nombre: period.nombre,
        mes: period.mes,
        anio: period.anio,
      },
    });

    let itemsLoaded = 0;

    for (const item of period.items) {
      const producto = await prisma.producto.findUnique({
        where: { sku: item.sku },
        select: { id: true },
      });

      if (!producto) {
        missingSkus.add(item.sku);
        console.warn(`[WARN] SKU no encontrado: ${item.sku}`);
        continue;
      }

      await prisma.ventaMensualItem.upsert({
        where: {
          periodoId_productoId: {
            periodoId: periodo.id,
            productoId: producto.id,
          },
        },
        update: { unidadesVendidas: normalizeUnits(item.unidadesVendidas) },
        create: {
          periodoId: periodo.id,
          productoId: producto.id,
          unidadesVendidas: normalizeUnits(item.unidadesVendidas),
        },
      });
      itemsLoaded += 1;
    }

    summaries.push({
      nombre: period.nombre,
      status: existing ? "actualizado" : "creado",
      itemsLoaded,
    });
  }

  console.log("Carga de ventas históricas 2025 finalizada.");
  for (const summary of summaries) {
    console.log(
      `- ${summary.nombre}: ${summary.status}, ${summary.itemsLoaded} items cargados`,
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
