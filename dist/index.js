"use strict";
// Création des personnages du jeu
class De {
    _nbFaces;
    constructor(nbFaces) {
        this._nbFaces = nbFaces;
    }
    get nbFaces() {
        return this._nbFaces;
    }
    lancer() {
        return Math.ceil(Math.random() * this._nbFaces);
    }
}
class Personnage {
    _end;
    _force;
    _pv;
    constructor() {
        this._end = this.calculerStates();
        this._force = this.calculerStates();
        const modifier = this.calculateModifier(this._end);
        this._pv = this._end + modifier;
    }
    // Getters
    get end() {
        return this._end;
    }
    get force() {
        return this._force;
    }
    get pv() {
        return this._pv;
    }
    get maxPv() {
        return this.calculateModifier(this._end) + this._end;
    }
    get isAlive() {
        return this._pv > 0;
    }
    // Setters
    set pv(value) {
        this._pv = value;
    }
    attaque(personnage) {
        const de = new De(4);
        const modifier = this.calculateModifier(this.force);
        const degat = de.lancer() + modifier;
        personnage._pv -= degat;
        if (personnage.pv < 0)
            personnage.pv = 0;
    }
    calculerStates() {
        let tabRand = [];
        const de = new De(6);
        for (let i = 0; i < 4; i++) {
            const ran = de.lancer();
            tabRand.push(ran);
        }
        tabRand = tabRand.sort((a, b) => b - a);
        return tabRand[0] + tabRand[1] + tabRand[2];
    }
    calculateModifier(stat) {
        if (stat < 5)
            return -1;
        if (stat < 10)
            return 0;
        if (stat < 15)
            return 1;
        return 2;
    }
}
class Hero extends Personnage {
    _or;
    _cuir;
    constructor() {
        super();
        this._or = 0;
        this._cuir = 0;
    }
    get or() {
        return this._or;
    }
    get cuir() {
        return this._cuir;
    }
    loot(monstre) {
        if (monstre.or)
            this._or += monstre.or;
        if (monstre.cuir)
            this._cuir += monstre.cuir;
    }
    repos() {
        this.pv = this.maxPv;
    }
}
class Human extends Hero {
    get end() {
        return this._end + 1;
    }
    get force() {
        return this._force + 1;
    }
}
class Nain extends Hero {
    get end() {
        return this._end + 2;
    }
}
class Monstre extends Personnage {
    _or;
    _cuir;
    constructor() {
        super();
        this._or = 0;
        this._cuir = 0;
    }
    get or() {
        return this._or;
    }
    get cuir() {
        return this._cuir;
    }
}
class Loup extends Monstre {
    constructor() {
        super();
        this._cuir = 1;
    }
}
class Orc extends Monstre {
    constructor() {
        super();
        this._or = 1;
    }
    get force() {
        return this._force + 1;
    }
}
class Dragonnet extends Monstre {
    constructor() {
        super();
        this._or = 1;
        this._cuir = 1;
    }
    get end() {
        return this._end + 1;
    }
}
const hu = new Human();
const loup = new Loup();
// Recuperation elements DOM
const divMap = document.querySelector('.map');
// Const et Let
let positionJoueur = [27, 6];
const kratos = document.createElement('img');
kratos.src = '../img/kratos.png';
const wolf = document.createElement('img');
wolf.src = '../img/wolf.png';
// Fonctions du jeu
const map = [
    ['#', '#', '#', '#', '#', '#', '-', '-', '-', '-', '-', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '-', '-', '-', '-', '#', '#', '#'],
    ['#', '#', '.', '.', '.', '#', '-', '.', '.', '.', '-', '#', '.', '.', '.', '.', '.', '.', '#', '#', '-', '.', '.', '.', '-', '#', '#', '#'],
    ['#', '.', '.', '~', '~', '#', '-', '.', '#', '#', '-', '#', '#', '#', '#', '#', '.', '.', '#', '#', '-', '.', '#', '#', '-', '#', '#', '#'],
    ['#', '#', '.', '~', '~', '#', '-', '.', '#', '#', '-', '-', '-', '-', '-', '#', '.', '.', '.', '#', '-', '.', '.', '.', '-', '#', '#', '#'],
    ['-', '-', '-', '~', '~', '-', '-', '.', '.', '.', '.', '.', '.', '.', '-', '-', '-', '-', '-', '-', '-', '.', '.', '.', '-', '-', '-', '-'],
    ['-', '.', '.', '~', '~', '~', '~', '~', '~', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '.', '.', '.', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '#', '#', '#', '#', '#', '#', '~', '~', '~', '~', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '.', '.', '.', '.', '-', '-'],
    ['-', '.', '#', '#', '#', '#', '#', '#', '~', '~', '~', '~', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '.', '.', '.', '.', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['#', '#', '#', '#', '#', '#', '-', '.', '.', '.', '-', '-', '-', '-', '-', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', '#', '#', '.', '.', '.', '-', '.', '#', '-', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', '#', '#', '.', '.', '.', '-', '.', '#', '-', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', '#', '#', '.', '.', '.', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '#', '#', '#'],
    ['#', '#', '#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#', '#', '#'],
    ['#', '#', '#', '#', '#', '#', '#', '-', '-', '-', '-', '-', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '-', '-', '-', '-', '#', '#'],
    ['#', '#', '.', '.', '.', '.', '-', '.', '.', '.', '-', '#', '.', '.', '.', '.', '.', '.', '#', '#', '-', '.', '.', '.', '-', '#', '#', '#'],
    ['#', '.', '.', '~', '~', '.', '-', '.', '#', '#', '-', '#', '#', '#', '#', '#', '.', '.', '#', '#', '-', '.', '#', '#', '-', '#', '#', '#'],
    ['#', '#', '.', '~', '~', '.', '-', '.', '#', '#', '-', '-', '-', '-', '-', '#', '.', '.', '.', '#', '-', '.', '.', '.', '-', '#', '#', '#'],
    ['-', '-', '-', '~', '~', '-', '-', '.', '.', '.', '.', '.', '.', '.', '-', '-', '-', '-', '-', '-', '-', '.', '.', '.', '-', '-', '-', '-'],
    ['-', '.', '.', '~', '~', '~', '~', '~', '~', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '.', '.', '.', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '#', '#', '#', '#', '#', '#', '~', '~', '~', '~', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '.', '.', '.', '.', '-', '-'],
    ['-', '.', '#', '#', '#', '#', '#', '#', '~', '~', '~', '~', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '.', '.', '.', '.', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['#', '#', '#', '#', '#', '#', '-', '.', '.', '.', '-', '-', '-', '-', '-', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', '#', '#', '.', '.', '.', '-', '.', '#', '-', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', '#', '#', '.', '.', '.', '-', '.', '#', '-', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
];
function generateMap() {
    let i = 0;
    let j = 0;
    for (const ligne of map) {
        const row = document.createElement('div');
        row.className = 'row';
        for (const block of ligne) {
            const carre = document.createElement('div');
            carre.setAttribute('id', `${i}-${j}`);
            if (block == '#') {
                carre.className = 'block arbre';
            }
            else if (block == '~') {
                carre.className = 'block feuillage';
            }
            else if (block == '-') {
                carre.className = 'block route';
            }
            else {
                carre.className = 'block sol';
            }
            row.append(carre);
            j++;
        }
        divMap.append(row);
        i++;
        j = 0;
    }
}
function placerJoueur() {
    document.getElementById(`${positionJoueur[0]}-${positionJoueur[1]}`).append(kratos);
}
function whichKey(event) {
    event.preventDefault();
    if (event.key === "ArrowUp") {
        deplacer(-1, 0);
    }
    else if (event.key === "ArrowDown") {
        deplacer(1, 0);
    }
    else if (event.key === "ArrowLeft") {
        deplacer(0, -1);
    }
    else if (event.key === "ArrowRight") {
        deplacer(0, 1);
    }
}
function notOutOfMap(x, y) {
    return positionJoueur[0] + x >= 0 &&
        positionJoueur[0] + x <= 27 &&
        positionJoueur[1] + y >= 0 &&
        positionJoueur[1] + y <= 27;
}
function deplacer(x, y) {
    if (notOutOfMap(x, y) && map[positionJoueur[0] + x][positionJoueur[1] + y] != '#') {
        positionJoueur[0] += x;
        positionJoueur[1] += y;
        placerJoueur();
    }
}
generateMap();
placerJoueur();
window.addEventListener('keydown', whichKey);
