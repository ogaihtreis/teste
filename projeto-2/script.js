const arcs = {
	"east-blue": {
		name: "East Blue",
		brand: 'EAST<span class="brand-highlight">BLUE</span>',
		heading: "seu caminho no East Blue?",
		eyebrow: "EAST BLUE · O COMEÇO DA JORNADA",
		intro: "Gire a roleta e descubra qual pirata, marinheiro ou aventureiro vai embarcar na sua próxima jornada.",
		panel: "SEU DESTINO NO EAST BLUE",
		list: "A TRIPULAÇÃO POSSÍVEL",
		footerLeft: "☼ VENTOS FAVORÁVEIS",
		footerRight: "MAR DO LESTE",
		footerMessage: "QUE OS VENTOS DO EAST BLUE SOPREM A SEU FAVOR",
		spinMessage: "As correntes do East Blue estão escolhendo seu personagem.",
		textColor: "#163b4b",
		borderColor: "#e5f5ef",
		characters: [
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
		],
	},
	wano: {
		name: "Wano",
		brand: 'WANO<span class="brand-highlight">LUCK</span>',
		heading: "seu caminho em Wano?",
		eyebrow: "PAÍS DE WANO · TERRA DOS SAMURAIS",
		intro: "Gire a roleta e deixe os ventos de Wano escolherem quem vai cruzar seu caminho nesta aventura.",
		panel: "SEU DESTINO EM WANO",
		list: "PERSONAGENS DE WANO",
		footerLeft: "風 · VENTO DA SORTE",
		footerRight: "WANO KUNI",
		footerMessage: "QUE OS VENTOS DE WANO SOPREM A SEU FAVOR",
		spinMessage: "Os ventos de Wano estão escolhendo seu personagem.",
		textColor: "#fff1d7",
		borderColor: "#f2d8a3",
		characters: [
			{ name: "Monkey D. Luffy", role: "O capitão que desafia Kaido e sonha ser Rei dos Piratas", color: "#b8423d", icon: "☠" },
			{ name: "Roronoa Zoro", role: "O samurai de três espadas dos Chapéus de Palha", color: "#487267", icon: "⚔" },
			{ name: "Nami", role: "A navegadora que enfrenta os perigos de Onigashima", color: "#dd8a53", icon: "✦" },
			{ name: "Sanji", role: "O cozinheiro que luta para proteger sua tripulação", color: "#d0a455", icon: "♨" },
			{ name: "Nico Robin", role: "A arqueóloga em busca dos segredos dos Poneglyphs", color: "#795675", icon: "✿" },
			{ name: "Usopp", role: "O atirador e bravo guerreiro do mar", color: "#a87943", icon: "◎" },
			{ name: "Tony Tony Chopper", role: "O médico de nariz azul da tripulação", color: "#668b9a", icon: "✚" },
			{ name: "Franky", role: "O carpinteiro super dos Chapéus de Palha", color: "#4c7392", icon: "★" },
			{ name: "Brook", role: "O músico que voltou do além", color: "#756b87", icon: "♫" },
			{ name: "Jinbe", role: "O timoneiro dos Chapéus de Palha", color: "#4d7180", icon: "波" },
			{ name: "Yamato", role: "A grande aliada que luta pela liberdade de Wano", color: "#b55451", icon: "❋" },
			{ name: "Kaido", role: "O temido Governador-Geral dos Piratas das Feras", color: "#684052", icon: "龍" },
		],
	},
};

const canvas = document.querySelector("#wheel-canvas");
const context = canvas.getContext("2d");
const wheel = document.querySelector("#wheel-disc");
const spinButton = document.querySelector("#spin-button");
const buttonLabel = document.querySelector("#button-label");
const resultName = document.querySelector("#result-name");
const resultDescription = document.querySelector("#result-description");
const characterList = document.querySelector("#character-list");
const arcOptions = [...document.querySelectorAll("[data-arc-option]")];
let activeArc = "east-blue";
let characters = arcs[activeArc].characters;
let currentRotation = 0;
let isSpinning = false;

