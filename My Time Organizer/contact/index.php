<!DOCTYPE html>
<!--
/* [?] My Time Organizer @ Google Apps Hackathon 12.11.2011 (11/12/2011)
 * [+] Authors: 
 * - Dominik Galewski (mug3tsu)
 * - Sebastian Krzyszkowiak (dos)
 * - Krzysztof Marciniak (hun7er)
 * [!] [alphabetical order]
 */
-->
<?
mail('mto@dosowisko.net', 'Wiadomość z formularza MTO: '.$_POST['title'], 'Od: '.$_POST['mail']."\n\n".$_POST['content'],
'From: "My Time Organizer" <mto@dosowisko.net>' . "\r\n" .'Content-type: text/plain; charset=utf-8' . "\r\n");
?>
<html>
	<head>
		<meta charset="utf-8">
		<title>My Time Organizer</title>
		<style>
			html { background-color: whiteSmoke; }
			body { text-align: center; font-family: Sans-Serif; margin: 0; padding-top: 5px; }
			body::before {
				content: "";
				background-color: white;
				display: block;
				top: 0; left: 0;
				width: 100%;
				height: 110px;
				position: absolute;
				z-index: -1;
			}
		</style>
</head>
<body>
	<p><img src="../images/logo.png" style="background-color: #5889d7" /></p>
	<p style="margin-top: 40px">Wiadomość została wysłana.</p>
	<p style="font-weight: bold">Dziękujemy!</p>
</body>
</html>