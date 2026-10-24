/**
 * Caça-Palavras do East Blue - One Piece
 * Sistema de grade aleatória com 30 palavras, cronômetro, histórico e celebração de recorde com explosões.
 */

document.addEventListener("DOMContentLoaded", () => {
	// --- BANCO DE 30 PALAVRAS DO EAST BLUE ---
	const EAST_BLUE_WORDS = [
		"LUFFY", "ZORO", "NAMI", "USOPP", "SANJI",
		"SHANKS", "ARLONG", "BUGGY", "SMOKER", "MIHAWK",
		"KOBY", "ZEFF", "KAYA", "KURO", "KRIEG",
		"ALVIDA", "MORGAN", "FOOSHA", "BARATIE", "MERRY",
		"LOGUETOWN", "COCOYASI", "CHOUCHOU", "DRAGON", "TASHIGI",
		"BELLEMERE", "GIN", "CABAJI", "MOHJI", "HELMEPPO"
	];

	const GRID_SIZE = 14;
	const WORDS_PER_GAME = 10;

	// Estados do Jogo
	let currentGrid = [];
	let activeWords = [];
	let foundWords = new Set();
	let isSelecting = false;
	let selectionStart = null;
	let currentSelection = [];
	let clickFirstCell = null;

	// Cronômetro
	let timerInterval = null;
	let secondsElapsed = 0;
	let isGameRunning = false;

	// Elementos DOM
	const gridElement = document.querySelector("#word-grid");
	const wordsListElement = document.querySelector("#words-list");
	const wordsCountElement = document.querySelector("#words-count");
	const timerDisplay = document.querySelector("#timer-display");
	const lastTimeDisplay = document.querySelector("#last-time-display");
	const recordDisplay = document.querySelector("#record-display");
	const newGameBtn = document.querySelector("#btn-new-game");
	const hintBtn = document.querySelector("#btn-hint");

	// Modal & Canvas
	const victoryModal = document.querySelector("#victory-modal");
	const victoryTitle = document.querySelector("#victory-title");
	const victoryDesc = document.querySelector("#victory-desc");
	const victoryTime = document.querySelector("#victory-time");
	const victoryRecord = document.querySelector("#victory-record");
	const victoryBadge = document.querySelector("#victory-badge");
	const btnPlayAgain = document.querySelector("#btn-play-again");
	const fireworksCanvas = document.querySelector("#fireworks-canvas");

	// --- ÁUDIO SINTETIZADO (Web Audio API) ---
	let audioCtx = null;
	function playSound(type) {
		try {
			if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
			const osc = audioCtx.createOscillator();
			const gain = audioCtx.createGain();
			osc.connect(gain);
			gain.connect(audioCtx.destination);

			const now = audioCtx.currentTime;
			if (type === "found") {
				osc.frequency.setValueAtTime(440, now);
				osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
				gain.gain.setValueAtTime(0.2, now);
				gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
				osc.start(now);
				osc.stop(now + 0.2);
			} else if (type === "record") {
				osc.type = "triangle";
				osc.frequency.setValueAtTime(523.25, now);
				osc.frequency.setValueAtTime(659.25, now + 0.1);
				osc.frequency.setValueAtTime(783.99, now + 0.2);
				osc.frequency.setValueAtTime(1046.50, now + 0.3);
				gain.gain.setValueAtTime(0.3, now);
				gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
				osc.start(now);
				osc.stop(now + 0.5);
			}
		} catch (e) {}
	}

	// --- FORMATADORES DE TEMPO ---
	function formatTime(totalSeconds) {
		if (totalSeconds === null || totalSeconds === undefined || isNaN(totalSeconds)) return "--:--";
		const mins = Math.floor(totalSeconds / 60);
		const secs = totalSeconds % 60;
		return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
	}

	function loadRecords() {
		const last = localStorage.getItem("eastblue_ws_last_time");
		const best = localStorage.getItem("eastblue_ws_best_time");

		lastTimeDisplay.textContent = last ? formatTime(parseInt(last, 10)) : "--:--";
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

	// --- GERAÇÃO DO CAÇA-PALAVRAS ---
	function getRandomSample(array, count) {
		const shuffled = [...array].sort(() => 0.5 - Math.random());
		return shuffled.slice(0, count);
	}

	function createEmptyGrid(size) {
		return Array.from({ length: size }, () => Array(size).fill(""));
	}

	// 8 Direções de posicionamento
	const DIRECTIONS = [
		[0, 1],   // horizontal dir
		[0, -1],  // horizontal esq
		[1, 0],   // vertical baixo
		[-1, 0],  // vertical cima
		[1, 1],   // diagonal baixo-dir
		[-1, -1], // diagonal cima-esq
		[1, -1],  // diagonal baixo-esq
		[-1, 1]   // diagonal cima-dir
	];

	function placeWordInGrid(grid, word, size) {
		const dirs = [...DIRECTIONS].sort(() => 0.5 - Math.random());
		const len = word.length;

		for (let attempt = 0; attempt < 250; attempt++) {
			const startRow = Math.floor(Math.random() * size);
			const startCol = Math.floor(Math.random() * size);
			const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)];

			const endRow = startRow + (len - 1) * dr;
			const endCol = startCol + (len - 1) * dc;

			if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) continue;

			let canPlace = true;
			for (let i = 0; i < len; i++) {
				const r = startRow + i * dr;
				const c = startCol + i * dc;
				const cell = grid[r][c];
				if (cell !== "" && cell !== word[i]) {
					canPlace = false;
					break;
				}
			}

			if (canPlace) {
				const coordinates = [];
				for (let i = 0; i < len; i++) {
					const r = startRow + i * dr;
					const c = startCol + i * dc;
					grid[r][c] = word[i];
					coordinates.push({ r, c });
				}
				return coordinates;
			}
		}
		return null;
	}

	function generatePuzzle() {
		let placedWords = [];
		let attempts = 0;

		while (attempts < 20) {
			attempts++;
			const grid = createEmptyGrid(GRID_SIZE);
			const selectedWords = getRandomSample(EAST_BLUE_WORDS, WORDS_PER_GAME);
			placedWords = [];

			for (const word of selectedWords) {
				const coords = placeWordInGrid(grid, word, GRID_SIZE);
				if (coords) {
					placedWords.push({ word, coords });
				}
			}

			// Se conseguiu posicionar a maioria (pelo menos 8), preenche o resto com letras aleatórias
			if (placedWords.length >= 8) {
				const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
				for (let r = 0; r < GRID_SIZE; r++) {
					for (let c = 0; c < GRID_SIZE; c++) {
						if (grid[r][c] === "") {
							grid[r][c] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
						}
					}
				}
				return { grid, words: placedWords };
			}
		}

		// Fallback de segurança garantido
		const grid = createEmptyGrid(GRID_SIZE);
		const words = ["LUFFY", "ZORO", "NAMI", "USOPP", "SANJI", "SHANKS", "ARLONG", "BUGGY"];
		placedWords = [];
		words.forEach((w, idx) => {
			for (let i = 0; i < w.length; i++) {
				grid[idx][i] = w[i];
			}
			placedWords.push({ word: w, coords: Array.from({ length: w.length }, (_, i) => ({ r: idx, c: i })) });
		});
		return { grid, words: placedWords };
	}

	// --- RENDERIZAÇÃO DA GRADE ---
	function renderBoard() {
		gridElement.innerHTML = "";
		for (let r = 0; r < GRID_SIZE; r++) {
			for (let c = 0; c < GRID_SIZE; c++) {
				const cell = document.createElement("div");
				cell.className = "grid-cell";
				cell.textContent = currentGrid[r][c];
				cell.dataset.row = r;
				cell.dataset.col = c;
				gridElement.appendChild(cell);
			}
		}
	}

	function renderWordsList() {
		wordsListElement.innerHTML = "";
		activeWords.forEach(({ word }) => {
			const li = document.createElement("li");
			li.className = "word-tag-item";
			li.id = `word-tag-${word}`;

			const spanText = document.createElement("span");
			spanText.textContent = word;

			const checkIcon = document.createElement("span");
			checkIcon.className = "check-icon";
			checkIcon.textContent = "✔";

			li.appendChild(spanText);
			li.appendChild(checkIcon);
			wordsListElement.appendChild(li);
		});

		updateWordsCounter();
	}

	function updateWordsCounter() {
		wordsCountElement.textContent = `${foundWords.size} / ${activeWords.length}`;
	}

	// --- LÓGICA DE SELEÇÃO DE CÉLULAS ---
	function getCellElement(r, c) {
		return gridElement.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"]`);
	}

	function getLineCells(startR, startC, endR, endC) {
		const dr = endR - startR;
		const dc = endC - startC;
		const absDr = Math.abs(dr);
		const absDc = Math.abs(dc);

		// Verifica se a linha é reta (horizontal, vertical ou diagonal perfeita 45º)
		if (absDr !== 0 && absDc !== 0 && absDr !== absDc) return [];

		const steps = Math.max(absDr, absDc);
		const stepR = dr === 0 ? 0 : dr / steps;
		const stepC = dc === 0 ? 0 : dc / steps;

		const cells = [];
		for (let i = 0; i <= steps; i++) {
			cells.push({
				r: startR + i * stepR,
				c: startC + i * stepC
			});
		}
		return cells;
	}

	function highlightSelection(cells) {
		document.querySelectorAll(".grid-cell.selected").forEach(el => el.classList.remove("selected"));
		cells.forEach(({ r, c }) => {
			const cell = getCellElement(r, c);
			if (cell) cell.classList.add("selected");
		});
	}

	function validateWord(cells) {
		if (cells.length < 2) return;

		const forwardText = cells.map(({ r, c }) => currentGrid[r][c]).join("");
		const backwardText = [...forwardText].reverse().join("");

		const matchedWordObj = activeWords.find(
			item => (item.word === forwardText || item.word === backwardText) && !foundWords.has(item.word)
		);

		if (matchedWordObj) {
			const word = matchedWordObj.word;
			foundWords.add(word);

			// Marcação visual permanente na grade
			const colorClass = foundWords.size % 2 === 0 ? "found-word" : "found-word-alt";
			cells.forEach(({ r, c }) => {
				const cell = getCellElement(r, c);
				if (cell) {
					cell.classList.remove("selected");
					cell.classList.add(colorClass);
				}
			});

			// Marcação visual na lista lateral
			const tagEl = document.querySelector(`#word-tag-${word}`);
			if (tagEl) tagEl.classList.add("found");

			playSound("found");
			updateWordsCounter();

			// Checa condição de vitória
			if (foundWords.size === activeWords.length) {
				handleVictory();
			}
		}
	}

	// --- CONTROLE DE VITÓRIA E RECORDES ---
	function handleVictory() {
		stopTimer();
		const finalTime = secondsElapsed;

		// Salva o tempo anterior
		const prevBest = localStorage.getItem("eastblue_ws_best_time");
		const prevBestVal = prevBest ? parseInt(prevBest, 10) : null;
		localStorage.setItem("eastblue_ws_last_time", finalTime.toString());

		loadRecords();

		const isNewRecord = prevBestVal === null || finalTime < prevBestVal;

		if (isNewRecord) {
			localStorage.setItem("eastblue_ws_best_time", finalTime.toString());
			loadRecords();

			victoryBadge.textContent = "💥 NOVO RECORDE DO EAST BLUE! 💥";
			victoryCard.classList.add("is-record");
			victoryTitle.textContent = "PARABÉNS! VOCÊ BATEU O RECORDE!";
			victoryDesc.textContent = prevBestVal === null
				? `Você conquistou o primeiro recorde do East Blue com incríveis ${formatTime(finalTime)}!`
				: `Você superou o recorde anterior (${formatTime(prevBestVal)}) terminando em apenas ${formatTime(finalTime)}!`;

			playSound("record");
			startFireworks();
		} else {
			victoryBadge.textContent = "🏆 VITÓRIA NOS MARES!";
			victoryCard.classList.remove("is-record");
			victoryTitle.textContent = "Missão Cumprida, Marujo!";
			victoryDesc.textContent = `Você encontrou todas as ${activeWords.length} palavras em ${formatTime(finalTime)}. O recorde atual é de ${formatTime(prevBestVal)}. Tente novamente para superá-lo!`;
		}

		victoryTime.textContent = formatTime(finalTime);
		victoryRecord.textContent = formatTime(parseInt(localStorage.getItem("eastblue_ws_best_time"), 10));

		setTimeout(() => {
			victoryModal.classList.add("is-open");
		}, 300);
	}

	const victoryCard = document.querySelector(".victory-card");

	// --- EXPLOSÕES DE COMEMORAÇÃO (CANVAS PARTICLES) ---
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

		// Dispara 6 explosões sequenciais na tela
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
				p.vy += 0.12; // gravidade
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

		// Para as explosões após 8 segundos
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

	// --- EVENT LISTENERS DA GRADE (Mouse & Touch & Clique Duplo) ---
	gridElement.addEventListener("mousedown", (e) => {
		const cell = e.target.closest(".grid-cell");
		if (!cell) return;

		isSelecting = true;
		const r = parseInt(cell.dataset.row, 10);
		const c = parseInt(cell.dataset.col, 10);
		selectionStart = { r, c };
		currentSelection = [selectionStart];
		highlightSelection(currentSelection);

		// Suporte a 2 cliques
		if (!clickFirstCell) {
			clickFirstCell = { r, c };
		} else {
			const line = getLineCells(clickFirstCell.r, clickFirstCell.c, r, c);
			if (line.length > 1) {
				validateWord(line);
			}
			clickFirstCell = null;
		}
	});

	gridElement.addEventListener("mouseenter", (e) => {
		if (!isSelecting || !selectionStart) return;
		const cell = e.target.closest(".grid-cell");
		if (!cell) return;

		const endR = parseInt(cell.dataset.row, 10);
		const endC = parseInt(cell.dataset.col, 10);
		currentSelection = getLineCells(selectionStart.r, selectionStart.c, endR, endC);
		highlightSelection(currentSelection);
	}, true);

	window.addEventListener("mouseup", () => {
		if (isSelecting && currentSelection.length > 1) {
			validateWord(currentSelection);
		}
		isSelecting = false;
		selectionStart = null;
		currentSelection = [];
		document.querySelectorAll(".grid-cell.selected").forEach(el => el.classList.remove("selected"));
	});

	// Touch Support para Mobile
	gridElement.addEventListener("touchstart", (e) => {
		const touch = e.touches[0];
		const target = document.elementFromPoint(touch.clientX, touch.clientY);
		const cell = target?.closest(".grid-cell");
		if (!cell) return;

		isSelecting = true;
		const r = parseInt(cell.dataset.row, 10);
		const c = parseInt(cell.dataset.col, 10);
		selectionStart = { r, c };
		currentSelection = [selectionStart];
		highlightSelection(currentSelection);
	}, { passive: true });

	gridElement.addEventListener("touchmove", (e) => {
		if (!isSelecting || !selectionStart) return;
		const touch = e.touches[0];
		const target = document.elementFromPoint(touch.clientX, touch.clientY);
		const cell = target?.closest(".grid-cell");
		if (!cell) return;

		const endR = parseInt(cell.dataset.row, 10);
		const endC = parseInt(cell.dataset.col, 10);
		currentSelection = getLineCells(selectionStart.r, selectionStart.c, endR, endC);
		highlightSelection(currentSelection);
	}, { passive: true });

	gridElement.addEventListener("touchend", () => {
		if (isSelecting && currentSelection.length > 1) {
			validateWord(currentSelection);
		}
		isSelecting = false;
		selectionStart = null;
		currentSelection = [];
		document.querySelectorAll(".grid-cell.selected").forEach(el => el.classList.remove("selected"));
	});

	// --- INICIALIZAR NOVO JOGO ---
	function startNewGame() {
		stopTimer();
		stopFireworks();
		victoryModal.classList.remove("is-open");
		clickFirstCell = null;
		foundWords.clear();

		const puzzle = generatePuzzle();
		currentGrid = puzzle.grid;
		activeWords = puzzle.words;

		renderBoard();
		renderWordsList();
		startTimer();
	}

	newGameBtn.addEventListener("click", startNewGame);
	btnPlayAgain.addEventListener("click", startNewGame);

	// Dica: Ilumina temporariamente a primeira letra de uma palavra que falta
	hintBtn.addEventListener("click", () => {
		const missingWord = activeWords.find(item => !foundWords.has(item.word));
		if (!missingWord) return;

		const firstCoord = missingWord.coords[0];
		const cell = getCellElement(firstCoord.r, firstCoord.c);
		if (cell) {
			cell.style.boxShadow = "0 0 18px 4px #eb743b";
			cell.style.transform = "scale(1.2)";
			setTimeout(() => {
				cell.style.boxShadow = "";
				cell.style.transform = "";
			}, 1200);
		}
	});

	// Inicia
	loadRecords();
	startNewGame();
});

