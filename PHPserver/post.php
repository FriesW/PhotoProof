<?php
$key_file_name = "API_KEY.txt";

require 'OP_RETURN.php';

$key_file = fopen($key_file_name, "r") or die("Unable to open file! Server misconfigured.");
$key = fread($key_file, filesize($key_file_name));
fclose($key_file);

if( isset($_POST["key"]) and isset($_POST["data"]) and $_POST["key"] === $key )
{
    $result = OP_RETURN_store($_POST["data"], $testnet);
    echo $result['txids'];
}

?>