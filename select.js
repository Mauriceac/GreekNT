$(".verse-text").click(function(e) {
  var s = window.getSelection();
  var range = s.getRangeAt(0);
  var node = s.anchorNode;

  // Adjust the start offset to the nearest word boundary
  while (range.toString().indexOf(' ') != 0 && range.startOffset > 0) {
    range.setStart(node, (range.startOffset - 1));
  }
  if (range.startOffset != 0) {
    range.setStart(node, range.startOffset + 1);
  }

  // Adjust the end offset to the nearest word boundary
  while (range.toString().indexOf(' ') == -1 && range.toString().trim() != '' && range.endOffset < node.length) {
    range.setEnd(node, range.endOffset + 1);
  }
  if (range.endOffset != node.length) {
    range.setEnd(node, range.endOffset - 1);
  }

  var str = range.toString().trim().replace(/[.,:;]/g, '');
  console.log(str);
  
  const valueToServer = str;

fetch('http://localhost:3000/fetch-data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ value: valueToServer })
})
  .then(response => response.json())
  .then(data => {
    // Process the response data from the server
    const definitions = [];
    
    data.forEach(definition => {
      definitions.push(definition.definition);
    });
    document.getElementById("definition").innerHTML = definitions.join('<br/><br/>============<br/><br/>');
  })
  .catch(error => {
    console.error('Error:', error);
  });


});
