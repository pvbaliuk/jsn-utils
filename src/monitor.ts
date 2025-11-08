export type MonitorMark = {
    ts: number;
    diff: number;
    description?: string;
}

export type MonitorResult = {
    marks: MonitorMark[];
    startTs: number;
    stopTs: number;
    totalTime: number;
}

export class Monitor{

    private readonly marks = new Map<string, [number, string?][]>();

    /**
     * @template {(...args: any[]) => any} F
     * @param {F} fn
     * @returns {ReturnType<F> extends Promise<any> ? Promise<number> : number}
     */
    public static measureFunctionTime<F extends (...args: any[]) => any>(
        fn: F
    ): ReturnType<F> extends Promise<any> ? Promise<number> : number{
        const timeStart = Date.now();
        const promiseOrResult = fn();
        if(promiseOrResult instanceof Promise)
            return Promise.resolve(promiseOrResult)
                .then(() => Date.now() - timeStart) as any;

        return (Date.now() - timeStart) as any;
    }

    /**
     * @param {string} label
     * @returns {Monitor}
     */
    public static autoStart(label: string): Monitor{
        const instance = new Monitor();
        instance.start(label);
        return instance;
    }

    public constructor() {}

    /**
     * @param {string} label
     */
    public start(label: string){
        if(!this.marks.has(label)){
            this.marks.set(label, [[Date.now()]]);
        }else{
            return;
        }
    }

    /**
     * @param {string} label
     * @param {string} [description]
     */
    public mark(label: string, description?: string){
        if(!this.marks.has(label))
            throw new TypeError(`Label ${label} not found`);

        this.marks.get(label)!.push([Date.now(), description]);
    }

    /**
     * @param {string} label
     * @returns {MonitorResult}
     */
    public stop(label: string): MonitorResult{
        const endTime = Date.now();
        const marks = this.marks.get(label);
        if(!marks)
            throw new TypeError(`Label ${label} not found`);

        const [firstTs] = marks[0],
            processedMarks: MonitorMark[] = [];

        for(let i = 1; i < marks.length; i++){
            processedMarks.push({
                ts: marks[i][0],
                diff: marks[i][0] - firstTs,
                description: marks[i][1]
            });
        }

        this.marks.delete(label);
        return {
            marks: processedMarks,
            startTs: firstTs,
            stopTs: endTime,
            totalTime: endTime - firstTs
        };
    }

}
