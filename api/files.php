<?php
 declare(strict_types=1);

header('Content-Type: application/json');

if( $_SERVER['REQUEST_METHOD'] === 'POST' ){
   handle_post();
}else if($_SERVER['REQUEST_METHOD'] === 'GET' ){
    handle_get();
}else{
    http_response_code(405);
    echo json_encode([
        "status"=>"error",
        "message"=>"Method not allowed"
        ]);
}
exit(0);

function handle_post(){
    if( !isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK  ){
        http_response_code(400);
        echo json_encode([
                "status"  => "error",
                "code"    => 400,
                "message" => "Bad request",
                "errorMessage" => "Bad request"
                ]);
        
        return;
    }
    $file=$_FILES['file'];
    move_uploaded_file($file['tmp_name'],__DIR__."/../uploads/".htmlspecialchars($file['name']));

    http_response_code(201);
    echo json_encode([
            "status" => "success",
            "message"=> "Resource created",
            "code"   => 201,
            "data"   => [
                "name" => $file['name'],
                "size" => $file['size'],
                "path" => "/uploads/".$file['name']
            ]]);
}


function handle_get(){
    $files=[];
    $path=__DIR__."/../uploads";
    $keyword=$_GET['q']??null;
    $

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
}
?>