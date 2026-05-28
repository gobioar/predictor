"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createSession,
  logout,
  requireAuth,
  verifyPassword,
} from "@/lib/auth";
import { forecastModelKeys, type ForecastModelKey } from "@/lib/forecast-report";
import {
  MAX_FORECAST_HORIZON_MONTHS,
  MIN_FORECAST_HORIZON_MONTHS,
} from "@/lib/forecast-config";
import { prisma } from "@/lib/prisma";

const asString = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

const asInt = (formData: FormData, key: string) => {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? Math.trunc(value) : NaN;
};

const asDecimalNumber = (formData: FormData, key: string) => {
  const raw = String(formData.get(key) ?? "0").trim().replace(",", ".");
  const value = Number(raw || 0);
  return Number.isFinite(value) ? value : NaN;
};

const tiposProduccion = ["Propio", "Externo"] as const;
const economicProjectionMethods = ["lastKnown", "movingAverage", "manualGrowth"] as const;

const asTipoProduccion = (formData: FormData) => {
  const value = asString(formData, "tipoProduccion");
  return tiposProduccion.includes(value as (typeof tiposProduccion)[number])
    ? value
    : "Propio";
};

const fail = (path: string, message: string): never => {
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
  await requireAuth();

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
  await requireAuth();

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
  await requireAuth();

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
  await requireAuth();

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
  await requireAuth();

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
  await requireAuth();

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
  await requireAuth();

  const sku = asString(formData, "sku");
  const nombre = asString(formData, "nombre");
  const familiaId = asInt(formData, "familiaId");
  const tipoProductoVentaId = asInt(formData, "tipoProductoVentaId");
  const tipoProduccion = asTipoProduccion(formData);
  const activo = formData.get("activo") === "on";

  if (!sku || nombre.length < 2 || !familiaId || !tipoProductoVentaId) {
    fail("/productos", "Completá SKU, nombre, familia y tipo.");
  }

  try {
    await prisma.producto.create({
      data: { sku, nombre, familiaId, tipoProductoVentaId, tipoProduccion, activo },
    });
  } catch (error) {
    fail("/productos", prismaMessage(error, "No se pudo crear el producto."));
  }

  revalidatePath("/productos");
  redirect("/productos");
}

export async function updateProducto(formData: FormData) {
  await requireAuth();

  const id = asInt(formData, "id");
  const sku = asString(formData, "sku");
  const nombre = asString(formData, "nombre");
  const familiaId = asInt(formData, "familiaId");
  const tipoProductoVentaId = asInt(formData, "tipoProductoVentaId");
  const tipoProduccion = asTipoProduccion(formData);
  const activo = formData.get("activo") === "on";

  if (!id || !sku || nombre.length < 2 || !familiaId || !tipoProductoVentaId) {
    fail("/productos", "Revisá los datos del producto.");
  }

  try {
    await prisma.producto.update({
      where: { id },
      data: { sku, nombre, familiaId, tipoProductoVentaId, tipoProduccion, activo },
    });
  } catch (error) {
    fail("/productos", prismaMessage(error, "No se pudo editar el producto."));
  }

  revalidatePath("/productos");
  redirect("/productos");
}

