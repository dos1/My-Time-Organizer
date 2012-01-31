<?
setcookie('language',$_GET['id'],time()+60*60*24*365, '/');
header('Location: http://mytimeorganizer.com/');
?>
