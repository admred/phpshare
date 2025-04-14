<?php
$files=[];
$path=__DIR__."/../uploads";

$keyword=$_GET['q']??null;
$dh=opendir($path);
while ( $f=readdir($dh)) {
    if( $f[0] == '.' )  continue;
    if( $keyword && strpos($f,$keyword) === false ) continue;
    $realpath="$path/$f";
    $st=stat($realpath);
    array_push($files,[ 
        "name" => $f,
        "href" =>  "/uploads/".$f,
        "size" => $st['size'],
        "ctime" => date('c',$st["ctime"]),
        "type" => mime_content_type($realpath)
    ]);
}
closedir($dh);
echo json_encode($files);
?>
