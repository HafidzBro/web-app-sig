export const getColor = (value, mode) => {
    if (mode === "luas") {
        return value > 100000 ? "#084081" :
            value > 50000 ? "#2b8cbe" :
                "#a6bddb";
    }

    if (mode === "pulau") {
        return value > 500 ? "#084081" :
            value > 100 ? "#2b8cbe" :
                "#a6bddb";
    }

    return "#ccc";
};