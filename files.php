<?php
    


function listFiles($path,$keyword){
    $files=[];

    $dh=opendir($path);
    while ( $f=readdir($dh)  ) {
        if( $f && $f[0] == '.' || strpos($f,".php") != false )  continue;  // filter garbage
        if( !empty($keyword)  &&  strpos($f,$keyword) === false ) continue;  // if keyword is not empty but do not match, drop it
        $st=stat($f);
        $desc=[ 
            "name" => $f , 
            "size" => $st['size'],
            "ctime" => strftime('%Y-%m-%d %H:%M',$st["ctime"]),
            "type" => mime_content_type($f)
            ] ;
        array_push($files,$desc);
    }
    unset($f);
    closedir($dh);
    return $files;
}

$keyword="";

if(isset($_GET['q']) ){
    $keyword=$_GET['q'];
}

$lista=listFiles(".",$keyword ) or null;

?>
