# Entrevista Fullstack

## Banco de Dados (PostgreSQL)

```bash
docker run --name entrevista-postgres \
  -e POSTGRES_PASSWORD=12345 \
  -e POSTGRES_DB=entrevista \
  -p 5432:5432 \
  -d postgres
```

---

## Backend

```bash
cd entrevista-backend
npm install
npm start
```

Rodando em: http://localhost:8000

---

## Frontend

```bash
cd entrevista-teste
npm install
npm run build
npm start
```

Rodando em: http://localhost:3000

---

## Ordem de execução

1.  Banco (Docker)\
2.  Backend\
3.  Frontend

---

## Observação

Se o container já existir:

```bash
docker start entrevista-postgres
```
