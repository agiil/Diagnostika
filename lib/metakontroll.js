/**
 * Metateabe kontrollimine
 */
var xmlCrypto = require('xml-crypto');
var xmldom = require('xmldom');

/*
  Vt https://www.npmjs.com/package/xml-crypto 
*/
exports.verifySignature = function(assertion, cert) {
  try {
    var doc = new xmldom.DOMParser().parseFromString(assertion);
    
    var sig = new xmlCrypto.SignedXml();
    
    // Võta välja allkiri (xml-crypto nõuab seda)
    var signature = xmlCrypto.xpath(doc, "/*/*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']")[0];

    sig.loadSignature(signature.toString());
    
    // { idAttribute: 'AssertionID' });

    sig.keyInfoProvider = {
      getKeyInfo: function (key) {
        return "<X509Data></X509Data>";
      },
      getKey: function (keyInfo) {
        return cert;
      }
    };

    var result = sig.checkSignature(assertion);

    if (!result) {
      console.log(sig.validationErrors);
    }
    
    return result;
  } catch (e) {
    console.log(e);
    return false;
  }

};
