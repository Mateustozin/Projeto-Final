// ===== Constantes =====
const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=24";
const POST_URL = "https://jsonplaceholder.typicode.com/posts";
const CHAVE_FAVORITOS = "favoritos";
const CHAVE_TEMA = "modoEscuro";

// ===== Armazenamento (localStorage) =====
// Lê a lista de favoritos salva; devolve [] se não houver nada
function lerFavoritos() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_FAVORITOS)) || [];
  } catch (erro) {
    return [];
  }
}

function salvarFavoritos(lista) {
  localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(lista));
}

// ===== Modo escuro (todas as páginas) =====
function iniciarTema() {
  const botaoTema = document.querySelector("#botaoTema");
  if (localStorage.getItem(CHAVE_TEMA) === "sim") {
    document.body.classList.add("escuro");
  }
  botaoTema.addEventListener("click", function () {
    const ficouEscuro = document.body.classList.toggle("escuro");
    localStorage.setItem(CHAVE_TEMA, ficouEscuro ? "sim" : "nao");
  });
}

// ===== Página Explorar =====
let listaDePokemons = [];

// Busca a lista na API e depois os detalhes de cada Pokémon
async function carregarPokemons() {
  const status = document.querySelector("#status");
  status.textContent = "Carregando...";
  try {
    const resposta = await fetch(API_URL);
    if (!resposta.ok) {
      throw new Error("Erro " + resposta.status);
    }
    const dados = await resposta.json();
    const detalhes = await Promise.all(
      dados.results.map(async (item) => {
        const r = await fetch(item.url);
        if (!r.ok) {
          throw new Error("Erro " + r.status);
        }
        return r.json();
      })
    );
    // Guarda só o que usamos: peso em kg e altura em m
    listaDePokemons = detalhes.map((p) => ({
      id: p.id,
      nome: p.name,
      imagem: p.sprites.other["official-artwork"].front_default,
      tipos: p.types.map((t) => t.type.name),
      peso: p.weight / 10,
      altura: p.height / 10
    }));
    status.textContent = "";
    aplicarFiltros();
  } catch (erro) {
    status.textContent = "Não foi possível carregar os Pokémon. Tente novamente mais tarde.";
  }
}

// Cria um cartão usando createElement (sem innerHTML)
function criarCartao(pokemon) {
  const cartao = document.createElement("article");
  cartao.classList.add("cartao");
  // a classe do primeiro tipo muda a cor da borda de cima
  cartao.classList.add("tipo-" + pokemon.tipos[0]);

  const imagem = document.createElement("img");
  imagem.src = pokemon.imagem;
  imagem.alt = "Ilustração de " + pokemon.nome;

  const titulo = document.createElement("h3");
  titulo.textContent = "#" + pokemon.id + " " + pokemon.nome;

  const info = document.createElement("p");
  info.textContent = "Tipo: " + pokemon.tipos.join(", ") + " | " + pokemon.peso + " kg | " + pokemon.altura + " m";

  const botao = document.createElement("button");
  botao.classList.add("botao");
  botao.type = "button";

  // Marca como favorito se já estiver salvo
  const jaFavorito = lerFavoritos().find((f) => f.id === pokemon.id);
  if (jaFavorito) {
    cartao.classList.add("favorito");
  }
  botao.textContent = jaFavorito ? "Remover favorito" : "Favoritar";

  botao.addEventListener("click", function () {
    alternarFavorito(pokemon);
    const agoraFavorito = cartao.classList.toggle("favorito");
    botao.textContent = agoraFavorito ? "Remover favorito" : "Favoritar";
  });

  cartao.append(imagem, titulo, info, botao);
  return cartao;
}

// Adiciona (push) ou remove (filter) o Pokémon dos favoritos
function alternarFavorito(pokemon) {
  let favoritos = lerFavoritos();
  if (favoritos.some((f) => f.id === pokemon.id)) {
    favoritos = favoritos.filter((f) => f.id !== pokemon.id);
  } else {
    favoritos.push(pokemon);
  }
  salvarFavoritos(favoritos);
}

function mostrarCartoes(lista) {
  const area = document.querySelector("#listaCartoes");
  area.replaceChildren();
  if (lista.length === 0) {
    document.querySelector("#status").textContent = "Nenhum Pokémon encontrado.";
    return;
  }
  document.querySelector("#status").textContent = "";
  lista.forEach((pokemon) => area.appendChild(criarCartao(pokemon)));
}

