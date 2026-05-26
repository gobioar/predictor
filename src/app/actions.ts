"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const asString = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

const asInt = (formData: FormData, key: string) => {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? Math.trunc(value) : NaN;
};

const fail = (path: string, message: string) => {
  const separator = path.includes("?") ? "&" : "?";
  redirect(`${path}${separator}error=${encodeURIComponent(message)}`);
};

const prismaMessage = (error: unknown, fallback: string) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") return "Ya existe un registro con esos datos.";
    if (error.code === "P2003") return "No se puede eliminar porque tiene datos relacionados.";
  }
  return fallback;
};

export async function createFamilia(formData: FormData) {
  const nombre = asString(formData, "nombre");
  if (nombre.length < 2) fail("/familias", "El nombre debe tener al menos 2 caracteres.");

  try {
    await prisma.familiaProducto.create({ data: { nombre } });
  } catch (error) {
    fail("/familias", prismaMessage(error, "No se pudo crear la familia."));
  }

  revalidatePath("/familias");
  redirect("/familias");
}

export async function updateFamilia(formData: FormData) {
  const id = asInt(formData, "id");
  const nombre = asString(formData, "nombre");
  if (!id || nombre.length < 2) fail("/familias", "Revisá el nombre de la familia.");

  try {
    await prisma.familiaProducto.update({ where: { id }, data: { nombre } });
  } catch (error) {
    fail("/familias", prismaMessage(error, "No se pudo editar la familia."));
  }

  revalidatePath("/familias");
  redirect("/familias");
}

export async function deleteFamilia(formData: FormData) {
  const id = asInt(formData, "id");
  try {
    await prisma.familiaProducto.delete({ where: { id } });
  } catch (error) {
    fail("/familias", prismaMessage(error, "No se pudo eliminar la familia."));
  }

  revalidatePath("/familias");
  redirect("/familias");
}

export async function createTipo(formData: FormData) {
  const nombre = asString(formData, "nombre");
  if (nombre.length < 2) fail("/tipos-producto", "El nombre debe tener al menos 2 caracteres.");

  try {
    await prisma.tipoProductoVenta.create({ data: { nombre } });
  } catch (error) {
    fail("/tipos-producto", prismaMessage(error, "No se pudo crear el tipo."));
  }

  revalidatePath("/tipos-producto");
  redirect("/tipos-producto");
}

export async function updateTipo(formData: FormData) {
  const id = asInt(formData, "id");
  const nombre = asString(formData, "nombre");
  if (!id || nombre.length < 2) fail("/tipos-producto", "Revisá el nombre del tipo.");

  try {
    await prisma.tipoProductoVenta.update({ where: { id }, data: { nombre } });
  } catch (error) {
    fail("/tipos-producto", prismaMessage(error, "No se pudo editar el tipo."));
  }

  revalidatePath("/tipos-producto");
  redirect("/tipos-producto");
}

export async function deleteTipo(formData: FormData) {
  const id = asInt(formData, "id");
  try {
    await prisma.tipoProductoVenta.delete({ where: { id } });
  } catch (error) {
    fail("/tipos-producto", prismaMessage(error, "No se pudo eliminar el tipo."));
  }

  revalidatePath("/tipos-producto");
  redirect("/tipos-producto");
}

export async function createProducto(formData: FormData) {
  const sku = asString(formData, "sku");
  const nombre = asString(formData, "nombre");
  const familiaId = asInt(formData, "familiaId");
  const tipoProductoVentaId = asInt(formData, "tipoProductoVentaId");
  const activo = formData.get("activo") === "on";

  if (!sku || nombre.length < 2 || !familiaId || !tipoProductoVentaId) {
    fail("/productos", "Completá SKU, nombre, familia y tipo.");
  }

  try {
    await prisma.producto.create({
      data: { sku, nombre, familiaId, tipoProductoVentaId, activo },
    });
  } catch (error) {
    fail("/productos", prismaMessage(error, "No se pudo crear el producto."));
  }

  revalidatePath("/productos");
  redirect("/productos");
}

export async function updateProducto(formData: FormData) {
  const id = asInt(formData, "id");
  const sku = asString(formData, "sku");
  const nombre = asString(formData, "nombre");
  const familiaId = asInt(formData, "familiaId");
  const tipoProductoVentaId = asInt(formData, "tipoProductoVentaId");
  const activo = formData.get("activo") === "on";

  if (!id || !sku || nombre.length < 2 || !familiaId || !tipoProductoVentaId) {
    fail("/productos", "Revisá los datos del producto.");
  }

  try {
    await prisma.producto.update({
      where: { id },
      data: { sku, nombre, familiaId, tipoProductoVentaId, activo },
    });
  } catch (error) {
    fail("/productos", prismaMessage(error, "No se pudo editar el producto."));
  }

  revalidatePath("/productos");
  redirect("/productos");
}

