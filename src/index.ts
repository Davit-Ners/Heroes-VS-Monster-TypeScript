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

    private _end: number;
    private _force: number;
    private _pv: number;

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
        const modifier: number = this.calculateModifier(this._force);
        const degat = de.lancer() + modifier;

        personnage._pv -= degat;
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

    constructor(end: number, force: number, pv: number) {
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

class Monstre extends Personnage {

    private _or: number;
    private _cuir: number;

    constructor(end: number, force: number, pv: number) {
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