-- Regras do banco que o schema.prisma não consegue expressar.
-- Copie este conteúdo para o FINAL do migration.sql da primeira migration (init),
-- antes de aplicá-la. Veja o passo a passo no README.

-- No máximo uma assinatura vigente (ATIVA ou CANCELADA) por Casa.
CREATE UNIQUE INDEX "assinatura_vigente_por_casa"
  ON "assinatura" ("casa_id")
  WHERE "status" IN ('ATIVA', 'CANCELADA');

-- Busca e detecção de produto duplicado sem diferenciar maiúsculas de minúsculas.
CREATE INDEX "produto_casa_nome_lower_idx"
  ON "produto" ("casa_id", lower("nome"));

-- Até 3 fotos por produto, na ordem 1, 2 ou 3.
ALTER TABLE "foto"
  ADD CONSTRAINT "foto_ordem_valida" CHECK ("ordem" BETWEEN 1 AND 3);

CREATE UNIQUE INDEX "foto_produto_ordem_key"
  ON "foto" ("produto_id", "ordem");
