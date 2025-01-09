// Création des personnages du jeu

let compteurCoffres: number = 0;
let compteurPortes: number = 0;
let compteurMonstres: number = 0;
let compteurCraft: number = 0;
const tabCoffres: Chest[] = [];
const tabPortes: Door[] = [];
const tabCraft: CraftTable[] = [];
const tabMonstres: Monstre[] = [];
let gameOver: boolean = false;


class De {

    private _nbFaces: number;

    constructor(nbFaces: number) {
        this._nbFaces = nbFaces;
    }

    
    public get nbFaces() : number {
        return this._nbFaces;
    }
    
    public lancer(): number {
        return Math.ceil(Math.random() * this._nbFaces);
    }

}

class GameObject {
    protected _position: number[];
    protected _img: HTMLImageElement;
    protected _id: number;

    constructor(position: number[], src: string, className: string, idPrefix: string, idCounter: () => number) {
        this._position = position;
        this._img = document.createElement('img');
        this._img.src = src;
        this._img.className = className;
        this._id = idCounter();
        this._img.id = `${idPrefix}${this._id}`;
    }

    public get position(): number[] {
        return this._position;
    }

    public get img(): HTMLImageElement {
        return this._img;
    }

    public get id(): number {
        return this._id;
    }
}

class Chest extends GameObject {

    private _contains: number;
    private _opened: boolean;

    constructor(position: number[]) {
        super(position, '../img/coffre.png', 'chest', 'c', () => compteurCoffres++);
        this._contains = Math.ceil(Math.random() * 15);
        this._opened = false;
        tabCoffres.push(this);
    }

    public get contains(): number {
        return this._contains;
    }

    public get opened(): boolean {
        return this._opened;
    }

    public get position(): number[] {
        return this._position;
    }

    public get img(): HTMLImageElement {
        return this._img;
    }

    public get id(): number {
        return this._id;
    }

    public open(): void {
        this._contains = 0;
        this._opened = true;
        this.img.remove();
    }

}

class Door extends GameObject {

    private _opened: boolean;

    constructor(position: number[]) {
        super(position, '../img/porte.jpg', 'door', 'd', () => compteurPortes++);
        this._opened = false;
        tabPortes.push(this);
    }

    public get opened(): boolean {
        return this._opened;
    }

    public get position(): number[] {
        return this._position;
    }

    public get img(): HTMLImageElement {
        return this._img;
    }

    public get id(): number {
        return this._id;
    }

    public open(): void {
        this._opened = true;
        this.img.remove();
    }

}

class CraftTable extends GameObject {
    private _price: number
    
    constructor(position: number[]) {
        super(position, '../img/craft.png', 'craft', 't', () => compteurCraft++);
        this._price = 3;

        tabCraft.push(this);
    }

    public get price(): number {
        return this._price;
    }

    public getAxe(): void {
        if (!kratos.hasAxe) {
            kratos.cuir -= 3;
            kratos.hasAxe = true;
        }
    }
}

class Personnage {

    protected _end: number;
    protected _force: number;
    protected _pv: number;
    protected _img: HTMLImageElement;

    constructor(src: string) {

        this._end = this.calculerStates();

        this._force = this.calculerStates();

        const modifier: number = this.calculateModifier(this._end);
        this._pv = this._end + modifier;

        this._img = document.createElement('img');
        this._img.src = src;

    }

    // Getters
    
    public get end(): number {
        return this._end;
    }

    public get force(): number {
        return this._force;
    }   

    public get pv(): number {
        return this._pv;
    }

    public get img(): HTMLImageElement {
        return this._img;
    }

    public get maxPv(): number {
        return this.calculateModifier(this._end) + this._end;
    }

    public get isAlive(): boolean {
        return this._pv > 0;
    }

    // Setters

    public set pv(value: number) {
        this._pv = value;
    }
    
    
    public attaque(personnage: Personnage) {
        const de: De = new De(4);
        const modifier: number = this.calculateModifier(this.force);
        const degat = de.lancer() + modifier;

        personnage.pv -= degat;
        if (personnage.pv < 0) personnage.pv = 0;
    }

