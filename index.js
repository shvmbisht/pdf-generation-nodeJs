var PdfPrinter = require('pdfmake');

const fs = require('fs');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const url = 'http://api.affixus.com/pub/home/live/5c9f4d3003d5dba159be3efd';
  
var xhReq = new XMLHttpRequest();
xhReq.open("GET", url, false);
xhReq.send(null);
var data = JSON.parse(xhReq.responseText);
   
var dataObj = {}
dataObj["tournamentName"]  = data.data.tournamentId .name;
dataObj["round"]  = data.data.round;
dataObj["sport"]  = data.data.sportId.name;
dataObj["stadiumName"] = data.data.resourceId.name;
dataObj["firstTeam"]  = data.data.firstTeam.name;
dataObj["secondTeam"]  = data.data.secondTeam.name;
dataObj["winningTeam"]  = data.data.scoreBoards[0].winningTeam.name;
dataObj["tossWinTeam"]  = data.data.tossInfo.team.name;
dataObj["tossWinDecision"]  = data.data.tossInfo.decision;
dataObj["secondTeamPlayingList"] = data.data.secondTeamInfo.playingList;
dataObj["firstTeamPlayingList"] = data.data.firstTeamInfo.playingList;
dataObj["secondTeamPlayingOffList"] = data.data.secondTeamInfo.playingListOffField;
dataObj["firstTeamPlayingOffList"] = data.data.firstTeamInfo.playingListOffField;
dataObj["summary"] = data.data.summary;
dataObj["derMessage"] = data.data.derMessage;
var teamColumns = ['Sr No', 'Player Name', 'Jersey No' ];

function createdData(data){
    var temp = new Array();
    var num = 0;
    for(let elem of data){
        var arr = new Array();
        arr['Sr No'] = ++num;
        arr['Player Name'] = elem.userid["fullname"];
        arr['Jersey No'] = elem["jerseyNumber"];
        temp.push(arr);
    }
    return temp;
}
function createdSummaryData(data,firstTeam, secondTeam){
    var temp = new Array();
    var num = 0;
    for(let elem of data){
        var arr = new Array();
        arr['Stats'] = elem.type.replace(/_/g, " ");
        arr[firstTeam] = elem["firstTeam"];
        arr[secondTeam] = elem["secondTeam"];
        temp.push(arr);
    }
    return temp;
}
let firstTeam = dataObj["firstTeam"];
let secondTeam = dataObj["secondTeam"];
let firstPlayingList = createdData(dataObj["firstTeamPlayingList"]);
let secondPlayingList = createdData(dataObj["secondTeamPlayingList"]);
let firstPlayingOffList = createdData(dataObj["firstTeamPlayingOffList"]);
let secondPlayingOffList = createdData(dataObj["secondTeamPlayingOffList"]);
let summaryData = createdSummaryData(dataObj["summary"],firstTeam , secondTeam );

function buildTableBody(data, cols) {
    var body = [];

    body.push(cols);

    data.forEach(function(row) {
        var dataRow = [];

        cols.forEach(function(column) {
            dataRow.push(row[column].toString());
        })

        body.push(dataRow);
    });

    return body;
}


function table(data, cols) {
    
    return {
        width: '*',
        layout: tableLayout ,
        style : tableStyle,
        table: {
            headerRows: 1,
            body: buildTableBody(data, cols)
        }
    };
}

