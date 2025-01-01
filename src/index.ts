// Création des personnages du jeu

let compteurCoffres: number = 0;
let compteurPortes: number = 0;
let compteurMonstres: number = 0;
const tabCoffres: Chest[] = [];
const tabPortes: Door[] = [];
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

class Chest {

    private _contains: number;
    private _opened: boolean;
    private _position: number[];
    private _img: HTMLImageElement;
    private _id: number;

    constructor(position: number[]) {
        this._contains = Math.ceil(Math.random()*15);
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
    }

}

class Door {

    private _opened: boolean;
    private _position: number[];
    private _img: HTMLImageElement;
    private _id: number;

    constructor(position: number[]) {
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

        personnage._pv -= degat;
        if (personnage.pv < 0) personnage.pv = 0;
    }

    private calculerStates(): number {

        let tabRand: number[] = [];
        const de: De = new De(6);

        for (let i = 0; i < 4; i++) {
            const ran: number = de.lancer();
            tabRand.push(ran);
        }

        tabRand = tabRand.sort((a, b) => b - a);

        return tabRand[0] + tabRand[1] + tabRand[2];

    }

    private calculateModifier(stat: number): number {
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
    get end(): number {
        return this._end + 1;
    }

    get force(): number {
        return this._force + 1;
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

const wolf: Loup = new Loup('../img/wolf.png', [18, 16]);
const orc: Orc = new Orc('../img/orc.png', [23, 9]);
const orc2: Orc = new Orc('../img/orc.png', [10, 9]);
const dragon: Dragonnet = new Dragonnet('../img/dragonet.png', [17, 24]);
const dragon2: Dragonnet = new Dragonnet('../img/dragonet.png', [17, 2]);

let idAdversaireActuel: number = -1;
let idChestActuel: number = -1;
let idDoorActuel: number = -1;


// Fonctions du jeu

const map: string[][] = [
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

    for (const coffre of tabCoffres) {
        document.getElementById(`${coffre.position[0]}-${coffre.position[1]}`)!.append(coffre.img);
    }

    for (const door of tabPortes) {
        document.getElementById(`${door.position[0]}-${door.position[1]}`)!.append(door.img);
    }

    for (const monster of tabMonstres) {
        document.getElementById(`${monster.position[0]}-${monster.position[1]}`)!.append(monster.img);
    }
}

function placerJoueur(): void {
    document.getElementById(`${positionJoueur[0]}-${positionJoueur[1]}`)!.append(kratos.img);
}

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

function notOutOfMap(x: number, y: number): boolean {
    return positionJoueur[0] + x >= 0 &&
           positionJoueur[0] + x <= 27 &&
           positionJoueur[1] + y >= 0 &&
           positionJoueur[1] + y <= 27
}

function deplacer(x: number, y: number): void {
    tabPortes[idDoorActuel]?.img?.removeEventListener('click', openDoor);
    tabCoffres[idChestActuel]?.img?.removeEventListener('click', openChest);
    if (notOutOfMap(x, y) && map[positionJoueur[0] + x][positionJoueur[1] + y] != '#' && document.getElementById(`${positionJoueur[0] + x}-${positionJoueur[1] + y}`)?.childNodes.length == 0) {
        positionJoueur[0] += x;
        positionJoueur[1] += y;
        placerJoueur();
    }
    if (checkIfMonsterAround()) {
        window.removeEventListener('keydown', whichKey);
        combat(kratos, tabMonstres[idAdversaireActuel]);
    }

    else if (checkIfCoffre()) {
        console.log("Cliquez sur le coffre pour l'ouvrir");
        tabCoffres[idChestActuel].img.addEventListener('click', openChest);
    }

    else if(checkIfDoor()) {
        console.log("Cout de la porte : 5or, cliquez sur la porte pour l'ouvrir");
        const doorActuel = tabPortes[idDoorActuel];
        doorActuel.img.addEventListener('click', openDoor);
    }
}

function openDoor() {
    const doorToOpen = tabPortes[idDoorActuel];
    if (kratos.or >= 2) {
        const doorSound = new Audio("../sounds/doorOpen.mp3");
        doorSound.play();
        doorToOpen.open();
        doorToOpen.img.remove();
        kratos.or -= 2;
        console.log('Ouverture de la porte. -2 or...');
    }
    else (console.log("Vous n'avez pas assez d'or..."));
}

function openChest() {
    const chestSound = new Audio("../sounds/chestOpen.mp3");
    chestSound.play();
    kratos.openChest(tabCoffres[idChestActuel]);
    tabCoffres[idChestActuel].img.remove();
}

async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function combat(hero: Human, monstre: Monstre): Promise<void> {
    console.log("Le combat entre vous et le monstre commence !");
    const combatSound = new Audio("../sounds/fight.mp3");
    combatSound.play();
    await delay(1000);
    const music = new Audio("../sounds/musicBattle.mp3");
    music.loop = true;
    music.play();
    
    while (hero.isAlive && monstre.isAlive) {
        const pvMonstre = monstre.pv;
        hero.attaque(monstre);
        const punchSound = new Audio("../sounds/punch.mp3");
        punchSound.play();

        if (!monstre.isAlive) {
            console.log("Après cette attaque, vous avez vaincu le monstre !");
            kratos.loot(monstre);
            const roarSound = new Audio("../sounds/monsterRoar.mp3");
            roarSound.play(); 
            monstre.img.remove();
            hero.repos();
            window.addEventListener('keydown', whichKey);
            break;
        } else {
            console.log(`Vous avez infligé ${pvMonstre - monstre.pv} de dégat au monstre, il ne lui reste plus que ${monstre.pv} pv !`);
        }

        await delay(1000);

        if (monstre.isAlive) {
            const pvHero = hero.pv;
            monstre.attaque(hero);     
            const swordSound = new Audio("../sounds/sword.mp3");
            swordSound.play();
            if (!hero.isAlive) {

                console.log("Après cette attaque du monstre, vous êtes mort !");
                const looseSound = new Audio("../sounds/loose.mp3");
                looseSound.play();
                gameOver = true;
                break;
            } else {
                console.log(`Le monstre vous a infligé ${pvHero - hero.pv} de dégat, il ne vous reste plus que ${hero.pv} pv !`);
            }
        }

        await delay(1000);
    }

    music.pause();
    music.currentTime = 0; // Réinitialiser à zéro
}

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
                callback(Number(img.id[1]));
                return true;
            }
        }
    }
    return false;
}

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


generateMap();
placerJoueur();

window.addEventListener('keydown', whichKey);