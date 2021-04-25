export const getLocalIp = callback => {
  window.RTCPeerConnection =
    window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  var pc = new RTCPeerConnection({ iceServers: [] }),
    noop = function() {};
  pc.createDataChannel(''); //create a bogus data channel
  pc.createOffer(pc.setLocalDescription.bind(pc), noop); // create offer andsetlocaldescription
  pc.onicecandidate = function(ice) {
    if (ice && ice.candidate && ice.candidate.address) {
      if (callback) {
        callback(ice.candidate.address);
      }
      pc.onicecandidate = noop;
    }
  };
};
