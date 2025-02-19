import { useState, useEffect } from "react";
import "./graph.css";

function App() {
    const [dataWithMoms, setData] = useState([]);
    const [dataWithoutMoms, setutanMomsData] = useState([]);
    const [tooltip, setTooltip] = useState({ x: 0, y: 0, value: 0, visible: false });

    const [checkBoxes, setCheckBoxes] = useState({
        exklMoms: false,
        inklMoms: true,
        printVersion: false
    });

    const [inklMomsHeights, setInklMomsHeights] = useState([]);

    useEffect(() => {
        const inklMomsValues = dataWithMoms.map(([_, v]) => {
            const yRatio = (v - dataYMin) / dataYRange;
            return yRatio * xAxisLength;
        });

        setInklMomsHeights(inklMomsValues);
    }, [dataWithMoms]);

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setCheckBoxes(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    useEffect(() => {
        fetch("/data/dates.json")
            .then(response => response.json())
            .then(json => {
                const formattedData = json.data.map(item => [item.month, item.value, item.color]);
                setData(formattedData);
            })
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        if (dataWithMoms.length > 0) {
            const vatRate = 0.25;
            const barColor = "#3f5721";

            const inklMomsHeights = dataWithMoms.map(([_, v]) => {
                const yRatio = (v - dataYMin) / dataYRange;
                return yRatio * yAxisLength;
            });

            const dataNoMoms = dataWithMoms.map(([_, v, __], index) => {
                const priceWithoutMoms = v - (v * vatRate);
                const newColor = barColor;
                const momsHeight = inklMomsHeights[index] ?? 0;

                return [priceWithoutMoms, newColor, momsHeight];
            });

            setutanMomsData(dataNoMoms);
        }
    }, [dataWithMoms]);

    const SVG_WIDTH = 670;
    const SVG_HEIGHT = 250;
    const x0 = 0;
    const xAxisLength = SVG_WIDTH - x0 * 2;
    const y0 = 0;
    const yAxisLength = SVG_HEIGHT - y0 * 2;
    const xAxisY = y0 + yAxisLength;

    const dataYMax = (dataWithMoms ?? []).reduce((currMax, [_, dataY]) => Math.max(currMax, dataY), -Infinity);
    const dataYMin = 0;
    const dataYRange = dataYMax - dataYMin;
    const numYTicks = dataWithMoms?.length / 2;
    const barPlotWidth = xAxisLength / ((dataWithMoms?.length ?? 1));

    return (
        <div>
            <div className="mainContainer">
                <svg className='graphContainer' width={SVG_WIDTH} height={SVG_HEIGHT}>
                    <line x1={x0} y1={xAxisY} x2={x0 + xAxisLength} y2={xAxisY} stroke="grey" />
                    <line x1={x0} y1={y0} x2={x0} y2={y0 + yAxisLength} stroke="grey" />
                    <line x1={xAxisLength} y1={y0} x2={xAxisLength} y2={y0 + yAxisLength} stroke="grey" />
                </svg>
            </div>
            <div className="radioBox">
                <div className="checkboxWrapper">
                    <input type="checkbox" name="exklMoms" checked={checkBoxes.exklMoms} onChange={handleCheckboxChange} />
                    <label htmlFor="exklMoms">Exkl Moms</label>
                </div>
                <div className="checkboxWrapper">
                    <input type="checkbox" name="printVersion" checked={checkBoxes.printVersion} onChange={handleCheckboxChange} />
                    <label htmlFor="option3">Print Version</label>
                </div>
            </div>
        </div>
    );
}

export default App;
