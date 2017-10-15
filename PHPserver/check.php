<?php
require 'OP_RETURN.php';
require 'key_check.php';


if( isset($_POST["txid"]) and key_check() and preg_match( "/^[a-fA-F0-9]{65}$/", $_POST["txid"]) )
{
    $result = OP_RETURN_bitcoin_cmd('gettransaction', true, $_POST["txid"]);
    if( array_key_exists("confirmations", $result) )
        echo $result['confirmations'];
    else
        echo "error"; //Response code?
}
else
{
    echo "error"; //Response code?
}


?>