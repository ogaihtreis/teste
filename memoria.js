/**
 * Jogo da Memória do East Blue - One Piece
 * Sistema com 3 dificuldades, cronômetro, contador de movimentos, recordes e explosões de vitória.
 */

document.addEventListener("DOMContentLoaded", () => {
	// Personagens com fotos
	const CHARACTERS = [
		{ id: "luffy", name: "Monkey D. Luffy", image: "images/luffy.jpg" },
		{ id: "zoro", name: "Roronoa Zoro", image: "images/zoro.jpg" },
		{ id: "nami", name: "Nami", image: "images/nami.jpg" },
		{ id: "sanji", name: "Sanji", image: "images/sanji.jpg" },
		{ id: "usopp", name: "Usopp", image: "images/usopp.jpg" },
		{ id: "shanks", name: "Shanks", image: "images/shanks.jpg" },
		{ id: "koby", name: "Koby", image: "images/koby.jpg" },
		{ id: "helmeppo", name: "Helmeppo", image: "images/helmeppo.jpg" },
		{ id: "buggy", name: "Buggy", image: "images/buggy.jpg" },
		{ id: "arlong", name: "Arlong", image: "images/arlong.jpg" },
		{ id: "mihawk", name: "Mihawk", image: "images/mihawk.jpg" },
		{ id: "smoker", name: "Smoker", image: "images/smoker.jpg" }
	];

	// Configuração de dificuldades
	const DIFFICULTIES = {
		easy: { pairs: 6, gridClass: "grid-easy", label: "Fácil (6 Pares)" },
		medium: { pairs: 8, gridClass: "grid-medium", label: "Médio (8 Pares)" },
		hard: { pairs: 12, gridClass: "grid-hard", label: "Difícil (12 Pares)" }
	};

	let currentDifficulty = "medium";
	let flippedCards = [];
	let matchedPairs = 0;
	let totalPairs = 8;
	let movesCount = 0;
	let lockBoard = false;

	// Cronômetro
	let timerInterval = null;
	let secondsElapsed = 0;
	let isGameRunning = false;

	// Elementos DOM
	const gridContainer = document.querySelector("#memory-grid");
	const timerDisplay = document.querySelector("#timer-display");
	const movesDisplay = document.querySelector("#moves-display");
	const pairsDisplay = document.querySelector("#pairs-display");
	const recordDisplay = document.querySelector("#record-display");
	const restartBtn = document.querySelector("#btn-restart");
	const diffButtons = document.querySelectorAll(".diff-btn");

	// Modal & Canvas
	const victoryModal = document.querySelector("#victory-modal");
	const victoryTitle = document.querySelector("#victory-title");
	const victoryDesc = document.querySelector("#victory-desc");
	const victoryTime = document.querySelector("#victory-time");
	const victoryMoves = document.querySelector("#victory-moves");
	const victoryRecord = document.querySelector("#victory-record");
	const victoryBadge = document.querySelector("#victory-badge");
	const btnPlayAgain = document.querySelector("#btn-play-again");
	const fireworksCanvas = document.querySelector("#fireworks-canvas");

	// --- ÁUDIO SINTETIZADO ---
	let audioCtx = null;
	function playSound(type) {
		try {
			if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
			const osc = audioCtx.createOscillator();
			const gain = audioCtx.createGain();
			osc.connect(gain);
			gain.connect(audioCtx.destination);

			const now = audioCtx.currentTime;
			if (type === "flip") {
				osc.frequency.setValueAtTime(300, now);
				osc.frequency.exponentialRampToValueAtTime(450, now + 0.08);
				gain.gain.setValueAtTime(0.12, now);
				gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
				osc.start(now);
				osc.stop(now + 0.08);
			} else if (type === "match") {
				osc.frequency.setValueAtTime(523.25, now);
				osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.18);
				gain.gain.setValueAtTime(0.2, now);
				gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
				osc.start(now);
				osc.stop(now + 0.22);
			} else if (type === "victory") {
				osc.type = "triangle";
				osc.frequency.setValueAtTime(440, now);
				osc.frequency.setValueAtTime(554.37, now + 0.12);
				osc.frequency.setValueAtTime(659.25, now + 0.24);
				osc.frequency.setValueAtTime(880, now + 0.36);
				gain.gain.setValueAtTime(0.25, now);
				gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
				osc.start(now);
				osc.stop(now + 0.55);
			}
		} catch (e) {}
	}

	function formatTime(totalSeconds) {
		if (totalSeconds === null || totalSeconds === undefined || isNaN(totalSeconds)) return "--:--";
		const mins = Math.floor(totalSeconds / 60);
		const secs = totalSeconds % 60;
		return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
	}

	function loadRecord() {
		const best = localStorage.getItem(`eastblue_mem_best_time_${currentDifficulty}`);
		recordDisplay.textContent = best ? formatTime(parseInt(best, 10)) : "--:--";
	}

	function startTimer() {
		clearInterval(timerInterval);
		secondsElapsed = 0;
		isGameRunning = true;
		timerDisplay.textContent = "00:00";

		timerInterval = setInterval(() => {
			secondsElapsed++;
			timerDisplay.textContent = formatTime(secondsElapsed);
		}, 1000);
	}

	function stopTimer() {
		clearInterval(timerInterval);
		isGameRunning = false;
	}

	// Embaralhar array
	function shuffle(array) {
		const clone = [...array];
		for (let i = clone.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[clone[i], clone[j]] = [clone[j], clone[i]];
		}
		return clone;
	}

	// Criar baralho
	function createDeck(count) {
		const selectedChars = shuffle(CHARACTERS).slice(0, count);
		const deck = [];

		selectedChars.forEach(char => {
			deck.push({ ...char, uniqueId: `${char.id}-a` });
			deck.push({ ...char, uniqueId: `${char.id}-b` });
		});

		return shuffle(deck);
	}

	// Renderizar cartas
	function renderCards() {
		gridContainer.innerHTML = "";
		const diffConfig = DIFFICULTIES[currentDifficulty];
		totalPairs = diffConfig.pairs;
		matchedPairs = 0;
		movesCount = 0;
		movesDisplay.textContent = "0";
		pairsDisplay.textContent = `0 / ${totalPairs}`;

		gridContainer.className = `memory-grid ${diffConfig.gridClass}`;
		const deck = createDeck(totalPairs);

		deck.forEach(item => {
			const card = document.createElement("div");
			card.className = "memory-card";
			card.dataset.character = item.id;
			card.dataset.uniqueId = item.uniqueId;

			card.innerHTML = `
				<div class="card-inner">
					<div class="card-face card-back">
						<span class="skull-icon" aria-hidden="true">☠</span>
						<span class="back-title">EAST BLUE</span>
					</div>
					<div class="card-face card-front">
						<span class="card-front-wanted">WANTED</span>
						<div class="card-photo-box">
							<img src="${item.image}" alt="${item.name}" loading="lazy">
						</div>
						<span class="card-name-banner">${item.name}</span>
					</div>
				</div>
			`;

			card.addEventListener("click", () => handleCardClick(card));
			gridContainer.appendChild(card);
		});
	}

	// Lógica do clique na carta
	function handleCardClick(card) {
		if (lockBoard) return;
		if (card.classList.contains("is-flipped") || card.classList.contains("is-matched")) return;

		// Inicia cronômetro no primeiro clique
		if (!isGameRunning && movesCount === 0 && matchedPairs === 0) {
			startTimer();
		}

		card.classList.add("is-flipped");
		playSound("flip");
		flippedCards.push(card);

		if (flippedCards.length === 2) {
			movesCount++;
			movesDisplay.textContent = movesCount.toString();
			checkMatch();
		}
	}

	// Checar se cartas são iguais
	function checkMatch() {
		const [card1, card2] = flippedCards;
		const isMatch = card1.dataset.character === card2.dataset.character;

		if (isMatch) {
			lockBoard = true;
			setTimeout(() => {
				card1.classList.add("is-matched");
				card2.classList.add("is-matched");
				playSound("match");
				matchedPairs++;
				pairsDisplay.textContent = `${matchedPairs} / ${totalPairs}`;
				flippedCards = [];
				lockBoard = false;

				if (matchedPairs === totalPairs) {
					handleVictory();
				}
			}, 300);
		} else {
			lockBoard = true;
			setTimeout(() => {
				card1.classList.remove("is-flipped");
				card2.classList.remove("is-flipped");
				flippedCards = [];
				lockBoard = false;
			}, 800);
		}
	}

	// Vitória
	function handleVictory() {
		stopTimer();
		const finalTime = secondsElapsed;
		const recordKey = `eastblue_mem_best_time_${currentDifficulty}`;
		const prevBest = localStorage.getItem(recordKey);
		const prevBestVal = prevBest ? parseInt(prevBest, 10) : null;

		const isNewRecord = prevBestVal === null || finalTime < prevBestVal;

		if (isNewRecord) {
			localStorage.setItem(recordKey, finalTime.toString());
			loadRecord();

			victoryBadge.textContent = "💥 NOVO RECORDE DO EAST BLUE! 💥";
			victoryCard.classList.add("is-record");
			victoryTitle.textContent = "PARABÉNS! VOCÊ BATEU O RECORDE!";
			victoryDesc.textContent = prevBestVal === null
				? `Você conquistou o primeiro recorde na dificuldade ${DIFFICULTIES[currentDifficulty].label} em ${formatTime(finalTime)}!`
				: `Você superou o recorde anterior (${formatTime(prevBestVal)}) terminando em incríveis ${formatTime(finalTime)}!`;

			playSound("victory");
			startFireworks();
		} else {
			victoryBadge.textContent = "🏆 VITÓRIA NOS MARES!";
			victoryCard.classList.remove("is-record");
			victoryTitle.textContent = "Memória de Pirata Veterano!";
			victoryDesc.textContent = `Você encontrou todos os ${totalPairs} pares em ${formatTime(finalTime)} com ${movesCount} movimentos. O recorde atual é de ${formatTime(prevBestVal)}. Tente novamente para superá-lo!`;
			playSound("victory");
		}

		victoryTime.textContent = formatTime(finalTime);
		victoryMoves.textContent = movesCount.toString();
		victoryRecord.textContent = formatTime(parseInt(localStorage.getItem(recordKey), 10));

		setTimeout(() => {
			victoryModal.classList.add("is-open");
		}, 400);
	}

	const victoryCard = document.querySelector(".victory-card");

	// --- EXPLOSÕES DE PARTICULAS ---
	let fireworksAnimId = null;
	function startFireworks() {
		const ctx = fireworksCanvas.getContext("2d");
		fireworksCanvas.width = window.innerWidth;
		fireworksCanvas.height = window.innerHeight;

		const particles = [];
		const colors = ["#ff5e36", "#ffd23f", "#3bb273", "#4d9de0", "#ffffff", "#e15554"];

		function createExplosion(x, y) {
			const count = 70;
			for (let i = 0; i < count; i++) {
				const angle = Math.random() * Math.PI * 2;
				const speed = Math.random() * 8 + 3;
				particles.push({
					x,
					y,
					vx: Math.cos(angle) * speed,
					vy: Math.sin(angle) * speed,
					color: colors[Math.floor(Math.random() * colors.length)],
					size: Math.random() * 4 + 2,
					alpha: 1,
					decay: Math.random() * 0.015 + 0.01
				});
			}
		}

		for (let i = 0; i < 7; i++) {
			setTimeout(() => {
				createExplosion(
					window.innerWidth * (0.2 + Math.random() * 0.6),
					window.innerHeight * (0.2 + Math.random() * 0.5)
				);
			}, i * 350);
		}

		function animate() {
			ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

			for (let i = particles.length - 1; i >= 0; i--) {
				const p = particles[i];
				p.x += p.vx;
				p.y += p.vy;
				p.vy += 0.12;
				p.alpha -= p.decay;

				if (p.alpha <= 0) {
					particles.splice(i, 1);
					continue;
				}

				ctx.save();
				ctx.globalAlpha = p.alpha;
				ctx.fillStyle = p.color;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				ctx.fill();
				ctx.restore();
			}

			if (particles.length > 0 || fireworksAnimId) {
				fireworksAnimId = requestAnimationFrame(animate);
			}
		}

		animate();

		setTimeout(() => {
			if (fireworksAnimId) {
				cancelAnimationFrame(fireworksAnimId);
				fireworksAnimId = null;
			}
			ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
		}, 8000);
	}

	function stopFireworks() {
		if (fireworksAnimId) {
			cancelAnimationFrame(fireworksAnimId);
			fireworksAnimId = null;
		}
		const ctx = fireworksCanvas.getContext("2d");
		ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
	}

	// Reiniciar Jogo
	function resetGame() {
		stopTimer();
		stopFireworks();
		victoryModal.classList.remove("is-open");
		flippedCards = [];
		lockBoard = false;
		loadRecord();
		renderCards();
	}

	// Dificuldade
	diffButtons.forEach(btn => {
		btn.addEventListener("click", () => {
			diffButtons.forEach(b => b.classList.remove("active"));
			btn.classList.add("active");
			currentDifficulty = btn.dataset.diff;
			resetGame();
		});
	});

	restartBtn.addEventListener("click", resetGame);
	btnPlayAgain.addEventListener("click", resetGame);

	// Inicia
	loadRecord();
	renderCards();
});

