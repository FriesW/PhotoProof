<?php
require 'OP_RETURN.php';
require 'key_check.php';

function log_transaction($result, $hash)
{
    //chmod 722 announce_log.txt
    $log_file = "announce_log.txt";
    $out = ''.time().' : '.$hash.' : ';
    if( array_key_exists('txids', $result) )
        $out = $out.'success : '.$result['txids'];
    else
        $out = $out.'error : '.$result['error'];
    file_put_contents($log_file, $out.PHP_EOL, FILE_APPEND | LOCK_EX);
}

if( isset($_POST["data"]) and preg_match('/^[0-9a-fA-F]{64}$/', $_POST["data"]) and key_check() )
{
    $result = OP_RETURN_store($_POST["data"], true);
    log_transaction($result, $_POST["data"]);
    if( array_key_exists('txids', $result) )
        echo $result['txids'];
    else
        echo "error"; //Respone code?
}
else
    echo "error"; //Respone code?

?>