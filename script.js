/**
 * Roleta de Personagens do East Blue - One Piece
 * Sorteio com roda animada e pop-up de revelação com foto e história.
 */

const characters = [
	{
		name: "Monkey D. Luffy",
		epithet: "Luffy do Chapéu de Palha",
		bounty: "฿ 30.000.000",
		role: "Capitão dos Chapéus de Palha",
		color: "#f0bd69",
		icon: "☠",
		image: "images/luffy.jpg",
		description: "O jovem destemido que comeu a Gomu Gomu no Mi e recebeu o Chapéu de Palha de Shanks. No East Blue, reuniu seus companheiros e libertou ilhas inteiras de grandes tiranos, conquistando a maior recompensa inicial da história do mar do leste!"
	},
	{
		name: "Roronoa Zoro",
		epithet: "O Caçador de Piratas",
		bounty: "Mestre do Santoryu",
		role: "Espadachim / Combatente",
		color: "#69a68d",
		icon: "⚔",
		image: "images/zoro.jpg",
		description: "Mestre do estilo das três espadas, Zoro jurou à falecida Kuina que se tornaria o maior espadachim do mundo. Foi o primeiro a entrar no bando de Luffy e jurou em lágrimas nunca mais perder até alcançar seu objetivo."
	},
	{
		name: "Nami",
		epithet: "A Gata Ladra",
		bounty: "Mapeadora Genial",
		role: "Navegadora",
		color: "#f29a57",
		icon: "✦",
		image: "images/nami.jpg",
		description: "Especialista excepcional em clima e mapas marítimos. Suportou anos de sofrimento sob o domínio de Arlong para salvar a Vila Cocoyasi. Libertada por Luffy e seus amigos, tornou-se a navegadora oficial rumo ao sonho de desenhar o mapa-múndi."
	},
	{
		name: "Sanji",
		epithet: "Perna Negra",
		bounty: "Chef de Primeira Classe",
		role: "Cozinheiro",
		color: "#e5cf91",
		icon: "♨",
		image: "images/sanji.jpg",
		description: "Sous-chef do restaurante flutuante Baratie, treinado por Zeff da Perna Vermelha. Segue a honra de nunca negar comida a quem tem fome e jamais usar as mãos em combate, sonhando em descobrir o lendário mar All Blue."
	},
	{
		name: "Usopp",
		epithet: "O Bravo Guerreiro",
		bounty: "Atirador de Elite",
		role: "Atirador / Inventor",
		color: "#81b8a3",
		icon: "◎",
		image: "images/usopp.jpg",
		description: "Filho do pirata Yasopp e contador de histórias da Vila Syrup. Protegeu sua aldeia e sua amiga Kaya da invasão do Capitão Kuro, presenteando o bando com o Going Merry e partindo para virar um herói valoroso dos oceanos."
	},
	{
		name: "Shanks",
		epithet: "O Ruivo (Akagami)",
		bounty: "Imperador dos Mares",
		role: "Capitão dos Piratas do Ruivo",
		color: "#d96d56",
		icon: "✶",
		image: "images/shanks.jpg",
		description: "O grande pirata que ancorou na Vila Foosha e acendeu no peito de Luffy a chama da verdadeira liberdade dos mares. Sacrificou seu braço esquerdo para salvar o garoto e confiou-lhe seu sagrado Chapéu de Palha."
	},
	{
		name: "Koby",
		epithet: "O Jovem Sonhador",
		bounty: "Recruta da Marinha",
		role: "Marinheiro Aprendiz",
		color: "#8cc5d0",
		icon: "⚓",
		image: "images/koby.jpg",
		description: "Um grumete tímido e aprisionado no navio de Alvida. Ao presenciar a determinação de Luffy, tomou coragem para perseguir seu sonho secreto: alistar-se na Marinha com a meta de um dia tornar-se um Almirante da Justiça."
	},
	{
		name: "Helmeppo",
		epithet: "O Filho do Tirano",
		bounty: "Aprendiz da Marinha",
		role: "Soldado em Treinamento",
		color: "#7b9fbe",
		icon: "✦",
		image: "images/helmeppo.jpg",
		description: "Filho mimado do corrupto Capitão Morgan em Shells Town. Após a queda de seu pai, foi confrontado com o mundo real e iniciou uma trajetória de disciplina e crescimento na Marinha ao lado de Koby."
	},
	{
		name: "Buggy",
		epithet: "O Palhaço Estrela",
		bounty: "฿ 15.000.000",
		role: "Capitão dos Piratas do Buggy",
		color: "#cf6a72",
		icon: "☠",
		image: "images/buggy.jpg",
		description: "Ex-aprendiz do Rei dos Piratas Gol D. Roger e mestre da Bara Bara no Mi, com poder de dividir e levitar seu corpo. Enfrentou Luffy em Orange Town e quase o decapitou no cadafalso de Loguetown antes de ser atingido por um raio."
	},
	{
		name: "Arlong",
		epithet: "Dente de Serra",
		bounty: "฿ 20.000.000",
		role: "Capitão dos Piratas do Arlong",
		color: "#548a9c",
		icon: "波",
		image: "images/arlong.jpg",
		description: "O implacável homem-peixe tubarão-serra que dominou as Ilhas Conomi por quase uma década impondo tributos cruéis. Foi derrotado no clímax do arco quando Luffy demoliu todo o Arlong Park com seu machado elástico."
	},
	{
		name: "Mihawk",
		epithet: "Olhos de Gavião",
		bounty: "Maior Espadachim do Mundo",
		role: "Shichibukai Lendário",
		color: "#8c83a8",
		icon: "⚔",
		image: "images/mihawk.jpg",
		description: "O soberano espadachim solitário portador da espada negra Yoru. No Baratie, destruiu galeões inteiros por passatempo e reconheceu o espírito indomável de Zoro, desafiando-o a superá-lo no futuro."
	},
	{
		name: "Smoker",
		epithet: "O Caçador Branco",
		bounty: "Capitão do QG da Marinha",
		role: "Comandante de Loguetown",
		color: "#7896a6",
		icon: "⚓",
		image: "images/smoker.jpg",
		description: "O implacável oficial naval encarregado de Loguetown, a cidade de onde nenhum pirata jamais havia conseguido fugir. Com os poderes de fumaça da Moku Moku no Mi, persegue obstinadamente Luffy até a Grand Line."
	}
];

