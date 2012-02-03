<?
function get_languages()
{
	// get the languages
	//$a_languages = languages();
	$index = '';
	$complete = '';
	$found = false;// set to default value
	//prepare user language array
	$user_languages = array();

	//check to see if language is set
	if ( isset( $_SERVER["HTTP_ACCEPT_LANGUAGE"] ) )
	{
		$languages = strtolower( $_SERVER["HTTP_ACCEPT_LANGUAGE"] );
		// $languages = ' fr-ch;q=0.3, da, en-us;q=0.8, en;q=0.5, fr;q=0.3';
		// need to remove spaces from strings to avoid error
		$languages = str_replace( ' ', '', $languages );
		$languages = explode( ",", $languages );
		//$languages = explode( ",", $test);// this is for testing purposes only

		foreach ( $languages as $language_list )
		{
			// pull out the language, place languages into array of full and primary
			// string structure:
			$temp_array = array();
			// slice out the part before ; on first step, the part before - on second, place into array
			$temp_array[0] = substr( $language_list, 0, strcspn( $language_list, ';' ) );//full language
			$temp_array[1] = substr( $language_list, 0, 2 );// cut out primary language
			//place this array into main $user_languages language array
			$user_languages[] = $temp_array;
		}

		//start going through each one
		/*for ( $i = 0; $i < count( $user_languages ); $i++ )
		{
			foreach ( $a_languages as $index => $complete )
			{
				if ( $index == $user_languages[$i][0] )
				{
					// complete language, like english (canada)
					$user_languages[$i][2] = $complete;
					// extract working language, like english
					$user_languages[$i][3] = substr( $complete, 0, strcspn( $complete, ' (' ) );
				}
			}
		}*/
	}
	else// if no languages found
	{
		$user_languages[0] = array( '','','','' ); //return blank array.
	}
	// print_r($user_languages);
	// return parameters
		switch ( $user_languages[0][1] )// get default primary language, the first one in array that is
		{
			case 'pl':
				$location = 'pl';
				$found = true;
				break;
			case 'en':
				$location = 'en';
				$found = true;
				break;
			default:
				break;
		}
		if ( $found )
		{
			include('index.'.$location.'.html');
		}
		else// make sure you have a default page to send them to
		{
			include('index.en.html');
		}
}

if ($_COOKIE['language']==='pl') include('index.pl.html');
elseif ($_COOKIE['language']==='en') include('index.en.html');
else get_languages();
?>
