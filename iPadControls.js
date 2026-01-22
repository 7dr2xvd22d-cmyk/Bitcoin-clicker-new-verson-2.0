// Globale variabler for input
const input = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

// Funksjon for å koble opp knappene
function setupIPadControls() {
    const attach = (id, key) => {
        const el = document.getElementById(id);
        el.addEventListener('touchstart', (e) => { e.preventDefault(); input[key] = true; });
        el.addEventListener('touchend', (e) => { e.preventDefault(); input[key] = false; });
    };

    attach('gasBtn', 'forward');
    attach('revBtn', 'backward');
    attach('leftBtn', 'left');
    attach('rightBtn', 'right');
}
