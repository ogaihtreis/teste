/**
 * Shared Engine: Sincronização de Tema e Botão Voltar ao Topo
 */

(function () {
	// --- SINCRONIZAÇÃO DE TEMA (CLARO / ESCURO) ---
	function applySavedTheme() {
		try {
			const saved = localStorage.getItem("grand-line-theme");
			const isDark = saved === "dark";
			document.documentElement.dataset.theme = isDark ? "dark" : "light";
			document.documentElement.classList.toggle("dark", isDark);
			updateToggleButtons(isDark);
		} catch (e) {
			document.documentElement.dataset.theme = "light";
			document.documentElement.classList.remove("dark");
		}
	}

	function updateToggleButtons(isDark) {
		const toggles = document.querySelectorAll(".theme-toggle, #theme-toggle");
		toggles.forEach(toggle => {
			toggle.setAttribute("aria-pressed", String(isDark));
			toggle.setAttribute("aria-label", isDark ? "Ativar modo claro" : "Ativar modo escuro");
			const icon = toggle.querySelector(".theme-icon");
			const label = toggle.querySelector(".theme-label");
			if (icon) icon.textContent = isDark ? "☀" : "☾";
			if (label) label.textContent = isDark ? "Modo claro" : "Modo escuro";
		});
	}

	function toggleTheme() {
		const current = document.documentElement.dataset.theme;
		const isDark = current !== "dark";
		document.documentElement.dataset.theme = isDark ? "dark" : "light";
		document.documentElement.classList.toggle("dark", isDark);
		try {
			localStorage.setItem("grand-line-theme", isDark ? "dark" : "light");
		} catch (e) {}
		updateToggleButtons(isDark);
	}

	// Executa imediatamente para evitar flash de tema incorreto
	applySavedTheme();

	document.addEventListener("DOMContentLoaded", () => {
		applySavedTheme();

		// Delegação de evento para o botão de alternar tema
		document.addEventListener("click", (e) => {
			const toggle = e.target.closest(".theme-toggle, #theme-toggle");
			if (toggle) {
				e.preventDefault();
				toggleTheme();
			}
		});

		// Delegação de evento universal para o botão "VOLTAR AO TOPO"
		document.addEventListener("click", (e) => {
			const backTop = e.target.closest(".back-top-btn, .back-top, #btn-back-to-top, [data-action='back-to-top']");
			if (backTop) {
				e.preventDefault();
				window.scrollTo({
					top: 0,
					behavior: "smooth"
				});
			}
		});
	});
})();