﻿window.CurrencyConverter = window.CurrencyConverter || {};
window.CurrencyConverter.history = (function () {
  var allHistory = {},
    initialize,
    updateInput,
    updateOutput,
    fillHistory,
    toggle,
    save,
    formatDate,
    formatTime,
    addZero,
    ordinal_suffix_of,
    formatData,
    isAllHistoryUptoDate = false,
      radioButtonClickBinding;

  toggle = function (event) {
    var container = document.querySelector('#history-wrapper'),
      tutorialButton = document.querySelector('#tutorial-button'),
      modals = document.querySelectorAll('.modal-container');

    // Update History
    if (!isAllHistoryUptoDate) {
      fillHistory();
      isAllHistoryUptoDate = true;
    }

    Array.prototype.forEach.call(modals, function (modal) {
      if (modal.id !== container.id) {
        modal.classList.remove('open');
      }
    });
    tutorialButton.classList.remove('highlight');
    // Highlight clicked button
    $(this).toggleClass('highlight');
    container.classList.toggle("open");
    event.stopPropagation();
  };
  formatDate = function (date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec'];

    return ordinal_suffix_of(date.getDate()) + " " +
      monthNames[date.getMonth()] + " " +
      date.getFullYear();
  };
  formatTime = function (date) {
    return addZero(date.getHours()) + ":" + addZero(date.getMinutes()) +
      ":" + addZero(date.getSeconds());
  };
  addZero = function (n) {
    if (n <= 9) {
      return "0" + n;
    }
    else {
      return n;
    }
  };
  ordinal_suffix_of = function (i) {
    var j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
      return i + "st";
    }
    if (j === 2 && k !== 12) {
      return i + "nd";
    }
    if (j === 3 && k !== 13) {
      return i + "rd";
    }
    return i + "th";
  };
  fillHistory = function () {
    var middle = '',
      i;
    if (allHistory.length === 0) {
      middle += '<div class="history-center-text">' +
              '<h2>You haven\'t converted anything yet!</h2>' +
              '<p>Once you have converted a value, ' +
              'the conversion will appear here.</p>' +
              '<div>';
    }
    else {
      middle += '<div class="header-row row">' +
                  '<span class="cell primary-history">Time</span>' +
                  '<span class="cell">From</span>' +
                  '<span class="cell">To</span>' +
                  '<span class="cell">Date</span>' +
                  '<span class="cell">Input</span>' +
                  '<span class="cell">Output</span>' +
                '</div>'
      for (i = allHistory.length - 1; i >= 0; i--) {
        middle += '<div class="row">' +
          '<input class="radio-input" type="radio" name="expand">' +
          '<span class="cell primary-history" data-label="Time">' +
          formatDate(allHistory[i][0]) + " " + formatTime(allHistory[i][0])
          + '</span>' +
          '<span class="cell history-basic-data" data-label="From">' +
          allHistory[i][1][0] + '</span>' +
          '<span class="cell history-basic-data" data-label="To">' +
          allHistory[i][1][1] + '</span>' +
          '<span class="cell history-basic-data" data-label="Date">' +
          formatDate(allHistory[i][1][2]) + '</span>' +
          '<span class="cell content" data-label="Input">' + formatData(allHistory[i][2])
          + '</span>' +
          '<span class="cell content" data-label="Output">' + formatData(allHistory[i][3])
          + '</span>' +
          '</div>';
      }
    }
    $('#history-table').html(middle);
    radioButtonClickBinding = $(".radio-input").click(
      function () {
      if ($(this).attr('checked')) {
        $(this).attr('checked', false);
      }
      else {
        $(this).attr('checked', true);
      }
    });
    
  };
  //time, [from, to, dateSelected], input, output
  updateInput = function (currencyDetails, input) {
    isAllHistoryUptoDate = false;
    if (allHistory.length >= 30) {
      allHistory.shift();
    }
    allHistory.push([new Date(), currencyDetails, input, []]);
    
  };

  updateOutput = function (output) {
    isAllHistoryUptoDate = false;
    allHistory[allHistory.length - 1][3] = output;
    save();
  };

  save = function () {
    var string = JSON.stringify(allHistory);
    Office.context.document.settings.set('history', string);
    Office.context.document.settings.saveAsync();
  };
  formatData = function (data) {
    var i,
      j,
      output = '';
    if (data instanceof Array) {
      output += '<table>';
      for (i = 0; i < data.length; i++) {
        output += '<tr>';
        for (j = 0; j < data[i].length; j++) {
          //if ($.isNumeric(data[i][j])) {
          //  output += '<td>' + parseFloat(data[i][j].toFixed(4)) + '</td>';
          //}
          //else {
            output += '<td>' + data[i][j] + '</td>';
          //}
        }
        output += '</tr>';
      }
      output += '</table>';
    }
    else {
      output = data;
    }
    return output;
  };


  initialize = function () {
    allHistory = Office.context.document.settings.get('history');
    if (allHistory && allHistory.length) {
      allHistory = JSON.parse(allHistory);
      for (var i = 0; i < allHistory.length; i++) {
        allHistory[i][0] = new Date(allHistory[i][0]);
        allHistory[i][1][2] = new Date(allHistory[i][1][2]);
      }
    }
    else {
      allHistory = [];
    }
  };

  return {
    initialize: initialize,
    toggle: toggle,
    updateInput: updateInput,
    updateOutput: updateOutput
  };
}());
