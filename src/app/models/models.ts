

export enum Legend {
    CL = 'CL',
    CM = 'CM',
    TR = 'TR',
    LE = 'LE',
    MO = 'MO',
    FO = 'FO',
    MF = 'MF',
    INT = 'INT'
}

export type CircuitList = {
    legend: Legend,
    title: string
};

export const CIRCUIT_LIST: CircuitList[] = [
    {
        legend: Legend.CL,
        title: "Caminhada Leve"
    },
    {
        legend: Legend.CM,
        title: "Caminhada"
    },
    {
        legend: Legend.TR,
        title: "Trote"
    },
    {
        legend: Legend.LE,
        title: "Corrida Leve"
    },
    {
        legend: Legend.MO,
        title: "Corrida Moderada"
    },
    {
        legend: Legend.FO,
        title: "Corrida FOrte"
    },
    {
        legend: Legend.MF,
        title: "Corrida Muito Forte"
    },
    {
        legend: Legend.INT,
        title: "Intervalo"
    },
];

export class Exercise {
    walking: CircuitList | undefined;

    public constructor(walking: Legend, private duration: number) {
        this.walking = CIRCUIT_LIST.find((circ) => circ.legend === walking);
    }

    public getDuration() {
        return this.duration * 60;
    }

    public static CL(duration: number): Exercise {
        return new Exercise(Legend.CL, duration);
    }

    public static CM(duration: number): Exercise {
        return new Exercise(Legend.CM, duration);
    }

    public static TR(duration: number): Exercise {
        return new Exercise(Legend.TR, duration);
    }

    public static LE(duration: number): Exercise {
        return new Exercise(Legend.LE, duration);
    }

    public static MO(duration: number): Exercise {
        return new Exercise(Legend.MO, duration);
    }

    public static FO(duration: number): Exercise {
        return new Exercise(Legend.FO, duration);
    }
    public static MF(duration: number): Exercise {
        return new Exercise(Legend.MF, duration);
    }
}

export interface ExerciseRow {
    repetitions: number;
    title: string;
    exercises: Exercise[];
}

export abstract class BasicRow implements ExerciseRow {
    repetitions: number;
    exercises: Exercise[];

    public constructor(repetitions: number, ...exercises: Exercise[]) {
        this.repetitions = repetitions,
            this.exercises = exercises;
    }

    public get title(): string {
        let text = this.repetitions + 'X';

        text += this.exercises.reduce((txt, ex) => {
            return txt + ' / ' + ex.walking?.legend;
        }, '');

        return text;
    }

    public getTotalTiming() {
        return this.exercises.reduce((sum, ex) => {
            return sum + (this.repetitions * ex.getDuration());
        }, 0)
    }

}

export class WalkingRow extends BasicRow {
    constructor(timing = 10) {
        super(1, Exercise.CL(timing))
    }
}

export class DynamicRow extends BasicRow {

}

export interface Circuit {
    name: string;
    rows: BasicRow[];
}

export const DAYS_CIRCUITS: Circuit[] = [
    {
        name: '2 Semana Terça',
        rows: [
            new WalkingRow(),
            new DynamicRow(4, Exercise.TR(2), Exercise.CL(3)),
            new WalkingRow(),
        ]
    },
    {
        name: '2 Semana Quinta',
        rows: [
            new WalkingRow(),
            new DynamicRow(4, Exercise.TR(2), Exercise.CL(3)),
            new WalkingRow(),
        ]
    },
    {
        name: '2 Semana Sábado',
        rows: [
            new WalkingRow(),
            new DynamicRow(4, Exercise.TR(2), Exercise.CL(3)),
            new WalkingRow(),
        ]
    },
    {
        name: '3 Semana Terça',
        rows: [
            new WalkingRow(),
            new DynamicRow(4, Exercise.TR(2), Exercise.CL(3)),
            new WalkingRow(),
        ]
    },
    {
        name: '3 Semana Quinta',
        rows: [
            new WalkingRow(),
            new DynamicRow(4, Exercise.TR(2), Exercise.CL(3)),
            new WalkingRow(),
        ]
    },
    {
        name: '3 Semana Sábado',
        rows: [
            new WalkingRow(),
            new DynamicRow(4, Exercise.TR(2), Exercise.CL(3)),
            new WalkingRow(),
        ]
    },
    {
        name: '4 Semana Terça',
        rows: [
            new WalkingRow(),
            new DynamicRow(4, Exercise.TR(2), Exercise.CL(3)),
            new WalkingRow(),
        ]
    },
    {
        name: '4 Semana Quinta',
        rows: [
            new WalkingRow(),
            new DynamicRow(4, Exercise.TR(2), Exercise.CL(3)),
            new WalkingRow(),
        ]
    },
    {
        name: '4 Semana Sábado',
        rows: [
            new WalkingRow(),
            new DynamicRow(4, Exercise.TR(2), Exercise.CL(3)),
            new WalkingRow(),
        ]
    },
    {
        name: '5 Semana Terça',
        rows: [
            new WalkingRow(),
            new DynamicRow(4, Exercise.TR(2), Exercise.CL(3)),
            new WalkingRow(),
        ]
    },
    {
        name: '5 Semana Quinta',
        rows: [
            new WalkingRow(),
            new DynamicRow(4, Exercise.TR(2), Exercise.CL(3)),
            new WalkingRow(),
        ]
    },
    {
        name: '5 Semana Sábado',
        rows: [
            new WalkingRow(),
            new DynamicRow(4, Exercise.TR(2), Exercise.CL(3)),
            new WalkingRow(),
        ]
    },
    {
        name: '6 Semana Terça',
        rows: [
            new WalkingRow(),
            new DynamicRow(4, Exercise.TR(2), Exercise.CL(3)),
            new WalkingRow(),
        ]
    },
    {
        name: '6 Semana Quinta',
        rows: [
            new WalkingRow(),
            new DynamicRow(4, Exercise.TR(2), Exercise.CL(3)),
            new WalkingRow(),
        ]
    },
    {
        name: '6 Semana Sábado',
        rows: [
            new WalkingRow(),
            new DynamicRow(4, Exercise.TR(2), Exercise.CL(3)),
            new WalkingRow(),
        ]
    },
    {
        name: '7 Semana Terça',
        rows: [
            new WalkingRow(),
            new DynamicRow(4, Exercise.TR(2), Exercise.CL(3)),
            new WalkingRow(),
        ]
    },
    {
        name: '7 Semana Quinta',
        rows: [
            new WalkingRow(),
            new DynamicRow(4, Exercise.TR(2), Exercise.CL(3)),
            new WalkingRow(),
        ]
    },
    {
        name: '7 Semana Sábado',
        rows: [
            new WalkingRow(),
            new DynamicRow(4, Exercise.TR(2), Exercise.CL(3)),
            new WalkingRow(),
        ]
    },
    {
        name: '8 Semana Terça',
        rows: [
            new WalkingRow(),
            new DynamicRow(4, Exercise.TR(2), Exercise.CL(3)),
            new WalkingRow(),
        ]
    },
    {
        name: '8 Semana Quinta',
        rows: [
            new WalkingRow(),
            new DynamicRow(4, Exercise.TR(2), Exercise.CL(3)),
            new WalkingRow(),
        ]
    },
    {
        name: '8 Semana Sábado',
        rows: [
            new WalkingRow(),
            new DynamicRow(4, Exercise.TR(2), Exercise.CL(3)),
            new WalkingRow(),
        ]
    }
];