    protected calculerStates(): number {

        let tabRand: number[] = [];
        const de: De = new De(6);

        for (let i = 0; i < 4; i++) {
            const ran: number = de.lancer();
            tabRand.push(ran);
        }

        tabRand = tabRand.sort((a, b) => b - a);

        return tabRand[0] + tabRand[1] + tabRand[2];

    }

    protected calculateModifier(stat: number): number {
        if (stat < 5) return -1;
        if (stat < 10) return 0;
        if (stat < 15) return 1;
        return 2;
    }

}

class Hero extends Personnage {

    private _or: number;
    private _cuir: number;

    constructor(src: string) {
        super(src);
        this._or = 0;
        this._cuir = 0;
    }

    public get or(): number {
        return this._or;
    }

    public get cuir(): number {
        return this._cuir;
    }

    public set or(value: number) {
        this._or = value;
    }

    public set cuir(value: number) {
        this._cuir = value;
    }

    public loot(monstre: Monstre): void {
        if (monstre.or) this._or += monstre.or;
        if (monstre.cuir) this._cuir += monstre.cuir;
    }

    public repos(): void {
        this.pv = this.maxPv;
    }

    public openChest(chest: Chest) {
        if (Math.floor(Math.random()*2) == 0) {
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
    private _hasAxe: boolean;

    constructor(src: string) {
        super(src);
        this._hasAxe = false;
    }

    get end(): number {
        return this._end + 1;
    }

    get force(): number {
        return this._force + 1;
    }

    get hasAxe(): boolean {
        return this._hasAxe;
    }

    set hasAxe(value: boolean) {
        this._hasAxe = value;
    }

    public attaque(personnage: Personnage) {
        const de: De = new De(4);
        const modifier: number = this.calculateModifier(this.force);
        const degat = de.lancer() + modifier;

        personnage.pv -= degat;
        if (this.hasAxe) {
            personnage.pv -= 3;
        }
        if (personnage.pv < 0) personnage.pv = 0;
    }
}

class Nain extends Hero {
    get end(): number {
        return this._end + 2;
    }
}

class Monstre extends Personnage {

    protected _or: number;
    protected _cuir: number;
    protected _position: number[];
    protected _id: number;

    constructor(src: string, position: number[]) {
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

    public get or(): number {
        return this._or;
    }

    public get cuir(): number {
        return this._cuir;
    }

    public get position(): number[] {
        return this._position;
    }

    protected ajouter(): void {
        document.getElementById(`${this.position[0]}-${this.position[1]}`)!.append(this.img);
    }

}

class Loup extends Monstre {

    constructor(src: string, position: number[]) {
        super(src, position);
        this._cuir = 1;
    }

}

class Orc extends Monstre {

    constructor(src: string, position: number[]) {
        super(src, position);
        this._or = 1;
    }

    get force(): number {
        return this._force + 1;
    }

}

class Dragonnet extends Monstre {

    constructor(src: string, position: number[]) {
        super(src, position);
        this._or = 1;
        this._cuir = 1;
    }

    get end(): number {
        return this._end + 1;
    }

}

// Recuperation elements DOM
const divMap: HTMLDivElement = document.querySelector('.map') as HTMLDivElement;

// Const et Let
let positionJoueur = [27, 6];
const kratos: Human = new Human('../img/kratos.png');

const coffre1: Chest = new Chest([27, 9]);
const coffre2: Chest = new Chest([15, 25]);
const coffre3: Chest = new Chest([17, 1]);
const coffre4: Chest = new Chest([2, 1]);
const coffre5: Chest = new Chest([16, 12]);

const door1: Door = new Door([18, 4]);
const door2: Door = new Door([16, 24]);
const door3: Door = new Door([11, 9]);
const door4: Door = new Door([0, 22]);
const door5: Door = new Door([3, 2]);

const tableCraft1: CraftTable = new CraftTable([16, 22]);

const wolf: Loup = new Loup('../img/wolf.png', [18, 16]);
const wolf2: Loup = new Loup('../img/wolf.png', [1, 22]);
const orc: Orc = new Orc('../img/orc.png', [24, 9]);
const orc2: Orc = new Orc('../img/orc.png', [10, 9]);
const orc3: Orc = new Orc('../img/orc.png', [3, 17]);
const dragon: Dragonnet = new Dragonnet('../img/dragonet.png', [17, 24]);
const dragon2: Dragonnet = new Dragonnet('../img/dragonet.png', [17, 2]);
const dragon3: Dragonnet = new Dragonnet('../img/dragonet.png', [2, 2]);

let idAdversaireActuel: number = -1;
let idChestActuel: number = -1;
let idDoorActuel: number = -1;
let idCraftActuel: number = -1;

// Elements DOM
const inventaire: HTMLDivElement = document.getElementById('inventaire') as HTMLDivElement;
const orJoueur: HTMLParagraphElement = document.createElement('p') as HTMLParagraphElement;
const cuirJoueur: HTMLParagraphElement = document.createElement('p') as HTMLParagraphElement;
const pvJoueur: HTMLParagraphElement = document.getElementById('pv') as HTMLParagraphElement;
inventaire.append(orJoueur, cuirJoueur);
mettreAJoursInventaire();

const pvMonster: HTMLDivElement = document.querySelector('.pvMonster') as HTMLDivElement;
const affichePvMonster: HTMLParagraphElement = document.getElementById('pvMonster') as HTMLParagraphElement;
const progressHero: HTMLDivElement = document.querySelector('.progressHero') as HTMLDivElement;
const progressMonster: HTMLDivElement = document.querySelector('.progressMonster') as HTMLDivElement;

const indications: HTMLParagraphElement = document.getElementById('indications') as HTMLParagraphElement;
let degatInt: number = -1;
let lettreAleatoire: string;

const heroZone: HTMLDivElement = document.querySelector('.heroZone') as HTMLDivElement;
const monsterZone: HTMLDivElement = document.querySelector('.monsterZone') as HTMLDivElement;
const combatZone: HTMLDivElement = document.querySelector('.combat-zone') as HTMLDivElement;
const fightInstr: HTMLParagraphElement = document.querySelector('#fightInstr') as HTMLParagraphElement;
const crossHero: HTMLImageElement = document.getElementById('crossHero') as HTMLImageElement;
const crossMonster: HTMLImageElement = document.getElementById('crossMonster') as HTMLImageElement;

const introDiv: HTMLDivElement = document.querySelector('.intro') as HTMLDivElement;
const skipIntroBtn: HTMLButtonElement = document.getElementById('skipIntroBtn') as HTMLButtonElement;

const timerFight: HTMLDivElement = document.querySelector('.timerFight') as HTMLDivElement;
const timerFightProgress: HTMLDivElement = timerFight.firstElementChild as HTMLDivElement;

const closeCraft: HTMLDivElement = document.getElementById('closeCraft') as HTMLDivElement;
const buyAxe: HTMLButtonElement = document.getElementById('buyAxe') as HTMLButtonElement;
const modaleCraft: HTMLDivElement = document.querySelector('.modale') as HTMLDivElement;


// Fonctions du jeu

// Ceci est la fonction pour generer la carte du jeu en tableau de string
const map: string[][] = [
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
function generateGameObjects(): void {
    const tabGameObject: GameObject[][] = [tabCoffres, tabPortes, tabCraft];
    for (const tab of tabGameObject) {
        for (const obj of tab) {
            document.getElementById(`${obj.position[0]}-${obj.position[1]}`)!.append(obj.img);
        }
    }
    for (const monster of tabMonstres) {
        document.getElementById(`${monster.position[0]}-${monster.position[1]}`)!.append(monster.img);
    }
}

// Fonction pour ajouter la carte au DOM
function generateMap(): void {
    let i: number = 0;
    let j: number = 0;
    for (const ligne of map) {
        const row: HTMLDivElement = document.createElement('div');
        row.className = 'row';

        for (const block of ligne) {
            const carre: HTMLDivElement = document.createElement('div');
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
            row.append(carre)
            j++
        }

        divMap.append(row);
        i++
        j = 0;
    }

    generateGameObjects();
}

// Fonction pour placer et ajouter le hero au DOM
function placerJoueur(): void {
    document.getElementById(`${positionJoueur[0]}-${positionJoueur[1]}`)!.append(kratos.img);
}

// Fonction pour detecter si les fleches sont pressés pour le deplacement
function whichKey(event: KeyboardEvent): void {
    event.preventDefault();
    if (event.key === "ArrowUp") {
        deplacer(-1, 0);
    } else if (event.key === "ArrowDown") {
        deplacer(1, 0);
    } else if (event.key === "ArrowLeft") {
        deplacer(0, -1);
    } else if (event.key === "ArrowRight") {
        deplacer(0, 1);
    }
}

// Fonction pour checker qu'on ne depasse pas les limites de la map
function notOutOfMap(x: number, y: number): boolean {
    return positionJoueur[0] + x >= 0 &&
           positionJoueur[0] + x <= 27 &&
           positionJoueur[1] + y >= 0 &&
           positionJoueur[1] + y <= 27
}

// Fonction pour rajotuer des degats au hero si on va dans le feu
function degatsFeu(): void {
    if (map[positionJoueur[0]][positionJoueur[1]] == 'F') {
        if (degatInt == -1) {
            const degatSound = new Audio("../sounds/degat.mp3");
            const oofSound = new Audio("../sounds/oof.mp3");
            degatSound.play();
            kratos.pv -= 1;
            mettreAJoursInventaire();
            degatInt = setInterval(function() {
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
        if (!(degatInt == -1)){
            clearInterval(degatInt);
            degatInt = -1;
        }
    }
}

// Fonction pour checker si un entitée ou objet se trouve autour du joueur
function checkIfSomethingAround(): void {
    if (checkIfMonsterAround()) {
        window.removeEventListener('keydown', whichKey);
        combatV2(kratos, tabMonstres[idAdversaireActuel]);
    }

    else if (checkIfCoffre()) {
        indications.textContent = "Cliquez sur le coffre pour l'ouvrir";
        console.log("Cliquez sur le coffre pour l'ouvrir");
        tabCoffres[idChestActuel].img.addEventListener('click', openChest);
    }

    else if(checkIfDoor()) {
        indications.textContent = "Cout de la porte : 2or, cliquez sur la porte pour l'ouvrir";
        console.log("Cout de la porte : 2or, cliquez sur la porte pour l'ouvrir");
        const doorActuel = tabPortes[idDoorActuel];
        doorActuel.img.addEventListener('click', openDoor);
    }

    else if (checkIfCraftTable()) {
        indications.textContent = "Cliquez sur la table de craft pour l'ouvrir";
        console.log("Cliquez sur la table de craft pour l'ouvrir");
        const craftActuel = tabCraft[idCraftActuel];
        craftActuel.img.addEventListener('click', function() {
            modaleCraft.style.display = 'block';
            window.removeEventListener('keydown', whichKey);
            buyAxe.addEventListener('click', craftGun);
        });
    }
}

// Fonction pour gerer le deplacement du joueur
function deplacer(x: number, y: number): void {
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
        console.log("Vous n'avez pas assez d'or...")
    };
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
async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function resetDOM(hero: Human, monstre: Monstre) {
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
    fightInstr.textContent = '';
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

async function checkIfDead(hero: Human, monstre: Monstre): Promise<void>{
    if (!monstre.isAlive) {
        kratos.loot(monstre);
        const roarSound = new Audio("../sounds/monsterRoar.mp3");
        roarSound.play(); 
        crossMonster.style.display = 'block';
        timerFight.style.display = 'none';
        fightInstr.textContent = 'Victoire';
        await delay(2000);
        resetDOM(hero, monstre);
    }
    if (!hero.isAlive) {
        const looseSound = new Audio("../sounds/loose.mp3");
        looseSound.play();
        crossHero.style.display = 'block';
        fightInstr.textContent = 'Perdu';
        timerFight.style.display = 'none';
    }
}

// Fonction pour gerer l'attaque du joueur ou du monstre dependant de si le joueur reussi le QTE
function attaqueCombat(result: boolean, hero: Human, monstre: Monstre) {
    if (result) {
        const punchSound = new Audio("../sounds/punch.mp3");
        punchSound.play();
        indications.textContent = "Bien joué ! Vous attaquez le monstre.";
        hero.attaque(monstre);
        progressMonster.style.setProperty('--progressMonster', `${pvIntoPercent(monstre)}%`);
        affichePvMonster.textContent = `PV du monstre : ${monstre.pv} PV`;
    } else {
        const swordSound = new Audio("../sounds/sword.mp3");
        swordSound.play();
        indications.textContent = "Vous avez raté ! Le monstre riposte.";
        monstre.attaque(hero);
        progressHero.style.setProperty('--progressHero', `${pvIntoPercent(hero)}%`);
    }
}

// Set up d'elements du DOM pour un combat
function setupCombat(monstre: Monstre):void {
    pvMonster.style.visibility = 'visible';
    affichePvMonster.textContent = `PV du monstre : ${monstre.pv} PV`;
    indications.textContent = "Le combat entre vous et le monstre commence !";
    console.log("Le combat entre vous et le monstre commence !");
    fightInstr.textContent = 'READY?';

    //? Ajout ici
    combatZone.style.display = 'block';
    heroZone.prepend(kratos.img)
    monsterZone.prepend(monstre.img)
    progressHero.style.setProperty('--progressHero', `${pvIntoPercent(kratos)}%`);
    
    const combatSound = new Audio("../sounds/fight.mp3");
    combatSound.play();
}

function pvIntoPercent(personnage: Personnage): number {
    return (personnage.pv / personnage.maxPv) * 100;
}

//! Vrai fonction de combat basé sur un QTE pour le joueur
async function combatV2(hero: Human, monstre: Monstre): Promise<void> {
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

        timerFightProgress.style.animation = '';
        timerFight.offsetHeight;
        timerFightProgress.style.animation = 'progressAnimation ease-out 1s';

        timerFight.style.display = 'none';
        timerFight.style.display = 'block'; 

        const result = await attendreToucheAvecTimeout(lettreAleatoire, 1000);

        attaqueCombat(result, hero, monstre);
        
        mettreAJoursInventaire();
        checkIfDead(hero, monstre);
    }

    music.pause();
    music.currentTime = 0;
}

// Fonction Promesse qui attend un temps imparti pour une entrée du joueur pour le QTE
function attendreToucheAvecTimeout(lettreCible: string, timeout: number): Promise<boolean> {
    return new Promise((resolve) => {
        let isResolved = false;

        function onKeyPress(e: KeyboardEvent) {
            if (isResolved) return;
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
function jeuTouche(e: KeyboardEvent) {
    if (e.key == lettreAleatoire) {
        alert('OK');
    }
    alert('KO');
}

// Fonction qui va generer une lettre aléatoire pour le QTE lors d'un combat
function toucheAleatoire(touche: string[]): string {
    const rand: number = Math.floor(Math.random()*26);
    return touche[rand];
}

// Fonction pour generer un tableau avec les lettres de l'alphabet
function getAlphabet(): string[] {
    const alphabet: string[] = [];
    for (let i = 0; i < 26; i++) {
        alphabet.push(String.fromCharCode(97 + i));
    }
    return alphabet;
}

// Fonction generale pour voir si un object se trouve autour du joueur
function checkIfObjectAround(className: string, callback: (id: number) => void): boolean {
    const voisins: number[][] = [
        [0, 1], [1, 1], [1, 0], [0, -1], 
        [-1, -1], [-1, 0], [1, -1], [-1, 1]
    ];

    for (const voisin of voisins) {
        const element = document.getElementById(`${positionJoueur[0] + voisin[0]}-${positionJoueur[1] + voisin[1]}`);
        if (element?.hasChildNodes()) {
            const img: HTMLImageElement = element.firstChild as HTMLImageElement;
            if (img.className === className) {
                callback(Number(img.id.slice(1)));
                return true;
            }
        }
    }
    return false;
}

// Application de la fonctoin general a chaque object ou entité du jeu
function checkIfMonsterAround(): boolean {
    return checkIfObjectAround('monster', (id) => {
        idAdversaireActuel = id;
    });
}

function checkIfCoffre(): boolean {
    return checkIfObjectAround('chest', (id) => {
        idChestActuel = id;
    });
}

function checkIfDoor(): boolean {
    return checkIfObjectAround('door', (id) => {
        idDoorActuel = id;
    });
}

function checkIfCraftTable(): boolean {
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

skipIntroBtn.addEventListener('click', function() {
    window.addEventListener('keydown', whichKey);
    introDiv.style.display = 'none';
})

closeCraft.addEventListener('click', function() {
    modaleCraft.style.display = 'none';
    window.addEventListener('keydown', whichKey);
})