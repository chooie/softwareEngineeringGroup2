﻿window.CurrencyConverter = window.CurrencyConverter || {};
window.CurrencyConverter.graph = (function () {
  var updateGraph,
    initialize;

  updateGraph = function(values) {
    
    var fromCur = $('#from-currency').val(),
      toCur = $('#to-currency').val(),
      graphData,
      date = window.CurrencyConverter.datepicker.getSelectedDate(),
      dateAtOne = new Date(date),
      day = [],
      i;
    try {
      if (! Array.isArray(values)) {
        throw new Error("updateGraph(): Paramater [0] must be an instance of " +
          "Array.");
      }
      dateAtOne.setHours(dateAtOne.getHours() + 1);
      for (i = 0; i < values.length; i++) {
        if (date.valueOf() === values[i][0].valueOf() ||
            dateAtOne.valueOf() === values[i][0].valueOf()) {
          day.push(values[i]);
        }
      }
   
      $('#graph-label').text(fromCur + " to " + toCur);

      // Graph Data ##############################################
      graphData = [{
        // [Date, Value] 2010/08/17
        data: values,
        color: '#71c73e'
      },
      {
        data: day,
        color: '#2a8dd4'
      }];

      // Lines Graph #############################################
      $.plot($('#graph-lines'), graphData, {
        series: {
          points: {
            show: true,
            radius: 5
          },
          lines: {
            show: true
          },
          shadowSize: 0
        },
        grid: {
          color: '#646464',
          borderColor: 'transparent',
          borderWidth: 20,
          hoverable: true
        },
        xaxis: {
          tickColor: 'transparent',
          mode: "time",
          timeformat: "%d/%m"
        },
        yaxis: {}
      });
    } catch (e) {
      console.log("Exception: " + e.name + " - " + e.message);
      return;
    }
  };

  // Common initialization function (to be called from each page)
  initialize = function() {
    // add graph to home
    updateGraph();
    // Tooltip #################################################
    function showTooltip(x, y, contents) {
      var width = $('#graph-container').width();
      if (width * 0.65 < x) {
        $('<div id="tooltip">' + contents + '</div>').css({
          top: y - 16,
          left: x - (contents.length * 7) - 20
        }).appendTo('body').fadeIn();
      }
      else {
        $('<div id="tooltip">' + contents + '</div>').css({
          top: y - 16,
          left: x + 20
        }).appendTo('body').fadeIn();
      }
    }

    var previousPoint = null;

    $('#graph-lines').bind('plothover',
      function(event, pos, item) {
        if (item) {
          if (previousPoint !== item.dataIndex) {
            previousPoint = item.dataIndex;
            $('#tooltip').remove();
            var x = item.datapoint[0],
              y = item.datapoint[1],
              date = new Date(x),
              dateString = date.getDate() + "/" +
                (date.getMonth() + 1) + "/" +
                date.getFullYear();

            showTooltip(item.pageX, item.pageY, y.toFixed(3) +
            ' at ' + dateString);
          }
        } else {
          $('#tooltip').remove();
          previousPoint = null;
        }
      }
    );
    $('#graph-container').resize();
  };

  return {
    initialize: initialize,
    update: updateGraph
  };
}());
