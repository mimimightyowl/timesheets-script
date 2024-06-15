function fillMonthlyData() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var today = new Date();
    var month = today.getMonth(); // Текущий месяц (нумерация с 0)
    var year = today.getFullYear();
    
    // Получаем количество дней в текущем месяце
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    
    var data = [];
    
    for (var day = 1; day <= daysInMonth; day++) {
      var date = new Date(year, month, day);
      var dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      var hours = (dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday') ? '' : 8; // В выходные дни не заполняем часы
      
      data.push([date, dayOfWeek, hours]);
    }
    
    // Заполняем данные в таблице начиная с 7 строки
    sheet.getRange(7, 1, data.length, data[0].length).setValues(data);
  }
  
 function createNextMonthSheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  
  var today = new Date();
  var nextMonth = today.getMonth() + 1; // Следующий месяц (нумерация с 0)
  var year = today.getFullYear();
  
  if (nextMonth > 11) { // Если следующий месяц - январь следующего года
    nextMonth = 0;
    year += 1;
  }
  
  // Создаем копию текущего листа
  var newSheet = sheet.copyTo(spreadsheet);
  var newSheetName = Utilities.formatString('%d-%d', nextMonth + 1, year);
  newSheet.setName(newSheetName);
  
  // Очищаем старые данные начиная с 7 строки
  newSheet.getRange('A7:C').clearContent();
  
  // Получаем количество дней в следующем месяце
  var daysInNextMonth = new Date(year, nextMonth + 1, 0).getDate();
  
  var data = [];
  
  for (var day = 1; day <= daysInNextMonth; day++) {
    var date = new Date(year, nextMonth, day);
    var dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    data.push([date, dayOfWeek, '']);
  }
  
  // Заполняем данные в новой таблице начиная с 7 строки
  newSheet.getRange(7, 1, data.length, data[0].length).setValues(data);
}
  
  function createMonthlyTrigger() {
    ScriptApp.newTrigger('fillMonthlyData')
      .timeBased()
      .onMonthDay(1)
      .atHour(0)
      .create();
      
    ScriptApp.newTrigger('createNextMonthSheet')
      .timeBased()
      .onMonthDay(1)
      .atHour(1)
      .create();
  }
  