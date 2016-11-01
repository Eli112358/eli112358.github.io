function addDonateMessage() {
	var section=document.getElementById('downloads');
	section.innerHTML+='<br/>';
	section.innerHTML+='<a href="https://www.paypal.me/eli112358">Please consider donating</a>';
	section.innerHTML+='<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">';
	section.innerHTML+='<input type="hidden" name="cmd" value="_s-xclick" />';
	section.innerHTML+='<input type="hidden" name="hosted_button_id" value="PMRN2X7UBVB9J" />';
	section.innerHTML+='<input type="image" src="https://www.paypal.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate" />';
	section.innerHTML+='<img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />';
	section.innerHTML+='</form>';
}
