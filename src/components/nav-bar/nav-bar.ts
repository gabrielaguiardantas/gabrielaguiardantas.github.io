import { MouseEvent } from "react";

export function handleClick(event: MouseEvent) {
    const element = event.target as HTMLElement;
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
    const scrollPosition = window.scrollY;
    const navBar = document.querySelector('nav');
    const sections = navBar?.querySelectorAll('a');
    sections?.forEach(section => {
        const element = document.getElementById(section.id.slice(2)) as HTMLElement;
        const elementPosition = element.offsetTop - 150;
        if (scrollPosition >= elementPosition) {
            section.previousElementSibling?.classList.remove('active');
            section.classList.add('active');
        }
        else {
            section.classList.remove('active');
        }
        if (document.documentElement.offsetHeight + document.documentElement.scrollTop - 950 >= document.documentElement.scrollHeight) {
            section.classList.remove('active');
            sections[sections.length - 1].classList.add('active');
        }
    });
}