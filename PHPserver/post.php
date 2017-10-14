<?php
require 'OP_RETURN.php';
require 'key_check.php';

$log_file = "announce_log.txt";

function log_transaction($txid, $hash)
{
    file_put_contents($log_file, ''.time().' : '.$txid.' : '.$hash.PHP_EOL, FILE_APPEND | LOCK_EX);
}

if( isset($_POST["data"]) and preg_match('/^[0-9a-fA-F]{64}$/', $_POST["data"]) and key_check() )
{
    $result = OP_RETURN_store($_POST["data"], $testnet);
    log_transaction($result['txids'], $_POST["data"]);
    echo $result['txids'];
}

?>