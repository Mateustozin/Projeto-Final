# Projeto-Final
Web Development: Front-End

# Pokédex do Grupo

**Tema:** Pokédex (PokéAPI)

## Integrantes 
- Fernando Moro 
- Kauan Cunha da Silva 
- Mateus Augusto Tozin Ferreira 

## API usada
- Lista: `https://pokeapi.co/api/v2/pokemon?limit=24`
- Detalhes: URL de cada item da lista (ex.: `https://pokeapi.co/api/v2/pokemon/pikachu`)
- POST do formulário: `https://jsonplaceholder.typicode.com/posts`

## TDE 01
| Função | Recebe | Devolve | Onde é usada |
|---|---|---|---|
| `somar(a, b)` (arrow) | dois números | a + b | Calculadora |
| `subtrair(a, b)` | dois números | a − b | Calculadora |
| `multiplicar(a, b)` (arrow) | dois números | a × b | Calculadora |
| `dividir(a, b)` | dois números | a ÷ b, ou mensagem se b for 0 | Calculadora |
| `calcular(a, b, operacao)` | dois números e uma função (callback) | resultado da operação | Botão Calcular |
| `calcularMedia(lista, campo)` | array de Pokémon e o campo (`peso`/`altura`) | média numérica | Botão Calcular médias |
| `filtrarPorPeso(lista, minimo)` | array de Pokémon e peso mínimo | novo array filtrado | Botão Filtrar favoritos |

Funções anônimas: callbacks dos `addEventListener`. Arrow functions: `somar`, `multiplicar`, e as usadas em `map`, `filter` e `reduce`.

## TDE 02 — Debugging em JavaScript

### Introdução

Durante a análise e os testes da Pokédex do Grupo 2, foram simuladas situações de erro para identificar possíveis falhas na execução do JavaScript, na lógica das funcionalidades e na comunicação com APIs externas.

Para investigar os problemas, foram utilizados recursos do Chrome DevTools, como Console, Breakpoints, Scope e Network.

A seguir, estão documentados três cenários de debugging, com seus sintomas, identificação e respectivas correções.

---

### Bug 01 — Calculadora aceita campos vazios como zero

**Categoria:** Erro de lógica.

**Local:** `script.js` — função `iniciarFerramentas()`.

#### Problema encontrado

Durante a simulação de uso da calculadora, identificamos que, ao deixar os campos numéricos vazios e clicar no botão de calcular, o sistema apresentava o resultado zero.

Isso acontecia porque a função `Number()` converte uma string vazia em zero, permitindo que o cálculo fosse realizado mesmo sem o preenchimento dos campos.

#### Como identificamos

Utilizamos um breakpoint na linha responsável pela conversão dos valores e acompanhamos as variáveis pelo Scope do DevTools.

Também utilizamos `console.log()` para verificar os valores recebidos.

#### Código antes da correção

```javascript
const a = Number(document.querySelector("#numeroA").value);
const b = Number(document.querySelector("#numeroB").value);
const nomeOperacao = document.querySelector("#operacao").value;
```

#### Código depois da correção

```javascript
const valorA = document.querySelector("#numeroA").value;
const valorB = document.querySelector("#numeroB").value;
const resultado = document.querySelector("#resultadoCalculo");

if (valorA === "" || valorB === "") {
  resultado.textContent = "Preencha os dois números.";
  return;
}

const a = Number(valorA);
const b = Number(valorB);
const nomeOperacao = document.querySelector("#operacao").value;
```

#### Solução aplicada

Foi adicionada uma validação antes da conversão dos valores. Dessa forma, o sistema verifica se os dois campos foram preenchidos antes de executar a operação matemática.

---

### Bug 02 — Filtro de peso apresenta resultados sem preenchimento

**Categoria:** Erro de lógica.

**Local:** `script.js` — função `iniciarFerramentas()`.

#### Problema encontrado

Durante os testes do filtro de peso, identificamos que, ao deixar o campo de peso mínimo vazio e clicar em filtrar, o sistema apresentava todos os Pokémon favoritos.

O problema acontecia porque o JavaScript convertia o campo vazio em zero. Como todos os Pokémon possuem peso maior ou igual a zero, todos eram exibidos.

#### Como identificamos

Utilizamos `console.log()` para verificar o conteúdo do campo e o valor convertido pelo JavaScript.

#### Código antes da correção

```javascript
const minimo = Number(document.querySelector("#pesoMinimo").value);
const lista = document.querySelector("#listaFiltrada");

lista.replaceChildren();
```

#### Código depois da correção

```javascript
const valorMinimo = document.querySelector("#pesoMinimo").value;
const lista = document.querySelector("#listaFiltrada");

lista.replaceChildren();

if (valorMinimo === "") {
  lista.textContent = "Informe um peso mínimo.";
  return;
}

const minimo = Number(valorMinimo);
```

#### Solução aplicada

Foi implementada uma validação para impedir a execução do filtro quando o campo estiver vazio. Agora o usuário recebe uma mensagem solicitando o preenchimento do peso mínimo.

---

### Bug 03 — Erro na URL de comunicação com a API

**Categoria:** Erro de integração / requisição HTTP.

**Local:** `script.js` — constante `POST_URL`.

#### Problema encontrado

Durante uma simulação de falha na comunicação com a API JSONPlaceholder, foi introduzido temporariamente um endereço incorreto na URL utilizada para enviar os dados do formulário.

Com isso, a requisição POST não conseguia acessar o endereço esperado.

#### Como identificamos

Utilizamos a aba Network do Chrome DevTools para acompanhar a requisição realizada pelo formulário.

Na análise, verificamos:

- Request URL: endereço incorreto.
- Request Method: POST.
- Status Code: 404 Not Found.

A resposta indicava que o endereço solicitado não correspondia ao endpoint esperado.

#### Código antes da correção

```javascript
const POST_URL = "https://jsonplaceholder.typicode.com/post";
```

#### Código depois da correção

```javascript
const POST_URL = "https://jsonplaceholder.typicode.com/posts";
```

#### Solução aplicada

Foi corrigida a URL, adicionando o caminho correto `/posts`. Após a correção, a requisição passou a utilizar o endpoint esperado da API.

---

### Evidências da depuração

#### Evidência 01 — Breakpoint e Scope

Foi utilizado um breakpoint na conversão dos valores da calculadora para acompanhar o conteúdo das variáveis durante a execução.


#### Evidência 02 — Console

Foi utilizado o Console para verificar os valores recebidos pelos campos numéricos e identificar a conversão de campos vazios para zero.


#### Evidência 03 — Network

Foi utilizada a aba Network para identificar a falha simulada na requisição POST, verificando a URL incorreta e o status HTTP 404.



---

### Conclusão

Os testes de debugging permitiram compreender a importância da validação de dados, da análise da lógica de programação e da investigação de requisições HTTP.

A utilização das ferramentas do Chrome DevTools facilitou a identificação dos problemas e a compreensão do comportamento do código durante sua execução.

Com as correções propostas, as funcionalidades ficam mais consistentes e oferecem um tratamento melhor para situações inesperadas durante a utilização da Pokédex.
