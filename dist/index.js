"use strict";
// Création des personnages du jeu
let compteurCoffres = 0;
let compteurPortes = 0;
let compteurMonstres = 0;
const tabCoffres = [];
const tabPortes = [];
const tabMonstres = [];
let gameOver = false;
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
class Chest {
    _contains;
    _opened;
    _position;
    _img;
    _id;
    constructor(position) {
        this._contains = Math.ceil(Math.random() * 15);
        this._opened = false;
        this._position = position;
        this._img = document.createElement('img');
        this._img.src = '../img/coffre.png';
        this._img.className = 'chest';
        this._id = compteurCoffres;
        compteurCoffres++;
        this._img.id = `c${this._id}`;
        tabCoffres.push(this);
    }
    get contains() {
        return this._contains;
    }
    get opened() {
        return this._opened;
    }
    get position() {
        return this._position;
    }
    get img() {
        return this._img;
    }
    get id() {
        return this._id;
    }
    open() {
        this._contains = 0;
        this._opened = true;
    }
}
class Door {
    _opened;
    _position;
    _img;
    _id;
    constructor(position) {
        this._opened = false;
        this._position = position;
        this._img = document.createElement('img');
        this._img.src = '../img/porte.jpg';
        this._img.className = 'door';
        this._id = compteurPortes;
        compteurPortes++;
        this._img.id = `d${this._id}`;
        tabPortes.push(this);
    }
    get opened() {
        return this._opened;
    }
    get position() {
        return this._position;
    }
    get img() {
        return this._img;
    }
    get id() {
        return this._id;
    }
    open() {
        this._opened = true;
    }
}
class Personnage {
    _end;
    _force;
    _pv;
    _img;
    constructor(src) {
        this._end = this.calculerStates();
        this._force = this.calculerStates();
        const modifier = this.calculateModifier(this._end);
        this._pv = this._end + modifier;
        this._img = document.createElement('img');
        this._img.src = src;
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
    get img() {
        return this._img;
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
    constructor(src) {
        super(src);
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
    openChest(chest) {
        if (Math.floor(Math.random()) == 0) {
            this._cuir += chest.contains;
            chest.open();
        }
        else {
            this._or += chest.contains;
            chest.open();
        }
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
    _position;
    _id;
    constructor(src, position) {
        super(src);
        this._id = compteurMonstres;
        compteurMonstres++;
        this._or = 0;
        this._cuir = 0;
        this._position = position;
        this._img.className = 'monster';
        this._img.id = `${this._id}`;
        tabMonstres.push(this);
    }
    get or() {
        return this._or;
    }
    get cuir() {
        return this._cuir;
    }
    get position() {
        return this._position;
    }
    ajouter() {
        document.getElementById(`${this.position[0]}-${this.position[1]}`).append(this.img);
    }
}
class Loup extends Monstre {
    constructor(src, position) {
        super(src, position);
        this._cuir = 1;
    }
}
class Orc extends Monstre {
    constructor(src, position) {
        super(src, position);
        this._or = 1;
    }
    get force() {
        return this._force + 1;
    }
}
class Dragonnet extends Monstre {
    constructor(src, position) {
        super(src, position);
        this._or = 1;
        this._cuir = 1;
    }
    get end() {
        return this._end + 1;
    }
}
// Recuperation elements DOM
const divMap = document.querySelector('.map');
// Const et Let
let positionJoueur = [27, 6];
const kratos = new Human('../img/kratos.png');
const coffre1 = new Chest([27, 9]);
const coffre2 = new Chest([15, 25]);
const coffre3 = new Chest([17, 1]);
const coffre4 = new Chest([2, 1]);
const coffre5 = new Chest([16, 12]);
const door1 = new Door([18, 4]);
const door2 = new Door([16, 24]);
const door3 = new Door([11, 9]);
const door4 = new Door([0, 22]);
const door5 = new Door([3, 2]);
const wolf = new Loup('../img/wolf.png', [18, 16]);
const orc = new Orc('../img/orc.png', [23, 9]);
const dragon = new Dragonnet('../img/dragonet.png', [17, 24]);
let idAdversaireActuel = -1;
// Fonctions du jeu
const map = [
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '-', '#', '#', '#', '#', '#'],
    ['#', '#', '.', '.', '.', '#', '-', '.', '.', '.', '-', '#', '.', '.', '.', '.', '.', '.', '#', '#', '-', '.', '.', '.', '-', '#', '#', '#'],
    ['#', '.', '.', '~', '~', '#', '-', '.', '#', '#', '-', '#', '#', '#', '#', '#', '.', '.', '#', '#', '-', '.', '.', '.', '-', '#', '#', '#'],
    ['#', '#', '.', '#', '#', '#', '-', '.', '#', '#', '-', '-', '-', '-', '-', '#', '.', '.', '.', '#', '-', '.', '.', '.', '-', '#', '#', '#'],
    ['-', '-', '-', '~', '~', '-', '-', '.', '.', '.', '.', '.', '.', '.', '-', '-', '-', '-', '-', '-', '-', '.', '.', '.', '-', '-', '-', '-'],
    ['-', '.', '.', '~', '~', '~', '~', '~', '~', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '.', '.', '.', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '#', '#', '#', '#', '#', '#', '~', '~', '~', '~', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '.', '.', '.', '.', '-', '-'],
    ['-', '.', '#', '#', '#', '#', '#', '#', '~', '~', '~', '~', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '.', '.', '.', '.', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '.', '-', '-', '-', '-', '-', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', '#', '#', '.', '.', '.', '-', '.', '#', '-', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', '#', '#', '.', '.', '.', '-', '.', '#', '-', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', '#', '#', '.', '.', '.', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '#', '#', '#', '#'],
    ['#', '#', '#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#', '#', '#', '#'],
    ['#', '#', '#', '#', '#', '#', '#', '-', '-', '-', '-', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '-', '-', '#', '#'],
    ['#', '#', '.', '.', '.', '.', '-', '.', '.', '.', '-', '#', '.', '.', '.', '.', '.', '#', '#', '#', '-', '.', '.', '#', '-', '#', '#', '#'],
    ['#', '.', '.', '-', '-', '.', '-', '.', '#', '#', '#', '#', '#', '#', '#', '#', '.', '#', '#', '#', '-', '.', '#', '#', '-', '#', '#', '#'],
    ['#', '#', '#', '#', '-', '#', '#', '#', '#', '#', '-', '-', '-', '-', '-', '#', '.', '#', '#', '#', '-', '.', '.', '.', '-', '#', '#', '#'],
    ['-', '-', '-', '-', '-', '-', '-', '.', '.', '.', '.', '.', '.', '.', '-', '-', '-', '-', '-', '-', '-', '.', '.', '.', '-', '-', '-', '-'],
    ['-', '.', '.', '-', '-', '~', '~', '~', '~', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
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
    for (const coffre of tabCoffres) {
        document.getElementById(`${coffre.position[0]}-${coffre.position[1]}`).append(coffre.img);
    }
    for (const door of tabPortes) {
        document.getElementById(`${door.position[0]}-${door.position[1]}`).append(door.img);
    }
    for (const monster of tabMonstres) {
        document.getElementById(`${monster.position[0]}-${monster.position[1]}`).append(monster.img);
    }
}
function placerJoueur() {
    document.getElementById(`${positionJoueur[0]}-${positionJoueur[1]}`).append(kratos.img);
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
    if (notOutOfMap(x, y) && map[positionJoueur[0] + x][positionJoueur[1] + y] != '#' && document.getElementById(`${positionJoueur[0] + x}-${positionJoueur[1] + y}`)?.childNodes.length == 0) {
        positionJoueur[0] += x;
        positionJoueur[1] += y;
        placerJoueur();
    }
    if (checkIfMonsterAround()) {
        combat(kratos, tabMonstres[idAdversaireActuel]);
    }
}
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function combat(hero, monstre) {
    console.log("Le combat entre vous et le monstre commence !");
    while (hero.isAlive && monstre.isAlive) {
        const pvMonstre = monstre.pv;
        hero.attaque(monstre);
        if (!monstre.isAlive) {
            console.log("Après cette attaque, vous avez vaincu le monstre !");
            monstre.img.remove();
            hero.repos();
            break;
        }
        else {
            console.log(`Vous avez infligé ${pvMonstre - monstre.pv} de dégat au monstre, il ne lui reste plus que ${monstre.pv} pv !`);
        }
        await delay(1000);
        if (monstre.isAlive) {
            const pvHero = hero.pv;
            monstre.attaque(hero);
            if (!hero.isAlive) {
                console.log("Après cette attaque du monstre, vous êtes mort !");
                gameOver = true;
                break;
            }
            else {
                console.log(`Le monstre vous a infligé ${pvHero - hero.pv} de dégat, il ne vous reste plus que ${hero.pv} pv !`);
            }
        }
        await delay(1000);
    }
}
function checkIfMonsterAround() {
    const voisins = [[0, 1], [1, 1], [1, 0], [0, -1], [-1, -1], [-1, 0], [1, -1], [-1, 1]];
    for (const voisin of voisins) {
        if (document.getElementById(`${positionJoueur[0] + voisin[0]}-${positionJoueur[1] + voisin[1]}`)?.hasChildNodes()) {
            const img = document.getElementById(`${positionJoueur[0] + voisin[0]}-${positionJoueur[1] + voisin[1]}`)?.firstChild;
            if (img.className == 'monster') {
                idAdversaireActuel = Number(img.id);
                return true;
            }
        }
    }
    return false;
}
generateMap();
placerJoueur();
window.addEventListener('keydown', whichKey);
