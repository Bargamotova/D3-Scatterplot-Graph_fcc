/**
 * created by Anna Bargamotova Samoilenko
 */
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

const space = { top: 100, right: 20, bottom: 30, left: 60 };
let w = 920 - space.left - space.right,
  h = 630 - space.top - space.bottom;

const svg = d3.select('#graph_container')
  .append('svg')
  .attr('class', 'graph')
  .attr('width', w + space.left + space.right)
  .attr('height', h + space.top + space.bottom)
  .append('g')
  .attr('transform', `translate(${space.left} ,  ${space.top})`)


d3.json(url)
  .then(data => {
    const dataset = data;
    const tooltip = d3.select('#tooltip');

    // text
    svg
      .append('text')
      .attr("x", w / 4)
      .attr('y', -80)
      .attr("id", 'title')
      .style('font-size', '24px')
      .style("font-weight", 'bold')
      .text('Doping in Professional Bicycle Racing')
    svg
      .append('text')
      .attr("x", w / 3)
      .attr('y', -50)
      .attr("id", 'title')
      .style('font-size', '16px')
      .style('font-style', 'italic')
      .text("35 Fastest times up Alpe d'Huez");

    svg.append('text')
      .text("Time in Minutes")
      .attr('x', -(h / 2))
      .attr('y', -40)
      .style("transform", "rotate(-90deg)")
      .style("font-weight", 100)
      .style("font-size", 18)
      .style("font-style", 'italic')
      .style("font-weight", 'bold');

    svg.append('text')
      .text("Year")
      .attr('x', -50)
      .attr('y', h + 20)

      .style("font-weight", 100)
      .style("font-size", 18)
      .style("font-style", 'italic')
      .style("font-weight", 'bold');

    // lines x and y
    const xScale =
      d3.scaleLinear()
        .domain([d3.min(dataset, d => d.Year - 1), d3.max(dataset, d => d.Year + 1)])
        .range([10, w]);

    const yScale = d3.scaleTime().range([0, h]);

    data.forEach(function (d) {
      d.Place = + d.Place;
      let parsedTime = d.Time.split(":");
      d.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
    });

    yScale.domain(d3.extent(data, (d) => d.Time));
    let timeFormat = d3.timeFormat("%M:%S");

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
    const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

    svg
      .append('g')
      .attr("id", 'x-axis')
      .attr("transform", `translate(0, ${h})`)
      .call(xAxis)
    svg
      .append('g')
      .attr("id", 'y-axis')
      .attr("transform", `translate(10, 0)`)
      .call(yAxis);

    // label
    const legendBox = svg.append('g').attr('id', 'legend');
    let legend = legendBox
      .selectAll('#legend')
      .data(['blue', 'orange'])
      .enter()
      .append('g')
      .attr('class', 'legend-label')
      .attr('transform', (d, i) => `translate(0, ${h / 3 - i * 20})`)

    legend
      .append('rect')
      .attr('x', w)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', (d, i) => d)
      .style('fill', (d, i) => d)
      .style('opacity', 0.8)

    legend
      .append('text')
      .attr('x', w - 18)
      .attr('y', 9)
      .attr('dy', '.35em')
      .attr('width', space.right)
      .attr('height', space.right)
      .style('text-anchor', 'end')
      .style('font-weight', '100')
      .style('font-size', '12')
      .text((d) => d === 'blue' ? 'Riders with doping allegations' : 'No doping allegations')

    svg
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('r', 18)
      .attr('class', 'dot')
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => yScale(d.Time))
      .attr('data-xvalue', (d) => d.Year)
      .attr('data-yvalue', (d) => d.Time.toISOString())
      .style("fill", (d, i) => d.Doping !== "" ? `blue` : `orange`)
      .on("mouseover", showTooltip)
      .on('mouseout', hideTooltip)

    // for event functions 
    function showTooltip(d) {
      tooltip
        .style('opacity', 0.9)
        .style("display", "block")
        .style("left", d3.event.pageX + 10 + 'px')
        .style("top", d3.event.pageY - 40 + 'px')
        .style("transition", "all 0.3")
        .attr('data-year', `${d.Year}`)
        .html(`${d.Name}: ${d.Nationality}<br>Year:${d.Year}, Time:${timeFormat(d.Time)}<br><br> ${d.Doping !== "" ? d.Doping : ''}`);
    }
    function hideTooltip() {
      tooltip.style("display", "none")
    }
  }).catch(e => console.log(e));