const canvas = document.querySelector("#wheel-canvas");
const context = canvas.getContext("2d");
const wheel = document.querySelector("#wheel-disc");
const spinButton = document.querySelector("#spin-button");
const buttonLabel = document.querySelector("#button-label");
const resultName = document.querySelector("#result-name");
const resultDescription = document.querySelector("#result-description");
const characterList = document.querySelector("#character-list");

// Modal Elements
const roletaModal = document.querySelector("#roleta-modal");
const modalImg = document.querySelector("#roleta-modal-img");
const modalName = document.querySelector("#roleta-modal-name");
const modalEpithet = document.querySelector("#roleta-modal-epithet");
const modalBounty = document.querySelector("#roleta-modal-bounty");
const modalDesc = document.querySelector("#roleta-modal-desc");
const modalCloseBtn = document.querySelector("#roleta-modal-close");
const modalSpinAgainBtn = document.querySelector("#roleta-btn-spin-again");

let currentRotation = 0;
let isSpinning = false;

function drawWheel() {
	const size = canvas.width;
	const center = size / 2;
	const radius = center - 7;
	const segmentAngle = (Math.PI * 2) / characters.length;
	context.clearRect(0, 0, size, size);

	characters.forEach((character, index) => {
		const startAngle = -Math.PI / 2 + index * segmentAngle;
		const endAngle = startAngle + segmentAngle;
		const middleAngle = startAngle + segmentAngle / 2;

		context.beginPath();
		context.moveTo(center, center);
		context.arc(center, center, radius, startAngle, endAngle);
		context.closePath();
		context.fillStyle = character.color;
		context.fill();
		context.strokeStyle = "#e5f5ef";
		context.lineWidth = 3;
		context.stroke();

		context.save();
		context.translate(center, center);
		context.rotate(middleAngle);
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillStyle = "#163b4b";
		context.shadowColor = "#ffffff66";
		context.shadowBlur = 5;
		context.font = "bold 37px 'DM Sans', sans-serif";
		context.fillText(character.icon, radius * 0.69, -13);
		context.shadowBlur = 0;
		context.font = "700 20px 'DM Sans', sans-serif";
		context.fillText(character.name, radius * 0.69, 23, 158);
		context.restore();
	});

	context.beginPath();
	context.arc(center, center, radius - 4, 0, Math.PI * 2);
	context.strokeStyle = "#e5f5ef";
	context.lineWidth = 5;
	context.stroke();
}

