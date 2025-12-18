let fechaAlarma = null;
let horaAlarma = null;
const sonido = document.getElementById('alarma-audio');

// Permiso de notificaciones
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

function actualizarReloj() {
    const ahora = new Date();

    // 1. Mover manecillas
    const seg = ahora.getSeconds();
    const min = ahora.getMinutes();
    const hr = ahora.getHours();

    document.getElementById('sc').style.transform = `translateX(-50%) rotate(${seg * 6}deg)`;
    document.getElementById('mn').style.transform = `translateX(-50%) rotate(${min * 6}deg)`;
    document.getElementById('hr').style.transform = `translateX(-50%) rotate(${(hr % 12) * 30 + min * 0.5}deg)`;

    // 2. Reloj Digital
    document.getElementById('reloj-digital').innerText = ahora.toLocaleTimeString();

    // 3. Lógica de Alarma (Fecha + Hora)
    const fechaActual = ahora.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const horaActual = `${hr.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

    if (fechaAlarma === fechaActual && horaAlarma === horaActual && seg === 0) {
        dispararAlarma();
    }
}

function setAlarma() {
    fechaAlarma = document.getElementById('input-fecha').value;
    horaAlarma = document.getElementById('input-alarma').value;

    if (!fechaAlarma || !horaAlarma) {
        alert("Por favor selecciona fecha y hora");
        return;
    }

    document.getElementById('status').innerText = `🔔 Programada para: ${fechaAlarma} a las ${horaAlarma}`;
    document.getElementById('status').style.color = "#2980b9";
}

function dispararAlarma() {
    sonido.play().catch(e => console.log("Esperando interacción para sonar"));
    sonido.loop = true;

    document.querySelector('.reloj-circular').classList.add('alarma-activa');

    if (Notification.permission === "granted") {
        new Notification("🚨 ¡ALARMA!", {
            body: "Es el momento que programaste en tu calendario.",
            icon: "https://cdn-icons-png.flaticon.com/512/1827/1827312.png"
        });
    }

    const btn = document.getElementById('btn-alarma');
    btn.innerText = "DETENER";
    btn.style.backgroundColor = "#ff4757";
    btn.onclick = detenerAlarma;
}

function detenerAlarma() {
    sonido.pause();
    sonido.currentTime = 0;

    document.querySelector('.reloj-circular').classList.remove('alarma-activa');

    const btn = document.getElementById('btn-alarma');
    btn.innerText = "Activar Alarma";
    btn.style.backgroundColor = "#333";
    btn.onclick = setAlarma;

    document.getElementById('status').innerText = "Alarma terminada";
    fechaAlarma = null;
    horaAlarma = null;
}

// Ejecutar reloj
setInterval(actualizarReloj, 1000);

// Poner la fecha de hoy por defecto en el calendario
document.getElementById('input-fecha').valueAsDate = new Date();