var fonts = {
    Courier: {
      normal: 'Courier',
      bold: 'Courier-Bold',
      italics: 'Courier-Oblique',
      bolditalics: 'Courier-BoldOblique'
    },
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique'
    },
    Times: {
      normal: 'Times-Roman',
      bold: 'Times-Bold',
      italics: 'Times-Italic',
      bolditalics: 'Times-BoldItalic'
    },
    Symbol: {
      normal: 'Symbol'
    },
    ZapfDingbats: {
      normal: 'ZapfDingbats'
    },
    Roboto: {
		normal: 'fonts/Roboto-Regular.ttf',
		bold: 'fonts/Roboto-Medium.ttf',
		italics: 'fonts/Roboto-Italic.ttf',
		bolditalics: 'fonts/Roboto-MediumItalic.ttf'
	}

  }; 
  var tableLayout = {
    hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 0.5 : 0.3;
    },
    vLineWidth: function (i, node) {
        return (i === 0 || i === node.table.widths.length) ? 0.5 : 0.3;;
    },
    hLineColor: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
    },
    vLineColor: function (i, node) {
        return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
    }
};
var pageBorder = {
    //set custom borders size and color
    hLineWidth: function (i, node) {
      return (i === 0 || i === node.table.body.length) ? 1 : 1;
    },
    vLineWidth: function (i, node) {
      return (i === 0 || i === node.table.widths.length) ? 1 : 1;
    },
    hLineColor: function (i, node) {
      return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
    },
    vLineColor: function (i, node) {
      return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
    }
  }
var tableStyle = {
    fontSize: 11,
    color: 'black'
};
var docDefinition = {
    pageSize: 'A4',
    
    content: [
        {
            layout: pageBorder,
            table: {
                body: [[{
                  stack: [
                    

          {text: dataObj["tournamentName"], style: { fontSize: 16, bold: true, alignment: 'center' }, margin: [0, 8, 0, 8] },
          {text: dataObj["sport"] + ' ScoreSheet', style: { fontSize: 14, bold: true, alignment: 'center' }, margin: [0, 0, 0, 8]},
          {
              layout: tableLayout,
              style: tableStyle, 
                  table: {
                
                    headerRows: 1,
                    widths: [ '*', 'auto', 100, '*' ],
            
                    body: [
                      [ 'Round No.', 'Stadium', 'Winning Team', 'Toss' ],
                      [  dataObj["round"] , dataObj["stadiumName"], dataObj["winningTeam"], [dataObj["tossWinTeam"], dataObj["tossWinDecision"]].toString()]
                    ]
                  }
              },
              {
                  columns: [
                      {text: 'Team 1: ' +  firstTeam , width: '*', fontSize: 12 ,margin: [0, 10, 0, 8]},
                      {text: 'Team 2: ' +  secondTeam , width: '*',fontSize: 12, margin: [0, 10, 0, 8]}
                  ],
                  columnGap: 2
              },
             
              {
              
          columns: [
              
              table(firstPlayingList, ['Sr No', 'Player Name', 'Jersey No' ] ),
              table(secondPlayingList, ['Sr No', 'Player Name', 'Jersey No' ])
          ],
          // optional space between columns
          columnGap: 2
        },
        {
          columns: [
              {text: 'Team 1: ' +  firstTeam + ' Subs' , width: '*', margin: [0, 10, 0, 8]},
              {text: 'Team 2: ' +  secondTeam + ' Subs' , width: '*', margin: [0, 10, 0, 8]}
          ],
          columnGap: 2
      },
        {
              
          columns: [
              
              table(firstPlayingOffList, ['Sr No', 'Player Name', 'Jersey No' ]),
              table(secondPlayingOffList, ['Sr No', 'Player Name', 'Jersey No' ])
          ],
          // optional space between columns
          columnGap: 2
        },
        {text: 'Summary:', fontSize: 13, margin: [0, 0, 0, 5]},
        {
              
          columns: [
              table(summaryData, [ 'Stats', firstTeam, secondTeam  ])
          ],
          // optional space between columns
          columnGap: 2
      }
                  ]
                }]]
              }
        }
    ],
    styles: {
		header: {
			fontSize: 14,
			bold: true,
            margin: [0, 0, 0, 10],
            alignment: 'center'
		},
		subheader: {
			fontSize: 12,
			bold: true,
			margin: [0, 10, 0, 5]
		},
		tableExample: {
			margin: [0, 5, 0, 15]
		},
		tableHeader: {
			bold: true,
			fontSize: 11,
			color: 'black'
        },
        
	}
  };


const doc = new PdfPrinter(fonts).createPdfKitDocument(docDefinition)
doc.pipe(fs.createWriteStream('myFile.pdf'))
doc.end()
