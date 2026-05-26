-- CreateTable
CREATE TABLE "FamiliaProducto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamiliaProducto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoProductoVenta" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipoProductoVenta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "sku" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "familiaId" INTEGER NOT NULL,
    "tipoProductoVentaId" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VentaMensualPeriodo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VentaMensualPeriodo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VentaMensualItem" (
    "id" SERIAL NOT NULL,
    "periodoId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "unidadesVendidas" INTEGER NOT NULL,

    CONSTRAINT "VentaMensualItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForecastConfig" (
    "id" INTEGER NOT NULL,
    "movingAverageN" INTEGER NOT NULL DEFAULT 3,
    "forecastHorizonMonths" INTEGER NOT NULL DEFAULT 12,
    "polynomialDegree" INTEGER NOT NULL DEFAULT 2,
    "maxMonthlyGrowthRate" DOUBLE PRECISION NOT NULL DEFAULT 35,
    "holtWintersSeasonLength" INTEGER NOT NULL DEFAULT 12,
    "holtWintersTrendType" TEXT NOT NULL DEFAULT 'additive',
    "holtWintersSeasonalType" TEXT NOT NULL DEFAULT 'additive',
    "holtWintersMinRequiredMonths" INTEGER NOT NULL DEFAULT 24,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForecastConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FamiliaProducto_nombre_key" ON "FamiliaProducto"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "TipoProductoVenta_nombre_key" ON "TipoProductoVenta"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_sku_key" ON "Producto"("sku");

-- CreateIndex
CREATE INDEX "VentaMensualPeriodo_anio_mes_idx" ON "VentaMensualPeriodo"("anio", "mes");

-- CreateIndex
CREATE UNIQUE INDEX "VentaMensualPeriodo_anio_mes_key" ON "VentaMensualPeriodo"("anio", "mes");

-- CreateIndex
CREATE INDEX "VentaMensualItem_productoId_idx" ON "VentaMensualItem"("productoId");

-- CreateIndex
CREATE UNIQUE INDEX "VentaMensualItem_periodoId_productoId_key" ON "VentaMensualItem"("periodoId", "productoId");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES "FamiliaProducto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_tipoProductoVentaId_fkey" FOREIGN KEY ("tipoProductoVentaId") REFERENCES "TipoProductoVenta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VentaMensualItem" ADD CONSTRAINT "VentaMensualItem_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "VentaMensualPeriodo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VentaMensualItem" ADD CONSTRAINT "VentaMensualItem_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