// Junta busca por nome e filtro por tipo
function aplicarFiltros() {
  const texto = document.querySelector("#busca").value.toLowerCase();
  const tipo = document.querySelector("#filtroTipo").value;
  const filtrados = listaDePokemons.filter((p) => {
    const nomeBate = p.nome.includes(texto);
    const tipoBate = tipo === "todos" || p.tipos.includes(tipo);
    return nomeBate && tipoBate;
  });
  mostrarCartoes(filtrados);
}

function iniciarExplorar() {
  document.querySelector("#busca").addEventListener("input", aplicarFiltros);
  document.querySelector("#filtroTipo").addEventListener("change", aplicarFiltros);
  carregarPokemons();
}

// ===== Página Ferramentas (TDE 01) =====
const somar = (a, b) => a + b;
const multiplicar = (a, b) => a * b;

function subtrair(a, b) {
  return a - b;
}

// Divisão por zero devolve mensagem em vez de Infinity
function dividir(a, b) {
  if (b === 0) {
    return "Não é possível dividir por zero.";
  }
  return a / b;
}

// Callback: recebe a operação como parâmetro
function calcular(a, b, operacao) {
  return operacao(a, b);
}

// Média de um campo (peso ou altura) dos itens da lista
function calcularMedia(lista, campo) {
  if (lista.length === 0) {
    return 0;
  }
  const soma = lista.reduce((total, item) => total + item[campo], 0);
  return soma / lista.length;
}

// Filtra os Pokémon com peso maior ou igual ao mínimo
function filtrarPorPeso(lista, minimo) {
  return lista.filter((item) => item.peso >= minimo);
}

function iniciarFerramentas() {
  const operacoes = { somar, subtrair, multiplicar, dividir };

  document.querySelector("#botaoCalcular").addEventListener("click", function () {
    const a = Number(document.querySelector("#numeroA").value);
    const b = Number(document.querySelector("#numeroB").value);
    const nomeOperacao = document.querySelector("#operacao").value;
    document.querySelector("#resultadoCalculo").textContent =
      "Resultado: " + calcular(a, b, operacoes[nomeOperacao]);
  });

  document.querySelector("#botaoMedias").addEventListener("click", function () {
    const favoritos = lerFavoritos();
    const saida = document.querySelector("#resultadoMedias");
    if (favoritos.length === 0) {
      saida.textContent = "Você ainda não tem favoritos. Vá em Explorar.";
      return;
    }
    const mediaPeso = calcularMedia(favoritos, "peso").toFixed(1);
    const mediaAltura = calcularMedia(favoritos, "altura").toFixed(2);
    saida.textContent = "Média de peso: " + mediaPeso + " kg | Média de altura: " + mediaAltura + " m";
  });

  document.querySelector("#botaoFiltrar").addEventListener("click", function () {
    const minimo = Number(document.querySelector("#pesoMinimo").value);
    const lista = document.querySelector("#listaFiltrada");
    lista.replaceChildren();
    filtrarPorPeso(lerFavoritos(), minimo).forEach((p) => {
      const item = document.createElement("li");
      item.textContent = p.nome + " (" + p.peso + " kg)";
      lista.appendChild(item);
    });
  });
}

// ===== Página Contato (POST) =====
function iniciarContato() {
  const formulario = document.querySelector("#formContato");
  const resposta = document.querySelector("#respostaEnvio");
  const campos = formulario.querySelectorAll("input, textarea");

  // Marca o campo com erro quando sai dele vazio (evento blur)
  campos.forEach((campo) => {
    campo.addEventListener("blur", function () {
      campo.classList.toggle("erro", campo.required && !campo.checkValidity());
    });
  });

  formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    if (!formulario.checkValidity()) {
      campos.forEach((campo) => campo.classList.toggle("erro", !campo.checkValidity()));
      resposta.textContent = "Preencha os campos obrigatórios corretamente.";
      return;
    }
    const dados = {
      nome: formulario.nome.value,
      email: formulario.email.value,
      telefone: formulario.telefone.value,
      idade: Number(formulario.idade.value),
      mensagem: formulario.mensagem.value
    };
    resposta.textContent = "Enviando...";
    try {
      const retorno = await fetch(POST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });
      if (!retorno.ok) {
        throw new Error("Erro " + retorno.status);
      }
      resposta.textContent = "Mensagem enviada com sucesso! Status: " + retorno.status;
      formulario.reset();
    } catch (erro) {
      resposta.textContent = "Falha ao enviar. Tente novamente.";
    }
  });
}

// ===== Início: roda a parte certa de cada página =====
document.addEventListener("DOMContentLoaded", function () {
  iniciarTema();
  if (document.querySelector("#listaCartoes")) {
    iniciarExplorar();
  }
  if (document.querySelector("#botaoCalcular")) {
    iniciarFerramentas();
  }
  if (document.querySelector("#formContato")) {
    iniciarContato();
  }
});
