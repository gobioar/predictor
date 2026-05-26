-- CreateTable
CREATE TABLE "FamiliaProducto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TipoProductoVenta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sku" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "familiaId" INTEGER NOT NULL,
    "tipoProductoVentaId" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Producto_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES "FamiliaProducto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Producto_tipoProductoVentaId_fkey" FOREIGN KEY ("tipoProductoVentaId") REFERENCES "TipoProductoVenta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VentaMensual" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productoId" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "unidadesVendidas" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VentaMensual_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ForecastConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY,
    "movingAverageN" INTEGER NOT NULL DEFAULT 3,
    "forecastHorizonMonths" INTEGER NOT NULL DEFAULT 12,
    "polynomialDegree" INTEGER NOT NULL DEFAULT 2,
    "maxMonthlyGrowthRate" REAL NOT NULL DEFAULT 35,
    "holtWintersSeasonLength" INTEGER NOT NULL DEFAULT 12,
    "holtWintersTrendType" TEXT NOT NULL DEFAULT 'additive',
    "holtWintersSeasonalType" TEXT NOT NULL DEFAULT 'multiplicative',
    "holtWintersMinRequiredMonths" INTEGER NOT NULL DEFAULT 24,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "FamiliaProducto_nombre_key" ON "FamiliaProducto"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "TipoProductoVenta_nombre_key" ON "TipoProductoVenta"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_sku_key" ON "Producto"("sku");

-- CreateIndex
CREATE INDEX "VentaMensual_productoId_anio_mes_idx" ON "VentaMensual"("productoId", "anio", "mes");

-- CreateIndex
CREATE UNIQUE INDEX "VentaMensual_productoId_anio_mes_key" ON "VentaMensual"("productoId", "anio", "mes");
