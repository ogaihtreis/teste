/**
 * East Blue Saga - Interactive Engine
 */

document.addEventListener("DOMContentLoaded", () => {
	// --- ISLAND TRACKER NAVIGATION ---
	const trackerNodes = document.querySelectorAll(".tracker-node");
	trackerNodes.forEach(node => {
		node.addEventListener("click", () => {
			trackerNodes.forEach(n => n.classList.remove("active"));
			node.classList.add("active");
			const targetIsland = node.dataset.island;
			const card = document.getElementById(targetIsland);
			if (card) {
				card.scrollIntoView({ behavior: "smooth", block: "center" });
				card.style.transform = "scale(1.02)";
				setTimeout(() => { card.style.transform = ""; }, 500);
			}
		});
	});

	// --- CHARACTER FILTER SYSTEM ---
	const filterButtons = document.querySelectorAll(".char-btn-filter");
	const characterCards = document.querySelectorAll(".character-card");

	filterButtons.forEach(btn => {
		btn.addEventListener("click", () => {
			filterButtons.forEach(b => b.classList.remove("is-active"));
			btn.classList.add("is-active");

			const filterValue = btn.dataset.filter;

			characterCards.forEach(card => {
				const category = card.dataset.category;
				if (filterValue === "all" || category === filterValue) {
					card.style.display = "flex";
					card.style.animation = "fadeIn 0.3s ease";
				} else {
					card.style.display = "none";
				}
			});
		});
	});

	// --- CHARACTER DETAILS MODAL ---
	const modalOverlay = document.querySelector("#character-modal");
	const modalCloseBtn = document.querySelector("#modal-close-btn");
	const modalPhoto = document.querySelector("#modal-photo");
	const modalName = document.querySelector("#modal-name");
	const modalEpithet = document.querySelector("#modal-epithet");
	const modalBounty = document.querySelector("#modal-bounty");
	const modalBio = document.querySelector("#modal-bio");
	const modalArc = document.querySelector("#modal-arc");
	const modalRole = document.querySelector("#modal-role");
	const modalAbility = document.querySelector("#modal-ability");

	const charactersData = {
		luffy: {
			name: "Monkey D. Luffy",
			epithet: "Luffy do Chapéu de Palha",
			bounty: "฿ 30.000.000",
			role: "Capitão dos Chapéus de Palha",
			arc: "Vila Foosha até Loguetown",
			ability: "Gomu Gomu no Mi (Homem-Borracha)",
			photo: "images/luffy.jpg",
			bio: "Nascido na Vila Foosha, comeu acidentalmente a Gomu Gomu no Mi e recebeu o Chapéu de Palha de Shanks com a promessa de se tornar um grande pirata. No East Blue, reuniu seus quatro primeiros companheiros (Zoro, Nami, Usopp e Sanji), derrotou os tiranos Morgan, Buggy, Kuro, Don Krieg e Arlong, conquistando a mais alta recompensa inicial da história do East Blue: 30 milhões de berries."
		},
		zoro: {
			name: "Roronoa Zoro",
			epithet: "O Caçador de Piratas",
			bounty: "Espadachim Temido",
			role: "Combatente / Imediato",
			arc: "Entrou em Shells Town",
			ability: "Estilo Três Espadas (Santoryu)",
			photo: "images/zoro.jpg",
			bio: "Um temido caçador de piratas aprisionado injustamente pela Marinha em Shells Town. Foi libertado por Luffy sob a condição de se juntar ao seu bando. Seu sonho absoluto é se tornar o maior espadachim do mundo em homenagem à sua amiga de infância Kuina. No Baratie, enfrentou o lendário Dracule Mihawk e jurou a Luffy, em prantos, que nunca mais seria derrotado até cumprir seu sonho."
		},
		nami: {
			name: "Nami",
			epithet: "A Gata Ladra",
			bounty: "Mapeadora Genial",
			role: "Navegadora",
			arc: "Encontro em Orange Town, Oficial em Cocoyasi",
			ability: "Cartografia & Controle Climático",
			photo: "images/nami.jpg",
			bio: "Uma navegadora e ladra extraordinária com instinto natural para ler os ventos e correntes marítimas. Vivia como refém dos Piratas Arlong, acumulando em segredo 100 milhões de berries para recomprar a Vila Cocoyasi e vingar sua mãe adotiva Bellemere. Quando Arlong a traiu, Nami implorou em prantos a ajuda de Luffy, que destruiu o castelo de Arlong e a libertou para realizar o sonho de mapear o mundo inteiro."
		},
		usopp: {
			name: "Usopp",
			epithet: "O Bravo Guerreiro dos Mares",
			bounty: "Atirador de Elite",
			role: "Atirador / Inventor",
			arc: "Entrou na Vila Syrup",
			ability: "Pontaria Certeira & Kuro Kabuto",
			photo: "images/usopp.jpg",
			bio: "Filho do pirata Yasopp, Usopp corria diariamente pela Vila Syrup gritando 'os piratas estão chegando!' para manter viva a esperança e alegrar sua amiga doente Kaya. Ao lado de Luffy, defendeu a vila da invasão do Capitão Kuro. Em recompensa pela bravura, a tripulação ganhou o navio Going Merry, e Usopp juntou-se ao bando em busca de se tornar um bravo guerreiro dos mares."
		},
		sanji: {
			name: "Sanji",
			epithet: "Perna Negra",
			bounty: "Chef de Primeira Classe",
			role: "Cozinheiro",
			arc: "Entrou no Baratie",
			ability: "Estilo da Perna Negra (Black Leg)",
			photo: "images/sanji.jpg",
			bio: "Sous-chef do restaurante flutuante Baratie, treinado pelo lendário pirata Zeff da Perna Vermelha, com quem quase morreu de fome em uma ilha deserta. Sanji segue uma regra sagrada: jamais recusar um prato de comida a quem tem fome e nunca lutar com as mãos, que são reservadas exclusivamente para cozinhar. Juntou-se a Luffy para navegar rumo ao misterioso oceano All Blue."
		},
		shanks: {
			name: "Shanks",
			epithet: "O Ruivo (Akagami)",
			bounty: "Imperador do Novo Mundo",
			role: "Capitão dos Piratas do Ruivo",
			arc: "Vila Foosha",
			ability: "Haki do Conquistador Supremo",
			photo: "images/shanks.jpg",
			bio: "O homem que inspirou Luffy a se lançar ao mar. Passou um ano ancorado na Vila Foosha do East Blue. Sacrificou seu braço esquerdo para salvar a vida de Luffy de um monstro marinho e lhe confiou seu bem mais precioso: o Chapéu de Palha. Shanks é a representação viva da verdadeira liberdade e espírito pirata."
		},
		buggy: {
			name: "Buggy",
			epithet: "O Palhaço Estrela",
			bounty: "฿ 15.000.000",
			role: "Capitão dos Piratas do Buggy",
			arc: "Orange Town & Loguetown",
			ability: "Bara Bara no Mi (Separar o Corpo)",
			photo: "images/buggy.jpg",
			bio: "Antigo aprendiz no navio de Gol D. Roger ao lado de Shanks, Buggy aterrorizou Orange Town com seus canhões e suas peças corporais flutuantes. Odeia profundamente quem faz piada com seu grande nariz vermelho. Em Loguetown, uniu forças com Alvida e quase decapitou Luffy no cadafalso de execução antes de ser atingido por um raio misterioso."
		},
		arlong: {
			name: "Arlong",
			epithet: "Dente de Serra",
			bounty: "฿ 20.000.000",
			role: "Capitão dos Piratas do Arlong",
			arc: "Ilhas Conomi (Arlong Park)",
			ability: "Força de Homem-Peixe Tubarão",
			photo: "images/arlong.jpg",
			bio: "Um cruel homem-peixe tubarão-serra com ódio profundo pela humanidade. Governava as Ilhas Conomi com punho de ferro, cobrando tributo de vida de cada cidadão e escravizando Nami por oito anos como desenhista de mapas. Foi derrotado no clímax do arco quando Luffy demoliu todo o Arlong Park com o ataque Gomu Gomu no Axe."
		},
		mihawk: {
			name: "Dracule Mihawk",
			epithet: "Olhos de Gavião",
			bounty: "Maior Espadachim do Mundo",
			role: "Shichibukai / Espadachim Solitário",
			arc: "Restaurante Baratie",
			ability: "Espada Negra Lendária (Kokuto Yoru)",
			photo: "images/mihawk.jpg",
			bio: "O atual detentor do título de maior espadachim do mundo. Navegou pelo East Blue em seu pequeno barco com velas em cruz apenas para passar o tempo destruindo a frota armada de Don Krieg. Reconheceu o espírito inabalável de Zoro ao feri-lo mortalmente com a Yoru, poupando sua vida e desafiando-o a superá-lo no futuro."
		},
		smoker: {
			name: "Capitão Smoker",
			epithet: "O Caçador Branco",
			bounty: "Oficial da Marinha (QG)",
			role: "Comandante de Loguetown",
			arc: "Loguetown",
			ability: "Moku Moku no Mi (Homem-Fumaça)",
			photo: "images/smoker.jpg",
			bio: "O implacável capitão da Marinha encarregado de Loguetown, a cidade de onde nenhum pirata jamais havia conseguido escapar com vida. Como usuário da Akuma no Mi do tipo Logia de fumaça, era invulnerável aos socos de Luffy. Quase capturou os Chapéus de Palha na praça de execução, sendo impedido pela súbita intervenção de Monkey D. Dragon."
		}
	};

	function openModal(charKey) {
		const data = charactersData[charKey];
		if (!data) return;

		modalPhoto.src = data.photo;
		modalPhoto.alt = data.name;
		modalName.textContent = data.name;
		modalEpithet.textContent = data.epithet;
		modalBounty.textContent = data.bounty;
		modalBio.textContent = data.bio;
		modalArc.textContent = data.arc;
		modalRole.textContent = data.role;
		modalAbility.textContent = data.ability;

		modalOverlay.classList.add("is-open");
		document.body.style.overflow = "hidden";
	}

	function closeModal() {
		modalOverlay.classList.remove("is-open");
		document.body.style.overflow = "";
	}

	characterCards.forEach(card => {
		card.addEventListener("click", () => {
			const charKey = card.dataset.character;
			openModal(charKey);
		});
	});

	if (modalCloseBtn) {
		modalCloseBtn.addEventListener("click", closeModal);
	}

	if (modalOverlay) {
		modalOverlay.addEventListener("click", (e) => {
			if (e.target === modalOverlay) closeModal();
		});
	}

	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && modalOverlay?.classList.contains("is-open")) {
			closeModal();
		}
	});
});

