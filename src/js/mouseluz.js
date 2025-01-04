// Seleciona o elemento da luz
const luzMouse = document.createElement("div");
luzMouse.className = "mouse-light";
document.body.appendChild(luzMouse);

let luzMouseVisivel = false;

// Define uma cor fixa para o efeito de luz
const corFixaLuz = "#4BA4F2"; // Cor fixa
luzMouse.style.background = `radial-gradient(circle, ${corFixaLuz} 0%, rgba(255,255,255,0) 70%)`;

document.addEventListener("mousemove", (evento) => {
  if (!luzMouseVisivel) {
    luzMouse.style.opacity = "0.1";
    luzMouseVisivel = true;
  }

  // Centraliza a luz no cursor
  gsap.to(luzMouse, {
    duration: 0.2,
    left: evento.clientX - luzMouse.offsetWidth / 2,
    top: evento.clientY - luzMouse.offsetHeight / 2,
    ease: "power2.out",
  });
});

// Oculta a luz ao sair da janela
document.addEventListener("mouseleave", () => {
  luzMouse.style.opacity = "0";
  luzMouseVisivel = false;
});
