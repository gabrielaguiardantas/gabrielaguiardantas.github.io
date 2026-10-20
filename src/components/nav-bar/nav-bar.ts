import type { MouseEvent } from "react";

// item clicado no nav: respeitado no fim da página, onde as últimas seções ficam visíveis juntas
let clickedId: string | null = null;
let lastScrollY = 0;

export function handleClick(event: MouseEvent) {
    const element = event.target as HTMLElement;
    clickedId = element.id;
    const navBar = document.querySelector('nav');
    const sections = navBar?.querySelectorAll('a');
    sections?.forEach(section => {
        if (section.id === element.id) {
            element.classList.add('active');
        }
        else {
            section.classList.remove('active');
        }
    });
}

export function handleScroll() {
    const navBar = document.querySelector('nav');
    const sections = navBar?.querySelectorAll('a');
    if (!sections?.length) return;
    // a seção ativa é a última cujo topo já passou de 30% da altura da tela
    const threshold = window.innerHeight * 0.3;
    let current = sections[0];
    sections.forEach(section => {
        const element = document.getElementById(section.id.slice(2));
        if (element && element.getBoundingClientRect().top <= threshold) {
            current = section;
        }
    });
    // rolar para cima descarta o clique; no fim da página vale o clique ou a última seção
    if (window.scrollY < lastScrollY) clickedId = null;
    lastScrollY = window.scrollY;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) {
        const clicked = clickedId ? document.getElementById(clickedId.slice(2)) : null;
        const clickedVisible = clicked && clicked.getBoundingClientRect().top >= 0;
        current = [...sections].find(section => clickedVisible && section.id === clickedId) ?? sections[sections.length - 1];
    }
    sections.forEach(section => section.classList.toggle('active', section === current));
}