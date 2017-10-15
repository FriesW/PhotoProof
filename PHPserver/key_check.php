<?php
function key_check()
{
    $key_file_name = "API_KEY.txt";
    
    if( !isset($_POST["key"]) )
        return false;
    
    $key_file = fopen($key_file_name, "r") or die("Unable to open file! Server misconfigured.");
    $key = fread($key_file, filesize($key_file_name));
    fclose($key_file);
    
    $key = preg_replace('/\s+/', '', $key);
    
    $ext = preg_replace('/\s+/', '', $_POST["key"]);
    
    return $key === $ext;
    
}

?>