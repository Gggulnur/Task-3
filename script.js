/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function randBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function randInRange(range) {
    let min = range[0];
    let max = range[1];
    return randBetween(min, max);
}

const NUM_CIRCLES = 25;
const NUM_RHOMBUSES = 25;

const RANGE_X = [0, 100];
const RANGE_Y = [0, 100];

const RANGE_X_EXTENDED = [RANGE_X[0], RANGE_X[1]*1.05];
const RANGE_Y_EXTENDED = [RANGE_Y[0], RANGE_Y[1]*1.05];

let circleArray = [];
let rhombusArray = [];

const CIRCLE_RADIUS = 5;
const RHOMBUS_SIDE = 2 / Math.sqrt(2) * CIRCLE_RADIUS;

function generateData(){
    circleArray.length = 0;
    rhombusArray.length = 0;
    for (let i = 0; i < NUM_CIRCLES; i++) {
        circleArray.push({x: randInRange(RANGE_X), y: randInRange(RANGE_Y)});
    }
    for (let i = 0; i < NUM_RHOMBUSES; i++) {
        rhombusArray.push({x: randInRange(RANGE_X), y: randInRange(RANGE_Y)});
    }
    Plot.update();
}

function clearData(){
    circleArray.length = 0;
    rhombusArray.length = 0;
    console.log("CLEARED!");
    Plot.update();
}

class Plot {
    static svg;
    static xScale;
    static yScale;

    static build() {
// set the dimensions and margins of the graph
        var margin = {left: 50, right: 30, top: 50, bottom: 30},
            width = 420,
            height = 420;

// append the svg object to the body of the page
        this.svg = d3.select("#plot-svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        const x_label = "x";
        const y_label = "y";

        // add y label
        this.svg
            .append("text")
            .attr("text-anchor", "middle")
            .attr(
                "transform",
                `translate(${0}, ${-15})`
            )
            .style("font-size", "20px")
            .text(y_label);
        // add x label
        this.svg
            .append("text")
            .attr("class", "svg_title")
            .attr("x", width + 15)
            .attr("y", height + 5)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text(x_label);


        // Add X axis
        this.xScale = d3.scaleLinear()
            .domain(RANGE_X_EXTENDED)
            .range([0, width]);
        var xAxis = d3.axisBottom(this.xScale)
            .tickSizeOuter(0);
        this.svg.append("g")
            .attr('class', 'axis')
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Add Y axis
        this.yScale = d3.scaleLinear()
            .domain(RANGE_Y_EXTENDED)
            .range([height, 0]);
        var yAxis = d3.axisLeft(this.yScale)
            .tickSizeOuter(0);
        this.svg.append("g")
            .attr('class', 'axis')
            .call(yAxis);

        this.svg.selectAll('.axis path.domain')
            .attr('marker-end', 'url(#arrow)');
    }

    static clear() {
        var circles =  document.getElementById('circles');
        if (typeof(circles) != 'undefined' && circles != null)
            circles.remove();

        var rhombuses =  document.getElementById('rhombuses');
        if (typeof(rhombuses) != 'undefined' && rhombuses != null)
            rhombuses.remove();
    }

    static update() {
        this.clear();

        // Add dots
        this.svg.append('g')
            .attr('id', 'circles')
            .selectAll("dot")
            .data(circleArray)
            .enter()
            .append("circle")
            .attr("class", "circleData")
            .attr("cx", (d) => {
                return this.xScale(d.x);
            })
            .attr("cy", (d) => {
                return this.yScale(d.y);
            })
            .attr("r", CIRCLE_RADIUS)
            .style("fill", "#f5a4aa")

        this.svg.append('g')
            .attr('id', 'rhombuses')
            .selectAll("dot")
            .data(rhombusArray)
            .enter()
            .append("rect")
            .attr("class", "rhombusData")
            .attr("x", 0)
            .attr("y", 0)
            .attr('width', RHOMBUS_SIDE + 'px')
            .attr('height', RHOMBUS_SIDE + 'px')
            .style("fill", "#6677b9")

        console.log(rhombusArray);
        let a = document.getElementsByClassName("rhombusData");
        for (let i = 0; i < a.length; i++) {
            let xPx = this.xScale(rhombusArray[i]['x']);
            let yPx = this.yScale(rhombusArray[i]['y']) - Math.sqrt(2) * RHOMBUS_SIDE / 2;
            a[i].style.transform = 'translate(' + xPx + 'px, ' + yPx + 'px) rotate(45deg)';
        }
    }
}

Plot.build();
generateData();