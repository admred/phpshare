<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <link rel="stylesheet" href="/css/styles.css"/>
    <link rel="stylesheet" href="/css/files.css"/>
    <title>Upload a File</title>
</head>
<body>
    <nav>
        <a class="button" href="/upload.php">
            Upload
        </a>
        <a class="button active" href="/list.php">
            Files
        </a>
        <a class="button" href="/search.html">
            Search
        </a>
    </nav>
    
    
    <form action="list.php" method="GET" class="sorter-bar">
        <select class="button" name="sort">
            <option value="1">Name</option>
            <option value="2">Date</option>
            <option value="3">Size</option>
            <option value="4">Type</option>
        </select>
        <select class="button" name="order">
            <option value="1">Descending</option>
            <option value="2">Ascending</option>
        </select>
        <input type="submit" class="button" value="Apply">
    </form>
    
    
    <main class="container">
        <ul class="u-list">
            <?php 
                $basedir=__DIR__.'/uploads/';
                function humanizeBytes($bytes, $decimals = 2) {
                    $size = array('B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');
                    $factor = floor((strlen($bytes) - 1) / 3);
                    return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor))." ".@$size[$factor];
                }
                /* You should already sanitize the filename when upload */
                function get_array_files() {
                    $ret=[];
                    global $basedir;
                    foreach(new DirectoryIterator($basedir) as $entity){
                        if( $entity->isDot() ) continue;
                        if( !$entity->isFile() ) continue;
                        $obj=[
                            'name'=>$entity->getFilename(),
                            'type'=>mime_content_type($basedir.$entity),
                            'size'=>humanizeBytes($entity->getSize()),
                            'bytes'=>$entity->getSize(),
                            'ctime'=>$entity->getCTime(),
                            'created'=>date('Y-m-d H:i:s',$entity->getCTime())
                        ];
                        array_push($ret,$obj);
                    }
                    return $ret;
                }
                function sort_array_files(&$arr,$sort='1',$order='1'){
                    switch($sort){
                        case '1':
                            usort($arr,function($x,$y){
                                global $order;
                                if( $order === '2' )
                                    [$x,$y]=[$y,$x];

                                return strcasecmp($x['name'],$y['name']);
                            });
                            break;
                        case '2':
                            usort($arr,function($x,$y){
                                global $order;
                                $_x=intval($x['ctime']);
                                $_y=intval($y['ctime']);
                                if( $order === '2' )
                                    [$_x,$_y]=[$_y,$_x];
                                    
                                return $_x - $_y ;
                            });
                            break;
                        case '3':
                            usort($arr,function($x,$y){
                                global $order;
                                $_x=intval($x['bytes']);
                                $_y=intval($y['bytes']);
                                if( $order === '2' )
                                    [$_x,$_y]=[$_y,$_x];
                                
                                return $_x - $_y ;
                            });
                            break;
                        case '4':
                            usort($arr,function($x,$y){
                                global $order;
                                if( $order === '2' )
                                    [$x,$y]=[$y,$x];

                                return strcasecmp($x['type'],$y['type']);
                            });
                            break;
                    }
                }

                $sort=$_GET['sort']??'1';
                $order=$_GET['order']??'1';
                $files=get_array_files();
                sort_array_files($files,$sort,$order);

                foreach($files as $f){
                    $name=$f['name'];
                    $size=$f['size'];
                    $created=$f['created'];
                    $type=$f['type'];
                    echo "<li>
                                <div class=\"title\">
                                    <a href=\"/uploads/$name\">$name</a>
                                </div>
                                <div class=\"meta\">
                                    <div class=\"size\">
                                        $size
                                    </div>
                                    <div class=\"created\">
                                        $created
                                    </div>
                                    <div class=\"type\">
                                        $type
                                    </div>
                                </div>
                        </li>";
            }?>
        </ul>
    </main>
</body>
</html>
