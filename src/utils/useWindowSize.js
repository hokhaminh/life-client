import { useLayoutEffect, useState } from "react";

export const useWindowSize = () => {
    // init screen size
    const [size, setSize] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    function updateSize() {
        setSize({ width: window.innerWidth, height: window.innerHeight });
    }

    // {width, height}
    return size;
};
