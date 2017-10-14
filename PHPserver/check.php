<?php
$key_file_name = "API_KEY.txt";

$cmd_base = "bitcoin-cli -testnet gettransaction ";
$error_key = "Invalid";

$key_file = fopen($key_file_name, "r") or die("Unable to open file! Server misconfigured.");
$key = fread($key_file, filesize($key_file_name));
fclose($key_file);

if( isset($_POST["key"]) and isset($_POST["txid"]) and
        $_POST["key"] === $key and preg_match( "/^[a-fA-F0-9]{65}$/", $_POST["txid"]) )
{
    $result = shell_exec($cmd_base + $_POST["txid"]);
    if( strpos($result, $error_key) == false )
        echo json_decode($result)->{'confirmations'};
}


?>