function renderCharacterList() {
	characterList.replaceChildren(...characters.map((character) => {
		const item = document.createElement("span");
		item.className = "character-chip";
		const icon = document.createElement("span");
		icon.setAttribute("aria-hidden", "true");
		icon.textContent = character.icon;
		item.append(icon, document.createTextNode(character.name));
		return item;
	}));
}

function openCharacterModal(character) {
	modalImg.src = character.image;
	modalImg.alt = character.name;
	modalName.textContent = character.name;
	modalEpithet.textContent = character.epithet;
	modalBounty.textContent = character.bounty;
	modalDesc.textContent = character.description;

	roletaModal.classList.add("is-open");
}

function closeCharacterModal() {
	roletaModal.classList.remove("is-open");
}

function spin() {
	if (isSpinning) return;

	closeCharacterModal();
	isSpinning = true;
	spinButton.disabled = true;
	spinButton.setAttribute("aria-label", "Sorteando personagem");
	buttonLabel.textContent = "GIRANDO";
	resultName.innerHTML = "O destino<br>está girando…";
	resultDescription.textContent = "As correntes do East Blue estão escolhendo seu personagem.";

	const selectedIndex = Math.floor(Math.random() * characters.length);
	const selectedCharacter = characters[selectedIndex];
	const targetAngle = (360 - (selectedIndex + 0.5) * (360 / characters.length) + 360) % 360;
	const currentAngle = ((currentRotation % 360) + 360) % 360;
	const alignment = (targetAngle - currentAngle + 360) % 360;
	const totalRotation = currentRotation + 5 * 360 + alignment;
	const transitionTime = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 30 : 5300;

	wheel.style.transitionDuration = `${transitionTime}ms`;
	wheel.style.transform = `rotate(${totalRotation}deg)`;
	currentRotation = totalRotation;

	window.setTimeout(() => {
		resultName.textContent = selectedCharacter.name;
		resultDescription.textContent = selectedCharacter.description;
		buttonLabel.textContent = "GIRAR";
		spinButton.setAttribute("aria-label", "Girar novamente");
		spinButton.disabled = false;
		isSpinning = false;

		// A foto e descrição pulam na tela via modal animado!
		openCharacterModal(selectedCharacter);
	}, transitionTime + 150);
}

// Event Listeners
spinButton.addEventListener("click", spin);

if (modalCloseBtn) {
	modalCloseBtn.addEventListener("click", closeCharacterModal);
}

if (modalSpinAgainBtn) {
	modalSpinAgainBtn.addEventListener("click", () => {
		closeCharacterModal();
		setTimeout(spin, 250);
	});
}

if (roletaModal) {
	roletaModal.addEventListener("click", (e) => {
		if (e.target === roletaModal) closeCharacterModal();
	});
}

document.addEventListener("keydown", (e) => {
	if (e.key === "Escape" && roletaModal?.classList.contains("is-open")) {
		closeCharacterModal();
	}
});

// Inicialização
drawWheel();
renderCharacterList();
