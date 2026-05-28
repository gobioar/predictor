CREATE TABLE "PrecioCostoMensualPeriodo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrecioCostoMensualPeriodo_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PrecioCostoMensualItem" (
    "id" SERIAL NOT NULL,
    "periodoId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "precioVentaPromedio" DECIMAL(14,2) NOT NULL,
    "costoUnitarioPromedio" DECIMAL(14,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrecioCostoMensualItem_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "ForecastConfig"
ADD COLUMN "economicProjectionMethod" TEXT NOT NULL DEFAULT 'lastKnown',
ADD COLUMN "monthlyPriceGrowthRate" DECIMAL(8,4) NOT NULL DEFAULT 0,
ADD COLUMN "monthlyCostGrowthRate" DECIMAL(8,4) NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX "PrecioCostoMensualPeriodo_anio_mes_key" ON "PrecioCostoMensualPeriodo"("anio", "mes");
CREATE INDEX "PrecioCostoMensualPeriodo_anio_mes_idx" ON "PrecioCostoMensualPeriodo"("anio", "mes");
CREATE UNIQUE INDEX "PrecioCostoMensualItem_periodoId_productoId_key" ON "PrecioCostoMensualItem"("periodoId", "productoId");
CREATE INDEX "PrecioCostoMensualItem_productoId_idx" ON "PrecioCostoMensualItem"("productoId");

ALTER TABLE "PrecioCostoMensualItem" ADD CONSTRAINT "PrecioCostoMensualItem_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "PrecioCostoMensualPeriodo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PrecioCostoMensualItem" ADD CONSTRAINT "PrecioCostoMensualItem_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