export async function deleteProducto(formData: FormData) {
  await requireAuth();

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
  await requireAuth();

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
  await requireAuth();

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

export async function savePrecioCostoPeriodo(formData: FormData) {
  await requireAuth();

  const id = asInt(formData, "id");
  const nombre = asString(formData, "nombre");
  const mes = asInt(formData, "mes");
  const anio = asInt(formData, "anio");
  const formPath = asString(formData, "formPath") || "/precios-costos/nuevo";
  const productoIds = formData
    .getAll("productoId")
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value > 0);

  if (nombre.length < 2 || mes < 1 || mes > 12 || anio < 2000 || anio > 2100) {
    fail(formPath, "Completá nombre, mes y año válidos.");
  }

  const existingProducts = await prisma.producto.findMany({
    where: { id: { in: productoIds } },
    select: { id: true },
  });
  const existingProductIds = new Set(existingProducts.map((producto) => producto.id));

  const items = productoIds.map((productoId) => {
    const precioVentaPromedio = asDecimalNumber(
      formData,
      `precioVentaPromedio_${productoId}`,
    );
    const costoUnitarioPromedio = asDecimalNumber(
      formData,
      `costoUnitarioPromedio_${productoId}`,
    );

    return {
      productoId,
      precioVentaPromedio,
      costoUnitarioPromedio,
    };
  });

  if (items.some((item) => !existingProductIds.has(item.productoId))) {
    fail(formPath, "Uno o más productos no existen.");
  }

  if (
    items.some(
      (item) =>
        !Number.isFinite(item.precioVentaPromedio) ||
        !Number.isFinite(item.costoUnitarioPromedio) ||
        item.precioVentaPromedio < 0 ||
        item.costoUnitarioPromedio < 0,
    )
  ) {
    fail(formPath, "Precios y costos deben ser números mayores o iguales a 0.");
  }

  try {
    await prisma.$transaction(async (tx) => {
      const periodo = id
        ? await tx.precioCostoMensualPeriodo.update({
            where: { id },
            data: { nombre, mes, anio },
          })
        : await tx.precioCostoMensualPeriodo.create({
            data: { nombre, mes, anio },
          });

      for (const item of items) {
        if (item.precioVentaPromedio === 0 && item.costoUnitarioPromedio === 0) {
          await tx.precioCostoMensualItem.deleteMany({
            where: {
              periodoId: periodo.id,
              productoId: item.productoId,
            },
          });
          continue;
        }

        await tx.precioCostoMensualItem.upsert({
          where: {
            periodoId_productoId: {
              periodoId: periodo.id,
              productoId: item.productoId,
            },
          },
          update: {
            precioVentaPromedio: new Prisma.Decimal(item.precioVentaPromedio),
            costoUnitarioPromedio: new Prisma.Decimal(item.costoUnitarioPromedio),
          },
          create: {
            periodoId: periodo.id,
            productoId: item.productoId,
            precioVentaPromedio: new Prisma.Decimal(item.precioVentaPromedio),
            costoUnitarioPromedio: new Prisma.Decimal(item.costoUnitarioPromedio),
          },
        });
      }
    });
  } catch (error) {
    fail(formPath, prismaMessage(error, "No se pudo guardar precios y costos."));
  }

  revalidatePath("/precios-costos");
  revalidatePath("/proyeccion-economica");
  revalidatePath("/reporte");
  redirect("/precios-costos?success=Datos%20guardados%20correctamente");
}

export async function deletePrecioCostoPeriodo(formData: FormData) {
  await requireAuth();

  const id = asInt(formData, "id");
  const returnTo = asString(formData, "returnTo");
  const redirectTo = returnTo.startsWith("/precios-costos")
    ? returnTo
    : "/precios-costos";

  try {
    await prisma.precioCostoMensualPeriodo.delete({ where: { id } });
  } catch (error) {
    fail(redirectTo, prismaMessage(error, "No se pudo eliminar el período."));
  }

  revalidatePath("/precios-costos");
  revalidatePath("/proyeccion-economica");
  revalidatePath("/reporte");
  redirect(redirectTo);
}

