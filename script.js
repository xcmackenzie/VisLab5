
let outerWidth = 650
let outerHeight = 500
let margin = {top: 40, bottom: 40, left: 40, right: 40}
let w = outerWidth - margin.left - margin.right
let h = outerHeight - margin.top - margin.bottom

const svg = d3.select(".chart")
    .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.right})`)

const xScale = d3.scaleBand()
    .rangeRound([0, w])
    .paddingInner(0.1)

const yScale = d3.scaleLinear()
    .rangeRound([h, 0])

const xAxis = d3.axisBottom()
    .scale(xScale)

const yAxis = d3.axisLeft()
    .scale(yScale)

svg.append("g")
    .attr("class", "axis x-axis")
    .call(xAxis)
    .attr("transform", `translate(0, ${h})`)

svg.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis)

svg.append("text")
    .attr("class", "label")
    .attr('x', 0)
    .attr('y', 0)
    .attr('dx', -30)
    .attr('dy', -5)
    .text("Stores")

let type = document.querySelector("#group-by").value
let descending = true

function update(data, type) {

    xScale.domain(data.map(d => d.company))
    yScale.domain([0, d3.max(data, d => d[type])])

    const bars = svg.selectAll("rect")
        .data(data, d => d.company)

    bars.enter()
        .data(data, d => d.company)
        .append("rect")
        .merge(bars)
        .transition()
        .delay(500)
        .duration(1000)
        .attr("x", (d, i) => xScale(d.company))
        .attr("y", (d, i) => yScale(d[type]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => h - yScale(d[type]))
        .attr("fill", "blue")

    bars.exit()
        .remove()

    svg.selectAll(".axis.x-axis")
        .transition()
        .duration(1000)
        .call(xAxis)

    svg.selectAll(".axis.y-axis")
        .transition()
        .duration(1000)
        .call(yAxis)

    svg.selectAll(".label")
        .text(() => {
            if (type == 'stores') {
                return "Stores"
            }
            else if (type == 'revenue') {
                return "Billion USD"
            }
        })

}

d3.csv('coffee-house-chains.csv', d3.autoType).then(data => {
    console.log(data)
    data = data.sort((a, b) => b[type] - a[type])
    update(data, type)

    d3.select("#group-by").on('change', () => {
        type = document.querySelector("#group-by").value
        if (descending) {
            data = data.sort((a, b) => b[type] - a[type])
        }
        else {
            data = data.sort((a, b) => a[type] - b[type])
        }
        update(data, type)
    })

    d3.select("#sort").on('click', () => {
        descending = !descending
        if (descending) {
            data = data.sort((a, b) => b[type] - a[type])
        }
        else {
            data = data.sort((a, b) => a[type] - b[type])
        }
        update(data, type)
    })
})
