# Helpinho

Esse projeto foi desenvolvido para a avaliação da empresa LBCA

## Tecnologias e metodologias utilizadas

**Back-end:** Node, Serverless, DynamoDB

**Engenharia de software:** TDD (Test driven development), SOLID, Clean architecture

**Front-end**: Angular

## Como executar o projeto

**Instalar as dependências:**

```console
cd frontend
npm install

cd backend
npm install
```

**Tutorial para instalar o localstack**

O localstack é o ambiente onde simulamos a aws

[Localstack setup](./docs/localstack.md)

**Iniciar localstack**

(o localstack utiliza o docker. Certifique-se que o seu serviço esteja rodando)

```bash
    localstack start
```

**Criar tabelas no dynamodb**

(tabela de usuário)

```console
awslocal dynamodb create-table  --table-name user  --key-schema AttributeName=id,KeyType=HASH  --attribute-definitions AttributeName=id,AttributeType=S AttributeName=email,AttributeType=S  --billing-mode PAY_PER_REQUEST  --global-secondary-indexes "IndexName=EmailIndex,KeySchema=[{AttributeName=email,KeyType=HASH}],Projection={ProjectionType=ALL}"  --region us-east-1
```

(tabela de helpers)

```console
awslocal dynamodb create-table  --table-name helper  --key-schema AttributeName=id,KeyType=HASH  --attribute-definitions AttributeName=id,AttributeType=S AttributeName=userId,AttributeType=S  --billing-mode PAY_PER_REQUEST  --global-secondary-indexes "IndexName=UserIdIndex,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL}"  --region us-east-1
```

(Certifique-se também de ter colocado todas as credenciais no arquivo .env)

**Rodar as aplicações**

```console
    cd frontend
    npm install

    cd backend
    npm install
```

## Sobre a arquitetura do projeto

**Backend**

No backend eu optei pelo desenvolvimento utilizando a metodologia TDD - que é o desenvolvimento orientado a testes - o qual eu julgo
muito boa para projetos que tem propensão a escalabilidade, manutebilidade e disponibilidade, pelo fato de tenderem a ser aplicações críticas, cujas regras de domínio NÃO podem falhar em ambiente de produção. Como design pattern, eu optei pelo SOLID, o qual nos permite ter um controle e manutebilidade maior sobre uma aplicação totalmente desacoplada. Utilizei princípios de clean code como DRY, utilizando a estratégia de generic layers, pra não precisarmos repetir código, e o KISS, para mantermos a aplicação mais enxuta possível. Para a arquitetura, optei pela clean arquitecture, conhecida também como onion, separando regras de negócio por casos de uso. A aplicação tá bastante enxuta, ainda colocaria mais coisas, mas quis deixá-la o mais simples possível.

**Frontend**

No frontend infelizmente não consegui aplicar tudo o que conheço e pudia, por conta do tempo, como por exp, a questão da responsividade mobile. Utilizei uma arquitetura bem simples, a padrão do angular mesmo. Como contexto utilizei dois (services) para fornecimento de dados globais.

---
