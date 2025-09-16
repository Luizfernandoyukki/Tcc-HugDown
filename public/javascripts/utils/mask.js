document.addEventListener('DOMContentLoaded', function() {
  var tokenInput = document.getElementById('token');
  if (tokenInput && typeof IMask !== 'undefined') {
    IMask(tokenInput, { mask: 'AAAAAA' });
  }
});