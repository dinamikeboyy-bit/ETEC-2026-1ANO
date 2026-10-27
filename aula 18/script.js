let listaPokemons = [];

const inputNome = document.getElementById('nome');
const inputTipo = document.getElementById('tipo');
const inputPC = document.getElementById('pc');
const inputTreinador = document.getElementById('treinador');
const btnCadastrar = document.getElementById('btn-cadastrar');
const btnLimpar = document.getElementById('btn-limpar');
const containerCards = document.getElementById('container-cards');


const containerAviso = document.createElement('div');
containerAviso.style.marginTop = '15px';
containerAviso.style.textAlign = 'center';
containerAviso.style.fontWeight = 'bold';
containerAviso.style.color = '#ff4d4d';
btnLimpar.parentNode.insertBefore(containerAviso, btnLimpar.nextSibling);

const estilosCard = {
  fogo: 'tipo-fogo',
  agua: 'tipo-agua',
  eletrico: 'tipo-eletrico',
  grama: 'tipo-grama',
  planta: 'tipo-grama',
  poison: 'tipo-poison',
  normal: 'tipo-normal'
};

function obterClasseTipo(tipo) {
  const tipoFormatado = tipo.trim().toLowerCase();

  for (const chave in estilosCard) {
    if (tipoFormatado.includes(chave)) {
      return estilosCard[chave];
    }
  }

  return '';
}

async function obterDadosPokemon(nome) {
  try {
    const nomeFormatado = nome.trim().toLowerCase();
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomeFormatado}`);
    
    if (!resposta.ok) return null; 
    
    const dados = await resposta.json();
    return {
      foto: dados.sprites.other['official-artwork'].front_default || dados.sprites.front_default,
      valido: true
    };
  } catch (error) {
    return { valido: false };
  }
}

async function renderizarCards() {
  containerCards.innerHTML = "";
  containerAviso.innerHTML = ""; // Limpa o aviso anterior

  if (listaPokemons.length === 0) return;

  listaPokemons.sort((a, b) => b.pc - a.pc);

  for (let index = 0; index < listaPokemons.length; index++) {
    const pokemon = listaPokemons[index];
    const resultadoPokemon = await obterDadosPokemon(pokemon.nome);

    // Se o Pokémon NÃO for encontrado, exibe o aviso abaixo do botão e PULA a criação do card
    if (!resultadoPokemon || !resultadoPokemon.valido) {
      containerAviso.innerHTML = `POKEMON NAO ENCONTRADO: ${pokemon.nome}`;
      continue; 
    }

    const fotoUrl = resultadoPokemon.foto;
    const classeTipo = obterClasseTipo(pokemon.tipo);
    const ehCampeao = index === 0;

    if (ehCampeao) {
      const cardHtml = `
        <div class="card-pokemon card-campeao ${classeTipo}">
          <img src="${fotoUrl}" alt="${pokemon.nome}">
          <div class="card-details">
            <h3>${pokemon.nome}</h3>
            <p><strong>Tipo:</strong> ${pokemon.tipo}</p>
            <p class="pc-destaque"><strong>PC:</strong> ${pokemon.pc}</p>
            <p><strong>Treinador:</strong> ${pokemon.treinador}</p>
          </div>
        </div>
      `;
      containerCards.innerHTML += cardHtml;
    } else {
      const cardHtml = `
        <div class="card-pokemon ${classeTipo}">
          <img src="${fotoUrl}" alt="${pokemon.nome}">
          <div class="card-details">
            <h3>${pokemon.nome}</h3>
            <p><strong>Tipo:</strong> ${pokemon.tipo}</p>
            <p><strong>PC:</strong> ${pokemon.pc}</p>
            <p><strong>Treinador:</strong> ${pokemon.treinador}</p>
          </div>
        </div>
      `;
      containerCards.innerHTML += cardHtml;
    }
  }
}

btnCadastrar.addEventListener('click', (event) => {
  event.preventDefault();

  if (!inputNome.value || !inputTipo.value || !inputPC.value) {
    alert("Preencha Nome, Tipo e PC!");
    return;
  }

  const treinadorInformado = inputTreinador.value.trim();
  const nomeTreinador = treinadorInformado !== "" ? treinadorInformado : "Sem treinador";

  const novoPokemon = {
    nome: inputNome.value,
    tipo: inputTipo.value,
    pc: Number(inputPC.value),
    treinador: nomeTreinador
  };

  listaPokemons.push(novoPokemon);
  renderizarCards();
  limparCamposFormulario();
});

function limparCamposFormulario() {
  inputNome.value = "";
  inputTipo.value = "";
  inputPC.value = "";
  inputTreinador.value = "";
}

function limparFormularioCompleto() {
  limparCamposFormulario();
  listaPokemons = [];
  containerCards.innerHTML = "";
  containerAviso.innerHTML = "";
}

btnLimpar.addEventListener('click', (event) => {
  event.preventDefault();
  limparFormularioCompleto();
});

document.addEventListener('DOMContentLoaded', renderizarCards);