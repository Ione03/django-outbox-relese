!function(t){"object"==typeof module&&module.exports?module.exports=t.default=t:"function"==typeof define&&define.amd?define("highcharts/modules/data",["highcharts"],function(e){return t(e),t.Highcharts=e,t}):t("undefined"!=typeof Highcharts?Highcharts:void 0)}(function(e){function t(e,t,r,o){e.hasOwnProperty(t)||(e[t]=o.apply(null,r),"function"==typeof CustomEvent&&window.dispatchEvent(new CustomEvent("HighchartsModuleLoaded",{detail:{path:t,module:e[t]}})))}t(e=e?e._modules:{},"Core/HttpUtilities.js",[e["Core/Globals.js"],e["Core/Utilities.js"]],function(e,t){var a=e.doc,n=t.createElement,s=t.discardElement,i=t.merge,l=t.objectEach,r={ajax:function(t){var e={json:"application/json",xml:"application/xml",text:"text/plain",octet:"application/octet-stream"},r=new XMLHttpRequest;if(!t.url)return!1;r.open((t.type||"get").toUpperCase(),t.url,!0),t.headers&&t.headers["Content-Type"]||r.setRequestHeader("Content-Type",e[t.dataType||"json"]||e.text),l(t.headers,function(e,t){r.setRequestHeader(t,e)}),t.responseType&&(r.responseType=t.responseType),r.onreadystatechange=function(){if(4===r.readyState){if(200===r.status){if("blob"!==t.responseType){var e=r.responseText;if("json"===t.dataType)try{e=JSON.parse(e)}catch(e){if(e instanceof Error)return void(t.error&&t.error(r,e))}}return t.success&&t.success(e,r)}t.error&&t.error(r,r.responseText)}},t.data&&"string"!=typeof t.data&&(t.data=JSON.stringify(t.data)),r.send(t.data)},getJSON:function(e,t){r.ajax({url:e,success:t,dataType:"json",headers:{"Content-Type":"text/plain"}})},post:function(e,t,r){var o=n("form",i({method:"post",action:e,enctype:"multipart/form-data"},r),{display:"none"},a.body);l(t,function(e,t){n("input",{type:"hidden",name:t,value:e},void 0,o)}),o.submit(),s(o)}};return r}),t(e,"Extensions/Data.js",[e["Core/Chart/Chart.js"],e["Core/Globals.js"],e["Core/HttpUtilities.js"],e["Core/Series/Point.js"],e["Core/Series/SeriesRegistry.js"],e["Core/Utilities.js"],e["Core/DefaultOptions.js"]],function(e,t,r,s,o,a,n){function p(e){return!(!e||!(e.rowsURL||e.csvURL||e.columnsURL))}var u=t.doc,c=r.ajax,m=o.seriesTypes,i=n.getOptions,v=(t=a.addEvent,a.defined),l=a.extend,C=a.fireEvent,y=a.isNumber,f=a.merge,g=a.objectEach,h=a.pick,x=a.splat,d=(T.data=function(e,t,r){return new T(e,t=void 0===t?{}:t,r)},T.rowsToColumns=function(e){if(e)for(var t=[],r=e.length,o=0;o<r;o++)for(var a=e[o].length,n=0;n<a;n++)t[n]||(t[n]=[]),t[n][o]=e[o][n];return t},T.prototype.init=function(e,t,r){var o,a=e.decimalPoint;t&&(this.chartOptions=t),r&&(this.chart=r),"."!==a&&","!==a&&(a=void 0),this.options=e,this.columns=e.columns||this.rowsToColumns(e.rows)||[],this.firstRowAsNames=h(e.firstRowAsNames,this.firstRowAsNames,!0),this.decimalRegex=a&&new RegExp("^(-?[0-9]+)"+a+"([0-9]+)$"),void 0!==this.liveDataTimeout&&clearTimeout(this.liveDataTimeout),this.rawColumns=[],this.columns.length&&(this.dataFound(),o=!p(e)),!(o=(o=(o=(o=o||this.fetchLiveData())||!!this.parseCSV().length)||!!this.parseTable().length)||this.parseGoogleSpreadsheet())&&e.afterComplete&&e.afterComplete()},T.prototype.getColumnDistribution=function(){function s(e){return(m[e||"line"].prototype.pointArrayMap||[0]).length}var i,l=this.chartOptions,e=this.options,t=[],u=l&&l.chart&&l.chart.type,d=[],h=[],e=e&&e.seriesMapping||l&&l.series&&l.series.map(function(){return{x:0}})||[],p=0;(l&&l.series||[]).forEach(function(e){d.push(s(e.type||u))}),e.forEach(function(e){t.push(e.x||0)}),0===t.length&&t.push(0),e.forEach(function(e){var r=new R,t=d[p]||s(u),o=(l&&l.series||[])[p]||{},a=m[o.type||u||"line"].prototype.pointArrayMap,n=a||["y"];for(!v(e.x)&&!o.isCartesian&&a||r.addColumnReader(e.x,"x"),g(e,function(e,t){"x"!==t&&r.addColumnReader(e,t)}),i=0;i<t;i++)r.hasReader(n[i])||r.addColumnReader(void 0,n[i]);h.push(r),p++}),e=m[u||"line"].prototype.pointArrayMap,this.valueCount={global:s(u),xColumns:t,individual:d,seriesBuilders:h,globalPointArrayMap:e=void 0===e?["y"]:e}},T.prototype.dataFound=function(){this.options.switchRowsAndColumns&&(this.columns=this.rowsToColumns(this.columns)),this.getColumnDistribution(),this.parseTypes(),!1!==this.parsed()&&this.complete()},T.prototype.parseCSV=function(e){var t,i,l,u=this,m=this.columns=[],d=e||this.options,f=void 0!==d.startColumn&&d.startColumn?d.startColumn:0,g=d.endColumn||Number.MAX_VALUE,v=[],h={",":0,";":0,"\t":0},r=d.csv,o=(e=void 0!==d.startRow&&d.startRow?d.startRow:0,d.endRow||Number.MAX_VALUE),a=0;if(r=r&&d.beforeParse?d.beforeParse.call(this,r):r){for(var r=r.replace(/\r\n/g,"\n").replace(/\r/g,"\n").split(d.lineDelimiter||"\n"),y=((!e||e<0)&&(e=0),(!o||o>=r.length)&&(o=r.length-1),d.itemDelimiter||(y=null,l=i=0,(t=r).some(function(e,t){var r=!1,o="";if(13<t)return!0;for(var a=0;a<e.length;a++){t=e[a];var n=e[a+1],s=e[a-1];if("#"===t)break;if('"'===t)if(r){if('"'!==s&&'"'!==n){for(;" "===n&&a<e.length;)n=e[++a];void 0!==h[n]&&h[n]++,r=!1}}else r=!0;else void 0!==h[t]?(o=o.trim(),isNaN(Date.parse(o))&&!isNaN(o)&&isFinite(o)||h[t]++,o=""):o+=t;","===t&&l++,"."===t&&i++}}),t=h[";"]>h[","]?";":",",d.decimalPoint||(d.decimalPoint=l<i?".":",",u.decimalRegex=new RegExp("^(-?[0-9]+)"+d.decimalPoint+"([0-9]+)$")),t)),n=0,a=e;a<=o;a++)"#"===r[a][0]?n++:function(t,e,r,o){function a(e){l=t[e],u=t[e-1],d=t[e+1]}function n(e){v.length<c+1&&v.push([e]),v[c][v[c].length-1]!==e&&v[c].push(e)}function s(){p<f||g<p?(++p,h=""):(!isNaN(parseFloat(h))&&isFinite(h)?(h=parseFloat(h),n("number")):isNaN(Date.parse(h))?n("string"):(h=h.replace(/\//g,"-"),n("date")),m.length<c+1&&m.push([]),r||(m[c][e]=h),h="",++c,++p)}var i=0,l="",u="",d="",h="",p=0,c=0;if(t.trim().length&&"#"!==t.trim()[0]){for(;i<t.length;i++)if(a(i),'"'===l)for(a(++i);i<t.length&&('"'!==l||'"'===u||'"'===d);)('"'!==l||'"'===l&&'"'!==u)&&(h+=l),a(++i);else o&&o[l]?o[l](l,h)&&s():l===y?s():h+=l;s()}}(r[a],a-e-n);d.columnTypes&&0!==d.columnTypes.length||!v.length||!v[0].length||"date"!==v[0][1]||d.dateFormat||(d.dateFormat=function(e,t){var r=[],o=[],a=[],n=0,s=!1;for((!t||t>e.length)&&(t=e.length);n<t;n++)if(void 0!==e[n]&&e[n]&&e[n].length)for(var i=e[n].trim().replace(/\//g," ").replace(/\-/g," ").replace(/\./g," ").split(" "),a=["","",""],l=0;l<i.length;l++)l<a.length&&(i[l]=parseInt(i[l],10),i[l]&&(o[l]=(!o[l]||o[l]<i[l]?i:o)[l],void 0!==r[l]?r[l]!==i[l]&&(r[l]=!1):r[l]=i[l],31<i[l]?a[l]=i[l]<100?"YY":"YYYY":12<i[l]&&i[l]<=31?(a[l]="dd",s=!0):a[l].length||(a[l]="mm")));if(s){for(l=0;l<r.length;l++)!1!==r[l]?12<o[l]&&"YY"!==a[l]&&"YYYY"!==a[l]&&(a[l]="YY"):12<o[l]&&"mm"===a[l]&&(a[l]="dd");return 3===a.length&&"dd"===a[1]&&"dd"===a[2]&&(a[2]="YY"),e=a.join("/"),(d.dateFormats||u.dateFormats)[e]?e:(C("deduceDateFailed"),"YYYY/mm/dd")}return"YYYY/mm/dd"}(m[0])),this.dataFound()}return m},T.prototype.parseTable=function(){var e=this.options,n=this.columns||[],s=e.startRow||0,t=e.endRow||Number.MAX_VALUE,i=e.startColumn||0,l=e.endColumn||Number.MAX_VALUE;return e.table&&("string"==typeof(e=e.table)&&(e=u.getElementById(e)),[].forEach.call(e.getElementsByTagName("tr"),function(e,a){s<=a&&a<=t&&[].forEach.call(e.children,function(e,t){var r=n[t-i],o=1;if(("TD"===e.tagName||"TH"===e.tagName)&&i<=t&&t<=l)for(n[t-i]||(n[t-i]=[]),n[t-i][a-s]=e.innerHTML;o<=a-s&&void 0===r[a-s-o];)r[a-s-o]=null,o++})}),this.dataFound()),n},T.prototype.fetchLiveData=function(){var s=this,i=this.chart,l=this.options,u=l.enablePolling,t=f(l),d=0,h=1e3*(l.dataRefreshRate||2);return!!p(l)&&(h<1e3&&(h=1e3),delete l.csvURL,delete l.rowsURL,delete l.columnsURL,function a(n){function e(e,t,r){function o(){u&&i.liveDataURL===e&&(s.liveDataTimeout=setTimeout(a,h))}return e&&/^(http|\/|\.\/|\.\.\/)/.test(e)?(n&&(clearTimeout(s.liveDataTimeout),i.liveDataURL=e),c({url:e,dataType:r||"json",success:function(e){i&&i.series&&t(e),o()},error:function(e,t){return++d<3&&o(),l.error&&l.error(t,e)}}),1):(e&&l.error&&l.error("Invalid URL"),0)}e(t.csvURL,function(e){i.update({data:{csv:e}})},"text")||e(t.rowsURL,function(e){i.update({data:{rows:e}})})||e(t.columnsURL,function(e){i.update({data:{columns:e}})})}(!0),p(l))},T.prototype.parseGoogleSpreadsheet=function(){var o=this,a=this.options,n=a.googleSpreadsheetKey,t=this.chart,s=Math.max(1e3*(a.dataRefreshRate||2),4e3),i=function(){var e,t;return a.googleSpreadsheetRange||(e=("ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(a.startColumn||0)||"A")+((a.startRow||0)+1),t="ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(h(a.endColumn,-1))||"ZZ",v(a.endRow)&&(t+=a.endRow+1),""+e+":".concat(t))};return n&&(delete a.googleSpreadsheetKey,function t(r){var e=["https://sheets.googleapis.com/v4/spreadsheets",n,"values",i(),"?alt=json&majorDimension=COLUMNS&valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING&key="+a.googleAPIKey].join("/");c({url:e,dataType:"json",success:function(e){r(e),a.enablePolling&&(o.liveDataTimeout=setTimeout(function(){t(r)},s))},error:function(e,t){return a.error&&a.error(t,e)}})}(function(e){if(!(e=e.values)||0===e.length)return!1;var r=e.reduce(function(e,t){return Math.max(e,t.length)},0);e.forEach(function(e){for(var t=0;t<r;t++)void 0===e[t]&&(e[t]=null)}),t&&t.series?t.update({data:{columns:e}}):(o.columns=e,o.dataFound())})),!1},T.prototype.trim=function(e,t){return"string"==typeof e&&(e=e.replace(/^\s+|\s+$/g,""),t&&/^[0-9\s]+$/.test(e)&&(e=e.replace(/\s/g,"")),this.decimalRegex&&(e=e.replace(this.decimalRegex,"$1.$2"))),e},T.prototype.parseTypes=function(){for(var e=this.columns||[],t=e.length;t--;)this.parseColumn(e[t],t)},T.prototype.parseColumn=function(e,t){var r,o,a=this.rawColumns,n=this.columns,s=this.firstRowAsNames,i=-1!==this.valueCount.xColumns.indexOf(t),l=[],u=this.chartOptions,d=(this.options.columnTypes||[])[t],u=i&&(u&&u.xAxis&&"category"===x(u.xAxis)[0].type||"string"===d),h=v(e.name),p=e.length;for(a[t]||(a[t]=[]);p--;){var c=l[p]||e[p],m=this.trim(c),f=this.trim(c,!0),g=parseFloat(f);void 0===a[t][p]&&(a[t][p]=m),u||0===p&&s&&!h?e[p]=""+m:+f===g?(31536e6<(e[p]=g)&&"float"!==d?e.isDatetime=!0:e.isNumeric=!0,void 0!==e[p+1]&&(o=g>e[p+1])):(m&&m.length&&(r=this.parseDate(c)),i&&y(r)&&"float"!==d?(l[p]=c,e[p]=r,e.isDatetime=!0,void 0!==e[p+1]&&((c=r>e[p+1])!==o&&void 0!==o&&(this.alternativeFormat?(this.dateFormat=this.alternativeFormat,p=e.length,this.alternativeFormat=this.dateFormats[this.dateFormat].alternative):e.unsorted=!0),o=c)):(e[p]=""===m?null:m,0!==p&&(e.isDatetime||e.isNumeric)&&(e.mixed=!0)))}if(i&&e.mixed&&(n[t]=a[t]),i&&o&&this.options.sort)for(t=0;t<n.length;t++)n[t].reverse(),s&&n[t].unshift(n[t].pop())},T.prototype.parseDate=function(e){var t,r,o=this.options.parseDate,a=this.options.dateFormat||this.dateFormat;if(o)var n=o(e);else if("string"==typeof e){if(a)o=(o=this.dateFormats[a])||this.dateFormats["YYYY/mm/dd"],(r=e.match(o.regex))&&(n=o.parser(r));else for(t in this.dateFormats)if(o=this.dateFormats[t],r=e.match(o.regex)){this.dateFormat=t,this.alternativeFormat=o.alternative,n=o.parser(r);break}r||(e.match(/:.+(GMT|UTC|[Z+-])/)&&(e=e.replace(/\s*(?:GMT|UTC)?([+-])(\d\d)(\d\d)$/,"$1$2:$3").replace(/(?:\s+|GMT|UTC)([+-])/,"$1").replace(/(\d)\s*(?:GMT|UTC|Z)$/,"$1+00:00")),"object"==typeof(r=Date.parse(e))&&null!==r&&r.getTime?n=r.getTime()-6e4*r.getTimezoneOffset():y(r)&&(n=r-6e4*new Date(r).getTimezoneOffset()))}return n},T.prototype.getData=function(){if(this.columns)return this.rowsToColumns(this.columns).slice(1)},T.prototype.parsed=function(){if(this.options.parsed)return this.options.parsed.call(this,this.columns)},T.prototype.complete=function(){var e,t=this.columns,r=this.options,o=[];if(r.complete||r.afterComplete){if(this.firstRowAsNames)for(i=0;i<t.length;i++){var a=t[i];v(a.name)||(a.name=h(a.shift(),"").toString())}var a=[],n=t.length,s=this.valueCount.seriesBuilders,i=[],l=[];for(d=0;d<n;d+=1)i.push(!0);for(n=0;n<s.length;n+=1)for(var u=s[n].getReferencedColumnIndexes(),d=0;d<u.length;d+=1)i[u[d]]=!1;for(d=0;d<i.length;d+=1)i[d]&&l.push(d);for(i=0;i<this.valueCount.seriesBuilders.length;i++)(s=this.valueCount.seriesBuilders[i]).populateColumns(l)&&o.push(s);for(;0<l.length;){for((s=new R).addColumnReader(0,"x"),-1!==(i=l.indexOf(0))&&l.splice(i,1),i=0;i<this.valueCount.global;i++)s.addColumnReader(void 0,this.valueCount.globalPointArrayMap[i]);s.populateColumns(l)&&o.push(s)}if(0<o.length&&0<o[0].readers.length&&(void 0!==(l=t[o[0].readers[0].columnIndex])&&(l.isDatetime?e="datetime":l.isNumeric||(e="category"))),"category"===e)for(i=0;i<o.length;i++)for(s=o[i],l=0;l<s.readers.length;l++)"x"===s.readers[l].configName&&(s.readers[l].configName="name");for(i=0;i<o.length;i++){for(s=o[i],l=[],d=0;d<t[0].length;d++)l[d]=s.read(t,d);a[i]={data:l},s.name&&(a[i].name=s.name),"category"===e&&(a[i].turboThreshold=0)}t={series:a},e&&(t.xAxis={type:e},"category"===e&&(t.xAxis.uniqueNames=!1)),r.complete&&r.complete(t),r.afterComplete&&r.afterComplete(t)}},T.prototype.update=function(e,t){var r=this.chart,o=r.options;e&&(e.afterComplete=function(e){e&&(e.xAxis&&r.xAxis[0]&&e.xAxis.type===r.xAxis[0].options.type&&delete e.xAxis,r.update(e,t,!0))},f(!0,o.data,e),o.data&&o.data.googleSpreadsheetKey&&!e.columns&&delete o.data.columns,this.init(o.data))},T);function T(e,t,r){void 0===t&&(t={}),this.rowsToColumns=T.rowsToColumns,this.dateFormats={"YYYY/mm/dd":{regex:/^([0-9]{4})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{1,2})$/,parser:function(e){return e?Date.UTC(+e[1],e[2]-1,+e[3]):NaN}},"dd/mm/YYYY":{regex:/^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{4})$/,parser:function(e){return e?Date.UTC(+e[3],e[2]-1,+e[1]):NaN},alternative:"mm/dd/YYYY"},"mm/dd/YYYY":{regex:/^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{4})$/,parser:function(e){return e?Date.UTC(+e[3],e[1]-1,+e[2]):NaN}},"dd/mm/YY":{regex:/^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{2})$/,parser:function(e){var t;return e?(t=(t=+e[3])>(new Date).getFullYear()-2e3?1900+t:2e3+t,Date.UTC(t,e[2]-1,+e[1])):NaN},alternative:"mm/dd/YY"},"mm/dd/YY":{regex:/^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{2})$/,parser:function(e){return e?Date.UTC(+e[3]+2e3,e[1]-1,+e[2]):NaN}}},this.chart=r,this.chartOptions=t,this.options=e,this.rawColumns=[],this.init(e,t,r)}t(e,"init",function(e){var o=this,a=e.args[1],t=i().data,n=e.args[0]||{};(t||n&&n.data)&&!o.hasDataDef&&(o.hasDataDef=!0,t=f(t,n.data),o.data=new d(l(t,{afterComplete:function(e){var t;if(Object.hasOwnProperty.call(n,"series"))if("object"==typeof n.series)for(t=Math.max(n.series.length,e&&e.series?e.series.length:0);t--;){var r=n.series[t]||{};n.series[t]=f(r,e&&e.series?e.series[t]:{})}else delete n.series;n=f(e,n),o.init(n,a)}}),n,o),e.preventDefault())});N.prototype.populateColumns=function(t){var r=!0;return this.readers.forEach(function(e){void 0===e.columnIndex&&(e.columnIndex=t.shift())}),this.readers.forEach(function(e){void 0===e.columnIndex&&(r=!1)}),r},N.prototype.read=function(r,o){var e,a=this.pointIsArray,n=a?[]:{};return this.readers.forEach(function(e){var t=r[e.columnIndex][o];a?n.push(t):0<e.configName.indexOf(".")?s.prototype.setNestedProperty(n,t,e.configName):n[e.configName]=t}),void 0===this.name&&2<=this.readers.length&&(2<=(e=this.getReferencedColumnIndexes()).length&&(e.shift(),e.sort(function(e,t){return e-t}),this.name=r[e.shift()].name)),n},N.prototype.addColumnReader=function(e,t){this.readers.push({columnIndex:e,configName:t}),"x"!==t&&"y"!==t&&void 0!==t&&(this.pointIsArray=!1)},N.prototype.getReferencedColumnIndexes=function(){for(var e=[],t=0;t<this.readers.length;t+=1){var r=this.readers[t];void 0!==r.columnIndex&&e.push(r.columnIndex)}return e},N.prototype.hasReader=function(e){for(var t=0;t<this.readers.length;t+=1)if(this.readers[t].configName===e)return!0};var R=N;function N(){this.readers=[],this.pointIsArray=!0}return d}),t(e,"masters/modules/data.src.js",[e["Core/Globals.js"],e["Core/HttpUtilities.js"],e["Extensions/Data.js"]],function(e,t,r){e.ajax=t.ajax,e.data=r.data,e.getJSON=t.getJSON,e.post=t.post,e.Data=r,e.HttpUtilities=t})});