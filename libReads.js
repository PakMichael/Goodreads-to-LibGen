function findValueInDoc(doc, tag, attrib, conditionsArr, valueExtractFrom) {
  // findValueInDoc(document, 'span', 'itemprop', ['name'], 'innerText');

  // const elem=<tag attrib=[conditionsArr[0] || conditionsArr[1] || ...]>
  // return elem.valueExtractFrom
  const elMatch = doc.querySelectorAll(`${tag}[${attrib}]`);

  const result = [];
  elMatch.forEach((el) => {
    if (conditionsArr === undefined || conditionsArr.includes(el.attributes[attrib].value)) {
      if (valueExtractFrom !== undefined) {
        result.push(el[valueExtractFrom]);
      } else {
        result.push(el);
      }
    }
  });

  return result;
}

const bookAuthor = findValueInDoc(document, 'span', 'itemprop', ['name'], 'innerText');

const bookTitle = document.getElementById('bookTitle');
const bookTitleText = bookTitle.innerHTML.trim();
const bookLink = `http://gen.lib.rus.ec/search.php?req=${bookTitleText}&open=0&res=25&view=simple&phrase=1&column=title`;

const libLink = document.createElement('a');
libLink.setAttribute('href', bookLink);
libLink.innerText = ' (libGen)';

bookTitle.appendChild(libLink);

const oReq = new XMLHttpRequest();
function reqListener(responseText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(responseText, 'text/html');

  const ourAuthorsElements = [];

  doc.querySelectorAll('a[href]').forEach((el) => {
    if (bookAuthor.includes(el.innerText)) {
      ourAuthorsElements.push(el.parentNode.parentNode);
    }
  });

  const childNodes = [4, 15, 15, 15, 15, 15, 15, 15];
  // eslint-disable-next-line no-console
  console.log(ourAuthorsElements);
  const bookDownloadLink = document.createElement('div');
  bookDownloadLink.style = 'width: 100%; height: 65px;';

  const table = document.createElement('table');
  table.style = 'width: 100%; height: 100%;';

  ourAuthorsElements.forEach((el, index) => {
    if (index < 3) {
      const row = document.createElement('tr');
      row.style = 'display:flex;justify-content: end;align-items:center;';
      childNodes.forEach((nodeId) => {
        const column = document.createElement('th');

        if (nodeId === 4) {
          column.innerText = findValueInDoc(el.childNodes[nodeId], 'a', 'href', undefined, 'innerText')[0];
        } else {
          column.appendChild(el.childNodes[nodeId]);
        }
        row.appendChild(column);
      });
      table.appendChild(row);
    }
  });
  bookDownloadLink.appendChild(table);

  bookTitle.appendChild(bookDownloadLink);
}


oReq.addEventListener('load', () => {
  reqListener(oReq.responseText);
});

oReq.open('GET', bookLink);
oReq.overrideMimeType('text/plain; charset=x-user-defined');
oReq.send();
