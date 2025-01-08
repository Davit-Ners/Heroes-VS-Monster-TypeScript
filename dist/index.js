"use strict";
// Création des personnages du jeu
let compteurCoffres = 0;
let compteurPortes = 0;
let compteurMonstres = 0;
let compteurCraft = 0;
const tabCoffres = [];
const tabPortes = [];
const tabCraft = [];
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
class GameObject {
    _position;
    _img;
    _id;
    constructor(position, src, className, idPrefix, idCounter) {
        this._position = position;
        this._img = document.createElement('img');
        this._img.src = src;
        this._img.className = className;
        this._id = idCounter();
        this._img.id = `${idPrefix}${this._id}`;
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
}
class Chest extends GameObject {
    _contains;
    _opened;
    constructor(position) {
        super(position, '../img/coffre.png', 'chest', 'c', () => compteurCoffres++);
        this._contains = Math.ceil(Math.random() * 15);
        this._opened = false;
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
        this.img.remove();
    }
}
class Door extends GameObject {
    _opened;
    constructor(position) {
        super(position, '../img/porte.jpg', 'door', 'd', () => compteurPortes++);
        this._opened = false;
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
        this.img.remove();
    }
}
class CraftTable extends GameObject {
    _price;
    constructor(position) {
        super(position, '../img/craft.png', 'craft', 't', () => compteurCraft++);
        this._price = 3;
        tabCraft.push(this);
    }
    get price() {
        return this._price;
    }
    getAxe() {
        if (!kratos.hasAxe) {
            kratos.cuir -= 3;
            kratos.hasAxe = true;
        }
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
        personnage.pv -= degat;
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
    set or(value) {
        this._or = value;
    }
    set cuir(value) {
        this._cuir = value;
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
        if (Math.floor(Math.random() * 2) == 0) {
            this._cuir += chest.contains;
            console.log(`+${chest.contains}cuir`);
            chest.open();
        }
        else {
            this._or += chest.contains;
            console.log(`+${chest.contains}or`);
            chest.open();
        }
    }
}
class Human extends Hero {
    _hasAxe;
    constructor(src) {
        super(src);
        this._hasAxe = false;
    }
    get end() {
        return this._end + 1;
    }
    get force() {
        return this._force + 1;
    }
    get hasAxe() {
        return this._hasAxe;
    }
    set hasAxe(value) {
        this._hasAxe = value;
    }
    attaque(personnage) {
        const de = new De(4);
        const modifier = this.calculateModifier(this.force);
        const degat = de.lancer() + modifier;
        personnage.pv -= degat;
        if (this.hasAxe) {
            personnage.pv -= 3;
        }
        if (personnage.pv < 0)
            personnage.pv = 0;
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
        this._img.id = `m${this._id}`;
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
const tableCraft1 = new CraftTable([16, 22]);
const wolf = new Loup('../img/wolf.png', [18, 16]);
const wolf2 = new Loup('../img/wolf.png', [1, 22]);
const orc = new Orc('../img/orc.png', [24, 9]);
const orc2 = new Orc('../img/orc.png', [10, 9]);
const orc3 = new Orc('../img/orc.png', [3, 17]);
const dragon = new Dragonnet('../img/dragonet.png', [17, 24]);
const dragon2 = new Dragonnet('../img/dragonet.png', [17, 2]);
const dragon3 = new Dragonnet('../img/dragonet.png', [2, 2]);
let idAdversaireActuel = -1;
let idChestActuel = -1;
let idDoorActuel = -1;
let idCraftActuel = -1;
// Elements DOM
const inventaire = document.getElementById('inventaire');
const orJoueur = document.createElement('p');
const cuirJoueur = document.createElement('p');
const pvJoueur = document.getElementById('pv');
inventaire.append(orJoueur, cuirJoueur);
mettreAJoursInventaire();
const pvMonster = document.querySelector('.pvMonster');
const affichePvMonster = document.getElementById('pvMonster');
const progressHero = document.querySelector('.progressHero');
const progressMonster = document.querySelector('.progressMonster');
const indications = document.getElementById('indications');
let degatInt = -1;
let lettreAleatoire;
const heroZone = document.querySelector('.heroZone');
const monsterZone = document.querySelector('.monsterZone');
const combatZone = document.querySelector('.combat-zone');
const fightInstr = document.querySelector('#fightInstr');
const crossHero = document.getElementById('crossHero');
const crossMonster = document.getElementById('crossMonster');
// Fonctions du jeu
// Ceci est la fonction pour generer la carte du jeu en tableau de string
const map = [
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '-', '#', '#', '#', '#', '#'],
    ['#', '#', '.', '.', '.', '#', '-', '.', '.', '.', '-', '#', '.', '.', '.', '.', '.', '.', '#', '#', '-', '.', '.', '.', '-', '#', '#', '#'],
    ['#', '.', '.', 'F', 'F', '#', '-', '.', '#', '#', '-', '#', '#', '#', '#', '#', '.', '.', '#', '#', '-', '.', '.', '.', '-', '#', '#', '#'],
    ['#', '#', '.', '#', '#', '#', '-', '.', '#', '#', '-', '-', '-', '-', '-', '#', '.', '.', '.', '#', '-', '.', '.', '.', '-', '#', '#', '#'],
    ['-', '-', '-', 'F', 'F', '-', '-', '.', '.', '.', '.', '.', '.', '.', '-', '-', '-', '-', '-', '-', '-', '.', '.', '.', '-', '-', '-', '-'],
    ['-', '.', '.', 'F', 'F', 'F', 'F', 'F', 'F', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '.', '.', '.', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '#', '#', '#', '#', '#', '#', 'F', 'F', 'F', 'F', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '.', '.', '.', '.', '-', '-'],
    ['-', '.', '#', '#', '#', '#', '#', '#', 'F', 'F', 'F', 'F', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '.', '.', '.', '.', '-', '-'],
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
    ['-', '.', '.', '-', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '.', '.', '.', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '#', '#', '#', '#', '#', '#', 'F', 'F', 'F', 'F', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '.', '.', '.', '.', '-', '-'],
    ['-', '.', '#', '#', '#', '#', '#', '#', 'F', 'F', 'F', 'F', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '.', '.', '.', '.', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['#', '#', '#', '#', '#', '#', '-', '.', '.', '.', '-', '-', '-', '-', '-', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', '#', '#', '.', '.', '.', '-', '.', '#', '-', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', '#', '#', '.', '.', '.', '-', '.', '#', '-', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
];
// Fonction pour generer les object du jeu (portes, coffres, ...) et les faires apparaitre dans le DOM
function generateGameObjects() {
    const tabGameObject = [tabCoffres, tabPortes, tabCraft];
    for (const tab of tabGameObject) {
        for (const obj of tab) {
            document.getElementById(`${obj.position[0]}-${obj.position[1]}`).append(obj.img);
        }
    }
    for (const monster of tabMonstres) {
        document.getElementById(`${monster.position[0]}-${monster.position[1]}`).append(monster.img);
    }
}
// Fonction pour ajouter la carte au DOM
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
            else if (block == 'F') {
                carre.className = 'block feu';
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
    generateGameObjects();
}
// Fonction pour placer et ajouter le hero au DOM
function placerJoueur() {
    document.getElementById(`${positionJoueur[0]}-${positionJoueur[1]}`).append(kratos.img);
}
// Fonction pour detecter si les fleches sont pressés pour le deplacement
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
// Fonction pour checker qu'on ne depasse pas les limites de la map
function notOutOfMap(x, y) {
    return positionJoueur[0] + x >= 0 &&
        positionJoueur[0] + x <= 27 &&
        positionJoueur[1] + y >= 0 &&
        positionJoueur[1] + y <= 27;
}
// Fonction pour rajotuer des degats au hero si on va dans le feu
function degatsFeu() {
    if (map[positionJoueur[0]][positionJoueur[1]] == 'F') {
        if (degatInt == -1) {
            const degatSound = new Audio("../sounds/degat.mp3");
            const oofSound = new Audio("../sounds/oof.mp3");
            degatSound.play();
            kratos.pv -= 1;
            mettreAJoursInventaire();
            degatInt = setInterval(function () {
                degatSound.play();
                oofSound.play();
                kratos.pv -= 1;
                mettreAJoursInventaire();
                if (!kratos.isAlive) {
                    gameOver = true;
                }
            }, 1500);
        }
    }
    else {
        if (!(degatInt == -1)) {
            clearInterval(degatInt);
            degatInt = -1;
        }
    }
}
// Fonction pour checker si un entitée ou objet se trouve autour du joueur
function checkIfSomethingAround() {
    if (checkIfMonsterAround()) {
        window.removeEventListener('keydown', whichKey);
        combatV2(kratos, tabMonstres[idAdversaireActuel]);
    }
    else if (checkIfCoffre()) {
        indications.textContent = "Cliquez sur le coffre pour l'ouvrir";
        console.log("Cliquez sur le coffre pour l'ouvrir");
        tabCoffres[idChestActuel].img.addEventListener('click', openChest);
    }
    else if (checkIfDoor()) {
        indications.textContent = "Cout de la porte : 2or, cliquez sur la porte pour l'ouvrir";
        console.log("Cout de la porte : 2or, cliquez sur la porte pour l'ouvrir");
        const doorActuel = tabPortes[idDoorActuel];
        doorActuel.img.addEventListener('click', openDoor);
    }
    else if (checkIfCraftTable()) {
        indications.textContent = "3 or pour créer une hache, cliquez sur la table de craft pour l'acheter";
        console.log("3 or pour créer une hache, cliquez sur la table de craft pour l'acheter");
        const craftActuel = tabCraft[idCraftActuel];
        craftActuel.img.addEventListener('click', craftGun);
    }
}
// Fonction pour gerer le deplacement du joueur
function deplacer(x, y) {
    indications.textContent = "";
    tabPortes[idDoorActuel]?.img?.removeEventListener('click', openDoor);
    tabCoffres[idChestActuel]?.img?.removeEventListener('click', openChest);
    if (notOutOfMap(x, y) && map[positionJoueur[0] + x][positionJoueur[1] + y] != '#' && document.getElementById(`${positionJoueur[0] + x}-${positionJoueur[1] + y}`)?.childNodes.length == 0) {
        positionJoueur[0] += x;
        positionJoueur[1] += y;
        placerJoueur();
        degatsFeu();
    }
    checkIfSomethingAround();
}
// Fonction pour ouvrir une porte
function openDoor() {
    const doorToOpen = tabPortes[idDoorActuel];
    if (kratos.or >= 2) {
        const doorSound = new Audio("../sounds/doorOpen.mp3");
        doorSound.play();
        doorToOpen.open();
        kratos.or -= 2;
        indications.textContent = 'Ouverture de la porte. -2 or...';
        console.log('Ouverture de la porte. -2 or...');
        mettreAJoursInventaire();
    }
    else {
        indications.textContent = "Vous n'avez pas assez d'or...";
        mettreAJoursInventaire();
        console.log("Vous n'avez pas assez d'or...");
    }
    ;
}
// Fonction pour ouvrir un coffre
function openChest() {
    const chestSound = new Audio("../sounds/chestOpen.mp3");
    chestSound.play();
    kratos.openChest(tabCoffres[idChestActuel]);
    mettreAJoursInventaire();
}
// Fonction pour creer une arme
function craftGun() {
    if (kratos.cuir >= 3 && !kratos.hasAxe) {
        const craftingSound = new Audio("../sounds/crafting.mp3");
        craftingSound.play();
        tabCraft[idCraftActuel].getAxe();
        const hacheAffichage = document.createElement('img');
        hacheAffichage.src = '../img/axe.png';
        inventaire.append(hacheAffichage);
        indications.textContent = "Felicitation, vous avez fabriqué une hache! Elle vous apportera +3 en degats! Cela vous a couté 3 cuir.";
        console.log("Felicitation, vous avez fabriqué une hache! Elle vous apportera +3 en degats! Cela vous a couté 3 cuir.");
        mettreAJoursInventaire();
    }
}
// Fonction Promesse pour pouvoir creer un delay dans une fonction Async
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function resetDOM(hero, monstre) {
    pvMonster.style.visibility = 'hidden';
    combatZone.style.display = 'none';
    crossMonster.style.display = 'none';
    placerJoueur();
    monstre.img.remove();
    hero.repos();
    indications.textContent = "Vous avez vaincu le monstre !";
    window.addEventListener('keydown', whichKey);
    mettreAJoursInventaire();
    progressMonster.style.setProperty('--progressMonster', `100%`);
    progressHero.style.setProperty('--progressHero', `100%`);
}
//! Ancienne fonction de combat, basé sur du tour par tour sans interactivité avec le joueur
// async function combat(hero: Human, monstre: Monstre): Promise<void> {
//     pvMonster.style.visibility = 'visible';
//     affichePvMonster.textContent = `PV du monstre : ${monstre.pv} PV`;
//     indications.textContent = "Le combat entre vous et le monstre commence !";
//     console.log("Le combat entre vous et le monstre commence !");
//     const combatSound = new Audio("../sounds/fight.mp3");
//     combatSound.play();
//     await delay(1000);
//     const music = new Audio("../sounds/musicBattle.mp3");
//     music.loop = true;
//     music.play();
//     while (hero.isAlive && monstre.isAlive) {
//         const pvMonstre = monstre.pv;
//         hero.attaque(monstre);
//         const punchSound = new Audio("../sounds/punch.mp3");
//         punchSound.play();
//         if (!monstre.isAlive) {
//             indications.textContent = "Après cette attaque, vous avez vaincu le monstre !";
//             console.log("Après cette attaque, vous avez vaincu le monstre !");
//             kratos.loot(monstre);
//             const roarSound = new Audio("../sounds/monsterRoar.mp3");
//             roarSound.play(); 
//             monstre.img.remove();
//             hero.repos();
//             window.addEventListener('keydown', whichKey);
//             mettreAJoursInventaire()
//             setTimeout(function() {
//                 indications.textContent = "";
//             }, 1000);
//             break;
//         } else {
//             indications.textContent = `Vous avez infligé ${pvMonstre - monstre.pv} de dégat au monstre, il ne lui reste plus que ${monstre.pv} pv !`;
//             console.log(`Vous avez infligé ${pvMonstre - monstre.pv} de dégat au monstre, il ne lui reste plus que ${monstre.pv} pv !`);
//             affichePvMonster.textContent = `PV du monstre : ${monstre.pv} PV`;
//         }
//         await delay(1000);
//         if (monstre.isAlive) {
//             const pvHero = hero.pv;
//             monstre.attaque(hero);
//             mettreAJoursInventaire();
//             const swordSound = new Audio("../sounds/sword.mp3");
//             swordSound.play();
//             if (!hero.isAlive) {
//                 indications.textContent = "Après cette attaque du monstre, vous êtes mort !";
//                 console.log("Après cette attaque du monstre, vous êtes mort !");
//                 const looseSound = new Audio("../sounds/loose.mp3");
//                 looseSound.play();
//                 gameOver = true;
//                 break;
//             } else {
//                 indications.textContent = `Le monstre vous a infligé ${pvHero - hero.pv} de dégat, il ne vous reste plus que ${hero.pv} pv !`;
//                 console.log(`Le monstre vous a infligé ${pvHero - hero.pv} de dégat, il ne vous reste plus que ${hero.pv} pv !`);
//             }
//         }
//         await delay(1000);
//     }
//     music.pause();
//     music.currentTime = 0; // Réinitialiser à zéro
//     pvMonster.style.visibility = 'hidden';
// }
// Fonction pour checker si le hero ou le monstre est mort entre les attaques du combat
async function checkIfDead(hero, monstre) {
    if (!monstre.isAlive) {
        kratos.loot(monstre);
        const roarSound = new Audio("../sounds/monsterRoar.mp3");
        roarSound.play();
        crossMonster.style.display = 'block';
        await delay(2000);
        resetDOM(hero, monstre);
    }
    if (!hero.isAlive) {
        const looseSound = new Audio("../sounds/loose.mp3");
        looseSound.play();
        crossHero.style.display = 'block';
        indications.textContent = "Vous êtes mort. Le combat est terminé.";
    }
}
// Fonction pour gerer l'attaque du joueur ou du monstre dependant de si le joueur reussi le QTE
function attaqueCombat(result, hero, monstre) {
    if (result) {
        const punchSound = new Audio("../sounds/punch.mp3");
        punchSound.play();
        indications.textContent = "Bien joué ! Vous attaquez le monstre.";
        hero.attaque(monstre);
        progressMonster.style.setProperty('--progressMonster', `${pvIntoPercent(monstre)}%`);
        affichePvMonster.textContent = `PV du monstre : ${monstre.pv} PV`;
    }
    else {
        const swordSound = new Audio("../sounds/sword.mp3");
        swordSound.play();
        indications.textContent = "Vous avez raté ! Le monstre riposte.";
        monstre.attaque(hero);
        progressHero.style.setProperty('--progressHero', `${pvIntoPercent(hero)}%`);
    }
}
// Set up d'elements du DOM pour un combat
function setupCombat(monstre) {
    pvMonster.style.visibility = 'visible';
    affichePvMonster.textContent = `PV du monstre : ${monstre.pv} PV`;
    indications.textContent = "Le combat entre vous et le monstre commence !";
    console.log("Le combat entre vous et le monstre commence !");
    //? Ajout ici
    combatZone.style.display = 'block';
    heroZone.prepend(kratos.img);
    monsterZone.prepend(monstre.img);
    const combatSound = new Audio("../sounds/fight.mp3");
    combatSound.play();
}
function pvIntoPercent(personnage) {
    return (personnage.pv / personnage.maxPv) * 100;
}
//! Vrai fonction de combat basé sur un QTE pour le joueur
async function combatV2(hero, monstre) {
    setupCombat(monstre);
    await delay(1000);
    const music = new Audio("../sounds/musicBattle.mp3");
    music.loop = true;
    music.play();
    while (hero.isAlive && monstre.isAlive) {
        const alphabet = getAlphabet();
        const lettreAleatoire = toucheAleatoire(alphabet);
        //? Ajout ici
        fightInstr.textContent = `${lettreAleatoire}`;
        const result = await attendreToucheAvecTimeout(lettreAleatoire, 1000);
        attaqueCombat(result, hero, monstre);
        mettreAJoursInventaire();
        checkIfDead(hero, monstre);
    }
    music.pause();
    music.currentTime = 0;
}
// Fonction Promesse qui attend un temps imparti pour une entrée du joueur pour le QTE
function attendreToucheAvecTimeout(lettreCible, timeout) {
    return new Promise((resolve) => {
        let isResolved = false;
        function onKeyPress(e) {
            if (isResolved)
                return;
            if (e.key === lettreCible) {
                isResolved = true;
                document.removeEventListener('keydown', onKeyPress);
                resolve(true);
            }
        }
        document.addEventListener('keydown', onKeyPress);
        setTimeout(() => {
            if (!isResolved) {
                isResolved = true;
                document.removeEventListener('keydown', onKeyPress);
                resolve(false);
            }
        }, timeout);
    });
}
// Fonction pour checker si la bonne lettre est entrée par le joueur lors du QTE
function jeuTouche(e) {
    if (e.key == lettreAleatoire) {
        alert('OK');
    }
    alert('KO');
}
// Fonction qui va generer une lettre aléatoire pour le QTE lors d'un combat
function toucheAleatoire(touche) {
    const rand = Math.floor(Math.random() * 26);
    return touche[rand];
}
// Fonction pour generer un tableau avec les lettres de l'alphabet
function getAlphabet() {
    const alphabet = [];
    for (let i = 0; i < 26; i++) {
        alphabet.push(String.fromCharCode(97 + i));
    }
    return alphabet;
}
// Fonction generale pour voir si un object se trouve autour du joueur
function checkIfObjectAround(className, callback) {
    const voisins = [
        [0, 1], [1, 1], [1, 0], [0, -1],
        [-1, -1], [-1, 0], [1, -1], [-1, 1]
    ];
    for (const voisin of voisins) {
        const element = document.getElementById(`${positionJoueur[0] + voisin[0]}-${positionJoueur[1] + voisin[1]}`);
        if (element?.hasChildNodes()) {
            const img = element.firstChild;
            if (img.className === className) {
                callback(Number(img.id[1]));
                return true;
            }
        }
    }
    return false;
}
// Application de la fonctoin general a chaque object ou entité du jeu
function checkIfMonsterAround() {
    return checkIfObjectAround('monster', (id) => {
        idAdversaireActuel = id;
    });
}
function checkIfCoffre() {
    return checkIfObjectAround('chest', (id) => {
        idChestActuel = id;
    });
}
function checkIfDoor() {
    return checkIfObjectAround('door', (id) => {
        idDoorActuel = id;
    });
}
function checkIfCraftTable() {
    return checkIfObjectAround('craft', (id) => {
        idCraftActuel = id;
    });
}
// Fonction pour remmetre a jours l'affichage de l'inventaire du joueur et de ses PV entre chaque action pouvant les changer
function mettreAJoursInventaire() {
    orJoueur.textContent = `Or : ${kratos.or}`;
    cuirJoueur.textContent = `Cuir : ${kratos.cuir}`;
    pvJoueur.textContent = `PV : ${kratos.pv}`;
}
generateMap();
placerJoueur();
window.addEventListener('keydown', whichKey);
