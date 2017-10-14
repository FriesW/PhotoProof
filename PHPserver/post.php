<?php
require 'OP_RETURN.php';
require 'key_check.php';

if( isset($_POST["data"]) and preg_match('/^[0-9a-fA-F]{64}$/', $data) and key_check() )
{
    $result = OP_RETURN_store($_POST["data"], $testnet);
    echo $result['txids'];
}

?>