export async function updateForecastConfig(formData: FormData) {
  await requireAuth();

  const movingAverageN = asInt(formData, "movingAverageN");
  const forecastHorizonMonths = asInt(formData, "forecastHorizonMonths");
  const polynomialDegree = asInt(formData, "polynomialDegree");
  const maxMonthlyGrowthRate = Number(formData.get("maxMonthlyGrowthRate"));
  const holtWintersSeasonLength = asInt(formData, "holtWintersSeasonLength");
  const holtWintersMinRequiredMonths = asInt(formData, "holtWintersMinRequiredMonths");

  const holtWintersTrendType = asString(formData, "holtWintersTrendType");
  const holtWintersSeasonalType = asString(formData, "holtWintersSeasonalType");
  const economicProjectionMethod = asString(formData, "economicProjectionMethod");
  const monthlyPriceGrowthRate = asDecimalNumber(formData, "monthlyPriceGrowthRate");
  const monthlyCostGrowthRate = asDecimalNumber(formData, "monthlyCostGrowthRate");

  if (
    movingAverageN < 1 ||
    forecastHorizonMonths < MIN_FORECAST_HORIZON_MONTHS ||
    forecastHorizonMonths > MAX_FORECAST_HORIZON_MONTHS ||
    ![2, 3].includes(polynomialDegree) ||
    !Number.isFinite(maxMonthlyGrowthRate) ||
    maxMonthlyGrowthRate < 0 ||
    holtWintersSeasonLength < 2 ||
    holtWintersMinRequiredMonths < holtWintersSeasonLength ||
    !["additive", "multiplicative"].includes(holtWintersTrendType) ||
    !["additive", "multiplicative"].includes(holtWintersSeasonalType) ||
    !economicProjectionMethods.includes(
      economicProjectionMethod as (typeof economicProjectionMethods)[number],
    ) ||
    !Number.isFinite(monthlyPriceGrowthRate) ||
    !Number.isFinite(monthlyCostGrowthRate)
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
      holtWintersTrendType,
      holtWintersSeasonalType,
      holtWintersMinRequiredMonths,
      economicProjectionMethod,
      monthlyPriceGrowthRate: new Prisma.Decimal(monthlyPriceGrowthRate),
      monthlyCostGrowthRate: new Prisma.Decimal(monthlyCostGrowthRate),
    },
    create: {
      id: 1,
      movingAverageN,
      forecastHorizonMonths,
      polynomialDegree,
      maxMonthlyGrowthRate,
      holtWintersSeasonLength,
      holtWintersTrendType,
      holtWintersSeasonalType,
      holtWintersMinRequiredMonths,
      economicProjectionMethod,
      monthlyPriceGrowthRate: new Prisma.Decimal(monthlyPriceGrowthRate),
      monthlyCostGrowthRate: new Prisma.Decimal(monthlyCostGrowthRate),
    },
  });

  revalidatePath("/configuracion");
  revalidatePath("/reporte");
  revalidatePath("/matriz-forecast");
  revalidatePath("/proyeccion-economica");
  redirect("/configuracion");
}

export async function updatePreferredForecastModel(formData: FormData) {
  await requireAuth();

  const productoId = asInt(formData, "productoId");
  const rawModel = asString(formData, "model");
  const model =
    rawModel === "automatic" || rawModel === ""
      ? null
      : (rawModel as ForecastModelKey);

  if (!productoId) {
    return { ok: false, message: "Producto inválido." };
  }

  if (model !== null && !forecastModelKeys.includes(model)) {
    return { ok: false, message: "Modelo inválido." };
  }

  const product = await prisma.producto.findUnique({
    where: { id: productoId },
    select: { id: true },
  });

  if (!product) {
    return { ok: false, message: "El producto no existe." };
  }

  await prisma.producto.update({
    where: { id: productoId },
    data: { preferredForecastModel: model },
  });

  revalidatePath("/reporte");
  revalidatePath("/matriz-forecast");

  return { ok: true, message: "Modelo guardado correctamente" };
}

export async function loginAction(formData: FormData) {
  const email = asString(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email) fail("/login", "Ingresá tu email.");
  if (!password) fail("/login", "Ingresá tu contraseña.");

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      passwordHash: true,
      active: true,
    },
  });

  if (!user) return fail("/login", "Email o contraseña incorrectos.");
  if (!user.active) return fail("/login", "El usuario está inactivo.");

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) return fail("/login", "Email o contraseña incorrectos.");

  await createSession(user);
  redirect("/");
}

export async function logoutAction() {
  await logout();
  redirect("/login");
}
