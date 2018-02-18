function alusta() {
}

/* Metateabe serdi üleslaadimine
  1) lokaalse faili valimine
  2) faili lugemine sirvikusse (FileReader)
  vt https://www.html5rocks.com/en/tutorials/file/dndfiles/
*/

var valitudFail;
var sert;

function tootleFailivalik(valitudFailid) {
  valitudFail = valitudFailid[0];
  $('#valitudFail').text(valitudFail.Name);
}

function loeFailSirvikusse() {
  // alert('loeFailSirvikusse');
  var reader = new FileReader();
  reader.onload = function () {
    // alert('Fail loetud');
    sert = reader.result;
    $('#sert').text(reader.result);
  };
  reader.readAsText(valitudFail);
}

/* Metateabe kontrollimine
  1) metateabe URL-i üleslaadimine
  2) URL-i ja serdi saatmine kontrollimiseks serverisse (jQuery AJAX)  
*/
function kontrolliMeta() {
  var url = $('#metaurl').val();
  $.post("http://localhost:5000/metakontroll",
  //$.post("https://diagnostika.herokuapp.com/metakontroll",
    {
      url: url,
      sert: sert
    },
    function (data, status) {
      if (!status === 'success') {
        $('#metakontrollitulemus').text('Pöördumine diagnostikaserveri poole ebaõnnestus');
      }
      $('#metakontrollitulemus').html(data);
    });
}