// Création des personnages du jeu

class De {

    private _nbFaces: number;

    constructor(nbFaces: number) {
        this._nbFaces = nbFaces;
    }

    
    public get nbFaces() : number {
        return this._nbFaces;
    }
    
    lancer(): number {
        return Math.ceil(Math.random() * this._nbFaces);
    }

}

class Personnage {

    private _end: number;
    private _force: number;
    private _pv: number;

    constructor() {

        const tabEnd: number[] = this.calculerStates();
        this._end = tabEnd[0] + tabEnd[1] + tabEnd[2];

        const tabForce: number[] = this.calculerStates();
        this._force = tabForce[0] + tabForce[1] + tabForce[2];

        const modifier: number = this.calculateModifier(this._end);
        this._pv = this._end + modifier;

    }

    // Getters
    
    public get end() : number {
        return this._end;
    }

    public get force() : number {
        return this._force;
    }   
    
    public get pv() : number {
        return this._pv;
    }
    
    

    private calculerStates(): number[] {

        let tabRand: number[] = [];
        const de: De = new De(6);

        for (let i = 0; i < 4; i++) {
            const ran: number = de.lancer();
            tabRand.push(ran);
        }

        tabRand = tabRand.sort((a, b) => b - a);

        return tabRand;

    }

    private calculateModifier(stat: number): number {
        if (stat < 5) return -1;
        if (stat < 10) return 0;
        if (stat < 15) return 1;
        return 2;
    }

}