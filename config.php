<?php


    try {
        $conn = new PDO('sqlite:logindb.db3');
    }catch(PDOException $e){
        echo $e->getMessage();
    }
?>