<?php
require 'key_check.php';

$cmd_base = "bitcoin-cli -testnet gettransaction ";
$error_key = "Invalid";

if( isset($_POST["txid"]) and key_check() and preg_match( "/^[a-fA-F0-9]{65}$/", $_POST["txid"]) )
{
    $result = shell_exec($cmd_base + $_POST["txid"]);
    if( strpos($result, $error_key) == false )
        echo json_decode($result)->{'confirmations'};
}


?>