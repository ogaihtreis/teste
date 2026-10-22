const characters = [
	{ name: "Monkey D. Luffy", role: "Capitão dos Chapéus de Palha", color: "#b8423d", icon: "☠" },
	{ name: "Roronoa Zoro", role: "O espadachim das três lâminas", color: "#487267", icon: "⚔" },
	{ name: "Nami", role: "A navegadora que lê os ventos", color: "#dd8a53", icon: "✦" },
	{ name: "Sanji", role: "O cozinheiro de pernas velozes", color: "#d0a455", icon: "♨" },
	{ name: "Nico Robin", role: "A arqueóloga que busca a história", color: "#795675", icon: "✿" },
	{ name: "Usopp", role: "Atirador e bravo guerreiro do mar", color: "#a87943", icon: "◎" },
	{ name: "Tony Tony Chopper", role: "O médico de nariz azul", color: "#668b9a", icon: "✚" },
	{ name: "Franky", role: "O carpinteiro super da tripulação", color: "#4c7392", icon: "★" },
	{ name: "Brook", role: "O músico que voltou do além", color: "#756b87", icon: "♫" },
	{ name: "Jinbe", role: "O timoneiro dos Chapéus de Palha", color: "#4d7180", icon: "波" },
	{ name: "Yamato", role: "A grande aliada de Wano", color: "#b55451", icon: "❋" },
	{ name: "Kaido", role: "Uma das criaturas mais poderosas", color: "#684052", icon: "龍" },
];

const canvas = document.querySelector("#wheel-canvas");
const context = canvas.getContext("2d");
const wheel = document.querySelector("#wheel-disc");
const spinButton = document.querySelector("#spin-button");
const buttonLabel = document.querySelector("#button-label");
const resultName = document.querySelector("#result-name");
const resultDescription = document.querySelector("#result-description");
const characterList = document.querySelector("#character-list");
const segmentAngle = (Math.PI * 2) / characters.length;
let currentRotation = 0;
let isSpinning = false;

function drawWheel() {
	const size = canvas.width;
	const center = size / 2;
	const radius = center - 7;
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
		context.strokeStyle = "#f2d8a3";
		context.lineWidth = 3;
		context.stroke();

		context.save();
		context.translate(center, center);
		context.rotate(middleAngle);
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillStyle = "#fff1d7";
		context.shadowColor = "#1a1014aa";
		context.shadowBlur = 5;
		context.font = "bold 37px 'DM Sans', sans-serif";
		context.fillText(character.icon, radius * 0.69, -13);
		context.shadowBlur = 0;
		context.font = "700 20px 'DM Sans', sans-serif";
		context.fillStyle = "#fff7e8";
		context.fillText(character.name, radius * 0.69, 23, 158);
		context.restore();
	});

	context.beginPath();
	context.arc(center, center, radius - 4, 0, Math.PI * 2);
	context.strokeStyle = "#f3dbab";
	context.lineWidth = 5;
	context.stroke();
}

function renderCharacterList() {
	characterList.innerHTML = characters.map((character) =>
		`<span class="character-chip"><span aria-hidden="true">${character.icon}</span>${character.name}</span>`
	).join("");
}

function spin() {
	if (isSpinning) return;

	isSpinning = true;
	spinButton.disabled = true;
	buttonLabel.textContent = "A sorte está girando…";
	resultName.innerHTML = "O destino<br>está girando…";
	resultDescription.textContent = "Os ventos de Wano estão escolhendo seu personagem.";

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
		resultDescription.textContent = selectedCharacter.role;
		buttonLabel.textContent = "Girar novamente";
		spinButton.disabled = false;
		isSpinning = false;
	}, transitionTime + 100);
}

spinButton.addEventListener("click", spin);
drawWheel();
renderCharacterList();
