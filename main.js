// Usamos DOMContentLoaded para asegurarnos de que el HTML está completamente cargado
// antes de intentar manipularlo con JavaScript.
document.addEventListener('DOMContentLoaded', () => {

    // --- Selección de Elementos del DOM ---
    const canvas = document.getElementById('roulette-wheel');
    const ctx = canvas.getContext('2d');
    const spinButton = document.getElementById('spin-button');
    const resultDiv = document.getElementById('result');

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
    }

    // --- Inicialización ---
    drawRoulette();
    spinButton.addEventListener('click', spin);

});
