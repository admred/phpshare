<?php
    


function listFiles($path,$keyword=""){
    $files=[];

    $dh=opendir($path);
    while ( $f=readdir($dh)) {
        $ff=$path.$f;
        if( $f[0] == '.' )  continue;
        if( !empty($keyword) &&  strpos($f,$keyword) == false ) continue;
        $ff= $path.$f;
        $st=stat($ff);
        $desc=[ 
            "name" =>  $f,
            "href" =>   $ff,
            "size" => $st['size'],
            "ctime" => strftime('%Y-%m-%d %H:%M',$st["ctime"]),
            "type" => mime_content_type($ff)
            ] ; 
        array_push($files,$desc);
    }
    closedir($dh);
    return $files;
}

$keyword=""; // safe mode

if(isset($_GET['q']) ){
    $keyword=$_GET['q'];
}

$lista=listFiles("./uploads/",$keyword ) or null;

?>
