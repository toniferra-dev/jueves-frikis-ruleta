// Espera a que todo el contenido del DOM esté cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {

    // --- Selección de Elementos del DOM ---
    const canvas = document.getElementById('roulette-wheel');
    const ctx = canvas.getContext('2d');
    const spinButton = document.getElementById('spin-button');
    const resultDiv = document.getElementById('result');
    const geminiFeaturesDiv = document.getElementById('gemini-features');
    const geminiButtonsDiv = document.getElementById('gemini-buttons');
    const geminiResultDiv = document.getElementById('gemini-result');

    // --- Configuración de la Ruleta ---
    const participants = ['Pedro', 'Miquel', 'Toni'];
    const colors = ['#3B82F6', '#10B981', '#EF4444']; // Azul, Verde, Rojo
    const arcSize = (2 * Math.PI) / participants.length;
    let currentRotation = 0;

    // --- Funciones de Dibujo ---
    function drawSegment(i) {
        const angle = arcSize * i;
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, angle, angle + arcSize);
        ctx.lineTo(200, 200);
        ctx.fill();
    }

    function drawSegmentText(i) {
        const angle = arcSize * i + arcSize / 2;
        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(angle);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 26px Inter';
        ctx.shadowColor = "rgba(0,0,0,0.4)";
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(participants[i], 160, 10);
        ctx.restore();
    }

    function drawRoulette() {
        ctx.clearRect(0, 0, 400, 400);
        participants.forEach((_, i) => drawSegment(i));
        participants.forEach((_, i) => drawSegmentText(i));
    }

    // --- Lógica del Juego ---
    function spin() {
        spinButton.disabled = true;
        resultDiv.innerHTML = '';
        geminiFeaturesDiv.classList.add('hidden');
        geminiResultDiv.innerHTML = '<p class="text-gray-400 italic">Aquí aparecerán las geniales ideas de Gemini...</p>';

        const randomSpin = Math.floor(Math.random() * 360);
        const spinDegrees = 360 * 5 + randomSpin;
        currentRotation += spinDegrees;
        canvas.style.transform = `rotate(${currentRotation}deg)`;

        setTimeout(() => {
            const finalAngle = currentRotation % 360;
            const degreesPerSegment = 360 / participants.length;
            const winningAngle = (270 - finalAngle + 360) % 360;
            const winningIndex = Math.floor(winningAngle / degreesPerSegment);
            const winner = participants[winningIndex];
            
            displayWinner(winner);
            spinButton.disabled = false;
        }, 7000); 
    }

    function displayWinner(winner) {
        resultDiv.innerHTML = `<h2 class="text-4xl font-bold text-amber-400 animate-pulse">¡Paga ${winner}!</h2>`;
        setupGeminiButtons(winner);
        geminiFeaturesDiv.classList.remove('hidden');
    }

    // --- Integración con Gemini API ---
    function setupGeminiButtons(winnerName) {
        geminiButtonsDiv.innerHTML = `
            <button id="excuse-button" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-500">
                ✨ Generar Excusa para ${winnerName}
            </button>
            <button id="suggestion-button" class="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-500">
                ✨ Sugerencia de Cena Friki
            </button>
        `;
        document.getElementById('excuse-button').addEventListener('click', () => generateExcuse(winnerName));
        document.getElementById('suggestion-button').addEventListener('click', getDinnerSuggestion);
    }

    async function callGemini(prompt) {
        geminiResultDiv.innerHTML = '<p class="text-amber-400 animate-pulse">Contactando con el oráculo de silicio...</p>';
        document.getElementById('excuse-button').disabled = true;
        document.getElementById('suggestion-button').disabled = true;

        const apiKey = ""; // La API Key se inyectará en el entorno de ejecución
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`Error en la API: ${response.statusText}`);
            const result = await response.json();
            if (result.candidates && result.candidates.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                geminiResultDiv.innerHTML = text.replace(/\n/g, '<br>');
            } else {
                throw new Error("Respuesta no válida de la API.");
            }
        } catch (error) {
            console.error("Error llamando a la API de Gemini:", error);
            geminiResultDiv.innerHTML = `<p class="text-red-500">Error: No se pudo contactar con el oráculo. ${error.message}</p>`;
        } finally {
            document.getElementById('excuse-button').disabled = false;
            document.getElementById('suggestion-button').disabled = false;
        }
    }

    function generateExcuse(winnerName) {
        const prompt = `Genera una excusa friki, muy corta y directa (máximo 2 frases) para que ${winnerName} intente librarse de pagar la cena de "Los Jueves Frikis". Debe ser una sugerencia para él/ella, no en primera persona.`;
        callGemini(prompt);
    }

    function getDinnerSuggestion() {
        const prompt = `Sugiere un menú temático friki para "Los Jueves Frikis" (plato principal y bebida). Sé muy directo: solo el nombre del tema, y luego los nombres de los platos con una descripción brevísima (máximo 10 palabras por plato).`;
        callGemini(prompt);
    }

    // --- Inicialización de la Aplicación ---
    drawRoulette();
    spinButton.addEventListener('click', spin);
});
