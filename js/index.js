'use strict';

var url = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";
//41020D
var margin = { top: 100, right: 20, bottom: 100, left: 80 };
var w = window.innerWidth;
var h = window.innerHeight;
var height = h * 0.95,
    width = w * 0.8;

var chart = d3.select('#chart').append('svg').attr('width', width).attr('height', height).style('background', '#4A1908');

var tooltip = d3.select('body').append('div').style('position', 'absolute').style('text-align', 'center').style('padding', '5px 10px').style('background', 'green').style('color', '#FFF').style('border-radius', '5px').style('opacity', 0);

d3.json(url, function (data) {
  var nodes = data.nodes;
  var links = data.links;

  var force = d3.layout.force().nodes(nodes).links(links).charge(-75).size([width, height - 25]).linkDistance(50);

  var link = chart.selectAll('line').data(links).enter().append('line').attr('stroke', 'white').attr('stroke-width', .5);

  var node = d3.select('#flags').selectAll('.node').data(nodes).enter().append('img').attr('class', function (d) {
    return 'flag flag-' + d.code;
  }).call(force.drag).on('mouseover', function (d, i) {
    tooltip.transition().style('opacity', .9);
    tooltip.html(d.country).style('left', d3.event.pageX - 35 + 'px').style('top', d3.event.pageY - 35 + 'px');
  }).on('mouseout', function (d) {
    tooltip.transition().delay(300).style('opacity', 0);
  });

  var title = chart.append('text').attr('x', width / 2).attr('y', 40).attr("text-anchor", "middle").attr('text-decoration', 'underline').style('font-size', '1.6em').style('fill', 'silver').text("National Contiguity with a Force Directed Graph");

  force.on('tick', function () {
    node.attr('transform', function (d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    });
    link.attr('x1', function (d) {
      return d.source.x;
    }).attr('y1', function (d) {
      return d.source.y;
    }).attr('x2', function (d) {
      return d.target.x;
    }).attr('y2', function (d) {
      return d.target.y;
    });

    node.style('top', function (d) {
      return d.y - 6 + 'px';
    }).style('left', function (d) {
      return d.x - 8 + 'px';
    });
  });
  force.start();
});