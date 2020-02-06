var bookTitle=document.getElementById("bookTitle");
var bookTitleText=bookTitle.innerHTML.trim();
	
var libLink = document.createElement('a');


libLink.setAttribute('href',"http://gen.lib.rus.ec/search.php?req="+bookTitleText+"&open=0&res=25&view=simple&phrase=1&column=title");
libLink.innerText = " (libGen)";
bookTitle.appendChild(libLink);
