const characters = [
	{ name: "Monkey D. Luffy", role: "O capitão que sonha em ser o Rei dos Piratas", color: "#f0bd69", icon: "☠" },
	{ name: "Roronoa Zoro", role: "O espadachim que busca ser o melhor do mundo", color: "#69a68d", icon: "⚔" },
	{ name: "Nami", role: "A navegadora que sonha mapear o mundo", color: "#f29a57", icon: "✦" },
	{ name: "Sanji", role: "O cozinheiro em busca do All Blue", color: "#e5cf91", icon: "♨" },
	{ name: "Usopp", role: "O atirador rumo ao sonho de ser um bravo guerreiro", color: "#81b8a3", icon: "◎" },
	{ name: "Shanks", role: "O lendário capitão dos Piratas do Ruivo", color: "#d96d56", icon: "✶" },
	{ name: "Koby", role: "O jovem marinheiro que acredita nos próprios sonhos", color: "#8cc5d0", icon: "⚓" },
	{ name: "Helmeppo", role: "O oficial da Marinha em transformação", color: "#7b9fbe", icon: "✦" },
	{ name: "Buggy", role: "O pirata palhaço com grandes ambições", color: "#cf6a72", icon: "☠" },
	{ name: "Arlong", role: "O temido capitão dos Piratas Arlong", color: "#548a9c", icon: "波" },
	{ name: "Mihawk", role: "O maior espadachim do mundo", color: "#8c83a8", icon: "⚔" },
	{ name: "Smoker", role: "O implacável capitão da Marinha", color: "#7896a6", icon: "⚓" },
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
		context.fillStyle = "#163b4b";
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
	characterList.innerHTML = characters.map((character) =>
		`<span class="character-chip"><span aria-hidden="true">${character.icon}</span>${character.name}</span>`
	).join("");
}

function spin() {
	if (isSpinning) return;

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
		resultDescription.textContent = selectedCharacter.role;
		buttonLabel.textContent = "GIRAR";
		spinButton.setAttribute("aria-label", "Girar novamente");
		spinButton.disabled = false;
		isSpinning = false;
	}, transitionTime + 100);
}

spinButton.addEventListener("click", spin);
drawWheel();
renderCharacterList();
