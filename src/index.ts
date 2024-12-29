// Création des personnages du jeu

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

class Personnage {

    protected _end: number;
    protected _force: number;
    protected _pv: number;

    constructor() {

        this._end = this.calculerStates();

        this._force = this.calculerStates();

        const modifier: number = this.calculateModifier(this._end);
        this._pv = this._end + modifier;

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

    constructor() {
        super();
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

    constructor() {
        super();
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

    get force(): number {
        return this._force + 1;
    }

}

class Dragonnet extends Monstre {

    constructor() {
        super();
        this._or = 1;
        this._cuir = 1;
    }

    get end(): number {
        return this._end + 1;
    }

}

const hu = new Human();
const loup = new Loup();

// Recuperation elements DOM
const divMap: HTMLDivElement = document.querySelector('.map') as HTMLDivElement;

// Const et Let
let positionJoueur = [27, 6];
const kratos: HTMLImageElement = document.createElement('img');
kratos.src = '../img/kratos.png';

const wolf: HTMLImageElement = document.createElement('img');
wolf.src = '../img/wolf.png';

// Fonctions du jeu

const map: string[][] = [
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
}

function placerJoueur(): void {
    document.getElementById(`${positionJoueur[0]}-${positionJoueur[1]}`)!.append(kratos);
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
    if (notOutOfMap(x, y) && map[positionJoueur[0] + x][positionJoueur[1] + y] != '#') {
        positionJoueur[0] += x;
        positionJoueur[1] += y;
        placerJoueur();
    }
}

generateMap();
placerJoueur();

window.addEventListener('keydown', whichKey);