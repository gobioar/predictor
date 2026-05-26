-- CreateTable
CREATE TABLE "VentaMensualPeriodo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VentaMensualItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "periodoId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "unidadesVendidas" INTEGER NOT NULL,
    CONSTRAINT "VentaMensualItem_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "VentaMensualPeriodo" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VentaMensualItem_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Migrate old row-based sales into month periods.
INSERT INTO "VentaMensualPeriodo" ("nombre", "mes", "anio", "createdAt", "updatedAt")
SELECT
    CASE "mes"
        WHEN 1 THEN 'Enero'
        WHEN 2 THEN 'Febrero'
        WHEN 3 THEN 'Marzo'
        WHEN 4 THEN 'Abril'
        WHEN 5 THEN 'Mayo'
        WHEN 6 THEN 'Junio'
        WHEN 7 THEN 'Julio'
        WHEN 8 THEN 'Agosto'
        WHEN 9 THEN 'Septiembre'
        WHEN 10 THEN 'Octubre'
        WHEN 11 THEN 'Noviembre'
        WHEN 12 THEN 'Diciembre'
        ELSE 'Mes'
    END || ' ' || "anio",
    "mes",
    "anio",
    MIN("createdAt"),
    CURRENT_TIMESTAMP
FROM "VentaMensual"
GROUP BY "anio", "mes";

INSERT INTO "VentaMensualItem" ("periodoId", "productoId", "unidadesVendidas")
SELECT
    periodo."id",
    venta."productoId",
    venta."unidadesVendidas"
FROM "VentaMensual" venta
INNER JOIN "VentaMensualPeriodo" periodo
    ON periodo."anio" = venta."anio" AND periodo."mes" = venta."mes";

-- CreateIndex
CREATE UNIQUE INDEX "VentaMensualPeriodo_anio_mes_key" ON "VentaMensualPeriodo"("anio", "mes");

-- CreateIndex
CREATE INDEX "VentaMensualPeriodo_anio_mes_idx" ON "VentaMensualPeriodo"("anio", "mes");

-- CreateIndex
CREATE UNIQUE INDEX "VentaMensualItem_periodoId_productoId_key" ON "VentaMensualItem"("periodoId", "productoId");

-- CreateIndex
CREATE INDEX "VentaMensualItem_productoId_idx" ON "VentaMensualItem"("productoId");

-- Drop old row-based sales table.
DROP TABLE "VentaMensual";
