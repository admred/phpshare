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
    
    <fieldset class="sorter-bar">
        <legend>Filter</legend>
        <form action="list.php" method="GET">
            <select id="sortby" name="sort">
                <option value="0" selected disabled>Sort By</option>
                <option value="1">Name</option>
                <option value="2">Date</option>
                <option value="3">Size</option>
                <option value="4">Type</option>
            </select>
            <select id="orderby" name="order">
                <option value="0" selected disabled>Order By</option>
                <option value="1">Ascending</option>
                <option value="2">Descending</option>
            </select>
            <input type="submit" value="Filter">
        </form>
    </fieldset>
    
    <main class="container">
        <ul class="u-list">
            <?php 
                function humanizeBytes($bytes, $decimals = 2) {
                    $size = array('B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');
                    $factor = floor((strlen($bytes) - 1) / 3);
                    return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor))." ".@$size[$factor];
                }
                /* You should already sanitize the filename when upload */
                $basedir=__DIR__.'/uploads/';
                foreach(new DirectoryIterator($basedir) as $name){
                    $fullpath=$basedir.$name;
                    if( $name->isDot() ) continue;
                    if( ! $name->isFile() ) continue;
                    $type=mime_content_type($fullpath);
                    $size=humanizeBytes($name->getSize());
                    
                    $ctime=date('Y-m-d H:i:s',$name->getCTime());
                    echo "<li>
                                <div class=\"title\">
                                    <a href=\"/uploads/$name\">$name</a>
                                </div>
                                <div class=\"meta\">
                                    <div class=\"size\">
                                        $size
                                    </div>
                                    <div class=\"created\">
                                        $ctime
                                    </div>
                                    <div class=\"type\">
                                        $type
                                    </div>
                                </div>
                        </li>";
            }?>
        </ul>
    </main>
    <script src=""></script>
</body>
</html>
