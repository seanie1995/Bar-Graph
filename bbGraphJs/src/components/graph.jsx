import { useState, useEffect } from "react";
import "./graph.css";

function Graph() {
    const [data, setData] = useState([]);
    const [tooltip, setTooltip] = useState({ x: 0, y: 0, value: 0, visible: false });
    // const [fmData, setFmData] = useState([]);
    const [diagramStatus, setDiagramStatus] = useState("");

    window.setNewDiagramStatus = (json) => {
        try {
            
            const parsedData = JSON.parse(json)
            const graphStatus = parsedData.status
            // alert("You made it here!")
            setDiagramStatus(graphStatus)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        // Call the FileMaker script when the component mounts
        if (window.FileMaker) {
            window.FileMaker.PerformScript("FetchData");
        }
    }, []);

    window.getDataFromFM = (json) => {
        try {
            const parsedData = JSON.parse(json);

            const formattedFMData = Object.values(parsedData).map(item => [item.date, item.articles])

            setData(formattedFMData)
        } catch (error) {

            console.log("Invalid JSON data");
        }
    }

    // useEffect(() => {
    //     fetch("/data/dates.json")
    //         .then(response => response.json())
    //         .then(json => {
    //             const formattedData = json.data.map(item => [item.month, item.value, item.color]);
    //             setData(formattedData);
    //         })
    //         .catch(error => console.error(error));
    // }, []);

    const [checkBoxes, setCheckBoxes] = useState({
        exklMoms: false,
        inklMoms: true,
        printVersion: false
    });

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setCheckBoxes(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const SVG_WIDTH = 600;
    const SVG_HEIGHT = 120;
    const x0 = 0;
    const xAxisLength = SVG_WIDTH - x0 * 2;
    const y0 = 0;
    const yAxisLength = SVG_HEIGHT - y0 * 2;
    const xAxisY = y0 + yAxisLength;

    const dataYMax = (data ?? []).reduce((currMax, [_, dataY]) => Math.max(currMax, dataY), -Infinity);
    const dataYMin = 0;
    const dataYRange = dataYMax - dataYMin;
    let numYTicks = data?.length / 2;
    // const numYTicks = 5;
    const barPlotWidth = xAxisLength / ((data?.length ?? 1));

    if (dataYMax === 0) {
        numYTicks = 0;
    } else if (dataYMax === 10) {
        numYTicks = 3
    }

    return (
        <div>
            <div className="mainContainer">
                <svg className='graphContainer' width={SVG_WIDTH} height={SVG_HEIGHT}>
                    {/* X axis */}
                    <line x1={x0} y1={xAxisY} x2={x0 + xAxisLength} y2={xAxisY} stroke="grey" />
                    {/* Y axis */}
                    <line x1={x0} y1={y0} x2={x0} y2={y0 + yAxisLength} stroke="grey" />

                    {/* Y axis labels */}
                    {!checkBoxes.printVersion && Array.from({ length: numYTicks }).map((_, index) => {
                        const y = y0 + index * (yAxisLength / numYTicks);
                        const yValue = Math.round(dataYMax - index * (dataYRange / numYTicks));

                        let formattedValue;
                        if (yValue >= 1000000) {
                            formattedValue = (yValue / 1000000).toFixed(1) + "M";
                        } else if (yValue >= 1000) {
                            formattedValue = Math.round(yValue / 1000) + "K";
                        } else if (yValue >= 100){
                            formattedValue = Math.round(yValue / 10) * 10;
                        } else {
                            formattedValue = yValue
                        }

                        return (
                            <g key={index}>
                                <line x1={x0 - 5} y1={y} x2={xAxisLength} y2={y} stroke="grey" />
                                <text className="valueLabel" x={x0 - 5} y={y + 5} textAnchor="end" fill="black">
                                    {formattedValue}
                                </text>
                            </g>
                        );
                    })}

                    {/* --------------------------- BARS INKL MOMS --------------------------- */}

                    {data.map(([date, dataY, color], index) => {
                        const x = x0 + index * barPlotWidth;
                        const yRatio = (dataY - dataYMin) / dataYRange;
                        const y = y0 + (1 - yRatio) * yAxisLength;
                        const height = yRatio * yAxisLength;
                        const sidePadding = 14;

                        return (
                            <g key={index}>
                                <rect
                                    x={x + sidePadding / 2}
                                    y={y}
                                    width={barPlotWidth - sidePadding}
                                    height={height}
                                    fill={"hsla(33, 78%, 50%, 0.8)"}
                                    rx={3}
                                    onMouseEnter={(e) =>
                                        setTooltip({
                                            x: e.clientX,
                                            y: e.clientY,
                                            value: dataY,
                                            visible: true
                                        })
                                    }
                                    onMouseMove={(e) =>
                                        setTooltip((prev) => ({
                                            ...prev,
                                            x: e.clientX,
                                            y: e.clientY
                                        }))
                                    }
                                    onMouseLeave={() =>
                                        setTooltip((prev) => ({ ...prev, visible: false }))
                                    }
                                />

                                <text className="dateLabel" x={x + barPlotWidth / 2} y={xAxisY + 16} textAnchor={"middle"} >
                                    {date}
                                </text>
                                {checkBoxes.printVersion && <text className="barData" x={x + barPlotWidth / 2} y={((yAxisLength - height) - 5)} textAnchor={"middle"} fill="black"  >
                                    {dataY}
                                </text>}

                            </g>
                        );
                    })}
                </svg>
                {/* <div>
                    <p>{data}</p>
                </div> */}

                {/* Tooltip */}
                {tooltip.visible && (
                    <div
                        style={{
                            position: "absolute",
                            left: tooltip.x + 10,
                            top: tooltip.y + 10,
                            background: "rgba(0,0,0,0.8)",
                            color: "white",
                            padding: "5px 10px",
                            borderRadius: "4px",
                            pointerEvents: "none",
                            fontSize: "14px",
                            fontFamily: "Arial"
                        }}
                    >
                        {tooltip.value}
                    </div>
                )}

            </div>
            {/* <div className="radioBox">
                <div className="checkboxWrapper">
                    <input type="checkbox"
                        name="printVersion"
                        checked={checkBoxes.printVersion}
                        onChange={handleCheckboxChange} />
                    <label htmlFor="option3">Print Version</label>
                </div>
            </div> */}
        </div>
    );
}

export default Graph;
