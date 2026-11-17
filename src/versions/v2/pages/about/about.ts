const main = document.querySelector('.main');

const mainScrolling = (event: Event) => {
    const { scrollTop, scrollHeight, clientHeight } = (event.target as Document["documentElement"]);
    if (scrollTop + clientHeight >= scrollHeight) {
        console.log('bottom');
    }
}

main?.addEventListener('scroll', mainScrolling);
