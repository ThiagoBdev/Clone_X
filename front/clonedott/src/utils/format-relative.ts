export const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMilliseconds = date.getTime() - now.getTime()

    type Unit = {
        unit: Intl.RelativeTimeFormatUnit;
        millisecond: number;
    }

    const units: Unit[] = [
        { unit: "year", millisecond: 1000 * 60 * 60 * 24 * 365 },   
        { unit: "month", millisecond: 1000 * 60 * 60 * 24 * 30 },   
        { unit: "day", millisecond: 1000 * 60 * 60 * 24 },         
        { unit: "hour", millisecond: 1000 * 60 * 60 },              
        { unit: "minute", millisecond: 1000 * 60 },               
        { unit: "second", millisecond: 1000 },                      
    ];

    for (const {unit, millisecond} of units) {
        const difference = diffInMilliseconds / millisecond;
        if (Math.abs(difference) >= 1) {
            const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto"});
            return rtf.format(Math.round(difference), unit);
        }
    }

    return "agora";

}
