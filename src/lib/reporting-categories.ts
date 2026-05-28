export const reportingMaterialKeys = [
  "bagazo",
  "madera",
  "bioplastico",
  "fibra",
  "kraft",
  "pet",
  "servicios",
  "extras",
] as const;

export type ReportingMaterial = (typeof reportingMaterialKeys)[number];

export const reportingMaterialLabels: Record<ReportingMaterial, string> = {
  bagazo: "Bagazo",
  madera: "Madera",
  bioplastico: "Bioplástico",
  fibra: "Fibra",
  kraft: "Kraft",
  pet: "PET",
  servicios: "Servicios",
  extras: "Extras",
};

export type ReportingProductInput = {
  sku: string;
  nombre: string;
  tipoProductoVenta?: { nombre: string } | null;
  familia?: { nombre: string } | null;
};

const normalizeText = (value: string | null | undefined) =>
  (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const productText = (producto: ReportingProductInput) =>
  [
    producto.sku,
    producto.nombre,
    producto.tipoProductoVenta?.nombre,
    producto.familia?.nombre,
  ]
    .map(normalizeText)
    .join(" ");

const productSku = (producto: ReportingProductInput) => normalizeText(producto.sku);

export function isServicio(producto: ReportingProductInput) {
  const text = productText(producto);
  const sku = productSku(producto);

  return (
    text.includes("servicio") ||
    text.includes("envio") ||
    text.includes("impresion") ||
    text.includes("interes") ||
    sku.startsWith("env") ||
    sku.startsWith("m-") ||
    sku.startsWith("imp-") ||
    sku.startsWith("int-")
  );
}

export function isBagazo(producto: ReportingProductInput) {
  const text = productText(producto);

  return text.includes("bagazo") || text.includes("cana");
}

export function isMadera(producto: ReportingProductInput) {
  return productText(producto).includes("madera");
}

export function isBioplastico(producto: ReportingProductInput) {
  const text = productText(producto);

  return (
    text.includes("bioplastico") ||
    text.includes("compostable") ||
    text.includes("compostables")
  );
}

export function isFibra(producto: ReportingProductInput) {
  return productText(producto).includes("fibra");
}

export function isKraft(producto: ReportingProductInput) {
  const text = productText(producto);

  return text.includes("kraft") || text.includes("papel kraft");
}

export function isPet(producto: ReportingProductInput) {
  const text = productText(producto);

  return text.includes("pet") || text.includes("cristal");
}

export function isExtra(producto: ReportingProductInput) {
  return getReportingMaterial(producto) === "extras";
}

export function getReportingMaterial(producto: ReportingProductInput): ReportingMaterial {
  if (isServicio(producto)) return "servicios";
  if (isBagazo(producto)) return "bagazo";
  if (isMadera(producto)) return "madera";
  if (isBioplastico(producto)) return "bioplastico";
  if (isFibra(producto)) return "fibra";
  if (isKraft(producto)) return "kraft";
  if (isPet(producto)) return "pet";

  return "extras";
}
