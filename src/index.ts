// Création des personnages du jeu

let compteurCoffres: number = 0;
let compteurPortes: number = 0;
const tabCoffres: Chest[] = [];
const tabPortes: Door[] = [];


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

    public loot(monstre: Monstre): void {
        if (monstre.or) this._or += monstre.or
        if (monstre.cuir) this._cuir += monstre.cuir;
    }

    public repos(): void {
        this.pv = this.maxPv;
    }

    public openChest(chest: Chest) {
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

}

class Loup extends Monstre {

    constructor(src: string) {
        super(src);
        this._cuir = 1;
    }

}

class Orc extends Monstre {

    constructor(src: string) {
        super(src);
        this._or = 1;
    }

    get force(): number {
        return this._force + 1;
    }

}

class Dragonnet extends Monstre {

    constructor(src: string) {
        super(src);
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

const wolf: Loup = new Loup('../img/wolf.png');

// Fonctions du jeu

const map: string[][] = [
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '-', '#', '#', '#', '#', '#'],
    ['#', '#', '.', '.', '.', '#', '-', '.', '.', '.', '-', '#', '.', '.', '.', '.', '.', '.', '#', '#', '-', '.', '.', '.', '-', '#', '#', '#'],
    ['#', '.', '.', '~', '~', '#', '-', '.', '#', '#', '-', '#', '#', '#', '#', '#', '.', '.', '#', '#', '-', '.', '.', '.', '-', '#', '#', '#'],
    ['#', '#', '.', '~', '~', '#', '-', '.', '#', '#', '-', '-', '-', '-', '-', '#', '.', '.', '.', '#', '-', '.', '.', '.', '-', '#', '#', '#'],
    ['-', '-', '-', '~', '~', '-', '-', '.', '.', '.', '.', '.', '.', '.', '-', '-', '-', '-', '-', '-', '-', '.', '.', '.', '-', '-', '-', '-'],
    ['-', '.', '.', '~', '~', '~', '~', '~', '~', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '.', '.', '.', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '~', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '.', '#', '#', '#', '#', '#', '#', '~', '~', '~', '~', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '.', '.', '.', '.', '-', '-'],
    ['-', '.', '#', '#', '#', '#', '#', '#', '~', '~', '~', '~', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '.', '.', '.', '.', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '.', '-', '-', '-', '-', '-', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', '#', '#', '.', '.', '.', '-', '.', '#', '-', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', '#', '#', '.', '.', '.', '-', '.', '#', '-', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', '#', '#', '.', '.', '.', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '#', '#', '#'],
    ['#', '#', '#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#', '#', '#'],
    ['#', '#', '#', '#', '#', '#', '#', '-', '-', '-', '-', '-', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '-', '-', '#', '#'],
    ['#', '#', '.', '.', '.', '.', '-', '.', '.', '.', '-', '#', '.', '.', '.', '.', '.', '.', '#', '#', '-', '.', '.', '#', '-', '#', '#', '#'],
    ['#', '.', '.', '-', '-', '.', '-', '.', '#', '#', '#', '#', '#', '#', '#', '#', '.', '.', '#', '#', '-', '.', '#', '#', '-', '#', '#', '#'],
    ['#', '#', '#', '#', '-', '#', '#', '#', '#', '#', '-', '-', '-', '-', '-', '#', '.', '.', '.', '#', '-', '.', '.', '.', '-', '#', '#', '#'],
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
    if (notOutOfMap(x, y) && map[positionJoueur[0] + x][positionJoueur[1] + y] != '#' && document.getElementById(`${positionJoueur[0] + x}-${positionJoueur[1] + y}`)?.childNodes.length == 0) {
        positionJoueur[0] += x;
        positionJoueur[1] += y;
        placerJoueur();
    }
}

generateMap();
placerJoueur();

window.addEventListener('keydown', whichKey);