export async function deleteProducto(formData: FormData) {
  const id = asInt(formData, "id");
  const returnTo = asString(formData, "returnTo");
  const redirectTo = returnTo.startsWith("/productos") ? returnTo : "/productos";

  try {
    await prisma.producto.delete({ where: { id } });
  } catch (error) {
    fail("/productos", prismaMessage(error, "No se pudo eliminar el producto."));
  }

  revalidatePath("/productos");
  redirect(redirectTo);
}

export async function saveVentaPeriodo(formData: FormData) {
  const id = asInt(formData, "id");
  const nombre = asString(formData, "nombre");
  const mes = asInt(formData, "mes");
  const anio = asInt(formData, "anio");
  const formPath = asString(formData, "formPath") || "/ventas/nuevo";
  const productoIds = formData
    .getAll("productoId")
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value > 0);

  if (nombre.length < 2 || mes < 1 || mes > 12 || anio < 2000) {
    fail(formPath, "Completá nombre, mes y año válidos.");
  }

  const items = productoIds.map((productoId) => {
    const unidadesVendidas = Number(formData.get(`unidades_${productoId}`) ?? 0);
    return {
      productoId,
      unidadesVendidas: Number.isFinite(unidadesVendidas)
        ? Math.trunc(unidadesVendidas)
        : -1,
    };
  });

  if (items.some((item) => item.unidadesVendidas < 0)) {
    fail(formPath, "Las unidades vendidas deben ser enteros mayores o iguales a 0.");
  }

  try {
    await prisma.$transaction(async (tx) => {
      const periodo = id
        ? await tx.ventaMensualPeriodo.update({
            where: { id },
            data: { nombre, mes, anio },
          })
        : await tx.ventaMensualPeriodo.create({
            data: { nombre, mes, anio },
          });

      for (const item of items) {
        await tx.ventaMensualItem.upsert({
          where: {
            periodoId_productoId: {
              periodoId: periodo.id,
              productoId: item.productoId,
            },
          },
          update: { unidadesVendidas: item.unidadesVendidas },
          create: {
            periodoId: periodo.id,
            productoId: item.productoId,
            unidadesVendidas: item.unidadesVendidas,
          },
        });
      }
    });
  } catch (error) {
    fail(formPath, prismaMessage(error, "No se pudo guardar el mes de ventas."));
  }

  revalidatePath("/ventas");
  revalidatePath("/reporte");
  redirect("/ventas");
}

export async function deleteVentaPeriodo(formData: FormData) {
  const id = asInt(formData, "id");
  const returnTo = asString(formData, "returnTo");
  const redirectTo = returnTo.startsWith("/ventas") ? returnTo : "/ventas";

  try {
    await prisma.ventaMensualPeriodo.delete({ where: { id } });
  } catch (error) {
    fail(redirectTo, prismaMessage(error, "No se pudo eliminar el mes de ventas."));
  }

  revalidatePath("/ventas");
  revalidatePath("/reporte");
  redirect(redirectTo);
}

export async function updateForecastConfig(formData: FormData) {
  const movingAverageN = asInt(formData, "movingAverageN");
  const forecastHorizonMonths = asInt(formData, "forecastHorizonMonths");
  const polynomialDegree = asInt(formData, "polynomialDegree");
  const maxMonthlyGrowthRate = Number(formData.get("maxMonthlyGrowthRate"));
  const holtWintersSeasonLength = asInt(formData, "holtWintersSeasonLength");
  const holtWintersMinRequiredMonths = asInt(formData, "holtWintersMinRequiredMonths");

  if (
    movingAverageN < 1 ||
    forecastHorizonMonths < 1 ||
    ![2, 3].includes(polynomialDegree) ||
    !Number.isFinite(maxMonthlyGrowthRate) ||
    maxMonthlyGrowthRate < 0 ||
    holtWintersSeasonLength < 2 ||
    holtWintersMinRequiredMonths < holtWintersSeasonLength
  ) {
    fail("/configuracion", "Revisá los parámetros del forecast.");
  }

  await prisma.forecastConfig.upsert({
    where: { id: 1 },
    update: {
      movingAverageN,
      forecastHorizonMonths,
      polynomialDegree,
      maxMonthlyGrowthRate,
      holtWintersSeasonLength,
      holtWintersTrendType: "additive",
      holtWintersSeasonalType: "multiplicative",
      holtWintersMinRequiredMonths,
    },
    create: {
      id: 1,
      movingAverageN,
      forecastHorizonMonths,
      polynomialDegree,
      maxMonthlyGrowthRate,
      holtWintersSeasonLength,
      holtWintersTrendType: "additive",
      holtWintersSeasonalType: "multiplicative",
      holtWintersMinRequiredMonths,
    },
  });

  revalidatePath("/configuracion");
  revalidatePath("/reporte");
  redirect("/configuracion");
}