function drawWheel() {
	const size = canvas.width;
	const center = size / 2;
	const radius = center - 7;
	const segmentAngle = (Math.PI * 2) / characters.length;
	const arc = arcs[activeArc];
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
		context.strokeStyle = arc.borderColor;
		context.lineWidth = 3;
		context.stroke();

		context.save();
		context.translate(center, center);
		context.rotate(middleAngle);
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillStyle = arc.textColor;
		context.shadowColor = activeArc === "wano" ? "#1a1014aa" : "#ffffff66";
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
	context.strokeStyle = arc.borderColor;
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

function setArc(arcName) {
	if (isSpinning || !arcs[arcName]) return;

	activeArc = arcName;
	characters = arcs[activeArc].characters;
	const arc = arcs[activeArc];
	document.body.dataset.arc = activeArc;
	document.title = `${arc.name} — Roleta de personagens`;
	document.querySelector('meta[name="theme-color"]').content = activeArc === "wano" ? "#261b22" : "#d9f0f2";
	document.querySelector('meta[name="description"]').content = `Gire a roleta de ${arc.name} e descubra qual personagem vai cruzar seu caminho.`;
	document.querySelector("#brand-name").innerHTML = arc.brand;
	document.querySelector(".brand").setAttribute("aria-label", `Roleta de ${arc.name}, início`);
	document.querySelector("#topbar-note").textContent = activeArc === "wano" ? "NAVEGANDO PELO PAÍS DOS SAMURAIS" : "NAVEGANDO PELO EAST BLUE";
	document.querySelector("#arc-eyebrow").textContent = arc.eyebrow;
	document.querySelector("#arc-heading").textContent = arc.heading;
	document.querySelector("#intro-copy").textContent = arc.intro;
	document.querySelector("#game-layout").setAttribute("aria-label", `Roleta de personagens de ${arc.name}`);
	canvas.setAttribute("aria-label", `Roleta com doze personagens de ${arc.name}`);
	document.querySelector("#panel-title").textContent = arc.panel;
	document.querySelector("#panel-footer-left").textContent = arc.footerLeft;
	document.querySelector("#panel-footer-right").textContent = arc.footerRight;
	document.querySelector("#list-title").textContent = arc.list;
	document.querySelector("#footer-message").textContent = arc.footerMessage;
	document.querySelector(".footer-flower").textContent = activeArc === "wano" ? "✿" : "☠";
	document.querySelector("#spin-caption").textContent = `12 personagens estão a bordo. Boa sorte${activeArc === "wano" ? " na jornada" : ", marujo"}!`;
	resultName.innerHTML = "O destino<br>está esperando.";
	resultDescription.textContent = "Aperte o botão no centro da roleta e descubra quem a sorte escolheu.";
	buttonLabel.textContent = "GIRAR";
	spinButton.setAttribute("aria-label", "Girar a roleta");
	arcOptions.forEach((option) => {
		const isActive = option.dataset.arcOption === activeArc;
		option.classList.toggle("is-active", isActive);
		option.setAttribute("aria-pressed", String(isActive));
	});
	currentRotation = 0;
	wheel.style.transitionDuration = "0ms";
	wheel.style.transform = "rotate(0deg)";
	requestAnimationFrame(() => { wheel.style.transitionDuration = "5200ms"; });
	drawWheel();
	renderCharacterList();
	try {
		localStorage.setItem("one-piece-wheel-arc", activeArc);
	} catch {
		// A alternância continua disponível sem armazenamento local.
	}
}

function spin() {
	if (isSpinning) return;

	isSpinning = true;
	spinButton.disabled = true;
	arcOptions.forEach((option) => { option.disabled = true; });
	spinButton.setAttribute("aria-label", "Sorteando personagem");
	buttonLabel.textContent = "GIRANDO";
	resultName.innerHTML = "O destino<br>está girando…";
	resultDescription.textContent = arcs[activeArc].spinMessage;

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
		arcOptions.forEach((option) => { option.disabled = false; });
		isSpinning = false;
	}, transitionTime + 100);
}

arcOptions.forEach((option) => {
	option.addEventListener("click", () => setArc(option.dataset.arcOption));
});
spinButton.addEventListener("click", spin);

try {
	const savedArc = localStorage.getItem("one-piece-wheel-arc");
	if (savedArc && arcs[savedArc]) activeArc = savedArc;
} catch {
	// East Blue é o arco padrão se o armazenamento local estiver indisponível.
}

drawWheel();
renderCharacterList();
if (activeArc !== "east-blue") setArc(activeArc);
