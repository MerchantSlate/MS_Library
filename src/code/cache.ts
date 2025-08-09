let dataCached: {
    [key: string]: any
} = {};

const
    readCache = (key: string): any => {
        try {
            if (localStorage?.[key])
                return JSON.parse(localStorage?.[key]);
        } catch (e) {
            if (dataCached[key])
                return dataCached[key];
        };
        return {};
    },
    saveCache = (key: string, data: any) => {
        try {
            const saveData = JSON.stringify(data);
            if (localStorage)
                localStorage[key] = saveData;
        } catch (e) {
            dataCached[key] = data;
        };
    };

export {
    readCache,
    saveCache,
}